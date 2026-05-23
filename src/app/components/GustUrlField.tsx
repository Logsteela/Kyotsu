export const SITE_ORIGIN = 'https://kyotsu.org';

export function isGustMode(): boolean {
  return false;
}

export function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

interface GustUrlFieldProps {
  url: string;
  label: string;
  compact?: boolean;
  className?: string;
}

export function GustUrlField({
  url,
  label,
  compact = false,
  className = '',
}: GustUrlFieldProps) {
  const absoluteUrl = toAbsoluteUrl(url);

  return (
    <textarea
      readOnly
      value={absoluteUrl}
      aria-label={label}
      title={absoluteUrl}
      spellCheck={false}
      rows={compact ? 1 : 2}
      onFocus={(event) => event.currentTarget.select()}
      onClick={(event) => event.currentTarget.select()}
      className={`block w-full min-w-0 resize-none rounded border border-gray-300 bg-white font-mono text-gray-900 shadow-sm outline-none focus:ring-2 focus:ring-gray-400 ${
        compact ? 'h-7 px-1 py-1 text-[10px] leading-4' : 'min-h-10 px-2 py-1 text-xs sm:text-sm'
      } ${className}`}
    />
  );
}
