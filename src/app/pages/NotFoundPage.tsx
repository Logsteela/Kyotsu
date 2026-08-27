 import { Link } from 'react-router';
import { Home, Search } from 'lucide-react';
import { SEOMeta } from '@/app/components/SEOMeta';
import { Button } from '@/app/components/ui/button';

/**
 * 404 Not Found ページ
 * ユーザーが存在しないページにアクセスした際に表示されます
 */
export function NotFoundPage() {
  return (
    <>
      <SEOMeta
        title="ページが見つかりません (404) - 共通テスト過去問総集"
        description="お探しのページは見つかりませんでした。URLをご確認いただくか、トップページからお探しください。"
        path="/404"
        noIndex
      />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-6xl sm:text-8xl font-bold text-gray-300 mb-4">404</h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              ページが見つかりません
            </h2>
            <p className="text-gray-600">
              お探しのページは存在しないか、移動した可能性があります。
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-hover)] text-white"
            >
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                トップページへ
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-[var(--color-brand-green)] text-[var(--color-brand-green)] hover:bg-[var(--color-brand-green)] hover:text-white"
            >
              <Link to="/">
                <Search className="w-4 h-4 mr-2" />
                過去問を探す
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">よくアクセスされるページ</h3>
            <ul className="space-y-2 text-left">
              <li>
                <Link
                  to="/year/2025/"
                  className="text-[var(--color-brand-green)] hover:underline"
                >
                  → 2025年度（令和7年）過去問
                </Link>
              </li>
              <li>
                <Link
                  to="/year/2024/"
                  className="text-[var(--color-brand-green)] hover:underline"
                >
                  → 2024年度（令和6年）過去問
                </Link>
              </li>
              <li>
                <Link
                  to="/subject/eigo-reading/"
                  className="text-[var(--color-brand-green)] hover:underline"
                >
                  → 英語リーディングの過去問一覧
                </Link>
              </li>
              <li>
                <Link
                  to="/subject/math1/"
                  className="text-[var(--color-brand-green)] hover:underline"
                >
                  → 数学ⅠAの過去問一覧
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
