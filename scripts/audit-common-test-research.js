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
const count2026 = rows.filter(r => r[0] === '2026' && r[1] === 'main').length;
if (count2026 !== report.length + Object.keys(foreign).length)
  problems.push('2026 subject analysis coverage incomplete: ' +
    (report.length + Object.keys(foreign).length) + '/' + count2026);
const message = {
  tested: report.length,
  available: count2026,
  unmatched: count2026 - report.length - Object.keys(foreign).length,
  qualitativeForeignLanguages: Object.keys(foreign).length,
  weightedMeansConfirmed: report.filter(r=>!r.optional).length,
  yearOnYearVerified,
  optionalMeansNotAdditive: report.filter(r=>r.optional).map(r=>r.subject),
  errors: problems,
};
console.log('Common Test 2026 research audit:', JSON.stringify(message, null, 2));
if (problems.length) process.exitCode = 1;
