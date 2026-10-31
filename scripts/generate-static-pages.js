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
const DETAILS_PATH = join(__dirname, '../src/app/data/testDetailsDatabase.ts');
const ARCHIVES_PATH = join(__dirname, '../src/app/components/archivesTables.json');
const R2_ORIGIN = 'https://pub-43d2006e555442dca4a107e7bc0d01bb.r2.dev';


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

function loadSubjectCategories() {
  const source = readFileSync(DATABASE_PATH, 'utf8');
  const begin = source.indexOf('export const SUBJECT_MAPPING:');
  const end = source.indexOf('// 分類用教科名からスラッグ', begin);
  const section = source.slice(begin, end);
  const categories = new Map();
  for (const match of section.matchAll(/'([^']+)':\s*\{\s*category:\s*'([^']+)'/g)) {
    categories.set(match[1], match[2]);
  }
  return categories;
}

function loadDetails() {
  const source = readFileSync(DETAILS_PATH, 'utf8');
  const details = new Map();
  // Only extract reliably quoted numeric fields; original source may include free-text special notes.
  const regex = /'([^'\n]+\.pdf)':\{questionPdf:'[^'\n]*'([^\n]*)/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    const props = match[2];
    const numeric = key => {
      const value = props.match(new RegExp('(?:^|,)' + key + ':([0-9.]+)(?:,|$)'));
      return value ? Number(value[1]) : null;
    };
    details.set(match[1], {
      averageScore: numeric('averageScore'),
      totalScore: numeric('totalScore'),
      examinees: numeric('examinees'),
      testDuration: numeric('testDuration'),
      implementationDate: props.match(/implementationDate:'([^']*)'/)?.[1] ?? '',
      specialNotes: props.match(/specialNotes:'([^']*)'/)?.[1] ?? '',
    });
  }
  return details;
}

function staticNavigation() {
  return '<nav aria-label="サイト案内"><a href="/">ホーム</a> ｜ <a href="/overview">全試験一覧</a> ｜ <a href="/statistics">平均点の推移</a> ｜ <a href="/coverage">収録状況</a> ｜ <a href="/guide">資料の使い方</a> ｜ <a href="/about">サイトについて</a> ｜ <a href="/privacy">プライバシーポリシー</a></nav>';
}

