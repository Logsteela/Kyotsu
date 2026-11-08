import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';

export function TermsPage() {
  return <>
    <SEOMeta path="/terms" title="資料の利用案内・免責事項｜共通テスト過去問総集"
      description="共通テスト過去問総集に収録された資料の利用上の注意、情報の正確性、権利と問い合わせについて。" />
    <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-4xl text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-5">資料の利用案内・免責事項</h1>
        <h2 className="text-xl font-semibold mb-2">サイトの位置づけ</h2>
        <p className="mb-5">共通テスト過去問総集は、大学入学共通テスト、大学入試センター試験、共通第1次学力試験などの資料と統計を探しやすくする非公式の個人運営サイトです。大学入試センターなどの公式サイトではありません。</p>
        <h2 className="text-xl font-semibold mb-2">収録資料の権利</h2>
        <p className="mb-5">問題・解答・音声その他の第三者の資料に関する権利は、それぞれの権利者に帰属します。掲載されていることだけを理由に、第三者が自由に複製・再配布・改変できるわけではありません。資料についての権利関係の連絡は<Link to="/contact" className="underline text-[var(--color-brand-green)]">お問い合わせ</Link>から受け付けています。</p>
        <h2 className="text-xl font-semibold mb-2">統計・分析を使う際の注意</h2>
        <p className="mb-5">平均得点率は平均点を満点で割った値です。受験者集団、科目の出題範囲、採点方法、選択方式などは年度ごとに異なる場合があります。平均点が下がったことだけで、その年の問題が難しかったと断定することはできません。個人の成績順位を示すものでもありません。</p>
        <p className="mb-5">数値や資料の欠損が確認できた場合は、空欄や未登録として表示します。編集上の解釈と公表統計を区別するよう努めていますが、完全性・正確性、リンク先の継続的な利用を保証するものではありません。実際の受験に必要な最新情報は必ず大学入試センターや各大学の発表で確認してください。</p>
        <h2 className="text-xl font-semibold mb-2">外部サービス・広告</h2>
        <p className="mb-5">PDFや音声は外部の配信基盤を経由する場合があり、配信元の利用条件が適用されることがあります。当サイトで利用する広告サービスとアクセス情報については<Link to="/privacy" className="underline text-[var(--color-brand-green)]">プライバシーポリシー</Link>をご覧ください。</p>
        <h2 className="text-xl font-semibold mb-2">訂正と連絡</h2>
        <p className="mb-5">統計の誤り、欠損、リンクの不具合、権利に関するご指摘は<Link to="/contact" className="underline text-[var(--color-brand-green)]">お問い合わせページ</Link>からお知らせください。</p>
        <p className="text-sm text-gray-600">公開：2026年11月8日</p>
      </article>
    </div>
  </>;
}
