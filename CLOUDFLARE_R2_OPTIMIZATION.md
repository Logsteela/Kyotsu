# Cloudflare R2移行時の最適化ポイント

## 概要
現在、PDFファイルは `/public/pdfs/` に配置され、Vercelにデプロイされている。
3GB〜15GBのPDFファイルをCloudflare R2に移行する際の最適化ポイントをまとめる。

---

## 1. PDF URL解決ロジックの変更

### 対象ファイル
- `/src/app/data/testDatabase.ts`

### 現在の実装
```typescript
export function resolvePublicPdfUrl(pathOrName: string | undefined | null): string | null {
  // 現在: /pdfs/相対パス を返す（public/pdfs/ 以下のファイル）
  return `/pdfs/${rel}`;
}
```

### 変更ポイント
- **Cloudflare R2のPublic URLまたはカスタムドメインに変更**
- 例: `https://pdf.yourdomain.com/${rel}` または `https://pub-xxxxx.r2.dev/${rel}`
- 環境変数化を推奨: `import.meta.env.VITE_PDF_BASE_URL`

```typescript
// 推奨実装例
const PDF_BASE_URL = import.meta.env.VITE_PDF_BASE_URL || 'https://pdf.yourdomain.com';

export function resolvePublicPdfUrl(pathOrName: string | undefined | null): string | null {
  const s = (pathOrName ?? "").trim();
  if (!s) return null;
  
  if (s.includes("/")) {
    if (EXISTING_PDFS_REL.has(s)) return `${PDF_BASE_URL}/${s}`;
    return `${PDF_BASE_URL}/${s}`;
  }
  
  // ... 以下同様
}
```

---

## 2. PDF存在チェックロジックの見直し

### 対象ファイル
- `/src/app/data/testDatabase.ts`

### 現在の実装
```typescript
function existsInPublicPdfs(name: string | undefined | null): boolean {
  // EXISTING_PDFS_REL, BASENAME_TO_REL などの静的リストで判定
}

function severityFromExistingFiles(files: string[]): PdfState {
  // existsInPublicPdfs() でファイルの存在を確認
}
```

### 変更ポイント
- **R2移行後も静的リストを維持するか、動的チェックに変更するか検討**
- 静的リスト維持（推奨）:
  - ビルド時に存在チェック
  - パフォーマンス最適化
  - サイトマップ生成にも影響
- 動的チェック:
  - HEAD リクエストで存在確認
  - 初回アクセス時にコストがかかる

**推奨**: 静的リストを維持し、ビルド時にR2のファイルリストを取得してハードコード

---

## 3. ダウンロードボタンの挙動

### 対象ファイル
- `/src/app/components/PDFActionButton.tsx`

### 現在の実装
```typescript
onClick={() => {
  const link = document.createElement('a');
  link.href = resolvedUrl; // 同一オリジンを想定
  link.download = pdfPath.split('/').pop() ?? pdfPath;
  link.click();
}}
```

### 変更ポイント
- **CORS設定が必要**
- R2バケットのCORS設定で `Access-Control-Allow-Origin` を許可
- `download` 属性は異なるオリジンでは効かない可能性がある
  - → R2のレスポンスヘッダーに `Content-Disposition: attachment` を設定
  - または、プロキシ経由でダウンロード

**推奨**: R2のカスタムドメイン経由でCORS+Content-Dispositionヘッダー設定

---

## 4. キャッシュ戦略の最適化

### 対象範囲
- Cloudflare R2 + CDN設定

### 最適化ポイント
- **Cache-Control ヘッダーの設定**
  - PDFは不変ファイルとして扱う: `Cache-Control: public, max-age=31536000, immutable`
  - Cloudflare CDNで世界中にキャッシュ
- **Cloudflare Cache Rules**
  - `*.pdf` に対してEdge TTLを最大化
  - Browser TTLも長めに設定（1年など）
- **プリロード/プリフェッチ（オプション）**
  - 個別ページで `<link rel="prefetch" href="PDF_URL">` を追加
  - ユーザーがクリックする前にPDFをキャッシュ

---

## 5. 環境変数の追加

### 対象ファイル
- `.env` (新規作成またはGitHub Secretsに設定)

### 必要な環境変数
```bash
# Cloudflare R2のPublic URL（カスタムドメイン推奨）
VITE_PDF_BASE_URL=https://pdf.yourdomain.com

# オプション: R2 API認証情報（ビルド時にファイルリスト取得する場合）
R2_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=pdf-archive
```

### Vercel設定
- Vercelのダッシュボードで環境変数を設定
- Production / Preview / Development 環境ごとに設定可能

---

## 6. ビルドスクリプトの修正（オプション）

### 対象ファイル
- `/scripts/generate-sitemap.js`
- 新規: `/scripts/sync-r2-file-list.js`（推奨）

### 最適化ポイント
- **R2のファイルリストをビルド時に取得**
  - AWS SDK (S3互換) で R2 からファイルリストを取得
  - `EXISTING_PDFS_REL`, `BASENAME_TO_REL` などを自動生成
  - `/src/app/data/pdfFileList.generated.ts` として出力

