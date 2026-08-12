import { AdMaxType } from '@/app/config/admax';
import { AdSlotDisplay } from '@/app/components/ads/AdSlotDisplay';

interface AdSectionProps {
  admaxId: string;
  type: AdMaxType;
  className?: string;
}

export function AdSection({ admaxId, type, className = '' }: AdSectionProps) {
  return (
    <div className={`w-full flex flex-col items-center justify-center py-3 ${className}`}>
      <div className="text-[10px] text-gray-400 tracking-widest mb-1">広告</div>
      <div className="max-w-full overflow-hidden flex justify-center">
        <AdSlotDisplay admaxId={admaxId} type={type} />
      </div>
    </div>
  );
}
