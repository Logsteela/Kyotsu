import { resolvePublicPdfUrl } from '@/app/data/testDatabase';

/**
 * PDFパスからURLパスを生成する
 * public/pdfs/配下のパスから、pdfsを除去してURLパスを作成
 * 
 * @param pdfPath - データベースに保存されているPDFパス（例: "pdfs/2026/2026_国語_本試験問題.pdf" または "2026_国語_本試験問題.pdf"）
 * @returns URLパス（例: "/2026/2026_国語_本試験問題.pdf"）
 */
export function getPdfUrlPath(pdfPath: string): string {
  // resolvePublicPdfUrl を使用して統一的にパス解決
  const resolvedUrl = resolvePublicPdfUrl(pdfPath);
  return resolvedUrl ?? '';
}
