import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://kyotsu.org';
const SITE_NAME = '共通テスト過去問総集';
const DIST_DIR = join(__dirname, '../dist');
const DIST_INDEX = join(DIST_DIR, 'index.html');
const DATABASE_PATH = join(__dirname, '../src/app/data/testDatabase.ts');

const DEFAULT_DESCRIPTION =
  '共通テスト、センター試験、共通一次、追試験、特例追試験の問題、解答の過去問PDFを年度別、教科別掲載。';

const SUBJECTS = [
  { slug: 'eigo-reading', label: '英語（Reading）', titleLabel: '英語リーディング' },
  { slug: 'eigo-listening', label: '英語（Listening）', titleLabel: '英語リスニング' },
  { slug: 'math1', label: '数学①', titleLabel: '数学①' },
  { slug: 'math2', label: '数学②', titleLabel: '数学②' },
  { slug: 'kokugo', label: '国語', titleLabel: '国語' },
  { slug: 'rika-kiso', label: '理科基礎', titleLabel: '理科基礎' },
  { slug: 'rika', label: '理科', titleLabel: '理科' },
  { slug: 'joho', label: '情報', titleLabel: '情報' },
  { slug: 'shakai', label: '地理歴史・公民', titleLabel: '地理歴史・公民' },
  { slug: 'sonota', label: 'その他', titleLabel: 'その他' },
];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

function extractRecords() {
  const databaseContent = readFileSync(DATABASE_PATH, 'utf8');
  const tsvMatch = databaseContent.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
  if (!tsvMatch) return [];

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

function getEraDisplay(yearValue) {
  const year = Number(yearValue);
  if (!Number.isFinite(year)) return '';
  if (year >= 2020) return `令和${year - 2018}年度`;
  if (year === 2019) return '平成31年度';
  if (year >= 1989) return `平成${year - 1988}年度`;
  return `昭和${year - 1925}年度`;
}

function formatYear(year) {
  if (Number.isNaN(Number(year))) return year;
  return `${year}年度`;
}

function getTestTypeLabel(examType) {
  return examType === 'main' ? '本試験' : '追試験';
}

function normalizeSubject(subject) {
  return String(subject)
    .replace(/英語（リーディング）/g, '英語リーディング')
    .replace(/英語（リスニング）/g, '英語リスニング')
    .replace(/Ⅰ/g, 'I')
    .replace(/Ⅱ/g, 'II')
    .replace(/Ⅲ/g, 'III')
    .replace(/，/g, '・');
}

function pageJsonLd(meta) {
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: `${BASE_URL}/`,
      name: SITE_NAME,
      alternateName: ['共通テスト過去問', SITE_NAME],
      description: DEFAULT_DESCRIPTION,
      inLanguage: 'ja-JP',
      publisher: { '@id': `${BASE_URL}/#organization` },
    },
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: `${BASE_URL}/`,
      logo: `${BASE_URL}/favicon.png`,
    },
    {
      '@type': 'WebPage',
      '@id': `${meta.url}#webpage`,
      url: meta.url,
      name: meta.title,
      description: meta.description,
      isPartOf: { '@id': `${BASE_URL}/#website` },
      inLanguage: 'ja-JP',
    },
  ];

  if (meta.breadcrumbs?.length) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: meta.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

