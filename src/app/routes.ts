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

function normalizeInternalPath(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withoutOrigin = trimmed.replace(/^https?:\/\/[^/]+/i, '');

  if (!withoutOrigin) return '/';

  return withoutOrigin.startsWith('/') ? withoutOrigin : `/${withoutOrigin}`;
}

function getShortQueryRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);

  // /?o
  if (params.has('o')) return '/overview';

  // /?a
  if (params.has('a')) return '/archives';

  // /?y=2026
  const year = params.get('y');
  if (year) return `/year/${year}`;

  // /?s=english
  const subject = params.get('s');
  if (subject) return `/subject/${subject}`;

  // /?t=2026_国語_本試験問題.pdf
  const test = params.get('t');
  if (test) return `/test/${encodeURIComponent(test)}`;

  return null;
}

function getQueryRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);

  // /?p=/overview
  return normalizeInternalPath(params.get('p'));
}

function getHashRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;

  if (!hash.startsWith('#/')) return null;

  return normalizeInternalPath(hash.slice(1));
}

const shortQueryRoutePath = getShortQueryRoutePath();
const queryRoutePath = getQueryRoutePath();
const hashRoutePath = getHashRoutePath();

const isCompactMode = Boolean(shortQueryRoutePath || queryRoutePath || hashRoutePath);

if (typeof window !== 'undefined' && isCompactMode) {
  (window as Window & { __KYOTSU_GUST_MODE__?: boolean }).__KYOTSU_GUST_MODE__ = true;
  document.documentElement.dataset.gustMode = '1';
}

export const router = shortQueryRoutePath
  ? createMemoryRouter(routes, {
      initialEntries: [shortQueryRoutePath],
    })
  : queryRoutePath
    ? createMemoryRouter(routes, {
        initialEntries: [queryRoutePath],
      })
    : hashRoutePath
      ? createHashRouter(routes)
      : createBrowserRouter(routes);
