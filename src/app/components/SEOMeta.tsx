import { Helmet } from 'react-helmet-async';

interface SEOMetaProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  type?: 'website' | 'article';
  imageUrl?: string;
  noIndex?: boolean;
}

const BASE_URL = 'https://kyotsu.org';
const SITE_NAME = '共通テスト過去問総集';
const SITE_ALTERNATE_NAMES = ['共通テスト過去問', '共通テスト過去問総集', '共通テスト集成'];
const SITE_DESCRIPTION = '共通テスト、センター試験、共通一次、追試験、特例追試験の問題・解答PDFを年度別・教科別に探せる過去問アーカイブです。';
const DEFAULT_IMAGE_ALT = '共通テスト過去問総集';

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    const url = new URL(pathOrUrl);
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/$/, url.pathname === '/' ? '/' : '');
  }

  const [pathWithoutHash] = pathOrUrl.split('#');
  const [pathWithoutQuery] = pathWithoutHash.split('?');
  const normalizedPath = pathWithoutQuery.startsWith('/')
    ? pathWithoutQuery
    : `/${pathWithoutQuery}`;

  return `${BASE_URL}${normalizedPath === '/' ? '' : normalizedPath}`;
}

/**
 * SEOMetaコンポーネント
 * 各ページの<head>内に必要なSEOメタタグを統一的に設定します
 * - title / description
 * - canonical URL
 * - Open Graph Protocol
 * - Twitter Card
 * - crawler directives
 */
export function SEOMeta({
  title,
  description,
  path,
  keywords = '共通テスト,過去問,PDF,ダウンロード,大学入試,センター試験,問題,解答',
  type = 'website',
  imageUrl = '/ogp-image.png',
  noIndex = false,
}: SEOMetaProps) {
  const fullUrl = toAbsoluteUrl(path ?? getCurrentPath());
  const fullImageUrl = toAbsoluteUrl(imageUrl);
  const robotsContent = noIndex
    ? 'noindex, nofollow, noarchive'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';
  const siteNameSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAMES,
    url: `${BASE_URL}/`,
    description: SITE_DESCRIPTION,
    inLanguage: 'ja-JP',
    publisher: {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: `${BASE_URL}/`,
      logo: `${BASE_URL}/favicon.png`,
    },
  };

  return (
    <Helmet>
      <html lang="ja" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      <meta name="referrer" content="strict-origin-when-cross-origin" />

      <link rel="canonical" href={fullUrl} />
      <link rel="alternate" hrefLang="ja-JP" href={fullUrl} />
      <link rel="alternate" hrefLang="x-default" href={fullUrl} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={DEFAULT_IMAGE_ALT} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ja_JP" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={DEFAULT_IMAGE_ALT} />

      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <script type="application/ld+json">{JSON.stringify(siteNameSchema)}</script>
    </Helmet>
  );
}
