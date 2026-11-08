import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';

type Score = { year: number; subject: string; questionPdf: string; average: number; max: number; rate: number; examinees: number | null };
export function YearStatisticsPage() {
  const records = useMemo(() => {
    const seen = new Set<string>();
    const arr: Score[] = [];
    for (const record of getEnhancedDatabase()) {
      if (typeof record.year !== 'number' || record.testType !== 'main' || seen.has(record.questionPdf)) continue;
      seen.add(record.questionPdf);
      const d = getTestDetails(record.questionPdf);
      if (typeof d?.averageScore !== 'number' || typeof d.totalScore !== 'number' || d.totalScore <= 0) continue;
      arr.push({
        year: record.year, subject: record.subject, questionPdf: record.questionPdf,
        average: d.averageScore, max: d.totalScore, rate: d.averageScore / d.totalScore * 100,
        examinees: typeof d.examinees === 'number' ? d.examinees : null,
      });
    }
    return arr;
  }, []);
  const years = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
  const [chosenYear, setChosenYear] = useState<number | null>(null);
  const year = chosenYear !== null && years.includes(chosenYear) ? chosenYear : years[0];
  const selected = records.filter(r => r.year === year).map(p => {
    const prior = records.filter(r => r.year === p.year - 1 && r.subject === p.subject && r.max === p.max);
    return { ...p, delta: prior.length === 1 ? p.rate - prior[0].rate : null };
  });
  const { sorted, sortKey, direction, sortBy } = useSortedRows(selected, 'rate');
  return (
    <>
      <SEOMeta path="/year-statistics" title="年度別・教科別の平均得点率比較｜共通テスト過去問総集"
        description="同年度の本試験を教科ごとに比較。平均点・満点・平均得点率・前年との差・受験者数を確認できます。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-4">年度別・教科別の平均得点率比較</h1>
          <label htmlFor="compare-year" className="block font-semibold mb-2">比較する年度</label>
          <select id="compare-year" className="bg-white border rounded p-2 mb-5" value={year ?? ''} onChange={e => setChosenYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}年度</option>)}
          </select>
          {selected.length ? <>
            <h2 className="text-xl font-bold mb-3">{year}年度：{selected.length}件の本試験統計</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="bg-gray-50 border-b">
                  <SortHeader label="科目" column="subject" {...{sortKey,direction}} onSort={sortBy} /><SortHeader label="平均点" column="average" {...{sortKey,direction}} onSort={sortBy} /><SortHeader label="平均得点率" column="rate" className="p-3 min-w-[140px]" {...{sortKey,direction}} onSort={sortBy} />
                  <SortHeader label="前年との差" column="delta" {...{sortKey,direction}} onSort={sortBy} /><SortHeader label="受験者数" column="examinees" {...{sortKey,direction}} onSort={sortBy} /><th className="p-3">詳細</th>
                </tr></thead>
                <tbody>{sorted.map(p => {
                  const delta = p.delta;
                  return <tr key={p.questionPdf} className="border-b">
                    <th className="p-3 font-medium">{p.subject}</th><td className="p-3">{p.average}／{p.max}</td>
                    <td className="p-3 tabular-nums">{p.rate.toFixed(1)}%<span className="block bg-gray-100 h-1.5 rounded mt-1" aria-hidden="true"><span className="block h-full rounded bg-[var(--color-brand-green)]" style={{width: `${Math.max(0, Math.min(100, p.rate))}%`}} /></span></td>
                    <td className="p-3 tabular-nums">{delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta.toFixed(1)}pt`}</td>
                    <td className="p-3">{p.examinees === null ? '—' : p.examinees.toLocaleString('ja-JP')}</td>
                    <td className="p-3"><Link to={`/test/${encodeURIComponent(p.questionPdf)}`} className="text-[var(--color-brand-green)] underline">資料</Link></td>
                  </tr>;
                })}</tbody>
              </table>
            </div>
          </> : <p>平均点・満点が揃う資料はありません。</p>}
          <div className="flex gap-5 flex-wrap text-sm">
            <Link className="text-[var(--color-brand-green)] underline" to="/statistics">同一科目を年度で比較</Link>
            <Link className="text-[var(--color-brand-green)] underline" to="/sources#research-methods">集計方法</Link>
          </div>
        </section>
      </div>
    </>
  );
}
