import { useMemo } from 'react';
import { useParams } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PDFTableWithFilter } from '@/app/components/PDFTableWithFilter';
import { getEnhancedDatabase, sortTestRecords } from '@/app/data/testDatabase';
import { getEraDisplay } from '@/app/utils/era';
import { getDisplaySubject } from '@/app/utils/subjectUtils';

export function YearPage() {
  const { year } = useParams();

  const filteredPDFs = useMemo(() => {
    const enhancedDatabase = getEnhancedDatabase();

    // URLパラメータが数値に変換可能な場合は数値、そうでなければ文字列としてそのまま使う
    const yearValue = isNaN(Number(year)) ? year : Number(year);

    const filtered = enhancedDatabase.filter((record) => record.year === yearValue);

    // 同一PDF実体の重複を除去
    // 基礎理科のように内部で複数 essential に展開されていても、一覧では1件だけ表示する
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

  const keywords = useMemo(() => {
    if (!year) return '共通テスト,過去問,PDF,ダウンロード';

    const yearNum = isNaN(Number(year)) ? year : Number(year);
    const era = typeof yearNum === 'number' ? getEraDisplay(yearNum) : '';

    return `共通テスト,${yearNum}年度,${era},過去問,問題,解答,PDF,ダウンロード,本試験,追試験`;
  }, [year]);

  const breadcrumbs = useMemo(() => {
    if (!year) return [];

    return [
      { name: '総覧', url: '/overview' },
      { name: title, url: `/year/${year}` },
    ];
  }, [year, title]);

  const pagePath = `/year/${year ?? ''}`;

  const itemListItems = useMemo(() => {
    return filteredPDFs.map((record) => ({
      name: `${getDisplaySubject(record.subject)} ${record.testType === 'main' ? '本試験' : '追試験'}`,
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
        viewMode="byYear"
        selectedCategorySubject={null}
      />
    </>
  );
}