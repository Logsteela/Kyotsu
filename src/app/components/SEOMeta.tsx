 import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
}

/**
 * SEOMetaコンポーネント
 * 各ページの<head>内に必要なSEOメタタグを統一的に設定します
 * - Open Graph Protocol (OGP)
 * - Twitter Card
 * - Canonical URL
 * - Keywords
 */
export function SEOMeta({
  title,
  description,
  path,
  keywords = '共通テスト,過去問,PDF,ダウンロード,大学入試,センター試験,問題,解答',
  type = 'website',
  imageUrl = '/ogp-image.png',
}: SEOMetaProps) {
  const baseUrl = 'https://kyotsu.org'; // 本番環境のURLに変更してください
  const fullUrl = `${baseUrl}${path}`;
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;

  return (
    <Helmet>
      {/* 基本メタタグ */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL（重複コンテンツ対策） */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph Protocol (Facebook, LINE等) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="共通テスト過去問総集" />
      <meta property="og:locale" content="ja_JP" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* その他のメタタグ */}
      <meta name="author" content="共通テスト過去問総集" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* モバイル対応 */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="共通テスト過去問" />
    </Helmet>
  );
}
