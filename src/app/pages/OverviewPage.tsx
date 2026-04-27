 import { useMemo } from 'react';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PDFTableWithFilter } from '@/app/components/PDFTableWithFilter';
import { getEnhancedDatabase, sortTestRecords } from '@/app/data/testDatabase';
import { getDisplaySubject } from '@/app/utils/subjectUtils';

export function OverviewPage() {
  const filteredPDFs = useMemo(() => {
    const enhancedDatabase = getEnhancedDatabase();
    return sortTestRecords(enhancedDatabase);
  }, []);

  const title = '総覧 - 共通テスト過去問総集';
  const description = '全ての共通テストの問題・解答を、本試験・追試験などを問わず収録。1978年から2025年までの過去問を年度別・教科別に閲覧・ダウンロードできます。';

  const breadcrumbItems = [
    { name: '総覧', url: '/overview' }
  ];

  const itemListItems = useMemo(() => {
    return filteredPDFs.slice(0, 200).map((record) => ({
      name: `${record.year} ${getDisplaySubject(record.subject)} ${record.testType === 'main' ? '本試験' : '追試験'}`,
      url: `/test/${encodeURIComponent(record.questionPdf)}`,
    }));
  }, [filteredPDFs]);

  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        path="/overview"
        keywords="共通テスト,過去問,総覧,センター試験,大学入試,問題,解答,PDF,ダウンロード,1978-2025"
      />
      <StructuredData
        type="WebSite"
      />
      <StructuredData
        type="EducationalOccupationalProgram"
      />
      <StructuredData
        type="ItemList"
        itemListName="総覧"
        items={itemListItems}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <PDFTableWithFilter 
        items={filteredPDFs} 
        title="総覧" 
        viewMode="overview"
        selectedCategorySubject={null}
      />
    </>
  );
}