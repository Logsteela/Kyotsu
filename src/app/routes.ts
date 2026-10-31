import { createBrowserRouter, type RouteObject } from 'react-router';

import { YearStatisticsPage } from '@/app/pages/YearStatisticsPage';
import { CoveragePage } from '@/app/pages/CoveragePage';
import { StatisticsPage } from '@/app/pages/StatisticsPage';
import { GuidePage } from '@/app/pages/GuidePage';
import { AboutPage } from '@/app/pages/AboutPage';
import { PrivacyPage } from '@/app/pages/PrivacyPage';
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
      { path: 'statistics', Component: StatisticsPage },
      { path: 'coverage', Component: CoveragePage },
      { path: 'year-statistics', Component: YearStatisticsPage },
      { path: 'guide', Component: GuidePage },
      { path: 'about', Component: AboutPage },
      { path: 'privacy', Component: PrivacyPage },

      { path: '*', Component: NotFoundPage },
    ],
  },
];

export const router = createBrowserRouter(routes);
