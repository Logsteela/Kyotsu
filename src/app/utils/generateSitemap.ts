 import { getYearList, getSubjectList } from '@/app/data/testDatabase';

/**
 * sitemap.xml生成ユーティリティ
 * 全ページのURLリストを生成してSEOを強化します
 */

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemapXML(): string {
  const baseUrl = 'https://kyotsu.org'; // 本番環境のURLに変更してください
  const urls: SitemapUrl[] = [];

  // トップページ（総覧）
  urls.push({
    loc: `${baseUrl}/`,
    changefreq: 'weekly',
    priority: 1.0,
  });

  // 年度別ページ
  const years = getYearList();
  years.forEach((year) => {
    urls.push({
      loc: `${baseUrl}/year/${year}/`,
      changefreq: 'monthly',
      priority: 0.8,
    });
  });

  // 教科別ページ
  const subjects = getSubjectList();
  subjects.forEach((subject) => {
    urls.push({
      loc: `${baseUrl}/subject/${subject.slug}/`,
      changefreq: 'monthly',
      priority: 0.8,
    });
  });

  // XMLを生成
  const urlElements = urls.map((url) => {
    return `  <url>
    <loc>${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority !== undefined ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

/**
 * サイトマップをコンソールに出力（開発用）
 */
export function printSitemap(): void {
  console.log(generateSitemapXML());
}
