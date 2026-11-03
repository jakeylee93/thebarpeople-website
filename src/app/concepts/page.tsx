import FilmPrototype from '@/components/film/FilmPrototype';
import { getSiteContent } from '@/content';
import { isPreviewToken } from '@/content/anyvendor';
import { openingView, quoteView } from '@/content/views';
import { STAFF_RATE } from '@/lib/visual-quote/catalogue';
import { formatPenceCompact } from '@/lib/visual-quote/money';

// /concepts — the opening film and Section Two together, as the homepage would
// flow. Words and photos come from the site content (bundled seed today,
// AnyVendor once connected; ?preview=<token> shows an AnyVendor draft).
// ?shirt=real shows the roundel as stitched today; default is the silver preview.
export default async function ConceptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { shirt, preview } = await searchParams;
  const token = typeof preview === 'string' && isPreviewToken(preview) ? preview : null;
  const { content, source } = await getSiteContent({ preview: token });
  // The staff rate is never content: it comes from the catalogue (anyOS later).
  const quote = quoteView(content, { staff_rate: formatPenceCompact(STAFF_RATE.unitPence) });
  return (
    <FilmPrototype
      initialShirt={typeof shirt === 'string' ? shirt : undefined}
      opening={openingView(content)}
      quote={quote}
      draft={source === 'draft'}
    />
  );
}
