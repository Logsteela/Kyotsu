import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import {
  COMMON_TEST_2026_SCHOOL_DIFFICULTY,
  COMMON_TEST_2026_ZKAI_SECTIONS,
} from '@/app/data/commonTest2026SchoolReviews';

export function CommonTestSchoolReviews({year, subject, testType}:{
  year:number|string; subject:string; testType:'main'|'makeup';
}) {
  if (year!==2026 || testType!=='main') return null;
  const schools=COMMON_TEST_2026_SCHOOL_DIFFICULTY[subject] ?? [];
  const zkai=COMMON_TEST_2026_ZKAI_SECTIONS[subject];
  const groups=COMMON_TEST_2026_RESEARCH[subject]?.parts ?? [];
  if (!schools.length && !zkai) return null;
  const matched=zkai && groups.length===zkai.ratings.length;
  const lowest=matched && groups.length
    ? groups.reduce((a,b)=>a.scoreRate<=b.scoreRate?a:b)
    : null;

  return <section className="bg-white rounded-lg border border-gray-200 p-5 sm:p-6" aria-label="予備校の難易度判定">
    <h2 className="text-lg font-semibold mb-3">予備校の難易度判定（2025年度比）</h2>
    {schools.length>0 && <div className="overflow-x-auto mb-5">
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
    </div>}
    {matched && <>
      <h3 className="font-semibold mb-2">Z会の大問別評価と実測得点率</h3>
      <div className="overflow-x-auto mb-3"><table className="w-full text-sm text-left">
        <thead><tr className="border-b border-gray-300">
          <th scope="col" className="p-2">大問</th>
          <th scope="col" className="p-2">分野</th>
          <th scope="col" className="p-2">Z会評価</th>
          <th scope="col" className="p-2 text-right">実測得点率</th>
        </tr></thead>
        <tbody>{groups.map((group,i)=><tr key={group.number} className="border-b last:border-0">
          <td className="p-2 whitespace-nowrap">第{group.number}問</td>
          <td className="p-2">{group.topic}</td>
          <td className="p-2 whitespace-nowrap">{zkai.ratings[i]}</td>
          <td className="p-2 text-right tabular-nums">{group.scoreRate.toFixed(2)}%</td>
        </tr>)}</tbody>
      </table></div>
      {lowest && <p className="text-sm mb-3">実測得点率が最も低いのは第{lowest.number}問（{lowest.scoreRate.toFixed(2)}%・Z会評価：{zkai.ratings[groups.findIndex(p=>p.number===lowest.number)]}）。</p>}
      {zkai.notes.length>0 && <ul className="text-sm list-disc ml-5 space-y-1">
        {zkai.notes.map(note=><li key={note}>{note}</li>)}
      </ul>}
    </>}
  </section>;
}
