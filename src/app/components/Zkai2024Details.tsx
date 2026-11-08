import { ZKAI_2024_QUESTION_RATINGS } from '@/app/data/zkai2024QuestionRatings';
import { ZKAI_2023_QUESTION_RATINGS } from '@/app/data/zkai2023QuestionRatings';
import { ZKAI_2022_QUESTION_RATINGS } from '@/app/data/zkai2022QuestionRatings';
import { ZKAI_2021_QUESTION_RATINGS } from '@/app/data/zkai2021QuestionRatings';
import { SortHeader } from '@/app/components/SortHeader';
import { useSortedRows } from '@/app/utils/useSortedRows';

const difficultyOrder: Record<string,number> = { '易':1, 'やや易':2, '標準':3, 'やや難':4, '難':5 };

export function Zkai2024Details({year,subject,testType}: {year:number|string;subject:string;testType:string}) {
  const record = testType === 'main' ? year === 2024 ? ZKAI_2024_QUESTION_RATINGS[subject] : year === 2023 ? ZKAI_2023_QUESTION_RATINGS[subject] : year === 2022 ? ZKAI_2022_QUESTION_RATINGS[subject] : year === 2021 ? ZKAI_2021_QUESTION_RATINGS[subject] : undefined : undefined;
  const rows = (record?.parts ?? []).map(p => ({...p, difficultyOrder:difficultyOrder[p.difficulty] ?? 99}));
  const {sorted,sortKey,direction,sortBy} = useSortedRows(rows,'sortNo','asc');
  if (!record) return null;
  return <section className="mt-5">
    <h3 className="text-base font-semibold mb-2">{year}年度本試験・大問別の出題・難度</h3>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead><tr className="bg-gray-50 border-b">
          <SortHeader label="大問" column="sortNo" {...{sortKey,direction}} onSort={sortBy} />
          <SortHeader label="出題領域" column="topic" {...{sortKey,direction}} onSort={sortBy} />
          <SortHeader label="Ｚ会難度" column="difficultyOrder" {...{sortKey,direction}} onSort={sortBy} />
        </tr></thead>
        <tbody>{sorted.map(p => <tr className="border-b" key={p.sortNo}>
          <th className="p-3 whitespace-nowrap font-medium">{p.label}</th>
          <td className="p-3">{p.topic}</td>
          <td className="p-3 whitespace-nowrap">{p.difficulty}</td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}
