// The commissioned homepage (/new) as editable AnyVendor content.
//
// Three things live here, kept together so they cannot drift apart:
//   NEW_HOME_SECTIONS   the manifest sections AnyVendor's editor shows;
//   homeSeed()          the seed content, generated from the page's own
//                       bundled content (src/components/new-home/data.ts);
//   homeView(content)   the reverse: content in, the exact shape the page's
//                       components render.
// A test checks homeView(homeSeed()) equals the bundled page, so rendering
// through this adapter with the seed changes nothing anyone can see.
//
// NOT content, and never sent to AnyVendor: prices and VAT (the party
// sticker's price is filled from src/lib/quote/prices.ts), everything in the
// quote builder, the WhatsApp link, the builder links (#build…) and the
// layout, motion and section designs.

import type { Field, FieldValue, ImageValue, LinkValue, ListRow, Section, SiteContent } from './contract.ts';
import { safeUrl } from './contract.ts';
import {
  CHRISTMAS, CLIENT_LOGOS, CONTACTS, CORPORATE, FEED, HERO_COPY, HERO_SLIDES, HOW_IT_WORKS, INSTAGRAM, MARQUEE,
  PARTIES, SECTIONS, SOCIALS, TEAM, TEAM_FEED, WEDDINGS,
  type ClientLogo, type FeedItem, type HeroSlide, type HowTopic, type Photo,
} from '../components/new-home/data.ts';

// ─── What the page renders ──────────────────────────────────────────────────

export type HomeSectionId = (typeof SECTIONS)[number]['id'];
export interface HomeSection { id: HomeSectionId; label: string; tone: 'light' | 'dark' }

/** Sections an editor can add, hide and reorder. The header film and the footer are fixed first and last. */
export const MOVABLE_SECTIONS = ['christmas', 'corporate', 'weddings', 'parties', 'team', 'marquees', 'gallery'] as const;
export type MovableSectionId = (typeof MOVABLE_SECTIONS)[number];

/** A movable section as the editor sees it: listed chapters first, in their order, then any taken off the page. */
export interface HomeChapter { id: MovableSectionId; label: string; tone: 'light' | 'dark'; visible: boolean }

export interface HomeContent {
  /** In page order, hidden ones removed. Always starts with "home" and ends with "contact". */
  sections: HomeSection[];
  /** Every movable section, shown or not (the editing preview can show a hidden one without a reload). */
  chapters: HomeChapter[];
  hero: { eyebrow: string; headline: string; sub: string; cta: string; small: string; sheetEyebrow: string; sheetTitle: string; slides: HeroSlide[] };
  christmas: { eyebrow: string; titleLines: [string, string]; body: string; cta: string; small: string; image: Photo; prints: { left: string[]; right: string[] } };
  corporate: {
    eyebrow: string; title: string; body: string; steps: { title: string; detail: string }[]; cta: string; call: string; trusted: string;
    photos: { src: string; alt: string; focus: string }[]; logos: ClientLogo[];
  };
  weddings: { eyebrow: string; title: [string, string]; body: string; points: string[]; cta: string; image: Photo; prints: { src: string; alt: string }[] };
  parties: { eyebrow: string; title: [string, string]; body: string; points: string[]; cta: string; stickerLabel: string; image: Photo };
  team: { eyebrow: string; title: string; body: string; cta: string; cards: FeedItem[] };
  marquee: { eyebrow: string; title: string; body: string; items: string[]; cta: string; note: string };
  gallery: { eyebrow: string; handle: string; follow: { href: string; label: string }; cards: FeedItem[] };
  how: {
    title: string; steps: { title: string; body: string }[]; includedTitle: string; cta: string;
    topics: Record<HowTopic, { label: string; included: string[] }>;
  };
  footer: {
    exploreHeading: string; contactHeading: string; followHeading: string;
    contacts: { name: string; email: string; phone: string; tel: string }[];
    socials: { href: string; label: string }[];
  };
}

const TONES = Object.fromEntries(SECTIONS.map((s) => [s.id, s.tone])) as Record<HomeSectionId, 'light' | 'dark'>;
const LABELS = Object.fromEntries(SECTIONS.map((s) => [s.id, s.label])) as Record<HomeSectionId, string>;

