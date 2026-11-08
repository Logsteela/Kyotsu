import { COMMON_TEST_SOCIAL_DISTRIBUTION } from '@/app/data/commonTest2026SocialDistribution';

export function CommonTest2026SocialDistribution({subject}:{subject:string}) {
  const stat=COMMON_TEST_SOCIAL_DISTRIBUTION[subject];
  if (!stat) return null;
  const diff=stat.previous80 === null ? null : stat.above80-stat.previous80;
  return <section className="mt-5 border-t pt-4">
    <h3 className="text-base font-semibold mb-3">得点分布（2026年度本試験）</h3>
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
    {diff!==null && <p className="text-sm mb-3">80点以上の前年差：<strong>{diff>=0?'+':''}{diff.toFixed(2)}ポイント</strong></p>}
  </section>;
}
