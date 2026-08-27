import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://kyotsu.org';
const SITE_NAME = '共通テスト過去問総集';
const DIST_DIR = join(__dirname, '../dist');
const DIST_INDEX = join(DIST_DIR, 'index.html');
const DIST_404 = join(DIST_DIR, '404.html');
const DATABASE_PATH = join(__dirname, '../src/app/data/testDatabase.ts');
const ARCHIVES_TABLES_PATH = join(__dirname, '../src/app/components/archivesTables.json');

const DEFAULT_DESCRIPTION =
  '共通テスト、センター試験、共通一次、追試験、特例追試験の問題・解答を、年度別・教科別に整理した過去問アーカイブです。';

const SUBJECTS = [
  { slug: 'eigo-reading', category: '英語（Reading）', label: '英語（Reading）', titleLabel: '英語リーディング' },
  { slug: 'eigo-listening', category: '英語（Listening）', label: '英語（Listening）', titleLabel: '英語リスニング' },
  { slug: 'math1', category: '数学①', label: '数学①', titleLabel: '数学①' },
  { slug: 'math2', category: '数学②', label: '数学②', titleLabel: '数学②' },
  { slug: 'kokugo', category: '国語', label: '国語', titleLabel: '国語' },
  { slug: 'rika-kiso', category: '理科基礎', label: '理科基礎', titleLabel: '理科基礎' },
  { slug: 'rika', category: '理科', label: '理科', titleLabel: '理科' },
  { slug: 'joho', category: '情報', label: '情報', titleLabel: '情報' },
  { slug: 'shakai', category: '社会', label: '地理歴史・公民', titleLabel: '地理歴史・公民' },
  { slug: 'sonota', category: 'その他', label: 'その他', titleLabel: 'その他' },
];

function canonicalPagePath(pathname) {
  if (pathname === '/') return '/';
  return `${pathname.replace(/\/+$/, '')}/`;
}

function canonicalPageUrl(pathname) {
  return `${BASE_URL}${canonicalPagePath(pathname)}`;
}

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

function readDatabaseSource() {
  return readFileSync(DATABASE_PATH, 'utf8');
}

function readArchivesTables() {
  const content = readFileSync(ARCHIVES_TABLES_PATH, 'utf8');
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) {
    throw new Error('archivesTables.json の形式が不正です');
  }
  return parsed;
}

function extractRecords() {
  const databaseContent = readDatabaseSource();
  const tsvMatch = databaseContent.match(/const DATABASE_TSV = `\n([\s\S]*?)\n`/);
  if (!tsvMatch) return [];

  return tsvMatch[1]
    .trim()
    .split('\n')
    .map((line) => line.split('\t'))
    .filter((columns) => columns.length >= 4)
    .map(([year, examType, subject, questionPdf, answerPdf, audio, pdfStatus]) => ({
      year,
      examType,
      subject,
      questionPdf,
      answerPdf,
      audio,
      pdfStatus,
    }))
    .filter((record) => record.year && record.questionPdf);
}

