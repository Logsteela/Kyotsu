import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
export function GuidePage() {
  return (
    <>
      <SEOMeta path="/guide" title="過去問資料の使い方｜共通テスト過去問総集"
        description="共通テスト・センター試験・共通一次の過去問を、制度の違い、年度、科目、本試験・追試験から探す方法を説明します。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-4xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-5">資料の使い方と注意点</h1>
          <p className="mb-5">このサイトは、大学入学共通テストだけでなく、その前身である大学入試センター試験・共通第1次学力試験、追試験、試作問題などの資料を年度・科目別に探すための非公式アーカイブです。</p>
          <h2 className="text-xl font-semibold mb-2">試験制度による違い</h2>
          <p className="mb-5">共通第1次学力試験は1979年に始まり、1990年から大学入試センター試験に、2021年から大学入学共通テストに移行しました。1975年以降の試行・研究段階の資料も収録対象に含まれます。制度や科目構成が異なるため、過去の問題を現在の試験と同条件で比較できるとは限りません。</p>
          <h2 className="text-xl font-semibold mb-2">年度別・教科別に探す</h2>
          <p className="mb-5"><Link className="underline text-[var(--color-brand-green)]" to="/overview">総覧</Link>は収録全件の一覧、年度別は同じ年の資料、教科別は異なる年の同じ教科をまとめています。追試験も通常の本試験とは分けて掲載します。PDFの欠損や収録状況により閲覧できない資料もあります。</p>
          <h2 className="text-xl font-semibold mb-2">平均点を比較する</h2>
          <p className="mb-5"><Link className="underline text-[var(--color-brand-green)]" to="/statistics">科目別平均点の年度推移</Link>では、試験情報として保有する平均点と満点を照合できます。得点率を示していても、受験者の学力や問題難易度の変化を直接示すものではありません。</p>
          <h2 className="text-xl font-semibold mb-2">出典と資料の扱い</h2>
          <p className="mb-5">各試験の詳細ページに記載された特記事項には、資料の提供元などが含まれる場合があります。欠損や誤記は修正対象です。問題文・解答・音声などの権利は、それぞれの権利者に帰属します。利用時は原資料や公表元も確認してください。</p>

          <h2 className="text-xl font-semibold mb-2">目的別の探し方</h2>
          <div className="space-y-3 mb-5">
            <p><strong>一つの年度をまとめて演習する場合：</strong><Link className="underline text-[var(--color-brand-green)]" to="/year/2026">2026年度の一覧</Link>など年度ページから、本試験・追試験の資料を探せます。科目によっては問題・解答・音声のそれぞれが別ファイルです。</p>
            <p><strong>同じ科目を複数年分比較したい場合：</strong><Link className="underline text-[var(--color-brand-green)]" to="/subject/eigo-listening">英語リスニングの一覧</Link>のように教科別で表示すると、年度をまたいで確認できます。</p>
            <p><strong>統計を比較したい場合：</strong><Link className="underline text-[var(--color-brand-green)]" to="/statistics">科目別の年度推移</Link>と<Link className="underline text-[var(--color-brand-green)]" to="/year-statistics">同年度の科目比較</Link>を使い分けてください。平均得点率は得点の比率であって、難易度の直接的な指標ではありません。</p>
            <p><strong>資料そのものが揃っているか確認したい場合：</strong><Link className="underline text-[var(--color-brand-green)]" to="/coverage">収録状況</Link>で、年度ごとのレコード数、統計・出典の登録状況を確認できます。</p>
          </div>
          <p className="mb-5"><strong>共通テスト本試験の前年との差が気になる場合：</strong><Link className="underline text-[var(--color-brand-green)]" to="/common-test-changes">2021年度以降の科目別前年差一覧</Link>で、同名・同満点の科目に絞って確認できます。</p>
          <p className="mb-5"><strong>2026年度の大問や正答率を調べたい場合：</strong><Link className="underline text-[var(--color-brand-green)]" to="/common-test-2026-analysis">本試験23科目の大問別得点率と外国語4科目の出題分析</Link>から各試験ページに進めます。</p>
          <h2 className="text-xl font-semibold mb-2">よくある疑問</h2>
          <p className="mb-3"><strong>追試験の平均点が「—」なのはなぜ？</strong> 公開された記録が見当たらないなど、データが未登録の場合があります。「—」は0点ではありません。</p>
          <p className="mb-3"><strong>試行・試作問題は実際の本試験と同じ？</strong> いいえ。制度設計中の試験やサンプル問題は、実施条件や対象者が異なる場合があり、年度ページでも別資料群として扱います。</p>
          <p className="mb-5"><strong>資料が開けない場合は？</strong> ファイル名やリンク、掲載情報に誤りがある可能性があります。閲覧先にアクセスできるか確認し、必要ならページ名・年度・科目を添えてサイト右下のヘルプから報告してください。</p>
          <p><Link className="underline text-[var(--color-brand-green)]" to="/about">収録方針とサイト情報を見る</Link></p>
        </article>
      </div>
    </>
  );
}