/** The page exactly as the code ships it. */
export const BUNDLED_HOME: HomeContent = {
  sections: SECTIONS.map((s) => ({ id: s.id, label: s.label, tone: s.tone })),
  chapters: MOVABLE_SECTIONS.map((id) => ({ id, label: LABELS[id], tone: TONES[id], visible: true })),
  hero: { ...HERO_COPY, sheetEyebrow: 'Instant quote', sheetTitle: 'Get an instant quote', slides: HERO_SLIDES },
  christmas: {
    eyebrow: CHRISTMAS.eyebrow, titleLines: [CHRISTMAS.titleLines[0], CHRISTMAS.titleLines[1]], body: CHRISTMAS.body, cta: CHRISTMAS.cta,
    small: CHRISTMAS.small, image: CHRISTMAS.image, prints: { left: [...CHRISTMAS.prints.left], right: [...CHRISTMAS.prints.right] },
  },
  corporate: {
    eyebrow: CORPORATE.eyebrow, title: CORPORATE.title, body: CORPORATE.body, steps: CORPORATE.steps.map((s) => ({ ...s })), cta: CORPORATE.cta,
    call: CORPORATE.call, trusted: CORPORATE.trusted, photos: CORPORATE.photos.map((p) => ({ ...p })), logos: CLIENT_LOGOS.map((l) => ({ ...l })),
  },
  weddings: {
    eyebrow: WEDDINGS.eyebrow, title: [WEDDINGS.title[0], WEDDINGS.title[1]], body: WEDDINGS.body, points: [...WEDDINGS.points], cta: WEDDINGS.cta,
    image: WEDDINGS.image, prints: WEDDINGS.prints.map((p) => ({ ...p })),
  },
  parties: {
    eyebrow: PARTIES.eyebrow, title: [PARTIES.title[0], PARTIES.title[1]], body: PARTIES.body, points: [...PARTIES.points], cta: PARTIES.cta,
    stickerLabel: PARTIES.stickerLabel, image: PARTIES.image,
  },
  team: { ...TEAM, cards: TEAM_FEED },
  marquee: { eyebrow: MARQUEE.eyebrow, title: MARQUEE.title, body: MARQUEE.body, items: [...MARQUEE.items], cta: MARQUEE.cta, note: MARQUEE.note },
  gallery: { eyebrow: 'On Instagram', handle: INSTAGRAM.handle, follow: { href: INSTAGRAM.href, label: 'Follow' }, cards: FEED },
  how: {
    title: HOW_IT_WORKS.title, steps: HOW_IT_WORKS.steps.map((s) => ({ ...s })), includedTitle: HOW_IT_WORKS.includedTitle, cta: HOW_IT_WORKS.cta,
    topics: {
      corporate: { label: HOW_IT_WORKS.topics.corporate.label, included: [...HOW_IT_WORKS.topics.corporate.included] },
      weddings: { label: HOW_IT_WORKS.topics.weddings.label, included: [...HOW_IT_WORKS.topics.weddings.included] },
      parties: { label: HOW_IT_WORKS.topics.parties.label, included: [...HOW_IT_WORKS.topics.parties.included] },
    },
  },
  footer: {
    exploreHeading: 'Explore', contactHeading: 'Talk to us', followHeading: 'Follow',
    contacts: CONTACTS.map((c) => ({ ...c })), socials: SOCIALS.map((s) => ({ ...s })),
  },
};

// ─── Manifest sections ──────────────────────────────────────────────────────

const text = (key: string, label: string, max = 120, extra: Partial<Field> = {}): Field => ({ key, label, type: 'text', max, ...extra });
const area = (key: string, label: string, max = 400, extra: Partial<Field> = {}): Field => ({ key, label, type: 'textarea', max, ...extra });
const image = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: 'image', ...extra });
const list = (key: string, label: string, max: number, fields: Field[], extra: Partial<Field> = {}): Field => ({ key, label, type: 'list', max, fields, ...extra });
const focus = (key: string, label: string): Field =>
  text(key, label, 20, { help: 'Which part of the photo to keep in frame, e.g. "50% 30%" (across, down). Leave blank for the centre.' });
const VIDEO_HELP = 'A site file path starting with / or an https:// link to an MP4. No sound is played.';
const video = (key: string, label: string): Field => text(key, label, 300, { help: VIDEO_HELP });
const points = (key: string, label: string, max = 6): Field => list(key, label, max, [text('point', 'Line', 80)]);
const BUTTON_HELP = 'The words on the button. Where it goes is fixed: it opens the quote builder.';

