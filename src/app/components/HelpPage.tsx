import { X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface HelpPageProps {
  onClose: () => void;
}

export function HelpPage({ onClose }: HelpPageProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="sticky top-0 bg-white border-b border-[var(--color-table-border)] p-4 flex items-center justify-between gap-4 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">ヘルプ</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            className="flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">使い方</h3>
            <p className="text-gray-700 mb-2">
              このシステムは、過去の共通テスト・センター試験・共通一次を年度別・教科別に閲覧・ダウンロードできる管理システムです。全く以て未完ですが，共通テストは全て網羅しています。なのでタイトル詐欺ではないです。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">年度別表示</h3>
            <p className="text-gray-700 mb-2">
              左側のメニューから年度を選択すると、その年度の全教科のテストが表示されます。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">教科別表示</h3>
            <p className="text-gray-700 mb-2">
              左側のメニューから教科を選択すると、その教科の全年度のテストが表示されます。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">総覧表示</h3>
            <p className="text-gray-700 mb-2">
              左側のメニューから「全テスト一覧」を選択すると、掲載されている全テストが本試験→追試験→特別試験の順に表示されます。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">本試験・追試験</h3>
            <p className="text-gray-700 mb-2">
              PC表示では左右に、スマホ表示では上下に本試験と追試験が配置されます。
              スマホの場合、「追試験まで移動」ボタンで素早く移動できます。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">フィルタリング機能</h3>
            <p className="text-gray-700 mb-2">
              理科、理科基礎、社会、その他の教科では、科目ごとにフィルタリングが可能です。
              科目ボタンをクリックして表示/非表示を切り替えることができます。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">PDFの閲覧・ダウンロード</h3>
            <p className="text-gray-700 mb-2">
              各テストには「問題」と「解答」があり、それぞれ「閲覧」ボタンで新しいタブで開く、
              「DL」ボタンでダウンロードすることができます。リスニングでは、音声をダウンロードできることもあります。
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">PDF状態の表示</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><span className="font-semibold">通常（白/灰色背景）</span>：PDFファイルが完全に揃っています</li>
              <li><span className="font-semibold">一部欠損（黄色背景）</span>：ページの欠落や省略、音源が無いなどで一部要素が欠けており、解くのに必要な情報が全て与えられない可能性があります。</li>
              <li><span className="font-semibold">完全欠損（赤色背景）</span>：PDFファイルが存在しません。「（欠落）」と表示されます</li>
            </ul>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">連絡</h3>
            <p className="text-gray-700 mb-2">
              入試側ではなく，サイト制作者に何らかの誤りがあると思われる場合は，lordingcontact at gmail dot com にメールしてください。一般に誤りとされる綴りでアドレスを取得しているので間違えないでください。どうでもいい誤りは，どうでもよくない誤りと一緒に伝達された場合のみ受け付けます。
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold mb-2 text-gray-900">注意事項</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>私はこのサイトに関する一切の著作権を放棄し、また著作者人格権の不行使を確言します。</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}