import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
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

function normalizeInternalPath(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // 万一 full URL が渡された場合でも path 部分だけにする
  const withoutOrigin = trimmed.replace(/^https?:\/\/[^/]+/i, '');

  if (!withoutOrigin) return '/';

  return withoutOrigin.startsWith('/') ? withoutOrigin : `/${withoutOrigin}`;
}

function getQueryRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');

  return normalizeInternalPath(p);
}

function getHashRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;

  if (!hash.startsWith('#/')) return null;

  return normalizeInternalPath(hash.slice(1));
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';

  const { pathname, search } = window.location;

  // ?p= は内部ルーティング用なので、現在パスとしては使わない
  if (!pathname || pathname === '/') {
    return '/';
  }

  return `${pathname}${search}`;
}

function isGustBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent || '';
  const appVersion = window.navigator.appVersion || '';

  return /gust/i.test(ua) || /gust/i.test(appVersion);
}

const queryRoutePath = getQueryRoutePath();
const hashRoutePath = getHashRoutePath();

export const router = queryRoutePath
  ? createMemoryRouter(routes, {
      initialEntries: [queryRoutePath],
    })
  : isGustBrowser()
    ? createMemoryRouter(routes, {
        initialEntries: [hashRoutePath ?? getCurrentPath()],
      })
    : hashRoutePath
      ? createHashRouter(routes)
      : createBrowserRouter(routes);
