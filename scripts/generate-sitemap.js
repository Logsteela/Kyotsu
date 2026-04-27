import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://kyotsutest.vercel.app';
const OUTPUT_PATH = join(__dirname, '../public/sitemap.xml');
const DATABASE_PATH = join(__dirname, '../src/app/data/testDatabase.ts');

const SUBJECT_SLUGS = [
  'english',
  'math1',
  'math2',
  'kokugo',
  'rika-kiso',
  'rika',
  'shakai',
  'sonota',
];

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extractRecords() {
  const databaseContent = readFileSync(DATABASE_PATH, 'utf8');
  const tsvMatch = databaseContent.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);

  if (!tsvMatch) {
    console.warn('⚠️ DATABASE_TSVが見つかりませんでした');
    return [];
  }

  return tsvMatch[1]
    .trim()
    .split('\n')
    .map((line) => line.split('\t'))
    .filter((columns) => columns.length >= 4)
    .map(([year, examType, subject, questionPdf, answerPdf, audio]) => ({
      year,
      examType,
      subject,
      questionPdf,
      answerPdf,
      audio,
    }))
    .filter((record) => record.year && record.questionPdf);
}

function sortYears(years) {
  return [...years].sort((a, b) => {
    const aNumber = Number(a);
    const bNumber = Number(b);

    if (!Number.isNaN(aNumber) && !Number.isNaN(bNumber)) return bNumber - aNumber;
    if (!Number.isNaN(aNumber)) return -1;
    if (!Number.isNaN(bNumber)) return 1;
    return a.localeCompare(b, 'ja');
  });
}

function addUrl(urls, loc, lastmod, changefreq, priority) {
  urls.push({
    loc,
    lastmod,
    changefreq,
    priority,
  });
}

function generateSitemapXML() {
  const today = new Date().toISOString().split('T')[0];
  const records = extractRecords();
  const urls = [];

  addUrl(urls, BASE_URL, today, 'weekly', 1.0);
  addUrl(urls, `${BASE_URL}/overview`, today, 'weekly', 0.9);
  addUrl(urls, `${BASE_URL}/archives`, today, 'monthly', 0.7);

  const years = sortYears(new Set(records.map((record) => record.year)));
  years.forEach((year) => {
    addUrl(urls, `${BASE_URL}/year/${encodeURIComponent(year)}`, today, 'monthly', 0.8);
  });

  SUBJECT_SLUGS.forEach((subject) => {
    addUrl(urls, `${BASE_URL}/subject/${subject}`, today, 'monthly', 0.8);
  });

  const questionPdfs = [...new Set(records.map((record) => record.questionPdf))].sort((a, b) =>
    a.localeCompare(b, 'ja'),
  );

  questionPdfs.forEach((questionPdf) => {
    addUrl(urls, `${BASE_URL}/test/${encodeURIComponent(questionPdf)}`, today, 'yearly', 0.6);
  });

  const urlElements = urls
    .map((url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${escapeXml(url.changefreq)}</changefreq>
    <priority>${url.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

try {
  const sitemapXML = generateSitemapXML();
  writeFileSync(OUTPUT_PATH, sitemapXML, 'utf8');

  const records = extractRecords();
  const years = new Set(records.map((record) => record.year));
  const questionPdfs = new Set(records.map((record) => record.questionPdf));

  console.log('✅ sitemap.xml を生成しました:', OUTPUT_PATH);
  console.log(`📄 合計 ${3 + years.size + SUBJECT_SLUGS.length + questionPdfs.size} ページを登録`);
  console.log('   - トップページ: 1');
  console.log('   - 総覧ページ: 1');
  console.log('   - アーカイブページ: 1');
  console.log(`   - 年度別ページ: ${years.size}`);
  console.log(`   - 教科別ページ: ${SUBJECT_SLUGS.length}`);
  console.log(`   - 試験詳細ページ: ${questionPdfs.size}`);
} catch (error) {
  console.error('❌ sitemap.xml の生成に失敗しました:', error);
  process.exit(1);
}
