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
      正答率は小問を完全に正解した割合の大問内平均です。未照合の正答率は「—」と表示します。大問の正答率は配点による重み付けをしていないため、
      得点率と一致しない場合があります。
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <p className="bg-gray-50 border rounded p-3 text-sm">得点率が最高の大問：<strong>第{highest.number}問 {highest.scoreRate.toFixed(2)}%</strong></p>
      <p className="bg-gray-50 border rounded p-3 text-sm">得点率が最低の大問：<strong>第{lowest.number}問 {lowest.scoreRate.toFixed(2)}%</strong></p>
    </div>
    <p className="text-sm mb-4">大問間の得点率の差は<strong>{difference.toFixed(2)}ポイント</strong>。{record.observation}</p>
    {subject === '数学Ⅱ，数学Ｂ，数学Ｃ' && <p className="text-sm mb-4 border-l-4 border-gray-300 pl-3">
      この試験は必答3大問（計52点）と、4大問から3大問を選ぶ選択部分（各16点）で100点満点です。
      表は選択肢を含めた7大問・計116点を掲載するため、全大問の平均点を足しても100点満点の試験平均にはなりません。
      選択大問の得点率には、選択した受験者の構成の違いが含まれます。
    </p>}
    {['地理総合','歴史総合','公共'].includes(subject) && <p className="text-sm mb-4 border-l-4 border-gray-300 pl-3">
      これは「地理総合／歴史総合／公共」の3領域から2つを選ぶ試験のうち、50点分の1領域です。
      受験者の選択状況は領域によって異なるため、領域間の得点率をそのまま難易度の差として扱えません。
    </p>}
    <ExamQuestionTable parts={record.parts}/>
    {record.review && <section className="mt-5">
      <h3 className="font-semibold mb-2">出題内容・問題評価から読み取れること</h3>
      <p className="text-sm leading-relaxed mb-3">{record.review}</p>
    </section>}
    {record.detail && <section className="mt-3">
      <h3 className="font-semibold mb-2">設問単位で注目する点</h3>
      <p className="text-sm leading-relaxed mb-3">{record.detail}</p>
    </section>}
    {subject === '国語' && <section className="mt-5">
      <h3 className="font-semibold mb-2">国語の得点分布：2025年度と2026年度の比較</h3>
      <p className="text-sm leading-relaxed mb-3">
        2026年度は平均点116.37点で、2025年度の126.67点から10.30点下がりました。
        分布でも160点以上（8割以上）の割合が19.93%から10.04%へ、180点以上（9割以上）は4.07%から1.65%へ減っています。
        これは平均点の変化だけでなく、特に高得点帯の人数構成が変わったことを意味します。
      </p>
      <table className="w-full text-sm text-left mb-3">
        <thead><tr className="border-b bg-gray-50"><th className="p-2">分布の指標</th><th className="p-2">2025年度</th><th className="p-2">2026年度</th></tr></thead>
        <tbody>{[
          ['160点以上','87,139人（19.93%）','43,974人（10.04%）'],
          ['180点以上','17,786人（4.07%）','7,215人（1.65%）'],
          ['200点満点','144人','113人'],
          ['下位20%の境目','94点','86点'],
          ['下位40%の境目','119点','107点'],
          ['下位60%の境目','139点','126点'],
          ['下位80%の境目','159点','146点'],
        ].map(([name,prev,curr])=><tr key={name} className="border-b"><th className="p-2 font-medium">{name}</th><td className="p-2">{prev}</td><td className="p-2">{curr}</td></tr>)}</tbody>
      </table>
      <p className="text-sm leading-relaxed mb-3">
        分位点は下位20%が8点、40%が12点、60%と80%がそれぞれ13点下がっています。
        2026年度の160点以上の割合は前年のおよそ半分です。ただし、出題内容だけでなく受験者の違いも含むため、
        得点分布の差をそのまま問題難易度の差とはみなしません。
      </p>
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

type Part = { number:number; points:number; scoreRate:number; correctRate:number | null; topic:string };
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
        <td className="p-3 tabular-nums">{p.correctRate === null ? '—' : `${p.correctRate.toFixed(2)}%`}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
