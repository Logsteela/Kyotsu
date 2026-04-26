import { useState } from 'react';
import {
  Download,
  ExternalLink,
  Volume2,
  Clipboard,
  Check,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { resolvePublicPdfUrl } from '@/app/data/testDatabase';

type ActionType = 'view' | 'download' | 'audioView' | 'audioDownload' | 'copy';

type ResponsiveMode =
  | 'year-with-audio'
  | 'year-no-audio'
  | 'subject-no-audio'
  | 'subject-with-audio'
  | 'overview-with-audio'
  | 'special-with-audio'
  | 'special-no-audio';

interface PDFActionButtonProps {
  type: ActionType;
  disabled?: boolean;
  href?: string;
  downloadName?: string;
  className?: string;
  responsiveMode?: ResponsiveMode;
}

const SITE_ORIGIN = 'https://kyotsutest.vercel.app';

const ACTION_CONFIG: Record<ActionType, { icon: LucideIcon; label: string }> = {
  view: { icon: ExternalLink, label: '閲覧' },
  download: { icon: Download, label: 'DL' },
  audioView: { icon: Volume2, label: '再生' },
  audioDownload: { icon: Download, label: 'DL' },
  copy: { icon: Clipboard, label: 'コピー' },
};

const RESPONSIVE_CLASSES: Record<ResponsiveMode, string> = {
  'year-with-audio': 'hidden min-[421px]:inline ml-0.5',
  'year-no-audio': 'hidden min-[201px]:inline ml-0.5',
  'subject-no-audio': 'hidden min-[221px]:inline ml-0.5',
  'subject-with-audio': 'hidden min-[451px]:inline ml-0.5',
  'overview-with-audio': 'hidden min-[421px]:inline ml-0.5',
  'special-with-audio': 'hidden min-[421px]:inline ml-0.5',
  'special-no-audio': 'hidden min-[201px]:inline ml-0.5',
};

const LAYOUT_CLASSES: Record<ResponsiveMode, string> = {
  'year-with-audio':
    'flex-col min-[701px]:flex-row min-[1024px]:flex-col min-[1471px]:flex-row',
  'year-no-audio': 'flex-col min-[416px]:flex-row',
  'subject-no-audio':
    'flex-col min-[441px]:flex-row min-[1024px]:flex-col min-[1301px]:flex-row',
  'subject-with-audio':
    'flex-col min-[800px]:flex-row min-[1024px]:flex-col min-[1750px]:flex-row',
  'overview-with-audio': 'flex-col min-[701px]:flex-row',
  'special-with-audio': 'flex-col min-[1024px]:flex-row',
  'special-no-audio': 'flex-col min-[1024px]:flex-row',
};

function isGustMode(): boolean {
  if (typeof window === 'undefined') return false;

  const kyotsuWindow = window as Window & {
    __KYOTSU_GUST_MODE__?: boolean;
  };

  if (kyotsuWindow.__KYOTSU_GUST_MODE__) return true;
  if (document.documentElement.dataset.gustMode === '1') return true;

  const params = new URLSearchParams(window.location.search);

  return (
    params.has('o') ||
    params.has('a') ||
    params.has('y') ||
    params.has('s') ||
    params.has('t') ||
    params.has('p')
  );
}

function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${SITE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
}

function getDownloadName(pathOrUrl: string | undefined | null): string | undefined {
  const raw = (pathOrUrl ?? '').trim();
  if (!raw) return undefined;

  const withoutOrigin = raw.replace(/^https?:\/\/[^/]+\//, '');
  const normalized = withoutOrigin
    .replace(/^\/+/, '')
    .replace(/^pdfs\//, '');

  const fileName = normalized.split('/').pop();

  return fileName ? decodeURIComponent(fileName) : undefined;
}

async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fallbackへ
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', 'readonly');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);

    return ok;
  } catch {
    return false;
  }
}

export function PDFActionButton({
  type,
  disabled = false,
  href,
  downloadName,
  className = '',
  responsiveMode = 'year-no-audio',
}: PDFActionButtonProps) {
  const [copied, setCopied] = useState(false);

  const gust = isGustMode();
  const isDownload = type === 'download' || type === 'audioDownload';

  const normalConfig = ACTION_CONFIG[type];
  const gustIcon = copied ? Check : Clipboard;
  const GustIcon = gustIcon;

  const Icon = normalConfig.icon;
  const textClass = RESPONSIVE_CLASSES[responsiveMode];

  const buttonClass =
    `text-[10px] md:text-xs px-1 md:px-2 py-1 h-auto min-w-0 whitespace-nowrap border-gray-300 hover:bg-gray-100 ${className}`;

  const gustButtonClass =
    `w-7 h-7 p-0 min-w-0 border-gray-300 hover:bg-gray-100 ${className}`;

  if (disabled || !href) {
    return (
      <Button
        disabled
        size="sm"
        variant="outline"
        className={gust ? gustButtonClass : buttonClass}
        aria-label={gust ? 'コピー不可' : normalConfig.label}
        title={gust ? 'コピー不可' : normalConfig.label}
      >
        {gust ? (
          <Clipboard className="w-4 h-4 flex-shrink-0" />
        ) : (
          <>
            <Icon className="w-3 h-3 md:mr-1 flex-shrink-0" />
            <span className={textClass}>{normalConfig.label}</span>
          </>
        )}
      </Button>
    );
  }

  if (gust || type === 'copy') {
    return (
      <Button
        type="button"
        size="sm"
        variant="outline"
        className={gustButtonClass}
        aria-label={copied ? 'コピー済み' : 'URLをコピー'}
        title={copied ? 'コピー済み' : 'URLをコピー'}
        onClick={async () => {
          const ok = await copyTextToClipboard(href);

          if (!ok) {
            window.prompt('このURLをコピーしてください', href);
            return;
          }

          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        <GustIcon className="w-4 h-4 flex-shrink-0" />
      </Button>
    );
  }

  return (
    <Button
      asChild
      size="sm"
      variant="outline"
      className={buttonClass}
    >
      <a
        href={href}
        target={isDownload ? undefined : '_blank'}
        rel={isDownload ? undefined : 'noopener noreferrer'}
        download={isDownload ? downloadName : undefined}
      >
        <Icon className="w-3 h-3 md:mr-1 flex-shrink-0" />
        <span className={textClass}>{normalConfig.label}</span>
      </a>
    </Button>
  );
}

interface PDFActionGroupProps {
  pdfPath: string;
  pdfState: 1 | 2 | 3;
  type: 'question' | 'answer';
  responsiveMode?: ResponsiveMode;
  exists?: boolean;
}

export function PDFActionGroup({
  pdfPath,
  pdfState,
  type: _type,
  responsiveMode = 'year-no-audio',
  exists = true,
}: PDFActionGroupProps) {
  const isCompletelyMissing = pdfState === 3;
  const isMissingThisFile = !pdfPath || !exists;

  const resolvedUrl = resolvePublicPdfUrl(pdfPath);
  const href = resolvedUrl ? toAbsoluteUrl(resolvedUrl) : undefined;
  const disabled = isCompletelyMissing || isMissingThisFile || !href;
  const downloadName = getDownloadName(pdfPath);

  const layoutClass = LAYOUT_CLASSES[responsiveMode];
  const gust = isGustMode();

  if (gust) {
    return (
      <div className={`flex gap-0.5 md:gap-1 justify-center items-stretch ${layoutClass}`}>
        <PDFActionButton
          type="copy"
          disabled={disabled}
          href={href}
          downloadName={downloadName}
          responsiveMode={responsiveMode}
        />
      </div>
    );
  }

  return (
    <div className={`flex gap-0.5 md:gap-1 justify-center items-stretch ${layoutClass}`}>
      <PDFActionButton
        type="view"
        disabled={disabled}
        href={href}
        responsiveMode={responsiveMode}
      />

      <PDFActionButton
        type="download"
        disabled={disabled}
        href={href}
        downloadName={downloadName}
        responsiveMode={responsiveMode}
      />
    </div>
  );
}

interface AudioActionGroupProps {
  audioPath: string | undefined;
  pdfState: 1 | 2 | 3;
  priority?: string;
  responsiveMode?: ResponsiveMode;
  exists?: boolean;
}

export function AudioActionGroup({
  audioPath,
  pdfState: _pdfState,
  priority: _priority,
  responsiveMode = 'year-with-audio',
  exists = true,
}: AudioActionGroupProps) {
  const isMissingThisFile = !audioPath || !exists;

  const resolvedUrl = resolvePublicPdfUrl(audioPath);
  const href = resolvedUrl ? toAbsoluteUrl(resolvedUrl) : undefined;
  const disabled = isMissingThisFile || !href;
  const downloadName = getDownloadName(audioPath);

  if (!audioPath || !exists) {
    return <div className="text-center text-gray-400 text-xs">-</div>;
  }

  const gust = isGustMode();

  if (gust) {
    return (
      <div className={`flex gap-0.5 md:gap-1 justify-center items-stretch ${LAYOUT_CLASSES[responsiveMode]}`}>
        <PDFActionButton
          type="copy"
          disabled={disabled}
          href={href}
          downloadName={downloadName}
          responsiveMode={responsiveMode}
        />
      </div>
    );
  }

  return (
    <div className={`flex gap-0.5 md:gap-1 justify-center items-stretch ${LAYOUT_CLASSES[responsiveMode]}`}>
      <PDFActionButton
        type="audioView"
        disabled={disabled}
        href={href}
        responsiveMode={responsiveMode}
      />

      <PDFActionButton
        type="audioDownload"
        disabled={disabled}
        href={href}
        downloadName={downloadName}
        responsiveMode={responsiveMode}
      />
    </div>
  );
}
