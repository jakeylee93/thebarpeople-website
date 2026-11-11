// Content for the new homepage (/new). Real Bar People photos throughout;
// the hero's first, second and fourth slides are 4K OpenArt clean-ups of real
// photos (see docs/new-homepage/README.md).


/** The page scrolls inside this element, not the document (see SnapPage). */
export const SCROLLER_ID = 'nh-scroller';

/** One screen each, in page order. `tone` is what sits behind the section dots. */
export const SECTIONS = [
  { id: 'home', label: 'Home', tone: 'dark' },
  { id: 'christmas', label: 'Christmas', tone: 'dark' },
  { id: 'corporate', label: 'Corporate', tone: 'dark' },
  { id: 'weddings', label: 'Weddings', tone: 'light' },
  { id: 'parties', label: 'Parties', tone: 'dark' },
  { id: 'team', label: 'Our team', tone: 'dark' },
  { id: 'marquees', label: 'Marquees', tone: 'light' },
  { id: 'gallery', label: 'Gallery', tone: 'light' },
  { id: 'contact', label: 'Contact', tone: 'dark' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];

const NAV_IDS: SectionId[] = ['corporate', 'weddings', 'parties', 'marquees', 'gallery'];

/** Header and footer links: jumps to sections of this page. */
export const navOf = (sections: readonly { id: string; label: string }[]) =>
  sections.filter((s) => (NAV_IDS as string[]).includes(s.id)).map((s) => ({ id: s.id, href: `#${s.id}`, label: s.label }));

/** Every "Build your package" button links here; the builder opens on this hash. */
export const BUILD_HREF = '#build';
/** The Christmas advert's button and the marquee section's button (builder/route.ts). Fixed in code, not content. */
export const CHRISTMAS_BUILD_HREF = '#build/christmas';
export const MARQUEE_BUILD_HREF = '#build/marquee-package';

export const CONTACTS = [
  { name: 'Jake', email: 'jake@thebarpeople.co.uk', phone: '07557 402200', tel: '+447557402200' },
] as const;

/** Opens a WhatsApp chat with Jake. It is only a link: nothing is sent by the site. */
export const WHATSAPP_HREF = 'https://wa.me/447557402200';

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

// The header is the film: eight shots from The Bar People's own promo films,
// joined with soft fades (19 seconds), playing on a loop. Add photo slides
// after it and the header goes back to a slideshow.
export const HERO_SLIDES: HeroSlide[] = [
  {
    kind: 'video', src: '/videos/new-home/hero-reel.mp4', poster: '/videos/new-home/hero-reel.jpg',
    phone: { src: '/videos/new-home/hero-reel-phone.mp4', poster: '/videos/new-home/hero-reel-phone.jpg' },
    alt: 'Bar People bartenders raising, pouring, shaking and serving cocktails',
    focus: { desktop: '50% 50%', phone: '50% 50%' },
    seconds: 18.5,
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
  /** Snapshots that shuffle on the advert. Party photos for now: swap in real Christmas parties. */
  prints: {
    left: ['/images/events/boux-avenue.jpg', '/images/film/staff-cew.jpg', '/images/events/cocktails.jpg'],
    right: ['/images/film/smoke-serve.jpg', '/images/events/bar-event.jpg', '/images/events/martini-daiquiri.jpg'],
  },
  small: 'Book early for December.',
  image: {
    src: '/images/new-home/christmas.jpg',
    alt: 'A white bar dressed for Christmas with a garland, fairy lights and festive cocktails',
    focus: { desktop: '50% 45%', phone: '32% 50%' },
  } satisfies Photo,
};

export const CORPORATE = {
  eyebrow: 'Corporate events',
  title: 'Your brand on the bar.',
  body: 'For launches, office parties and awards nights. We put your logo or a full wrap on the bar, then bring it, set it up and serve.',
  /** What happens, in order. */
  steps: [
    { title: 'Send us your logo', detail: 'We set up the artwork for you, free.' },
    { title: 'We brand the bar', detail: 'One logo panel or a full wrap, on any size of bar.' },
    { title: 'We run the bar', detail: 'Bartenders, drinks and glassware, delivered and set up.' },
  ],
  cta: 'Get a corporate quote',
  call: 'or call Jake on',
  trusted: 'Trusted by',
  /** Real branded bars: the first is the large photo. */
  photos: [
    { src: '/images/events/salesforce-bar.jpg', alt: 'A white bar with the Salesforce logo on its front, in an office', focus: '48% 55%' },
    { src: '/images/events/porsche-custom.jpg', alt: 'Two bartenders behind a bar wrapped in bright Porsche artwork', focus: '50% 70%' },
    { src: '/images/events/hp-bar.jpg', alt: 'A bar with the Hewlett Packard Enterprise logo at a conference', focus: '45% 60%' },
    { src: '/images/film/cew-bar.jpg', alt: 'A chequerboard-wrapped champagne bar at an awards show', focus: '50% 55%' },
  ],
};

export const WEDDINGS = {
  eyebrow: 'Weddings',
  /** The second part is set in italic script. */
  title: ['The bar for your', 'big day.'],
  body: 'A bar to suit your venue, the drinks you love and bartenders to serve them, in London and nationwide.',
  points: [
    'Classic white, mirror or the LOVE bar',
    'All-inclusive drinks, glassware and ice',
    'We deliver, set up and collect',
  ],
  cta: 'Build your wedding bar',
  image: {
    src: '/images/new-home/hero-lawn.jpg',
    alt: 'A white horseshoe bar on a lawn in front of a gazebo and willow trees',
    focus: { desktop: '60% 70%', phone: '50% 72%' },
  } satisfies Photo,
  /** Small prints laid over the photo. */
  prints: [
    { src: '/images/film/love-marquee.jpg', alt: 'The LOVE bar in a clear marquee' },
    { src: '/images/film/wedding-toast.jpg', alt: 'Wedding guests raising their glasses at the bar' },
  ],
};

export const PARTIES = {
  eyebrow: 'Birthdays and private parties',
  /** The second part glows like the neon sign in the photo. */
  title: ['Your party,', 'our bar.'],
  body: 'Birthdays, garden parties and get-togethers. Start with a 1.5m bar and add whatever the night needs.',
  points: [
    'Shimmer, mirror or classic white bars',
    'Bartenders, drinks, glassware and ice',
    'Delivered, set up and collected for you',
  ],
  cta: 'Build your party bar',
  /** The words on the photo's sticker. The amount under them is the 1.5m bar price, from src/lib/quote/prices.ts. */
  stickerLabel: 'Bars from',
  image: {
    src: '/images/events/special-occasions.jpg',
    alt: 'A neon sign reading Sip Sip Hooray on a leafy wall above a bar set with copper cups, under party balloons',
    focus: { desktop: '50% 42%', phone: '50% 45%' },
  } satisfies Photo,
};

export const TEAM = {
  eyebrow: 'Our team',
  title: 'The people behind the bar.',
  body: 'Friendly, fast and properly trained. At least two on every job.',
  cta: 'Build your package',
};

export const MARQUEE = {
  eyebrow: 'Packages',
  title: 'Marquee packages',
  body: 'One quote for the marquee, the bar and everything that goes with it.',
  items: ['Marquee', 'Bar', 'Bartenders', 'Drinks', 'Glassware', 'Ice and fridges'],
  cta: 'Build a marquee package',
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

export type FeedItem =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster: string; alt: string };

/**
 * The gallery, laid out like an Instagram grid: same-shape cards, no titles,
 * videos playing by themselves. For now these are our own photos and clips in
 * a hand-picked order. Once Instagram is connected, this list is replaced by
 * the latest posts, newest first.
 */
export const INSTAGRAM = { handle: '@thebarpeople', href: 'https://www.instagram.com/thebarpeople/' };

export const FEED: FeedItem[] = [
  { kind: 'image', src: '/images/film/love-marquee.jpg', alt: 'The LOVE bar in a clear marquee' },
  { kind: 'video', src: '/videos/new-home/feed-4-blue.mp4', poster: '/videos/new-home/feed-4-blue.jpg', alt: 'Blue cocktails with orange slices, from above' },
  { kind: 'image', src: '/images/events/salesforce-bar.jpg', alt: 'A bar with the Salesforce logo, in an office' },
  { kind: 'image', src: '/images/film/espresso-lawn.jpg', alt: 'An espresso martini on a lawn at a summer party' },
  { kind: 'video', src: '/videos/new-home/card-5-shimmer.mp4', poster: '/videos/new-home/card-5-shimmer.jpg', alt: 'Cocktails lined up on a shimmer bar' },
  { kind: 'image', src: '/images/events/special-occasions.jpg', alt: 'A neon Sip Sip Hooray sign above a bar' },
  { kind: 'image', src: '/images/events/porsche-custom.jpg', alt: 'A bar wrapped in bright Porsche artwork' },
  { kind: 'image', src: '/images/film/wedding-toast.jpg', alt: 'Wedding guests raising their glasses' },
  { kind: 'video', src: '/videos/new-home/card-4-bubbles.mp4', poster: '/videos/new-home/card-4-bubbles.jpg', alt: 'Champagne flutes fizzing in the sun' },
  { kind: 'image', src: '/images/events/boux-avenue.jpg', alt: 'A busy bar at a launch party' },
  { kind: 'image', src: '/images/film/counter-copper.jpg', alt: 'Champagne flutes and copper bar tools on a white bar' },
  { kind: 'image', src: '/images/events/martini-daiquiri.jpg', alt: 'A strawberry daiquiri beside copper shakers' },
];

/** The team grid: our own bartenders at work. */
export const TEAM_FEED: FeedItem[] = [
  { kind: 'image', src: '/images/events/alex.jpg', alt: 'A bartender holding out a pineapple cocktail' },
  { kind: 'video', src: '/videos/new-home/card-1-toast.mp4', poster: '/videos/new-home/card-1-toast.jpg', alt: 'A bartender tasting a cocktail under fairy lights' },
  { kind: 'image', src: '/images/events/glody.jpg', alt: 'A bartender pouring champagne at an awards show' },
  { kind: 'image', src: '/images/events/jake-corporate.jpg', alt: 'A bartender mixing a drink at a corporate event' },
  { kind: 'image', src: '/images/film/staff-cew.jpg', alt: 'Two bartenders behind a champagne bar' },
  { kind: 'video', src: '/videos/new-home/feed-6-shake.mp4', poster: '/videos/new-home/feed-6-shake.jpg', alt: 'A bartender shaking a cocktail' },
  { kind: 'image', src: '/images/film/staff-pouring.jpg', alt: 'Three bartenders pouring drinks' },
  { kind: 'image', src: '/images/events/porsche-staff.jpg', alt: 'Two bartenders behind a branded bar' },
  { kind: 'image', src: '/images/film/smoke-serve.jpg', alt: 'Three bartenders with a smoking cocktail' },
  { kind: 'video', src: '/videos/new-home/feed-7-tray.mp4', poster: '/videos/new-home/feed-7-tray.jpg', alt: 'A bartender carrying a tray of cocktails' },
  { kind: 'image', src: '/images/film/shirt-martinis.jpg', alt: 'A bartender holding two cocktails' },
  { kind: 'image', src: '/images/film/shirt-pour.jpg', alt: 'A bartender pouring into a row of martini glasses' },
];
