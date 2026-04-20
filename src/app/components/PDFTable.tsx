import { useEffect, useMemo, useState } from 'react';
import { Download, ExternalLink, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { getEraDisplay } from '@/app/utils/era';
import { getDisplaySubject, getSubjectForFilename } from '@/app/utils/subjectUtils';

interface PDFItem {
  id: string;
  subject: string;
  year: number;
  type: 'main' | 'makeup'; // 本試験 or 追試験
  problemUrl: string;
  answerUrl: string;
}

interface PDFTableProps {
  items: PDFItem[];
  title: string;
  viewMode: 'byYear' | 'bySubject' | null; // 年度別か教科別か
}

type PdfState = 1 | 2 | 3;
type ManifestStatus = 'loading' | 'ready' | 'missing';

const PDF_BASE_URL = (import.meta.env.VITE_PDF_BASE_URL ?? '')
  .trim()
  .replace(/\/+$/, '');

const PDF_MANIFEST_URL = (
  import.meta.env.VITE_PDF_MANIFEST_URL ??
  (PDF_BASE_URL ? `${PDF_BASE_URL}/manifest.json` : '/manifest.json')
).trim();

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

async function checkUrlExists(url: string): Promise<boolean> {
  try {
    const headResponse = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      cache: 'no-store',
    });

    return headResponse.ok;
  } catch {
    try {
      const getResponse = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
      });

      return getResponse.ok;
    } catch {
      return false;
    }
  }
}

function derivePdfState(problemExists: boolean, answerExists: boolean): PdfState {
  const missingCount = [problemExists, answerExists].filter(value => !value).length;

  if (missingCount === 0) return 1;
  if (missingCount === 2) return 3;
  return 2;
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

export function PDFTable({ items, title, viewMode }: PDFTableProps) {
  const mainTests = items.filter((item) => item.type === 'main');
  const makeupTests = items.filter((item) => item.type === 'makeup');

  const [manifestMap, setManifestMap] = useState<Record<string, true>>({});
  const [manifestStatus, setManifestStatus] = useState<ManifestStatus>(PDF_MANIFEST_URL ? 'loading' : 'missing');
  const [urlExistsMap, setUrlExistsMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    if (!PDF_MANIFEST_URL) {
      setManifestStatus('missing');
      return;
    }

    setManifestStatus('loading');

    const loadManifest = async () => {
      try {
        const response = await fetch(PDF_MANIFEST_URL, {
          method: 'GET',
          mode: 'cors',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`manifest fetch failed: ${response.status}`);
        }

        const json = await response.json();
        if (cancelled) return;

        setManifestMap(createManifestMap(json));
        setManifestStatus('ready');
      } catch {
        if (cancelled) return;
        setManifestMap({});
        setManifestStatus('missing');
      }
    };

    void loadManifest();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleAssetUrls = useMemo(() => {
    return Array.from(
      new Set(
        items
          .flatMap(item => [item.problemUrl, item.answerUrl])
          .filter((url): url is string => Boolean(url?.trim()))
      )
    );
  }, [items]);

  useEffect(() => {
    let cancelled = false;

    if (manifestStatus !== 'missing') return;

    const uncheckedUrls = visibleAssetUrls.filter(url => !(url in urlExistsMap));
    if (uncheckedUrls.length === 0) return;

    const verifyUrls = async () => {
      const results = await Promise.all(
        uncheckedUrls.map(async (url) => [url, await checkUrlExists(url)] as const)
      );

      if (cancelled) return;

      setUrlExistsMap(prev => {
        const next = { ...prev };
        for (const [url, exists] of results) {
          next[url] = exists;
        }
        return next;
      });
    };

    void verifyUrls();

    return () => {
      cancelled = true;
    };
  }, [manifestStatus, visibleAssetUrls, urlExistsMap]);

  function resolveExists(url: string | undefined | null): boolean {
    const key = normalizeAssetKey(url);
    if (!key) return false;

    if (manifestStatus === 'ready') {
      return Boolean(manifestMap[key]);
    }

    const normalizedUrl = (url ?? '').trim();
    if (!normalizedUrl) return false;

    if (normalizedUrl in urlExistsMap) {
      return urlExistsMap[normalizedUrl];
    }

    return true;
  }

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

  function getActionButtonClass(exists: boolean): string {
    return exists
      ? 'text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0'
      : 'text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0 opacity-50 cursor-not-allowed';
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

  const renderTable = (tests: PDFItem[], tableTitle: string, id?: string) => (
    <div id={id} className="mb-8">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 lg:sticky lg:top-0 bg-gray-100 py-2 z-10">
        {tableTitle}
      </h2>
      <div className="bg-white border rounded overflow-hidden">
        <table className="w-full table-fixed">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r w-[30%]">年度</th>
              <th className="text-left p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r w-[30%]">教科</th>
              <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 border-r w-[20%]">問題</th>
              <th className="text-center p-2 sm:p-3 text-xs sm:text-sm font-semibold text-gray-700 w-[20%]">解答</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((item, index) => {
              const problemExists = resolveExists(item.problemUrl);
              const answerExists = resolveExists(item.answerUrl);
              const pdfState = derivePdfState(problemExists, answerExists);

              return (
                <tr
                  key={item.id}
                  className={`border-b last:border-b-0 ${getRowHoverColor(pdfState)} ${getRowBgColor(pdfState, index % 2 === 0)}`}
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
                        <span className="font-medium text-gray-900">{getDisplaySubject(item.subject)}</span>
                      ) : (
                        <span className="text-gray-700">{getDisplaySubject(item.subject)}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 border-r">
                    <div className="flex flex-row gap-1 justify-center items-stretch">
                      <Button
                        size="sm"
                        variant="outline"
                        className={getActionButtonClass(problemExists)}
                        disabled={!problemExists}
                        onClick={() => openInNewTab(item.problemUrl)}
                      >
                        <ExternalLink className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">閲覧</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={getActionButtonClass(problemExists)}
                        disabled={!problemExists}
                        onClick={() => {
                          downloadFile(
                            item.problemUrl,
                            `${item.year}_${getSubjectForFilename(item.subject)}_${item.type}_問題.pdf`
                          );
                        }}
                      >
                        <Download className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">DL</span>
                      </Button>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="flex flex-row gap-1 justify-center items-stretch">
                      <Button
                        size="sm"
                        variant="outline"
                        className={getActionButtonClass(answerExists)}
                        disabled={!answerExists}
                        onClick={() => openInNewTab(item.answerUrl)}
                      >
                        <ExternalLink className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">閲覧</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={getActionButtonClass(answerExists)}
                        disabled={!answerExists}
                        onClick={() => {
                          downloadFile(
                            item.answerUrl,
                            `${item.year}_${getSubjectForFilename(item.subject)}_${item.type}_解答.pdf`
                          );
                        }}
                      >
                        <Download className="w-3 h-3 sm:mr-1" />
                        <span className="hidden sm:inline">DL</span>
                      </Button>
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
          {renderTable(mainTests, '本試験')}
        </div>
        <div>
          {renderTable(makeupTests, '追試験')}
        </div>
      </div>

      <div className="lg:hidden">
        {renderTable(mainTests, '本試験')}
        {renderTable(makeupTests, '追試験', 'makeup-section')}
      </div>
    </div>
  );
}
