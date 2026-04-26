import { useMemo } from 'react';
import { Download, ExternalLink, ChevronDown, LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { getEraDisplay } from '@/app/utils/era';
import { getDisplaySubject, getSubjectForFilename } from '@/app/utils/subjectUtils';
import pdfManifest from '@/app/data/pdfManifest.json';

interface PDFItem {
  id: string;
  subject: string;
  year: number;
  type: 'main' | 'makeup';
  problemUrl: string;
  answerUrl: string;
}

interface PDFTableProps {
  items: PDFItem[];
  title: string;
  viewMode: 'byYear' | 'bySubject' | null;
}

type PdfState = 1 | 2 | 3;
type ManifestMap = Record<string, true>;

const SITE_ORIGIN = 'https://kyotsutest.vercel.app';

function normalizeAssetKey(pathOrUrl: string | undefined | null): string | null {
  const s = (pathOrUrl ?? '').trim();
  if (!s) return null;

  const withoutOrigin = s.replace(/^https?:\/\/[^/]+\//, '');
  const normalized = withoutOrigin
    .replace(/^\/+/, '')
    .replace(/^pdfs\//, '');

  return normalized || null;
}

function createManifestMap(payload: unknown): ManifestMap {
  const entries = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { files?: unknown }).files)
      ? (payload as { files: unknown[] }).files
      : payload && typeof payload === 'object' && Array.isArray((payload as { keys?: unknown }).keys)
        ? (payload as { keys: unknown[] }).keys
        : [];

  const next: ManifestMap = {};

  for (const entry of entries) {
    if (typeof entry !== 'string') continue;
    const key = normalizeAssetKey(entry);
    if (key) next[key] = true;
  }

  return next;
}

const BUNDLED_MANIFEST_MAP: ManifestMap = createManifestMap(pdfManifest);

function derivePdfState(problemExists: boolean, answerExists: boolean): PdfState {
  const missingCount = [problemExists, answerExists].filter(value => !value).length;

  if (missingCount === 0) return 1;
  if (missingCount === 2) return 3;
  return 2;
}

function isGustMode(): boolean {
  if (typeof window === 'undefined') return false;

  const kyotsuWindow = window as Window & {
    __KYOTSU_GUST_MODE__?: boolean;
  };

  if (kyotsuWindow.__KYOTSU_GUST_MODE__) return true;
  if (document.documentElement.dataset.gustMode === '1') return true;

  const params = new URLSearchParams(window.location.search);

  return (
    params.has('o') ||
    params.has('a') ||
    params.has('y') ||
    params.has('s') ||
    params.has('t') ||
    params.has('p')
  );
}

function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

function openInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function downloadFile(url: string, downloadName: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = downloadName;
  link.rel = 'noopener noreferrer';
  link.click();
}

function ActionLink({
  icon: Icon,
  label,
  href,
  exists,
  downloadName,
  isDownload = false,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  exists: boolean;
  downloadName?: string;
  isDownload?: boolean;
}) {
  const gust = isGustMode();
  const absoluteHref = toAbsoluteUrl(href);

  if (!exists) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled
        className="text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0 opacity-50 cursor-not-allowed"
      >
        <Icon className="w-3 h-3 sm:mr-1" />
        <span className="hidden sm:inline">{label}</span>
      </Button>
    );
  }

  if (gust) {
    return (
      <a
        href={absoluteHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        title={label}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'default',
          touchAction: 'manipulation',
        }}
        className="inline-flex items-center justify-center w-7 h-7 rounded border border-gray-300 bg-white text-gray-800 no-underline"
      >
        <Icon className="w-4 h-4 pointer-events-none" />
      </a>
    );
  }

  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className="text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0"
    >
      <a
        href={absoluteHref}
        target={isDownload ? undefined : '_blank'}
        rel={isDownload ? undefined : 'noopener noreferrer'}
        download={isDownload ? downloadName : undefined}
        onClick={(event) => {
          event.preventDefault();

          if (isDownload) {
            downloadFile(
              absoluteHref,
              downloadName ?? absoluteHref.split('/').pop() ?? 'download',
            );
          } else {
            openInNewTab(absoluteHref);
          }
        }}
      >
        <Icon className="w-3 h-3 sm:mr-1" />
        <span className="hidden sm:inline">{label}</span>
      </a>
    </Button>
  );
}

