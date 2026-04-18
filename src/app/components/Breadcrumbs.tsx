 import { Link } from 'react-router';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Breadcrumbsコンポーネント
 * パンくずリストを表示してナビゲーションとSEOを強化します
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="パンくずリスト"
      className="bg-white border-b border-[var(--color-table-border)] px-4 sm:px-6 py-2 flex-shrink-0"
    >
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {/* ホームアイコン */}
        <li>
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-[var(--color-brand-green)] transition-colors"
            aria-label="ホーム"
          >
            <Home className="w-4 h-4" />
          </Link>
        </li>

        {/* パンくず項目 */}
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-gray-400" aria-hidden="true" />
              {isLast ? (
                <span className="text-gray-900 font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="text-gray-600 hover:text-[var(--color-brand-green)] transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
