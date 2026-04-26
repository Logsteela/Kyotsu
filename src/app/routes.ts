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
    // path を付けない layout route にする。
    // これで GUST が pathname を変な形にしても、親 route は必ず入る。
    Component: Root,

    // React Router の英語デフォルトエラー画面を出さない保険。
    ErrorBoundary: HomePage,

    children: [
      { index: true, Component: HomePage },
      { path: '/', Component: HomePage },

      { path: 'overview', Component: OverviewPage },
      { path: 'year/:year', Component: YearPage },
      { path: 'subject/:subject', Component: SubjectPage },
      { path: 'test/:questionPdf', Component: TestDetailPage },
      { path: 'archives', Component: ArchivesPage },

      // GUST が /proxy/... など変な pathname を渡してきてもトップを表示する
      { path: '*', Component: HomePage },
    ],
  },
];

function normalizeInternalPath(value: string | null): string | null {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  // full URL が渡された場合でも path 部分だけにする
  const withoutOrigin = trimmed.replace(/^https?:\/\/[^/]+/i, '');

  if (!withoutOrigin) return '/';

  return withoutOrigin.startsWith('/') ? withoutOrigin : `/${withoutOrigin}`;
}

function getQueryRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);

  // GUST 用:
  // https://kyotsutest.vercel.app/?p=/year/2026
  return normalizeInternalPath(params.get('p'));
}

function getHashRoutePath(): string | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;

  if (!hash.startsWith('#/')) return null;

  return normalizeInternalPath(hash.slice(1));
}

const queryRoutePath = getQueryRoutePath();
const hashRoutePath = getHashRoutePath();

export const router = queryRoutePath
  ? createMemoryRouter(routes, {
      initialEntries: [queryRoutePath],
    })
  : hashRoutePath
    ? createHashRouter(routes)
    : createBrowserRouter(routes);
