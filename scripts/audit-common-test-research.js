// Validate that the 2026 research table remains consistent with the exam database.
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const base = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(join(base, path), 'utf8');
const dataText = read('src/app/data/commonTest2026Research.ts');
const marker = 'COMMON_TEST_2026_RESEARCH: Record<string, MainExamResearch> = ';
const pos = dataText.indexOf(marker);
if (pos < 0) throw new Error('research data marker missing');
const research = JSON.parse(dataText.slice(pos + marker.length).trim().replace(/;$/, ''));

const db = read('src/app/data/testDatabase.ts');
const tsv = db.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
if (!tsv) throw new Error('test database TSV not found');
const rows = tsv[1].trim().split('\n').map(line => line.split('\t'));
const details = read('src/app/data/testDetailsDatabase.ts');
const report = [];
const problems = [];
const exceptions = new Set(['数学Ⅱ，数学Ｂ，数学Ｃ']); // 4 optional sections, choose 3; published totals are not additive.
for (const [subject, entry] of Object.entries(research)) {
  if (!entry.parts?.length || !entry.observation?.trim()) {
    problems.push(subject + ': missing question-groups or original observations');
    continue;
  }
  const available = rows.filter(r => r[0] === '2026' && r[1] === 'main' && r[2] === subject);
  if (available.length !== 1) {
    problems.push(subject + ': unique 2026 main-exam record missing (' + available.length + ')');
    continue;
  }
  const pdf = available[0][3];
  const at = details.indexOf("'" + pdf + "':{");
  if (at < 0) { problems.push(subject + ': score details missing'); continue; }
  const row = details.slice(at, details.indexOf('\n', at));
  const mean = Number(row.match(/averageScore:([0-9.]+)/)?.[1]);
  const maximum = Number(row.match(/totalScore:([0-9.]+)/)?.[1]);
  if (!Number.isFinite(mean) || !(maximum > 0)) {
    problems.push(subject + ': average/max unavailable');
    continue;
  }
  let weighted = 0, assigned = 0;
  const seen = new Set();
  for (const part of entry.parts) {
    if (!Number.isInteger(part.number) || seen.has(part.number)) problems.push(subject + ': duplicate/noninteger question number');
    seen.add(part.number);
    if (!(part.points > 0) || !Number.isFinite(part.points) ||
        !(part.scoreRate >= 0 && part.scoreRate <= 100) || !Number.isFinite(part.scoreRate) ||
        (part.correctRate !== null && (!(part.correctRate >= 0 && part.correctRate <= 100) || !Number.isFinite(part.correctRate))) ||
        !part.topic?.trim()) problems.push(subject + ': invalid group ' + part.number);
    weighted += part.points * part.scoreRate / 100;
    assigned += part.points;
  }
  const optional = exceptions.has(subject);
  if (!optional && assigned !== maximum) problems.push(subject + ': assigned points ' + assigned + ' != exam max ' + maximum);
  if (!optional && Math.abs(weighted - mean) > 0.06)
    problems.push(subject + ': weighted average ' + weighted.toFixed(3) + ' != declared ' + mean);
  if (optional && assigned <= maximum) problems.push(subject + ': expected optional sections but assigned <= max');
  report.push({ subject, groups: entry.parts.length, points: assigned, mean, reconstructed: Number(weighted.toFixed(2)), optional });
}
const priorText = read('src/app/data/commonTest2025GroupComparison.ts');
const priorMarker = 'COMMON_TEST_GROUP_COMPARISONS: Record<string, GroupComparison> = ';
const priorPos = priorText.indexOf(priorMarker);
if (priorPos < 0) throw new Error('prior-year research data missing');
const previousResearch = JSON.parse(priorText.slice(priorPos + priorMarker.length).trim().replace(/;$/, ''));
let yearOnYearVerified = 0;
for (const [subject, entry] of Object.entries(previousResearch)) {
  const priorRecord = rows.filter(r=>r[0]==='2025' && r[1]==='main' && r[2]===subject);
  const currentResearch = research[subject];
  if (priorRecord.length !== 1 || !currentResearch) {
    problems.push(subject + ': unavailable unique baseline record or current research');
    continue;
  }
  const at = details.indexOf("'" + priorRecord[0][3] + "':{");
  if (at < 0) { problems.push(subject + ': baseline average not found'); continue; }
  const line = details.slice(at, details.indexOf('\n', at));
  const mean = Number(line.match(/averageScore:([0-9.]+)/)?.[1]);
  const maximum = Number(line.match(/totalScore:([0-9.]+)/)?.[1]);
  const points = entry.groups.reduce((sum,g)=>sum+g.points,0);
  const weighted = entry.groups.reduce((sum,g)=>sum+g.points*g.previousRate/100,0);
  if (!(maximum>0) || (!entry.nonAdditive && (points!==maximum || (!entry.mixedCurriculum && Math.abs(weighted-mean)>0.06))) || (entry.nonAdditive && points<=maximum) || !Number.isFinite(mean)) {
    problems.push(subject + ': previous-year group sum does not match published mean: '+weighted.toFixed(3)+' vs '+mean);
  }
  for(const g of entry.groups) {
    const now=currentResearch.parts.find(p=>p.number===g.number && p.points===g.points);
    if (!now && !entry.nonComparable) problems.push(subject + ': counterpart for question '+g.number+' missing');
  }
  yearOnYearVerified++;
}
const foreignSource = read('src/app/data/commonTest2026ForeignLanguages.ts');
const foreignMarker = 'COMMON_TEST_2026_FOREIGN_LANGUAGES: Record<string, ForeignLanguageAnalysis> = ';
const foreignAt = foreignSource.indexOf(foreignMarker);
if (foreignAt < 0) throw new Error('Foreign language research missing');
const foreign = JSON.parse(foreignSource.slice(foreignAt + foreignMarker.length).trim().replace(/;$/, ''));
for (const [subject, report] of Object.entries(foreign)) {
  const row = rows.filter(r => r[0] === '2026' && r[1] === 'main' && r[2] === subject);
  if (row.length !== 1 || research[subject] || !report.sections?.length ||
      !report.observation?.trim() || !report.specific?.trim() || !report.caution?.trim()) {
    problems.push(subject + ': foreign evaluation incomplete or not unique');
  }
  const numbers = report.sections.map(x=>x.number);
  if (numbers.some((n,i)=>n!==i+1) || report.sections.some(x=>!x.topic?.trim()||!x.summary?.trim()))
    problems.push(subject+': malformed qualitative question-group data');
}
const socialFile = read('src/app/data/commonTest2025SocialAreas.ts');
const socialMarker = 'COMMON_TEST_2025_SOCIAL_AREAS: Record<string,SocialAreaReview> = ';
const socialAt = socialFile.indexOf(socialMarker);
if (socialAt < 0) throw new Error('Missing 2025 social review data');
const social2025 = JSON.parse(socialFile.slice(socialAt + socialMarker.length).trim().replace(/;$/, ''));
for (const [subject, value] of Object.entries(social2025)) {
  const refs=rows.filter(r=>r[0]==='2025'&&r[1]==='main'&&r[2]===subject);
  const pts=value.groups.reduce((n,p)=>n+p.points,0);
  if(refs.length!==1 || pts!==50 || !value.observation || !value.caution ||
    value.groups.some((g,i)=>g.number!==i+1||!g.topic||!g.summary)) {
    problems.push(subject+': invalid 2025 combined social review');
  }
}
const foreign2025Text = read('src/app/data/commonTest2025ForeignLanguages.ts');
const foreign2025Marker = 'COMMON_TEST_2025_FOREIGN_LANGUAGES: Record<string, ForeignLanguageAnalysis> = ';
const f2025At = foreign2025Text.indexOf(foreign2025Marker);
if (f2025At < 0) throw new Error('2025 foreign-language research data missing');
const foreign2025 = JSON.parse(foreign2025Text.slice(f2025At + foreign2025Marker.length).trim().replace(/;$/, ''));
for (const [subject, value] of Object.entries(foreign2025)) {
  const matched = rows.filter(r => r[0] === '2025' && r[1] === 'main' && r[2] === subject);
  if (matched.length !== 1 || previousResearch[subject] || social2025[subject] ||
      !value.sections?.length || !value.observation?.trim() || !value.specific?.trim() || !value.caution?.trim() ||
      value.sections.some((p,i)=>p.number!==i+1 || !p.topic?.trim() || !p.summary?.trim()))
    problems.push(subject + ': invalid 2025 foreign-language review');
}
const covered2025 = Object.keys(previousResearch).length + Object.keys(social2025).length + Object.keys(foreign2025).length;
if (covered2025 !== 27) problems.push('2025 subject analysis incomplete: ' + covered2025 + '/27');
const count2026 = rows.filter(r => r[0] === '2026' && r[1] === 'main').length;
if (count2026 !== report.length + Object.keys(foreign).length)
  problems.push('2026 subject analysis coverage incomplete: ' +
    (report.length + Object.keys(foreign).length) + '/' + count2026);
