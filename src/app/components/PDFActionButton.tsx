import { Download, ExternalLink, Volume2, LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { resolvePublicPdfUrl } from '@/app/data/testDatabase';
import { GustUrlField, isGustMode, toAbsoluteUrl } from '@/app/components/GustUrlField';

type ActionType = 'view' | 'download' | 'audioView' | 'audioDownload';

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

const ACTION_CONFIG: Record<ActionType, { icon: LucideIcon; label: string }> = {
  view: { icon: ExternalLink, label: '閲覧' },
  download: { icon: Download, label: 'DL' },
  audioView: { icon: Volume2, label: '再生' },
  audioDownload: { icon: Download, label: 'DL' },
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

export function PDFActionButton({
  type,
  disabled = false,
  href,
  downloadName,
  className = '',
  responsiveMode = 'year-no-audio',
}: PDFActionButtonProps) {
  const config = ACTION_CONFIG[type];
  const Icon = config.icon;
  const textClass = RESPONSIVE_CLASSES[responsiveMode];

  const buttonClass =
    `text-[10px] md:text-xs px-1 md:px-2 py-1 h-auto min-w-0 whitespace-nowrap border-gray-300 hover:bg-gray-100 ${className}`;

  if (disabled || !href) {
    return (
      <Button
        disabled
        size="sm"
        variant="outline"
        className={buttonClass}
      >
        <Icon className="w-3 h-3 md:mr-1 flex-shrink-0" />
        <span className={textClass}>{config.label}</span>
      </Button>
    );
  }

  const isDownload = type === 'download' || type === 'audioDownload';

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
        <span className={textClass}>{config.label}</span>
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
  type,
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

  if (isGustMode()) {
    if (disabled || !href) {
      return <div className="text-center text-gray-400 text-xs">-</div>;
    }

    return (
      <GustUrlField
        url={href}
        label={type === 'question' ? '問題URL' : '解答URL'}
        compact
      />
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

  if (isGustMode()) {
    if (disabled || !href) {
      return <div className="text-center text-gray-400 text-xs">-</div>;
    }

    return (
      <GustUrlField
        url={href}
        label="音声URL"
        compact
      />
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
