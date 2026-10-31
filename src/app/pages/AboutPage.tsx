import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';
export function AboutPage() {
  return (
    <>
      <SEOMeta path="/about" title="サイトについて・資料の収録方針｜共通テスト過去問総集" description="共通テスト過去問総集の目的、資料の整理方法、掲載内容、問い合わせ方針について。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-4xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-5">サイトについて</h1>
          <p className="mb-5">「共通テスト過去問総集」（kyotsu.org）は、大学入学共通テスト・大学入試センター試験・共通第1次学力試験等の資料を、年代と教科をまたいで検索できるように整理した非公式の個人運営サイトです。大学入試センターや各資料提供元が運営する公式サービスではありません。</p>
          <h2 className="text-xl font-semibold mb-2">独自の整理と利用目的</h2>
          <p className="mb-5">資料の閲覧先を探す手間を減らすため、本試験・追試験、試作・研究段階の試験、科目、年度を統一した一覧に分類しています。各資料には、利用可能な範囲で実施日・試験時間・配点・受験者数・平均点等の情報を対応付けています。平均点の年度比較も独自に検索できるようにしています。</p>
          <h2 className="text-xl font-semibold mb-2">掲載資料と出典</h2>
          <p className="mb-5">問題・解答・音声などは、大学入試センター、国立国会図書館、報道機関等が公表・保有してきた資料を含みます。個々の資料について判明している出典は、試験詳細ページの特記事項をご参照ください。資料によって掲載元・利用条件が異なります。原資料の権利をこのサイトが保有すると主張するものではありません。</p>
          <h2 className="text-xl font-semibold mb-2">誤記・欠損・権利について</h2>
          <p className="mb-5">掲載情報の誤り、資料の欠損、権利に関するお問い合わせは、サイト右下の「ヘルプ」に記載された連絡先へお願いします。根拠資料を照合し、必要に応じて訂正・掲載見直しを行います。</p>
          <p><Link className="underline text-[var(--color-brand-green)]" to="/guide">資料を探す際の説明</Link></p>
        </article>
      </div>
    </>
  );
}
