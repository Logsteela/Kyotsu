import { getEnhancedDatabase } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { isPublishedTestDetail } from '@/app/utils/publicTestDetail';
import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { COMMON_TEST_2026_FOREIGN_LANGUAGES } from '@/app/data/commonTest2026ForeignLanguages';
import { COMMON_TEST_GROUP_COMPARISONS } from '@/app/data/commonTest2025GroupComparison';
import { COMMON_TEST_2025_SOCIAL_AREAS } from '@/app/data/commonTest2025SocialAreas';
import { COMMON_TEST_2025_FOREIGN_LANGUAGES } from '@/app/data/commonTest2025ForeignLanguages';

// Keep this logic aligned with shouldLoadAdSense() in generate-static-pages.js.
// Only genuine editorial / comparative pages should load AdSense.
const EDITORIAL_ROUTES = new Set([
  '/', '/statistics', '/year-statistics', '/common-test-changes',
  '/common-test-2025-analysis', '/common-test-2026-analysis',
]);

const exams = getEnhancedDatabase();
const byPdf = new Map(exams.map(exam => [exam.questionPdf, exam]));
const regime = (year:number) => year < 1990 ? 'first' : year < 2021 ? 'center' : 'common';

function comparableYears(subject: string, year: number, max: number): number {
  const counts = new Map<number,number>();
  for (const exam of exams) {
    if (typeof exam.year !== 'number' || exam.year < 1979 || exam.year > 2026 ||
        exam.testType !== 'main' || regime(exam.year) !== regime(year) ||
        exam.subject !== subject) continue;
    const d = getTestDetails(exam.questionPdf);
    if (d?.totalScore !== max || typeof d.averageScore !== 'number') continue;
    counts.set(exam.year, (counts.get(exam.year) ?? 0) + 1);
  }
  return [...counts.values()].filter(n => n === 1).length;
}

export function isAdEligiblePath(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (EDITORIAL_ROUTES.has(path)) return true;
  if (!path.startsWith('/test/')) return false;

  let pdf: string;
  try { pdf = decodeURIComponent(path.slice('/test/'.length)); }
  catch { return false; }

  const record = byPdf.get(pdf);
  if (!record || !isPublishedTestDetail(record) || record.testType !== 'main') return false;
  const { year, subject } = record;
  if (year === 2026 && (COMMON_TEST_2026_RESEARCH[subject] ||
      COMMON_TEST_2026_FOREIGN_LANGUAGES[subject])) return true;
  if (year === 2025 && (COMMON_TEST_GROUP_COMPARISONS[subject] ||
      COMMON_TEST_2025_SOCIAL_AREAS[subject] ||
      COMMON_TEST_2025_FOREIGN_LANGUAGES[subject])) return true;
  if (year < 1979 || year > 2026) return false;

  const d = getTestDetails(record.questionPdf);
  if (!(d?.totalScore && d.totalScore > 0) || typeof d.averageScore !== 'number') return false;
  return comparableYears(subject, year, d.totalScore) >= (year >= 2021 ? 4 : 5);
}
