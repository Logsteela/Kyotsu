import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import { COMMON_TEST_2026_FOREIGN_LANGUAGES } from '@/app/data/commonTest2026ForeignLanguages';
import { getDifficultyAppropriateness } from '@/app/data/commonTest2026Evaluations';
import { SortHeader } from '@/app/components/SortHeader';
import { SchoolReviewSubjectComparison } from '@/app/components/SchoolReviewSubjectComparison';
import { useSortedRows } from '@/app/utils/useSortedRows';

type Item = {
  subject: string; average: number | null; max: number | null; rate: number | null;
  questionPdf: string; groups: number; lowest: number; lowRate: number;
  highest: number; highRate: number; gap: number; rating: number;
};
export function CommonTest2026AnalysisPage() {
  const all = useMemo(() => {
    const subjects = COMMON_TEST_2026_RESEARCH;
    const records = getEnhancedDatabase();
    const list: Item[] = [];
    for (const [subject, entry] of Object.entries(subjects)) {
      const matching = records.filter(r => r.year === 2026 && r.testType === 'main' && r.subject === subject);
      if (matching.length !== 1) continue;
      const r = matching[0];
      const details = getTestDetails(r.questionPdf);
      const best = entry.parts.reduce((a,b) => a.scoreRate >= b.scoreRate ? a : b);
      const worst = entry.parts.reduce((a,b) => a.scoreRate <= b.scoreRate ? a : b);
      const max = typeof details?.totalScore === 'number' ? details.totalScore : null;
      const average = typeof details?.averageScore === 'number' ? details.averageScore : null;
      list.push({ subject, questionPdf:r.questionPdf, average, max,
        rate: average !== null && max ? average / max * 100 : null,
        groups:entry.parts.length, lowest:worst.number, lowRate:worst.scoreRate,
        highest:best.number, highRate:best.scoreRate, gap:best.scoreRate-worst.scoreRate,
        rating:getDifficultyAppropriateness(subject) });
    }
    return list;
  }, []);
  const groupChanges = Object.entries(COMMON_TEST_GROUP_COMPARISONS).map(([subject, prior]) => {
    const recent = COMMON_TEST_2026_RESEARCH[subject];
    if (!recent || prior.nonComparable) return null;
    const pairs = prior.groups.flatMap(old => {
      const now = recent.parts.find(p => p.number === old.number && p.points === old.points);
      if (!now) return [];
      const delta = now.scoreRate - old.previousRate;
      return [{ number: old.number, points: old.points, delta, contribution: old.points * delta / 100 }];
    });
    if (pairs.length !== prior.groups.length) return null;
    const largest = pairs.reduce((a,b)=>Math.abs(a.delta) >= Math.abs(b.delta) ? a : b);
    const nowRec = getEnhancedDatabase().find(r=>r.year===2026 && r.testType==='main' && r.subject===subject);
    if (!nowRec) return null;
    return { subject, largest, paired: pairs.length, nonAdditive:Boolean(prior.nonAdditive), url:`/test/${encodeURIComponent(nowRec.questionPdf)}` };
  }).filter((x): x is NonNullable<typeof x> => x !== null);
  const [name, setName] = useState('');
  const selection = all.filter(v => v.subject.includes(name));
  const { sorted, sortKey, direction, sortBy } = useSortedRows(selection, 'subject', 'asc');
  return <>
    <SEOMeta path="/common-test-2026-analysis" title="2026年度共通テスト本試験・大問別正答率と出題分析"
      description="2026年度共通テスト本試験の23科目の大問得点率と外国語4科目の出題評価を比較。大問別得点率・正答率と問題評価の独自分析から個別試験ページへ移動。" />
    <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">2026年度共通テスト本試験・大問別の成績と分析</h1>
        <p className="mb-3">大問別得点率・正答率：23科目 ／ 問題評価：外国語4科目</p>
        <label htmlFor="analysis-search" className="block font-semibold mb-1">科目を絞り込み</label>
        <input id="analysis-search" value={name} onChange={e=>setName(e.target.value)}
          placeholder="例：英語、数学、歴史、物理" className="border rounded p-2 bg-white mb-4 max-w-full w-full sm:w-80" />
        <p className="text-sm mb-3">{selection.length}科目</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="bg-gray-50 border-b">
              <SortHeader label="科目" column="subject" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="平均得点率" column="rate" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="大問数" column="groups" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="最も低い大問" column="lowRate" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="最も高い大問" column="highRate" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="大問間の差" column="gap" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="外部評価分科会" column="rating" {...{sortKey,direction}} onSort={sortBy} />
            </tr></thead>
            <tbody>{sorted.map(row=><tr key={row.questionPdf} className="border-b">
              <th className="p-3 font-medium"><Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(row.questionPdf)}`}>{row.subject}</Link></th>
              <td className="p-3 tabular-nums">{row.rate === null ? '—' : `${row.rate.toFixed(2)}%`}</td>
              <td className="p-3">{row.groups}</td>
              <td className="p-3 tabular-nums">第{row.lowest}問 {row.lowRate.toFixed(2)}%</td>
              <td className="p-3 tabular-nums">第{row.highest}問 {row.highRate.toFixed(2)}%</td>
              <td className="p-3 tabular-nums">{row.gap.toFixed(2)}pt</td>
              <td className="p-3 tabular-nums">{row.rating}／4</td>
            </tr>)}</tbody>
          </table>
        </div>
        <h2 className="text-lg font-semibold mt-7 mb-2">外国語4科目：大問別の問題評価</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {Object.entries(COMMON_TEST_2026_FOREIGN_LANGUAGES).map(([subject, note]) => {
            const record = getEnhancedDatabase().find(r => r.year === 2026 && r.testType === 'main' && r.subject === subject);
            if (!record) return null;
            return <div key={subject} className="border rounded p-4 bg-gray-50">
              <h3 className="font-semibold mb-2"><Link to={`/test/${encodeURIComponent(record.questionPdf)}`} className="underline text-[var(--color-brand-green)]">{subject}（{note.sections.length}大問）</Link></h3>
              <p className="text-xs text-gray-600 mb-2">外部評価分科会：{getDifficultyAppropriateness(subject)}／4</p>
              <p className="text-sm leading-relaxed">{note.observation}</p>
            </div>;
          })}
        </div>
        <h2 className="text-lg font-semibold mt-7 mb-2">2025年度と大問別で比較できる科目</h2>
        <p className="text-sm mb-3">最大変化：得点率の前年差（絶対値）が最大の大問</p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm text-left">
            <thead><tr className="bg-gray-50 border-b"><th className="p-3">科目</th><th className="p-3">比較大問数</th><th className="p-3">変化最大の大問</th><th className="p-3">前年差</th><th className="p-3">平均点への寄与</th></tr></thead>
            <tbody>{groupChanges.map(entry=><tr key={entry.subject} className="border-b">
              <th className="p-3"><Link className="underline text-[var(--color-brand-green)]" to={entry.url}>{entry.subject}</Link></th>
              <td className="p-3">{entry.paired}</td>
              <td className="p-3">第{entry.largest.number}問</td>
              <td className="p-3 tabular-nums">{entry.largest.delta > 0 ? '+' : ''}{entry.largest.delta.toFixed(2)}pt</td>
              <td className="p-3 tabular-nums">{entry.nonAdditive ? '—（選択式）' : `${entry.largest.contribution > 0 ? '+' : ''}${entry.largest.contribution.toFixed(2)}点`}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <p className="text-xs text-gray-600 mb-6">※数学Ⅱ・B・Cの選択大問は、平均点への寄与を算出していません。</p>
        <h2 className="text-lg font-semibold mt-7 mb-2">大問間の得点率差</h2>
        <p className="text-sm mb-3">
          例えば英語リーディングでは第4問の79.92%と第7問の48.25%で31.67ポイント差、
          物理では第2問の53.78%と第4問の29.99%で23.79ポイント差があります。
          化学の大問間の差は12.85ポイントでした。
        </p>
        <SchoolReviewSubjectComparison year={2026} />
      </article>
    </main>
  </>;
}
