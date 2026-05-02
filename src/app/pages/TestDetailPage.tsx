import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { getEnhancedDatabase, SLUG_TO_CATEGORY } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { getEraDisplay } from '@/app/utils/era';
import { getDisplaySubject } from '@/app/utils/subjectUtils';
import { getPdfUrlPath } from '@/app/utils/pdfPath';
import { Button } from '@/app/components/ui/button';
import {
  Download,
  FileText,
  Volume2,
  ExternalLink,
  Clipboard,
  Check,
  LucideIcon,
} from 'lucide-react';

const SITE_ORIGIN = 'https://kyotsutest.vercel.app';

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

function getSubjectSlug(categorySubject: string): string | null {
  const entry = Object.entries(SLUG_TO_CATEGORY).find(([, value]) => value === categorySubject);
  return entry?.[0] ?? null;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallbackへ
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);

    return ok;
  } catch {
    return false;
  }
}

function CopyUrlButton({
  icon: Icon,
  label,
  url,
}: {
  icon: LucideIcon;
  label: string;
  url: string;
}) {
  const [copied, setCopied] = useState(false);
  const absoluteUrl = toAbsoluteUrl(url);

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full sm:w-auto"
      onClick={async () => {
        const ok = await copyTextToClipboard(absoluteUrl);

        if (!ok) {
          window.prompt('このURLをコピーしてください', absoluteUrl);
          return;
        }

        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          コピー済み
        </>
      ) : (
        <>
          <Clipboard className="w-4 h-4 mr-2" />
          {label}URLをコピー
        </>
      )}
    </Button>
  );
}

