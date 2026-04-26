import {
  createBrowserRouter,
  createHashRouter,
  type RouteObject,
} from 'react-router';

import { Root } from '@/app/pages/Root';
import { HomePage } from '@/app/pages/HomePage';
import { OverviewPage } from '@/app/pages/OverviewPage';
import { YearPage } from '@/app/pages/YearPage';
import { SubjectPage } from '@/app/pages/SubjectPage';
import { TestDetailPage } from '@/app/pages/TestDetailPage';
import { ArchivesPage } from '@/app/components/ArchivesPage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

const routes: RouteObject[] = [
  {
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: '/', Component: HomePage },
      { path: 'overview', Component: OverviewPage },
      { path: 'year/:year', Component: YearPage },
      { path: 'subject/:subject', Component: SubjectPage },
      { path: 'test/:questionPdf', Component: TestDetailPage },
      { path: 'archives', Component: ArchivesPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];

function isGustBrowser() {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent || '';
  const appVersion = window.navigator.appVersion || '';

  return /gust/i.test(ua) || /gust/i.test(appVersion);
}

function shouldUseHashRouter() {
  if (typeof window === 'undefined') return false;

  return (
    isGustBrowser() ||
    window.location.hash.startsWith('#/') ||
    new URLSearchParams(window.location.search).get('router') === 'hash'
  );
}

function normalizeHashUrlForGust() {
  if (typeof window === 'undefined') return;

  if (!shouldUseHashRouter()) return;
  if (window.location.hash.startsWith('#/')) return;

  const { pathname, search } = window.location;

  if (pathname !== '/') {
    window.history.replaceState(null, '', `/#${pathname}${search}`);
  }
}

normalizeHashUrlForGust();

export const router = shouldUseHashRouter()
  ? createHashRouter(routes)
  : createBrowserRouter(routes);
