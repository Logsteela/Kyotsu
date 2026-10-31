import { useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';
type SortValue = string | number | null | undefined;

export function useSortedRows<T extends object>(
  rows: readonly T[],
  initialKey: keyof T & string,
  initialDirection: SortDirection = 'desc',
) {
  const [sortKey, setSortKey] = useState<keyof T & string>(initialKey);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);
  const sortBy = (key: string) => {
    if (key === sortKey) setDirection(d => d === 'asc' ? 'desc' : 'asc');
    else {
      setSortKey(key as keyof T & string);
      setDirection('asc');
    }
  };
  const sorted = useMemo(() => {
    const result = [...rows];
    result.sort((a, b) => {
      const av = a[sortKey] as SortValue;
      const bv = b[sortKey] as SortValue;
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      const diff = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv), 'ja', { numeric: true });
      return direction === 'asc' ? diff : -diff;
    });
    return result;
  }, [rows, sortKey, direction]);
  return { sorted, sortKey, direction, sortBy };
}
