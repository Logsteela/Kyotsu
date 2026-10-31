import { Link } from 'react-router';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

export function CommonTest2025QuestionDetails({ year, subject }: {year: number|string; subject:string}) {
  const data = year === 2025 ? COMMON_TEST_GROUP_COMPARISONS[subject] : null;
  const rates = data?.groups ?? [];
  const optional = Boolean(data?.nonAdditive);
  const nonComparable = Boolean(data?.nonComparable);
  const { sorted, sortKey, direction, sortBy } = useSortedRows(rates, 'number', 'asc');
  if(!data || !rates.length) return null;
  const max = rates.reduce((a,b)=>a.previousRate >= b.previousRate ? a:b);
  const min = rates.reduce((a,b)=>a.previousRate <= b.previousRate ? a:b);
  const next = getEnhancedDatabase().find(r=>r.year===2026 && r.testType==='main' && r.subject===subject);
  return (
    <section className="mt-5">
      <h3 className="text-base font-semibold mb-2">2025年度本試験・大問別の平均得点率</h3>
      <p className="text-sm leading-relaxed mb-3">
        2025年度の設問別得点率データを大問単位に整理しました。得点率は大問の平均点÷配点です。
        最も高かったのは第{max.number}問（{max.previousRate.toFixed(2)}%）、
        最も低かったのは第{min.number}問（{min.previousRate.toFixed(2)}%）でした。
      </p>
      <div className="overflow-x-auto mb-3">
        <table className="w-full text-sm text-left">
          <thead><tr className="bg-gray-50 border-b">
            <SortHeader label="大問" column="number" {...{sortKey,direction}} onSort={sortBy} />
            <th className="p-3">出題領域</th>
            <SortHeader label="配点" column="points" {...{sortKey,direction}} onSort={sortBy} />
            <SortHeader label="得点率" column="previousRate" {...{sortKey,direction}} onSort={sortBy} />
          </tr></thead>
          <tbody>{sorted.map(p=><tr className="border-b" key={p.number}>
            <th className="p-3">第{p.number}問</th>
            <td className="p-3">{p.topic}</td>
            <td className="p-3 tabular-nums">{p.points}点</td>
            <td className="p-3 tabular-nums">{p.previousRate.toFixed(2)}%</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="text-sm mb-3">{optional ? 'この科目は4つの選択大問から3つを選ぶ方式です。表の全大問を合計すると116点となり、100点満点の科目平均を再現できません。' : nonComparable ? '2025年と2026年で大問配点が変更されたため、2026年との大問別平均点への寄与は算出しません。' : '大問の配点と得点率を掛け合わせると、科目全体の平均点を概ね再現できます。'}
        同じ大問番号でも2026年度は問題が変わるため、得点率の大小がそのまま難易度差を表すとは限りません。</p>
      {next && <Link className="text-[var(--color-brand-green)] text-sm underline" to={`/test/${encodeURIComponent(next.questionPdf)}`}>{nonComparable ? "2026年度の大問別得点率を見る（配点構成は異なります）" : "2026年度の大問別得点率と前年差を見る"}</Link>}
      {nonComparable && <p className="text-sm mt-3">{data.comment}</p>}
    </section>
  );
}
