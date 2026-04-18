import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://kyotsu.org'; 
const OUTPUT_PATH = join(__dirname, '../public/sitemap.xml');
const DATABASE_PATH = join(__dirname, '../src/app/data/testDatabase.ts');

// testDatabase.tsからデータを読み込んで問題PDFファイル名を抽出
function extractQuestionPdfs() {
  const databaseContent = readFileSync(DATABASE_PATH, 'utf8');
  const tsvMatch = databaseContent.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
  
  if (!tsvMatch) {
    console.warn('⚠️ DATABASE_TSVが見つかりませんでした');
    return [];
  }

  const tsvData = tsvMatch[1];
  const lines = tsvData.trim().split('\n');
  const questionPdfs = [];

  for (const line of lines) {
    const columns = line.split('\t');
    if (columns.length >= 4) {
      const questionPdf = columns[3]; // 4列目が問題PDFファイル名
      if (questionPdf && questionPdf.trim() !== '') {
        questionPdfs.push(questionPdf);
      }
    }
  }

  return questionPdfs;
}

// 年度リスト（2026～2021 + 特別試験）
const years = [];
for (let year = 2026; year >= 2021; year--) {
  years.push(year);
}
// 特別試験
years.push('令和7年度試作問題');
years.push('令和3年度特例追試験');
years.push('平成30年度試行調査');
years.push('平成29年度試行調査');
years.push('平成29年度モデル問題例');

// 教科リスト（slugベース）
const subjects = [
  'english',
  'math1',
  'math2',
  'kokugo',
  'rika-kiso',
  'rika',
  'shakai',
  'sonota',
];

// サイトマップURL生成
function generateSitemapXML() {
  const today = new Date().toISOString().split('T')[0];
  const urls = [];

  // トップページ
  urls.push({
    loc: BASE_URL,
    lastmod: today,
    changefreq: 'weekly',
    priority: 1.0,
  });

  // 総覧ページ
  urls.push({
    loc: `${BASE_URL}/overview`,
    lastmod: today,
    changefreq: 'weekly',
    priority: 0.9,
  });

  // 年度別ページ
  years.forEach((year) => {
    urls.push({
      loc: `${BASE_URL}/year/${encodeURIComponent(year)}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
    });
  });

  // 教科別ページ
  subjects.forEach((subject) => {
    urls.push({
      loc: `${BASE_URL}/subject/${subject}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.8,
    });
  });

  // 個別試験詳細ページ
  const questionPdfs = extractQuestionPdfs();
  questionPdfs.forEach((questionPdf) => {
    urls.push({
      loc: `${BASE_URL}/test/${encodeURIComponent(questionPdf)}`,
      lastmod: today,
      changefreq: 'yearly',
      priority: 0.6,
    });
  });

  // XMLを生成
  const urlElements = urls
    .map((url) => {
      return `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// ファイルに書き込み
try {
  const sitemapXML = generateSitemapXML();
  writeFileSync(OUTPUT_PATH, sitemapXML, 'utf8');
  const questionPdfs = extractQuestionPdfs();
  console.log('✅ sitemap.xml を生成しました:', OUTPUT_PATH);
  console.log(`📄 合計 ${1 + 1 + years.length + subjects.length + questionPdfs.length} ページを登録`);
  console.log(`   - トップページ: 1`);
  console.log(`   - 総覧ページ: 1`);
  console.log(`   - 年度別ページ: ${years.length}`);
  console.log(`   - 教科別ページ: ${subjects.length}`);
  console.log(`   - 試験詳細ページ: ${questionPdfs.length}`);
} catch (error) {
  console.error('❌ sitemap.xml の生成に失敗しました:', error);
  process.exit(1);
}