/** A photo or a silent clip, as one same-shape card. */
const cards = (key: string, label: string, max: number): Field =>
  list(key, label, max, [
    { key: 'kind', label: 'Photo or video', type: 'select', options: ['image', 'video'] },
    image('picture', 'Photo (or the still shown before a video plays)'),
    video('video_file', 'Video file (videos only)'),
  ], { help: 'Shown in this order. Every card is cropped to the same upright shape.' });

export const NEW_HOME_SECTIONS: Section[] = [
  {
    // Same shape as AnyVendor's other bespoke sites: one list, one choice per row, a visible switch.
    key: 'page',
    label: 'New homepage · sections',
    help: 'Add, hide and reorder the sections of the new homepage. The header film is always first and the footer always last.',
    fields: [
      list('chapters', 'Sections, in page order', MOVABLE_SECTIONS.length, [
        { key: 'chapter', label: 'Section', type: 'select', options: [...MOVABLE_SECTIONS] },
        { key: 'visible', label: 'Show on the page', type: 'boolean' },
      ], { help: 'Move to reorder. Hide a section without losing it. Remove a row to take it off; add it back at any time.' }),
    ],
  },
  {
    key: 'nh_menu',
    label: 'New homepage · menu names',
    help: 'What each section is called in the menu, the footer and the dots at the side.',
    fields: MOVABLE_SECTIONS.map((id) => text(`${id}_label`, LABELS[id], 30)),
  },
  {
    key: 'nh_hero',
    label: 'New homepage · header',
    fields: [
      text('eyebrow', 'Small heading', 80),
      text('headline', 'Headline', 80, { required: true }),
      area('sub', 'Line under the headline', 200),
      text('cta_label', 'Button', 40, { required: true, help: BUTTON_HELP }),
      text('small', 'Small print under the button', 80),
      text('sheet_eyebrow', 'Phone panel: small heading', 40),
      text('sheet_title', 'Phone panel: heading', 60),
      list('slides', 'Film and photos', 8, [
        { key: 'kind', label: 'Photo or film', type: 'select', options: ['image', 'video'] },
        image('picture', 'Photo (or the still shown before a film plays)'),
        video('video_file', 'Film file (films only)'),
        video('phone_video_file', 'Upright film for phones (optional)'),
        image('phone_picture', 'Still for the phone film (optional)'),
        { key: 'seconds', label: 'Film length in seconds', type: 'number', help: 'How long the film stays up before the next slide. Ignored when the film is the only slide.' },
        focus('focus_desktop', 'Framing on desktop'),
        focus('focus_phone', 'Framing on phones'),
      ], { required: true, help: 'One film on its own plays on a loop. Add photos after it and the header becomes a slideshow.' }),
    ],
  },
  {
    key: 'nh_christmas',
    label: 'New homepage · Christmas',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('title_line_1', 'Headline, first line', 40, { required: true }),
      text('title_line_2', 'Headline, second line', 40),
      area('body', 'Text', 240),
      text('cta_label', 'Button', 40, { required: true, help: 'The words on the button. It opens the quote builder dressed for Christmas.' }),
      text('small', 'Line at the foot', 60),
      image('picture', 'Background photo', { required: true }),
      focus('focus_desktop', 'Framing on desktop'),
      focus('focus_phone', 'Framing on phones'),
      list('prints_left', 'Left snapshot: photos it shuffles through', 8, [image('photo', 'Photo')]),
      list('prints_right', 'Right snapshot: photos it shuffles through', 8, [image('photo', 'Photo')]),
    ],
  },
  {
    key: 'nh_corporate',
    label: 'New homepage · Corporate',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('title', 'Headline', 60, { required: true }),
      area('body', 'Text', 300),
      list('steps', 'Steps', 4, [text('title', 'Step', 40), text('detail', 'Detail', 100)]),
      text('cta_label', 'Button', 40, { required: true, help: BUTTON_HELP }),
      text('call_label', 'Words before the phone number', 40),
      text('trusted_label', 'Heading beside the client logos', 30),
      list('photos', 'Photos: the first is the large one', 4, [image('photo', 'Photo'), focus('focus', 'Framing')], { required: true }),
      list('logos', 'Client logos', 16, [
        text('name', 'Client', 60),
        image('logo', 'Logo (a one-colour SVG works best)'),
        { key: 'ratio', label: 'Logo width ÷ height', type: 'number', help: 'For example 2.4 for a wide logo. Keeps the logos looking the same weight.' },
      ]),
    ],
  },
  {
    key: 'nh_weddings',
    label: 'New homepage · Weddings',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('title_lead', 'Headline, first part', 40, { required: true }),
      text('title_accent', 'Headline, part in italic script', 30),
      area('body', 'Text', 300),
      points('points', 'Tick points', 4),
      text('cta_label', 'Button', 40, { required: true, help: BUTTON_HELP }),
      image('picture', 'Main photo', { required: true }),
      focus('focus_desktop', 'Framing on desktop'),
      focus('focus_phone', 'Framing on phones'),
      list('prints', 'Small prints across the corner', 2, [image('photo', 'Photo')]),
    ],
  },
  {
    key: 'nh_parties',
    label: 'New homepage · Parties',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('title_lead', 'Headline, first part', 30, { required: true }),
      text('title_accent', 'Headline, part that glows', 30),
      area('body', 'Text', 300),
      points('points', 'Tick points', 4),
      text('cta_label', 'Button', 40, { required: true, help: BUTTON_HELP }),
      text('sticker_label', 'Words on the sticker', 20, { help: 'The amount on the sticker is not edited here: it is always the smallest bar in the quote builder.' }),
      image('picture', 'Photo', { required: true }),
      focus('focus_desktop', 'Framing on desktop'),
      focus('focus_phone', 'Framing on phones'),
    ],
  },
  {
    key: 'nh_team',
    label: 'New homepage · Team',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('title', 'Headline', 60, { required: true }),
      area('body', 'Text (desktop only)', 160),
      text('cta_label', 'Button', 40, { required: true, help: BUTTON_HELP }),
      cards('cards', 'Team photos and clips', 12),
    ],
  },
  {
    key: 'nh_marquee',
    label: 'New homepage · Marquee packages',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('title', 'Headline', 60, { required: true }),
      area('body', 'Text', 240),
      list('items', 'What a package can include', 8, [text('item', 'Item', 40)]),
      text('cta_label', 'Button', 40, { required: true, help: 'The words on the button. It starts a quote with a marquee switched on.' }),
      area('note', 'Small print', 200),
    ],
  },
  {
    key: 'nh_gallery',
    label: 'New homepage · Gallery',
    fields: [
      text('eyebrow', 'Small heading', 40),
      text('handle', 'Headline', 40, { required: true }),
      { key: 'follow_link', label: 'Follow button', type: 'link' },
      cards('cards', 'Gallery photos and clips', 12),
    ],
  },
  {
    key: 'nh_how',
    label: 'New homepage · "How it works" pop-up',
    fields: [
      text('title', 'Heading', 40, { required: true }),
      list('steps', 'Steps', 4, [text('title', 'Step', 60), text('body', 'Detail', 140)]),
      text('included_title', 'Heading above the list', 40),
      text('cta_label', 'Button', 40, { required: true, help: BUTTON_HELP }),
      text('corporate_label', 'Corporate: small heading', 40),
      list('corporate_included', 'Corporate: what you can include', 8, [text('item', 'Line', 100)]),
      text('weddings_label', 'Weddings: small heading', 40),
      list('weddings_included', 'Weddings: what you can include', 8, [text('item', 'Line', 100)]),
      text('parties_label', 'Parties: small heading', 40),
      list('parties_included', 'Parties: what you can include', 8, [text('item', 'Line', 100)]),
    ],
  },
  {
    key: 'nh_footer',
    label: 'New homepage · Footer',
    fields: [
      text('explore_heading', 'Menu column heading', 30),
      text('contact_heading', 'Contact column heading', 30),
      text('follow_heading', 'Social column heading', 30),
      list('contacts', 'Who to contact', 4, [
        text('name', 'Name', 60),
        { key: 'email', label: 'Email (mailto:)', type: 'link' },
        { key: 'phone', label: 'Phone (tel:)', type: 'link' },
      ], { required: true }),
      list('socials', 'Social links', 6, [{ key: 'link', label: 'Link', type: 'link' }]),
    ],
  },
];

