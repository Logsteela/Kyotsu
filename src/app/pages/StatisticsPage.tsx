import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';

type Point = { year: number; average: number; max: number; questionPdf: string };
export function StatisticsPage() {
  const subjects = useMemo(() => {
    const grouped = new Map<string, Point[]>();
    const seen = new Set<string>();
    for (const record of getEnhancedDatabase()) {
      if (record.testType !== 'main' || typeof record.year !== 'number' || seen.has(record.questionPdf)) continue;
      seen.add(record.questionPdf);
      const d = getTestDetails(record.questionPdf);
      if (typeof d?.averageScore !== 'number' || typeof d.totalScore !== 'number' || d.totalScore <= 0) continue;
      const entries = grouped.get(record.subject) ?? [];
      entries.push({ year: record.year, average: d.averageScore, max: d.totalScore, questionPdf: record.questionPdf });
      grouped.set(record.subject, entries);
    }
    return [...grouped].filter(([, points]) => points.length >= 2)
      .map(([name, points]) => ({ name, points: points.sort((a, b) => b.year - a.year) }))
      .sort((a, b) => b.points.length - a.points.length || a.name.localeCompare(b.name, 'ja'));
  }, []);
  const [selected, setSelected] = useState('');
  const current = subjects.find(s => s.name === selected) ?? subjects[0];
  return (
    <>
      <SEOMeta title="科目別平均点の年度推移｜共通テスト過去問総集" path="/statistics"
        description="収録済みの本試験統計に基づき、年度ごとの平均点・満点・得点率を科目別に比較できます。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-5xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">科目別平均点の年度推移</h1>
          <p className="text-gray-700 leading-relaxed mb-5">サイト内の本試験記録から、平均点と満点が揃った年度を抽出しています。満点が変更された場合にも比較できるよう、平均得点率（平均点÷満点）を併記します。科目名が異なる試験は自動的に同一科目として扱いません。</p>
          <label htmlFor="stat-subject" className="block font-semibold mb-2">科目を選択</label>
          <select id="stat-subject" className="border rounded p-2 mb-5 max-w-full bg-white" value={current?.name ?? ''} onChange={e => setSelected(e.target.value)}>
            {subjects.map(s => <option key={s.name} value={s.name}>{s.name}（{s.points.length}年度）</option>)}
          </select>
          {current ? (
            <>
              <h2 className="text-xl font-bold mb-3">{current.name}：{current.points.length}年度分</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b bg-gray-50"><th className="p-3">年度</th><th className="p-3">平均点</th><th className="p-3">満点</th><th className="p-3">平均得点率</th><th className="p-3">資料</th></tr></thead>
                  <tbody>{current.points.map(p => <tr key={p.questionPdf} className="border-b">
                    <td className="p-3">{p.year}</td><td className="p-3">{p.average}</td><td className="p-3">{p.max}</td>
                    <td className="p-3">{(p.average / p.max * 100).toFixed(1)}%</td>
                    <td className="p-3"><Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(p.questionPdf)}`}>試験情報</Link></td>
                  </tr>)}</tbody>
                </table>
              </div>
            </>
          ) : <p>比較可能な統計データがありません。</p>}
          <p className="text-sm text-gray-600 mt-5">注意：得点率は難易度そのものを表すものではありません。年度ごとに試験内容、受験者集団、試験制度が異なります。追試験と平均点不明の資料はこの表から除外しています。</p>
        </section>
      </div>
    </>
  );
}
