import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router';
import { ADMAX, AdMaxType } from '@/app/config/admax';
import { AdSection } from '@/app/components/ads/AdSection';
import { MobileAdSection } from '@/app/components/ads/MobileAdSection';

type Placement = {
  key: string;
  host: HTMLDivElement;
  admaxId: string;
  type: AdMaxType;
  mobileOnly?: boolean;
};

function isTableRoute(pathname: string) {
  return pathname === '/overview' || pathname.startsWith('/year/') || pathname.startsWith('/subject/');
}

function makeHost(key: string) {
  const host = document.createElement('div');
  host.dataset.adPlacement = key;
  host.className = 'bg-white rounded-lg border border-[var(--color-table-border)] px-2 mb-6';
  return host;
}

export function RouteAdPlacements() {
  const location = useLocation();
  const [placements, setPlacements] = useState<Placement[]>([]);

  useEffect(() => {
    const next: Placement[] = [];
    const createdHosts: HTMLDivElement[] = [];

    if (isTableRoute(location.pathname)) {
      const makeupSection = document.getElementById('makeup-section');
      if (makeupSection?.parentElement) {
        const betweenHost = makeHost('table-between-mobile');
        makeupSection.parentElement.insertBefore(betweenHost, makeupSection);
        createdHosts.push(betweenHost);
        next.push({
          key: 'table-between-mobile',
          host: betweenHost,
          admaxId: ADMAX.tableBetweenMobile.id,
          type: ADMAX.tableBetweenMobile.type,
          mobileOnly: true,
        });
      }

      const tableRoot = Array.from(document.querySelectorAll<HTMLElement>('main div')).find((element) => {
        return element.classList.contains('p-4') && element.querySelector('table') !== null && element.querySelector('h1') !== null;
      });

      if (tableRoot) {
        const bottomHost = makeHost('table-bottom');
        tableRoot.appendChild(bottomHost);
        createdHosts.push(bottomHost);
        next.push({
          key: 'table-bottom',
          host: bottomHost,
          admaxId: ADMAX.tableBottom.id,
          type: ADMAX.tableBottom.type,
        });
      }
    }

    if (location.pathname.startsWith('/test/')) {
      const detailRoot = Array.from(document.querySelectorAll<HTMLElement>('main div')).find((element) => {
        const headings = Array.from(element.querySelectorAll('h2')).map((heading) => heading.textContent?.trim());
        return element.classList.contains('flex') && element.classList.contains('flex-col') && headings.includes('試験情報') && headings.includes('閲覧');
      });

      if (detailRoot) {
        const bottomHost = makeHost('test-bottom');
        detailRoot.appendChild(bottomHost);
        createdHosts.push(bottomHost);
        next.push({
          key: 'test-bottom',
          host: bottomHost,
          admaxId: ADMAX.testBottom.id,
          type: ADMAX.testBottom.type,
        });
      }
    }

    setPlacements(next);

    return () => {
      createdHosts.forEach((host) => host.remove());
    };
  }, [location.pathname]);

  return (
    <>
      {placements.map((placement) =>
        createPortal(
          placement.mobileOnly ? (
            <MobileAdSection admaxId={placement.admaxId} type={placement.type} />
          ) : (
            <AdSection admaxId={placement.admaxId} type={placement.type} />
          ),
          placement.host,
          placement.key,
        ),
      )}
    </>
  );
}
