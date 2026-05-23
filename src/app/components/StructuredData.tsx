import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type:
    | 'WebSite'
    | 'WebPage'
    | 'EducationalOccupationalProgram'
    | 'ItemList'
    | 'Dataset';
  breadcrumbs?: BreadcrumbItem[];
  pageTitle?: string;
  pageDescription?: string;
  pagePath?: string;
  itemListName?: string;
  items?: Array<{ name: string; url: string }>;
  name?: string;
  description?: string;
  url?: string;
  keywords?: string[];
}

const BASE_URL = 'https://kyotsu.org';
const SITE_NAME = '共通テスト過去問総集';

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

function toAbsoluteUrl(pathOrUrl = '/'): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;

  const [pathWithoutHash] = pathOrUrl.split('#');
  const [pathWithoutQuery] = pathWithoutHash.split('?');
  const normalizedPath = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`;
  return `${BASE_URL}${normalizedPath}`;
}

function removeEmptyValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeEmptyValues(item))
      .filter((item) => item !== undefined && item !== null) as T;
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, item]) => [key, removeEmptyValues(item)])
        .filter(([, item]) => {
          if (item === undefined || item === null || item === '') return false;
          if (Array.isArray(item) && item.length === 0) return false;
          return true;
        }),
    ) as T;
  }

  return value;
}

/**
 * StructuredDataコンポーネント
 * Schema.org形式の構造化データ（JSON-LD）を生成してSEOを強化します
 */
export function StructuredData({
  type,
  breadcrumbs = [],
  pageTitle,
  pageDescription,
  pagePath,
  itemListName,
  items = [],
  name,
  description,
  url,
  keywords = [],
}: StructuredDataProps) {
  const effectivePagePath = pagePath ?? getCurrentPath();

  const siteEntity = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    url: `${BASE_URL}/`,
  };

  const organizationEntity = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: `${BASE_URL}/`,
    logo: `${BASE_URL}/ogp-image.png`,
  };

  const generateWebSiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    name: SITE_NAME,
    alternateName: ['共通テスト過去問', '共通テスト過去問総集'],
    description:
      '大学入学共通テスト、旧センター試験、共通一次試験の問題・解答を年度別・教科別に探せる過去問アーカイブです。',
    url: `${BASE_URL}/`,
    inLanguage: 'ja-JP',
    publisher: organizationEntity,
  });

  const generateWebPageSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: toAbsoluteUrl(effectivePagePath),
    inLanguage: 'ja-JP',
    isPartOf: siteEntity,
    publisher: organizationEntity,
  });

  const generateBreadcrumbSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ホーム',
        item: `${BASE_URL}/`,
      },
      ...breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.name,
        item: item.url ? toAbsoluteUrl(item.url) : toAbsoluteUrl(effectivePagePath),
      })),
    ],
  });

  const generateEducationalProgramSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: '共通テスト過去問アーカイブ',
    description: '大学入学共通テスト、旧センター試験、共通一次試験の過去問題集です。',
    url: `${BASE_URL}/`,
    inLanguage: 'ja-JP',
    provider: organizationEntity,
    educationalProgramMode: 'online',
    hasCourse: {
      '@type': 'Course',
      name: '共通テスト対策',
      description: '年度別・教科別に共通テスト過去問の問題・解答を確認できます。',
      inLanguage: 'ja-JP',
      provider: organizationEntity,
    },
  });

  const generateItemListSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: itemListName,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: toAbsoluteUrl(item.url),
    })),
  });

  const generateDatasetSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name,
    description,
    url: toAbsoluteUrl(url ?? effectivePagePath),
    inLanguage: 'ja-JP',
    isPartOf: siteEntity,
    publisher: organizationEntity,
    keywords,
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/pdf',
      contentUrl: toAbsoluteUrl(url ?? effectivePagePath),
    },
  });

  const schema = removeEmptyValues((() => {
    switch (type) {
      case 'WebSite':
        return generateWebSiteSchema();
      case 'WebPage':
        return generateWebPageSchema();
      case 'EducationalOccupationalProgram':
        return generateEducationalProgramSchema();
      case 'ItemList':
        return generateItemListSchema();
      case 'Dataset':
        return generateDatasetSchema();
    }
  })());

  const breadcrumbSchema = breadcrumbs.length > 0
    ? removeEmptyValues(generateBreadcrumbSchema())
    : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  );
}
