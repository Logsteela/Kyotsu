import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { CommonTest2026SocialDistribution } from '@/app/components/CommonTest2026SocialDistribution';
import { getDifficultyAppropriateness } from '@/app/data/commonTest2026Evaluations';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

export function CommonTestQuestionDetails({ year, subject }: { year: number | string; subject: string }) {
  const record = year === 2026 ? COMMON_TEST_2026_RESEARCH[subject] : undefined;
  if (!record) return null;
  const highest = record.parts.reduce((a,b) => a.scoreRate >= b.scoreRate ? a : b);
  const lowest = record.parts.reduce((a,b) => a.scoreRate <= b.scoreRate ? a : b);
  const difference = highest.scoreRate - lowest.scoreRate;
  return <section className="mt-5">
    <h3 className="text-base sm:text-lg font-semibold mb-2">大問別得点率・正答率</h3>
    <p className="text-xs text-gray-600 mb-3">外部評価分科会の評価：{getDifficultyAppropriateness(subject)}／4</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
      <p className="bg-gray-50 border rounded p-3 text-sm">得点率が最高の大問：<strong>第{highest.number}問 {highest.scoreRate.toFixed(2)}%</strong></p>
      <p className="bg-gray-50 border rounded p-3 text-sm">得点率が最低の大問：<strong>第{lowest.number}問 {lowest.scoreRate.toFixed(2)}%</strong></p>
    </div>
    <p className="text-sm mb-4">最高と最低の差：<strong>{difference.toFixed(2)}ポイント</strong></p>
    {subject === '数学Ⅱ，数学Ｂ，数学Ｃ' && <p className="text-sm mb-4 border-l-4 border-gray-300 pl-3">
      第4～7問から3問選択。表には選択肢4問すべてを載せているため、配点合計は116点です（試験は100点満点）。
    </p>}
    {['地理総合','歴史総合','公共'].includes(subject) && <p className="text-sm mb-4 border-l-4 border-gray-300 pl-3">
      「地理総合／歴史総合／公共」から2領域選択。この表は50点分の1領域です。
    </p>}
    <ExamQuestionTable parts={record.parts}/>
    <PriorYearGroupComparison subject={subject} parts={record.parts} />
    {record.review && <section className="mt-5">
      <h3 className="font-semibold mb-2">出題・問題評価</h3>
      <p className="text-sm leading-relaxed mb-3">{record.review}</p>
    </section>}
    {record.detail && <section className="mt-3">
      <h3 className="font-semibold mb-2">個別設問</h3>
      <p className="text-sm leading-relaxed mb-3">{record.detail}</p>
    </section>}
    {subject === '国語' && <section className="mt-5">
      <h3 className="font-semibold mb-2">国語の得点分布：2025年度と2026年度の比較</h3>
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
    </section>}
    <CommonTest2026SocialDistribution subject={subject} />
    {subject === '情報Ⅰ' && <section className="mt-5">
      <h3 className="font-semibold mb-2">得点分布の変化（2025年度から2026年度）</h3>
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
    </section>}
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

type ChangeRow = { number:number; topic:string; points:number; previousRate:number; currentRate:number; delta:number; averageContribution:number };
function PriorYearGroupComparison({ subject, parts }: { subject: string; parts: Part[] }) {
  const baseline = COMMON_TEST_GROUP_COMPARISONS[subject];
  const optional = Boolean(baseline?.nonAdditive);
  const rows: ChangeRow[] = baseline ? baseline.groups.flatMap(g => {
    const now = parts.find(p => p.number === g.number && p.points === g.points);
    if (!now) return [];
    const delta = now.scoreRate - g.previousRate;
    return [{ number:g.number, topic:now.topic, points:g.points, previousRate:g.previousRate,
      currentRate:now.scoreRate, delta, averageContribution:delta * g.points / 100 }];
  }) : [];
  const { sorted, sortKey, direction, sortBy } = useSortedRows(rows, 'number', 'asc');
  if (!baseline || baseline.nonComparable || rows.length !== baseline.groups.length) return null;
  return <section className="mt-6">
    <h3 className="text-base font-semibold mb-2">2025年度との大問別得点率比較</h3>
    {optional && <p className="text-sm mb-3">※第4～7問は選択問題のため、平均点への寄与は算出していません。</p>}
    <div className="overflow-x-auto mb-3"><table className="w-full text-sm text-left">
      <thead><tr className="bg-gray-50 border-b">
        <SortHeader label="大問" column="number" {...{sortKey,direction}} onSort={sortBy} />
        <SortHeader label="2025年" column="previousRate" {...{sortKey,direction}} onSort={sortBy} />
        <SortHeader label="2026年" column="currentRate" {...{sortKey,direction}} onSort={sortBy} />
        <SortHeader label="変化" column="delta" {...{sortKey,direction}} onSort={sortBy} />
        {optional ? <th className="p-3">科目平均点への寄与</th>
          : <SortHeader label="平均点への寄与" column="averageContribution" {...{sortKey,direction}} onSort={sortBy} />}
      </tr></thead><tbody>{sorted.map(p => <tr key={p.number} className="border-b">
        <th className="p-3 font-medium">第{p.number}問</th>
        <td className="p-3 tabular-nums">{p.previousRate.toFixed(2)}%</td>
        <td className="p-3 tabular-nums">{p.currentRate.toFixed(2)}%</td>
        <td className="p-3 tabular-nums">{p.delta > 0 ? '+' : ''}{p.delta.toFixed(2)}pt</td>
        <td className="p-3 tabular-nums">{optional ? '—（選択）' : `${p.averageContribution > 0 ? '+' : ''}${p.averageContribution.toFixed(2)}点`}</td>
      </tr>)}</tbody>
    </table></div>
    <p className="text-sm leading-relaxed">{baseline.comment}</p>
  </section>;
}