export const NEW_HOME_SECTION_KEYS = NEW_HOME_SECTIONS.map((s) => s.key);

// ─── Bundled page → seed content ────────────────────────────────────────────

const img = (src: string, alt: string): ImageValue => ({ src, alt });
const NO_IMAGE: ImageValue = { src: '', alt: '' };
const cardRow = (c: FeedItem): ListRow =>
  c.kind === 'image' ? { kind: 'image', picture: img(c.src, c.alt), video_file: '' } : { kind: 'video', picture: img(c.poster, c.alt), video_file: c.src };
/** Decorative photos carry no alt text on the page, but AnyVendor's library wants each picture described. */
const PRINT_ALT = 'Snapshot from a Bar People event';

export function homeSeed(home: HomeContent = BUNDLED_HOME): SiteContent {
  const h = home;
  return {
    page: { chapters: h.chapters.map((c) => ({ chapter: c.id, visible: c.visible })) },
    nh_menu: Object.fromEntries(h.chapters.map((c) => [`${c.id}_label`, c.label])),
    nh_hero: {
      eyebrow: h.hero.eyebrow, headline: h.hero.headline, sub: h.hero.sub, cta_label: h.hero.cta, small: h.hero.small,
      sheet_eyebrow: h.hero.sheetEyebrow, sheet_title: h.hero.sheetTitle,
      slides: h.hero.slides.map((s): ListRow => s.kind === 'image'
        ? { kind: 'image', picture: img(s.src, s.alt), video_file: '', phone_video_file: '', phone_picture: NO_IMAGE, seconds: 0, focus_desktop: s.focus.desktop, focus_phone: s.focus.phone }
        : {
            kind: 'video', picture: img(s.poster, s.alt), video_file: s.src, phone_video_file: s.phone?.src ?? '',
            phone_picture: s.phone ? img(s.phone.poster, s.alt) : NO_IMAGE, seconds: s.seconds, focus_desktop: s.focus.desktop, focus_phone: s.focus.phone,
          }),
    },
    nh_christmas: {
      eyebrow: h.christmas.eyebrow, title_line_1: h.christmas.titleLines[0], title_line_2: h.christmas.titleLines[1], body: h.christmas.body,
      cta_label: h.christmas.cta, small: h.christmas.small, picture: img(h.christmas.image.src, h.christmas.image.alt),
      focus_desktop: h.christmas.image.focus.desktop, focus_phone: h.christmas.image.focus.phone,
      prints_left: h.christmas.prints.left.map((src) => ({ photo: img(src, PRINT_ALT) })),
      prints_right: h.christmas.prints.right.map((src) => ({ photo: img(src, PRINT_ALT) })),
    },
    nh_corporate: {
      eyebrow: h.corporate.eyebrow, title: h.corporate.title, body: h.corporate.body,
      steps: h.corporate.steps.map((s) => ({ title: s.title, detail: s.detail })),
      cta_label: h.corporate.cta, call_label: h.corporate.call, trusted_label: h.corporate.trusted,
      photos: h.corporate.photos.map((p) => ({ photo: img(p.src, p.alt), focus: p.focus })),
      logos: h.corporate.logos.map((l) => ({ name: l.name, logo: img(l.src, `${l.name} logo`), ratio: l.ratio })),
    },
    nh_weddings: {
      eyebrow: h.weddings.eyebrow, title_lead: h.weddings.title[0], title_accent: h.weddings.title[1], body: h.weddings.body,
      points: h.weddings.points.map((point) => ({ point })), cta_label: h.weddings.cta,
      picture: img(h.weddings.image.src, h.weddings.image.alt), focus_desktop: h.weddings.image.focus.desktop, focus_phone: h.weddings.image.focus.phone,
      prints: h.weddings.prints.map((p) => ({ photo: img(p.src, p.alt) })),
    },
    nh_parties: {
      eyebrow: h.parties.eyebrow, title_lead: h.parties.title[0], title_accent: h.parties.title[1], body: h.parties.body,
      points: h.parties.points.map((point) => ({ point })), cta_label: h.parties.cta, sticker_label: h.parties.stickerLabel,
      picture: img(h.parties.image.src, h.parties.image.alt), focus_desktop: h.parties.image.focus.desktop, focus_phone: h.parties.image.focus.phone,
    },
    nh_team: { eyebrow: h.team.eyebrow, title: h.team.title, body: h.team.body, cta_label: h.team.cta, cards: h.team.cards.map(cardRow) },
    nh_marquee: {
      eyebrow: h.marquee.eyebrow, title: h.marquee.title, body: h.marquee.body, items: h.marquee.items.map((item) => ({ item })),
      cta_label: h.marquee.cta, note: h.marquee.note,
    },
    nh_gallery: { eyebrow: h.gallery.eyebrow, handle: h.gallery.handle, follow_link: { href: h.gallery.follow.href, label: h.gallery.follow.label }, cards: h.gallery.cards.map(cardRow) },
    nh_how: {
      title: h.how.title, steps: h.how.steps.map((s) => ({ title: s.title, body: s.body })), included_title: h.how.includedTitle, cta_label: h.how.cta,
      corporate_label: h.how.topics.corporate.label, corporate_included: h.how.topics.corporate.included.map((item) => ({ item })),
      weddings_label: h.how.topics.weddings.label, weddings_included: h.how.topics.weddings.included.map((item) => ({ item })),
      parties_label: h.how.topics.parties.label, parties_included: h.how.topics.parties.included.map((item) => ({ item })),
    },
    nh_footer: {
      explore_heading: h.footer.exploreHeading, contact_heading: h.footer.contactHeading, follow_heading: h.footer.followHeading,
      contacts: h.footer.contacts.map((c) => ({ name: c.name, email: { href: `mailto:${c.email}`, label: c.email }, phone: { href: `tel:${c.tel}`, label: c.phone } })),
      socials: h.footer.socials.map((s) => ({ link: { href: s.href, label: s.label } })),
    },
  };
}

