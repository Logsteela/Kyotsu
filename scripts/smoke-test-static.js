// Smoke tests over generated HTML. Keep quality checks independent of the React runtime.
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const cases = [
  { path: 'index.html', required: ['共通テストの大問別得点率・年度比較', '大問別得点率・正答率', '23.79', '31.67', '/common-test-2026-analysis', '/common-test-2025-analysis'] },
  { path: 'sources/index.html', required: ['設問別分析', 'www.dnc.ac.jp', '問題・解答・音源の出典'] },
  { path: 'contact/index.html', required: ['loading_0318','github.com/Logsteela/Kyotsu/issues/new','年度'] },
  { path: 'terms/index.html', required: ['免責事項','得点率','お問い合わせ'] },
  { path: 'common-test-2026-analysis/index.html', required: ['23科目', '大問', '国語', '地学', '数学Ⅰ'] },
  { path: 'test/2026_国語_本試験問題_訂正付.pdf/index.html', required: ['国語', '45.68', '160点以上', '2025', '大問別得点率・出題分析と問題PDF', '東進：難化', 'Ｚ会難度'] },
  { path: 'test/2025_国語_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '66.74', '57.42', 'Ｚ会難度'] },
  { path: 'test/2025_数学IA_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '62.06', '58.54'] },
  { path: 'test/2026_数学IA_本試験問題.pdf/index.html', required: ['2025年度との大問別得点率比較', '20.29', '21.65'] },
  { path: 'test/2026_数学IIBC_本試験問題.pdf/index.html', required: ['116点', '選択', '第5問', '36.95'] },
  { path: 'test/2025_数学IIBC_本試験問題.pdf/index.html', required: ['2025年度本試験・大問別', '36.95', '選択問題'] },
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
  { path: 'test/2025_ドイツ語_本試験問題.pdf/index.html', required: ['問題評価', '水と人体', '色彩象徴'] },
  { path: 'test/2025_フランス語_本試験問題.pdf/index.html', required: ['問題評価', 'リエゾン', '語句整序'] },
  { path: 'test/2025_中国語_本試験問題.pdf/index.html', required: ['問題評価', '森林', '祖父'] },
  { path: 'test/2025_韓国語_本試験問題.pdf/index.html', required: ['問題評価', 'ラジオ', '観光'] },
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
  const expected = qualitative.has(subject) ? '本試験の出題・問題評価' : '本試験の大問別得点率・正答率';
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
// Publication readiness: every footer link must lead to a generated page.
const rootSource = readFileSync(join(root, 'src/app/pages/Root.tsx'), 'utf8');
const footer = rootSource.split('<footer')[1]?.split('</footer>')[0] ?? '';
const footerRoutes = [...footer.matchAll(/<Link to="(\/[^"]+)"/g)].map(m => m[1]);
if (footerRoutes.length < 8) errors.push('Footer links could not be checked');
for (const route of footerRoutes) {
  const htmlPath = join(dist, route.slice(1), 'index.html');
  if (!existsSync(htmlPath)) errors.push('Broken footer navigation: ' + route);
}
const detailSource = readFileSync(join(root, 'src/app/pages/TestDetailPage.tsx'), 'utf8');
const newerIndex = detailSource.indexOf('if (newer) related.push(');
const olderIndex = detailSource.indexOf('if (older) related.push(');
if (newerIndex < 0 || olderIndex < 0 || newerIndex >= olderIndex) {
  errors.push('Same-subject navigation must show next year on left and previous year on right');
}
// A thin archive/navigation page must not load AdSense scripts.
// These pages still remain indexable and keep their primary PDF links.
const withAds = [
  'index.html',
  'common-test-2026-analysis/index.html',
  'common-test-2025-analysis/index.html',
  'test/2026_国語_本試験問題_訂正付.pdf/index.html',
];
const withoutAds = [
  'overview/index.html', 'archives/index.html', 'privacy/index.html', 'contact/index.html', 'terms/index.html',
  'year/2026/index.html', 'subject/kokugo/index.html',
  'test/2026_国語_追試験問題.pdf/index.html',
];
for (const path of withAds) {
  const file = join(dist, path);
  if (!existsSync(file)) { errors.push('AdSense eligible HTML missing: '+path); continue; }
  if (!readFileSync(file, 'utf8').includes('adsbygoogle.js')) errors.push('AdSense code missing on editorial page: '+path);
}
for (const path of withoutAds) {
  const file = join(dist, path);
  if (!existsSync(file)) { errors.push('Unmonetized archive HTML missing: '+path); continue; }
  if (readFileSync(file, 'utf8').includes('adsbygoogle.js')) errors.push('AdSense code found on unreviewed archive/navigation page: '+path);
}
// Reject generic filler previously duplicated across thousands of exam pages.
for (const route of ['index.html','common-test-2026-analysis/index.html',
    'test/2026_国語_本試験問題_訂正付.pdf/index.html',
    'test/2026_物理_本試験問題.pdf/index.html']) {
  const html = readFileSync(join(dist, route), 'utf8');
  for (const phrase of [
    '数値はサイトの試験情報データベースに基づきます',
    '（問題の難しさを数値化した値ではありません）',
    '実際の受験者の成績から、大問の得点率と正答率を比較しました',
    '得点率だけで難易度を判断するものではありません',
  ]) {
    if (html.includes(phrase)) errors.push(route + ': redundant explanation remains: ' + phrase);
  }
}

// The publication scope is 2021+ Common Test records only. Keep these URLs
// inaccessible even when the legacy source records and archive lists remain.
const noLongerPublished = [
  'test/2020_国語_本試験問題.pdf/index.html',
  'test/1985_国語_本試験問題.pdf/index.html',
  'test/2011_国語_追試験問題.pdf/index.html',
  'test/2025_公共_試作問題.pdf/index.html',
];
for (const oldPath of noLongerPublished) {
  if (existsSync(join(dist, oldPath))) errors.push('Non-Common Test detail HTML still published: ' + oldPath);
}
const xml = readFileSync(join(root,'public/sitemap.xml'),'utf8');
for (const oldPrefix of ['test/2020_', 'test/1985_', 'test/2011_', 'test/2025_%E5%85%AC%E5%85%B1_%E8%A9%A6%E4%BD%9C']) {
  if (xml.includes(oldPrefix)) errors.push('Closed individual page in sitemap: ' + oldPrefix);
}
const archiveHtml = readFileSync(join(dist, 'year/2020/index.html'),'utf8');
if (archiveHtml.includes('href="/test/2020_')) errors.push('Old center-test archive still links to individual pages');
const commonYearHtml = readFileSync(join(dist, 'year/2026/index.html'),'utf8');
if (!commonYearHtml.includes('href="/test/2026_')) errors.push('Common Test archive lost individual page links');

// Check server-side Cloudflare route guard independently of the React bundle.
const { onRequest: guardTestDetail } = await import('../functions/test/[[path]].js');
const runGuard = async (pathname) => guardTestDetail({
  request: new Request('https://kyotsu.org' + pathname),
  next: () => new Response(null, { status: 204 }),
});
for (const pdf of [
  '2020_国語_本試験問題.pdf',
  '1985_国語_本試験問題.pdf',
  '2025_公共_試作問題.pdf',
  'does-not-exist.pdf',
]) {
  const blocked = await runGuard('/test/' + encodeURIComponent(pdf) + '/');
  if (blocked.status !== 404 || !blocked.headers.get('X-Robots-Tag')?.includes('noindex')) {
    errors.push('Cloudflare guard did not 404 blocked PDF detail: ' + pdf);
  }
}
for (const pdf of ['2021_国語_本試験問題.pdf','2026_国語_本試験問題_訂正付.pdf']) {
  const allowed = await runGuard('/test/' + encodeURIComponent(pdf) + '/');
  if (allowed.status !== 204) errors.push('Cloudflare guard rejected Common Test detail: ' + pdf);
}

// Prep-school labels must be bound to the correct year, question count and source.
const prepSource = readFileSync(join(root, 'src/app/data/prepSchoolEvaluations.ts'), 'utf8');
const prepMarker = 'PREP_SCHOOL_EVALUATIONS: Record<string, Record<string, PrepSchoolReview>> = ';
const prep = JSON.parse(prepSource.split(prepMarker)[1].trim().replace(/;$/, ''));
const researchSource = readFileSync(join(root, 'src/app/data/commonTest2026Research.ts'), 'utf8');
const researchMarker = 'COMMON_TEST_2026_RESEARCH: Record<string, MainExamResearch> = ';
const research = JSON.parse(researchSource.split(researchMarker)[1].trim().replace(/;$/, ''));
const oldSource = readFileSync(join(root, 'src/app/data/commonTest2025GroupComparison.ts'), 'utf8');
const oldMarker = 'COMMON_TEST_GROUP_COMPARISONS: Record<string, GroupComparison> = ';
const old = JSON.parse(oldSource.split(oldMarker)[1].trim().replace(/;$/, ''));
for(const [year, subjects] of Object.entries(prep)) {
  for(const [subject, rating] of Object.entries(subjects)) {
    if(rating.zkai) {
      const groups = year === '2026' ? research[subject]?.parts : old[subject]?.groups;
      if(!groups || groups.length!==rating.zkai.length)
        errors.push('Prep-school question count mismatch: '+year+' '+subject);
      if(!rating.zkaiUrl?.startsWith('https://www.zkai.co.jp/kyotsu-test/'))
        errors.push('Unverified prep-school source format: '+year+' '+subject);
    }
  }
}
if(Object.values(prep['2026']).filter(x=>x.zkai).length!==14 ||
   Object.values(prep['2025']).filter(x=>x.zkai).length!==14 ||
   Object.values(prep['2026']).filter(x=>x.toshin).length!==23)
  errors.push('Unexpected prep-school coverage.');

// AdSense readiness: ownership code, ads.txt and sitemap directives must agree.
const publicAds = readFileSync(join(root, 'public/ads.txt'), 'utf8');
const siteIndex = readFileSync(join(root, 'index.html'), 'utf8');
const robots = readFileSync(join(root, 'public/robots.txt'), 'utf8');
if (!publicAds.includes('google.com, pub-6347877335585085, DIRECT')) errors.push('AdSense ads.txt publisher mismatch');
if (!siteIndex.includes('ca-pub-6347877335585085')) errors.push('AdSense head verification script absent');
if (!robots.includes('Sitemap: https://kyotsu.org/sitemap.xml')) errors.push('robots.txt sitemap address mismatch');

console.log(JSON.stringify({ pagesChecked: checked, tests: cases.length, footerLinks: footerRoutes.length, errors }, null, 2));
if (errors.length) process.exitCode = 1;
