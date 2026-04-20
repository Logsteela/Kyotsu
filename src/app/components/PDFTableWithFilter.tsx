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

type PdfState = 1 | 2 | 3;
type ManifestStatus = 'loading' | 'ready' | 'error';

const MANIFEST_URL = '/manifest.json';

function normalizeAssetKey(pathOrUrl: string | undefined | null): string | null {
  const s = (pathOrUrl ?? '').trim();
  if (!s) return null;

  const withoutOrigin = s.replace(/^https?:\/\/[^/]+\//, '');
  const normalized = withoutOrigin
    .replace(/^\/+/, '')
    .replace(/^pdfs\//, '');

  return normalized || null;
}

function createManifestMap(payload: unknown): Record<string, true> {
  const entries = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { files?: unknown }).files)
      ? (payload as { files: unknown[] }).files
      : payload && typeof payload === 'object' && Array.isArray((payload as { keys?: unknown }).keys)
        ? (payload as { keys: unknown[] }).keys
        : [];

  const next: Record<string, true> = {};

  for (const entry of entries) {
    if (typeof entry !== 'string') continue;
    const key = normalizeAssetKey(entry);
    if (key) next[key] = true;
  }

  return next;
}

function derivePdfState(questionExists: boolean, answerExists: boolean, audioExists: boolean, hasAudio: boolean): PdfState {
  const checks = hasAudio
    ? [questionExists, answerExists, audioExists]
    : [questionExists, answerExists];

  const missingCount = checks.filter(value => !value).length;

  if (missingCount === 0) return 1;
  if (missingCount === checks.length) return 3;
  return 2;
}

