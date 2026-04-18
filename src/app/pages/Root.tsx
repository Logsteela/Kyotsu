import { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
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

    // ホームページへの遷移、またはテスト詳細ページへの遷移の場合のみスクロールをリセット
    const shouldResetScroll = 
      currentPath === '/' || // ホームページへの遷移
      currentPath.startsWith('/test/'); // テスト詳細ページへの遷移

    if (shouldResetScroll && currentPath !== prevPath && mainRef.current) {
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
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center lg:text-left tracking-tight break-words">
            共通テスト過去問総集
          </h1>
          <p className="text-sm text-gray-500 mt-2 text-center lg:text-left break-words">
            共通テストの全ての問題・解答を無料公開
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
      </main>

      {/* ヘルプページ */}
      {showHelp && <HelpPage onClose={() => setShowHelp(false)} />}
    </div>
  );
}