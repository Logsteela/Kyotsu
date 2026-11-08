import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import {
  COMMON_TEST_2026_SCHOOL_DIFFICULTY,
  COMMON_TEST_2026_ZKAI_SECTIONS,
} from '@/app/data/commonTest2026SchoolReviews';
import { COMMON_TEST_2025_ZKAI_SECTIONS } from '@/app/data/commonTest2025SchoolReviews';

export function CommonTestSchoolReviews({year, subject, testType}:{
  year:number|string; subject:string; testType:'main'|'makeup';
}) {
  if ((year!==2025 && year!==2026) || testType!=='main') return null;
  const schools=year===2026 ? COMMON_TEST_2026_SCHOOL_DIFFICULTY[subject] ?? [] : [];
  const zkai=year===2026 ? COMMON_TEST_2026_ZKAI_SECTIONS[subject]
    : COMMON_TEST_2025_ZKAI_SECTIONS[subject];
  const current=year===2026 ? COMMON_TEST_2026_RESEARCH[subject]?.parts.map(p=>({
    number:p.number,topic:p.topic,scoreRate:p.scoreRate,
  })) ?? [] : COMMON_TEST_GROUP_COMPARISONS[subject]?.groups.map(p=>({
    number:p.number,topic:p.topic,scoreRate:p.previousRate,
  })) ?? [];
  if (!schools.length && !zkai) return null;
  // The original school commentary and observed percentages are joined by
  // large-question number. Never invent measurements for unavailable years.
  const combined=zkai && current.length===zkai.ratings.length ?
    current.map((part,i)=>({ ...part, rating:zkai.ratings[i] })) : [];
  const lowest=combined.length ? combined.reduce((a,b)=>a.scoreRate<=b.scoreRate?a:b) : null;

  return <section className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6" aria-label="予備校の難易度判定">
    {schools.length>0 && <>
      <h2 className="text-lg font-semibold mb-3">予備校の難易度判定（前年との比較）</h2>
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm text-left">
          <thead><tr className="border-b border-gray-300">
            <th scope="col" className="p-2">予備校</th>
            <th scope="col" className="p-2">判定</th>
          </tr></thead>
          <tbody>{schools.map(x=><tr key={x.school} className="border-b last:border-0">
            <td className="p-2">{x.school}</td>
            <td className="p-2 font-semibold">{x.rating}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </>}
    {combined.length>0 && <>
      <h2 className="text-lg font-semibold mb-3">{year}年度・Z会の大問別評価と実測得点率</h2>
      <div className="overflow-x-auto mb-3"><table className="w-full text-sm text-left">
        <thead><tr className="border-b border-gray-300">
          <th scope="col" className="p-2">大問</th>
          <th scope="col" className="p-2">分野</th>
          <th scope="col" className="p-2">Z会評価</th>
          <th scope="col" className="p-2 text-right">実測得点率</th>
        </tr></thead>
        <tbody>{combined.map(part=><tr key={part.number} className="border-b last:border-0">
          <td className="p-2 whitespace-nowrap">第{part.number}問</td>
          <td className="p-2">{part.topic}</td>
          <td className="p-2 whitespace-nowrap">{part.rating}</td>
          <td className="p-2 text-right tabular-nums">{part.scoreRate.toFixed(2)}%</td>
        </tr>)}</tbody>
      </table></div>
      {lowest && <p className="text-sm mb-3">得点率最低：第{lowest.number}問 {lowest.scoreRate.toFixed(2)}%（Z会評価：{lowest.rating}）</p>}
    </>}
    {zkai?.notes.length ? <ul className="text-sm list-disc ml-5 space-y-1">
      {zkai.notes.map(note=><li key={note}>{note}</li>)}
    </ul> : null}
  </section>;
}