// Keep company assessments attached to genuine 2026 subjects and numbered sections.
const schoolText = read('src/app/data/commonTest2026SchoolReviews.ts');
function schoolData(marker, next) {
  const i = schoolText.indexOf(marker);
  if (i < 0) throw new Error('School review table not found: ' + marker);
  const from = i + marker.length;
  const end = next ? schoolText.indexOf(next, from) : schoolText.length;
  if (end < 0) throw new Error('School review block has no delimiter');
  return JSON.parse(schoolText.slice(from,end).trim().replace(/;$/, ''));
}
const school = schoolData(
  'COMMON_TEST_2026_SCHOOL_DIFFICULTY: Record<string, RelativeSchoolAssessment[]> = ',
  '\nexport const COMMON_TEST_2026_ZKAI_SECTIONS',
);
const zkai = schoolData(
  'COMMON_TEST_2026_ZKAI_SECTIONS: Record<string, SectionSchoolAssessment> = ',
  null,
);
const subjects2026 = rows.filter(x=>x[0]==='2026' && x[1]==='main' &&
  !['ドイツ語','フランス語','中国語','韓国語'].includes(x[2])).map(x=>x[2]);
if (subjects2026.length !== 23) problems.push('2026 regular exam subject count: ' + subjects2026.length);
for (const subject of subjects2026) {
  const opinions = school[subject];
  if (!Array.isArray(opinions) || opinions.filter(x=>x.school==='東進').length!==1)
    problems.push(subject+': missing/duplicate Toshin review');
  if (opinions?.some(x=>!['東進','河合塾'].includes(x.school) || !x.rating ||
    !/^https:\/\//.test(x.source))) problems.push(subject+': invalid school assessment');
}
for (const subject of Object.keys(school)) {
  if (!subjects2026.includes(subject)) problems.push(subject+': review without 2026 main exam');
}
const validRatings = new Set(['易','やや易','標準','やや難','難']);
let ratedSections = 0;
for (const [subject, entry] of Object.entries(zkai)) {
  const actual = research[subject]?.parts;
  if (!actual || entry.ratings?.length !== actual.length ||
      entry.ratings.some(x=>!validRatings.has(x)) ||
      !Array.isArray(entry.notes) || entry.notes.length<1 ||
      !/^https:\/\/www\.zkai\.co\.jp\//.test(entry.source)) {
    problems.push(subject+': Z-kai groups/source do not match recorded large questions');
  } else ratedSections += actual.length;
}
if (Object.keys(zkai).length !== 14 || ratedSections !== 70) {
  problems.push('Z-kai group census changed: '+Object.keys(zkai).length+' subjects / '+ratedSections+' groups');
}
// 2025 school assessments must match the measured 2025 question-group tables.
const schoolText2025 = read('src/app/data/commonTest2025SchoolReviews.ts');
const schoolMarker2025 = 'COMMON_TEST_2025_ZKAI_SECTIONS: Record<string, SectionSchoolAssessment> = ';
const schoolPos2025 = schoolText2025.indexOf(schoolMarker2025);
if (schoolPos2025 < 0) throw new Error('2025 school reviews missing');
const zkai2025 = JSON.parse(schoolText2025.slice(schoolPos2025+schoolMarker2025.length).trim().replace(/;$/, ''));
let ratedSections2025 = 0;
for (const [subject, entry] of Object.entries(zkai2025)) {
  const actual = previousResearch[subject]?.groups;
  if (!actual || entry.ratings?.length !== actual.length ||
      entry.ratings.some(r => !validRatings.has(r) && r !== '標準／やや難（A／B）') ||
      !entry.notes?.length ||
      !/^https:\/\/www\.zkai\.co\.jp\//.test(entry.source)) {
    problems.push(subject + ': 2025 Z-kai rating/source mismatch');
  } else ratedSections2025 += entry.ratings.length;
}
if (Object.keys(zkai2025).length !== 14 || ratedSections2025 !== 70) {
  problems.push('2025 Z-kai sections incorrect: '+Object.keys(zkai2025).length+' subjects/'+ratedSections2025);
}
const message = {
  tested: report.length,
  available: count2026,
  unmatched: count2026 - report.length - Object.keys(foreign).length,
  qualitativeForeignLanguages: Object.keys(foreign).length,
  analyzed2025: covered2025,
  qualitative2025ForeignLanguages: Object.keys(foreign2025).length,
  weightedMeansConfirmed: report.filter(r=>!r.optional).length,
  yearOnYearVerified,
  optionalMeansNotAdditive: report.filter(r=>r.optional).map(r=>r.subject),
  schoolOpinions: Object.values(school).reduce((n,a)=>n+a.length,0),
  zkaiRatedSections: ratedSections,
  zkaiRatedSections2025: ratedSections2025,
  errors: problems,
};
console.log('Common Test 2026 research audit:', JSON.stringify(message, null, 2));
if (problems.length) process.exitCode = 1;
