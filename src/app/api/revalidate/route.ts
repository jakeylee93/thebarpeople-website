import { revalidateTag } from 'next/cache';
import { CACHE_TAG } from '@/content/anyvendor';
import { checkRevalidate } from '@/content/revalidate';

// AnyVendor calls this when Jake publishes, so the site shows the new content
// straight away instead of within 60s. Inert until ANYVENDOR_REVALIDATE_SECRET
// and ANYVENDOR_SITE_SLUG are set on the server. It only expires the cached
// AnyVendor content; it never writes anywhere.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const check = checkRevalidate(request.headers.get('authorization'), body);
  if (!check.ok) return Response.json({ error: check.error }, { status: check.status });
  revalidateTag(CACHE_TAG, { expire: 0 });
  return Response.json({ revalidated: true, revision: check.revision });
}
