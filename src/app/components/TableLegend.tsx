 interface LegendItemProps {
  color: 'normal' | 'partial' | 'complete';
  label: string;
}

const COLOR_MAP = {
  normal: 'bg-white',
  partial: 'bg-[var(--color-state-partial-missing)]',
  complete: 'bg-[var(--color-state-complete-missing)]',
};

function LegendItem({ color, label }: LegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-4 h-4 ${COLOR_MAP[color]} border border-gray-300 rounded`}></div>
      <span className="text-gray-700">{label}</span>
    </div>
  );
}

export function TableLegend() {
  return (
    <div className="mb-4 p-3 bg-white border border-[var(--color-table-border)] rounded">
      <div className="flex flex-wrap gap-4 text-sm">
        <LegendItem color="normal" label="正常" />
        <LegendItem color="partial" label="一部欠損" />
        <LegendItem color="complete" label="完全欠損" />
      </div>
    </div>
  );
}
