// Check for AnyVendor's optional "publish happened" call (contract v1):
//   POST /api/revalidate   Authorization: Bearer <ANYVENDOR_REVALIDATE_SECRET>
//   body {"slug":"the-bar-people","revision":"<uuid>"}
// Server-only. The secret is per site and shared out of band; until it is set
// the route answers 404 and does nothing. Polling every 60s works without it.

import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (s: string) => createHash('sha256').update(s).digest();

export type RevalidateCheck =
  | { ok: true; revision: string | null }
  | { ok: false; status: 400 | 401 | 404; error: string };

export function checkRevalidate(
  authorization: string | null,
  body: unknown,
  env: Record<string, string | undefined> = process.env,
): RevalidateCheck {
  const secret = env.ANYVENDOR_REVALIDATE_SECRET ?? '';
  const slug = env.ANYVENDOR_SITE_SLUG ?? '';
  if (secret.length < 24 || !slug) return { ok: false, status: 404, error: 'not_configured' };
  if (!timingSafeEqual(digest(authorization ?? ''), digest(`Bearer ${secret}`))) return { ok: false, status: 401, error: 'unauthorised' };
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  if (b.slug !== slug) return { ok: false, status: 400, error: 'wrong_site' };
  return { ok: true, revision: typeof b.revision === 'string' ? b.revision.slice(0, 80) : null };
}
