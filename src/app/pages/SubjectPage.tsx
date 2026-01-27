import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { PDFTableWithFilter } from '@/app/components/PDFTableWithFilter';
import { getEnhancedDatabase, sortTestRecords, SLUG_TO_CATEGORY } from '@/app/data/testDatabase';

export function SubjectPage() {
  const { subject: subjectSlug } = useParams();
  
  const filteredPDFs = useMemo(() => {
    if (!subjectSlug) return [];
    const categorySubject = SLUG_TO_CATEGORY[subjectSlug];
    if (!categorySubject) return [];
    const enhancedDatabase = getEnhancedDatabase();
    const filtered = enhancedDatabase.filter((record) => record.categorySubject === categorySubject);
    return sortTestRecords(filtered);
  }, [subjectSlug]);

  const categorySubject = useMemo(() => {
    if (!subjectSlug) return '';
    return SLUG_TO_CATEGORY[subjectSlug] || '';
  }, [subjectSlug]);

  const title = useMemo(() => {
    if (!categorySubject) return '';
    return `${categorySubject}一覧`;
  }, [categorySubject]);

  const pageTitle = useMemo(() => {
    if (!categorySubject) return '共通テスト過去問総集';
    return `${categorySubject} - 共通テスト過去問総集`;
  }, [categorySubject]);

  const description = useMemo(() => {
    if (!categorySubject) return '';
    return `共通テスト${categorySubject}の過去問（問題・解答PDF）を1978年から2025年まで年度別・本試験・追試験別に閲覧・ダウンロードできます。`;
  }, [categorySubject]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <PDFTableWithFilter 
        items={filteredPDFs} 
        title={title} 
        viewMode="bySubject"
        selectedCategorySubject={categorySubject || null}
      />
    </>
  );
}