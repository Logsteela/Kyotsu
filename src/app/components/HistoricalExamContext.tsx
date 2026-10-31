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
  const items = useMemo(() => {
    if (typeof year !== 'number' || year >= 2021 || testType !== 'main') return [];
    const same = new Map<string,Item>();
    const current = getTestDetails(questionPdf);
    const max = typeof current?.totalScore === 'number' && current.totalScore > 0 ? current.totalScore : null;
    if (max === null) return []; // A matching scoring scale cannot be asserted if the maximum is unknown.
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
    return [...previous,...(present?[present]:[]),...next];
  },[year,subject,testType,questionPdf]);
  const {sorted,sortKey,direction,sortBy}=useSortedRows(items,'year','asc');
  if (typeof year !== 'number' || year >= 2021 || testType !== 'main' || items.length<2) return null;
  const prev=items.filter(x=>x.year<year && x.rate!==null).slice(-1)[0];
  const current=items.find(x=>x.questionPdf===questionPdf);
  const diff=prev?.rate!==null && prev && current?.rate!==null && current?.rate!==undefined
    ? current.rate-prev.rate : null;
  return <section className="mt-5 border border-[var(--color-table-border)] bg-white rounded-lg p-5 sm:p-6 text-gray-800">
    <h2 className="text-lg font-semibold mb-3">同じ試験制度・科目の前後年度を比較</h2>
    <p className="text-sm leading-relaxed mb-3">
      この資料は{REGIME_NAME[regimeOf(year)]}の{year}年度本試験です。
      同じ科目名、同じ満点、同じ試験制度のうち、近い前後年度の記録を並べました。
      別の試験制度や、名称が異なる科目は自動的に同一視していません。
    </p>
    {diff!==null && <p className="text-sm mb-3">
      比較可能な前年度の記録（{prev.year}年度）と比べた平均得点率は
      <strong> {diff>0?'+':''}{diff.toFixed(2)}ポイント</strong>です。
      これは受験者の平均の変化であり、問題の難しさそのものを測る値ではありません。
    </p>}
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
    <p className="text-xs text-gray-600 leading-relaxed mt-3">
      「—」は対応する統計が未登録であることを示します。科目名や満点が一致していても、
      学習指導要領・出題範囲・選択方式・受験者集団は変化し得るため、年度間の平均得点率をそのまま難易度順位として用いないでください。
    </p>
  </section>;
}
