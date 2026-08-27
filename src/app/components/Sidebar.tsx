import { Link, useLocation } from 'react-router';
import { Button } from '@/app/components/ui/button';
import { getEraDisplay } from '@/app/utils/era';
import { CATEGORY_TO_SLUG } from '@/app/data/testDatabase';

interface SidebarProps {
  subjects: string[];
  years: (number | string)[];
}

function SidebarButtonLabel({ children }: { children: string }) {
  return <span className="block min-w-0 truncate">{children}</span>;
}

export function Sidebar({ subjects, years }: SidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const normalizedCurrentPath = currentPath === '/' ? '/' : currentPath.replace(/\/+$/, '');
  const decodedCurrentPath = decodeURIComponent(normalizedCurrentPath);
  const sidebarButtonClass = 'w-full justify-start text-[13px] leading-tight px-1.5 overflow-hidden';

  return (
    <div className="w-64 min-w-[256px] max-w-[256px] border-r border-[var(--color-table-border)] bg-[var(--color-sidebar-bg)] h-screen overflow-y-auto flex flex-col sticky top-0">
      <div className="p-6 flex flex-col" style={{ rowGap: '1.5rem' }}>
        {/* ホームセクション */}
        <div className="flex flex-col gap-4">
          <div className="font-semibold text-gray-900">ホーム</div>
          <div className="border border-[var(--color-table-border)] rounded-md p-2 bg-[var(--color-sidebar-scroll-bg)]">
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
          <div className="border border-[var(--color-table-border)] rounded-md p-2 bg-[var(--color-sidebar-scroll-bg)]">
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
          <div className="flex flex-col gap-1 max-h-78 overflow-y-auto border border-[var(--color-table-border)] rounded-md p-2 bg-[var(--color-sidebar-scroll-bg)]">
            {years.map((year) => {
              const rawYearPath = `/year/${String(year)}`;
              const yearPath = `/year/${encodeURIComponent(String(year))}/`;
              const isActive = normalizedCurrentPath === yearPath.replace(/\/$/, '') || decodedCurrentPath === rawYearPath;
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
          <div className="flex flex-col gap-1 max-h-79 overflow-y-auto border border-[var(--color-table-border)] rounded-md p-2 bg-[var(--color-sidebar-scroll-bg)]">
            {subjects.map((subject) => {
              const slug = CATEGORY_TO_SLUG[subject] || 'sonota';
              const subjectPath = `/subject/${slug}/`;
              const isActive = normalizedCurrentPath === subjectPath.replace(/\/$/, '');
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
          <div className="border border-[var(--color-table-border)] rounded-md p-2 bg-[var(--color-sidebar-scroll-bg)]">
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
  );
}