export function PDFTable({ items, title, viewMode }: PDFTableProps) {
  const manifestMap = BUNDLED_MANIFEST_MAP;

  const effectiveItems = useMemo(() => {
    return items.map((item) => {
      const problemExists = Boolean(manifestMap[normalizeAssetKey(item.problemUrl) ?? '']);
      const answerExists = Boolean(manifestMap[normalizeAssetKey(item.answerUrl) ?? '']);
      const pdfState = derivePdfState(problemExists, answerExists);

      return {
        ...item,
        problemExists,
        answerExists,
        pdfState,
      };
    });
  }, [items, manifestMap]);

  const effectiveMainTests = effectiveItems.filter((item) => item.type === 'main');
  const effectiveMakeupTests = effectiveItems.filter((item) => item.type === 'makeup');

  function getRowBgColor(pdfState: PdfState, isEven: boolean): string {
    if (pdfState === 3) return 'bg-red-200';
    if (pdfState === 2) return 'bg-yellow-100';
    return isEven ? 'bg-white' : 'bg-gray-50';
  }

  function getRowHoverColor(pdfState: PdfState): string {
    if (pdfState === 3) return 'hover:bg-red-300';
    if (pdfState === 2) return 'hover:bg-yellow-200';
    return 'hover:bg-gray-100';
  }

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

  const renderTable = (
    tests: Array<PDFItem & { problemExists: boolean; answerExists: boolean; pdfState: PdfState }>,
    tableTitle: string,
    id?: string,
  ) => (
    <div id={id} className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 lg:sticky lg:top-0 bg-gray-100 py-2 z-10">
        {tableTitle}
      </h2>

      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r w-[30%]">
                年度
              </th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r w-[30%]">
                教科
              </th>
              <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r w-[20%]">
                問題
              </th>
              <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 w-[20%]">
                解答
              </th>
            </tr>
          </thead>

          <tbody>
            {tests.map((item, index) => {
              const problemDownloadName =
                `${item.year}_${getSubjectForFilename(item.subject)}_${item.type}_問題.pdf`;

              const answerDownloadName =
                `${item.year}_${getSubjectForFilename(item.subject)}_${item.type}_解答.pdf`;

              return (
                <tr
                  key={item.id}
                  className={`border-b last:border-b-0 ${getRowHoverColor(item.pdfState)} ${getRowBgColor(item.pdfState, index % 2 === 0)}`}
                >
                  <td className="p-2 sm:p-3 border-r">
                    <div className="text-xs sm:text-sm break-words">
                      {viewMode === 'byYear' ? (
                        <span className="text-gray-700">
                          {item.year}年度（{getEraDisplay(item.year)}）
                        </span>
                      ) : (
                        <span className="font-medium text-gray-900">
                          {item.year}年度（{getEraDisplay(item.year)}）
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-2 sm:p-3 border-r">
                    <div className="text-xs sm:text-sm break-words">
                      {viewMode === 'byYear' ? (
                        <span className="font-medium text-gray-900">
                          {getDisplaySubject(item.subject)}
                        </span>
                      ) : (
                        <span className="text-gray-700">
                          {getDisplaySubject(item.subject)}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-2 sm:p-3 border-r">
                    <div className="flex flex-row gap-1 justify-center items-stretch">
                      <ActionLink
                        icon={ExternalLink}
                        label="閲覧"
                        href={item.problemUrl}
                        exists={item.problemExists}
                      />

                      <ActionLink
                        icon={Download}
                        label="DL"
                        href={item.problemUrl}
                        exists={item.problemExists}
                        downloadName={problemDownloadName}
                        isDownload
                      />
                    </div>
                  </td>

                  <td className="p-2 sm:p-3">
                    <div className="flex flex-row gap-1 justify-center items-stretch">
                      <ActionLink
                        icon={ExternalLink}
                        label="閲覧"
                        href={item.answerUrl}
                        exists={item.answerExists}
                      />

                      <ActionLink
                        icon={Download}
                        label="DL"
                        href={item.answerUrl}
                        exists={item.answerExists}
                        downloadName={answerDownloadName}
                        isDownload
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">{title}</h1>

      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={scrollToMakeup}
        >
          <ChevronDown className="w-4 h-4 mr-2" />
          追試験まで移動
        </Button>
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        <div>
          {renderTable(effectiveMainTests, '本試験')}
        </div>
        <div>
          {renderTable(effectiveMakeupTests, '追試験')}
        </div>
      </div>

      <div className="lg:hidden">
        {renderTable(effectiveMainTests, '本試験')}
        {renderTable(effectiveMakeupTests, '追試験', 'makeup-section')}
      </div>
    </div>
  );
}
