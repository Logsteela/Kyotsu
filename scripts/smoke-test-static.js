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
  { path: 'test/2025_国語_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '66.74', '57.42'] },
  { path: 'test/2025_数学IA_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '62.06', '58.54'] },
  { path: 'test/2026_数学IA_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '20.29', '21.65'] },
  { path: 'test/2026_数学IIBC_本試験問題.pdf/index.html', required: ['116点', '選択', '第5問', '36.95'] },
  { path: 'test/2025_数学IIBC_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '36.95', '選択大問'] },
  { path: 'test/2026_地学_本試験問題.pdf/index.html', required: ['地球の変遷', '40.07', '大問'] },
  { path: 'test/2026_地理総合_本試験問題.pdf/index.html', required: ['地理総合', '50点', '得点率'] },
  { path: 'test/2026_公共_本試験問題.pdf/index.html', required: ['公共', '社会保障', '50点'] },
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
