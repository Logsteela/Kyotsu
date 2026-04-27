import { createBrowserRouter, type RouteObject } from 'react-router';

import { Root } from '@/app/pages/Root';
import { HomePage } from '@/app/pages/HomePage';
import { OverviewPage } from '@/app/pages/OverviewPage';
import { YearPage } from '@/app/pages/YearPage';
import { SubjectPage } from '@/app/pages/SubjectPage';
import { TestDetailPage } from '@/app/pages/TestDetailPage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';
import { ArchivesPage } from '@/app/components/ArchivesPage';

const routes: RouteObject[] = [
  {
    Component: Root,
    ErrorBoundary: NotFoundPage,
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

export const router = createBrowserRouter(routes);
