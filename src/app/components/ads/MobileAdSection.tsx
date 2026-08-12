import { useEffect, useState } from 'react';
import { AdMaxType } from '@/app/config/admax';
import { AdSection } from '@/app/components/ads/AdSection';

interface MobileAdSectionProps {
  admaxId: string;
  type: AdMaxType;
}

export function MobileAdSection({ admaxId, type }: MobileAdSectionProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(media.matches);

    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (!isMobile) return null;

  return <AdSection admaxId={admaxId} type={type} />;
}
