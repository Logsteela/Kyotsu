import { resolvePublicPdfUrl } from '@/app/data/testDatabase';

const R2_PUBLIC_ORIGIN = 'https://pub-43d2006e555442dca4a107e7bc0d01bb' + '.r2.dev';

function getAssetFileName(pathOrUrl: string | undefined | null): string | null {
  const raw = (pathOrUrl ?? '').trim();
  if (!raw) return null;

  const path = raw.replace(/^https?:\/\/[^/]+\//, '').replace(/^\/+/, '');
  const fileName = path.split('/').filter(Boolean).pop();

  return fileName || null;
}

function toR2RootUrl(pathOrUrl: string): string {
  const fileName = getAssetFileName(pathOrUrl);
  if (!fileName) return '';

  return `${R2_PUBLIC_ORIGIN}/${encodeURIComponent(decodeURIComponent(fileName))}`;
}

/**
 * PDFパスからR2直下の公開URLを生成する
 *
 * @param pdfPath - データベースに保存されているPDFパス
 * @returns R2直下の公開URL
 */
export function getPdfUrlPath(pdfPath: string): string {
  const resolvedUrl = resolvePublicPdfUrl(pdfPath);
  return resolvedUrl ? toR2RootUrl(resolvedUrl) : '';
}
