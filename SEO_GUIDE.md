# SEO対策ガイド

このドキュメントでは、共通テスト過去問総集に実装されたSEO対策について説明します。

## 📋 目次

1. [実装済みのSEO対策](#実装済みのseo対策)
2. [使用方法](#使用方法)
3. [カスタマイズ方法](#カスタマイズ方法)
4. [追加の推奨事項](#追加の推奨事項)

---

## ✅ 実装済みのSEO対策

### 1. メタタグの最適化

#### SEOMetaコンポーネント (`/src/app/components/SEOMeta.tsx`)

全ページで統一的なメタタグを設定するコンポーネントです。以下の要素を含みます：

- **基本メタタグ**: title, description, keywords
- **Canonical URL**: 重複コンテンツ対策
- **Open Graph Protocol (OGP)**: Facebook、LINEなどのSNSシェア対応
- **Twitter Card**: Twitterでのリッチプレビュー対応
- **モバイル対応メタタグ**: PWA対応準備

**使用例:**
```tsx
<SEOMeta
  title="2025年度（令和7年）- 共通テスト過去問総集"
  description="2025年度（令和7年）共通テスト過去問の問題・解答PDFを全教科収録。"
  path="/year/2025"
  keywords="共通テスト,2025年度,令和7年,過去問,問題,解答"
  type="article"
/>
```

### 2. 構造化データ（JSON-LD）

#### StructuredDataコンポーネント (`/src/app/components/StructuredData.tsx`)

Schema.org形式の構造化データを生成し、検索エンジンにコンテンツ構造を伝えます。

**実装済みスキーマ:**
- **WebSite**: サイト全体の情報
- **WebPage**: 個別ページの情報
- **BreadcrumbList**: パンくずリスト
- **EducationalOccupationalProgram**: 教育コンテンツ
- **ItemList**: リスト形式のコンテンツ

**使用例:**
```tsx
<StructuredData
  type="WebPage"
  pageTitle="2025年度一覧"
  pageDescription="2025年度の過去問一覧"
  breadcrumbs={[
    { name: '総覧', url: '/' },
    { name: '2025年度一覧', url: '/year/2025' },
  ]}
/>
```

### 3. パンくずリスト

#### Breadcrumbsコンポーネント (`/src/app/components/Breadcrumbs.tsx`)

ユーザビリティとSEOの両方を強化するパンくずリストを表示します。

**特徴:**
- セマンティックHTML（`<nav>`, `<ol>`, `<li>`）を使用
- ARIA属性によるアクセシビリティ対応
- ホームアイコンとChevronアイコンによる視覚的わかりやすさ

### 4. セマンティックHTML

適切なHTML5タグを使用してコンテンツ構造を明確化：

- `<main>`: メインコンテンツ
- `<nav>`: ナビゲーション
- `<header>`: ヘッダー
- `<article>`: 記事コンテンツ
- ARIA属性: `aria-label`, `aria-current`など

### 5. sitemap.xml自動生成

#### 生成スクリプト (`/scripts/generate-sitemap.js`)

ビルド時に全ページのURLを含むサイトマップを自動生成します。

**含まれるページ:**
- トップページ（総覧）
- 年度別ページ（2025～1978年度）
- 教科別ページ（全教科）

**生成方法:**
```bash
npm run generate-sitemap
```

**ビルド時に自動実行:**
```bash
npm run build
```

### 6. robots.txt

#### 設定ファイル (`/public/robots.txt`)

検索エンジンクローラーに対してクロール指示を行います。

**設定内容:**
- 全ページのクロール許可
- サイトマップの場所を指定
- クロール速度の調整

### 7. OGP画像の準備

SNSシェア時に表示される画像を設定できます。

**推奨サイズ:** 1200×630px  
**配置場所:** `/public/ogp-image.png`

---

## 🚀 使用方法

### 基本的な使用方法

各ページコンポーネントで`SEOMeta`と`StructuredData`を使用します。

**例: YearPage.tsx**
```tsx
import { SEOMeta } from '@/app/components/SEOMeta';
import { StructuredData } from '@/app/components/StructuredData';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';

export function YearPage() {
  const breadcrumbs = [
    { name: '総覧', url: '/' },
    { name: '2025年度一覧', url: '/year/2025' },
  ];

  return (
    <>
      <SEOMeta
        title="2025年度（令和7年）- 共通テスト過去問総集"
        description="2025年度の過去問一覧"
        path="/year/2025"
        keywords="共通テスト,2025年度,過去問"
        type="article"
      />
      <StructuredData
        type="WebPage"
        pageTitle="2025年度一覧"
        pageDescription="2025年度の過去問一覧"
        breadcrumbs={breadcrumbs}
      />
      <Breadcrumbs items={breadcrumbs} />
      {/* ページコンテンツ */}
    </>
  );
}
```

---

## ⚙️ カスタマイズ方法

### 1. ベースURLの変更

本番環境のURLに変更する必要があります。

**変更箇所:**
1. `/src/app/components/SEOMeta.tsx` の `baseUrl`
2. `/src/app/components/StructuredData.tsx` の `baseUrl`
3. `/scripts/generate-sitemap.js` の `BASE_URL`

```tsx
const baseUrl = 'https://your-domain.com'; // ここを変更
```

### 2. OGP画像の追加

1. 1200×630pxの画像を作成
2. `/public/ogp-image.png` として保存
3. 各ページで異なる画像を使用する場合は、`SEOMeta`の`imageUrl`プロパティを変更

```tsx
<SEOMeta
  imageUrl="/images/year-2025.png"
  // その他のプロパティ
/>
```

### 3. キーワードのカスタマイズ

各ページの特性に合わせてキーワードを最適化できます。

```tsx
const keywords = `共通テスト,${year}年度,${era},過去問,問題,解答`;
```

### 4. 構造化データの拡張

新しいスキーマタイプを追加する場合は、`StructuredData.tsx`を編集します。

**例: FAQPageスキーマの追加**
```tsx
const generateFAQSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'どのように過去問をダウンロードできますか？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '各PDFの「DL」ボタンをクリックしてダウンロードできます。',
      },
    },
  ],
});
```

---

## 📈 追加の推奨事項

### 1. Google Search Consoleの設定

1. [Google Search Console](https://search.google.com/search-console) にサイトを登録
2. サイトマップを送信: `https://your-domain.com/sitemap.xml`
3. インデックス状況を定期的に確認

### 2. Google Analyticsの導入

ユーザー行動を分析してSEOを改善します。

```tsx
// index.htmlに追加
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 3. ページ速度の最適化

- **画像最適化**: WebP形式の使用、遅延読み込み
- **コード分割**: React.lazy()による動的インポート
- **CDN使用**: 静的ファイルの配信最適化
- **キャッシュ設定**: ブラウザキャッシュの活用

### 4. モバイルフレンドリーテスト

[Googleのモバイルフレンドリーテスト](https://search.google.com/test/mobile-friendly)でチェック。

### 5. Core Web Vitalsの改善

- **LCP (Largest Contentful Paint)**: 2.5秒以下
- **FID (First Input Delay)**: 100ms以下
- **CLS (Cumulative Layout Shift)**: 0.1以下

### 6. SSL証明書の導入

HTTPSは検索ランキングの要因です。Let's Encryptなどで無料取得可能。

### 7. 定期的なコンテンツ更新

- 新しい年度の過去問を追加
- 解説記事の追加
- よくある質問（FAQ）ページの作成

### 8. 外部リンクの獲得

- 教育系サイトからのリンク
- SNSでのシェア促進
- ブログ記事での紹介

### 9. 内部リンク構造の最適化

関連ページへのリンクを適切に配置。

### 10. ローカルSEO（該当する場合）

地域に特化したサービスの場合、Googleマイビジネスに登録。

---

## 🔍 SEOチェックリスト

デプロイ前に以下を確認してください：

- [ ] すべてのページに適切なtitleとdescriptionが設定されている
- [ ] Canonical URLが正しく設定されている
- [ ] OGP画像が用意されている
- [ ] sitemap.xmlが生成されている
- [ ] robots.txtが正しく配置されている
- [ ] パンくずリストが表示されている
- [ ] 構造化データがエラーなく実装されている
- [ ] モバイルフレンドリーである
- [ ] ページ読み込み速度が速い
- [ ] HTTPSが有効である
- [ ] 404ページが適切に設定されている
- [ ] Google Search Consoleに登録されている

---

## 📚 参考リンク

- [Google検索セントラル](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## 🆘 トラブルシューティング

### sitemap.xmlが生成されない

```bash
# 手動で生成
npm run generate-sitemap
```

### 構造化データのエラー

[Googleのリッチリザルトテスト](https://search.google.com/test/rich-results)で検証。

### OGP画像が表示されない

- 画像サイズを確認（推奨: 1200×630px）
- 画像のURLが絶対パスになっているか確認
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)でキャッシュをクリア

---

**最終更新日**: 2026年1月27日
