// テストデータベース
// フォーマット: 年度	本試追試	教科	問題	解答	音声	PDF状態
// タブ区切り（TSV）形式でデータを管理
// 本試追試: main=本試験, makeup=追試験
// PDF状態: 1=正常, 2=一部欠損, 3=完全欠損

// データベース（TSV形式の文字列）
// 各行：年度	本試追試	教科	問題	解答	音声	PDF状態
const DATABASE_TSV = `
2025	main	国語	2025kokugo.pdf	2025kokugo_ans.pdf		1
2025	main	数学I・A	2025math1a.pdf	2025math1a_ans.pdf		1
2025	main	数学II・B・C	2025math2bc.pdf	2025math2bc_ans.pdf		1
2025	main	英語（Reading）	2025eng_r.pdf	2025eng_r_ans.pdf		1
2025	main	英語（Listening）	2025eng_l.pdf	2025eng_l_ans.pdf	2025eng_l.mp3	2
2025	main	物理	2025physics.pdf	2025physics_ans.pdf		1
2025	main	化学	2025chemistry.pdf	2025chemistry_ans.pdf		1
2025	main	生物	2025biology.pdf	2025biology_ans.pdf		1
2025	main	物理基礎	2025physics_basic.pdf	2025physics_basic_ans.pdf		1
2025	main	化学基礎	2025chemistry_basic.pdf	2025chemistry_basic_ans.pdf		1
2025	main	地理B	2025geography.pdf	2025geography_ans.pdf		1
2025	main	日本史B	2025jphistory.pdf	2025jphistory_ans.pdf		1
2025	main	世界史B	2025worldhistory.pdf	2025worldhistory_ans.pdf		1
2025	main	情報I	2025info.pdf	2025info_ans.pdf		1
2025	makeup	国語	2025kokugo_makeup.pdf	2025kokugo_makeup_ans.pdf		1
2025	makeup	数学I・A	2025math1a_makeup.pdf	2025math1a_makeup_ans.pdf		1
2025	makeup	物理	2025physics_makeup.pdf	2025physics_makeup_ans.pdf		3
2025	makeup	地理B	2025geography_makeup.pdf	2025geography_makeup_ans.pdf		1
2024	main	国語	2024kokugo.pdf	2024kokugo_ans.pdf		1
2024	main	数学I・A	2024math1a.pdf	2024math1a_ans.pdf		1
2024	main	数学II・B	2024math2b.pdf	2024math2b_ans.pdf		1
2024	main	英語（Reading）	2024eng_r.pdf	2024eng_r_ans.pdf		1
2024	main	英語（Listening）	2024eng_l.pdf	2024eng_l_ans.pdf		1
2024	main	物理	2024physics.pdf	2024physics_ans.pdf		1
2024	main	化学	2024chemistry.pdf	2024chemistry_ans.pdf		1
2024	main	地理B	2024geography.pdf	2024geography_ans.pdf		1
2024	main	日本史B	2024jphistory.pdf	2024jphistory_ans.pdf		1
2024	main	ドイツ語	2024germany.pdf	2024germany_ans.pdf		1
2024	main	フランス語	2024french.pdf	2024french_ans.pdf		1
2024	makeup	国語	2024kokugo_makeup.pdf	2024kokugo_makeup_ans.pdf		1
2024	makeup	数学I・A	2024math1a_makeup.pdf	2024math1a_makeup_ans.pdf		1
2020	main	国語	2020kokugo.pdf	2020kokugo_ans.pdf		1
2020	main	数学I・数学A	2020math1a.pdf	2020math1a_ans.pdf		1
2020	main	数学II・数学B	2020math2b.pdf	2020math2b_ans.pdf		1
2020	main	物理I	2020physics.pdf	2020physics_ans.pdf		1
2020	main	政治・経済	2020poliecon.pdf			2
2020	main	中国語	2020chinese.pdf	2020chinese_ans.pdf		1
2020	makeup	国語	2020kokugo_makeup.pdf	2020kokugo_makeup_ans.pdf		1
2020	makeup	数学I・数学A		2020math1a_makeup_ans.pdf		2
特別試験	main	国語（特別）	special_kokugo.pdf	special_kokugo_ans.pdf		1
特別試験	main	数学（特別）	special_math.pdf	special_math_ans.pdf		1
`.trim();

