import { getDisplaySubject } from '@/app/utils/subjectUtils';

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function FilterButton({ label, selected, onClick }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5 text-sm rounded-[0.375rem] border transition-colors
        ${
          selected
            ? 'bg-[var(--color-brand-green)] text-white border-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)]'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
        }
      `}
    >
      {getDisplaySubject(label)}
    </button>
  );
}