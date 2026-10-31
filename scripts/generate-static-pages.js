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
const QUESTION_RESEARCH_PATH = join(__dirname, '../src/app/data/commonTest2026Research.ts');
const PRIOR_RESEARCH_PATH = join(__dirname, '../src/app/data/commonTest2025GroupComparison.ts');
const FOREIGN_RESEARCH_PATH = join(__dirname, '../src/app/data/commonTest2026ForeignLanguages.ts');
const FOREIGN_2025_PATH = join(__dirname, '../src/app/data/commonTest2025ForeignLanguages.ts');
const SOCIAL_DISTRIBUTION_PATH = join(__dirname, '../src/app/data/commonTest2026SocialDistribution.ts');
const SOCIAL_2025_PATH = join(__dirname, '../src/app/data/commonTest2025SocialAreas.ts');
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

function loadQuestionResearch() {
  const source = readFileSync(QUESTION_RESEARCH_PATH, 'utf8');
  const marker = 'COMMON_TEST_2026_RESEARCH: Record<string, MainExamResearch> = ';
  const at = source.indexOf(marker);
  if (at < 0) throw new Error('Question research data marker missing');
  const block = source.slice(at + marker.length).trim().replace(/;$/, '');
  return JSON.parse(block);
}

function difficultyAppropriateness(subject) {
  return ['物理','生物','地学','生物基礎','地学基礎','フランス語','韓国語'].includes(subject) ? 3 : 4;
}

function loadSocial2025() {
  const source = readFileSync(SOCIAL_2025_PATH, 'utf8');
  const marker = 'COMMON_TEST_2025_SOCIAL_AREAS: Record<string,SocialAreaReview> = ';
  const at = source.indexOf(marker);
  if (at < 0) throw new Error('2025 social subject report unavailable');
  return JSON.parse(source.slice(at + marker.length).trim().replace(/;$/, ''));
}

function loadSocialDistribution() {
  const source = readFileSync(SOCIAL_DISTRIBUTION_PATH, 'utf8');
  const marker = 'COMMON_TEST_SOCIAL_DISTRIBUTION: Record<string,Distribution> = ';
  const at = source.indexOf(marker);
  if (at < 0) throw new Error('Social studies distribution data missing');
  return JSON.parse(source.slice(at + marker.length).trim().replace(/;$/, ''));
}

function loadForeign2025() {
  const source = readFileSync(FOREIGN_2025_PATH, 'utf8');
  const marker = 'COMMON_TEST_2025_FOREIGN_LANGUAGES: Record<string, ForeignLanguageAnalysis> = ';
  const at = source.indexOf(marker);
  if (at < 0) throw new Error('2025 foreign-language research data missing');
  return JSON.parse(source.slice(at + marker.length).trim().replace(/;$/, ''));
}

function loadForeignResearch() {
  const source = readFileSync(FOREIGN_RESEARCH_PATH, 'utf8');
  const marker = 'COMMON_TEST_2026_FOREIGN_LANGUAGES: Record<string, ForeignLanguageAnalysis> = ';
  const at = source.indexOf(marker);
  if (at < 0) throw new Error('Foreign language research data missing');
  return JSON.parse(source.slice(at + marker.length).trim().replace(/;$/, ''));
}

function loadPriorResearch() {
  const source = readFileSync(PRIOR_RESEARCH_PATH, 'utf8');
  const marker = 'COMMON_TEST_GROUP_COMPARISONS: Record<string, GroupComparison> = ';
  const at = source.indexOf(marker);
  if (at < 0) throw new Error('Previous-year research data marker missing');
  return JSON.parse(source.slice(at + marker.length).trim().replace(/;$/, ''));
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
  return '<nav aria-label="サイト案内"><a href="/">ホーム</a> ｜ <a href="/overview">全試験一覧</a> ｜ <a href="/statistics">平均点の推移</a> ｜ <a href="/year-statistics">年度別統計</a> ｜ <a href="/coverage">収録状況</a> ｜ <a href="/sources">資料の出典</a> ｜ <a href="/guide">資料の使い方</a> ｜ <a href="/about">サイトについて</a> ｜ <a href="/privacy">プライバシーポリシー</a></nav>';
}