// ─── Content → what the page renders ────────────────────────────────────────

const str = (v: FieldValue | undefined): string => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '');
const num = (v: FieldValue | undefined): number => (typeof v === 'number' && Number.isFinite(v) ? v : 0);
const rows = (v: FieldValue | undefined): ListRow[] => (Array.isArray(v) ? v : []);
const pic = (v: FieldValue | undefined): ImageValue => {
  const o = v as ImageValue | undefined;
  return o && typeof o === 'object' && 'src' in o ? { src: safeUrl(o.src), alt: typeof o.alt === 'string' ? o.alt : '' } : { src: '', alt: '' };
};
const lnk = (v: FieldValue | undefined): LinkValue => {
  const o = v as LinkValue | undefined;
  return o && typeof o === 'object' && 'href' in o ? { href: safeUrl(o.href), label: typeof o.label === 'string' ? o.label : '' } : { href: '', label: '' };
};
/** A video path: site-relative or https, and it must be an MP4 or WebM. */
const vid = (v: FieldValue | undefined): string => {
  const url = safeUrl(str(v));
  return /\.(mp4|webm)$/i.test(url) ? url : '';
};
const spot = (v: FieldValue | undefined, fallback = '50% 50%'): string => {
  const s = str(v).trim().toLowerCase();
  return /^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(s) ? s : fallback;
};
const lines = (v: FieldValue | undefined, key: string): string[] => rows(v).map((r) => str(r[key])).filter(Boolean);