function extractSubjectCategoryMap() {
  const databaseContent = readDatabaseSource();
  const mappingMatch = databaseContent.match(
    /export const SUBJECT_MAPPING:[\s\S]*?= \{([\s\S]*?)\n\};/,
  );
  if (!mappingMatch) {
    throw new Error('SUBJECT_MAPPING が見つかりませんでした');
  }

  const categoryMap = new Map();
  const entryPattern = /^\s*'([^']+)'\s*:\s*\{\s*category:\s*'([^']+)'[\s\S]*?\},?\s*$/gm;
  let match;

  while ((match = entryPattern.exec(mappingMatch[1])) !== null) {
    categoryMap.set(match[1], match[2]);
  }

  if (categoryMap.size === 0) {
    throw new Error('SUBJECT_MAPPING のカテゴリを解析できませんでした');
  }

  return categoryMap;
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

function getPdfStatusLabel(status) {
  if (status === '1') return '正常';
  if (status === '2') return '一部欠損';
  if (status === '3') return '完全欠損';
  return '未確認';
}

function buildTestStaticBody({
  displayTestName,
  formattedYear,
  era,
  subject,
  testType,
  pdfStatus,
  hasAnswer,
  hasAudio,
}) {
  const eraText = era ? ` （${era}）` : '';
  const answerText = hasAnswer ? '登録あり' : '登録なし';
  const audioText = hasAudio ? '登録あり' : '登録なし';

  return `
    <article data-static-fallback="test-detail" class="p-4 lg:p-6">
      <div class="flex flex-col gap-6">
        <div class="border-b border-gray-200 pb-4">
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">${escapeHtml(displayTestName)}</h1>
          <p class="text-lg text-gray-600 mt-2">${escapeHtml(testType + eraText)}</p>
          <p class="text-sm text-gray-600 leading-relaxed mt-3">
            ${escapeHtml(`${displayTestName}の問題・解答資料です。年度・試験区分・教科と、資料の収録状況を整理して掲載しています。`)}
          </p>
        </div>

        <section class="bg-white border border-gray-200 rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">試験情報</h2>
          <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <dt class="text-sm text-gray-500">年度</dt>
              <dd class="text-base font-medium text-gray-900">${escapeHtml(formattedYear)}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-sm text-gray-500">試験区分</dt>
              <dd class="text-base font-medium text-gray-900">${escapeHtml(testType)}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-sm text-gray-500">教科名</dt>
              <dd class="text-base font-medium text-gray-900">${escapeHtml(subject)}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-sm text-gray-500">収録状況</dt>
              <dd class="text-base font-medium text-gray-900">${escapeHtml(getPdfStatusLabel(pdfStatus))}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-sm text-gray-500">解答資料</dt>
              <dd class="text-base font-medium text-gray-900">${escapeHtml(answerText)}</dd>
            </div>
            <div class="flex flex-col gap-1">
              <dt class="text-sm text-gray-500">音声資料</dt>
              <dd class="text-base font-medium text-gray-900">${escapeHtml(audioText)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </article>`;
}

function buildYearStaticBody({ year, title, era, records }) {
  const mainRecords = records.filter((record) => record.examType === 'main');
  const makeupRecords = records.filter((record) => record.examType !== 'main');
  const total = records.length;
  const summary = [
    `${title}の問題・解答を教科ごとに整理した年度別一覧です。`,
    `本試験${mainRecords.length}件${makeupRecords.length > 0 ? `、追試験${makeupRecords.length}件` : ''}、合計${total}件を収録しています。`,
  ].join('');

  const renderList = (items, heading) => {
    if (items.length === 0) return '';

    const listItems = items.map((record) => {
      const subject = normalizeSubject(record.subject);
      const href = `/test/${encodeURIComponent(record.questionPdf)}/`;
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(subject)}</a></li>`;
    }).join('');

    return `
      <section>
        <h2 class="text-lg font-semibold text-gray-800">${escapeHtml(heading)}</h2>
        <ul class="list-disc pl-6 space-y-1">${listItems}</ul>
      </section>`;
  };

  return `
    <article data-static-fallback="year" class="p-4 lg:p-6 flex flex-col gap-4">
      <h1 class="text-xl lg:text-2xl font-bold text-gray-900">${escapeHtml(title)}</h1>
      <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(summary)}</p>
      <div class="flex flex-col gap-6">
        ${renderList(mainRecords, '本試験')}
        ${renderList(makeupRecords, '追試験')}
      </div>
    </article>`;
}

function buildArchivesStaticBody(tables) {
  const totalRows = tables.reduce(
    (sum, table) => sum + (Array.isArray(table.data) ? table.data.length : 0),
    0,
  );
  const summary = `共通テスト・センター試験・共通一次試験の得点記録を整理した資料集です。全${tables.length}種類のランキング、${totalRows}件の記録を掲載しています。`;

  const renderedTables = tables.map((table) => {
    const rows = Array.isArray(table.data) && table.data.length > 0
      ? table.data.map((item) => `
          <tr>
            <td>${escapeHtml(item.rank)}</td>
            <td>${escapeHtml(item.item1)}</td>
            <td>${escapeHtml(item.item2)}</td>
          </tr>`).join('')
      : '<tr><td colspan="3">データなし</td></tr>';

    return `
      <section>
        <h2>${escapeHtml(table.title || '')}</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">順位</th>
              <th scope="col">教科</th>
              <th scope="col">点数</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }).join('');

  return `
    <main data-static-fallback="archives" class="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <div class="w-full max-w-none mx-auto">
        <h1 class="text-xl lg:text-2xl font-bold text-gray-900 mb-6">記録資料集</h1>
        <p class="text-sm text-gray-600 leading-relaxed mb-6">${escapeHtml(summary)}</p>
        <div class="flex flex-wrap gap-6 items-start">${renderedTables}</div>
      </div>
    </main>`;
}