export function TestDetailPage() {
  const { questionPdf } = useParams();

  const decodedPdf = questionPdf ? decodeURIComponent(questionPdf) : '';

  const testRecord = useMemo(() => {
    const enhancedDatabase = getEnhancedDatabase();
    return enhancedDatabase.find((record) => record.questionPdf === decodedPdf);
  }, [decodedPdf]);

  const testDetails = useMemo(() => {
    return getTestDetails(decodedPdf);
  }, [decodedPdf]);

  if (!testRecord) {
    return (
      <div className="p-4 lg:p-6">
        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">試験が見つかりません</h1>
        <p className="text-gray-600 mb-4">指定された試験情報が見つかりませんでした。</p>
        <Link to="/">
          <Button variant="outline">ホームに戻る</Button>
        </Link>
      </div>
    );
  }

  const isSpecialTest = typeof testRecord.year === 'string';

  const formatYear = (year: number | string) => {
    return isSpecialTest ? year : `${year}年度`;
  };

  const formattedYear = formatYear(testRecord.year);
  const displaySubject = getDisplaySubject(testRecord.subject);
  const testTypeLabel = testRecord.testType === 'main' ? '本試験' : '追試験';
  const yearPath = `/year/${encodeURIComponent(String(testRecord.year))}`;
  const subjectSlug = testRecord.categorySubject
    ? getSubjectSlug(testRecord.categorySubject)
    : null;
  const subjectPath = subjectSlug ? `/subject/${subjectSlug}` : '';
  const subjectFilteredPath = subjectPath
    ? `${subjectPath}?subject=${encodeURIComponent(testRecord.essentialSubject || displaySubject)}`
    : '';
  const pagePath = `/test/${encodeURIComponent(decodedPdf)}`;

  const pageTitle = `${formattedYear} ${displaySubject} ${testTypeLabel}｜問題・解答PDF｜共通テスト過去問総集`;

  const description = `${formattedYear} ${displaySubject} ${testTypeLabel}の問題PDF、解答PDF、平均点、受験者数。`;

  const breadcrumbItems = [
    { name: formattedYear, url: yearPath },
    ...(subjectPath
      ? [{ name: testRecord.categorySubject || displaySubject, url: subjectPath }]
      : []),
    { name: testTypeLabel, url: '' },
  ];

  const DownloadButton = ({ label, pdfPath, exists }: { label: string; pdfPath: string; exists: boolean }) => {
    if (!exists) {
      return (
        <Button variant="outline" disabled className="w-full sm:w-auto">
          <FileText className="w-4 h-4 mr-2" />
          {label}（未公開）
        </Button>
      );
    }

    const urlPath = getPdfUrlPath(pdfPath);

    if (isGustMode()) {
      return (
        <CopyUrlButton
          icon={Download}
          label={label}
          url={urlPath}
        />
      );
    }

    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer" download type="application/pdf">
        <Button variant="default" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          {label}をダウンロード
        </Button>
      </a>
    );
  };

  const AudioDownloadButton = ({ audioPath, exists }: { audioPath: string; exists: boolean }) => {
    if (!audioPath || !exists) {
      return null;
    }

    const urlPath = getPdfUrlPath(audioPath);

    if (isGustMode()) {
      return (
        <CopyUrlButton
          icon={Volume2}
          label="音声"
          url={urlPath}
        />
      );
    }

    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer" download>
        <Button variant="default" className="w-full sm:w-auto">
          <Volume2 className="w-4 h-4 mr-2" />
          音声ファイルをダウンロード
        </Button>
      </a>
    );
  };

  const ViewButton = ({ label, pdfPath, exists }: { label: string; pdfPath: string; exists: boolean }) => {
    if (!exists) {
      return (
        <Button variant="outline" disabled className="w-full sm:w-auto">
          <FileText className="w-4 h-4 mr-2" />
          {label}（未公開）
        </Button>
      );
    }

    const urlPath = getPdfUrlPath(pdfPath);

    if (isGustMode()) {
      return (
        <CopyUrlButton
          icon={ExternalLink}
          label={label}
          url={urlPath}
        />
      );
    }

    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer" type="application/pdf">
        <Button variant="outline" className="w-full sm:w-auto">
          <ExternalLink className="w-4 h-4 mr-2" />
          {label}を閲覧
        </Button>
      </a>
    );
  };

  const AudioViewButton = ({ audioPath, exists }: { audioPath: string; exists: boolean }) => {
    if (!audioPath || !exists) {
      return null;
    }

    const urlPath = getPdfUrlPath(audioPath);

    if (isGustMode()) {
      return (
        <CopyUrlButton
          icon={Volume2}
          label="音声"
          url={urlPath}
        />
      );
    }

    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="w-full sm:w-auto">
          <Volume2 className="w-4 h-4 mr-2" />
          音声を再生
        </Button>
      </a>
    );
  };

  const linkedValueClassName = 'text-base font-medium text-gray-900 hover:text-[var(--color-brand-green)] transition-colors';

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />

      <div className="p-4 lg:p-6">
        <SEOMeta
          title={pageTitle}
          description={description}
          path={pagePath}
          keywords={`共通テスト,過去問,${formattedYear},${displaySubject},${testTypeLabel},問題,解答,PDF,平均点,受験者数`}
        />
        <StructuredData
          type="WebPage"
          pageTitle={pageTitle}
          pageDescription={description}
          pagePath={pagePath}
          breadcrumbs={breadcrumbItems}
        />
        <StructuredData
          type="Dataset"
          name={`${formattedYear} ${displaySubject} ${testTypeLabel}`}
          description={description}
          url={getPdfUrlPath(testRecord.questionPdf)}
          keywords={[
            '共通テスト',
            '過去問',
            formattedYear,
            displaySubject,
            testTypeLabel,
            '問題PDF',
            '解答PDF',
          ]}
        />

        <div className="flex flex-col gap-6">
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {formattedYear} {displaySubject}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {testTypeLabel}
              {typeof testRecord.year === 'number' && ` （${getEraDisplay(testRecord.year)}）`}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">試験情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">年度</span>
                <Link to={yearPath} className={linkedValueClassName}>
                  {formattedYear}
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">試験区分</span>
                <span className="text-base font-medium text-gray-900">
                  {testTypeLabel}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">教科名</span>
                {subjectFilteredPath ? (
                  <Link to={subjectFilteredPath} className={linkedValueClassName}>
                    {displaySubject}
                  </Link>
                ) : (
                  <span className="text-base font-medium text-gray-900">{displaySubject}</span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">実施日</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.implementationDate || '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">試験時間</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.testDuration ? `${testDetails.testDuration}分` : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">配点</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.totalScore ? `${testDetails.totalScore}点満点` : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">統計情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">受験者数</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.examinees !== undefined && testDetails.examinees !== null && testDetails.examinees !== ''
                    ? `${testDetails.examinees.toLocaleString()}人`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">平均点</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.averageScore !== undefined && testDetails.averageScore !== null && testDetails.averageScore !== ''
                    ? `${testDetails.averageScore}点`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">最高点</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.highestScore !== undefined && testDetails.highestScore !== null && testDetails.highestScore !== ''
                    ? `${testDetails.highestScore}点`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">最低点</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.lowestScore !== undefined && testDetails.lowestScore !== null && testDetails.lowestScore !== ''
                    ? `${testDetails.lowestScore}点`
                    : '-'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">標準偏差</span>
                <span className="text-base font-medium text-gray-900">
                  {testDetails?.standardDeviation !== undefined && testDetails.standardDeviation !== null && testDetails.standardDeviation !== ''
                    ? testDetails.standardDeviation
                    : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">特記事項</h2>
            <p className="text-base text-gray-700">
              {testDetails?.specialNotes && testDetails.specialNotes.trim() !== ''
                ? testDetails.specialNotes
                : 'なし'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">閲覧</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <ViewButton
                label="問題"
                pdfPath={testRecord.questionPdf}
                exists={testRecord.questionExists}
              />
              <ViewButton
                label="解答"
                pdfPath={testRecord.answerPdf}
                exists={testRecord.answerExists}
              />
              {testRecord.audio && (
                <AudioViewButton
                  audioPath={testRecord.audio}
                  exists={testRecord.audioExists}
                />
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">ダウンロード</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <DownloadButton
                label="問題"
                pdfPath={testRecord.questionPdf}
                exists={testRecord.questionExists}
              />
              <DownloadButton
                label="解答"
                pdfPath={testRecord.answerPdf}
                exists={testRecord.answerExists}
              />
              {testRecord.audio && (
                <AudioDownloadButton
                  audioPath={testRecord.audio}
                  exists={testRecord.audioExists}
                />
              )}
            </div>
          </div>

          <div className="mt-4">
            <Link to={yearPath}>
              <Button variant="outline">
                ← {formattedYear}一覧に戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