export function PDFTableWithFilter({ items, title, viewMode, selectedCategorySubject }: PDFTableWithFilterProps) {
  const filterableSubject = selectedCategorySubject && selectedCategorySubject in FILTERABLE_SUBJECTS
    ? selectedCategorySubject as keyof typeof FILTERABLE_SUBJECTS
    : null;

  const isListening = selectedCategorySubject === '英語（Listening）' ||
    items.some(item => item.categorySubject === '英語（Listening）');

  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [manifestMap, setManifestMap] = useState<Record<string, true>>({});
  const [manifestStatus, setManifestStatus] = useState<ManifestStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    const loadManifest = async () => {
      try {
        const response = await fetch(MANIFEST_URL, {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`manifest fetch failed: ${response.status}`);
        }

        const json = await response.json();
        if (cancelled) return;

        setManifestMap(createManifestMap(json));
        setManifestStatus('ready');
      } catch (error) {
        if (cancelled) return;
        console.error('Failed to load manifest.json:', error);
        setManifestMap({});
        setManifestStatus('error');
      }
    };

    void loadManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!filterableSubject) {
      setSelectedFilters({});
      return;
    }

    const filters: Record<string, boolean> = {};

    if (filterableSubject === 'その他') {
      const otherSubjects = getOtherSubjectOrder();
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

  const filteredItems = useMemo(() => {
    if (!filterableSubject) return items;
    return items.filter(item => selectedFilters[item.essentialSubject] !== false);
  }, [items, filterableSubject, selectedFilters]);

  function resolveExists(pathOrName: string | undefined | null): boolean {
    const key = normalizeAssetKey(pathOrName);
    if (!key) return false;
    return Boolean(manifestMap[key]);
  }

  function getEffectiveItem(item: EnhancedTestRecord): EnhancedTestRecord {
    const questionExists = resolveExists(item.questionPdf);
    const answerExists = resolveExists(item.answerPdf);
    const hasAudio = Boolean(item.audio?.trim());
    const audioExists = hasAudio ? resolveExists(item.audio) : false;
    const pdfState = derivePdfState(questionExists, answerExists, audioExists, hasAudio);

    return {
      ...item,
      questionExists,
      answerExists,
      audioExists,
      pdfState,
    };
  }

  const effectiveFilteredItems = useMemo(
    () => filteredItems.map(getEffectiveItem),
    [filteredItems, manifestMap]
  );

  const isSpecialYear = items.length > 0 && typeof items[0].year === 'string';

  const specialTests = viewMode === 'overview'
    ? effectiveFilteredItems.filter((item) => typeof item.year === 'string')
    : [];

  const regularTests = viewMode === 'overview'
    ? effectiveFilteredItems.filter((item) => typeof item.year === 'number')
    : effectiveFilteredItems;

  const mainTests = regularTests.filter((item) => item.testType === 'main');
  const makeupTests = regularTests.filter((item) => item.testType === 'makeup');

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">データがありません</p>
      </div>
    );
  }

  if (manifestStatus === 'loading') {
    return (
      <div className="p-4 lg:p-6 flex flex-col gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
        <TableLegend />
        <div className="p-4 bg-white border border-[var(--color-table-border)] rounded">
          <p className="text-sm text-gray-600">manifest.json を読み込み中です…</p>
        </div>
      </div>
    );
  }

  if (manifestStatus === 'error') {
    return (
      <div className="p-4 lg:p-6 flex flex-col gap-4">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900">{title}</h1>
        <TableLegend />
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700">manifest.json の読み込みに失敗しました。</p>
        </div>
      </div>
    );
  }

  const scrollToMakeup = () => {
    document.getElementById('makeup-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPdfStateBgColor = (pdfState: PdfState, isEven: boolean) => {
    if (pdfState === 3) {
      return 'bg-[var(--color-state-complete-missing)]';
    } else if (pdfState === 2) {
      return 'bg-[var(--color-state-partial-missing)]';
    } else {
      return isEven ? 'bg-[var(--color-state-normal)]' : 'bg-[var(--color-state-normal-alt)]';
    }
  };

  const getPdfStateHoverColor = (pdfState: PdfState) => {
    if (pdfState === 3) {
      return 'hover:bg-[var(--color-state-complete-missing-hover)]';
    } else if (pdfState === 2) {
      return 'hover:bg-[var(--color-state-partial-missing-hover)]';
    } else {
      return 'hover:bg-[var(--color-table-row-hover)]';
    }
  };

  const renderSubject = (item: EnhancedTestRecord) => {
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
    const isSpecialTest = tests.length > 0 && typeof tests[0].year === 'string';

    const getResponsiveMode = (): 'year-with-audio' | 'year-no-audio' | 'subject-no-audio' | 'subject-with-audio' | 'overview-with-audio' | 'special-with-audio' | 'special-no-audio' => {
      if (isSpecialTest) {
        return isListening ? 'special-with-audio' : 'special-no-audio';
      }

      if (viewMode === 'byYear') {
        return isListening ? 'year-with-audio' : 'year-no-audio';
      } else if (viewMode === 'overview') {
        return isListening ? 'overview-with-audio' : 'year-no-audio';
      } else {
        return isListening ? 'subject-with-audio' : 'subject-no-audio';
      }
    };

    const responsiveMode = getResponsiveMode();
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

                  <td className="p-1.5 sm:p-2 border-r border-[var(--color-table-border)] overflow-hidden">
                    <PDFActionGroup
                      pdfPath={item.questionPdf}
                      pdfState={item.pdfState}
                      type="question"
                      responsiveMode={responsiveMode}
                      exists={item.questionExists}
                    />
                  </td>

                  <td className={`p-1.5 sm:p-2 ${isListening ? 'border-r border-[var(--color-table-border)]' : ''} overflow-hidden`}>
                    <PDFActionGroup
                      pdfPath={item.answerPdf}
                      pdfState={item.pdfState}
                      type="answer"
                      responsiveMode={responsiveMode}
                      exists={item.answerExists}
                    />
                  </td>

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

      <TableLegend />

      {filterableSubject && Object.keys(selectedFilters).length > 0 && (
        <div className="p-4 bg-white border border-[var(--color-table-border)] rounded flex flex-col gap-3">
          <h3 className="text-sm font-semibold text-gray-700">科目でフィルタリング</h3>
          {filterableSubject === 'その他' ? (
            <>
              {(() => {
                const subjectKeys = Object.keys(selectedFilters);
                const groups = [
                  subjectKeys.slice(0, 1),
                  subjectKeys.slice(1, 6),
                  subjectKeys.slice(6, 7),
                  subjectKeys.slice(7, 13),
                  subjectKeys.slice(13, 18),
                  subjectKeys.slice(18),
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

      {viewMode === 'overview' ? (
        <>
          {mainTests.length > 0 && renderTable(mainTests, '本試験')}
          {makeupTests.length > 0 && renderTable(makeupTests, '追試験')}
          {specialTests.length > 0 && renderTable(specialTests, '特別試験')}
        </>
      ) : (
        <>
          {isSpecialYear ? (
            <div>
              {renderTable(effectiveFilteredItems, '')}
            </div>
          ) : (
            <>
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
