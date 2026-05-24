 import { Link } from 'react-router';
import { FileText, Calendar, ArrowRight, Clock, Info } from 'lucide-react';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Button } from '@/app/components/ui/button';

export function HomePage() {
  const title = '共通テスト過去問総集｜PDFダウンロード';
  const description = '共通テスト、センター試験、共通一次、追試験、特例追試験の問題、解答の過去問PDFを年度別、教科別掲載。';

  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        path="/"
        keywords="共通テスト,過去問,センター試験,共通一次,一覧,特例追試験,追試験,再試験,大学入試,問題,解答,PDF,ダウンロード,ホーム"
      />
      <StructuredData type="WebSite" />
      <StructuredData type="EducationalOccupationalProgram" />

      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <div className="w-full">
          {/* ウェルカムセクション */}
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              共通テスト過去問総集
            </h1>
            <p className="text-gray-700 leading-relaxed mb-4">
              このサイトでは、ほとんど全ての共通テストの問題・解答を無料で閲覧・ダウンロードできます。また、旧センター試験、旧共通一次試験も収集しています。
              すべての過去問を網羅的に収録している最中です。
            </p>
            <p className="text-gray-700 leading-relaxed">
              年度別・教科別で閲覧する機能を使って、必要な過去問を素早く見つけることができます。
            </p>
          </section>

          {/* クイックアクセス */}
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-[var(--color-brand-green)]" />
              クイックアクセス
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link to="/overview">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4 hover:bg-gray-50 hover:border-[var(--color-brand-green)]"
                >
                  <div className="flex items-start gap-3 w-full">
                    <FileText className="w-5 h-5 text-[var(--color-brand-green)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 mb-1">総覧</div>
                      <div className="text-sm text-gray-600">すべてのテストを一覧表示</div>
                    </div>
                  </div>
                </Button>
              </Link>

              <Link to="/year/2026">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto py-4 px-4 hover:bg-gray-50 hover:border-[var(--color-brand-green)]"
                >
                  <div className="flex items-start gap-3 w-full">
                    <Calendar className="w-5 h-5 text-[var(--color-brand-green)] flex-shrink-0 mt-0.5" />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 mb-1">最新年度（2026年度）</div>
                      <div className="text-sm text-gray-600">令和8年度の過去問へ</div>
                    </div>
                  </div>
                </Button>
              </Link>
            </div>
          </section>

          {/* サイトの目的 */}
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-[var(--color-brand-green)]" />
              このサイトについて
            </h3>
            <div className="space-y-4 text-gray-700">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">目的</h4>
                <p className="leading-relaxed">
                  大学入学共通テストの過去問は、過去三年分は大学入試センターから発表されますが、それ以前は非公開となります。また、予備校が発表する過去問は、速報を基盤としていることから、追試が欠落していることが多いです。<br/>このように、非常に高い公的性質を持つテストにもかかわらず、その過去の状況が非常につかみづらく、また演習を重ねたい人にとって非常に悪い環境となっています。<br/>そこで、これを改善すべく、直近の物から順に共通テスト・センター試験・共通一次試験の問題を収集することで、様々な用途に役立てることができると考えています。<br/>共通テストの過去問はすべて揃えているため、タイトル詐欺ではないと思います。
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">注意事項</h4>
                <p className="leading-relaxed">・公式サイトではありません。問題や解答に関する問い合わせには回答できません。<br/>・掲載やシステムそのものに誤りがあると思われる場合は、右下のヘルプからメールアドレスを確認して連絡してください。<br/>・問題の解答に必要なもの以外は配布を行いません。また、解答などに必要と思われるものであっても、以下に示されたものは全て配布を行いません。今後の配布予定もありません。<br/>
①解答用紙<br/>
②問題冊子の表紙<br/>
③音声調整用音声<br/>
④共通テスト手順記述標準言語 (DNCL) の説明<br/>
⑤拡大文字問題冊子<br/>
⑥点字問題冊子<br/>
・以下に示されたものは配布を行うとは限りません。一部の場合にのみ配布されます。<br/>
①問題訂正紙（これが入手されていて、かつこれの適用後の問題などが存在しないまたは失われている場合）<br/>
②補足説明紙（同上）<br/>
③リスニングのスクリプト（これが入手されていて、かつリスニング音源が失われている場合）<br/>
</p>

              </div>


</div>
          </section>
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-brand-green)]" />
              更新履歴
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">2026年5月2日</span>
                  <span className="text-sm text-gray-600">Ver 0.0.2β</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                 昭和50,51,52,63年の試行、平成30年記述提供方式、令和3年サンプルの追加
                </p>
              </div>
             <div className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">2026年4月19日</span>
                  <span className="text-sm text-gray-600">Ver 0.0.1β</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  ベータ版を公開
                </p>
              </div>

            </div>
          </section>
        </div>
      </div>
    </>
  );
}