function buildStaticBody(page, records, details, subjectCategories, archives, questionResearch, priorResearch, foreignResearch, socialDistribution, social2025, foreign2025) {
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
  } else if (page.path === '/sources') {
    const sourceCounts = new Map();
    for (const r of records) {
      const note = details.get(r.questionPdf)?.specialNotes ?? '';
      for (const match of note.matchAll(/(問題|解答|音源)：([^　\n]+)/g)) {
        const key = match[1] + '：' + match[2].trim();
        sourceCounts.set(key, (sourceCounts.get(key) ?? 0) + 1);
      }
    }
    const sorted = [...sourceCounts.entries()].sort((a, b) => b[1] - a[1]);
    content = '<h2>共通テストの設問別分析に用いた出典と集計方法</h2>' +
      '<p>このサイトでは大学入試センターの2026年度本試験資料を元に、大問別得点率・正答率・国語や情報Ⅰの得点分布を要約し、試験別ページに掲載しています。原資料への外部リンクは以下にまとめています。</p>' +
      '<ul>' +
      '<li><a href="https://www.dnc.ac.jp/kyotsu/hyouka/r8_hyouka/r8_data.html">大学入試センター・2026年度設問別得点率と科目別成績分布</a></li>' +
      '<li><a href="https://www.dnc.ac.jp/kyotsu/hyouka/r7_hyouka/r7_data.html">大学入試センター・2025年度設問別得点率と科目別成績分布</a></li>' +
      '<li><a href="https://www.dnc.ac.jp/kyotsu/hyouka/r8_hyouka/r8_hyoukahoukokusyo_honshiken.html">2026年度問題評価・分析委員会報告書</a></li>' +
      '<li><a href="https://www.dnc.ac.jp/kyotsu/suii/R3_.html">平均点・受験者数の推移</a></li>' +
      '</ul><p>得点率は平均得点÷配点、正答率は完全に正答した割合の集計。分析文は元資料を参照して当サイトでまとめたもので、年度間の得点分布差を試験難易度の差と断定しません。</p>' +
      '<h2>問題・解答・音源の出典</h2><p>サイトの試験詳細にある出典の記載を集計しました。記載がない資料について提供元を推定していません。</p><table><thead><tr><th>出典記録</th><th>登録件数</th></tr></thead><tbody>' +
      sorted.map(([source, count]) => '<tr><td>' + escapeHtml(source) + '</td><td>' + count + '</td></tr>').join('') + '</tbody></table>';
  } else if (page.path === '/archives') {
    content = '<h2>入試の記録比較</h2><p>収録された統計をもとに、平均得点率や各種得点記録の順位を整理した一覧です。年度や受験者集団による違いを考慮し、順位だけで難易度を判断しないでください。</p>' +
      archives.map(t => '<section><h3>' + escapeHtml(t.title) + '</h3><ol>' +
        t.data.map(row => '<li>' + escapeHtml(row.item1) + '：' + escapeHtml(row.item2) + '</li>').join('') + '</ol></section>').join('');
  } else if (page.path === '/common-test-2025-analysis') {
    const kinds = [
      ...Object.entries(priorResearch).map(([subject, entry]) => ({subject, type: '大問別得点率', groups: entry.groups.length,
        highest: Math.max(...entry.groups.map(x=>x.previousRate)),lowest: Math.min(...entry.groups.map(x=>x.previousRate))})),
      ...Object.entries(social2025).map(([subject, entry]) => ({subject, type: '問題評価', groups: entry.groups.length})),
      ...Object.entries(foreign2025).map(([subject, entry]) => ({subject, type: '問題評価', groups: entry.sections.length})),
    ];
    content = '<h2>2025年度の共通テスト本試験27科目</h2>' +
      '<p>大問別得点率が確認できた20科目と、高校教員による問題評価を整理した7科目の研究資料です。出典・集計方法は<a href="/sources">資料の出典</a>にまとめています。</p>' +
      '<table><thead><tr><th>科目</th><th>掲載内容</th><th>大問数</th><th>大問得点率の最低・最高</th></tr></thead><tbody>' +
      kinds.map(x=>{
        const record = records.find(r=>r.year==='2025'&&r.examType==='main'&&r.subject===x.subject);
        if (!record) return '';
        return '<tr><td><a href="/test/' + encodeURIComponent(record.questionPdf) + '">' + escapeHtml(x.subject) + '</a></td><td>' +
          x.type + '</td><td>' + x.groups + '</td><td>' +
          (x.lowest==null?'未照合':x.lowest.toFixed(2)+'%～'+x.highest.toFixed(2)+'%') +
          '</td></tr>';
      }).join('') + '</tbody></table><h2>比較可能な大問</h2><p>2026年度と番号・配点が対応する14科目は、2026年度の資料ページでも前年との大問別得点率差を閲覧できます。選択問題や配点変更がある場合は数値の単純合計を避けています。</p>';
  } else if (page.path === '/common-test-2026-analysis') {
    const summarized = [];
    for (const [subject, research] of Object.entries(questionResearch)) {
      const matching = records.filter(r => r.year === '2026' && r.examType === 'main' && r.subject === subject);
      if (matching.length !== 1) continue;
      const maxPart = research.parts.reduce((a,b) => a.scoreRate >= b.scoreRate ? a : b);
      const minPart = research.parts.reduce((a,b) => a.scoreRate <= b.scoreRate ? a : b);
      summarized.push({ subject, pdf: matching[0].questionPdf, maxPart, minPart, overview: research.observation });
    }
    content = '<h2>2026年度共通テスト本試験・科目別分析</h2><p>大学入試センターの2026年度大問別の得点率と正答率から23科目を比較。各科目の試験情報には大問ごとの分析と題材の考察を掲載しています。原資料の所在は<a href="/sources">出典一覧</a>にまとめています。</p>' +
      '<table><thead><tr><th>科目</th><th>最低得点率の大問</th><th>最高得点率の大問</th><th>差</th><th>難易度の適正さ*</th></tr></thead><tbody>' +
      summarized.map(r => '<tr><td><a href="/test/' + encodeURIComponent(r.pdf) + '">' + escapeHtml(r.subject) + '</a></td><td>第' +
        r.minPart.number + '問 ' + r.minPart.scoreRate.toFixed(2) + '%</td><td>第' + r.maxPart.number + '問 ' +
        r.maxPart.scoreRate.toFixed(2) + '%</td><td>' + (r.maxPart.scoreRate-r.minPart.scoreRate).toFixed(2) + 'pt</td><td>' + difficultyAppropriateness(r.subject) + '／4</td></tr>').join('') +
      '</tbody></table><p>*高校教員による「難易度の適正さ」の評価であり、4が難しいという意味ではありません。</p><h2>科目別に何が分かるか</h2>' +
      summarized.map(r => '<h3>' + escapeHtml(r.subject) + '</h3><p>' + escapeHtml(r.overview) +
        ' <a href="/test/' + encodeURIComponent(r.pdf) + '">詳細の分析を見る</a></p>').join('');
    const availableComparisons = Object.entries(priorResearch).flatMap(([subject, prior]) => {
      const recent = questionResearch[subject];
      const exam = records.find(r=>r.year === '2026' && r.examType === 'main' && r.subject === subject);
      if (!recent || !exam) return [];
      const pairs = prior.groups.flatMap(old => {
        const now = recent.parts.find(p => p.number === old.number && p.points === old.points);
        return now ? [{ number: old.number, delta: now.scoreRate - old.previousRate,
          contribution: old.points * (now.scoreRate - old.previousRate) / 100 }] : [];
      });
      if (pairs.length !== prior.groups.length) return [];
      const max = pairs.reduce((a,b)=>Math.abs(a.delta)>=Math.abs(b.delta)?a:b);
      return [{ subject, exam, prior, pairs, max }];
    });
    content += '<h2>2025年度と大問別得点率を比較できる科目</h2><p>大問番号・配点が対応する11科目の比較。選択式の数学Ⅱ・B・Cは平均点への寄与を算出できません。</p>' +
      '<table><thead><tr><th>科目</th><th>比較大問数</th><th>前年差が最大の大問</th><th>得点率差</th><th>平均点への寄与</th></tr></thead><tbody>' +
      availableComparisons.map(r => '<tr><td><a href="/test/' + encodeURIComponent(r.exam.questionPdf) + '">' +
        escapeHtml(r.subject) + '</a></td><td>' + r.pairs.length + '</td><td>第' + r.max.number + '問</td><td>' +
        (r.max.delta>=0?'+':'') + r.max.delta.toFixed(2) + 'pt</td><td>' +
        (r.prior.nonAdditive ? '—（選択）' : (r.max.contribution>=0?'+':'') + r.max.contribution.toFixed(2) + '点') +
        '</td></tr>').join('') + '</tbody></table>';
        content += '<h2>外国語4科目の出題と評価</h2><p>得点率の大問別原数値を未照合のため、以下は教師評価に基づく質的な分析です。</p>' +
      Object.entries(foreignResearch).map(([subject, review]) => {
        const exam = records.find(r => r.year === '2026' && r.examType === 'main' && r.subject === subject);
        return exam ? '<h3><a href="/test/' + encodeURIComponent(exam.questionPdf) + '">' + escapeHtml(subject) +
          '</a></h3><p>' + escapeHtml(review.observation) + '（高校教員による難易度の適正さ評価：' + difficultyAppropriateness(subject) + '／4）</p>' : '';
      }).join('');
  } else if (page.path === '/common-test-changes') {
    const snapshots = records.filter(r => /^[0-9]{4}$/.test(r.year) && Number(r.year) >= 2025 && Number(r.year) <= 2026 && r.examType === 'main');
    const changes = [];
    for (const current of snapshots.filter(r => r.year === '2026')) {
      const d = details.get(current.questionPdf);
      if (!d || d.averageScore == null || !(d.totalScore > 0)) continue;
      const prior = records.filter(r => r.year === '2025' && r.examType === 'main' && r.subject === current.subject && details.get(r.questionPdf)?.totalScore === d.totalScore);
      if (prior.length !== 1) continue;
      const previous = details.get(prior[0].questionPdf);
      if (previous?.averageScore == null) continue;
      changes.push({ subject: current.subject, questionPdf: current.questionPdf, prev: previous.averageScore, curr: d.averageScore, delta: d.averageScore - previous.averageScore, max: d.totalScore });
    }
    changes.sort((a,b) => a.delta - b.delta);
    content = '<h2>共通テスト2026年度と2025年度の平均点比較</h2><p>同名・同配点の本試験のみを比較し、当年−前年の差を示します。変化は試験難易度そのものを測るものではありません。画面の年度選択で2022～2026年度を比較できます。</p><table><thead><tr><th>科目</th><th>2025年度平均点</th><th>2026年度平均点</th><th>前年差</th></tr></thead><tbody>' +
      changes.map(r => '<tr><td><a href="/test/' + encodeURIComponent(r.questionPdf) + '">' + escapeHtml(r.subject) + '</a></td><td>' +
        r.prev + '</td><td>' + r.curr + '</td><td>' + (r.delta >= 0 ? '+' : '') + r.delta.toFixed(2) + '点</td></tr>').join('') + '</tbody></table>';
  } else if (page.path === '/year-statistics') {
    const latestYear = Math.max(...records.filter(r => /^[0-9]{4}$/.test(r.year)).map(r => Number(r.year)));
    const sameYear = records.filter(r => Number(r.year) === latestYear && r.examType === 'main' && details.get(r.questionPdf)?.averageScore != null && details.get(r.questionPdf)?.totalScore > 0);
    content = '<h2>' + latestYear + '年度の科目別平均得点率</h2><p>同年度の平均得点率を比較します。科目ごとに受験者集団は異なり、難易度順位を示すものではありません。画面内の年度選択で他の年も比較できます。</p><table><thead><tr><th>科目</th><th>平均点</th><th>満点</th><th>平均得点率</th></tr></thead><tbody>' + sameYear.map(r => {
      const d = details.get(r.questionPdf);
      return '<tr><td><a href="/test/' + encodeURIComponent(r.questionPdf) + '">' + escapeHtml(r.subject) + '</a></td><td>' + d.averageScore + '</td><td>' + d.totalScore + '</td><td>' + (d.averageScore / d.totalScore * 100).toFixed(1) + '%</td></tr>';
    }).join('') + '</tbody></table>';
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
      const archiveYear = Number(r.year);
      if (/^[0-9]{4}$/.test(r.year) && archiveYear < 2021 && r.examType === 'main' && d?.totalScore > 0) {
        const regime = n => n < 1979 ? '試行・実地研究' : n < 1990 ? '共通第1次学力試験' : 'センター試験';
        const max = d?.totalScore;
        const byYear = new Map();
        for (const entry of records) {
          const candidateYear = Number(entry.year);
          if (!/^[0-9]{4}$/.test(entry.year) || candidateYear >= 2021 ||
              regime(candidateYear) !== regime(archiveYear) || entry.examType !== 'main' ||
              entry.subject !== r.subject || (max > 0 && details.get(entry.questionPdf)?.totalScore !== max)) continue;
          const detailsForYear = details.get(entry.questionPdf);
          const item = { year:candidateYear, pdf:entry.questionPdf,
            average:detailsForYear?.averageScore,
            max:detailsForYear?.totalScore, examinees:detailsForYear?.examinees };
          byYear.set(candidateYear,[...(byYear.get(candidateYear)??[]),item]);
        }
        const unique = [...byYear.values()].filter(items=>items.length===1).map(items=>items[0])
          .sort((a,b)=>a.year-b.year);
        const previous=unique.filter(x=>x.year<archiveYear).slice(-2);
        const subsequent=unique.filter(x=>x.year>archiveYear).slice(0,2);
        const own=unique.find(x=>x.pdf===pdf);
        const neighbors=[...previous,...(own?[own]:[]),...subsequent];
        if (neighbors.length>=2) {
          content += '<h2>同じ科目・試験制度の前後年度比較</h2><p>この資料は' +
            escapeHtml(regime(archiveYear)) + 'の' + archiveYear + '年度本試験。同じ科目名・同じ満点・同じ制度の前後年度を並べています。得点率だけで難易度を判断するものではありません。</p>' +
            '<table><thead><tr><th>年度</th><th>平均点</th><th>平均得点率</th><th>受験者数</th></tr></thead><tbody>' +
            neighbors.map(x => '<tr><td><a href="/test/' + encodeURIComponent(x.pdf) + '">' + x.year +
              '年度</a></td><td>' + (x.average ?? '—') + '</td><td>' +
              (x.average != null && x.max > 0 ? (x.average/x.max*100).toFixed(2)+'%' : '—') +
              '</td><td>' + (x.examinees ?? '—') + '</td></tr>').join('') + '</tbody></table>';
        }
      }
      // The same fact-based comparison must also be available without executing React.
      const examYear = Number(r.year);
      if (/^[0-9]{4}$/.test(r.year) && examYear >= 2021 && examYear <= 2026 && r.examType === 'main') {
        const max = d?.totalScore;
        const byYear = new Map();
        for (const entry of records) {
          const y = Number(entry.year);
          if (!/^[0-9]{4}$/.test(entry.year) || y < 2021 || y > 2026 || entry.examType !== 'main' || entry.subject !== r.subject) continue;
          const info = details.get(entry.questionPdf);
          if (!info || !(info.totalScore > 0) || info.averageScore == null || (max > 0 && info.totalScore !== max)) continue;
          const arr = byYear.get(y) ?? [];
          arr.push({ ...entry, info, rate: info.averageScore / info.totalScore * 100 });
          byYear.set(y, arr);
        }
        const comparable = [...byYear].filter(([year, items]) => items.length === 1).map(([year, items]) => ({ year, ...items[0] })).sort((a,b) => b.year - a.year);
        if (d?.averageScore != null && max > 0) {
          const rate = d.averageScore / max * 100;
          const prior = comparable.find(x => x.year === examYear - 1);
          const diff = prior ? rate - prior.rate : null;
          content += '<h2>本試験の年度比較</h2><p>この科目の平均得点率は' + rate.toFixed(2) + '%（' + d.averageScore + '点／' + max + '点）。' +
            (diff !== null ? '前年度の同名・同配点試験との差は' + (diff >= 0 ? '+' : '') + diff.toFixed(2) + 'ポイントです。' : '比較可能な前年の記録はありません。') +
            'これらは試験の難易度順位を示す数値ではありません。</p>';
        }
        if (comparable.length > 1) {
          content += '<h3>同じ科目名・満点の推移</h3><table><thead><tr><th>年度</th><th>平均点</th><th>平均得点率</th><th>受験者数</th></tr></thead><tbody>' +
            comparable.map(x => '<tr><td><a href="/test/' + encodeURIComponent(x.questionPdf) + '">' + x.year +
              '</a></td><td>' + x.info.averageScore + '</td><td>' + x.rate.toFixed(2) + '%</td><td>' +
              (x.info.examinees ?? '—') + '</td></tr>').join('') + '</tbody></table>';
        }
        const socialReview = examYear === 2025 ? social2025[r.subject] : null;
        if (socialReview) {
          content += '<h2>2025年度・大問別の出題内容</h2><p>この科目は3領域から2つ選択するうちの50点部分です。大問の実測得点率は未確認のため掲載していません。</p>' +
            socialReview.groups.map(g => '<h3>第' + g.number + '問：' + escapeHtml(g.topic) +
              '（' + g.points + '点）</h3><p>' + escapeHtml(g.summary) + '</p>').join('') +
            '<h3>出題全体の分析</h3><p>' + escapeHtml(socialReview.observation) + '</p>' +
            '<p>' + escapeHtml(socialReview.caution) + '</p>';
        }
        const priorYear = examYear === 2025 ? priorResearch[r.subject] : null;
        if (priorYear && priorYear.groups.length) {
          const highest = priorYear.groups.reduce((a,b)=>a.previousRate > b.previousRate ? a:b);
          const lowest = priorYear.groups.reduce((a,b)=>a.previousRate < b.previousRate ? a:b);
          content += '<h2>2025年度本試験・大問別の得点率</h2>' +
            '<p>最も高い得点率は第' + highest.number + '問 ' + highest.previousRate.toFixed(2) +
            '%、最も低いのは第' + lowest.number + '問 ' + lowest.previousRate.toFixed(2) + '%。2025年度の公表された設問別得点率を大問ごとに整理しました。</p>' +
            '<table><thead><tr><th>大問</th><th>分野</th><th>配点</th><th>得点率</th></tr></thead><tbody>' +
            priorYear.groups.map(p => '<tr><td>第' + p.number + '問</td><td>' + escapeHtml(p.topic) +
              '</td><td>' + p.points + '点</td><td>' + p.previousRate.toFixed(2) + '%</td></tr>').join('') +
            '</tbody></table>' + (priorYear.nonAdditive ? '<p>選択大問が含まれるため、全大問を合計しても科目平均点には一致しません。</p>' : '') + (priorYear.nonComparable ? '<p>' + escapeHtml(priorYear.comment) + '</p>' : '');
        }
        const foreign = examYear === 2026 ? foreignResearch[r.subject] : examYear === 2025 ? foreign2025[r.subject] : null;
        if (foreign) {
          content += '<h2>本試験の出題内容と問題評価</h2><p>' + (examYear === 2026 ? '高校教員による「難易度の適正さ」評価：' + difficultyAppropriateness(r.subject) + '／4。これは問題の難しさを表す値ではありません。' : '2025年度の高校教員による問題評価の内容を整理。') + '大問別の実測得点率は未確認なので記載していません。</p>' +
            foreign.sections.map(x => '<h3>第' + x.number + '問：' + escapeHtml(x.topic) + '</h3><p>' + escapeHtml(x.summary) + '</p>').join('') +
            '<h3>全体評価</h3><p>' + escapeHtml(foreign.observation) + '</p>' +
            '<h3>注目すべき設問</h3><p>' + escapeHtml(foreign.specific) + '</p><p>' + escapeHtml(foreign.caution) + '</p>';
        }
        const researched = examYear === 2026 ? questionResearch[r.subject] : null;
        if (researched) {
          const parts = researched.parts;
          const best = parts.reduce((a,b) => a.scoreRate > b.scoreRate ? a : b);
          const worst = parts.reduce((a,b) => a.scoreRate < b.scoreRate ? a : b);
          content += '<h2>本試験の大問別得点率・正答率</h2><p>高校教員による「難易度の適正さ」の評価：' + difficultyAppropriateness(r.subject) + '／4。これは難しさを表す値ではありません。</p><p>得点率は平均得点÷配点、正答率は大問内の設問で完全に正解した割合の平均です。' +
            '最も得点率の高い大問は第' + best.number + '問（' + best.scoreRate.toFixed(2) + '%）、最も低いのは第' +
            worst.number + '問（' + worst.scoreRate.toFixed(2) + '%）です。</p>' +
            '<table><thead><tr><th>大問</th><th>分野</th><th>配点</th><th>得点率</th><th>正答率</th></tr></thead><tbody>' +
            parts.map(p => '<tr><td>第' + p.number + '問</td><td>' + escapeHtml(p.topic) + '</td><td>' + p.points +
              '</td><td>' + p.scoreRate.toFixed(2) + '%</td><td>' + (p.correctRate === null ? '—' : p.correctRate.toFixed(2) + '%') + '</td></tr>').join('') +
            '</tbody></table>' +
            '<h3>大問別の差から分かること</h3><p>' + escapeHtml(researched.observation) + '</p>' +
            (researched.review ? '<h3>問題評価と出題内容</h3><p>' + escapeHtml(researched.review) + '</p>' : '') +
            (researched.detail ? '<h3>設問別正答率からの分析</h3><p>' + escapeHtml(researched.detail) + '</p>' : '');
          const comparison = priorResearch[r.subject];
          if (comparison && !comparison.nonComparable && comparison.groups.length === parts.length) {
            const paired = comparison.groups.map(g => ({ before:g, after:parts.find(p => p.number === g.number && p.points === g.points) }));
            if (paired.every(x => x.after)) {
              content += '<h3>2025年度との大問別得点率比較</h3><p>同じ大問番号・配点の比較です。出題内容は年度によって異なり、同一問題との比較ではありません。</p>' +
                '<table><thead><tr><th>大問</th><th>2025年得点率</th><th>2026年得点率</th><th>前年差</th><th>平均点への寄与</th></tr></thead><tbody>' +
                paired.map(x => {
                  const diff=x.after.scoreRate-x.before.previousRate;
                  return '<tr><td>第'+x.before.number+'問</td><td>'+x.before.previousRate.toFixed(2)+'%</td><td>'+x.after.scoreRate.toFixed(2)+'%</td><td>'+
                    (diff>=0?'+':'')+diff.toFixed(2)+'pt</td><td>'+(comparison.nonAdditive?'—（選択）':(diff>=0?'+':'')+(diff*x.after.points/100).toFixed(2)+'点')+'</td></tr>';
                }).join('') + '</tbody></table>' + (comparison.nonAdditive?'<p>第4～7問は4問から3問を選択する方式であり、単純な合計・科目平均点への換算はできません。</p>':'') + '<p>' + escapeHtml(comparison.comment) + '</p>';
            }
          }
          if (r.subject === '数学Ⅱ，数学Ｂ，数学Ｃ') content += '<p>数学Ⅱ・B・Cは必答52点と16点ずつ4問から3問選択で100点満点。表中の全7大問を足すと116点になるため、単純な加算はできません。</p>';
          if (['地理総合', '歴史総合', '公共'].includes(r.subject)) content += '<p>この科目は「地理総合／歴史総合／公共」の3領域から2つ選択する試験の50点分野です。</p>';
          const distribution = socialDistribution[r.subject];
          if (distribution) {
            const q = distribution.quintiles;
            const diff = distribution.previous80 === null ? null : distribution.above80-distribution.previous80;
            content += '<h3>2026年度の得点分布の分析</h3><p>80点以上は受験者の' +
              distribution.above80.toFixed(2) + '%、90点以上は' + distribution.above90.toFixed(2) + '%。' +
              '5分位の境界は下位20%から順に' + q.map(x=>x+'点').join('、') + 'で、上位20%に入る境目はおよそ' + q[3] +
              '点です。</p>' +
              (diff === null ? '' : '<p>2025年度の80点以上は' + distribution.previous80.toFixed(2) +
                '%だったため、前年差は'+(diff>=0?'+':'')+diff.toFixed(2)+'ポイントです。</p>') +
              '<p>平均点・標準偏差だけで正確な順位は出せず、各科目の受験者が異なるため難易度の直接比較にも使用できません。</p>';
          }
          if (r.subject === '国語') {
            content += '<h3>2025～2026年度の国語の得点分布</h3><p>平均点は126.67点から116.37点へ10.30点低下。' +
              '160点以上は87,139人（19.93%）から43,974人（10.04%）へ、180点以上は17,786人（4.07%）から7,215人（1.65%）へ減少。' +
              '受験者の下位20%、40%、60%、80%の境目は、それぞれ94→86点、119→107点、139→126点、159→146点へ移っています。</p>' +
              '<table><thead><tr><th>指標</th><th>2025年度</th><th>2026年度</th></tr></thead><tbody>' +
              [['160点以上','19.93%','10.04%'],['180点以上','4.07%','1.65%'],['満点人数','144人','113人'],
                ['下位20%境界','94点','86点'],['下位40%境界','119点','107点'],['下位60%境界','139点','126点'],['下位80%境界','159点','146点']]
                .map(row => '<tr>' + row.map(x => '<td>' + x + '</td>').join('') + '</tr>').join('') + '</tbody></table>';
          }
          if (r.subject === '情報Ⅰ') {
            content += '<h3>得点分布の前年比較</h3><p>中央値は2025年度70点から2026年度56点、最頻値は71点から56点へ移動。80点以上の割合は28.84%から7.86%、90点以上は10.54%から1.55%に低下しました。下位20%・80%の境界もそれぞれ55点から43点、83点から70点に移り、分布の中心から上位まで変化が見られます。</p>';
          }
        }
      }
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

function injectBody(html, page, records, details, subjectCategories, archives, questionResearch, priorResearch, foreignResearch, socialDistribution, social2025, foreign2025) {
  const fallback = buildStaticBody(page, records, details, subjectCategories, archives, questionResearch, priorResearch, foreignResearch, socialDistribution, social2025, foreign2025);
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
  const historicalExamName = year => {
    const number = Number(year);
    return number >= 2021 ? '共通テスト' : number >= 1990 ? 'センター試験' :
      number >= 1979 ? '共通一次試験' : '試行・実地研究試験';
  };
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
    ['/sources', '収録資料の出典一覧・来歴｜共通テスト過去問総集', '問題・解答・音源の記載上の出典を集計しています。'],
    ['/year-statistics', '年度別・教科別の平均得点率比較｜共通テスト過去問総集', '年度別に平均得点率や前年との差を比較します。'],
    ['/common-test-changes', '共通テスト科目別の平均点前年差｜共通テスト過去問総集', '共通テスト本試験について前年と今年の科目別平均点を照合します。'],
    ['/common-test-2026-analysis', '2026年度共通テスト本試験・大問別得点率と正答率の分析', '23科目の大問別成績と出題評価を一覧し、個別試験の分析に進めます。'],
    ['/common-test-2025-analysis', '2025年度共通テスト本試験・27科目の出題分析', '20科目の大問別得点率と7科目の問題評価を一覧して比較します。'],
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
        ? `${year}年度（${era}）${historicalExamName(year)}過去問｜問題・解答PDF`
        : `${year}｜問題・解答PDF｜共通テスト過去問総集`,
      description: isNumeric
        ? `${year}年度（${era}）${historicalExamName(year)}の問題・解答PDFと関連資料。`
        : `${year}の問題PDF、解答PDF、本試験、追試験。`,
      keywords: `共通テスト,${year}年度,${era},過去問,問題,解答,PDF,ダウンロード,本試験,追試験,センター試験`,
      type: 'website',
      breadcrumbs: [
        { name: '総覧', url: `${BASE_URL}/overview` },
        { name: isNumeric ? `${year}年度一覧` : `${year}一覧`, url: `${BASE_URL}/year/${encodeURIComponent(year)}` },
      ],
    });
  }

  for (const subject of SUBJECTS) {
    add({
      path: `/subject/${subject.slug}`,
      title: `${subject.titleLabel}の歴代入試過去問｜共通テスト・センター試験等の問題と解答`,
      description: `${subject.titleLabel}の共通テスト・センター試験・共通一次などの問題、解答、年度別一覧。`,
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
  const questionResearch = loadQuestionResearch();
  const priorResearch = loadPriorResearch();
  const foreignResearch = loadForeignResearch();
  const foreign2025 = loadForeign2025();
  const socialDistribution = loadSocialDistribution();
  const social2025 = loadSocial2025();
  const pages = buildPages(records);
  const baseHtml = readFileSync(DIST_INDEX, 'utf8');
  let fileCount = 0;

  for (const page of pages) {
    const html = injectBody(injectMeta(baseHtml, page), page, records, details, subjectCategories, archives, questionResearch, priorResearch, foreignResearch, socialDistribution, social2025, foreign2025);
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