function buildHomeStaticBody() {
  return `
    <main data-static-fallback="home" class="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <div class="w-full">
        <section class="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
          <h1 class="sr-only">共通テスト過去問総集</h1>
          <p class="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">唯一の共通テスト全集</p>
          <p class="text-gray-700 leading-relaxed mb-4">
            このサイトでは、共通テストの問題・解答をすべて収録し、無料で閲覧・ダウンロードできます。また、旧センター試験、旧共通一次試験も収集しています。旧センター試験・旧共通一次試験については、入手できた資料を順次整理・追加しています。
          </p>
          <p class="text-gray-700 leading-relaxed">
            年度別・教科別で閲覧する機能を使って、必要な過去問を素早く見つけることができます。
          </p>
        </section>

        <section class="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">クイックアクセス</h2>
          <ul class="space-y-2">
            <li><a href="/overview/">総覧 — すべてのテストを一覧表示</a></li>
            <li><a href="/year/2026/">最新年度（2026年度）— 令和8年度の過去問へ</a></li>
          </ul>
        </section>

        <section class="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
          <h2 class="text-xl font-bold text-gray-900 mb-4">このサイトについて</h2>
          <h3 class="font-semibold text-gray-900 mb-2">目的</h3>
          <p class="text-gray-700 leading-relaxed">
            大学入学共通テストの過去問は、過去三年分は大学入試センターから発表されますが、それ以前は非公開となります。また、予備校が発表する過去問は、速報を基盤としていることから、追試が欠落していることが多いです。
          </p>
          <p class="text-gray-700 leading-relaxed mt-3">
            このように、非常に高い公的性質を持つテストにもかかわらず、その過去の状況がつかみづらく、また演習を重ねたい人にとって利用しづらい環境となっています。そこで、直近の物から順に共通テスト・センター試験・共通一次試験の問題を収集し、年度別・教科別に整理しています。
          </p>
          <p class="text-gray-700 leading-relaxed mt-3">
            共通テストの過去問はすべて揃えています。
          </p>
        </section>
      </div>
    </main>`;
}