// 教科名から分類用教科名と本質教科名への対応表
export const SUBJECT_MAPPING: Record<string, { category: string; essential: string; slug: string }> = {
  // 国語
  '国語': { category: '国語', essential: '国語', slug: 'kokugo' },
  '国語（特別）': { category: '国語', essential: '国語', slug: 'kokugo' },
  
  // 数学①
  '数学I・A': { category: '数学①', essential: '数学I・A', slug: 'math1' },
  '数学I・数学A': { category: '数学①', essential: '数学I・A', slug: 'math1' },
  '数学（特別）': { category: '数学①', essential: '数学', slug: 'math1' },
  
  // 数学②
  '数学II・B': { category: '数学②', essential: '数学II・B', slug: 'math2' },
  '数学II・B・C': { category: '数学②', essential: '数学II・B・C', slug: 'math2' },
  '数学II・数学B': { category: '数学②', essential: '数学II・B', slug: 'math2' },
  
  // 理科
  '物理': { category: '理科', essential: '物理', slug: 'rika' },
  '物理I': { category: '理科', essential: '物理', slug: 'rika' },
  '物理II': { category: '理科', essential: '物理', slug: 'rika' },
  '化学': { category: '理科', essential: '化学', slug: 'rika' },
  '化学I': { category: '理科', essential: '化学', slug: 'rika' },
  '化学II': { category: '理科', essential: '化学', slug: 'rika' },
  '生物': { category: '理科', essential: '生物', slug: 'rika' },
  '生物I': { category: '理科', essential: '生物', slug: 'rika' },
  '生物II': { category: '理科', essential: '生物', slug: 'rika' },
  '地学': { category: '理科', essential: '地学', slug: 'rika' },
  '地学I': { category: '理科', essential: '地学', slug: 'rika' },
  '地学II': { category: '理科', essential: '地学', slug: 'rika' },
  
  // 理科基礎
  '物理基礎': { category: '理科基礎', essential: '物理基礎', slug: 'rika-kiso' },
  '化学基礎': { category: '理科基礎', essential: '化学基礎', slug: 'rika-kiso' },
  '生物基礎': { category: '理科基礎', essential: '生物基礎', slug: 'rika-kiso' },
  '地学基礎': { category: '理科基礎', essential: '地学基礎', slug: 'rika-kiso' },
  
  // 社会
  '地理A': { category: '社会', essential: '地理', slug: 'shakai' },
  '地理B': { category: '社会', essential: '地理', slug: 'shakai' },
  '地理総合': { category: '社会', essential: '地理', slug: 'shakai' },
  '日本史A': { category: '社会', essential: '日本史', slug: 'shakai' },
  '日本史B': { category: '社会', essential: '日本史', slug: 'shakai' },
  '日本史探究': { category: '社会', essential: '日本史', slug: 'shakai' },
  '世界史A': { category: '社会', essential: '世界史', slug: 'shakai' },
  '世界史B': { category: '社会', essential: '世界史', slug: 'shakai' },
  '世界史探究': { category: '社会', essential: '世界史', slug: 'shakai' },
  '現代社会': { category: '社会', essential: '現社', slug: 'shakai' },
  '倫理': { category: '社会', essential: '倫理', slug: 'shakai' },
  '政治・経済': { category: '社会', essential: '政経', slug: 'shakai' },
  '倫理、政治・経済': { category: '社会', essential: '倫理・政経', slug: 'shakai' },
  '公共': { category: '社会', essential: '公共', slug: 'shakai' },
  
  // 英語
  '英語（Reading）': { category: '英語（Reading）', essential: '英語（Reading）', slug: 'eigo-reading' },
  '英語（Listening）': { category: '英語（Listening）', essential: '英語（Listening）', slug: 'eigo-listening' },
  '英語（筆記）': { category: '英語（Reading）', essential: '英語（筆記）', slug: 'eigo-reading' },
  '英語（リスニング）': { category: '英語（Listening）', essential: '英語（リスニング）', slug: 'eigo-listening' },
  
  // 情報
  '情報': { category: '情報', essential: '情報', slug: 'joho' },
  '情報I': { category: '情報', essential: '情報I', slug: 'joho' },
  '情報関係基礎': { category: '情報', essential: '情報関係基礎', slug: 'joho' },
  
  // その他（外国語等）
  'ドイツ語': { category: 'その他', essential: 'ドイツ語', slug: 'sonota' },
  'フランス語': { category: 'その他', essential: 'フランス語', slug: 'sonota' },
  '中国語': { category: 'その他', essential: '中国語', slug: 'sonota' },
  '韓国語': { category: 'その他', essential: '韓国語', slug: 'sonota' },
};

