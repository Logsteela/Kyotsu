import { useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { getEnhancedDatabase, EnhancedTestRecord } from '@/app/data/testDatabase';
import { getTestDetails } from '@/app/data/testDetailsDatabase';
import { getEraDisplay } from '@/app/utils/era';
import { getDisplaySubject } from '@/app/utils/subjectUtils';
import { getPdfUrlPath } from '@/app/utils/pdfPath';
import { Button } from '@/app/components/ui/button';
import { Download, FileText, Volume2, ExternalLink } from 'lucide-react';

export function TestDetailPage() {
  const { questionPdf } = useParams();

  // URLパラメータをデコード
  const decodedPdf = questionPdf ? decodeURIComponent(questionPdf) : '';

  // データベースから該当する試験情報を取得
  const testRecord = useMemo(() => {
    const enhancedDatabase = getEnhancedDatabase();
    return enhancedDatabase.find((record) => record.questionPdf === decodedPdf);
  }, [decodedPdf]);

  // 試験詳細情報を取得
  const testDetails = useMemo(() => {
    return getTestDetails(decodedPdf);
  }, [decodedPdf]);

  // データが見つからない場合
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

  // 特別試験かどうかを判定（年度が文字列の場合は特別試験）
  const isSpecialTest = typeof testRecord.year === 'string';
  
  // 年度表示用のヘルパー関数（特別試験の場合は「年度」を付けない）
  const formatYear = (year: number | string) => {
    return isSpecialTest ? year : `${year}年度`;
  };

  // ページタイトルと説明
  const pageTitle = `${formatYear(testRecord.year)} ${getDisplaySubject(testRecord.subject)} ${testRecord.testType === 'main' ? '本試験' : '追試験'} - 共通テスト過去問総集`;
  const description = `${formatYear(testRecord.year)}共通テスト ${getDisplaySubject(testRecord.subject)} ${testRecord.testType === 'main' ? '本試験' : '追試験'}の問題・解答PDFの詳細情報ページです。`;

  // パンくずリスト用のアイテム
  const breadcrumbItems = [
    { name: formatYear(testRecord.year), url: `/year/${testRecord.year}` },
    { name: `${getDisplaySubject(testRecord.subject)} ${testRecord.testType === 'main' ? '本試験' : '追試験'}`, url: '' },
  ];

  // PDFダウンロードボタンコンポーネント
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
    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer" download>
        <Button variant="default" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          {label}をダウンロード
        </Button>
      </a>
    );
  };

  // 音声ダウンロードボタンコンポーネント
  const AudioDownloadButton = ({ audioPath, exists }: { audioPath: string; exists: boolean }) => {
    if (!audioPath || !exists) {
      return null;
    }

    const urlPath = getPdfUrlPath(audioPath);
    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer" download>
        <Button variant="default" className="w-full sm:w-auto">
          <Volume2 className="w-4 h-4 mr-2" />
          音声ファイルをダウンロード
        </Button>
      </a>
    );
  };

  // PDF閲覧ボタンコンポーネント
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
    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="w-full sm:w-auto">
          <ExternalLink className="w-4 h-4 mr-2" />
          {label}を閲覧
        </Button>
      </a>
    );
  };

  // 音声閲覧ボタンコンポーネント
  const AudioViewButton = ({ audioPath, exists }: { audioPath: string; exists: boolean }) => {
    if (!audioPath || !exists) {
      return null;
    }

    const urlPath = getPdfUrlPath(audioPath);
    return (
      <a href={urlPath} target="_blank" rel="noopener noreferrer">
        <Button variant="outline" className="w-full sm:w-auto">
          <Volume2 className="w-4 h-4 mr-2" />
          音声を再生
        </Button>
      </a>
    );
  };

  return (
    <div>
      <Breadcrumbs items={breadcrumbItems} />
      
      <div className="p-4 lg:p-6">
        <SEOMeta title={pageTitle} description={description} />
        <StructuredData
          type="Dataset"
          name={`${formatYear(testRecord.year)} ${getDisplaySubject(testRecord.subject)} ${testRecord.testType === 'main' ? '本試験' : '追試験'}`}
          description={description}
        />

        <div className="flex flex-col gap-6">
          {/* ページタイトル */}
          <div className="border-b border-gray-200 pb-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {formatYear(testRecord.year)} {getDisplaySubject(testRecord.subject)}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              {testRecord.testType === 'main' ? '本試験' : '追試験'}
              {typeof testRecord.year === 'number' && ` （${getEraDisplay(testRecord.year)}）`}
            </p>
          </div>

          {/* 基本情報セクション */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">試験情報</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">年度</span>
                <span className="text-base font-medium text-gray-900">{formatYear(testRecord.year)}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">試験区分</span>
                <span className="text-base font-medium text-gray-900">
                  {testRecord.testType === 'main' ? '本試験' : '追試験'}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-gray-500">教科名</span>
                <span className="text-base font-medium text-gray-900">{getDisplaySubject(testRecord.subject)}</span>
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

          {/* 統計情報セクション */}
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

          {/* 特記事項セクション */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">特記事項</h2>
            <p className="text-base text-gray-700">
              {testDetails?.specialNotes && testDetails.specialNotes.trim() !== '' 
                ? testDetails.specialNotes 
                : 'なし'}
            </p>
          </div>

          {/* 閲覧セクション */}
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

          {/* ダウンロードセクション */}
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

          {/* 戻るリンク */}
          <div className="mt-4">
            <Link to={`/year/${testRecord.year}`}>
              <Button variant="outline">
                ← {formatYear(testRecord.year)}一覧に戻る
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}