import { useState } from 'react';
import { Link } from 'react-router';
import { SEOMeta } from '@/app/components/SEOMeta';

const DISCORD_HANDLE = 'loading_0318';

export function ContactPage() {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyHandle = async () => {
    try {
      await navigator.clipboard.writeText(DISCORD_HANDLE);
      setCopied(true);
      setCopyError(false);
    } catch {
      setCopyError(true);
    }
  };
  return <>
    <SEOMeta path="/contact" title="お問い合わせ・資料の訂正依頼｜共通テスト過去問総集"
      description="共通テスト過去問総集の運営者への連絡先と、収録資料・統計の誤りや権利に関する連絡方法。" />
    <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
      <article className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8 max-w-4xl text-gray-800 leading-relaxed">
        <h1 className="text-2xl font-bold mb-4">お問い合わせ</h1>
        <p className="mb-4">このサイトは非公式の個人運営サイトです。問題・解答資料の不具合、平均点や分析の誤り、掲載に関する権利のお問い合わせを受け付けています。</p>
        <h2 className="text-xl font-semibold mb-2">運営者への直接連絡</h2>
        <div className="border rounded p-4 bg-gray-50 mb-4">
          <p className="text-sm text-gray-700 mb-2">Discordのユーザー名</p>
          <div className="flex flex-wrap items-center gap-3">
            <strong className="text-lg select-all">{DISCORD_HANDLE}</strong>
            <button type="button" onClick={copyHandle}
              className="border border-gray-400 rounded bg-white hover:bg-gray-100 px-3 py-1 text-sm">
              {copied ? 'コピーしました' : 'ユーザー名をコピー'}
            </button>
          </div>
          {copyError && <p role="alert" className="text-sm mt-2">コピーできませんでした。表示されているユーザー名を手動で選択してください。</p>}
          <p className="text-sm mt-3">Discordで「フレンドを追加」から上記の名前を入力してください。<a className="text-[var(--color-brand-green)] underline" href="https://discord.com/app" target="_blank" rel="noopener noreferrer">Discordを開く</a></p>
        </div>
        <h2 className="text-xl font-semibold mb-2">公開できる修正提案・不具合報告</h2>
        <p className="mb-4"><a className="text-[var(--color-brand-green)] underline" href="https://github.com/Logsteela/Kyotsu/issues/new" target="_blank" rel="noopener noreferrer">GitHubのIssueを作成</a>することもできます。GitHubへのログインが必要で、投稿は公開されます。個人情報や非公開の権利関係は投稿せず、Discordからお知らせください。</p>
        <h2 className="text-xl font-semibold mb-2">連絡に含めてほしい内容</h2>
        <p className="mb-4">該当するページのURL、年度と科目、どの部分に誤りがあるか、確認できる資料をお知らせください。受験者の個人情報などを送る必要はありません。</p>
        <p className="mb-4">返信までの日数や、すべての要望への対応は保証できません。大学入試センターへの公式な問い合わせ先ではありません。</p>
        <p className="text-sm"><Link className="text-[var(--color-brand-green)] underline" to="/terms">資料の利用案内・免責事項</Link> ／ <Link className="text-[var(--color-brand-green)] underline" to="/privacy">プライバシーポリシー</Link></p>
      </article>
    </div>
  </>;
}
