import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';
import { testDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import pdfManifest from '@/app/data/pdfManifest.json';

type Entry = { year: number | string; questionPdf: string; subject: string; examType: string; questionRegistered: boolean; answerRegistered: boolean; questionInManifest: boolean; answerInManifest: boolean; hasAverage: boolean; hasScore: boolean; hasSource: boolean };
const SOURCE_PATTERN = /(?:問題|解答|音源)：/;
function formatYear(year: string | number) { return typeof year === 'number' ? `${year}年度` : year; }

export function CoveragePage() {
  const data = useMemo(() => {
    const manifestFiles = new Set(pdfManifest.files);
    const items: Entry[] = testDatabase.map(record => {
      const d = getTestDetails(record.questionPdf);
      return {
        year: record.year, subject: record.subject, questionPdf: record.questionPdf, examType: record.testType,
        questionRegistered: Boolean(record.questionPdf), answerRegistered: Boolean(record.answerPdf),
        questionInManifest: manifestFiles.has(record.questionPdf), answerInManifest: manifestFiles.has(record.answerPdf),
        hasAverage: typeof d?.averageScore === 'number', hasScore: typeof d?.averageScore === 'number' && typeof d?.totalScore === 'number' && d.totalScore > 0,
        hasSource: SOURCE_PATTERN.test(d?.specialNotes || ''),
      };
    });
    const years = [...new Set(items.map(e => e.year))].sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') return b - a;
      return typeof a === 'number' ? -1 : typeof b === 'number' ? 1 : String(a).localeCompare(String(b), 'ja');
    });
    return {
      items,
      years: years.map(year => {
        const matching = items.filter(e => e.year === year);
        return { year, records: matching.length, main: matching.filter(e => e.examType === 'main').length,
          makeup: matching.filter(e => e.examType === 'makeup').length, source: matching.filter(e => e.hasSource).length,
          score: matching.filter(e => e.hasScore).length, questions: matching.filter(e => e.questionInManifest).length,
          answers: matching.filter(e => e.answerInManifest).length };
      }),
    };
  }, []);
  const [onlyNumeric, setOnlyNumeric] = useState(false);
  const rows = onlyNumeric ? data.years.filter(y => typeof y.year === 'number') : data.years;
  const { sorted, sortKey, direction, sortBy } = useSortedRows(rows, 'year');
  const count = (fn: (v: Entry) => boolean) => data.items.filter(fn).length;
  const main = count(v => v.examType === 'main');
  const makeup = count(v => v.examType === 'makeup');
  const sources = count(v => v.hasSource);
  const statistical = count(v => v.hasScore);
  const questions = count(v => v.questionInManifest);
  const answers = count(v => v.answerInManifest);
  return (
    <>
      <SEOMeta path="/coverage" title="収録状況・資料の確認状況｜共通テスト過去問総集"
        description="各年度の過去問収録件数、平均点が確認できる件数、出典記録とファイルの確認状況を集計した資料目録。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl leading-relaxed text-gray-800">
          <h1 className="text-2xl font-bold mb-4">収録状況と資料の確認状況</h1>
          <p className="mb-5">
            掲載済みの試験レコードを年度別に数え、問題・解答ファイルの登録状況、試験統計、
            出典の記録状況を示します。資料が収録されているかどうかを、利用前に確認するための一覧です。
            集計値はサイトのデータベースから自動的に算出しています。
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {[
              ['試験レコード', data.items.length],
              ['本試験の登録', main],
              ['追試験・特別枠の登録', makeup],
              ['問題が内部台帳に掲載', questions],
              ['解答が内部台帳に掲載', answers],
              ['平均点・満点あり', statistical],
              ['出典の記録あり', sources],
            ].map(([label, val]) => (
              <div key={String(label)} className="border rounded p-3 bg-gray-50">
                <div className="text-xs text-gray-600">{label}</div><div className="font-bold text-2xl">{Number(val).toLocaleString('ja-JP')}</div>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-bold mb-3">年度別の内訳</h2>
          <label className="inline-flex items-center gap-2 text-sm mb-4"><input type="checkbox" checked={onlyNumeric} onChange={e => setOnlyNumeric(e.target.checked)} />通常の年度のみ表示</label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-gray-50 border-b">
                <SortHeader label="年度・資料群" column="year" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="登録" column="records" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="本試験" column="main" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="追試等" column="makeup" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="問題台帳" column="questions" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="解答台帳" column="answers" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="平均点" column="score" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="出典記録" column="source" className="p-2" {...{sortKey,direction}} onSort={sortBy} />
              </tr></thead>
              <tbody>{sorted.map(y => (
                <tr key={String(y.year)} className="border-b">
                  <th className="p-2 font-medium"><Link className="text-[var(--color-brand-green)] underline" to={`/year/${encodeURIComponent(String(y.year))}`}>{formatYear(y.year)}</Link></th>
                  <td className="p-2">{y.records}</td><td className="p-2">{y.main}</td><td className="p-2">{y.makeup}</td>
                  <td className="p-2">{y.questions}</td><td className="p-2">{y.answers}</td><td className="p-2">{y.score}</td><td className="p-2">{y.source}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <h2 className="text-xl font-bold mt-7 mb-2">集計の定義</h2>
          <p className="mb-3">「登録」は1つの試験問題ファイルを1件として数えます。英語などの異なる形式や、年度ごとの試行・試作問題も含まれます。「問題台帳」「解答台帳」は内部ファイル台帳とのファイル名一致件数です。台帳に載っていない資料でも実際には公開されている場合があり、逆に台帳への登録はリンクの通信成功や内容の正確性を保証しません。</p>
          <p className="mb-3">「平均点」は平均点と満点の両方が数値として登録されている件数です。追試験などで統計の公表がない場合は空欄になります。「出典記録」は提供元の記載の有無であり、転載・二次利用の許諾取得を意味しません。</p>
          <p className="mb-3">試験年度や科目体系が異なるデータは単純比較できません。登録数が少ない資料群もあります。欠損や収録ミスを見つけた場合は右下のヘルプからお知らせください。</p>
          <div className="flex flex-wrap gap-4 text-[var(--color-brand-green)]">
            <Link className="underline" to="/statistics">平均点の年度推移</Link>
            <Link className="underline" to="/guide">資料を探す方法</Link>
            <Link className="underline" to="/about">収録方針</Link>
          </div>
        </article>
      </div>
    </>
  );
}
