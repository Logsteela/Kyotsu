import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { getEraDisplay } from '@/app/utils/era';
import { CATEGORY_TO_SLUG } from '@/app/data/testDatabase';

interface MobileSidebarProps {
  subjects: string[];
  years: (number | string)[];
}

function SidebarButtonLabel({ children }: { children: string }) {
  return <span className="block min-w-0 truncate">{children}</span>;
}

export function MobileSidebar({ subjects, years }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;
  const normalizedCurrentPath = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');
  const decodedCurrentPath = decodeURIComponent(normalizedCurrentPath);
  const sidebarButtonClass = 'w-full justify-start text-[13px] leading-tight px-1.5 overflow-hidden';

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Close sidebar on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);

  return (
    <>
      {/* メニューボタン */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-menu-button border-2 border-white text-white hover:opacity-90 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)]"
          variant="default"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* オーバーレイ */}
      {isVisible && (
        <div
          className={`lg:hidden fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* サイドバーメニュー */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-64 min-w-[256px] max-w-[256px] bg-white z-40 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 flex flex-col" style={{ rowGap: '1.5rem' }}>
          {/* ホームセクション */}
          <div className="flex flex-col gap-4 mt-12">
            <div className="font-semibold text-gray-900">ホーム</div>
            <div>
              <Link to="/" aria-current={currentPath === '/' ? 'page' : undefined}>
                <Button
                  variant={currentPath === '/' ? 'default' : 'ghost'}
                  className={sidebarButtonClass}
                  size="sm"
                  title="ホーム"
                >
                  <SidebarButtonLabel>ホーム</SidebarButtonLabel>
                </Button>
              </Link>
            </div>
          </div>

          {/* 総覧セクション */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-gray-900">総覧</div>
            <div>
              <Link to="/overview/" aria-current={normalizedCurrentPath === '/overview' ? 'page' : undefined}>
                <Button
                  variant={normalizedCurrentPath === '/overview' ? 'default' : 'ghost'}
                  className={sidebarButtonClass}
                  size="sm"
                  title="全テスト一覧"
                >
                  <SidebarButtonLabel>全テスト一覧</SidebarButtonLabel>
                </Button>
              </Link>
            </div>
          </div>

          {/* 年度セクション */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-gray-900">年度別</div>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {years.map((year) => {
                const rawYearPath = `/year/${String(year)}`;
                const yearPath = `/year/${encodeURIComponent(String(year))}`;
                const isActive = currentPath === yearPath || decodedCurrentPath === rawYearPath;
                const label = typeof year === 'number' ? `${year}年度（${getEraDisplay(year)}）` : String(year);
                return (
                  <Link key={year} to={yearPath} aria-current={isActive ? 'page' : undefined}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={sidebarButtonClass}
                      size="sm"
                      title={label}
                    >
                      <SidebarButtonLabel>{label}</SidebarButtonLabel>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 教科セクション */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-gray-900">教科別</div>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {subjects.map((subject) => {
                const slug = CATEGORY_TO_SLUG[subject] || 'sonota';
                const subjectPath = `/subject/${slug}`;
                const isActive = currentPath === subjectPath;
                return (
                  <Link key={subject} to={subjectPath} aria-current={isActive ? 'page' : undefined}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={sidebarButtonClass}
                      size="sm"
                      title={subject}
                    >
                      <SidebarButtonLabel>{subject}</SidebarButtonLabel>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 付記セクション */}
          <div className="flex flex-col gap-4">
            <div className="font-semibold text-gray-900">付記</div>
            <div>
              <Link to="/archives/" aria-current={normalizedCurrentPath === '/archives' ? 'page' : undefined}>
                <Button
                  variant={normalizedCurrentPath === '/archives' ? 'default' : 'ghost'}
                  className={sidebarButtonClass}
                  size="sm"
                  title="記録資料集"
                >
                  <SidebarButtonLabel>記録資料集</SidebarButtonLabel>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}