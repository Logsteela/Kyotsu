import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import { COMMON_TEST_2025_SOCIAL_AREAS } from '@/app/data/commonTest2025SocialAreas';
import { COMMON_TEST_2025_FOREIGN_LANGUAGES } from '@/app/data/commonTest2025ForeignLanguages';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

type Summary = {
  subject: string; questionPdf: string; kind: '得点率' | '問題評価';
  groupCount: number; average: number | null; rate: number | null;
  high: number | null; low: number | null; gap: number | null;
};
export function CommonTest2025AnalysisPage() {
  const all = useMemo(() => {
    const data = getEnhancedDatabase();
    const result: Summary[] = [];
    const subjects = [...new Set([...Object.keys(COMMON_TEST_GROUP_COMPARISONS),
      ...Object.keys(COMMON_TEST_2025_SOCIAL_AREAS),...Object.keys(COMMON_TEST_2025_FOREIGN_LANGUAGES)])];
    for (const subject of subjects) {
      const matches = data.filter(r => r.year === 2025 && r.testType === 'main' && r.subject === subject);
      if (matches.length !== 1) continue;
      const r = matches[0], detail = getTestDetails(r.questionPdf);
      const prior = COMMON_TEST_GROUP_COMPARISONS[subject];
      const groups = prior?.groups ?? [];
      const highest = groups.length ? Math.max(...groups.map(p=>p.previousRate)) : null;
      const lowest = groups.length ? Math.min(...groups.map(p=>p.previousRate)) : null;
      const average = typeof detail?.averageScore === 'number' ? detail.averageScore : null;
      const maxScore = typeof detail?.totalScore === 'number' ? detail.totalScore : null;
      result.push({subject,questionPdf:r.questionPdf,kind:prior?'得点率':'問題評価',
        groupCount:prior ? groups.length : (COMMON_TEST_2025_SOCIAL_AREAS[subject]?.groups.length ??
          COMMON_TEST_2025_FOREIGN_LANGUAGES[subject]?.sections.length ?? 0),
        average,rate:average!==null && maxScore ? average/maxScore*100:null,
        high:highest,low:lowest,gap:highest!==null&&lowest!==null?highest-lowest:null});
    }
    return result;
  },[]);
  const [search,setSearch]=useState('');
  const [show, setShow]=useState('all');
  const rows=all.filter(e=>e.subject.includes(search) && (show==='all'||e.kind===show));
  const { sorted,sortKey,direction,sortBy }=useSortedRows(rows,'subject','asc');
  return <>
    <SEOMeta path="/common-test-2025-analysis" title="2025年度共通テスト本試験・大問得点率と問題評価の分析"
      description="2025年度共通テスト本試験27科目の大問得点率と出題内容を比較。大問別成績20科目と評価報告書による7科目の分析。"/>
    <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">2025年度共通テスト本試験・大問別の分析</h1>
        <p className="mb-4">新課程の共通テストが始まった2025年度の本試験27科目を整理しました。20科目は大問別の得点率・配点に基づく分析、7科目は問題評価や大問の題材を調べた分析です。元の資料へ移動せず、各科目の試験詳細ページで内容を確認できます。</p>
        <p className="text-sm mb-5">得点率が未確認の科目には平均得点率と大問構成のみを示し、大問の数値を推定で補完していません。大問の得点率の大小だけから受験者集団の異なる科目の難易度は比較できません。</p>
        <div className="flex flex-wrap gap-3 mb-5">
          <label className="text-sm">科目名
            <input className="block p-2 mt-1 border bg-white rounded" placeholder="例：情報、歴史、化学" value={search} onChange={e=>setSearch(e.target.value)}/>
          </label>
          <label className="text-sm">掲載データ
            <select className="block p-2 mt-1 border bg-white rounded" value={show} onChange={e=>setShow(e.target.value)}>
              <option value="all">すべて</option><option value="得点率">大問得点率あり</option><option value="問題評価">問題評価による分析</option>
            </select>
          </label>
        </div>
        <p className="text-sm mb-2">{rows.length}科目を表示。列見出しで並び替え可能です。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="bg-gray-50 border-b">
              <SortHeader label="科目" column="subject" {...{sortKey,direction}} onSort={sortBy}/>
              <SortHeader label="平均得点率" column="rate" {...{sortKey,direction}} onSort={sortBy}/>
              <SortHeader label="大問数" column="groupCount" {...{sortKey,direction}} onSort={sortBy}/>
              <SortHeader label="最低の大問得点率" column="low" {...{sortKey,direction}} onSort={sortBy}/>
              <SortHeader label="最高の大問得点率" column="high" {...{sortKey,direction}} onSort={sortBy}/>
              <SortHeader label="大問間の差" column="gap" {...{sortKey,direction}} onSort={sortBy}/>
            </tr></thead>
            <tbody>{sorted.map(e=><tr key={e.questionPdf} className="border-b">
              <th className="p-3"><Link to={`/test/${encodeURIComponent(e.questionPdf)}`} className="underline text-[var(--color-brand-green)]">{e.subject}</Link><span className="block text-xs font-normal text-gray-600">{e.kind === '得点率' ? '実測の大問統計' : '出題内容・教員評価'}</span></th>
              <td className="p-3">{e.rate===null?'—':`${e.rate.toFixed(2)}%`}</td>
              <td className="p-3">{e.groupCount}</td>
              <td className="p-3">{e.low===null?'—':`${e.low.toFixed(2)}%`}</td>
              <td className="p-3">{e.high===null?'—':`${e.high.toFixed(2)}%`}</td>
              <td className="p-3">{e.gap===null?'—':`${e.gap.toFixed(2)}pt`}</td>
            </tr>)}</tbody>
          </table>
        </div>
        <h2 className="font-semibold text-lg mt-7 mb-3">2026年度との比較</h2>
        <p className="text-sm mb-3">2025年度と2026年度の大問別得点率が正確に対応する14科目については、2026年度の各試験ページで、変化が大きい大問と科目平均点への寄与（算出可能な場合のみ）を表示しています。旧課程選択や配点変更がある科目では安易に合計しません。</p>
        <Link className="underline text-[var(--color-brand-green)] text-sm" to="/common-test-2026-analysis">2026年度の27科目分析と前年との比較</Link>
      </article>
    </main>
  </>;
}
