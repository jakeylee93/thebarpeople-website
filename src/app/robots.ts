import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // /concepts and /new are internal prototypes (also noindex at page level).
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/concepts', '/new'] },
    sitemap: 'https://thebarpeople-website.vercel.app/sitemap.xml',
  };
}
