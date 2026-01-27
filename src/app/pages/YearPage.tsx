import { useMemo } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { PDFTableWithFilter } from '@/app/components/PDFTableWithFilter';
import { getEnhancedDatabase, sortTestRecords } from '@/app/data/testDatabase';
import { getEraDisplay } from '@/app/utils/era';

export function YearPage() {
  const { year } = useParams();
  
  const filteredPDFs = useMemo(() => {
    const enhancedDatabase = getEnhancedDatabase();
    // URLパラメータが数値に変換可能な場合は数値、そうでなければ文字列としてそのまま使う
    const yearValue = isNaN(Number(year)) ? year : Number(year);
    const filtered = enhancedDatabase.filter((record) => record.year === yearValue);
    return sortTestRecords(filtered);
  }, [year]);

  const title = useMemo(() => {
    if (!year) return '';
    // 数値に変換可能かチェック
    if (isNaN(Number(year))) {
      // 特別試験など文字列の場合
      return `${year}一覧`;
    }
    const yearNum = Number(year);
    return `${yearNum}年度一覧`;
  }, [year]);

  const pageTitle = useMemo(() => {
    if (!year) return '共通テスト過去問総集';
    if (isNaN(Number(year))) {
      return `${year} - 共通テスト過去問総集`;
    }
    const yearNum = Number(year);
    const era = getEraDisplay(yearNum);
    return `${yearNum}年度（${era}）- 共通テスト過去問総集`;
  }, [year]);

  const description = useMemo(() => {
    if (!year) return '';
    if (isNaN(Number(year))) {
      return `${year}の共通テスト過去問（問題・解答）を本試験・追試験別に閲覧・ダウンロードできます。`;
    }
    const yearNum = Number(year);
    const era = getEraDisplay(yearNum);
    return `${yearNum}年度（${era}）共通テスト過去問の問題・解答PDFを全教科収録。本試験・追試験別に閲覧・ダウンロードできます。`;
  }, [year]);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
      </Helmet>
      <PDFTableWithFilter 
        items={filteredPDFs} 
        title={title} 
        viewMode="byYear"
        selectedCategorySubject={null}
      />
    </>
  );
}