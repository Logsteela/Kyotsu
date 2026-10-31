 import { useMemo } from 'react';
import { Link } from 'react-router';
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

  const title = '共通テスト過去問一覧｜全年度・全教科';
  const description = '共通テスト、センター試験、共通一次の問題PDF、解答PDF、本試験、追試験、特例追試験。';

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
        keywords="共通テスト,過去問,一覧,総覧,センター試験,共通一次,大学入試,問題,解答,PDF,ダウンロード,本試験,追試験,特例追試験"
      />
      <StructuredData
        type="WebPage"
        pageTitle={title}
        pageDescription={description}
        pagePath="/overview"
        breadcrumbs={breadcrumbItems}
      />
      <StructuredData
        type="WebSite"
      />
      <StructuredData
        type="ItemList"
        itemListName="総覧"
        items={itemListItems}
      />
      <Breadcrumbs items={breadcrumbItems} />
      <nav aria-label="過去問に対応する分析" className="px-4 sm:px-6 text-sm text-gray-700 flex flex-wrap gap-x-5 gap-y-2 mb-2">
        <span>大問別の比較・分析：</span>
        <Link className="underline text-[var(--color-brand-green)]" to="/common-test-2026-analysis">2026年度本試験</Link>
        <Link className="underline text-[var(--color-brand-green)]" to="/common-test-2025-analysis">2025年度本試験</Link>
        <Link className="underline text-[var(--color-brand-green)]" to="/year-statistics">歴代の平均得点率</Link>
      </nav>
      <PDFTableWithFilter 
        items={filteredPDFs} 
        title="総覧" 
        viewMode="overview"
        selectedCategorySubject={null}
      />
    </>
  );
}