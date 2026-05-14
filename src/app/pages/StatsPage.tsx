import { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, Download, ExternalLink, RefreshCw } from 'lucide-react';
import { SEOMeta } from '@/app/components/SEOMeta';
import { Button } from '@/app/components/ui/button';

type CountRow = {
  key: string;
  count: number;
};

type RecentRow = {
  at: string;
  action: string;
  target: string;
  page: string;
};

type StatsPayload = {
  ok: boolean;
  configured: boolean;
  total: number;
  actions: CountRow[];
  targets: CountRow[];
  dates: CountRow[];
  recent: RecentRow[];
  error?: string;
};

const ACTION_LABELS: Record<string, string> = {
  view: '閲覧',
  download: 'DL',
  audioView: '音声再生',
  audioDownload: '音声DL',
  copy: 'コピー',
  unknown: '不明',
};

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value);
}

function formatDateTime(value: string): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
}

function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

function shortTarget(value: string): string {
  if (!value) return '-';
  try {
    return decodeURIComponent(value.replace(/^https?:\/\/[^/]+/i, ''));
  } catch {
    return value.replace(/^https?:\/\/[^/]+/i, '');
  }
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-lg border border-[var(--color-table-border)] p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gray-100 p-2">
          <Icon className="w-5 h-5 text-[var(--color-brand-green)]" />
        </div>
        <div>
          <div className="text-sm text-gray-500">{label}</div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
        </div>
      </div>
    </div>
  );
}

export function StatsPage() {
  const [stats, setStats] = useState<StatsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stats', { cache: 'no-store' });
      const payload = (await response.json()) as StatsPayload;
      setStats(payload);
    } catch {
      setError('集計データを読み込めませんでした。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
  }, []);

  const actionTotal = useMemo(() => {
    return stats?.actions.reduce((sum, row) => sum + row.count, 0) ?? 0;
  }, [stats]);

  const topTargets = stats?.targets.slice(0, 50) ?? [];

  return (
    <>
      <SEOMeta
        title="クリック集計｜共通テスト過去問総集"
        description="閲覧リンク・ダウンロードリンクのクリック回数の集計"
        path="/stats"
        keywords="共通テスト,過去問,PDF,ダウンロード,集計"
        noIndex
      />

      <div className="flex-1 bg-gray-100 px-4 sm:px-6 py-6 lg:py-8">
        <div className="w-full space-y-6">
          <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  クリック集計
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  閲覧・DL・音声・コピーのボタンが押された回数です。保存先は Vercel の環境変数に設定した Upstash Redis です。
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="shrink-0"
                onClick={() => void loadStats()}
                disabled={loading}
              >
                <RefreshCw className="w-4 h-4" />
                更新
              </Button>
            </div>
          </section>

          {loading && (
            <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 text-gray-600">
              読み込み中...
            </section>
          )}

          {error && (
            <section className="bg-red-50 rounded-lg border border-red-200 p-6 text-red-700">
              {error}
            </section>
          )}

          {!loading && stats && !stats.configured && (
            <section className="bg-yellow-50 rounded-lg border border-yellow-200 p-6 text-yellow-900">
              <h2 className="font-bold mb-2">保存先がまだ設定されていません</h2>
              <p className="leading-relaxed">
                Vercel の Environment Variables に <code className="font-mono">UPSTASH_REDIS_REST_URL</code> と <code className="font-mono">UPSTASH_REDIS_REST_TOKEN</code> を追加すると、このページに回数が表示されます。
                未設定のままでも、閲覧・DL自体は通常通り動きます。
              </p>
            </section>
          )}

          {!loading && stats && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={BarChart3} label="総クリック数" value={formatNumber(stats.total)} />
                <StatCard icon={ExternalLink} label="種類別合計" value={formatNumber(actionTotal)} />
                <StatCard icon={Download} label="記録対象数" value={formatNumber(stats.targets.length)} />
              </div>

              <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">種類別</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">種類</th>
                        <th className="text-right p-3 font-semibold text-gray-700">回数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.actions.length === 0 ? (
                        <tr><td className="p-3 text-gray-500" colSpan={2}>まだ記録がありません</td></tr>
                      ) : stats.actions.map((row) => (
                        <tr key={row.key} className="border-b last:border-b-0">
                          <td className="p-3 text-gray-900">{actionLabel(row.key)}</td>
                          <td className="p-3 text-right font-semibold text-gray-900">{formatNumber(row.count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">ファイル・リンク別 上位50件</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">リンク</th>
                        <th className="text-right p-3 font-semibold text-gray-700">回数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topTargets.length === 0 ? (
                        <tr><td className="p-3 text-gray-500" colSpan={2}>まだ記録がありません</td></tr>
                      ) : topTargets.map((row) => (
                        <tr key={row.key} className="border-b last:border-b-0">
                          <td className="p-3 text-gray-900 break-all">{shortTarget(row.key)}</td>
                          <td className="p-3 text-right font-semibold text-gray-900 whitespace-nowrap">{formatNumber(row.count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">日別</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">日付</th>
                        <th className="text-right p-3 font-semibold text-gray-700">回数</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.dates.length === 0 ? (
                        <tr><td className="p-3 text-gray-500" colSpan={2}>まだ記録がありません</td></tr>
                      ) : stats.dates.map((row) => (
                        <tr key={row.key} className="border-b last:border-b-0">
                          <td className="p-3 text-gray-900">{row.key}</td>
                          <td className="p-3 text-right font-semibold text-gray-900">{formatNumber(row.count)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-lg border border-[var(--color-table-border)] p-6 lg:p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">最近の記録</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">時刻</th>
                        <th className="text-left p-3 font-semibold text-gray-700">種類</th>
                        <th className="text-left p-3 font-semibold text-gray-700">リンク</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent.length === 0 ? (
                        <tr><td className="p-3 text-gray-500" colSpan={3}>まだ記録がありません</td></tr>
                      ) : stats.recent.map((row, index) => (
                        <tr key={`${row.at}-${index}`} className="border-b last:border-b-0">
                          <td className="p-3 text-gray-700 whitespace-nowrap">{formatDateTime(row.at)}</td>
                          <td className="p-3 text-gray-900 whitespace-nowrap">{actionLabel(row.action)}</td>
                          <td className="p-3 text-gray-900 break-all">{shortTarget(row.target)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}
