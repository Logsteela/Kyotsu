import { PREP_SCHOOL_EVALUATIONS } from '@/app/data/prepSchoolEvaluations';
import { Link } from 'react-router';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

export function CommonTest2025QuestionDetails({ year, subject }: {year: number|string; subject:string}) {
  const data = year === 2025 ? COMMON_TEST_GROUP_COMPARISONS[subject] : null;
  const rates = data?.groups ?? [];
  const schoolName = PREP_SCHOOL_EVALUATIONS['2025']?.[subject]?.zkai?.length;
  void schoolName;
  const optional = Boolean(data?.nonAdditive);
  const nonComparable = Boolean(data?.nonComparable);
  const mixedCurriculum = Boolean(data?.mixedCurriculum);
  const { sorted, sortKey, direction, sortBy } = useSortedRows(rates, 'number', 'asc');
  if(!data || !rates.length) return null;
  const max = rates.reduce((a,b)=>a.previousRate >= b.previousRate ? a:b);
  const min = rates.reduce((a,b)=>a.previousRate <= b.previousRate ? a:b);
  const next = getEnhancedDatabase().find(r=>r.year===2026 && r.testType==='main' && r.subject===subject);
  return (
    <section className="mt-5">
      <h3 className="text-base font-semibold mb-2">2025年度本試験・大問別の平均得点率</h3>
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
      {(optional || mixedCurriculum || nonComparable) && <p className="text-sm mb-3">
        {optional ? '※第4～7問は選択問題です（表の配点合計116点）。' :
          mixedCurriculum ? '※旧課程履修者は第5・6問から選択しています。' :
          '※2026年度とは大問の配点が異なります。'}
      </p>}
      {next && <Link className="text-[var(--color-brand-green)] text-sm underline" to={`/test/${encodeURIComponent(next.questionPdf)}`}>{nonComparable ? "2026年度の大問別得点率を見る（配点構成は異なります）" : "2026年度の大問別得点率と前年差を見る"}</Link>}
      {nonComparable && <p className="text-sm mt-3">{data.comment}</p>}
    </section>
  );
}
