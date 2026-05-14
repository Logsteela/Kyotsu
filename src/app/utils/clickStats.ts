export type ClickAction = 'view' | 'download' | 'audioView' | 'audioDownload' | 'copy';

function currentPage(): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}`;
}

export function recordClick(action: ClickAction, target: string | undefined | null) {
  if (typeof window === 'undefined') return;

  const normalizedTarget = String(target ?? '').trim();
  if (!normalizedTarget) return;

  const payload = JSON.stringify({
    action,
    target: normalizedTarget,
    page: currentPage(),
  });

  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/hit', blob);
      return;
    }
  } catch {
    // fetch fallbackへ
  }

  fetch('/api/hit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch(() => {
    // 集計の失敗で閲覧・DLを邪魔しない
  });
}
