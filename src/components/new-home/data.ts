// Content for the new homepage (/new). Real Bar People photos throughout;
// the hero's first, second and fourth slides are 4K OpenArt clean-ups of real
// photos (see docs/new-homepage/README.md).

import { galleryImages } from '@/lib/constants';

/** The page scrolls inside this element, not the document (see SnapPage). */
export const SCROLLER_ID = 'nh-scroller';

/** One screen each, in page order. `tone` is what sits behind the section dots. */
export const SECTIONS = [
  { id: 'home', label: 'Home', tone: 'dark' },
  { id: 'christmas', label: 'Christmas', tone: 'dark' },
  { id: 'corporate', label: 'Corporate', tone: 'dark' },
  { id: 'weddings', label: 'Weddings', tone: 'light' },
  { id: 'parties', label: 'Parties', tone: 'light' },
  { id: 'video', label: 'See us in action', tone: 'dark' },
  { id: 'marquees', label: 'Marquees', tone: 'light' },
  { id: 'gallery', label: 'Gallery', tone: 'light' },
  { id: 'contact', label: 'Contact', tone: 'dark' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

const NAV_IDS: SectionId[] = ['corporate', 'weddings', 'parties', 'marquees', 'gallery'];

/** Header and footer links: jumps to sections of this page. */
export const NAV = SECTIONS.filter((s) => NAV_IDS.includes(s.id)).map((s) => ({ id: s.id, href: `#${s.id}`, label: s.label }));

/** Every "Build your package" button links here; the builder opens on this hash. */
export const BUILD_HREF = '#build';

export const CONTACTS = [
  { name: 'Jake', email: 'jake@thebarpeople.co.uk', phone: '07557 402200', tel: '+447557402200' },
  { name: 'Kim', email: 'kim@thebarpeople.co.uk', phone: '07724 601256', tel: '+447724601256' },
] as const;

export const SOCIALS = [
  { href: 'https://www.instagram.com/thebarpeople/', label: 'Instagram' },
  { href: 'https://www.facebook.com/thebarpeople', label: 'Facebook' },
] as const;

export const HERO_COPY = {
  eyebrow: 'Mobile bar hire · London & nationwide',
  headline: 'You bring the guests, we’ll bring the rest.',
  sub: 'Pick your bar, glassware, ice, fridges and staff, and watch your quote build as you go.',
  cta: 'Build your package',
  small: 'Takes about a minute · No obligation',
};

/** Object-position for each crop: desktop is a wide frame, phone a tall one. */
export interface Focus { desktop: string; phone: string }

export type HeroSlide =
  | { kind: 'image'; src: string; alt: string; focus: Focus }
  // A silent film with a still poster. It plays once through while its slide
  // is showing. `phone` is an upright cut for narrow screens.
  | {
      kind: 'video'; src: string; poster: string; alt: string; focus: Focus;
      /** How long the slide stays up: just under the film's length. */
      seconds: number;
      phone?: { src: string; poster: string };
    };

// The lawn photo is also the Weddings picture further down, so it comes late
// in the hero's rotation.
export const HERO_SLIDES: HeroSlide[] = [
  {
    kind: 'image', src: '/images/new-home/hero-cocktails.jpg',
    alt: 'A row of pink martinis with fresh pineapple wedges on a white bar',
    focus: { desktop: '50% 50%', phone: '52% 50%' },
  },
  // Eight shots from The Bar People's own promo films, joined with soft fades
  // (19 seconds). To open the page on the film instead, move it to the top.
  {
    kind: 'video', src: '/videos/new-home/hero-reel.mp4', poster: '/videos/new-home/hero-reel.jpg',
    phone: { src: '/videos/new-home/hero-reel-phone.mp4', poster: '/videos/new-home/hero-reel-phone.jpg' },
    alt: 'Bar People bartenders raising, pouring, shaking and serving cocktails',
    focus: { desktop: '50% 50%', phone: '50% 50%' },
    seconds: 18.5,
  },
  {
    kind: 'image', src: '/images/new-home/hero-balloons.jpg',
    alt: 'A white bar under big white balloons on a garden terrace',
    focus: { desktop: '50% 58%', phone: '48% 62%' },
  },
  {
    kind: 'image', src: '/images/film/shirt-pour.jpg',
    alt: 'A Bar People bartender pouring cocktails at a garden bar',
    focus: { desktop: '50% 40%', phone: '58% 45%' },
  },
  {
    kind: 'image', src: '/images/new-home/hero-lawn.jpg',
    alt: 'A white Bar People bar on a lawn, willow trees and a gazebo behind',
    focus: { desktop: '50% 62%', phone: '50% 70%' },
  },
  {
    kind: 'image', src: '/images/film/counter-copper.jpg',
    alt: 'Champagne flutes and copper bar tools on a white bar at dusk',
    focus: { desktop: '50% 55%', phone: '40% 60%' },
  },
];

export interface ClientLogo { name: string; src: string; /** width ÷ height of the artwork */ ratio: number }

/** Clients from the current site, as vector logos (sources in docs/new-homepage/README.md). */
export const CLIENT_LOGOS: ClientLogo[] = [
  { name: 'O2', src: '/images/clients/o2.svg', ratio: 1.02 },
  { name: 'Sky', src: '/images/clients/sky.svg', ratio: 1.63 },
  { name: 'Salesforce', src: '/images/clients/salesforce.svg', ratio: 1.43 },
  { name: 'Hewlett Packard Enterprise', src: '/images/clients/hpe.svg', ratio: 2.39 },
  { name: 'ITV2', src: '/images/clients/itv2.svg', ratio: 3.03 },
  { name: 'Boux Avenue', src: '/images/clients/boux-avenue.svg', ratio: 2.13 },
  { name: 'Batiste', src: '/images/clients/batiste.svg', ratio: 2.34 },
  { name: 'Bulb', src: '/images/clients/bulb.svg', ratio: 2.63 },
  { name: 'Superdrug', src: '/images/clients/superdrug.svg', ratio: 4.51 },
];

/** Logos look equally weighted when their areas match, not their heights. */
export function logoHeight(ratio: number, area = 2450): number {
  return Math.round(Math.min(40, Math.max(22, Math.sqrt(area / ratio))));
}

/** A photo and where to hold the crop (CSS object-position), phone then desktop. */
export interface Photo { src: string; alt: string; focus: Focus }

export const CHRISTMAS = {
  eyebrow: 'Christmas 2026',
  /** Two lines on a desktop; phones wrap it themselves. */
  titleLines: ['Christmas parties,', 'sorted.'],
  body: 'We bring the bar, the bartenders and the festive cocktails. You just bring the guests.',
  cta: 'Build your Christmas package',
  small: 'Book early for December.',
  image: {
    src: '/images/new-home/christmas.jpg',
    alt: 'A white bar dressed for Christmas with a garland, fairy lights and festive cocktails',
    focus: { desktop: '50% 45%', phone: '32% 50%' },
  } satisfies Photo,
};

export const CORPORATE = {
  eyebrow: 'Corporate events',
  title: 'A bar built around your brand.',
  body: 'Launches, staff parties and brand events. We put your artwork on the bar, then deliver it, set it up and serve.',
  points: [
    'Your brand on every panel, with a free artwork service',
    'Any size, from a 1.5m bar to a full island',
    'Bartenders and all-inclusive drinks',
  ],
  cta: 'Build your package',
  trusted: 'Trusted by',
  diagramCaption: 'Your artwork on every panel',
  image: {
    src: '/images/events/salesforce-bar.jpg',
    alt: 'A white bar with the Salesforce logo across its front panel, set up in an office',
    focus: { desktop: '48% 55%', phone: '48% 58%' },
  } satisfies Photo,
};

export const WEDDINGS = {
  eyebrow: 'Weddings',
  title: 'The bar for your big day.',
  body: 'A bar to suit your venue, the drinks you love and bartenders to serve them, in London and nationwide.',
  points: [
    'Classic white or mirror finish',
    'All-inclusive drinks, glassware and ice',
    'We deliver, set up and collect',
  ],
  cta: 'Build your package',
  image: {
    src: '/images/new-home/hero-lawn.jpg',
    alt: 'A white horseshoe bar on a lawn in front of a gazebo and willow trees',
    focus: { desktop: '50% 74%', phone: '50% 72%' },
  } satisfies Photo,
};

export const PARTIES = {
  eyebrow: 'Birthdays and private parties',
  title: 'Your party, our bar.',
  body: 'Birthdays, garden parties and get-togethers. Start with a 1.5m bar and add whatever the night needs.',
  points: [
    'Bars from a single 1.5m section',
    'Bartenders, drinks, glassware and ice',
    'Delivered, set up and collected for you',
  ],
  cta: 'Build your package',
  image: {
    src: '/images/events/special-occasions.jpg',
    alt: 'A neon sign reading Sip Sip Hooray on a leafy wall above a bar set with copper cups, under party balloons',
    focus: { desktop: '50% 42%', phone: '50% 45%' },
  } satisfies Photo,
};

export interface VideoClip { src: string; poster: string; alt: string }
export interface Still { src: string; alt: string; /** CSS object-position inside the tall card */ focus: string }

/**
 * Clips for the "See us in action" card: tall (9:16) videos, played one after
 * another with no sound. Cut from The Bar People's own promo films. To swap
 * one, replace its file or add a line here.
 */
export const VIDEO_CLIPS: VideoClip[] = [
  { src: '/videos/new-home/card-1-toast.mp4', poster: '/videos/new-home/card-1-toast.jpg', alt: 'A Bar People bartender tasting a cocktail under fairy lights' },
  { src: '/videos/new-home/card-2-pour.mp4', poster: '/videos/new-home/card-2-pour.jpg', alt: 'A cocktail being poured into a martini glass' },
  { src: '/videos/new-home/card-4-bubbles.mp4', poster: '/videos/new-home/card-4-bubbles.jpg', alt: 'Champagne flutes fizzing in the sun' },
  { src: '/videos/new-home/card-5-shimmer.mp4', poster: '/videos/new-home/card-5-shimmer.jpg', alt: 'Cocktails lined up on a shimmer bar on a terrace' },
  { src: '/videos/new-home/card-6-shaker.mp4', poster: '/videos/new-home/card-6-shaker.jpg', alt: 'A bartender shaking a cocktail' },
];

/** Shown in the card if there are no clips. */
export const VIDEO_STILLS: Still[] = [
  { src: '/images/film/shirt-pour.jpg', alt: 'A Bar People bartender pouring a cocktail into a row of martini glasses', focus: '82% 50%' },
  { src: '/images/events/martini-daiquiri.jpg', alt: 'A strawberry daiquiri beside copper cocktail shakers', focus: '64% 50%' },
  { src: '/images/events/alex.jpg', alt: 'A Bar People bartender holding out a pineapple cocktail', focus: '50% 50%' },
  { src: '/images/events/pina-colada.jpg', alt: 'A bartender finishing two tall piña coladas', focus: '56% 50%' },
];

export const VIDEO = {
  eyebrow: 'See us in action',
  title: 'Shaken, poured and served.',
  body: 'A look behind the bar with our bartenders.',
  cta: 'Build your package',
  /** A soft, black-and-white backdrop behind the card; too blurred to pick anyone out. */
  backdrop: '/images/events/boux-avenue.jpg',
};

export const MARQUEE = {
  eyebrow: 'Packages',
  title: 'The marquee package',
  body: 'One quote for the marquee, the bar and everything that goes with it.',
  items: ['Marquee', 'Bar', 'Bartenders', 'Drinks', 'Glassware', 'Ice and fridges'],
  cta: 'Build a marquee package',
  // Starts the quote at step 1 with the marquee switched on (builder/route.ts: MARQUEE_PACKAGE_HREF).
  href: '#build/marquee-package',
  note: 'Furniture, flooring, lighting and crockery can be added with a marquee.',
};

export type HowTopic = 'corporate' | 'weddings' | 'parties';

/** The shared "How it works" sheet: the same three steps, one list per section. */
export const HOW_IT_WORKS = {
  title: 'How it works',
  steps: [
    { title: 'Build your package', body: 'Pick your bar, drinks, glassware and team, and see the price as you go.' },
    { title: 'We confirm the details', body: 'We get in touch and go through everything with you.' },
    { title: 'We deliver, set up, serve and collect', body: 'You just bring the guests.' },
  ],
  includedTitle: 'What you can include',
  topics: {
    corporate: {
      label: 'Corporate events',
      included: [
        'A bar in your branding, with a free artwork service',
        'Any size, from a 1.5m bar to a full island',
        'Bartenders',
        'All-inclusive drinks: beer, wine, spirits and soft drinks',
        'Glassware, ice and fridges',
      ],
    },
    weddings: {
      label: 'Weddings',
      included: [
        'A bar in classic white or mirror',
        'Bartenders',
        'All-inclusive drinks: beer, wine, spirits and soft drinks',
        'Glassware, ice and fridges',
        'A marquee, through our marquee partner',
      ],
    },
    parties: {
      label: 'Birthdays and private parties',
      included: [
        'A bar, from a single 1.5m section upwards',
        'Bartenders',
        'All-inclusive drinks: beer, wine, spirits and soft drinks',
        'Glassware, ice and fridges',
      ],
    },
  } satisfies Record<HowTopic, { label: string; included: string[] }>,
  cta: 'Build your package',
};

export interface GalleryItem { src: string; caption: string; category: string }

/** The live site's gallery, plus a few more real photos. */
export const GALLERY: GalleryItem[] = [
  { src: '/images/film/love-marquee.jpg', caption: 'LOVE bar in a clear marquee', category: 'Weddings' },
  ...galleryImages.map((g) => ({ src: g.src, caption: g.label, category: g.category })),
  { src: '/images/film/wedding-toast.jpg', caption: 'Raising a glass', category: 'Weddings' },
  { src: '/images/film/smoke-serve.jpg', caption: 'Smoke-gun serves', category: 'Private' },
  { src: '/images/film/espresso-lawn.jpg', caption: 'Espresso martini on the lawn', category: 'Cocktails' },
  { src: '/images/film/staff-cew.jpg', caption: 'Champagne bar team', category: 'Corporate' },
];
