// Server-side reader for the AnyVendor site content contract v1 (schema
// "anyvendor.site/v1", docs/backend/SITE-CONTENT-CONTRACT-v1.md in the
// AnyVendor workspace). READ-ONLY: this site never writes to AnyVendor.
//
// Inert until both are set on the server (never NEXT_PUBLIC_):
//   ANYVENDOR_API_URL     https origin that serves /api/sites/{slug}/content
//   ANYVENDOR_SITE_SLUG   the-bar-people
// Until then — and on any error, timeout, 404 or unexpected shape — callers
// get null and render the bundled content, so the site can never go blank.
//
// Deliberately NO Vercel protection-bypass support: AnyVendor's testing origin
// stays protected and its project-wide bypass secret is not to be shared. This
// adapter is for a host that serves published content without that header.

import type { Manifest, SiteContent } from './contract.ts';

export const SCHEMA = 'anyvendor.site/v1';
export const CACHE_TAG = 'anyvendor';
export const PUBLISHED_REVALIDATE_SECONDS = 60;
const TIMEOUT_MS = 4000;
const SLUG = /^[a-z0-9][a-z0-9-]{0,62}$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface SiteV1 {
  schema: typeof SCHEMA;
  mode: 'published' | 'draft';
  business: { name: string; slug: string };
  kind: string;
  manifestVersion: number;
  manifest: Manifest;
  revision: string;
  revisionVersion: number;
  publishedAt?: string;
  content: SiteContent;
}

export function anyVendorConfig(env: Record<string, string | undefined> = process.env): { base: string; slug: string } | null {
  const base = (env.ANYVENDOR_API_URL ?? '').trim().replace(/\/+$/, '');
  const slug = (env.ANYVENDOR_SITE_SLUG ?? '').trim();
  if (!/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(base) || !SLUG.test(slug)) return null;
  return { base, slug };
}

/** True when the preview value has the shape of an AnyVendor preview token. */
export const isPreviewToken = (v: unknown): v is string => typeof v === 'string' && UUID.test(v);

type FetchLike = (input: string, init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } }) => Promise<Response>;

/**
 * Published content, or a draft when a valid preview token is given.
 * Published: cached for 60s under the "anyvendor" tag (the revalidate route
 * can expire it on publish). Draft: never cached.
 */
export async function fetchSiteV1(
  preview?: string | null,
  deps: { env?: Record<string, string | undefined>; fetch?: FetchLike } = {},
): Promise<SiteV1 | null> {
  const cfg = anyVendorConfig(deps.env);
  if (!cfg) return null;
  if (preview != null && preview !== '' && !isPreviewToken(preview)) return null;
  const draft = Boolean(preview);
  const url = `${cfg.base}/api/sites/${encodeURIComponent(cfg.slug)}/content${draft ? `?preview=${encodeURIComponent(preview as string)}` : ''}`;
  const doFetch: FetchLike = deps.fetch ?? (fetch as FetchLike);
  try {
    const res = await doFetch(url, {
      method: 'GET',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      ...(draft ? { cache: 'no-store' as const } : { next: { revalidate: PUBLISHED_REVALIDATE_SECONDS, tags: [CACHE_TAG] } }),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as Partial<SiteV1> | null;
    if (!body || body.schema !== SCHEMA) return null;
    if (body.business?.slug !== cfg.slug) return null;
    if (body.mode !== (draft ? 'draft' : 'published')) return null;
    if (!body.content || typeof body.content !== 'object' || Array.isArray(body.content)) return null;
    return body as SiteV1;
  } catch {
    return null;
  }
}