```javascript
// scripts/sync-r2-file-list.js (実装例)
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import fs from 'fs';

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// R2からファイルリスト取得 → TypeScriptファイル生成
```

**推奨**: `package.json` の `build` スクリプトに追加
```json
"scripts": {
  "build": "npm run sync-r2 && npm run generate-sitemap && vite build",
  "sync-r2": "node scripts/sync-r2-file-list.js"
}
```

---

## 7. SEO対策の強化

### 対象ファイル
- `/src/app/components/SEOMeta.tsx`
- `/src/app/pages/TestDetailPage.tsx`

### 最適化ポイント
- **構造化データにPDFのURLを追加**
  - `DigitalDocument` スキーマでPDFを明示
  - Google検索結果でPDFプレビューが表示される可能性
- **OGP画像の追加（オプション）**
  - R2にOGP用のサムネイル画像も配置
  - 各試験の `og:image` として設定

```typescript
// 構造化データ例
{
  "@type": "DigitalDocument",
  "name": "2026年度 国語 本試験問題",
  "url": "https://pdf.yourdomain.com/2026/2026_国語_本試験問題.pdf",
  "encodingFormat": "application/pdf"
}
```

---

## 8. パフォーマンスモニタリング

### 実装推奨
- **Cloudflare Analytics**
  - R2のアクセス状況を監視
  - どのPDFが頻繁にアクセスされているか把握
- **Vercel Analytics**
  - ページロード時間の監視
  - Core Web Vitalsへの影響確認
- **エラートラッキング**
  - 404エラー（PDF Not Found）の監視
  - Sentryなどでエラーログ収集

---

## 9. コスト最適化

### Cloudflare R2の無料枠
- ストレージ: 10GB/月 無料
- 読み出し（egress）: 完全無料
- Class A操作（書き込み）: 100万リクエスト/月 無料
- Class B操作（読み込み）: 1000万リクエスト/月 無料

### 最適化戦略
- **ファイル命名規則の統一**
  - 現在の命名規則を維持: `年度_教科_本試験問題.pdf`
  - サブディレクトリ: `2026/`, `2025/` など
- **圧縮の検討（オプション）**
  - PDFファイル自体は既に圧縮されているため効果は限定的
  - 非常に古いPDFのみ再圧縮検討
- **アクセス頻度の低いPDFの扱い**
  - 全て R2 に配置（無料枠内で収まる）
  - 将来的に数十GBになる場合も、月$0.15/GB程度

---

## 10. セキュリティ対策

### Cloudflare R2設定
- **Public Bucketとして設定**
  - 誰でもアクセス可能にする
- **署名付きURL（オプション）**
  - 将来的に有料化する場合のみ検討
  - 現時点では不要
- **DDoS保護**
  - Cloudflareの自動DDoS保護が有効
  - Rate Limitingの設定（オプション）

### CORS設定例
```json
[
  {
    "AllowedOrigins": ["https://yourdomain.com"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 実装の優先順位

### 必須（Phase 1）
1. ✅ PDF URL解決ロジックの変更 (`testDatabase.ts`)
2. ✅ 環境変数の追加 (`.env`, Vercel設定)
3. ✅ Cloudflare R2のCORS設定

### 推奨（Phase 2）
4. ✅ ビルド時のR2ファイルリスト同期スクリプト
5. ✅ キャッシュ戦略の最適化（Cloudflare設定）
6. ✅ ダウンロードボタンの挙動確認・修正

### オプション（Phase 3）
7. 🔹 構造化データの強化
8. 🔹 パフォーマンスモニタリング
9. 🔹 OGP画像の追加

---

## チェックリスト

- [ ] Cloudflare R2バケット作成
- [ ] カスタムドメイン設定 (`pdf.yourdomain.com`)
- [ ] PDFファイルをR2にアップロード（3GB〜15GB）
- [ ] CORS設定の追加
- [ ] 環境変数 `VITE_PDF_BASE_URL` を設定
- [ ] `testDatabase.ts` の `resolvePublicPdfUrl()` を修正
- [ ] Vercelに環境変数を追加
- [ ] ビルド＆デプロイテスト
- [ ] 本番環境でPDF閲覧・ダウンロードの動作確認
- [ ] Cloudflare Analyticsでアクセス状況確認
- [ ] SEO検証（Google Search Console）

---

## 参考リンク

- [Cloudflare R2 公式ドキュメント](https://developers.cloudflare.com/r2/)
- [R2 Custom Domains](https://developers.cloudflare.com/r2/buckets/public-buckets/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [AWS SDK for JavaScript v3 (S3 Client)](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)

---

## 備考

- このドキュメントは実装前の最適化ポイントをまとめたもの
- 実装時には各項目を順次確認しながら進める
- R2移行後も `/public/` に少量のサンプルPDFを残すことも検討可能（デモ用）
