import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';

type Point = { year: number; average: number; max: number; rate: number; examinees: number | null; questionPdf: string };
type Period = 'all' | 'kyotsu' | 'center' | 'first';
const periods: { value: Period; label: string }[] = [
  { value: 'all', label: '全期間' }, { value: 'kyotsu', label: '共通テスト期（2021年以降）' },
  { value: 'center', label: 'センター試験期（1990～2020年）' }, { value: 'first', label: '共通一次期・試行期（1989年以前）' },
];
function inPeriod(year: number, period: Period) {
  return period === 'all' || (period === 'kyotsu' && year >= 2021) ||
    (period === 'center' && year >= 1990 && year <= 2020) || (period === 'first' && year <= 1989);
}
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
      entries.push({ year: record.year, average: d.averageScore, max: d.totalScore,
        rate: d.averageScore / d.totalScore * 100, examinees: typeof d.examinees === 'number' ? d.examinees : null,
        questionPdf: record.questionPdf });
      grouped.set(record.subject, entries);
    }
    return [...grouped].filter(([, points]) => points.length >= 2)
      .map(([name, points]) => ({ name, points: points.sort((a, b) => b.year - a.year) }))
      .sort((a, b) => b.points.length - a.points.length || a.name.localeCompare(b.name, 'ja'));
  }, []);
  const [selected, setSelected] = useState('');
  const [period, setPeriod] = useState<Period>('all');
  const current = subjects.find(s => s.name === selected) ?? subjects[0];
  const points = current?.points.filter(p => inPeriod(p.year, period)) ?? [];
  const mean = points.length ? points.reduce((sum, p) => sum + p.rate, 0) / points.length : null;
  const max = points.length ? points.reduce((a, b) => a.rate > b.rate ? a : b) : null;
  const min = points.length ? points.reduce((a, b) => a.rate < b.rate ? a : b) : null;
  const uniqueYears = new Set(points.map(p => p.year)).size;
  return (
    <>
      <SEOMeta title="科目別平均点の年度推移と比較｜共通テスト過去問総集" path="/statistics"
        description="収録済みの本試験統計に基づき、科目・年代ごとの平均点、満点、平均得点率、受験者数を一覧比較します。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">科目別平均点の年度推移</h1>
          <p className="text-gray-700 leading-relaxed mb-5">本試験の記録から平均点と満点が揃った資料を抽出し、平均得点率（平均点÷満点）を計算しました。異なる科目名は勝手に統合せず、試験制度ごとに期間を絞り込めます。データは各年度の資料情報に紐付いています。</p>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div>
              <label htmlFor="stat-subject" className="block font-semibold mb-2">科目</label>
              <select id="stat-subject" className="border rounded p-2 max-w-full bg-white" value={current?.name ?? ''} onChange={e => setSelected(e.target.value)}>
                {subjects.map(s => <option key={s.name} value={s.name}>{s.name}（全{s.points.length}件）</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="stat-period" className="block font-semibold mb-2">集計期間</label>
              <select id="stat-period" className="border rounded p-2 max-w-full bg-white" value={period} onChange={e => setPeriod(e.target.value as Period)}>
                {periods.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
          {current ? (
            <>
              <h2 className="text-xl font-bold mb-3">{current.name}</h2>
              <p className="text-gray-700 mb-4">対象：{points.length}件・{uniqueYears}年度{mean !== null ? ` ／ 平均得点率の単純平均：${mean.toFixed(1)}%` : ''}</p>
              {max && min && points.length >= 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 text-sm">
                  <p className="border rounded p-3">記録中の最大平均得点率：<strong>{max.rate.toFixed(1)}%</strong>（{max.year}年度）</p>
                  <p className="border rounded p-3">記録中の最小平均得点率：<strong>{min.rate.toFixed(1)}%</strong>（{min.year}年度）</p>
                </div>
              )}
              {points.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead><tr className="border-b bg-gray-50"><th className="p-3">年度</th><th className="p-3">平均点</th><th className="p-3">満点</th><th className="p-3 min-w-[120px]">平均得点率</th><th className="p-3">受験者数</th><th className="p-3">出典・資料</th></tr></thead>
                    <tbody>{points.map(p => <tr key={p.questionPdf} className="border-b">
                      <td className="p-3">{p.year}</td><td className="p-3">{p.average}</td><td className="p-3">{p.max}</td>
                      <td className="p-3">
                        <span className="tabular-nums">{p.rate.toFixed(1)}%</span>
                        <span className="block h-1.5 bg-gray-100 rounded mt-1" aria-hidden="true">
                          <span className="block h-full bg-[var(--color-brand-green)] rounded" style={{ width: `${Math.min(100, Math.max(0, p.rate))}%` }} />
                        </span>
                      </td>
                      <td className="p-3">{p.examinees === null ? '—' : p.examinees.toLocaleString('ja-JP')}</td>
                      <td className="p-3"><Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(p.questionPdf)}`}>詳細</Link></td>
                    </tr>)}</tbody>
                  </table>
                </div>
              ) : <p className="py-6 text-gray-600">選択した期間には、比較可能な統計記録がありません。全期間を選択してください。</p>}
            </>
          ) : <p>比較可能な統計データがありません。</p>}
          <h2 className="text-lg font-semibold mt-7 mb-2">数値の読み方</h2>
          <p className="text-sm text-gray-700 mb-3">平均得点率は各試験の平均点を満点で割った比率です。表の集計値はサイトの保存データから再計算しています。単純平均は年度の重みづけや受験者数による補正を行っていません。最高・最低の年度も、問題の難易度を客観的に決めるものではありません。</p>
          <p className="text-sm text-gray-700 mb-3">同じ名前の科目でも試験制度・範囲・受験者集団が変化しています。古い試行試験や研究試験の数値は、一般の本試験と母集団が異なる可能性があります。追試験や平均点未公表の資料は除外し、科目の名称が違えば別集計です。</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link className="text-[var(--color-brand-green)] underline" to="/coverage">収録・欠損状況を確認</Link>
            <Link className="text-[var(--color-brand-green)] underline" to="/guide">試験制度の違い</Link>
          </div>
        </section>
      </div>
    </>
  );
}
