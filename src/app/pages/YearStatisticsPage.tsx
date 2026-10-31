import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
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
  const selected = records.filter(r => r.year === year).sort((a,b) => b.rate - a.rate);
  const comparison = (entry: Score) => {
    const previous = records.filter(r => r.year === entry.year - 1 && r.subject === entry.subject && r.max === entry.max);
    return previous.length === 1 ? entry.rate - previous[0].rate : null;
  };
  return (
    <>
      <SEOMeta path="/year-statistics" title="年度別・教科別の平均得点率比較｜共通テスト過去問総集"
        description="同年度の本試験を教科ごとに比較。平均点・満点・平均得点率・前年との差・受験者数を確認できます。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-4">年度別・教科別の平均得点率比較</h1>
          <p className="mb-5">その年に実施された本試験を対象に、科目別の平均点を満点で割った比率で表示します。満点が50点、100点、200点の科目も同じ単位で読み取れます。前年との比較は、科目名と満点が一致する資料が前年にちょうど1件ある場合だけ表示しています。</p>
          <label htmlFor="compare-year" className="block font-semibold mb-2">比較する年度</label>
          <select id="compare-year" className="bg-white border rounded p-2 mb-5" value={year ?? ''} onChange={e => setChosenYear(Number(e.target.value))}>
            {years.map(y => <option key={y} value={y}>{y}年度</option>)}
          </select>
          {selected.length ? <>
            <h2 className="text-xl font-bold mb-3">{year}年度：{selected.length}件の本試験統計</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead><tr className="bg-gray-50 border-b">
                  <th className="p-3">科目</th><th className="p-3">平均点／満点</th><th className="p-3 min-w-[140px]">平均得点率</th>
                  <th className="p-3">前年との差</th><th className="p-3">受験者数</th><th className="p-3">詳細</th>
                </tr></thead>
                <tbody>{selected.map(p => {
                  const delta = comparison(p);
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
          <h2 className="text-lg font-bold mt-6 mb-2">利用上の注意</h2>
          <p className="text-sm mb-3">この表は得点率の大小を示しますが、科目間の難易度ランキングではありません。選択科目ごとに受験者層や人数が異なります。前年との差も、その科目を受験した集団や試験範囲の違いを含みます。試験制度の移行年は特に注意してください。</p>
          <p className="text-sm mb-4">同じ年度・科目に複数の本試験記録がある場合は別々に掲載します。「—」は比較不能または未収録を表し、0点を意味しません。</p>
          <div className="flex gap-5 flex-wrap text-sm">
            <Link className="text-[var(--color-brand-green)] underline" to="/statistics">同一科目を年度で比較</Link>
            <Link className="text-[var(--color-brand-green)] underline" to="/coverage">収録状況</Link>
          </div>
        </section>
      </div>
    </>
  );
}