function buildOverviewStaticBody(records) {
  const uniqueRecords = Array.from(
    new Map(records.map((record) => [record.questionPdf, record])).values(),
  );
  const years = sortYears(new Set(uniqueRecords.map((record) => record.year)));
  const summary = `共通テスト、センター試験、共通一次などの問題・解答を年度・教科・試験区分ごとに整理した総覧です。全${uniqueRecords.length}件の試験資料を収録しています。`;

  const sections = years.map((year) => {
    const items = uniqueRecords.filter((record) => record.year === year);
    const yearLabel = Number.isNaN(Number(year))
      ? String(year)
      : `${year}年度（${getEraDisplay(year)}）`;

    const listItems = items.map((record) => {
      const href = `/test/${encodeURIComponent(record.questionPdf)}/`;
      const subjectName = normalizeSubject(record.subject);
      const testType = getTestTypeLabel(record.examType);
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(`${subjectName} ${testType}`)}</a></li>`;
    }).join('');

    return `
      <section>
        <h2 class="text-lg font-semibold text-gray-800">${escapeHtml(yearLabel)}</h2>
        <ul class="list-disc pl-6 space-y-1">${listItems}</ul>
      </section>`;
  }).join('');

  return `
    <article data-static-fallback="overview" class="p-4 lg:p-6 flex flex-col gap-4">
      <h1 class="text-xl lg:text-2xl font-bold text-gray-900">総覧</h1>
      <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(summary)}</p>
      <div class="flex flex-col gap-6">${sections}</div>
    </article>`;
}

function buildSubjectStaticBody({ subject, records, categoryMap }) {
  const subjectRecords = records.filter((record) => {
    const category = categoryMap.get(record.subject) || 'その他';
    return category === subject.category;
  });

  const uniqueRecords = Array.from(
    new Map(subjectRecords.map((record) => [record.questionPdf, record])).values(),
  );

  const years = sortYears(new Set(uniqueRecords.map((record) => record.year)));
  const summary = `${subject.label}の問題・解答を年度別に整理した教科別一覧です。全${uniqueRecords.length}件を収録しています。`;

  const sections = years.map((year) => {
    const items = uniqueRecords.filter((record) => record.year === year);
    const yearLabel = Number.isNaN(Number(year))
      ? String(year)
      : `${year}年度（${getEraDisplay(year)}）`;

    const listItems = items.map((record) => {
      const href = `/test/${encodeURIComponent(record.questionPdf)}/`;
      const subjectName = normalizeSubject(record.subject);
      const testType = getTestTypeLabel(record.examType);
      return `<li><a href="${escapeHtml(href)}">${escapeHtml(`${subjectName} ${testType}`)}</a></li>`;
    }).join('');

    return `
      <section>
        <h2 class="text-lg font-semibold text-gray-800">${escapeHtml(yearLabel)}</h2>
        <ul class="list-disc pl-6 space-y-1">${listItems}</ul>
      </section>`;
  }).join('');

  return `
    <article data-static-fallback="subject" class="p-4 lg:p-6 flex flex-col gap-4">
      <h1 class="text-xl lg:text-2xl font-bold text-gray-900">${escapeHtml(`${subject.label}一覧`)}</h1>
      <p class="text-sm text-gray-600 leading-relaxed">${escapeHtml(summary)}</p>
      <div class="flex flex-col gap-6">${sections}</div>
    </article>`;
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

function injectStaticBody(html, meta) {
  if (!meta.staticBody) return html;

  const rootPattern = /<div\s+id=["']root["']>\s*<\/div>/i;
  if (!rootPattern.test(html)) {
    throw new Error(`静的本文を挿入できませんでした: #root が見つかりません (${meta.path})`);
  }

  return html.replace(rootPattern, `<div id="root">${meta.staticBody}</div>`);
}

function buildNotFoundHtml(baseHtml) {
  const cleaned = cleanHead(baseHtml);
  const head = `
    <title>ページが見つかりません｜共通テスト過去問総集</title>
    <meta name="description" content="指定されたページは見つかりませんでした。" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <meta name="googlebot" content="noindex, nofollow, noarchive" />
    <meta name="bingbot" content="noindex, nofollow, noarchive" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />`;

  const withHead = cleaned.replace('</head>', `${head}\n  </head>`);
  const rootPattern = /<div\s+id=["']root["']>\s*<\/div>/i;

  if (!rootPattern.test(withHead)) {
    throw new Error('404.html を生成できませんでした: #root が見つかりません');
  }

  const staticBody = `
    <main data-static-fallback="not-found" class="p-4 lg:p-6">
      <h1 class="text-xl lg:text-2xl font-bold text-gray-900 mb-4">ページが見つかりません</h1>
      <p class="text-gray-600 mb-4">指定されたページは見つかりませんでした。</p>
      <p><a href="/">ホームに戻る</a></p>
    </main>`;

  return withHead.replace(rootPattern, `<div id="root">${staticBody}</div>`);
}

function verifyNotFoundHtml(html) {
  assertStatic(html.includes('data-static-fallback="not-found"'), '404.html に静的本文がありません');
  assertStatic(html.includes('noindex, nofollow, noarchive'), '404.html に noindex がありません');
  assertStatic(
    !/<link\s+rel=["']canonical["']/i.test(html),
    '404.html に canonical を出力してはいけません',
  );
  assertStatic(
    !/<div\s+id=["']root["']>\s*<\/div>/i.test(html),
    '404.html の #root が空です',
  );
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

function buildPages(records, archivesTables = readArchivesTables()) {
  const pages = [];
  const add = ({ path, title, description, keywords, type = 'website', breadcrumbs = [], staticBody = '' }) => {
    const normalizedPath = path === '/' ? '/' : `/${path.replace(/^\//, '').replace(/\/$/, '')}`;
    pages.push({
      path: normalizedPath,
      url: canonicalPageUrl(normalizedPath),
      title,
      description,
      keywords,
      type,
      breadcrumbs,
      staticBody,
    });
  };

  add({
    path: '/',
    title: '共通テスト過去問総集｜PDFダウンロード',
    description: DEFAULT_DESCRIPTION,
    keywords: '共通テスト,過去問,センター試験,共通一次,一覧,全部,大学入試,問題,解答,PDF,ダウンロード,ホーム',
    staticBody: buildHomeStaticBody(),
  });
  add({
    path: '/overview',
    title: '共通テスト過去問一覧｜全年度・全教科',
    description: '共通テスト、センター試験、共通一次の問題・解答を、年度、教科、本試験・追試験ごとに整理した一覧です。',
    keywords: '共通テスト,過去問,一覧,総覧,センター試験,共通一次,大学入試,問題,解答,PDF,ダウンロード,本試験,追試験,特例追試験',
    breadcrumbs: [{ name: '総覧', url: `${BASE_URL}/overview/` }],
    staticBody: buildOverviewStaticBody(records),
  });
  add({
    path: '/archives',
    title: '記録資料集｜共通テスト過去問総集',
    description: '共通テスト、センター試験、共通一次試験の記録資料集。',
    keywords: '共通テスト,センター試験,共通一次,記録資料集,平均点,得点,順位',
    breadcrumbs: [{ name: '記録資料集', url: `${BASE_URL}/archives` }],
    staticBody: buildArchivesStaticBody(archivesTables),
  });

  for (const year of sortYears(new Set(records.map((record) => record.year)))) {
    const isNumeric = !Number.isNaN(Number(year));
    const era = isNumeric ? getEraDisplay(year) : '';
    const yearTitle = isNumeric ? `${year}年度一覧` : `${year}一覧`;
    const yearRecords = records.filter((record) => record.year === year);

    add({
      path: `/year/${encodeURIComponent(year)}`,
      title: isNumeric
        ? `${year}年度（${era}）共通テスト過去問｜問題・解答PDF`
        : `${year}｜問題・解答PDF｜共通テスト過去問総集`,
      description: isNumeric
        ? `${year}年度（${era}）の問題・解答を、本試験・追試験、教科ごとに整理した年度別一覧です。`
        : `${year}の問題・解答を、試験区分と教科ごとに整理した一覧です。`,
      keywords: `共通テスト,${year}年度,${era},過去問,問題,解答,PDF,ダウンロード,本試験,追試験,センター試験`,
      type: 'article',
      breadcrumbs: [
        { name: '総覧', url: `${BASE_URL}/overview/` },
        { name: yearTitle, url: `${BASE_URL}/year/${encodeURIComponent(year)}/` },
      ],
      staticBody: buildYearStaticBody({
        year,
        title: yearTitle,
        era,
        records: yearRecords,
      }),
    });
  }

  const categoryMap = extractSubjectCategoryMap();

  for (const subject of SUBJECTS) {
    add({
      path: `/subject/${subject.slug}`,
      title: `共通テスト ${subject.titleLabel} 過去問｜問題・解答PDF`,
      description: `共通テスト ${subject.titleLabel}の問題・解答を、本試験・追試験、年度ごとに整理した教科別一覧です。`,
      keywords: `共通テスト,${subject.titleLabel},過去問,問題,解答,PDF,ダウンロード,センター試験,大学入試,本試験,追試験`,
      type: 'article',
      breadcrumbs: [
        { name: '総覧', url: `${BASE_URL}/overview/` },
        { name: `${subject.label}一覧`, url: `${BASE_URL}/subject/${subject.slug}/` },
      ],
      staticBody: buildSubjectStaticBody({
        subject,
        records,
        categoryMap,
      }),
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

    const displayTestName = `${formattedYear} ${subject}${record.examType === 'main' ? '' : ' (追)'}`;

    add({
      path: testPath,
      title: `${formattedYear} ${subject} ${testType}｜問題・解答PDF｜共通テスト過去問総集`,
      description: `${formattedYear} ${subject} ${testType}の問題・解答と、年度、試験区分、試験時間、配点、平均点、受験者数などの情報を整理したページです。`,
      keywords: `共通テスト,過去問,${formattedYear},${era},${subject},${testType},問題,解答,PDF,平均点,受験者数`,
      type: 'article',
      breadcrumbs: [
        { name: formattedYear, url: `${BASE_URL}/year/${encodeURIComponent(record.year)}` },
        { name: testType, url: `${BASE_URL}${testPath}/` },
      ],
      staticBody: buildTestStaticBody({
        displayTestName,
        formattedYear,
        era,
        subject,
        testType,
        pdfStatus: record.pdfStatus,
        hasAnswer: Boolean(record.answerPdf),
        hasAudio: Boolean(record.audio),
      }),
    });
  }

  return pages;
}


function countOccurrences(text, pattern) {
  return (String(text).match(pattern) || []).length;
}

function assertStatic(condition, message) {
  if (!condition) {
    throw new Error(`静的HTML整合性チェック失敗: ${message}`);
  }
}

function countTestLinks(staticBody) {
  return countOccurrences(staticBody, /href=["']\/test\//g);
}

function verifyPageDefinitions(pages, records, archivesTables) {
  const paths = pages.map((page) => page.path);
  assertStatic(new Set(paths).size === paths.length, '重複したroute pathがあります');

  const uniqueQuestionPdfs = new Set(records.map((record) => record.questionPdf));
  assertStatic(
    uniqueQuestionPdfs.size === records.length,
    `questionPdf が重複しています: records=${records.length}, unique=${uniqueQuestionPdfs.size}`,
  );

  const testPages = pages.filter((page) => page.path.startsWith('/test/'));
  assertStatic(
    testPages.length === uniqueQuestionPdfs.size,
    `個別試験route数がDBと一致しません: pages=${testPages.length}, records=${uniqueQuestionPdfs.size}`,
  );

  const years = sortYears(new Set(records.map((record) => record.year)));
  const yearPages = pages.filter((page) => page.path.startsWith('/year/'));
  assertStatic(
    yearPages.length === years.length,
    `年度route数がDBと一致しません: pages=${yearPages.length}, years=${years.length}`,
  );

  for (const year of years) {
    const page = pages.find((candidate) => candidate.path === `/year/${encodeURIComponent(year)}`);
    const expected = records.filter((record) => record.year === year).length;
    assertStatic(Boolean(page), `年度ページがありません: ${year}`);
    assertStatic(
      countTestLinks(page.staticBody) === expected,
      `年度ページの試験リンク数が不一致です: ${year} expected=${expected} actual=${countTestLinks(page.staticBody)}`,
    );
  }

  const categoryMap = extractSubjectCategoryMap();
  const knownCategories = new Set(SUBJECTS.map((subject) => subject.category));
  const usedCategories = new Set(
    records.map((record) => categoryMap.get(record.subject) || 'その他'),
  );

  for (const category of usedCategories) {
    assertStatic(
      knownCategories.has(category),
      `SUBJECTS に未定義のカテゴリがあります: ${category}`,
    );
  }

  for (const subject of SUBJECTS) {
    const page = pages.find((candidate) => candidate.path === `/subject/${subject.slug}`);
    const expected = records.filter(
      (record) => (categoryMap.get(record.subject) || 'その他') === subject.category,
    ).length;
    assertStatic(Boolean(page), `教科ページがありません: ${subject.slug}`);
    assertStatic(
      countTestLinks(page.staticBody) === expected,
      `教科ページの試験リンク数が不一致です: ${subject.slug} expected=${expected} actual=${countTestLinks(page.staticBody)}`,
    );
  }

  const overview = pages.find((page) => page.path === '/overview');
  assertStatic(Boolean(overview), '総覧ページがありません');
  assertStatic(
    countTestLinks(overview.staticBody) === uniqueQuestionPdfs.size,
    `総覧の試験リンク数が不一致です: expected=${uniqueQuestionPdfs.size} actual=${countTestLinks(overview.staticBody)}`,
  );

  const archives = pages.find((page) => page.path === '/archives');
  const archiveRows = archivesTables.reduce(
    (sum, table) => sum + (Array.isArray(table.data) ? table.data.length : 0),
    0,
  );
  assertStatic(Boolean(archives), '記録資料集ページがありません');
  assertStatic(
    countOccurrences(archives.staticBody, /<table>/g) === archivesTables.length,
    `記録資料集の表数が不一致です: expected=${archivesTables.length} actual=${countOccurrences(archives.staticBody, /<table>/g)}`,
  );
  assertStatic(
    countOccurrences(archives.staticBody, /<tbody>[\s\S]*?<\/tbody>/g) === archivesTables.length,
    '記録資料集の tbody 数が表数と一致しません',
  );
  const renderedArchiveRows =
    countOccurrences(archives.staticBody, /<tr>/g) - archivesTables.length;
  assertStatic(
    renderedArchiveRows === archiveRows,
    `記録資料集の生成行数が不一致です: expected=${archiveRows} actual=${renderedArchiveRows}`,
  );

  const home = pages.find((page) => page.path === '/');
  assertStatic(Boolean(home), 'トップページがありません');
  assertStatic(home.staticBody.includes('唯一の共通テスト全集'), 'トップの主要訴求が静的HTMLから欠落しています');
  assertStatic(home.staticBody.includes('共通テストの問題・解答をすべて収録'), 'トップの全収録説明が静的HTMLから欠落しています');

  const contentPages = pages.filter(
    (page) =>
      page.path === '/' ||
      page.path === '/overview' ||
      page.path === '/archives' ||
      page.path.startsWith('/year/') ||
      page.path.startsWith('/subject/') ||
      page.path.startsWith('/test/'),
  );

  for (const page of contentPages) {
    assertStatic(Boolean(page.staticBody), `静的本文が空です: ${page.path}`);
    assertStatic(
      page.staticBody.includes('data-static-fallback='),
      `静的本文マーカーがありません: ${page.path}`,
    );
  }
}

function verifyRenderedHtml(page, html) {
  assertStatic(
    html.includes(`<link rel="canonical" href="${escapeHtml(page.url)}" />`),
    `canonical が不一致です: ${page.path}`,
  );
  assertStatic(
    html.includes(`<meta name="prerendered-route" content="${escapeHtml(page.path)}" />`),
    `prerendered-route が不一致です: ${page.path}`,
  );

  if (page.staticBody) {
    assertStatic(
      !/<div\s+id=["']root["']>\s*<\/div>/i.test(html),
      `#root が空のままです: ${page.path}`,
    );
    assertStatic(
      html.includes('data-static-fallback='),
      `生成HTMLに静的本文マーカーがありません: ${page.path}`,
    );
  }
}

function main() {
  if (!existsSync(DIST_INDEX)) {
    throw new Error(`dist/index.html が見つかりません: ${DIST_INDEX}`);
  }

  const records = extractRecords();
  const archivesTables = readArchivesTables();
  const pages = buildPages(records, archivesTables);
  verifyPageDefinitions(pages, records, archivesTables);
  const baseHtml = readFileSync(DIST_INDEX, 'utf8');
  let fileCount = 0;

  const notFoundHtml = buildNotFoundHtml(baseHtml);
  verifyNotFoundHtml(notFoundHtml);
  writeFileEnsuringDir(DIST_404, notFoundHtml);

  for (const page of pages) {
    const html = injectStaticBody(injectMeta(baseHtml, page), page);
    verifyRenderedHtml(page, html);
    for (const filePath of pathToFilePaths(page.path)) {
      writeFileEnsuringDir(filePath, html);
      fileCount += 1;
    }
  }

  console.log(`✅ 静的HTML整合性チェックに合格しました: ${pages.length} routes`);
  console.log('✅ top-level 404.html を生成しました');
  console.log(`✅ 静的HTMLメタ情報を生成しました: ${pages.length} routes / ${fileCount} files`);
}

try {
  main();
} catch (error) {
  console.error('❌ 静的HTMLメタ情報の生成に失敗しました:', error);
  process.exit(1);
}
