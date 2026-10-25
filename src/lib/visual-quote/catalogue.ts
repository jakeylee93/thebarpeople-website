// Seed catalogue for the visual quote-builder PROTOTYPE.
//
// Nothing here is The Bar People's live catalogue. Every option carries:
//   - a seed id the website uses, plus platformId: null until it is matched
//     read-only against the existing anyOS catalogue (not done yet);
//   - a price that is either AUTHORISED (confirmed by Jake, with the source)
//     or PENDING. Pending prices are shown as "to confirm" and never as £0.
// Old prices published on thebarpeople.co.uk (2024) are kept only as a
// reference for reconciliation. They are stale and are never charged.

import type { Pence } from './money.ts';

export type ImageKind = 'photo' | 'sketch' | 'illustration';

export interface ImageRef {
  src: string;
  alt: string;
  kind: ImageKind;
  width: number;
  height: number;
  /** Honest note shown with the image where it could otherwise mislead. */
  note?: string;
  /** object-position for crops, e.g. '50% 12%' to keep a face in frame. */
  focal?: string;
}

export type Price =
  | { status: 'authorised'; unitPence: Pence; source: string }
  | { status: 'pending'; lastPublished?: { text: string; where: string } };

interface SeedBase {
  id: string;
  /** anyOS catalogue id once reconciled read-only. */
  platformId: string | null;
  name: string;
  detail: string;
  price: Price;
}

export interface BarOption extends SeedBase {
  size: string;
  shape: string;
  image: ImageRef;
}

export type GlassGlyph =
  | 'highball' | 'wine' | 'flute' | 'martini' | 'margarita'
  | 'gin' | 'whisky' | 'pint' | 'half-pint' | 'shot';

export interface GlassOption extends SeedBase {
  glyph: GlassGlyph;
  /** Shown first; the rest sit behind "More glasses". */
  common: boolean;
}

export interface CountedOption extends SeedBase {
  unit: string;
  unitPlural: string;
}

export type IncludedCategory = 'bar' | 'staff' | 'glassware' | 'ice';

export interface DrinksPackage extends SeedBase {
  pours: string[];
  /** Separately priced categories this package already covers — never charged twice. */
  includes: IncludedCategory[];
  image: ImageRef;
  draft: true;
}

export interface ExtraOption extends SeedBase {
  image?: ImageRef;
}

const PENDING: Price = { status: 'pending' };
const SITE_2024 = 'thebarpeople.co.uk glass hire list (2024, stale)';

const sketch = (src: string, alt: string): ImageRef => ({ src, alt, kind: 'sketch', width: 2897, height: 1890 });
const photo = (src: string, alt: string, width = 1024, height = 769, note?: string): ImageRef => ({
  src, alt, kind: 'photo', width, height, ...(note ? { note } : {}),
});

// ─── Bars ─── (the six seed choices Jake gave; sizes/shapes to confirm) ───

export const BARS: BarOption[] = [
  {
    id: 'bar-1-5m', platformId: null, name: '1.5m bar', size: '1.5m · 5ft', shape: 'Compact, single front',
    detail: 'A compact bar for smaller spaces.', price: PENDING,
    image: sketch('/images/bars/compact-5ft.png', 'Line sketch of the compact 1.5 metre bar'),
  },
  {
    id: 'bar-3m', platformId: null, name: '3m bar', size: '3m · 10ft', shape: 'Straight run',
    detail: 'A straight bar with a long serving front.', price: PENDING,
    image: sketch('/images/bars/straight-10ft.png', 'Line sketch of the straight 3 metre bar'),
  },
  {
    id: 'bar-4-5m', platformId: null, name: '4.5m bar', size: '4.5m · 15ft', shape: 'Front with angled returns',
    detail: 'A wide front that wraps round at both ends.', price: PENDING,
    image: sketch('/images/bars/open-island-15ft.png', 'Line sketch of the 4.5 metre bar with angled returns'),
  },
  {
    id: 'bar-horseshoe', platformId: null, name: 'Horseshoe', size: 'Size to confirm', shape: 'U-shaped',
    detail: 'Serves on three sides.', price: PENDING,
    image: sketch('/images/bars/horseshoe-small.png', 'Line sketch of the horseshoe bar'),
  },
  {
    id: 'bar-full-horseshoe', platformId: null, name: 'Full horseshoe', size: 'Size to confirm', shape: 'Large U, long sides',
    detail: 'Our largest seeded layout, for busy parties.', price: PENDING,
    image: sketch('/images/bars/horseshoe-large.png', 'Line sketch of the full horseshoe bar'),
  },
  {
    id: 'bar-curved-mirror', platformId: null, name: 'Curved mirror', size: 'Size to confirm', shape: 'Curved, mirror-panelled front',
    detail: 'A curved front that reflects the room.', price: PENDING,
    image: {
      src: '/images/visual-quote/curved-mirror-sketch.svg',
      alt: 'Line illustration of a curved bar with mirror panels',
      kind: 'illustration', width: 2897, height: 1890,
      note: 'Illustration only — a photo of the curved mirror bar is still needed',
    },
  },
];

