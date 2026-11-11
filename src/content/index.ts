// The one place the site gets its words and pictures.
//
// Today the AnyVendor adapter is not configured, so this returns the bundled
// seed (identical to the current site). Once ANYVENDOR_API_URL and
// ANYVENDOR_SITE_SLUG are set on the server, published content (or a draft,
// with ?preview=<token>) comes from AnyVendor and is cleaned against this
// site's own manifest. Anything missing falls back to the bundled seed.

import type { FieldValue, Manifest, SiteContent } from './contract.ts';
import { normaliseByManifest, withRequiredDefaults } from './contract.ts';
import { TBP_MANIFEST, MANIFEST_REVISION } from './manifest.ts';
import { TBP_DEFAULT_CONTENT } from './defaults.ts';
import { fetchSiteV1, isPreviewToken } from './anyvendor.ts';

export type ContentSource = 'bundled' | 'published' | 'draft';

export interface LoadedContent {
  content: SiteContent;
  source: ContentSource;
  /** AnyVendor revision id, or "bundled-<manifest revision>". */
  revision: string;
}

/**
 * Remote content cleaned against OUR manifest. A field the remote doesn't
 * mention at all (e.g. a manifest mismatch) keeps the bundled value; a field
 * the editor deliberately emptied stays empty unless it's required.
 */
export function mergeRemote(manifest: Manifest, remote: SiteContent, defaults: SiteContent): SiteContent {
  const cleaned = normaliseByManifest(manifest, remote);
  const merged: SiteContent = {};
  for (const s of manifest.sections) {
    const sent = (remote?.[s.key] && typeof remote[s.key] === 'object' ? remote[s.key] : {}) as Record<string, FieldValue>;
    merged[s.key] = {};
    for (const f of s.fields) {
      merged[s.key][f.key] = Object.prototype.hasOwnProperty.call(sent, f.key) ? cleaned[s.key][f.key] : defaults[s.key][f.key];
    }
  }
  return withRequiredDefaults(manifest, merged, defaults);
}

export async function getSiteContent(opts: { preview?: string | null } = {}): Promise<LoadedContent> {
  const remote = await fetchSiteV1(opts.preview);
  if (remote) {
    return { content: mergeRemote(TBP_MANIFEST, remote.content, TBP_DEFAULT_CONTENT), source: remote.mode, revision: remote.revision };
  }
  return {
    content: withRequiredDefaults(TBP_MANIFEST, normaliseByManifest(TBP_MANIFEST, TBP_DEFAULT_CONTENT), TBP_DEFAULT_CONTENT),
    source: 'bundled',
    revision: `bundled-${MANIFEST_REVISION}`,
  };
}

/**
 * A draft, strictly: null unless AnyVendor served this token's draft for this
 * site. The draft page answers 404 on null; it never shows published or
 * bundled content in a draft's place.
 */
export async function getDraftContent(token: string, deps: Parameters<typeof fetchSiteV1>[1] = {}): Promise<LoadedContent | null> {
  if (!isPreviewToken(token)) return null;
  const remote = await fetchSiteV1(token, deps);
  if (!remote || remote.mode !== 'draft') return null;
  return { content: mergeRemote(TBP_MANIFEST, remote.content, TBP_DEFAULT_CONTENT), source: 'draft', revision: remote.revision };
}
