import HomePage, { type EditLink } from './HomePage';
import HeroSlider from './HeroSlider';
import Christmas from './sections/Christmas';
import Corporate from './sections/Corporate';
import Weddings from './sections/Weddings';
import Parties from './sections/Parties';
import Team from './sections/Team';
import MarqueePackage from './sections/MarqueePackage';
import GalleryCarousel from './GalleryCarousel';
import PackageBuilder from './package/PackageBuilder';
import type { LoadedContent } from '@/content';
import { homeView, type HomeContent, type MovableSectionId } from '@/content/new-home';
import { PRICES } from '@/lib/quote/prices';
import { formatPenceCompact } from '@/lib/visual-quote/money';

// The commissioned homepage, from site content. /new renders it with the
// published (or bundled) content; /preview renders it with an AnyVendor draft.
// The designs, motion, quote builder and every price stay in code.
export default function HomeDocument({ loaded, edit }: {
  loaded: LoadedContent;
  /** Only the draft page, opened by the editor, passes this. */
  edit?: EditLink;
}) {
  const home = homeView(loaded.content);

  // Prices are never content: the party sticker shows the smallest bar from the quote builder's price list.
  const barFrom = formatPenceCompact(PRICES.barOneSection);
  const SECTION: Record<MovableSectionId, (h: HomeContent) => React.ReactNode> = {
    christmas: (h) => <Christmas data={h.christmas} />,
    corporate: (h) => <Corporate data={h.corporate} contact={h.footer.contacts[0]} />,
    weddings: (h) => <Weddings data={h.weddings} />,
    parties: (h) => <Parties data={h.parties} price={barFrom} />,
    team: (h) => <Team data={h.team} />,
    marquees: (h) => <MarqueePackage data={h.marquee} />,
    gallery: (h) => <GalleryCarousel data={h.gallery} />,
  };
  // The live page renders the sections that show. The editing preview renders
  // every section, hidden ones included, so the editor can bring one back at once.
  const shown = new Set<string>(home.sections.map((s) => s.id));
  const nodes: Partial<Record<MovableSectionId, React.ReactNode>> = {};
  for (const c of home.chapters) if (edit || shown.has(c.id)) nodes[c.id] = SECTION[c.id](home);

  return (
    <>
      <HomePage home={home} hero={<HeroSlider data={home.hero} />} nodes={nodes} source={loaded.source} revision={loaded.revision} edit={edit} />
      {loaded.source === 'draft' && (
        <p role="status" className="fixed bottom-3 left-3 z-50 rounded-full bg-[#ffd400] px-4 py-2 text-[13px] font-bold text-black shadow-lg">
          Draft preview: not published
        </p>
      )}
      <PackageBuilder />
    </>
  );
}
