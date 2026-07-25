import type { MetadataRoute } from 'next';
import { services, eventTypes } from '@/lib/constants';

const BASE = 'https://thebarpeople-website.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ['', '/our-bars', '/gallery', '/about', '/contact', '/quote', '/privacy', '/terms'];
  return [
    ...staticPages.map((p) => ({ url: `${BASE}${p}`, lastModified: now, priority: p === '' ? 1 : 0.7 })),
    ...services.map((s) => ({ url: `${BASE}/services/${s.slug}`, lastModified: now, priority: 0.8 })),
    ...eventTypes.map((e) => ({ url: `${BASE}/events/${e.slug}`, lastModified: now, priority: 0.6 })),
  ];
}
