import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

export function CommonTestQuestionDetails({ year, subject }: { year: number | string; subject: string }) {
  const record = year === 2026 ? COMMON_TEST_2026_RESEARCH[subject] : undefined;
  if (!record) return null;
  const highest = record.parts.reduce((a,b) => a.scoreRate >= b.scoreRate ? a : b);
  const lowest = record.parts.reduce((a,b) => a.scoreRate <= b.scoreRate ? a : b);
  const difference = highest.scoreRate - lowest.scoreRate;
  return <section className="mt-5">
    <h3 className="text-base sm:text-lg font-semibold mb-2">大問ごとの得点状況（2026年度本試験）</h3>
    <p className="text-sm leading-relaxed mb-3">
      実際の受験者の成績から、大問の得点率と正答率を比較しました。得点率は部分点を含む平均得点の割合、
      正答率は小問を完全に正解した割合の大問内平均です。大問の正答率は配点による重み付けをしていないため、
      得点率と一致しない場合があります。
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <p className="bg-gray-50 border rounded p-3 text-sm">得点率が最高の大問：<strong>第{highest.number}問 {highest.scoreRate.toFixed(2)}%</strong></p>
      <p className="bg-gray-50 border rounded p-3 text-sm">得点率が最低の大問：<strong>第{lowest.number}問 {lowest.scoreRate.toFixed(2)}%</strong></p>
    </div>
    <p className="text-sm mb-4">大問間の得点率の差は<strong>{difference.toFixed(2)}ポイント</strong>。{record.observation}</p>
    <ExamQuestionTable parts={record.parts}/>
    {record.review && <section className="mt-5">
      <h3 className="font-semibold mb-2">出題内容・問題評価から読み取れること</h3>
      <p className="text-sm leading-relaxed mb-3">{record.review}</p>
    </section>}
    {record.detail && <section className="mt-3">
      <h3 className="font-semibold mb-2">設問単位で注目する点</h3>
      <p className="text-sm leading-relaxed mb-3">{record.detail}</p>
    </section>}
    {subject === '情報Ⅰ' && <section className="mt-5">
      <h3 className="font-semibold mb-2">得点分布の変化（2025年度から2026年度）</h3>
      <p className="text-sm leading-relaxed mb-3">2026年度の科目別成績分布では、中央値・最頻値とも56点。前年の中央値70点・最頻値71点から移動しています。平均点だけでなく、得点分布の中心が下がったことが確認できます。</p>
      <table className="w-full text-sm text-left mb-3">
        <thead><tr className="border-b bg-gray-50"><th className="p-2">指標</th><th className="p-2">2025年度</th><th className="p-2">2026年度</th></tr></thead>
        <tbody>
          {[
            ['中央値','70点','56点'],
            ['最頻値','71点','56点'],
            ['80点以上','28.84%','7.86%'],
            ['90点以上','10.54%','1.55%'],
            ['下位20%の境目','55点','43点'],
            ['下位80%の境目','83点','70点'],
          ].map(([title,before,after])=><tr className="border-b" key={title}><th className="p-2 font-medium">{title}</th><td className="p-2">{before}</td><td className="p-2">{after}</td></tr>)}
        </tbody>
      </table>
      <p className="text-sm leading-relaxed mb-3">80点以上の割合は約29%から約8%に低下しました。上位層の人数が減っただけでなく、20%点から80%点までの境界もおおむね12～14点下がっています。得点率の前年差とあわせると、2026年度は第1問・第2問の成績低下が全体の平均点に大きく影響したと読み取れます。</p>
    </section>}
    <p className="text-xs text-gray-600 mt-4 leading-relaxed">
      試験情報の数値は大学入試センター公表の2026年度本試験データに基づく。分析文は問題評価報告書等を踏まえた当サイトの整理です。
      全体の正答率・得点率を、個人の得点可能性や問題そのものの客観的難易度に読み替えることはできません。
    </p>
  </section>;
}

type Part = { number:number; points:number; scoreRate:number; correctRate:number; topic:string };
function ExamQuestionTable({parts}:{parts:Part[]}) {
  const { sorted, sortKey, direction, sortBy } = useSortedRows(parts, 'number', 'asc');
  return <div className="overflow-x-auto">
    <table className="w-full text-sm text-left">
      <thead><tr className="bg-gray-50 border-b">
        <SortHeader label="大問" column="number" {...{sortKey,direction}} onSort={sortBy} />
        <th className="p-3">出題領域</th>
        <SortHeader label="配点" column="points" {...{sortKey,direction}} onSort={sortBy} />
        <SortHeader label="得点率" column="scoreRate" {...{sortKey,direction}} onSort={sortBy} />
        <SortHeader label="正答率" column="correctRate" {...{sortKey,direction}} onSort={sortBy} />
      </tr></thead>
      <tbody>{sorted.map(p => <tr key={p.number} className="border-b">
        <th className="p-3 whitespace-nowrap font-medium">第{p.number}問</th>
        <td className="p-3">{p.topic}</td>
        <td className="p-3 tabular-nums">{p.points}点</td>
        <td className="p-3 tabular-nums">{p.scoreRate.toFixed(2)}%</td>
        <td className="p-3 tabular-nums">{p.correctRate.toFixed(2)}%</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