/** Real photos of Bar People bars at events — shown as a mood strip, not matched to a size. */
export const BAR_PHOTOS: ImageRef[] = [
  photo('/images/events/mirror-bar.jpg', 'Mirror-fronted bar set up on a garden patio'),
  photo('/images/events/marquee-bar.jpg', 'Compact white bar on a lawn'),
  photo('/images/events/salesforce-bar-2.jpg', 'Long white bar with angled corners in an office event space'),
  photo('/images/events/love-mirror.jpg', 'Bar with mirrored LOVE letters on its front', 1000, 1000),
];

// ─── Glassware ─── (types from the 2024 glass hire list; prices stale) ───

const glass = (id: string, name: string, glyph: GlassGlyph, common: boolean, published: string, detail: string): GlassOption => ({
  id, platformId: null, name, glyph, common, detail,
  price: { status: 'pending', lastPublished: { text: published, where: SITE_2024 } },
});

export const GLASSES: GlassOption[] = [
  glass('glass-highball', '12oz highball', 'highball', true, '£0.60', 'Long drinks, spritzes, soft drinks'),
  glass('glass-wine', 'Wine glass', 'wine', true, '£0.60', 'Red, white and rosé'),
  glass('glass-flute', 'Champagne flute', 'flute', true, '£0.60', 'Fizz and toasts'),
  glass('glass-martini', 'Martini glass', 'martini', true, '£0.75', 'Martinis and short cocktails'),
  glass('glass-whisky', 'Whisky tumbler', 'whisky', true, '£0.65', 'Spirits over ice, old fashioneds'),
  glass('glass-gin', 'Gin bowl', 'gin', true, '£0.80', 'Gin and tonic, Spanish style'),
  glass('glass-margarita', 'Margarita glass', 'margarita', false, '£0.80', 'Margaritas and frozen drinks'),
  glass('glass-pint', 'Pint glass', 'pint', false, '£0.50', 'Beer and cider'),
  glass('glass-half-pint', 'Half-pint glass', 'half-pint', false, '£0.50', 'Smaller beers'),
  glass('glass-shot', 'Shot glass', 'shot', false, '£0.50', 'Shots and tasters'),
];

// ─── Ice & storage ───

export const ICE_AND_STORAGE: CountedOption[] = [
  { id: 'ice-bag', platformId: null, name: 'Bagged ice', unit: 'bag', unitPlural: 'bags', detail: 'Bag size to confirm', price: PENDING },
  { id: 'igloo-box', platformId: null, name: 'Igloo cool box', unit: 'box', unitPlural: 'boxes', detail: 'Keeps ice and bottles cold behind the bar', price: PENDING },
  { id: 'bar-fridge', platformId: null, name: 'Bar fridge', unit: 'fridge', unitPlural: 'fridges', detail: 'Needs a power socket close to the bar', price: PENDING },
];

// ─── Staff ─── (the only authorised price so far) ───

