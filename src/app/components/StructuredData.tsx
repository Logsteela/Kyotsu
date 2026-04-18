 import { Helmet } from 'react-helmet-async';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface StructuredDataProps {
  type: 'WebSite' | 'WebPage' | 'EducationalOccupationalProgram' | 'ItemList';
  breadcrumbs?: BreadcrumbItem[];
  pageTitle?: string;
  pageDescription?: string;
  itemListName?: string;
  items?: Array<{ name: string; url: string }>;
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
  itemListName,
  items = [],
}: StructuredDataProps) {
  const baseUrl = 'https://kyotsu.org'; // 本番環境のURLに変更してください

  const generateWebSiteSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '共通テスト過去問総集',
    description: '全ての共通テストの問題・解答を無料公開。過去問を年度別・教科別に閲覧・ダウンロードできます。',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: '共通テスト過去問総集',
      url: baseUrl,
    },
  });

  const generateWebPageSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: pageTitle,
    description: pageDescription,
    url: baseUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: '共通テスト過去問総集',
      url: baseUrl,
    },
  });

  const generateBreadcrumbSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  });

  const generateEducationalProgramSchema = () => ({
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalProgram',
    name: '共通テスト過去問アーカイブ',
    description: '大学入学共通テスト（旧センター試験）の過去問題集',
    provider: {
      '@type': 'Organization',
      name: '共通テスト過去問総集',
    },
    educationalProgramMode: 'online',
    hasCourse: {
      '@type': 'Course',
      name: '共通テスト対策',
      description: '過去48年分の問題・解答を収録',
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
      url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  });

  let schema;
  switch (type) {
    case 'WebSite':
      schema = generateWebSiteSchema();
      break;
    case 'WebPage':
      schema = generateWebPageSchema();
      break;
    case 'EducationalOccupationalProgram':
      schema = generateEducationalProgramSchema();
      break;
    case 'ItemList':
      schema = generateItemListSchema();
      break;
  }

  // パンくずリストがある場合は別途追加
  const breadcrumbSchema = breadcrumbs.length > 0 ? generateBreadcrumbSchema() : null;

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      {breadcrumbSchema && (
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      )}
    </Helmet>
  );
}
