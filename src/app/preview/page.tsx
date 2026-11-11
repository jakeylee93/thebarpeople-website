import { notFound } from 'next/navigation';
import '@/components/new-home/home.css';
import HomeDocument from '@/components/new-home/HomeDocument';
import type { EditLink } from '@/components/new-home/HomePage';
import { getDraftContent } from '@/content';
import { anyVendorConfig, editorOrigins, isPreviewToken } from '@/content/anyvendor';
import { homeView, shiftedLists } from '@/content/new-home';

// /preview?token=<draft token> — the commissioned homepage showing an AnyVendor
// draft. AnyVendor's editor frames it as /preview?token=<token>&av_edit=1.
//
// Strict: a missing, malformed or wrong token is a 404. It never falls back to
// published or bundled content. Read fresh on every request (the draft read is
// no-store), and the headers in next.config.ts keep it out of caches, search
// and referrers, and allow framing by the listed editor origins only.
export const dynamic = 'force-dynamic';

export default async function DraftPreviewPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token, av_edit: avEdit } = await searchParams;
  if (!isPreviewToken(token)) notFound();
  const loaded = await getDraftContent(token);
  if (!loaded) notFound();

  // The in-page editor link: only when the editor asked (av_edit=1) and an
  // editor origin has been switched on for this deployment. The token is never
  // handed to the page's scripts.
  const origins = editorOrigins();
  const cfg = anyVendorConfig();
  const edit: EditLink | undefined = avEdit === '1' && origins.length > 0 && cfg
    ? { slug: cfg.slug, origins, unmark: shiftedLists(loaded.content, homeView(loaded.content)) }
    : undefined;

  return <HomeDocument loaded={loaded} edit={edit} />;
}