// 分類用教科名からスラッグへのマッピング
export const CATEGORY_TO_SLUG: Record<string, string> = {
  '国語': 'kokugo',
  '数学①': 'math1',
  '数学②': 'math2',
  '理科': 'rika',
  '理科基礎': 'rika-kiso',
  '社会': 'shakai',
  '英語（Reading）': 'eigo-reading',
  '英語（Listening）': 'eigo-listening',
  '情報': 'joho',
  'その他': 'sonota',
};

// スラッグから分類用教科名へのマッピング
export const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_SLUG).map(([k, v]) => [v, k])
);

export interface TestRecord {
  year: number | string; // 年度（数字または号外用の文字列）
  testType: 'main' | 'makeup'; // 本試験 or 追試験
  subject: string; // 教科（実態教科名）
  questionPdf: string; // 問題PDFファイル名
  answerPdf: string; // 解答PDFファイル名
  audio: string; // 音声ファイル名（空文字列の場合あり）
  pdfState: 1 | 2 | 3; // PDF状態: 1=正常, 2=一部欠損, 3=完全欠損
}

// 拡張されたTestRecord（表示用に分類用教科名と本質教科名を含む）
export interface EnhancedTestRecord extends TestRecord {
  categorySubject: string; // 分類用教科名
  essentialSubject: string; // 本質教科名
  priority: number; // ソート用の優先順位
}

// 教科の順序定義
export const SUBJECT_ORDER = [
  '国語',
  '数学①',
  '数学②',
  '理科',
  '理科基礎',
  '社会',
  '英語（Reading）',
  '英語（Listening）',
  '情報',
  'その他'
] as const;

// フィルタリング対象の教科と本質教科名のマッピング
export const FILTERABLE_SUBJECTS = {
  '理科': ['物理', '化学', '生物', '地学'],
  '理科基礎': ['物理基礎', '化学基礎', '生物基礎', '地学基礎'],
  '社会': ['地理', '日本史', '世界史', '現社', '倫理', '政経', '倫理・政経', '公共'],
  'その他': [] // その他は動的に決定
} as const;

// TSVデータをパースしてTestRecordの配列に変換
function parseTSV(tsv: string): TestRecord[] {
  const lines = tsv.split('\n').filter(line => line.trim());
  return lines.map(line => {
    const parts = line.split('\t');
    if (parts.length !== 7) {
      console.error('Invalid TSV line:', line);
      return null;
    }
    
    const [yearStr, testType, subject, questionPdf, answerPdf, audio, pdfStateStr] = parts;
    
    // 年度を数値または文字列に変換
    const year = /^\d+$/.test(yearStr) ? parseInt(yearStr, 10) : yearStr;
    
    // testTypeのバリデーション
    if (testType !== 'main' && testType !== 'makeup') {
      console.error('Invalid testType:', testType);
      return null;
    }
    
    // pdfStateを数値に変換
    const pdfState = parseInt(pdfStateStr, 10) as 1 | 2 | 3;
    if (![1, 2, 3].includes(pdfState)) {
      console.error('Invalid pdfState:', pdfStateStr);
      return null;
    }
    
    return {
      year,
      testType,
      subject,
      questionPdf,
      answerPdf,
      audio: audio || '',
      pdfState,
    };
  }).filter((record): record is TestRecord => record !== null);
}

