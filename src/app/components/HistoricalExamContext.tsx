import { useMemo } from 'react';
import { Link } from 'react-router';
import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

type Item = { year:number; questionPdf:string; average:number|null; max:number|null; rate:number|null; examinees:number|null };
function regimeOf(year:number):'preliminary'|'first'|'center'|'common' {
  return year < 1979 ? 'preliminary' : year < 1990 ? 'first' : year < 2021 ? 'center' : 'common';
}
const REGIME_NAME = {
  preliminary:'共通一次導入前の試行・実地研究',
  first:'共通第1次学力試験',
  center:'大学入試センター試験',
  common:'大学入学共通テスト',
};

export function HistoricalExamContext({
  year, subject, testType, questionPdf
}: {year:number|string;subject:string;testType:'main'|'makeup';questionPdf:string}) {
  const comparisonData = useMemo(() => {
    if (typeof year !== 'number' || year >= 2021 || testType !== 'main') return { items: [], history: [] as Item[] };
    const same = new Map<string,Item>();
    const current = getTestDetails(questionPdf);
    const max = typeof current?.totalScore === 'number' && current.totalScore > 0 ? current.totalScore : null;
    if (max === null) return { items: [], history: [] as Item[] }; // Only compare verified scoring scales.
    for (const entry of getEnhancedDatabase()) {
      if (typeof entry.year !== 'number' || entry.testType !== 'main' ||
          regimeOf(entry.year)!==regimeOf(year) || entry.subject !== subject ||
          same.has(entry.questionPdf)) continue;
      const detail=getTestDetails(entry.questionPdf);
      const total = typeof detail?.totalScore === 'number' && detail.totalScore>0 ? detail.totalScore : null;
      if (max !== null && total !== max) continue;
      const average = typeof detail?.averageScore === 'number' ? detail.averageScore : null;
      same.set(entry.questionPdf,{
        year:entry.year, questionPdf:entry.questionPdf, average, max:total,
        rate:average!==null && total!==null ? 100*average/total : null,
        examinees:typeof detail?.examinees === 'number' ? detail.examinees : null,
      });
    }
    // Compare one record per year only. Duplicate sessions cannot be identified as the same main exam.
    const byYear=new Map<number,Item[]>();
    for (const item of same.values()) byYear.set(item.year,[...(byYear.get(item.year)??[]),item]);
    const all=[...byYear].filter(([,v])=>v.length===1).map(([,v])=>v[0])
      .sort((a,b)=>a.year-b.year);
    const previous=all.filter(x=>x.year<year).slice(-2);
    const next=all.filter(x=>x.year>year).slice(0,2);
    const present=all.find(x=>x.questionPdf===questionPdf);
    return { items: [...previous,...(present?[present]:[]),...next], history: all };
  },[year,subject,testType,questionPdf]);
  const { items, history } = comparisonData;
  const {sorted,sortKey,direction,sortBy}=useSortedRows(items,'year','asc');
  if (typeof year !== 'number' || year >= 2021 || testType !== 'main' || items.length<2) return null;
  const prev=items.filter(x=>x.year<year && x.rate!==null).slice(-1)[0];
  const current=items.find(x=>x.questionPdf===questionPdf);
  const diff=prev?.rate!==null && prev && current?.rate!==null && current?.rate!==undefined
    ? current.rate-prev.rate : null;
  const historyRates = history.filter((x): x is Item & { rate: number } => x.rate !== null);
  const currentInHistory = historyRates.find(x => x.questionPdf === questionPdf);
  const longTerm = currentInHistory && historyRates.length >= 5 ? {
    total: historyRates.length,
    rank: 1 + historyRates.filter(x => x.rate > currentInHistory.rate).length,
    median: (() => { const ordered = [...historyRates].map(x=>x.rate).sort((a,b)=>a-b); const n=ordered.length; return (ordered[Math.floor((n-1)/2)]+ordered[Math.floor(n/2)])/2; })(),
    highest: historyRates.reduce((a,b) => a.rate > b.rate ? a : b),
    lowest: historyRates.reduce((a,b) => a.rate < b.rate ? a : b),
    value: currentInHistory.rate,
  } : null;
  return <section className="mt-5 border border-[var(--color-table-border)] bg-white rounded-lg p-5 sm:p-6 text-gray-800">
    <h2 className="text-lg font-semibold mb-3">平均点の年度比較</h2>
    {diff!==null && <p className="text-sm mb-3">{prev.year}年度比：
      <strong> {diff>0?'+':''}{diff.toFixed(2)}ポイント</strong>
    </p>}
    {longTerm && <div className="mb-4 border-l-4 border-[var(--color-brand-green)] bg-gray-50 p-3 sm:p-4">
      <h3 className="font-semibold text-sm mb-2">過去{longTerm.total}年度中の位置</h3>
      <p className="text-sm leading-relaxed">
        平均得点率<strong>{longTerm.value.toFixed(2)}%</strong>・高い順で<strong>{longTerm.rank}位</strong>。
        中央値<strong>{longTerm.median.toFixed(2)}%</strong>（差{longTerm.value-longTerm.median>=0?'+':''}{(longTerm.value-longTerm.median).toFixed(2)}ポイント）。
      </p>
      <p className="text-sm leading-relaxed mt-2">
        最高：{longTerm.highest.year}年度 {longTerm.highest.rate.toFixed(2)}% ／
        最低：{longTerm.lowest.year}年度 {longTerm.lowest.rate.toFixed(2)}%
      </p>
    </div>}
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead><tr className="bg-gray-50 border-b">
          <SortHeader label="年度" column="year" {...{sortKey,direction}} onSort={sortBy}/>
          <SortHeader label="平均点" column="average" {...{sortKey,direction}} onSort={sortBy}/>
          <SortHeader label="平均得点率" column="rate" {...{sortKey,direction}} onSort={sortBy}/>
          <SortHeader label="受験者数" column="examinees" {...{sortKey,direction}} onSort={sortBy}/>
          <th className="p-3">資料</th>
        </tr></thead>
        <tbody>{sorted.map(x=><tr key={x.questionPdf} className={`border-b ${x.questionPdf===questionPdf?'bg-gray-50 font-semibold':''}`}>
          <td className="p-3 tabular-nums">{x.year}年度</td>
          <td className="p-3 tabular-nums">{x.average===null?'—':`${x.average}点`}</td>
          <td className="p-3 tabular-nums">{x.rate===null?'—':`${x.rate.toFixed(2)}%`}</td>
          <td className="p-3 tabular-nums">{x.examinees===null?'—':x.examinees.toLocaleString('ja-JP')}</td>
          <td className="p-3"><Link className="underline text-[var(--color-brand-green)]" to={`/test/${encodeURIComponent(x.questionPdf)}`}>{x.questionPdf===questionPdf?'この試験':'問題・解答'}</Link></td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}
