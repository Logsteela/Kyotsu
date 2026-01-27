import { Download, ExternalLink, Volume2, LucideIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

type ActionType = 'view' | 'download' | 'audio';
type ResponsiveMode = 'year-with-audio' | 'year-no-audio' | 'subject-no-audio' | 'subject-with-audio' | 'overview-with-audio';

interface PDFActionButtonProps {
  type: ActionType;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
  responsiveMode?: ResponsiveMode;
}

const ACTION_CONFIG: Record<ActionType, { icon: LucideIcon; label: string }> = {
  view: { icon: ExternalLink, label: '閲覧' },
  download: { icon: Download, label: 'DL' },
  audio: { icon: Volume2, label: 'DL' },
};

// レスポンシブモードに応じたテキスト表示のブレークポイント
const RESPONSIVE_CLASSES: Record<ResponsiveMode, string> = {
  // リスニングのある年度別又は総覧：421px以上で表示
  'year-with-audio': 'hidden min-[421px]:inline ml-0.5',
  
  // リスニングのない年度別：201px以上で表示
  'year-no-audio': 'hidden min-[201px]:inline ml-0.5',
  
  // 教科別（リスニング以外）：221px以上で表示
  'subject-no-audio': 'hidden min-[221px]:inline ml-0.5',
  
  // 教科別（リスニング）：451px以上で表示
  'subject-with-audio': 'hidden min-[451px]:inline ml-0.5',
  
  // 総覧（リスニング）：421px以上で表示
  'overview-with-audio': 'hidden min-[421px]:inline ml-0.5',
};

// レスポンシブモードに応じた横並び表示のブレークポイント
const LAYOUT_CLASSES: Record<ResponsiveMode, string> = {
  // リスニングのある年度別
  // 縦：～700, 1024～1470
  // 横：701～1023, 1471～
  'year-with-audio': 'flex-col min-[701px]:flex-row min-[1024px]:flex-col min-[1471px]:flex-row',
  
  // リスニングのない年度別
  // 縦：～415
  // 横：416～
  'year-no-audio': 'flex-col min-[416px]:flex-row',
  
  // 教科別（リスニング以外）
  // 縦：～440, 1024～1300
  // 横：441～1023, 1301～
  'subject-no-audio': 'flex-col min-[441px]:flex-row min-[1024px]:flex-col min-[1301px]:flex-row',
  
  // 教科別（リスニング）
  // 縦：～799, 1024～1749
  // 横：800～1023, 1750～
  'subject-with-audio': 'flex-col min-[800px]:flex-row min-[1024px]:flex-col min-[1750px]:flex-row',
  
  // 総覧（リスニング）
  // 縦：～700
  // 横：701～
  'overview-with-audio': 'flex-col min-[701px]:flex-row',
};

export function PDFActionButton({ type, disabled = false, onClick, className = '', responsiveMode = 'year-no-audio' }: PDFActionButtonProps) {
  const config = ACTION_CONFIG[type];
  const Icon = config.icon;
  const textClass = RESPONSIVE_CLASSES[responsiveMode];

  return (
    <Button
      disabled={disabled}
      size="sm"
      variant="outline"
      className={`text-[10px] md:text-xs px-1 md:px-2 py-1 h-auto min-w-0 whitespace-nowrap border-gray-300 hover:bg-gray-100 ${className}`}
      onClick={onClick}
    >
      <Icon className="w-3 h-3 md:mr-1 flex-shrink-0" />
      <span className={textClass}>{config.label}</span>
    </Button>
  );
}

interface PDFActionGroupProps {
  pdfPath: string;
  pdfState: 1 | 2 | 3;
  type: 'question' | 'answer';
  responsiveMode?: ResponsiveMode;
}

export function PDFActionGroup({ pdfPath, pdfState, type, responsiveMode = 'year-no-audio' }: PDFActionGroupProps) {
  // pdfState = 3（完全欠落）の場合は全てdisabled
  // pdfState = 2（一部欠落）の場合は、pdfPathが空の場合のみdisabled
  const isCompletelyMissing = pdfState === 3;
  const isPartiallyMissing = pdfState === 2 && !pdfPath;
  const disabled = isCompletelyMissing || isPartiallyMissing;
  const label = type === 'question' ? '問題' : '解答';
  const layoutClass = LAYOUT_CLASSES[responsiveMode];

  return (
    <div className={`flex gap-0.5 md:gap-1 justify-center items-stretch ${layoutClass}`}>
      <PDFActionButton
        type="view"
        disabled={disabled}
        onClick={() => window.open(`/pdfs/${pdfPath}`, '_blank')}
        responsiveMode={responsiveMode}
      />
      <PDFActionButton
        type="download"
        disabled={disabled}
        onClick={() => {
          const link = document.createElement('a');
          link.href = `/pdfs/${pdfPath}`;
          link.download = pdfPath;
          link.click();
        }}
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
}

export function AudioActionGroup({ audioPath, pdfState, priority, responsiveMode = 'year-with-audio' }: AudioActionGroupProps) {
  // pdfState = 3（完全欠落）の場合は全てdisabled
  // pdfState = 2（一部欠落）の場合は、audioPathが空の場合、またはpriorityが空白/数字の場合disabled
  const isCompletelyMissing = pdfState === 3;
  const isPartiallyMissing = pdfState === 2 && (!audioPath || !priority || /^\d+$/.test(priority));
  const disabled = isCompletelyMissing || isPartiallyMissing;

  if (!audioPath) {
    return <div className="text-center text-gray-400 text-xs">-</div>;
  }

  return (
    <div className="flex justify-center items-stretch">
      <PDFActionButton
        type="audio"
        disabled={disabled}
        onClick={() => {
          const link = document.createElement('a');
          link.href = `/pdfs/${audioPath}`;
          link.download = audioPath;
          link.click();
        }}
        responsiveMode={responsiveMode}
      />
    </div>
  );
}