function buildStaticBody(page, records, details, subjectCategories, archives) {
  const heading = '<h1>' + escapeHtml(page.title) + '</h1>';
  const intro = '<p>' + escapeHtml(page.description) + '</p>';
  let content = '';
  if (page.path === '/') {
    content = '<h2>年度別・教科別に探す</h2><p>大学入学共通テスト・センター試験・共通第1次学力試験、本試験・追試験・試行問題の問題・解答資料を整理した非公式アーカイブです。</p>';
  } else if (page.path === '/guide') {
    content = '<h2>資料の探し方</h2><p>総覧、年度別、教科別の一覧から過去問を探せます。1979年に共通第1次学力試験、1990年にセンター試験、2021年に共通テストへ移行しました。異なる試験制度や受験者集団の得点は直接比較できない場合があります。</p>';
  } else if (page.path === '/about') {
    content = '<h2>独自の整理方針</h2><p>年度、教科、試験区分、実施日、試験時間、平均点などを紐付けて記録し、古い資料を見つけやすくする非公式の個人運営サイトです。各資料の出典情報は試験詳細の特記事項に記録されています。原資料の権利は各権利者に帰属します。</p>';
  } else if (page.path === '/privacy') {
    content = '<h2>広告とCookieについて</h2><p>Google AdSenseの利用を申請しています。広告が配信される場合はCookie等によって広告・ブラウザに関するデータが利用される可能性があります。Googleのデータ利用については https://policies.google.com/technologies/partner-sites を参照してください。</p>';
  } else if (page.path === '/coverage') {
    const sortedYears = sortYears(new Set(records.map(r => r.year)));
    const tableRows = sortedYears.map(year => {
      const entries = records.filter(r => r.year === year);
      const stats = entries.filter(r => details.get(r.questionPdf)?.averageScore != null && details.get(r.questionPdf)?.totalScore > 0).length;
      const documented = entries.filter(r => /(?:問題|解答|音源)：/.test(details.get(r.questionPdf)?.specialNotes ?? '')).length;
      return '<tr><td><a href="/year/' + encodeURIComponent(year) + '">' + escapeHtml(year) + '</a></td><td>' + entries.length + '</td><td>' + stats + '</td><td>' + documented + '</td></tr>';
    }).join('');
    content = '<h2>年度・資料群ごとの記録</h2><p>登録済みの試験データを自動集計しています。数値は試験レコード数であり、PDFファイル数や現物の閲覧可否を保証するものではありません。</p><table><thead><tr><th>年度・資料群</th><th>登録</th><th>平均点・満点あり</th><th>出典記録あり</th></tr></thead><tbody>' + tableRows + '</tbody></table>';
  } else if (page.path === '/archives') {
    content = '<h2>入試の記録比較</h2><p>収録された統計をもとに、平均得点率や各種得点記録の順位を整理した一覧です。年度や受験者集団による違いを考慮し、順位だけで難易度を判断しないでください。</p>' +
      archives.map(t => '<section><h3>' + escapeHtml(t.title) + '</h3><ol>' +
        t.data.map(row => '<li>' + escapeHtml(row.item1) + '：' + escapeHtml(row.item2) + '</li>').join('') + '</ol></section>').join('');
  } else if (page.path === '/statistics') {
    const scores = records.filter(r => r.examType === 'main' && details.get(r.questionPdf)?.averageScore !== null && details.get(r.questionPdf)?.totalScore);
    const sample = scores.slice(0, 60).map(r => {
      const d = details.get(r.questionPdf);
      return '<tr><td>' + escapeHtml(r.year) + '</td><td>' + escapeHtml(r.subject) + '</td><td>' + d.averageScore + '</td><td>' + d.totalScore + '</td></tr>';
    }).join('');
    content = '<h2>平均点の記録（一部）</h2><p>平均得点率は平均点÷満点で計算しています。ページ内の科目選択で年度別に比較できます。</p><table><thead><tr><th>年度</th><th>科目</th><th>平均点</th><th>満点</th></tr></thead><tbody>' + sample + '</tbody></table>';
  } else if (page.path.startsWith('/test/')) {
    const pdf = decodeURIComponent(page.path.slice(6));
    const r = records.find(x => x.questionPdf === pdf);
    if (r) {
      const d = details.get(pdf);
      const list = [['年度', r.year], ['科目', r.subject], ['試験区分', r.examType === 'main' ? '本試験' : '追試験']];
      if (d?.implementationDate) list.push(['実施日', d.implementationDate]);
      if (d?.testDuration != null) list.push(['試験時間', d.testDuration + '分']);
      if (d?.totalScore != null) list.push(['配点', d.totalScore + '点']);
      if (d?.averageScore != null) list.push(['平均点', d.averageScore + '点']);
      if (d?.examinees != null) list.push(['受験者数', d.examinees + '人']);
      content = '<h2>試験情報</h2><dl>' + list.map(([k,v]) => '<dt>' + escapeHtml(k) + '</dt><dd>' + escapeHtml(v) + '</dd>').join('') + '</dl>';
      if (d?.specialNotes) content += '<h2>資料の注記・出典</h2><p>' + escapeHtml(d.specialNotes) + '</p>';
      content += '<p><a href="' + R2_ORIGIN + '/' + encodeURIComponent(pdf) + '">問題PDF</a></p>';
      if (r.answerPdf) content += '<p><a href="' + R2_ORIGIN + '/' + encodeURIComponent(r.answerPdf) + '">解答PDF</a></p>';
      content += '<p><a href="/year/' + encodeURIComponent(r.year) + '">同年度の試験一覧</a></p>';
    }
  } else {
    let filtered = records;
    if (page.path.startsWith('/year/')) {
      filtered = records.filter(r => String(r.year) === decodeURIComponent(page.path.slice(6)));
    } else if (page.path.startsWith('/subject/')) {
      const slug = page.path.slice(9);
      const slugCategories = {
        'eigo-reading': '英語（Reading）', 'eigo-listening': '英語（Listening）',
        math1: '数学①', math2: '数学②', kokugo: '国語', 'rika-kiso': '理科基礎',
        rika: '理科', joho: '情報', shakai: '社会', sonota: 'その他',
      };
      const category = slugCategories[slug];
      if (category) filtered = records.filter(r => (subjectCategories.get(r.subject) ?? 'その他') === category);
    }
    if (page.path !== '/archives') {
      content = '<h2>収録資料一覧</h2><ul>' + filtered.slice(0, page.path === '/overview' ? 400 : 160).map(r =>
        '<li><a href="/test/' + encodeURIComponent(r.questionPdf) + '">' +
        escapeHtml(r.year + '年度 ' + r.subject + ' ' + (r.examType === 'main' ? '本試験' : '追試験')) +
        '</a></li>').join('') + '</ul>';
    }
  }
  return '<div id="archive-static-fallback" style="max-width:1100px;margin:24px auto;padding:20px;font-family:system-ui,sans-serif;line-height:1.8">' + heading + intro + content + staticNavigation() + '</div>';
}

function injectBody(html, page, records, details, subjectCategories, archives) {
  const fallback = buildStaticBody(page, records, details, subjectCategories, archives);
  return html.replace('<div id="root"></div>', '<div id="root">' + fallback + '</div>');
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
  for (const [path, title, description] of [
    ['/guide', '過去問資料の使い方｜共通テスト過去問総集', '本試験・追試験と試験制度の変遷、資料を探す方法を説明します。'],
    ['/about', 'サイトについて｜共通テスト過去問総集', '資料の整理方針、出典、運営情報を説明します。'],
    ['/privacy', 'プライバシーポリシー｜共通テスト過去問総集', '広告とCookie等の利用について説明します。'],
    ['/statistics', '科目別平均点の年度推移｜共通テスト過去問総集', '本試験の科目別平均点と満点、平均得点率を比較します。'],
    ['/coverage', '収録状況・資料の確認状況｜共通テスト過去問総集', '登録資料数・平均点と出典の記載状況を年度ごとに照合します。'],
  ]) add({ path, title, description });
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
  const details = loadDetails();
  const subjectCategories = loadSubjectCategories();
  const archives = JSON.parse(readFileSync(ARCHIVES_PATH, 'utf8'));
  const pages = buildPages(records);
  const baseHtml = readFileSync(DIST_INDEX, 'utf8');
  let fileCount = 0;

  for (const page of pages) {
    const html = injectBody(injectMeta(baseHtml, page), page, records, details, subjectCategories, archives);
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
