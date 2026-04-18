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

export function PDFTable({ items, title, viewMode }: PDFTableProps) {
  const mainTests = items.filter((item) => item.type === 'main');
  const makeupTests = items.filter((item) => item.type === 'makeup');

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
            {tests.map((item, index) => (
              <tr
                key={item.id}
                className={`border-b last:border-b-0 hover:bg-gray-100 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
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
                      className="text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0"
                      onClick={() => window.open(item.problemUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">閲覧</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.problemUrl;
                        link.download = `${item.year}_${getSubjectForFilename(item.subject)}_${item.type}_問題.pdf`;
                        link.click();
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
                      className="text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0"
                      onClick={() => window.open(item.answerUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">閲覧</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs px-1.5 sm:px-2 py-1 h-auto min-w-0"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = item.answerUrl;
                        link.download = `${item.year}_${getSubjectForFilename(item.subject)}_${item.type}_解答.pdf`;
                        link.click();
                      }}
                    >
                      <Download className="w-3 h-3 sm:mr-1" />
                      <span className="hidden sm:inline">DL</span>
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold mb-4 text-gray-900">{title}</h1>

      {/* スマホ用：追試験へのジャンプボタン */}
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

      {/* PC: 左右2列 */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        <div>
          {renderTable(mainTests, '本試験')}
        </div>
        <div>
          {renderTable(makeupTests, '追試験')}
        </div>
      </div>

      {/* スマホ: 上下配置 */}
      <div className="lg:hidden">
        {renderTable(mainTests, '本試験')}
        {renderTable(makeupTests, '追試験', 'makeup-section')}
      </div>
    </div>
  );
}