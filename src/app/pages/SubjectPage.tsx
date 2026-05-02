import { useMemo } from 'react';
import { useParams } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PDFTableWithFilter } from '@/app/components/PDFTableWithFilter';
import { getEnhancedDatabase, sortTestRecords, SLUG_TO_CATEGORY } from '@/app/data/testDatabase';
import { getDisplaySubject } from '@/app/utils/subjectUtils';

export function SubjectPage() {
  const { subject: subjectSlug } = useParams();
  
  const filteredPDFs = useMemo(() => {
    if (!subjectSlug) return [];
    const categorySubject = SLUG_TO_CATEGORY[subjectSlug];
    if (!categorySubject) return [];
    const enhancedDatabase = getEnhancedDatabase();
    const filtered = enhancedDatabase.filter((record) => record.categorySubject === categorySubject);

    const unique = Array.from(
      new Map(
        filtered.map((record) => [
          [
            record.year,
            record.examType,
            record.subject,
            record.questionPdf,
            record.answerPdf,
            record.audioFile ?? '',
          ].join('::'),
          record,
        ])
      ).values()
    );

    return sortTestRecords(unique);
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
    return `共通テスト ${categorySubject} 過去問｜問題・解答PDF`;
  }, [categorySubject]);

  const description = useMemo(() => {
    if (!categorySubject) return '';
    return `共通テスト ${categorySubject}の問題PDF、解答PDF、本試験、追試験、年度別一覧。`;
  }, [categorySubject]);

  const keywords = useMemo(() => {
    if (!categorySubject) return '共通テスト,過去問,PDF,ダウンロード';
    return `共通テスト,${categorySubject},過去問,問題,解答,PDF,ダウンロード,センター試験,大学入試,本試験,追試験`;
  }, [categorySubject]);

  const breadcrumbs = useMemo(() => {
    if (!categorySubject) return [];
    return [
      { name: '総覧', url: '/overview' },
      { name: title, url: `/subject/${subjectSlug}` },
    ];
  }, [categorySubject, title, subjectSlug]);

  const pagePath = `/subject/${subjectSlug ?? ''}`;

  const itemListItems = useMemo(() => {
    return filteredPDFs.map((record) => ({
      name: `${record.year} ${getDisplaySubject(record.subject)} ${record.testType === 'main' ? '本試験' : '追試験'}`,
      url: `/test/${encodeURIComponent(record.questionPdf)}`,
    }));
  }, [filteredPDFs]);

  return (
    <>
      <SEOMeta
        title={pageTitle}
        description={description}
        path={pagePath}
        keywords={keywords}
        type="article"
      />
      <StructuredData
        type="WebPage"
        pageTitle={pageTitle}
        pageDescription={description}
        pagePath={pagePath}
        breadcrumbs={breadcrumbs}
      />
      <StructuredData
        type="ItemList"
        itemListName={title}
        items={itemListItems}
      />
      <Breadcrumbs items={breadcrumbs} />
      <PDFTableWithFilter 
        items={filteredPDFs} 
        title={title} 
        viewMode="bySubject"
        selectedCategorySubject={categorySubject || null}
      />
    </>
  );
}