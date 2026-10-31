import { useState, useRef, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { HelpCircle } from 'lucide-react';
import { Sidebar } from '@/app/components/Sidebar';
import { MobileSidebar } from '@/app/components/MobileSidebar';
import { HelpPage } from '@/app/components/HelpPage';
import { Button } from '@/app/components/ui/button';
import { getYearList, getSubjectList } from '@/app/data/testDatabase';

export function Root() {
  const subjects = getSubjectList();
  const years = getYearList();
  const [showHelp, setShowHelp] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = prevPathRef.current;

    // フッター等から長い別ページへ移動しても、途中から開かないようにする。
    if (currentPath !== prevPath && mainRef.current) {
      mainRef.current.scrollTop = 0;
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  return (
    <div className="size-full flex bg-gray-100 min-h-screen">
      {/* デスクトップサイドバー */}
      <nav className="hidden lg:block" aria-label="メインナビゲーション">
        <Sidebar subjects={subjects} years={years} />
      </nav>

      {/* モバイルサイドバー */}
      <MobileSidebar subjects={subjects} years={years} />

      {/* メインコンテンツエリア */}
      <main ref={mainRef} className="flex-1 overflow-y-auto relative flex flex-col min-w-0">
        {/* サイトタイトル */}
        <header className="bg-white border-b border-[var(--color-table-border)] px-4 sm:px-6 py-3 lg:py-4 flex-shrink-0">
          <div className="text-2xl lg:text-3xl font-bold text-gray-900 text-center lg:text-left tracking-tight break-words">
            共通テスト過去問総集
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center lg:text-left break-words">
            共通テスト・センター試験・共通一次の過去問資料を公開
          </p>
        </header>

        {/* ヘルプボタン */}
        <div className="fixed bottom-6 right-6 z-30">
          <Button
            size="icon"
            className="rounded-full text-white hover:opacity-90 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)]"
            onClick={() => setShowHelp(true)}
            aria-label="ヘルプを開く"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>
        </div>

        <Outlet />
        <footer className="border-t border-gray-200 bg-white px-4 sm:px-6 py-6 text-sm text-gray-600">
          <nav aria-label="サイト案内" className="flex flex-wrap gap-x-6 gap-y-3 mb-3">
            <Link to="/guide" className="hover:underline text-[var(--color-brand-green)]">資料の使い方</Link>
            <Link to="/statistics" className="hover:underline text-[var(--color-brand-green)]">平均点の推移</Link>
            <Link to="/coverage" className="hover:underline text-[var(--color-brand-green)]">収録状況</Link>
            <Link to="/sources" className="hover:underline text-[var(--color-brand-green)]">資料の出典</Link>
            <Link to="/year-statistics" className="hover:underline text-[var(--color-brand-green)]">年度別統計</Link>
            <Link to="/common-test-changes" className="hover:underline text-[var(--color-brand-green)]">共テ前年差</Link>
            <Link to="/common-test-2026-analysis" className="hover:underline text-[var(--color-brand-green)]">2026本試験分析</Link>
            <Link to="/common-test-2025-analysis" className="hover:underline text-[var(--color-brand-green)]">2025本試験分析</Link>
            <Link to="/about" className="hover:underline text-[var(--color-brand-green)]">サイト・資料について</Link>
            <Link to="/privacy" className="hover:underline text-[var(--color-brand-green)]">プライバシーポリシー</Link>
          </nav>
          <p>共通テスト過去問総集は大学入試センターの公式サイトではありません。</p>
        </footer>
      </main>

      {/* ヘルプページ */}
      {showHelp && <HelpPage onClose={() => setShowHelp(false)} />}
    </div>
  );
}
