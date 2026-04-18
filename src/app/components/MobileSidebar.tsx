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

export function MobileSidebar({ subjects, years }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

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
          className="border-2 border-white text-white hover:opacity-90 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)]"
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
        <div className="p-6 flex flex-col gap-8">
          {/* ホームセクション */}
          <div className="flex flex-col gap-4 mt-12">
            <h2 className="font-semibold text-gray-900">ホーム</h2>
            <div>
              <Link to="/">
                <Button
                  variant={currentPath === '/' ? 'default' : 'ghost'}
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  ホーム
                </Button>
              </Link>
            </div>
          </div>

          {/* 総覧セクション */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">総覧</h2>
            <div>
              <Link to="/overview">
                <Button
                  variant={currentPath === '/overview' ? 'default' : 'ghost'}
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  全テスト一覧
                </Button>
              </Link>
            </div>
          </div>

          {/* 年度セクション */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">年度別</h2>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {years.map((year) => {
                const yearPath = typeof year === 'number' ? `/year/${year}` : `/year/${year}`;
                const isActive = currentPath === yearPath;
                return (
                  <Link key={year} to={yearPath}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start text-sm"
                      size="sm"
                    >
                      {typeof year === 'number' ? `${year}年度（${getEraDisplay(year)}）` : year}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 教科セクション */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">教科別</h2>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {subjects.map((subject) => {
                const slug = CATEGORY_TO_SLUG[subject] || 'sonota';
                const subjectPath = `/subject/${slug}`;
                const isActive = currentPath === subjectPath;
                return (
                  <Link key={subject} to={subjectPath}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className="w-full justify-start text-sm"
                      size="sm"
                    >
                      {subject}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 付記セクション */}
          <div className="flex flex-col gap-4">
            <h2 className="font-semibold text-gray-900">付記</h2>
            <div>
              <Link to="/archives">
                <Button
                  variant={currentPath === '/archives' ? 'default' : 'ghost'}
                  className="w-full justify-start text-sm"
                  size="sm"
                >
                  記録資料集
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}