// データベース（パース済み）
export const testDatabase: TestRecord[] = parseTSV(DATABASE_TSV);

// TestRecordをEnhancedTestRecordに変換
export function enhanceTestRecord(record: TestRecord): EnhancedTestRecord {
  const mapping = SUBJECT_MAPPING[record.subject];
  if (!mapping) {
    console.warn(`Unknown subject: ${record.subject}`);
    return {
      ...record,
      categorySubject: 'その他',
      essentialSubject: record.subject,
      priority: 999
    };
  }
  
  // 優先順位を決定（理科・理科基礎・社会・その他は本質教科名で決定）
  let priority = 1;
  const filterableKeys = Object.keys(FILTERABLE_SUBJECTS) as Array<keyof typeof FILTERABLE_SUBJECTS>;
  
  for (const key of filterableKeys) {
    const essentials = FILTERABLE_SUBJECTS[key];
    const index = essentials.indexOf(mapping.essential as any);
    if (index !== -1) {
      priority = index + 1;
      break;
    }
  }
  
  // その他の教科の場合は動的に優先順位を決定
  if (mapping.category === 'その他') {
    const otherSubjects = getOtherSubjectOrder();
    priority = otherSubjects.indexOf(mapping.essential) + 1;
  }
  
  return {
    ...record,
    categorySubject: mapping.category,
    essentialSubject: mapping.essential,
    priority,
  };
}

// 拡張されたデータベースを取得
export function getEnhancedDatabase(): EnhancedTestRecord[] {
  return testDatabase.map(enhanceTestRecord);
}

// ソート関数
export function sortTestRecords(records: EnhancedTestRecord[]): EnhancedTestRecord[] {
  return records.sort((a, b) => {
    // 1. 年度（数字のものを新しい順、文字列は最後）
    const yearA = typeof a.year === 'number' ? a.year : -Infinity;
    const yearB = typeof b.year === 'number' ? b.year : -Infinity;
    if (yearA !== yearB) return yearB - yearA;
    
    // 2. 教科順
    const subjectIndexA = SUBJECT_ORDER.indexOf(a.categorySubject as any);
    const subjectIndexB = SUBJECT_ORDER.indexOf(b.categorySubject as any);
    if (subjectIndexA !== subjectIndexB) return subjectIndexA - subjectIndexB;
    
    // 3. 優先順位
    if (a.priority !== b.priority) return a.priority - b.priority;
    
    // 4. 本試験・追試験
    if (a.testType !== b.testType) {
      return a.testType === 'main' ? -1 : 1;
    }
    
    return 0;
  });
}

// 年度一覧を取得（重複排除）
export function getYearList(): (number | string)[] {
  const years = Array.from(new Set(testDatabase.map(r => r.year)));
  const numericYears = years.filter(y => typeof y === 'number').sort((a, b) => (b as number) - (a as number));
  const specialYears = years.filter(y => typeof y === 'string');
  return [...numericYears, ...specialYears];
}

// 教科一覧を取得（SUBJECT_ORDERに従う）
export function getSubjectList(): string[] {
  const enhanced = getEnhancedDatabase();
  const subjects = Array.from(new Set(enhanced.map(r => r.categorySubject)));
  return SUBJECT_ORDER.filter(s => subjects.includes(s));
}

// その他の教科のフィルタリング順序を取得（データベース初出順）
export function getOtherSubjectOrder(): string[] {
  const otherSubjects: string[] = [];
  const seen = new Set<string>();
  
  // 拡張せずに生のデータベースから直接取得
  for (const record of testDatabase) {
    const mapping = SUBJECT_MAPPING[record.subject];
    if (mapping && mapping.category === 'その他' && !seen.has(mapping.essential)) {
      otherSubjects.push(mapping.essential);
      seen.add(mapping.essential);
    }
  }
  
  return otherSubjects;
}
