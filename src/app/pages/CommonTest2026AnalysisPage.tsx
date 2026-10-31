import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

type Item = {
  subject: string; average: number | null; max: number | null; rate: number | null;
  questionPdf: string; groups: number; lowest: number; lowRate: number;
  highest: number; highRate: number; gap: number;
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
        highest:best.number, highRate:best.scoreRate, gap:best.scoreRate-worst.scoreRate });
    }
    return list;
  }, []);
  const [name, setName] = useState('');
  const selection = all.filter(v => v.subject.includes(name));
  const { sorted, sortKey, direction, sortBy } = useSortedRows(selection, 'subject', 'asc');
  return <>
    <SEOMeta path="/common-test-2026-analysis" title="2026年度共通テスト本試験・大問別正答率と出題分析"
      description="2026年度共通テスト本試験の23科目を横断比較。大問別得点率・正答率と問題評価の独自分析から個別試験ページへ移動。" />
    <main className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-6xl text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">2026年度共通テスト本試験・大問別の成績と分析</h1>
        <p className="mb-3">23科目について、大学入試センターの設問別得点率・正答率表に基づく大問別の集計値を比較します。各科目名を開くと、出題内容と問題評価報告書を照らし合わせた分析、大問別の数値表、得点分布の分析（資料のある科目）を読むことができます。</p>
        <p className="mb-5 text-sm">大問間の差は同じ科目の得点率が高い大問と低い大問の差です。大問の配点が異なる科目同士の難易度順位を示すものではありません。小問の正答率や考察は各詳細ページにまとめています。</p>
        <label htmlFor="analysis-search" className="block font-semibold mb-1">科目を絞り込み</label>
        <input id="analysis-search" value={name} onChange={e=>setName(e.target.value)}
          placeholder="例：英語、数学、歴史、物理" className="border rounded p-2 bg-white mb-4 max-w-full w-full sm:w-80" />
        <p className="text-sm mb-3">{selection.length}科目の研究データを表示。見出しをクリックすると並び替えられます。</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead><tr className="bg-gray-50 border-b">
              <SortHeader label="科目" column="subject" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="平均得点率" column="rate" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="大問数" column="groups" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="最も低い大問" column="lowRate" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="最も高い大問" column="highRate" {...{sortKey,direction}} onSort={sortBy} />
              <SortHeader label="大問間の差" column="gap" {...{sortKey,direction}} onSort={sortBy} />
            </tr></thead>
            <tbody>{sorted.map(row=><tr key={row.questionPdf} className="border-b">
              <th className="p-3 font-medium"><Link className="text-[var(--color-brand-green)] underline" to={`/test/${encodeURIComponent(row.questionPdf)}`}>{row.subject}</Link></th>
              <td className="p-3 tabular-nums">{row.rate === null ? '—' : `${row.rate.toFixed(2)}%`}</td>
              <td className="p-3">{row.groups}</td>
              <td className="p-3 tabular-nums">第{row.lowest}問 {row.lowRate.toFixed(2)}%</td>
              <td className="p-3 tabular-nums">第{row.highest}問 {row.highRate.toFixed(2)}%</td>
              <td className="p-3 tabular-nums">{row.gap.toFixed(2)}pt</td>
            </tr>)}</tbody>
          </table>
        </div>
        <h2 className="text-lg font-semibold mt-7 mb-2">全科目の大問の差を横断して読む</h2>
        <p className="text-sm mb-3">
          例えば英語リーディングでは第4問の79.92%と第7問の48.25%で31.67ポイント差、
          物理では第2問の53.78%と第4問の29.99%で23.79ポイント差があります。
          一方、化学の大問間の差は12.85ポイントです。どれも設問ごとの負荷の偏りを示す数字ですが、
          科目をまたいだ得点率の大小は、受験者集団の違いがあるため単純比較できません。
        </p>
        <p className="text-sm mb-4">数値の出典・集計方法と外部の一次資料は<Link to="/sources#research-methods" className="underline text-[var(--color-brand-green)]">共通の資料一覧</Link>にまとめています。各科目の試験詳細画面では外部サイトへのリンクを並べず、主要な数値と考察をこのサイト内に記載しています。</p>
      </article>
    </main>
  </>;
}
