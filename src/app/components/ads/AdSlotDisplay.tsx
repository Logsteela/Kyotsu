import { useEffect, useRef } from 'react';
import { AdMaxType } from '@/app/config/admax';

interface AdSlotDisplayProps {
  admaxId: string;
  type: AdMaxType;
}

export function AdSlotDisplay({ admaxId, type }: AdSlotDisplayProps) {
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current || !admaxId) return;

    window.admaxads = window.admaxads || [];

    if (!window.admaxads.some((ad) => ad.admax_id === admaxId)) {
      window.admaxads.push({ admax_id: admaxId, type });
    }

    pushedRef.current = true;
  }, [admaxId, type]);

  return (
    <div
      className={type === 'switch' ? 'admax-switch' : 'admax-ads'}
      data-admax-id={admaxId}
      style={{ display: 'inline-block', maxWidth: '100%' }}
    />
  );
}