function cardsOf(v: FieldValue | undefined): FeedItem[] {
  const out: FeedItem[] = [];
  for (const r of rows(v)) {
    const picture = pic(r.picture);
    const file = vid(r.video_file);
    // A video needs its file and a still; without the file the still is shown as a photo.
    if (r.kind === 'video' && file && picture.src) out.push({ kind: 'video', src: file, poster: picture.src, alt: picture.alt });
    else if (picture.src) out.push({ kind: 'image', src: picture.src, alt: picture.alt });
  }
  return out;
}

/**
 * The page, from content. Anything unusable (an empty photo, an unknown
 * section, a film with no file) is skipped. Whatever the content says, the
 * header film is first, the footer is last, and the page is never empty.
 */
export function homeView(content: SiteContent, fallback: HomeContent = BUNDLED_HOME): HomeContent {
  const c = (key: string) => content[key] ?? {};
  const page = c('page'), menu = c('nh_menu'), hero = c('nh_hero'), xmas = c('nh_christmas'), corp = c('nh_corporate'), wed = c('nh_weddings');
  const party = c('nh_parties'), team = c('nh_team'), marquee = c('nh_marquee'), gallery = c('nh_gallery'), how = c('nh_how'), foot = c('nh_footer');

  const seen = new Set<string>();
  const chapters: HomeChapter[] = [];
  const chapter = (id: MovableSectionId, visible: boolean): HomeChapter => ({ id, label: str(menu[`${id}_label`]) || LABELS[id], tone: TONES[id], visible });
  for (const r of rows(page.chapters)) {
    const id = str(r.chapter) as MovableSectionId;
    if (!(MOVABLE_SECTIONS as readonly string[]).includes(id) || seen.has(id)) continue;
    seen.add(id);
    chapters.push(chapter(id, r.visible !== false));
  }
  const listed = chapters.length;
  // Sections taken off the page are still known (hidden), so the editor can add them back.
  for (const id of MOVABLE_SECTIONS) if (!seen.has(id)) chapters.push(chapter(id, false));
  const sections: HomeSection[] = [
    { id: 'home', label: LABELS.home, tone: TONES.home },
    ...chapters.slice(0, listed).filter((ch) => ch.visible).map(({ id, label, tone }) => ({ id, label, tone })),
    { id: 'contact', label: LABELS.contact, tone: TONES.contact },
  ];

  const slides: HeroSlide[] = [];
  for (const r of rows(hero.slides)) {
    const picture = pic(r.picture);
    if (!picture.src) continue;
    const focusOf = { desktop: spot(r.focus_desktop), phone: spot(r.focus_phone) };
    const file = vid(r.video_file);
    if (r.kind === 'video' && file) {
      const phoneFile = vid(r.phone_video_file);
      const phoneStill = pic(r.phone_picture);
      slides.push({
        kind: 'video', src: file, poster: picture.src, alt: picture.alt, focus: focusOf,
        seconds: Math.min(120, Math.max(3, num(r.seconds) || 10)),
        ...(phoneFile ? { phone: { src: phoneFile, poster: phoneStill.src || picture.src } } : {}),
      });
    } else {
      slides.push({ kind: 'image', src: picture.src, alt: picture.alt, focus: focusOf });
    }
  }

  const photo = (s: Record<string, FieldValue>, was: Photo): Photo => {
    const p = pic(s.picture);
    return p.src ? { src: p.src, alt: p.alt, focus: { desktop: spot(s.focus_desktop), phone: spot(s.focus_phone) } } : was;
  };
  const topic = (key: HowTopic) => ({ label: str(how[`${key}_label`]), included: lines(how[`${key}_included`], 'item') });
  const corporatePhotos = rows(corp.photos).map((r) => ({ ...pic(r.photo), focus: spot(r.focus) })).filter((p) => p.src);
  const contacts = rows(foot.contacts).map((r) => {
    const email = lnk(r.email), phone = lnk(r.phone);
    return { name: str(r.name), email: email.href.replace(/^mailto:/, ''), phone: phone.label, tel: phone.href.replace(/^tel:/, '') };
  }).filter((x) => x.name && (x.email || x.tel));

  return {
    sections,
    chapters,
    hero: {
      eyebrow: str(hero.eyebrow), headline: str(hero.headline), sub: str(hero.sub), cta: str(hero.cta_label), small: str(hero.small),
      sheetEyebrow: str(hero.sheet_eyebrow), sheetTitle: str(hero.sheet_title),
      slides: slides.length > 0 ? slides : fallback.hero.slides,
    },
    christmas: {
      eyebrow: str(xmas.eyebrow), titleLines: [str(xmas.title_line_1), str(xmas.title_line_2)], body: str(xmas.body), cta: str(xmas.cta_label),
      small: str(xmas.small), image: photo(xmas, fallback.christmas.image),
      prints: { left: rows(xmas.prints_left).map((r) => pic(r.photo).src).filter(Boolean), right: rows(xmas.prints_right).map((r) => pic(r.photo).src).filter(Boolean) },
    },
    corporate: {
      eyebrow: str(corp.eyebrow), title: str(corp.title), body: str(corp.body),
      steps: rows(corp.steps).map((r) => ({ title: str(r.title), detail: str(r.detail) })).filter((s) => s.title),
      cta: str(corp.cta_label), call: str(corp.call_label), trusted: str(corp.trusted_label),
      photos: corporatePhotos.length > 0 ? corporatePhotos : fallback.corporate.photos,
      logos: rows(corp.logos).map((r) => ({ name: str(r.name), src: pic(r.logo).src, ratio: Math.min(8, Math.max(0.3, num(r.ratio) || 1)) })).filter((l) => l.src && l.name),
    },
    weddings: {
      eyebrow: str(wed.eyebrow), title: [str(wed.title_lead), str(wed.title_accent)], body: str(wed.body), points: lines(wed.points, 'point'),
      cta: str(wed.cta_label), image: photo(wed, fallback.weddings.image), prints: rows(wed.prints).map((r) => pic(r.photo)).filter((p) => p.src),
    },
    parties: {
      eyebrow: str(party.eyebrow), title: [str(party.title_lead), str(party.title_accent)], body: str(party.body), points: lines(party.points, 'point'),
      cta: str(party.cta_label), stickerLabel: str(party.sticker_label), image: photo(party, fallback.parties.image),
    },
    team: { eyebrow: str(team.eyebrow), title: str(team.title), body: str(team.body), cta: str(team.cta_label), cards: cardsOf(team.cards) },
    marquee: {
      eyebrow: str(marquee.eyebrow), title: str(marquee.title), body: str(marquee.body), items: lines(marquee.items, 'item'),
      cta: str(marquee.cta_label), note: str(marquee.note),
    },
    gallery: { eyebrow: str(gallery.eyebrow), handle: str(gallery.handle), follow: lnk(gallery.follow_link), cards: cardsOf(gallery.cards) },
    how: {
      title: str(how.title), steps: rows(how.steps).map((r) => ({ title: str(r.title), body: str(r.body) })).filter((s) => s.title),
      includedTitle: str(how.included_title), cta: str(how.cta_label),
      topics: { corporate: topic('corporate'), weddings: topic('weddings'), parties: topic('parties') },
    },
    footer: {
      exploreHeading: str(foot.explore_heading), contactHeading: str(foot.contact_heading), followHeading: str(foot.follow_heading),
      contacts: contacts.length > 0 ? contacts : fallback.footer.contacts,
      socials: rows(foot.socials).map((r) => lnk(r.link)).filter((l) => l.href && l.label),
    },
  };
}

