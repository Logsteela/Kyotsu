import { COMMON_TEST_SOCIAL_DISTRIBUTION } from '@/app/data/commonTest2026SocialDistribution';

export function CommonTest2026SocialDistribution({subject}:{subject:string}) {
  const stat=COMMON_TEST_SOCIAL_DISTRIBUTION[subject];
  if (!stat) return null;
  const diff=stat.previous80 === null ? null : stat.above80-stat.previous80;
  return <section className="mt-5 border-t pt-4">
    <h3 className="text-base font-semibold mb-3">得点分布から分かること（2026年度本試験）</h3>
    <p className="text-sm leading-relaxed mb-4">
      平均点だけでは分からない上位得点帯の割合や、受験者を得点順に5等分した境界を示します。
      得点の割合は科目を受験した集団に対する実測値です。
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
      <div className="border rounded p-3 bg-gray-50"><span className="block text-xs text-gray-600">80点以上</span><strong className="text-xl tabular-nums">{stat.above80.toFixed(2)}%</strong></div>
      <div className="border rounded p-3 bg-gray-50"><span className="block text-xs text-gray-600">90点以上</span><strong className="text-xl tabular-nums">{stat.above90.toFixed(2)}%</strong></div>
      <div className="border rounded p-3 bg-gray-50"><span className="block text-xs text-gray-600">上位20%の境界</span><strong className="text-xl tabular-nums">{stat.quintiles[3]}点付近</strong></div>
    </div>
    <div className="overflow-x-auto mb-3">
      <table className="w-full text-sm text-left">
        <thead><tr className="bg-gray-50 border-b"><th className="p-2">受験者を5等分した境界</th><th className="p-2">得点</th></tr></thead>
        <tbody>{stat.quintiles.map((v,j)=><tr key={j} className="border-b"><th className="p-2 font-medium">下位{(j+1)*20}%の境目</th><td className="p-2 tabular-nums">{v}点</td></tr>)}</tbody>
      </table>
    </div>
    {diff!==null && <p className="text-sm mb-3">80点以上の割合は2025年度の{stat.previous80?.toFixed(2)}%から2026年度の{stat.above80.toFixed(2)}%へ{diff>=0?'+':''}{diff.toFixed(2)}ポイント変わりました。得点帯の変化は、問題内容と受験者の構成の双方に影響されます。</p>}
    <p className="text-sm leading-relaxed mb-3">
      この科目の上位20%の境界は{stat.quintiles[3]}点付近ですが、
      80点以上の割合は{stat.above80.toFixed(2)}%です。
      得点分布は正規分布とは限らないため、平均点と標準偏差だけから上位何％かを正確に推定できません。
      また科目間で受験者が異なるため、割合の違いを問題の難易度順位とみなすことはできません。
    </p>
  </section>;
}
