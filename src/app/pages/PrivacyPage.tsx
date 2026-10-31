import { SEOMeta } from '@/app/components/SEOMeta';
export function PrivacyPage() {
  return (
    <>
      <SEOMeta path="/privacy" title="プライバシーポリシー｜共通テスト過去問総集" description="kyotsu.orgでの広告配信、Cookie等の利用および外部サービスについての案内。" />
      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-4xl text-gray-800 leading-relaxed">
          <h1 className="text-2xl font-bold mb-5">プライバシーポリシー</h1>
          <p className="mb-5">このサイト（kyotsu.org）では、サイトの運営および広告配信のために外部サービスを利用する場合があります。外部サービスはCookieや類似の技術を使い、ブラウザ等の情報を取得することがあります。</p>
          <h2 className="text-xl font-semibold mb-2">広告について</h2>
          <p className="mb-5">当サイトはGoogle AdSenseの利用を申請しています。広告が配信される場合、Googleおよび広告パートナーはCookie等を利用して、アクセス情報や関心に応じた広告を表示する場合があります。Googleによる情報の利用については、<a className="underline text-[var(--color-brand-green)]" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Googleのパートナーサイトにおけるデータ利用</a>をご参照ください。広告のパーソナライズはGoogleの広告設定等で管理できます。</p>
          <h2 className="text-xl font-semibold mb-2">外部サイト・資料の閲覧</h2>
          <p className="mb-5">PDFや音声は外部のファイル配信基盤を経由して提供される場合があります。外部サービスではそれぞれの規約・プライバシーポリシーが適用されます。</p>
          <h2 className="text-xl font-semibold mb-2">お問い合わせ</h2>
          <p className="mb-5">プライバシーに関するお問い合わせは、サイト運営者のDiscordアカウント <strong>loading_0318</strong> へお願いします。サイト右下の「ヘルプ」にも同じ連絡先を掲載しています。</p>
          <p className="text-sm text-gray-600">制定：2026年10月31日</p>
        </article>
      </div>
    </>
  );
}