// ─── Live editing marks ─────────────────────────────────────────────────────

/** Lists whose rows carry a mark on the page (data-av-field="<list>.<row>.<field>"), and how many rows the page shows. */
const MARKED_LISTS: [list: string, shown: (h: HomeContent) => number][] = [
  ['nh_hero.slides', (h) => h.hero.slides.length],
  ['nh_corporate.steps', (h) => h.corporate.steps.length],
  ['nh_corporate.photos', (h) => h.corporate.photos.length],
  ['nh_corporate.logos', (h) => h.corporate.logos.length],
  ['nh_weddings.points', (h) => h.weddings.points.length],
  ['nh_weddings.prints', (h) => h.weddings.prints.length],
  ['nh_parties.points', (h) => h.parties.points.length],
  ['nh_team.cards', (h) => h.team.cards.length],
  ['nh_marquee.items', (h) => h.marquee.items.length],
  ['nh_gallery.cards', (h) => h.gallery.cards.length],
  ['nh_how.steps', (h) => h.how.steps.length],
  ['nh_how.corporate_included', (h) => h.how.topics.corporate.included.length],
  ['nh_how.weddings_included', (h) => h.how.topics.weddings.included.length],
  ['nh_how.parties_included', (h) => h.how.topics.parties.included.length],
  ['nh_footer.contacts', (h) => h.footer.contacts.length],
];
export const MARKED_LIST_KEYS = MARKED_LISTS.map(([key]) => key);

/**
 * Lists where the page skipped a row (an empty line, a missing photo), so the
 * row numbers on the page no longer match the content. The editing preview
 * takes the marks off these, rather than let a live edit land on the wrong row.
 */
export function shiftedLists(content: SiteContent, home: HomeContent): string[] {
  return MARKED_LISTS.filter(([key, shown]) => {
    const [section, field] = key.split('.');
    return rows(content[section]?.[field]).length !== shown(home);
  }).map(([key]) => key);
}
