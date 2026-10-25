import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    // /concepts is an internal prototype (also noindex at page level).
    rules: { userAgent: '*', allow: '/', disallow: ['/api/', '/concepts'] },
    sitemap: 'https://thebarpeople-website.vercel.app/sitemap.xml',
  };
}
