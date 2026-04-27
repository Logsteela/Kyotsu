import { createBrowserRouter, type RouteObject } from 'react-router';

import { Root } from '@/app/pages/Root';
import { HomePage } from '@/app/pages/HomePage';
import { OverviewPage } from '@/app/pages/OverviewPage';
import { YearPage } from '@/app/pages/YearPage';
import { SubjectPage } from '@/app/pages/SubjectPage';
import { TestDetailPage } from '@/app/pages/TestDetailPage';
import { ArchivesPage } from '@/app/components/ArchivesPage';

const routes: RouteObject[] = [
  {
    Component: Root,
    ErrorBoundary: HomePage,
    children: [
      { index: true, Component: HomePage },
      { path: '/', Component: HomePage },

      { path: 'overview', Component: OverviewPage },
      { path: 'year/:year', Component: YearPage },
      { path: 'subject/:subject', Component: SubjectPage },
      { path: 'test/:questionPdf', Component: TestDetailPage },
      { path: 'archives', Component: ArchivesPage },

      { path: '*', Component: HomePage },
    ],
  },
];

const legacyQueryRouteParams = ['o', 'a', 'y', 's', 't', 'p'];

function removeLegacyQueryRouteParams(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  let changed = false;

  for (const param of legacyQueryRouteParams) {
    if (!url.searchParams.has(param)) continue;

    url.searchParams.delete(param);
    changed = true;
  }

  if (!changed) return;

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, '', nextUrl);
}

removeLegacyQueryRouteParams();

export const router = createBrowserRouter(routes);