export const STAFF_RATE = {
  id: 'staff-bartender',
  platformId: null as string | null,
  name: 'Bartenders',
  unitPence: 2800 as Pence,
  source: 'Jake Lee, direct instruction 25 Oct 2026: £28 per person per hour plus VAT',
};

/** From the FAQ on thebarpeople.co.uk: "one bartender per 50-75 guests". Guidance only. */
export const STAFF_GUIDE = { guestsPerBartenderLow: 50, guestsPerBartenderHigh: 75 };

export function suggestedStaff(guests: number | null): { low: number; high: number } | null {
  if (!guests || guests < 1) return null;
  return {
    low: Math.max(1, Math.ceil(guests / STAFF_GUIDE.guestsPerBartenderHigh)),
    high: Math.max(1, Math.ceil(guests / STAFF_GUIDE.guestsPerBartenderLow)),
  };
}

// ─── Drinks packages ─── (DRAFT menus — contents, inclusions and prices to confirm) ───
// Inclusions follow the all-inclusive description on thebarpeople.co.uk:
// "all drinks, professional staff, glassware, ice, and setup".

export const DRINKS_PACKAGES: DrinksPackage[] = [
  {
    id: 'drinks-all-inclusive', platformId: null, draft: true, name: 'All-inclusive bar',
    detail: 'Unlimited drinks for your guests for the hours you choose.',
    pours: ['Beer', 'Wine', 'Spirits and mixers', 'Soft drinks', 'Garnishes'],
    includes: ['bar', 'staff', 'glassware', 'ice'], price: PENDING,
    image: photo('/images/events/garden-bar.jpg', 'Bar set with rows of clean glasses on a garden terrace'),
  },
  {
    id: 'drinks-cocktails', platformId: null, draft: true, name: 'All-inclusive with cocktails',
    detail: 'The all-inclusive bar plus a short cocktail menu.',
    pours: ['Everything in the all-inclusive bar', 'Martinis', 'Daiquiris', 'Piña coladas'],
    includes: ['bar', 'staff', 'glassware', 'ice'], price: PENDING,
    image: photo('/images/events/martini-daiquiri.jpg', 'A strawberry coupe on a white bar with copper tools'),
  },
  {
    id: 'drinks-alcohol-free', platformId: null, draft: true, name: 'Alcohol-free bar',
    detail: 'Mocktails and soft drinks, served properly.',
    pours: ['Mocktails', 'Soft drinks', 'Garnishes'],
    includes: ['bar', 'staff', 'glassware', 'ice'], price: PENDING,
    image: photo('/images/film/counter-copper.jpg', 'A white bar with a copper tray of rosemary, a mixing glass and rows of clean glasses', 2305, 1537),
  },
];

// ─── Extras ─── (priced on request) ───

export const EXTRAS: ExtraOption[] = [
  { id: 'extra-marquee', platformId: null, name: 'Marquee', detail: 'Cover for the bar or the whole party', price: PENDING },
  { id: 'extra-furniture', platformId: null, name: 'Furniture', detail: 'Poseur tables, stools, lounge pieces', price: PENDING },
  { id: 'extra-party-help', platformId: null, name: 'Party help', detail: 'Extra hands on the night', price: PENDING },
];

export const DELIVERY = {
  id: 'delivery', platformId: null as string | null, name: 'Delivery, set-up & collection',
  detail: 'Confirmed for your postcode',
};

/**
 * Published on thebarpeople.co.uk; resolves to the WhatsApp Business profile
 * "The Bar People" (checked 25 Oct 2026). Not yet confirmed it reaches Jake
 * directly. Shown only as a link the guest chooses to tap — never opened or
 * sent automatically.
 */
export const WHATSAPP_LINK = 'https://wa.me/message/GAHJS6QVNJWQK1';

// ─── Lookups ───

export const findBar = (id: string | null) => BARS.find((b) => b.id === id) ?? null;
export const findPackage = (id: string | null) => DRINKS_PACKAGES.find((p) => p.id === id) ?? null;