function cleanHead(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+(?:name|property)=["'](?:description|keywords|author|application-name|robots|googlebot|bingbot|referrer|twitter:card|twitter:title|twitter:description|twitter:image|twitter:image:alt|og:type|og:title|og:description|og:url|og:image|og:image:alt|og:site_name|og:locale)["'][^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["'](?:canonical|alternate)["'][^>]*>\s*/gi, '')
    .replace(/<script\s+type=["']application\/ld\+json["'][\s\S]*?<\/script>\s*/gi, '');
}

function buildHeadTags(meta) {
  const type = meta.type || 'website';
  const imageUrl = `${BASE_URL}/ogp-image.png`;
  const keywords = meta.keywords || '共通テスト,過去問,PDF,ダウンロード,大学入試,センター試験,問題,解答';
  const jsonLd = pageJsonLd(meta);

  return `
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <meta name="keywords" content="${escapeHtml(keywords)}" />
    <meta name="author" content="${SITE_NAME}" />
    <meta name="application-name" content="${SITE_NAME}" />
    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta name="prerendered-route" content="${escapeHtml(meta.path)}" />

    <link rel="canonical" href="${escapeHtml(meta.url)}" />
    <link rel="alternate" href="${escapeHtml(meta.url)}" hreflang="ja-JP" />
    <link rel="alternate" href="${escapeHtml(meta.url)}" hreflang="x-default" />

    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:url" content="${escapeHtml(meta.url)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:alt" content="${SITE_NAME}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="ja_JP" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${SITE_NAME}" />

    <script type="application/ld+json">${escapeJsonForHtml(jsonLd)}</script>`;
}

function injectMeta(html, meta) {
  const cleaned = cleanHead(html);
  return cleaned.replace('</head>', `${buildHeadTags(meta)}\n  </head>`);
}

function writeFileEnsuringDir(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, content, 'utf8');
}

function pathToFilePaths(pathname) {
  if (pathname === '/') return [DIST_INDEX];

  const rawSegments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  const decodedSegments = rawSegments.map((segment) => decodeURIComponent(segment));
  const decodedPath = join(DIST_DIR, ...decodedSegments, 'index.html');
  const rawPath = join(DIST_DIR, ...rawSegments, 'index.html');
  return decodedPath === rawPath ? [decodedPath] : [decodedPath, rawPath];
}

function buildPages(records) {
  const pages = [];
  const add = ({ path, title, description, keywords, type = 'website', breadcrumbs = [] }) => {
    const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\//, '').replace(/\/$/, '')}`;
    pages.push({
      path: normalizedPath,
      url: `${BASE_URL}${normalizedPath === '/' ? '' : normalizedPath}`,
      title,
      description,
      keywords,
      type,
      breadcrumbs,
    });
  };

  add({
    path: '/',
    title: '共通テスト過去問総集｜PDFダウンロード',
    description: DEFAULT_DESCRIPTION,
    keywords: '共通テスト,過去問,センター試験,共通一次,一覧,全部,大学入試,問題,解答,PDF,ダウンロード,ホーム',
  });
  add({
    path: '/overview',
    title: '共通テスト過去問一覧｜全年度・全教科',
    description: '共通テスト、センター試験、共通一次の問題PDF、解答PDF、本試験、追試験、特例追試験。',
    keywords: '共通テスト,過去問,一覧,総覧,センター試験,共通一次,大学入試,問題,解答,PDF,ダウンロード,本試験,追試験,特例追試験',
    breadcrumbs: [{ name: '総覧', url: `${BASE_URL}/overview` }],
  });
  add({
    path: '/archives',
    title: '記録資料集｜共通テスト過去問総集',
    description: '共通テスト、センター試験、共通一次試験の記録資料集。',
    keywords: '共通テスト,センター試験,共通一次,記録資料集,平均点,得点,順位',
    breadcrumbs: [{ name: '記録資料集', url: `${BASE_URL}/archives` }],
  });

  for (const year of sortYears(new Set(records.map((record) => record.year)))) {
    const isNumeric = !Number.isNaN(Number(year));
    const era = isNumeric ? getEraDisplay(year) : '';
    add({
      path: `/year/${encodeURIComponent(year)}`,
      title: isNumeric
        ? `${year}年度（${era}）共通テスト過去問｜問題・解答PDF`
        : `${year}｜問題・解答PDF｜共通テスト過去問総集`,
      description: isNumeric
        ? `${year}年度（${era}）共通テストの問題PDF、解答PDF、本試験、追試験。`
        : `${year}の問題PDF、解答PDF、本試験、追試験。`,
      keywords: `共通テスト,${year}年度,${era},過去問,問題,解答,PDF,ダウンロード,本試験,追試験,センター試験`,
      type: 'article',
      breadcrumbs: [
        { name: '総覧', url: `${BASE_URL}/overview` },
        { name: isNumeric ? `${year}年度一覧` : `${year}一覧`, url: `${BASE_URL}/year/${encodeURIComponent(year)}` },
      ],
    });
  }

  for (const subject of SUBJECTS) {
    add({
      path: `/subject/${subject.slug}`,
      title: `共通テスト ${subject.titleLabel} 過去問｜問題・解答PDF`,
      description: `共通テスト ${subject.titleLabel}の問題PDF、解答PDF、本試験、追試験、年度別一覧。`,
      keywords: `共通テスト,${subject.titleLabel},過去問,問題,解答,PDF,ダウンロード,センター試験,大学入試,本試験,追試験`,
      type: 'article',
      breadcrumbs: [
        { name: '総覧', url: `${BASE_URL}/overview` },
        { name: `${subject.label}一覧`, url: `${BASE_URL}/subject/${subject.slug}` },
      ],
    });
  }

  const uniqueByQuestionPdf = new Map();
  for (const record of records) {
    if (!uniqueByQuestionPdf.has(record.questionPdf)) uniqueByQuestionPdf.set(record.questionPdf, record);
  }

  for (const record of uniqueByQuestionPdf.values()) {
    const formattedYear = formatYear(record.year);
    const era = Number.isNaN(Number(record.year)) ? '' : getEraDisplay(record.year);
    const subject = normalizeSubject(record.subject);
    const testType = getTestTypeLabel(record.examType);
    const testPath = `/test/${encodeURIComponent(record.questionPdf)}`;

    add({
      path: testPath,
      title: `${formattedYear} ${subject} ${testType}｜問題・解答PDF｜共通テスト過去問総集`,
      description: `${formattedYear} ${subject} ${testType}の問題PDF、解答PDF、平均点、受験者数。`,
      keywords: `共通テスト,過去問,${formattedYear},${era},${subject},${testType},問題,解答,PDF,平均点,受験者数`,
      type: 'article',
      breadcrumbs: [
        { name: formattedYear, url: `${BASE_URL}/year/${encodeURIComponent(record.year)}` },
        { name: testType, url: `${BASE_URL}${testPath}` },
      ],
    });
  }

  return pages;
}

function main() {
  if (!existsSync(DIST_INDEX)) {
    throw new Error(`dist/index.html が見つかりません: ${DIST_INDEX}`);
  }

  const records = extractRecords();
  const pages = buildPages(records);
  const baseHtml = readFileSync(DIST_INDEX, 'utf8');
  let fileCount = 0;

  for (const page of pages) {
    const html = injectMeta(baseHtml, page);
    for (const filePath of pathToFilePaths(page.path)) {
      writeFileEnsuringDir(filePath, html);
      fileCount += 1;
    }
  }

  console.log(`✅ 静的HTMLメタ情報を生成しました: ${pages.length} routes / ${fileCount} files`);
}

try {
  main();
} catch (error) {
  console.error('❌ 静的HTMLメタ情報の生成に失敗しました:', error);
  process.exit(1);
}
