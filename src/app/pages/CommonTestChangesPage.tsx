import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

type Entry = {
  subject: string; year: number; prevYear: number; prev: number; current: number;
  points: number; max: number; before: number; after: number; deltaRate: number;
  questionPdf: string; previousPdf: string;
};
export function CommonTestChangesPage() {
  const all = useMemo(() => {
    const bySubject = new Map<string, Array<{year:number; average:number; max:number; questionPdf:string}>>();
    const seen = new Set<string>();
    for (const r of getEnhancedDatabase()) {
      if (r.testType !== 'main' || typeof r.year !== 'number' || r.year < 2021 || r.year > 2026 || seen.has(r.questionPdf)) continue;
      seen.add(r.questionPdf);
      const d = getTestDetails(r.questionPdf);
      if (typeof d?.averageScore !== 'number' || typeof d.totalScore !== 'number' || d.totalScore <= 0) continue;
      bySubject.set(r.subject, [...(bySubject.get(r.subject) ?? []),
        { year:r.year, average:d.averageScore, max:d.totalScore, questionPdf:r.questionPdf }]);
    }
    const result: Entry[] = [];
    for (const [subject, points] of bySubject) {
      for (const p of points) {
        if (p.year === 2021) continue;
        const before = points.filter(q => q.year === p.year - 1 && q.max === p.max);
        const current = points.filter(q => q.year === p.year && q.max === p.max);
        if (before.length !== 1 || current.length !== 1) continue;
        const prev = before[0];
        result.push({
          subject, year:p.year, prevYear:prev.year, prev:prev.average, current:p.average,
          points:p.average - prev.average, max:p.max, before:prev.average / prev.max * 100,
          after:p.average / p.max * 100, deltaRate:(p.average - prev.average) / p.max * 100,
          questionPdf:p.questionPdf, previousPdf:prev.questionPdf,
        });
      }
    }
    return result;
  }, []);
  const [year, setYear] = useState(2026);
  const [search, setSearch] = useState('');
  const selection = all.filter(r => r.year === year && r.subject.includes(search));
  const { sorted, sortKey, direction, sortBy } = useSortedRows(selection, 'deltaRate');
  const plus = selection.length ? selection.reduce((a, b) => a.deltaRate > b.deltaRate ? a : b) : null;
  const minus = selection.length ? selection.reduce((a, b) => a.deltaRate < b.deltaRate ? a : b) : null;
  return (
    <>
      <SEOMeta path="/common-test-changes" title="共通テストの科目別・前年度平均点差｜2021〜2026年本試験" description="共通テスト本試験で同名・同配点の科目を比較。平均点の増減と平均得点率の前年差を年度別に集計。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-4">共通テスト本試験・平均点の前年差</h1>
          <p className="mb-4">共通テストが始まった2021年度以降の本試験について、前年と当年で科目名と配点が一致する記録だけを抽出しました。問題の難易度を機械的に推測するのではなく、実際に公表された平均点の変化を客観的に比較するための一覧です。</p>
          <div className="flex flex-wrap gap-4 items-end mb-6">
            <div><label htmlFor="trends-year" className="block font-semibold mb-1">年度</label>
              <select id="trends-year" className="bg-white border rounded p-2" value={year} onChange={e => setYear(Number(e.target.value))}>
                {[2026,2025,2024,2023,2022].map(y => <option key={y} value={y}>{y}年度</option>)}
              </select>
            </div>
            <div><label htmlFor="trends-query" className="block font-semibold mb-1">科目名で絞り込み</label>
              <input id="trends-query" className="border rounded p-2 bg-white" value={search} onChange={e => setSearch(e.target.value)} placeholder="例：数学、国語、物理" />
            </div>
          </div>
          <p className="text-sm mb-3">{year}年度：比較可能な記録 {selection.length}件</p>
          {plus && minus && !search && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
              <p className="border rounded bg-gray-50 p-3">平均得点率の増加が最大：<strong>{plus.subject} {plus.deltaRate > 0 ? '+' : ''}{plus.deltaRate.toFixed(2)}pt</strong></p>
              <p className="border rounded bg-gray-50 p-3">平均得点率の減少が最大：<strong>{minus.subject} {minus.deltaRate > 0 ? '+' : ''}{minus.deltaRate.toFixed(2)}pt</strong></p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead><tr className="bg-gray-50 border-b">
                <SortHeader label="科目" column="subject" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="前年平均" column="prev" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="当年平均" column="current" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="平均点差" column="points" {...{sortKey,direction}} onSort={sortBy} />
                <SortHeader label="得点率の差" column="deltaRate" {...{sortKey,direction}} onSort={sortBy} />
                <th className="p-3">試験情報</th>
              </tr></thead>
              <tbody>{sorted.map(r => <tr key={r.questionPdf} className="border-b">
                <td className="p-3 font-medium">{r.subject}</td>
                <td className="p-3">{r.prev}点</td><td className="p-3">{r.current}点</td>
                <td className="p-3 tabular-nums">{r.points > 0 ? '+' : ''}{r.points.toFixed(2)}点</td>
                <td className="p-3 tabular-nums">{r.deltaRate > 0 ? '+' : ''}{r.deltaRate.toFixed(2)}pt</td>
                <td className="p-3"><Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(r.questionPdf)}`}>当年</Link> ／ <Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(r.previousPdf)}`}>前年</Link></td>
              </tr>)}</tbody>
            </table>
          </div>
          {!selection.length && <p className="py-5 text-gray-600">この条件で比較可能な資料はありません。</p>}
          <h2 className="text-lg font-bold mt-6 mb-2">この表の読み方</h2>
          <p className="text-sm mb-3">「平均点差」は当年平均点−前年平均点、「得点率の差」は両年の平均得点率の差です。平均得点率は平均点÷満点で求めます。出題課程・形式・受験者層が変わる場合があるため、平均点の変化だけから難化・易化と断定できません。</p>
          <p className="text-sm mb-3">同じ年度の同名科目に複数の本試験記録がある場合、どれを通常日程として扱うか確認できないため自動比較から除外します。満点や科目名が変わった場合も強引に統合しません。</p>
          <p className="text-sm mb-4">2025年度は新課程に対応した科目構成となり、2026年度は大学入試センターが得点調整を実施しないと公表しています。異なる年度を比較する際は制度上の違いも確認してください。</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="https://www.dnc.ac.jp/kyotsu/suii/R3_.html" className="text-[var(--color-brand-green)] underline" target="_blank" rel="noopener noreferrer">公式の平均点・受験者数推移</a>
            <Link to="/statistics" className="text-[var(--color-brand-green)] underline">科目ごとの長期推移</Link>
          </div>
        </article>
      </div>
    </>
  );
}
