import { createBrowserRouter } from 'react-router';
import { Root } from '@/app/pages/Root';
import { HomePage } from '@/app/pages/HomePage';
import { OverviewPage } from '@/app/pages/OverviewPage';
import { YearPage } from '@/app/pages/YearPage';
import { SubjectPage } from '@/app/pages/SubjectPage';
import { TestDetailPage } from '@/app/pages/TestDetailPage';
import { ArchivesPage } from '@/app/components/ArchivesPage';
import { NotFoundPage } from '@/app/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: 'overview', Component: OverviewPage },
      { path: 'year/:year', Component: YearPage },
      { path: 'subject/:subject', Component: SubjectPage },
      { path: 'test/:questionPdf', Component: TestDetailPage },
      { path: 'archives', Component: ArchivesPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
]);