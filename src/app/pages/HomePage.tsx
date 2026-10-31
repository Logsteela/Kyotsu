 import { Link } from 'react-router';
import { FileText, Calendar, ArrowRight, Clock, Info, BarChart3 } from 'lucide-react';
import { COMMON_TEST_2026_RESEARCH } from '@/app/data/commonTest2026Research';
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Button } from '@/app/components/ui/button';

export function HomePage() {
  const title = '共通テストの大問別得点率・年度比較｜問題分析と過去問総集';
  const description = '2025・2026年度共通テスト本試験の大問別得点率、設問別正答率、得点分布、問題評価を独自に整理・比較。過去問PDFと歴代平均点も年度・科目別に検索できます。';
  const physics = COMMON_TEST_2026_RESEARCH['物理'].parts;
  const english = COMMON_TEST_2026_RESEARCH['英語（リーディング）'].parts;
  const physSecond = physics.find(p => p.number === 2)!;
  const physFourth = physics.find(p => p.number === 4)!;
  const englishFourth = english.find(p => p.number === 4)!;
  const englishSeventh = english.find(p => p.number === 7)!;

  return (
    <>
      <SEOMeta
        title={title}
        description={description}
        path="/"
        keywords="共通テスト,大問別得点率,正答率,得点分布,年度比較,問題評価,過去問,センター試験,共通一次"
      />
      <StructuredData type="WebSite" />

      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <div className="w-full">
          {/* ウェルカムセクション */}
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              大学入試過去問の資料・分析集
            </h1>
            <p className="text-gray-700 leading-relaxed mb-4">
              共通テストの平均点を眺めるだけでなく、<strong>大問ごとの得点率・設問別正答率・得点分布・前年との差</strong>を比較できます。
              2025・2026年度本試験では、公表された試験成績と問題評価を照合し、出題内容と得点差の特徴を当サイトで整理しています。
            </p>
            <p className="text-gray-700 leading-relaxed">
              共通テスト・センター試験・共通一次の問題と解答も、年度別・科目別に検索・閲覧できます。未収録や未照合の資料は、推測で補っていません。
            </p>
          </section>

          {/* 公表データを照合した分析への入口（過去問一覧のUIは変更しない） */}
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6" aria-labelledby="home-analysis-heading">
            <h2 id="home-analysis-heading" className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[var(--color-brand-green)]" />
              本試験の独自比較・分析
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              どの大問が全体の成績を押し下げたのか、前年からどこが変わったのかを、
              大学入試センター公表データの大問別集計と問題評価から読み取れます。
              例えば2026年度本試験では、以下のような科目内の差が見られます。
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-gray-900 mb-2">物理：電磁気の大問と力学の差</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  第2問は得点率<strong>{physSecond.scoreRate.toFixed(2)}%</strong>、第4問は<strong>{physFourth.scoreRate.toFixed(2)}%</strong>。
                  同じ25点配点の大問で<strong>{(physSecond.scoreRate - physFourth.scoreRate).toFixed(2)}ポイント</strong>の差があります。
                </p>
              </div>
              <div className="border border-gray-200 rounded-md p-4">
                <h3 className="font-semibold text-gray-900 mb-2">英語リーディング：大問間の得点差</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  第4問の得点率は<strong>{englishFourth.scoreRate.toFixed(2)}%</strong>、第7問は<strong>{englishSeventh.scoreRate.toFixed(2)}%</strong>。
                  文章の推敲と科学的説明文では<strong>{(englishFourth.scoreRate - englishSeventh.scoreRate).toFixed(2)}ポイント</strong>違います。
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              得点率は受験者の平均得点を配点で割った値です。科目・大問間の差は、そのまま問題の客観的難易度を表すものではありません。
              数値の定義と資料は<Link to="/sources#research-methods" className="underline text-[var(--color-brand-green)]">出典・集計方法</Link>にまとめています。
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <Link className="underline text-[var(--color-brand-green)]" to="/common-test-2026-analysis">2026年度・27科目の出題分析</Link>
              <Link className="underline text-[var(--color-brand-green)]" to="/common-test-2025-analysis">2025年度の分析と大問別得点率</Link>
              <Link className="underline text-[var(--color-brand-green)]" to="/year-statistics">歴代の平均点・得点率を比較</Link>
            </div>
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
                  大学入学共通テストの過去問は、過去三年分は大学入試センターから発表されますが、それ以前は非公開となります。また、予備校が発表する過去問は、速報を基盤としていることから、追試が欠落していることが多いです。<br/>このように、非常に高い公的性質を持つテストにもかかわらず、その過去の状況が非常につかみづらく、また演習を重ねたい人にとって非常に悪い環境となっています。<br/>そこで、これを改善すべく、直近の物から順に共通テスト・センター試験・共通一次試験の問題を収集することで、様々な用途に役立てることができると考えています。<br/>収録状況は資料ごとに異なります。欠損や出典が判明している場合は個別の試験情報に記録しています。<br/>他にも、独自の分析情報なども多数掲載されています。
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

          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[var(--color-brand-green)]" />
              更新履歴
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">2026年5月31日</span>
                  <span className="text-sm text-gray-600">Ver 0.0.3β</span>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                 2004年問題例、2015年試作問題、2004年一部追試験解答、2015年一部追試験の追加
                </p>
              </div>
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
