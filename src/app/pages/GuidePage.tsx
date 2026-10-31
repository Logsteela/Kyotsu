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
          <p><Link className="underline text-[var(--color-brand-green)]" to="/about">収録方針とサイト情報を見る</Link></p>
        </article>
      </div>
    </>
  );
}
