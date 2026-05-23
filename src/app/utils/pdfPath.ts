const R2_PUBLIC_ORIGIN = 'https://pub-43d2006e555442dca4a107e7bc0d01bb' + '.r2.dev';

function getAssetFileName(pathOrUrl: string | undefined | null): string | null {
  const raw = (pathOrUrl ?? '').trim();
  if (!raw) return null;

  const path = raw
    .replace(/^https?:\/\/[^/]+\//, '')
    .replace(/^\/+/, '')
    .replace(/^pdfs\//, '');

  const fileName = path.split('/').filter(Boolean).pop();

  return fileName || null;
}

/**
 * PDF/音声パスからR2直下の公開URLを生成する
 *
 * @param pdfPath - データベースに保存されているPDF/音声パス
 * @returns R2直下の公開URL
 */
export function getPdfUrlPath(pdfPath: string | undefined | null): string {
  const fileName = getAssetFileName(pdfPath);
  if (!fileName) return '';

  return `${R2_PUBLIC_ORIGIN}/${encodeURIComponent(decodeURIComponent(fileName))}`;
}
