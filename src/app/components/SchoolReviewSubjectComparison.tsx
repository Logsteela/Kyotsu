import { Link } from 'react-router';
import { COMMON_TEST_2026_SCHOOL_DIFFICULTY, COMMON_TEST_2026_ZKAI_SECTIONS } from '@/app/data/commonTest2026SchoolReviews';
import { COMMON_TEST_2025_ZKAI_SECTIONS } from '@/app/data/commonTest2025SchoolReviews';
import { getEnhancedDatabase } from '@/app/data/testDatabase';

const examLink=(year:number, subject:string)=>{
  const rec=getEnhancedDatabase().find(r=>r.year===year&&r.testType==='main'&&r.subject===subject);
  return rec ? `/test/${encodeURIComponent(rec.questionPdf)}` : '';
};

export function SchoolReviewSubjectComparison({year}:{year:2025|2026}) {
  const data=year===2026 ? COMMON_TEST_2026_ZKAI_SECTIONS : COMMON_TEST_2025_ZKAI_SECTIONS;
  const subjects=year===2026
    ? Object.keys(COMMON_TEST_2026_SCHOOL_DIFFICULTY).sort((a,b)=>a.localeCompare(b,'ja'))
    : Object.keys(data).sort((a,b)=>a.localeCompare(b,'ja'));
  return <section className="mt-8">
    <h2 className="text-lg font-semibold mb-3">
      {year===2026 ? '予備校別の難易度判定' : 'Z会の大問別難易度評価'}
    </h2>
    <div className="overflow-x-auto">
      <table className="text-sm w-full text-left">
        <thead><tr className="bg-gray-50 border-b">
          <th className="p-3">科目</th>
          {year===2026 && <><th className="p-3">東進</th><th className="p-3">河合塾</th></>}
          <th className="p-3">Z会「やや難・難」の大問</th>
          <th className="p-3">Z会の大問数</th>
        </tr></thead>
        <tbody>{subjects.map(subject=>{
          const opinions=COMMON_TEST_2026_SCHOOL_DIFFICULTY[subject]??[];
          const z=data[subject];
          const hard=z?.ratings.map((rating,i)=>({rating,number:i+1}))
            .filter(r=>r.rating.includes('やや難')||r.rating==='難') ?? [];
          const url=examLink(year,subject);
          return <tr key={subject} className="border-b">
            <th className="p-3 font-medium">{url
              ? <Link to={url} className="underline text-[var(--color-brand-green)]">{subject}</Link>
              : subject}</th>
            {year===2026 && <>
              <td className="p-3">{opinions.find(x=>x.school==='東進')?.rating??'—'}</td>
              <td className="p-3">{opinions.find(x=>x.school==='河合塾')?.rating??'—'}</td>
            </>}
            <td className="p-3">{z ? (hard.length ? hard.map(r=>`第${r.number}問`).join('、') : 'なし') : '—'}</td>
            <td className="p-3 tabular-nums">{z?.ratings.length??'—'}</td>
          </tr>;
        })}</tbody>
      </table>
    </div>
  </section>;
}
