import { testDatabase } from '@/app/data/testDatabase';

// Temporary scope: official Common Test records dated 2021 onward.
// Trials, sample sets, Center Test and Common First Stage exams retain PDF access
// through the archives, but do not have published individual article pages.
export function isPublishedTestDetail(record: { year: number | string }): boolean {
  return typeof record.year === 'number' && Number.isInteger(record.year) && record.year >= 2021;
}

const visiblePdfs = new Set(
  testDatabase.filter(isPublishedTestDetail).map(record => record.questionPdf),
);

export function isPublishedTestPdf(questionPdf: string): boolean {
  return visiblePdfs.has(questionPdf);
}
