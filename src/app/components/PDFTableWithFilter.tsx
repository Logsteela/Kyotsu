import { useState, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { getEraDisplay } from '@/app/utils/era';
import { EnhancedTestRecord, FILTERABLE_SUBJECTS, getOtherSubjectOrder } from '@/app/data/testDatabase';
import { FilterButton } from '@/app/components/FilterButton';
import { PDFActionGroup, AudioActionGroup } from '@/app/components/PDFActionButton';
import { TableLegend } from '@/app/components/TableLegend';
import { getDisplaySubject } from '@/app/utils/subjectUtils';

interface PDFTableWithFilterProps {
  items: EnhancedTestRecord[];
  title: string;
  viewMode: 'byYear' | 'bySubject' | 'overview' | null;
  selectedCategorySubject: string | null;
}

export function PDFTableWithFilter({ items, title, viewMode, selectedCategorySubject }: PDFTableWithFilterProps) {
  // フィルタリング対象かどうか判定
  const filterableSubject = selectedCategorySubject && selectedCategorySubject in FILTERABLE_SUBJECTS
    ? selectedCategorySubject as keyof typeof FILTERABLE_SUBJECTS
    : null;

  // リスニング判定：選択された教科がリスニング、または表示されるアイテムにリスニングが含まれる場合
  const isListening = selectedCategorySubject === '英語（Listening）' || 
    items.some(item => item.categorySubject === '英語（Listening）');

  // チェックボックスの状態（デフォルトすべてON）
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  // フィルターの初期化と更新
  useEffect(() => {
    if (!filterableSubject) {
      setSelectedFilters({});
      return;
    }

    const filters: Record<string, boolean> = {};
    
    if (filterableSubject === 'その他') {
      // その他の場合はデータベース初出順で取得
      const otherSubjects = getOtherSubjectOrder();
      // 現在のitemsに含まれる科目のみをフィルタリング
      const currentSubjects = Array.from(new Set(items.map(item => item.essentialSubject)));
      const orderedSubjects = otherSubjects.filter(s => currentSubjects.includes(s));
      
      orderedSubjects.forEach(subject => {
        filters[subject] = selectedFilters[subject] !== undefined ? selectedFilters[subject] : true;
      });
    } else {
      FILTERABLE_SUBJECTS[filterableSubject].forEach((subject) => {
        filters[subject] = selectedFilters[subject] !== undefined ? selectedFilters[subject] : true;
      });
    }
    setSelectedFilters(filters);
  }, [filterableSubject, items.length]);

  const toggleFilter = (subject: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [subject]: !prev[subject]
    }));
  };

  // フィルタリング後のアイテム
  const filteredItems = useMemo(() => {
    if (!filterableSubject) return items;
    return items.filter(item => selectedFilters[item.essentialSubject] !== false);
  }, [items, filterableSubject, selectedFilters]);

  // 号外判定（yearが文字列の場合は号外）
  const isSpecialYear = items.length > 0 && typeof items[0].year === 'string';

  // 総覧モードの場合：特別試験を分離
  const specialTests = viewMode === 'overview' 
    ? filteredItems.filter((item) => typeof item.year === 'string')
    : [];

  // 通常テスト（本試験・追試験）
  const regularTests = viewMode === 'overview'
    ? filteredItems.filter((item) => typeof item.year === 'number')
    : filteredItems;

  const mainTests = regularTests.filter((item) => item.testType === 'main');
  const makeupTests = regularTests.filter((item) => item.testType === 'makeup');

  // データがない場合
  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">データがありません</p>
      </div>
    );
  }

  const scrollToMakeup = () => {
    document.getElementById('makeup-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // pdfStateに応じた背景色を取得
  const getPdfStateBgColor = (pdfState: 1 | 2 | 3, isEven: boolean) => {
    if (pdfState === 3) {
      return 'bg-[var(--color-state-complete-missing)]';
    } else if (pdfState === 2) {
      return 'bg-[var(--color-state-partial-missing)]';
    } else {
      return isEven ? 'bg-[var(--color-state-normal)]' : 'bg-[var(--color-state-normal-alt)]';
    }
  };

  // pdfStateに応じたホバー色を取得
  const getPdfStateHoverColor = (pdfState: 1 | 2 | 3) => {
    if (pdfState === 3) {
      return 'hover:bg-[var(--color-state-complete-missing-hover)]';
    } else if (pdfState === 2) {
      return 'hover:bg-[var(--color-state-partial-missing-hover)]';
    } else {
      return 'hover:bg-[var(--color-table-row-hover)]';
    }
  };

const renderSubject = (item: EnhancedTestRecord) => {
  // 個別ページへのリンクを生成
  const detailPageUrl = `/test/${encodeURIComponent(item.questionPdf)}`;
  
  return (
    <Link 
      to={detailPageUrl} 
      className="font-bold underline decoration-1 underline-offset-2 text-black hover:text-gray-600 transition-colors"
    >
      {getDisplaySubject(item.subject)}
    </Link>
  );
};


  const renderTable = (tests: EnhancedTestRecord[], tableTitle: string, id?: string) => {
    // 特別試験かどうかを判定（yearが文字列の場合）
    const isSpecialTest = tests.length > 0 && typeof tests[0].year === 'string';
    
    // レスポンシブモードの決定
    // 年度別 + リスニング: year-with-audio
    // 年度別 + リスニングなし: year-no-audio
    // 総覧 + リスニング: overview-with-audio
    // 総覧 + リスニングなし: year-no-audio
    // 教科別 + リスニング: subject-with-audio
    // 教科別 + リスニングなし: subject-no-audio
    // 特別試験 + リスニング: special-with-audio
    // 特別試験 + リスニングなし: special-no-audio
    const getResponsiveMode = (): 'year-with-audio' | 'year-no-audio' | 'subject-no-audio' | 'subject-with-audio' | 'overview-with-audio' | 'special-with-audio' | 'special-no-audio' => {
      // 特別試験の場合は専用のモードを使用
      if (isSpecialTest) {
        return isListening ? 'special-with-audio' : 'special-no-audio';
      }
      
      if (viewMode === 'byYear') {
        // 年度別
        return isListening ? 'year-with-audio' : 'year-no-audio';
      } else if (viewMode === 'overview') {
        // 総覧
        return isListening ? 'overview-with-audio' : 'year-no-audio';
      } else {
        // 教科別
        return isListening ? 'subject-with-audio' : 'subject-no-audio';
      }
    };
    const responsiveMode = getResponsiveMode();

    // 総覧モードかどうか
    const isOverviewMode = viewMode === 'overview';

    return (
      <div id={id} className="mb-8 flex flex-col gap-3">
        {tableTitle && (
          <h2 className="text-lg font-semibold text-gray-800 lg:sticky lg:top-0 bg-gray-100 py-2 z-10">
            {tableTitle}
          </h2>
        )}
        <div className="bg-white border border-[var(--color-table-border)] rounded">
          <table className="w-full table-fixed">
            <thead className="bg-[var(--color-table-header-bg)] border-b border-[var(--color-table-border)]">
              <tr>
                {/* 総覧モードの場合は年度と教科の両方を表示 */}
                {isOverviewMode ? (
                  <>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] w-[15%] md:w-[18%]">
                      年度
                    </th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] w-[15%] md:w-[18%]">
                      教科
                    </th>
                  </>
                ) : viewMode === 'bySubject' ? (
                  <>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] w-[15%] md:w-[18%]">
                      年度
                    </th>
                    <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] w-[15%] md:w-[18%]">
                      教科
                    </th>
                  </>
                ) : (
                  <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r border-[var(--color-table-border)] w-[20%] md:w-[22%]">
                    教科
                  </th>
                )}
                <th className={`text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                  isListening 
                    ? (isOverviewMode || viewMode === 'bySubject' ? 'w-[23.33%] md:w-[21.33%]' : 'w-[26.67%] md:w-[26%]')
                    : (isOverviewMode || viewMode === 'bySubject' ? 'w-[35%] md:w-[32%]' : 'w-[40%] md:w-[39%]')
                } border-r border-[var(--color-table-border)]`}>
                  問題
                </th>
                <th className={`text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                  isListening 
                    ? (isOverviewMode || viewMode === 'bySubject' ? 'w-[23.33%] md:w-[21.33%] border-r border-[var(--color-table-border)]' : 'w-[26.67%] md:w-[26%] border-r border-[var(--color-table-border)]')
                    : (isOverviewMode || viewMode === 'bySubject' ? 'w-[35%] md:w-[32%]' : 'w-[40%] md:w-[39%]')
                }`}>
                  解答
                </th>
                {isListening && (
                  <th className={`text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 ${
                    isOverviewMode || viewMode === 'bySubject' ? 'w-[23.33%] md:w-[21.33%]' : 'w-[26.67%] md:w-[26%]'
                  }`}>
                    音声
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {tests.map((item, index) => (
                <tr
                  key={`${item.year}-${item.subject}-${item.testType}-${index}`}
                  className={`border-b border-[var(--color-table-border)] last:border-b-0 ${getPdfStateHoverColor(item.pdfState)} ${getPdfStateBgColor(item.pdfState, index % 2 === 0)}`}
                >
                  {/* 総覧モードの場合は年度と教科の両方を表示 */}
                  {isOverviewMode ? (
                    <>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700 border-r border-[var(--color-table-border)] break-words overflow-hidden">
                        {typeof item.year === 'number' 
                          ? `${item.year}（${getEraDisplay(item.year)}）`
                          : item.year}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-900 border-r border-[var(--color-table-border)] break-words overflow-hidden">
                        {renderSubject(item)}
                      </td>
                    </>
                  ) : viewMode === 'bySubject' ? (
                    <>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-700 border-r border-[var(--color-table-border)] break-words overflow-hidden">
                        {typeof item.year === 'number' 
                          ? `${item.year}（${getEraDisplay(item.year)}）`
                          : item.year}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-900 border-r border-[var(--color-table-border)] break-words overflow-hidden">
                        {renderSubject(item)}
                      </td>
                    </>
                  ) : (
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-gray-900 border-r border-[var(--color-table-border)] break-words overflow-hidden">
                      {renderSubject(item)}
                    </td>
                  )}
                  {/* 問題 */}
                  <td className="p-1.5 sm:p-2 border-r border-[var(--color-table-border)] overflow-hidden">
                    <PDFActionGroup
  pdfPath={item.questionPdf}
  pdfState={item.pdfState}
  type="question"
  responsiveMode={responsiveMode}
  exists={item.questionExists}
/>
                  </td>
                  {/* 解答 */}
                  <td className={`p-1.5 sm:p-2 ${isListening ? 'border-r border-[var(--color-table-border)]' : ''} overflow-hidden`}>
                    <PDFActionGroup
  pdfPath={item.answerPdf}
  pdfState={item.pdfState}
  type="answer"
  responsiveMode={responsiveMode}
  exists={item.answerExists}
/>
                  </td>
                  {/* 音声（リスニングの場合のみ） */}
                  {isListening && (
                    <td className="p-1.5 sm:p-2 overflow-hidden">
                      <AudioActionGroup
  audioPath={item.audio}
  pdfState={item.pdfState}
  priority={item.priority}
  responsiveMode={responsiveMode}
  exists={item.audioExists}
/>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-6 flex flex-col gap-4">
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>

      {/* 凡例 */}
      <TableLegend />

      {/* フィルタリングUI */}
      {filterableSubject && Object.keys(selectedFilters).length > 0 && (
        <div className="p-4 bg-white border border-[var(--color-table-border)] rounded flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">科目でフィルタリング</h3>
          {filterableSubject === 'その他' ? (
            // その他の場合：特定の位置で改行（1個、5個、1個、6個、5個、残り）
            <>
              {(() => {
                const subjectKeys = Object.keys(selectedFilters);
                const groups = [
                  subjectKeys.slice(0, 1),   // 1個
                  subjectKeys.slice(1, 6),   // 5個
                  subjectKeys.slice(6, 7),   // 1個
                  subjectKeys.slice(7, 13),  // 6個
                  subjectKeys.slice(13, 18), // 5個
                  subjectKeys.slice(18),     // 残り
                ];
                
                return groups.map((group, groupIndex) => (
                  group.length > 0 && (
                    <div key={groupIndex} className="flex flex-wrap gap-2">
                      {group.map((subject) => (
                        <FilterButton
                          key={subject}
                          label={subject}
                          selected={selectedFilters[subject]}
                          onClick={() => toggleFilter(subject)}
                        />
                      ))}
                    </div>
                  )
                ));
              })()}
            </>
          ) : (
            // その他以外：通常の折り返しレイアウト
            <div className="flex flex-wrap gap-2">
              {Object.keys(selectedFilters).map((subject) => (
                <FilterButton
                  key={subject}
                  label={subject}
                  selected={selectedFilters[subject]}
                  onClick={() => toggleFilter(subject)}
                />
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500">クリックして表示/非表示を切り替え</p>
        </div>
      )}

      {/* スマホ用：追試験へのジャンプボタン（号外でない場合のみ） */}
      {!isSpecialYear && makeupTests.length > 0 && viewMode !== 'overview' && (
        <div className="lg:hidden mb-4">
          <Button
            variant="outline"
            className="w-full border-gray-300 hover:bg-gray-50"
            onClick={scrollToMakeup}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            追試験まで移動
          </Button>
        </div>
      )}

      {/* 総覧モードの場合 */}
      {viewMode === 'overview' ? (
        <>
          {/* 本試験 */}
          {mainTests.length > 0 && renderTable(mainTests, '本試験')}
          
          {/* 追試験 */}
          {makeupTests.length > 0 && renderTable(makeupTests, '追試験')}
          
          {/* 特別試験 */}
          {specialTests.length > 0 && renderTable(specialTests, '特別試験')}
        </>
      ) : (
        <>
          {/* 号外の場合は本試・追試の区別なく表示 */}
          {isSpecialYear ? (
            <div>
              {renderTable(filteredItems, '')}
            </div>
          ) : (
            <>
              {/* PC: 左右2列 */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
                <div>
                  {renderTable(mainTests, '本試験')}
                </div>
                {makeupTests.length > 0 && (
                  <div>
                    {renderTable(makeupTests, '追試験')}
                  </div>
                )}
              </div>

              {/* スマホ: 上下配置 */}
              <div className="lg:hidden">
                {renderTable(mainTests, '本試験')}
                {makeupTests.length > 0 && renderTable(makeupTests, '追試験', 'makeup-section')}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}