import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = readFileSync(join(ROOT, 'src/app/data/testDatabase.ts'), 'utf8');
const detailSource = readFileSync(join(ROOT, 'src/app/data/testDetailsDatabase.ts'), 'utf8');
const manifest = new Set(JSON.parse(readFileSync(join(ROOT, 'src/app/data/pdfManifest.json'), 'utf8')).files);

const block = source.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
if (!block) throw new Error('DATABASE_TSVが見つかりません。');
const rows = block[1].trim().split('\n').map(line => line.split('\t'));
const details = new Map();
const regex = /'([^'\n]+\.pdf)':\{questionPdf:'[^'\n]*'([^\n]*)/g;
let m;
while ((m = regex.exec(detailSource)) !== null) {
  const properties = m[2];
  const getNum = key => {
    const found = properties.match(new RegExp('(?:^|,)' + key + ':([0-9.]+)(?:,|$)'));
    return found ? Number(found[1]) : null;
  };
  details.set(m[1], {
    average: getNum('averageScore'),
    maximum: getNum('totalScore'),
    highest: getNum('highestScore'),
    lowest: getNum('lowestScore'),
    hasSource: /(?:問題|解答|音源)：/.test(properties),
  });
}
const errors = [];
const warnings = [];
const seen = new Set();
let withStats = 0, withSource = 0, questionManifest = 0, answerManifest = 0;
for (const [index, row] of rows.entries()) {
  if (row.length !== 7) {
    errors.push({ index: index + 1, type: 'column-count', row });
    continue;
  }
  const [year, type, subject, question, answer, audio, state] = row;
  if (!year || !subject || !question || !['main', 'makeup'].includes(type) || !['1', '2', '3'].includes(state)) {
    errors.push({ index: index + 1, type: 'invalid-record', question });
  }
  if (seen.has(question)) warnings.push({ type: 'duplicate-question', question });
  seen.add(question);
  const info = details.get(question);
  if (!info) warnings.push({ type: 'no-details', question });
  else {
    if (info.hasSource) withSource++;
    if (info.average !== null && info.maximum !== null && info.maximum > 0) {
      withStats++;
      if (info.average < 0 || info.average > info.maximum) errors.push({ type: 'average-outside-score-range', question });
    }
    if (info.maximum !== null && info.highest !== null && info.highest > info.maximum)
      errors.push({ type: 'highest-outside-score-range', question });
    if (info.lowest !== null && info.highest !== null && info.lowest > info.highest)
      errors.push({ type: 'lowest-above-highest', question });
  }
  if (manifest.has(question)) questionManifest++;
  else warnings.push({ type: 'question-not-in-local-manifest', question });
  if (answer) {
    if (manifest.has(answer)) answerManifest++;
    else warnings.push({ type: 'answer-not-in-local-manifest', answer });
  }
}
const summary = { records: rows.length, uniqueQuestions: seen.size, detailsRecords: details.size,
  statsRecords: withStats, sourceRecords: withSource,
  questionsListedInManifest: questionManifest, answersListedInManifest: answerManifest,
  errors: errors.length, warnings: warnings.length };
if (process.argv.includes('--json')) console.log(JSON.stringify({ summary, errors, warnings }, null, 2));
else {
  console.log('収録データ監査:', JSON.stringify(summary, null, 2));
  console.log('警告例（先頭20件）:', JSON.stringify(warnings.slice(0, 20), null, 2));
  console.log('注意：内部台帳との一致は公開URLの疎通・資料の正確性・転載権限の検証ではありません。');
}
if (errors.length) process.exitCode = 1;
