import type { SortDirection } from '@/app/utils/useSortedRows';

type Props = {
  label: string;
  column: string;
  sortKey: string;
  direction: SortDirection;
  onSort: (key: string) => void;
  className?: string;
};
export function SortHeader({ label, column, sortKey, direction, onSort, className = 'p-3' }: Props) {
  const active = column === sortKey;
  return (
    <th scope="col" className={className} aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className="flex items-center gap-1 text-left font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
        onClick={() => onSort(column)} title={`${label}で並び替える`}>
        {label}<span aria-hidden="true" className="text-xs opacity-70">{active ? direction === 'asc' ? '▲' : '▼' : '↕'}</span>
      </button>
    </th>
  );
}
