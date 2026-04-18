# SEOチェックリスト

デプロイ前に以下の項目を確認してください。

## 📋 必須項目

### メタタグ設定
- [x] すべてのページに適切な`<title>`タグが設定されている
- [x] すべてのページに`<meta name="description">`が設定されている
- [x] キーワードが各ページに適切に設定されている
- [x] Canonical URLが正しく設定されている

### OGP（Open Graph Protocol）
- [x] OGPメタタグが全ページに設定されている
- [x] OGP画像（1200×630px）を`/public/ogp-image.png`に配置
- [x] `og:title`が適切に設定されている
- [x] `og:description`が適切に設定されている
- [x] `og:url`が正しく設定されている

### Twitter Card
- [x] Twitter Cardメタタグが設定されている
- [x] `twitter:card`が`summary_large_image`に設定されている
- [x] `twitter:title`と`twitter:description`が設定されている

### 構造化データ（JSON-LD）
- [x] トップページに`WebSite`スキーマが設定されている
- [x] 年度別ページに`WebPage`スキーマが設定されている
- [x] 教科別ページに`WebPage`スキーマが設定されている
- [x] パンくずリスト用の`BreadcrumbList`スキーマが設定されている
- [x] 教育コンテンツ用の`EducationalOccupationalProgram`スキーマが設定されている

### サイトマップとrobots.txt
- [x] `sitemap.xml`が生成されている
- [x] `robots.txt`が配置されている
- [x] サイトマップに全ページが含まれている（48年度 + 9教科 = 57ページ）
- [x] `sitemap.xml`のベースURLが本番環境のURLに変更されている

### セマンティックHTML
- [x] `<main>`タグが使用されている
- [x] `<nav>`タグが使用されている
- [x] `<header>`タグが使用されている
- [x] ARIA属性（`aria-label`, `aria-current`など）が適切に使用されている
- [x] 見出しタグ（h1, h2, h3）が適切な階層で使用されている

### ナビゲーション
- [x] パンくずリストが年度別・教科別ページに表示されている
- [x] 内部リンクが適切に設定されている
- [x] 404ページが実装されている

### モバイル対応
- [x] レスポンシブデザインが実装されている
- [x] `viewport`メタタグが設定されている
- [x] モバイルフレンドリーなタッチターゲット

## 🔧 本番デプロイ前の変更項目

### ベースURLの変更
本番環境のドメインに変更する必要があります：

1. [x] `/src/app/components/SEOMeta.tsx`
   ```tsx
   const baseUrl = 'https://your-actual-domain.com';
   ```

2. [x] `/src/app/components/StructuredData.tsx`
   ```tsx
   const baseUrl = 'https://your-actual-domain.com';
   ```

3. [x] `/scripts/generate-sitemap.js`
   ```javascript
   const BASE_URL = 'https://your-actual-domain.com';
   ```

4. [x] `/public/robots.txt`
   ```
   Sitemap: https://your-actual-domain.com/sitemap.xml
   ```

5. [x] サイトマップの再生成
   ```bash
   npm run generate-sitemap
   ```

### OGP画像の作成
- [x] 1200×630pxのOGP画像を作成
- [x] `/public/ogp-image.png`として保存
- [x] 画像に以下の要素を含める：
  - サイト名「共通テスト過去問総集」
  - キャッチコピー「1978-2025年度 全教科収録」
  - ブランドカラー（緑 #004800）を使用

## 📈 デプロイ後の設定項目

### Google Search Console
- [ ] サイトを登録
- [ ] サイトマップを送信（`https://your-domain.com/sitemap.xml`）
- [ ] インデックス状況を確認
- [ ] モバイルユーザビリティをチェック
- [ ] Core Web Vitalsをモニタリング

### Google Analytics（推奨）
- [ ] Google Analyticsアカウントを作成
- [ ] トラッキングコードを`index.html`に追加
- [ ] イベントトラッキングの設定（PDFダウンロードなど）

### その他のSEOツール
- [ ] [Googleリッチリザルトテスト](https://search.google.com/test/rich-results)で構造化データを検証
- [ ] [Googleモバイルフレンドリーテスト](https://search.google.com/test/mobile-friendly)でモバイル対応を確認
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/)でパフォーマンスを測定
- [ ] [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)でOGP設定を確認
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator)でTwitter Cardを確認

## 🚀 パフォーマンス最適化（推奨）

### 画像最適化
- [ ] 画像をWebP形式に変換
- [ ] 画像の遅延読み込み（lazy loading）を実装
- [ ] 適切な画像サイズを使用

### コード最適化
- [ ] 不要なコンソールログを削除
- [ ] プロダクションビルドで最小化
- [ ] コード分割（React.lazy）の検討

### キャッシュ設定
- [ ] ブラウザキャッシュのヘッダー設定
- [ ] CDNの使用を検討
- [ ] Service Workerの実装（PWA化）

### SSL/HTTPS
- [ ] SSL証明書を取得（Let's Encryptなど）
- [ ] すべてのページをHTTPSで配信
- [ ] HTTPからHTTPSへの自動リダイレクト設定

## 🔍 定期的なメンテナンス

### コンテンツ更新
- [ ] 新しい年度の過去問を追加時にサイトマップを再生成
- [ ] メタデータ（description, keywords）を定期的に見直し
- [ ] 構造化データを最新の仕様に更新

### SEOモニタリング
- [ ] Google Search Consoleで検索パフォーマンスを月次確認
- [ ] インデックスエラーのチェック
- [ ] 被リンク状況の確認
- [ ] キーワードランキングの追跡

### テクニカルSEO
- [ ] リンク切れのチェック
- [ ] ページ速度の定期的な測定
- [ ] モバイルユーザビリティの確認
- [ ] Core Web Vitalsの改善

### コンテンツマーケティング
- [ ] ブログ記事の追加（過去問の解説、受験対策など）
- [ ] FAQページの作成
- [ ] 学習ガイドの作成

### アクセシビリティ
- [ ] WCAG 2.1 AAレベルの準拠
- [ ] スクリーンリーダー対応の確認
- [ ] キーボードナビゲーションの確認

## ✅ 最終チェック

デプロイ直前の確認：

- [ ] すべてのページが正常に表示される
- [ ] リンクが正しく機能する
- [ ] フォームが正常に動作する（該当する場合）
- [ ] モバイル表示が適切
- [ ] 主要ブラウザでテスト済み（Chrome, Firefox, Safari, Edge）
- [ ] ページ読み込み速度が3秒以内
- [ ] コンソールエラーがない
- [ ] 本番環境のURLがすべて正しく設定されている

---

**最終確認日**: _________

**確認者**: _________

**デプロイ日**: _________

**備考**:
