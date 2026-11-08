import { COMMON_TEST_2025_SOCIAL_AREAS } from '@/app/data/commonTest2025SocialAreas';

export function CommonTest2025SocialReview({ year, subject }: {year:number|string;subject:string}) {
  const item=year===2025 ? COMMON_TEST_2025_SOCIAL_AREAS[subject] : null;
  if(!item) return null;
  const max=item.groups.reduce((n,g)=>n+g.points,0);
  return <section className="mt-6 border-t pt-5">
    <h3 className="text-lg font-semibold mb-2">2025年度・大問別の出題と設問分析</h3>
    <p className="text-sm mb-3">3領域から2領域選択（この表は{max}点分）。</p>
    <div className="space-y-3 mb-4">
      {item.groups.map(g=><div key={g.number} className="border-b pb-3">
        <h4 className="text-sm font-semibold mb-1">第{g.number}問：{g.topic}（{g.points}点）</h4>
        <p className="text-sm leading-relaxed">{g.summary}</p>
      </div>)}
    </div>
    <h4 className="font-semibold mb-2">問題評価</h4>
    <p className="text-sm leading-relaxed mb-3">{item.observation}</p>
    <p className="text-sm leading-relaxed mb-3">{item.caution}</p>
  </section>;
}
