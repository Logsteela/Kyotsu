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

const appChildren: RouteObject[] = [
  { index: true, Component: HomePage },
  { path: '/', Component: HomePage },
  { path: 'overview', Component: OverviewPage },
  { path: 'year/:year', Component: YearPage },
  { path: 'subject/:subject', Component: SubjectPage },
  { path: 'test/:questionPdf', Component: TestDetailPage },
  { path: 'archives', Component: ArchivesPage },
  { path: '*', Component: NotFoundPage },
];

const routes: RouteObject[] = [
  {
    path: '/',
    Component: Root,
    ErrorBoundary: HomePage,
    children: appChildren,
  },

  // GUST Browser などのプロキシが window.location.pathname を
  // 変な値にしても、React Router のデフォルト404に落とさないための保険。
  {
    path: '*',
    Component: HomePage,
    ErrorBoundary: HomePage,
  },
];

function normalizeInternalPath(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

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

function getSafeCurrentPath(): string {
  if (typeof window === 'undefined') return '/';

  const { pathname, search } = window.location;

  if (!pathname || pathname === '/') {
    return '/';
  }

  // GUST やプロキシ環境では search/hash が壊れることがあるので、
  // ここでは pathname を優先して渡す。
  return `${pathname}${search}`;
}

const queryRoutePath = getQueryRoutePath();
const hashRoutePath = getHashRoutePath();

export const router = queryRoutePath
  ? createMemoryRouter(routes, {
      initialEntries: [queryRoutePath],
    })
  : hashRoutePath
    ? createHashRouter(routes)
    : createBrowserRouter(routes, {
        window:
          typeof window === 'undefined'
            ? undefined
            : {
                ...window,
                location: window.location,
                history: window.history,
              },
      });
