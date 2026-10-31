import { COMMON_TEST_2025_SOCIAL_AREAS } from '@/app/data/commonTest2025SocialAreas';

export function CommonTest2025SocialReview({ year, subject }: {year:number|string;subject:string}) {
  const item=year===2025 ? COMMON_TEST_2025_SOCIAL_AREAS[subject] : null;
  if(!item) return null;
  const max=item.groups.reduce((n,g)=>n+g.points,0);
  return <section className="mt-6 border-t pt-5">
    <h3 className="text-lg font-semibold mb-2">2025年度・大問別の出題と設問分析</h3>
    <p className="text-sm leading-relaxed mb-4">この科目は3つの領域から2つを選んで解答する試験の50点部分です。
      配点合計は{max}点。大問の正答率・得点率を未確認のため、値は推定せず、問題講評を踏まえて大問ごとの内容と必要な判断を整理しました。</p>
    <div className="space-y-3 mb-4">
      {item.groups.map(g=><div key={g.number} className="border-b pb-3">
        <h4 className="text-sm font-semibold mb-1">第{g.number}問：{g.topic}（{g.points}点）</h4>
        <p className="text-sm leading-relaxed">{g.summary}</p>
      </div>)}
    </div>
    <h4 className="font-semibold mb-2">全体から見える特徴</h4>
    <p className="text-sm leading-relaxed mb-3">{item.observation}</p>
    <p className="text-sm leading-relaxed mb-3">{item.caution}</p>
    <p className="text-xs text-gray-600">問題講評の元資料の所在はサイト内の「資料の出典」に集約しています。</p>
  </section>;
}
