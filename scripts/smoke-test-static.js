// Smoke tests over generated HTML. Keep quality checks independent of the React runtime.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const cases = [
  { path: 'index.html', required: ['共通テスト', '年度別・教科別'] },
  { path: 'sources/index.html', required: ['設問別分析', 'www.dnc.ac.jp', '問題・解答・音源の出典'] },
  { path: 'common-test-2026-analysis/index.html', required: ['23科目', '大問', '国語', '地学', '数学Ⅰ'] },
  { path: 'test/2026_国語_本試験問題_訂正付.pdf/index.html', required: ['国語', '45.68', '160点以上', '2025'] },
  { path: 'test/2020_国語_本試験問題.pdf/index.html', required: ['同じ科目・試験制度の前後年度比較', '2019年度', 'センター試験'] },
  { path: 'test/1985_国語_本試験問題.pdf/index.html', required: ['同じ科目・試験制度の前後年度比較', '共通第一次学力試験'] },
  { path: 'test/2025_国語_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '66.74', '57.42'] },
  { path: 'test/2025_数学IA_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '62.06', '58.54'] },
  { path: 'test/2026_数学IA_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '20.29', '21.65'] },
  { path: 'test/2026_数学IIBC_本試験問題.pdf/index.html', required: ['116点', '選択', '第5問', '36.95'] },
  { path: 'test/2025_数学IIBC_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '36.95', '選択大問'] },
  { path: 'test/2025_物理_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '52.59'] },
  { path: 'test/2025_生物_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '34.53', '配点'] },
  { path: 'test/2026_物理_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '22.60'] },
  { path: 'test/2026_物理基礎_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '32.25'] },
  { path: 'test/2025_情報I_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '76.11'] },
  { path: 'test/2026_情報I_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '24.94'] },
  { path: 'test/2025_英語L_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '85.00'] },
  { path: 'test/2025_英語R_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '41.59'] },
  { path: 'test/2025_地理総合地理探究_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '67.63', 'インド洋'] },
  { path: 'test/2025_地理総合_本試験問題.pdf/index.html', required: ['2025年度・大問別の出題内容', '東三河', '食品ロス'] },
  { path: 'test/2025_歴史総合_本試験問題.pdf/index.html', required: ['2025年度・大問別の出題内容', '装いの歴史', '歴史上の境界'] },
  { path: 'test/2025_公共_本試験問題.pdf/index.html', required: ['2025年度・大問別の出題内容', '男女共同参画', '為替'] },
  { path: 'test/2025_歴史総合世界史探究_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '76.16'] },
  { path: 'test/2025_公共政治経済_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '70.72'] },
  { path: 'test/2026_英語R_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '14.61'] },
  { path: 'test/2026_地学_本試験問題.pdf/index.html', required: ['地球の変遷', '40.07', '大問'] },
  { path: 'test/2026_地理総合_本試験問題.pdf/index.html', required: ['地理総合', '50点', '得点率'] },
  { path: 'test/2026_公共_本試験問題.pdf/index.html', required: ['公共', '社会保障', '50点'] },
  { path: 'test/2026_歴史総合日本史探究_本試験問題.pdf/index.html', required: ['80点以上', '17.79', '78点'] },
  { path: 'test/2026_地理総合地理探究_本試験問題.pdf/index.html', required: ['80点以上', '13.51', '76点'] },
  { path: 'test/2026_公共政治経済_本試験問題.pdf/index.html', required: ['80点以上', '20.38', '80点'] },
  { path: 'test/2026_ドイツ語_本試験問題.pdf/index.html', required: ['第4問', '金継ぎ', '問題評価'] },
  { path: 'test/2026_フランス語_本試験問題.pdf/index.html', required: ['第7問', '市民農園', '問題評価'] },
  { path: 'test/2026_中国語_本試験問題.pdf/index.html', required: ['第5問', 'フィンランド', '問題評価'] },
  { path: 'test/2026_韓国語_本試験問題.pdf/index.html', required: ['第4問', '気候美食', '問題評価'] },
];
const errors = [];
let checked = 0;
for (const target of cases) {
  const filepath = join(dist, target.path);
  if (!existsSync(filepath)) { errors.push('Missing page ' + target.path); continue; }
  const html = readFileSync(filepath, 'utf8');
  checked++;
  for (const phrase of target.required) {
    if (!html.includes(phrase)) errors.push(target.path + ': missing ' + phrase);
  }
}
// All 2026 main-exam subjects must have substantive, crawler-visible editorial content.
const tsvSource = readFileSync(join(root, 'src/app/data/testDatabase.ts'), 'utf8');
const tsvBlock = tsvSource.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
if (!tsvBlock) throw new Error('Database TSV unavailable');
const main2026 = tsvBlock[1].split('\n').map(line => line.split('\t'))
  .filter(row => row[0] === '2026' && row[1] === 'main');
const qualitative = new Set(['ドイツ語','フランス語','中国語','韓国語']);
if (main2026.length !== 27) errors.push('Unexpected 2026 main-exam count: ' + main2026.length);
let examined2026 = 0;
for (const record of main2026) {
  const subject = record[2];
  const file = join(dist, 'test', record[3], 'index.html');
  if (!existsSync(file)) { errors.push('Missing 2026 main-exam HTML: ' + subject); continue; }
  examined2026++;
  const html = readFileSync(file, 'utf8');
  const expected = qualitative.has(subject) ? '本試験の出題内容と問題評価' : '本試験の大問別得点率・正答率';
  if (!html.includes(expected)) errors.push(subject + ': generated HTML lacks verified analysis (' + expected + ')');
  if (!html.includes('試験情報')) errors.push(subject + ': generated HTML lacks exam metadata');
}
console.log('Exam analysis pages checked:', examined2026, '/', main2026.length);
const sitemap = join(root, 'public/sitemap.xml');
if (existsSync(sitemap)) {
  const xml = readFileSync(sitemap, 'utf8');
  for (const phrase of ['/common-test-2026-analysis', '/sources', '/common-test-changes', '/test/2026_']) {
    if (!xml.includes(phrase)) errors.push('sitemap lacks ' + phrase);
  }
} else {
  errors.push('sitemap.xml was not generated');
}
console.log(JSON.stringify({ pagesChecked: checked, tests: cases.length, errors }, null, 2));
if (errors.length) process.exitCode = 1;
