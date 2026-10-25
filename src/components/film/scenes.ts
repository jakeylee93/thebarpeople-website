// The opening "film" — storyboard data, from Jake's own photos.
//
// Every image here is a real Bar People photo, from the repo or from
// thebarpeople.co.uk's media library (see docs/visual-quotes/photo-sources.md).
// Nothing has been generated. Where a scene needs a new still (scene 1), the
// plan is a reference-conditioned still made LATER in OpenArt from these
// photos — only after Jake approves the frames. No video before that.

export interface FilmImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Where the file came from. */
  origin: string;
}

export interface SceneSource {
  image: FilmImage;
  shows: string;
  caveat?: string;
}

export interface SceneFrame {
  image: FilmImage;
  /** object-position for the 16:9 desktop and 9:16 phone crops */
  desktop: string;
  phone: string;
  tag: string;
}

export interface Scene {
  n: number;
  id: string;
  title: string;
  purpose: string;
  sources: SceneSource[];
  frame: SceneFrame;
  overlay: { eyebrow?: string; title: string; sub?: string; cta?: string; chips?: string[] };
  still: { needed: boolean; plan: string; status: string };
  transitionOut?: string;
}

const LIVE = 'thebarpeople.co.uk media library';
const REPO = 'repo /public/images/events';

export const IMG = {
  shirtMartinis: { src: '/images/film/shirt-martinis.jpg', alt: 'Close-up of a white oxford shirt with the Bar People roundel stitched in light grey, two pornstar martinis held at the chest', width: 800, height: 600, origin: `${LIVE} · 2024/05/cupplapornstarsmate.jpg` },
  shirtPour: { src: '/images/film/shirt-pour.jpg', alt: 'Bar People bartender in a white oxford shirt and braces, roundel embroidered in black, pouring into martini glasses', width: 2200, height: 1294, origin: `${LIVE} · 2024/01/cocktail_bar_home2.jpeg` },
  shirtPourSilver: { src: '/images/film/shirt-pour-silver-preview.jpg', alt: 'The same real photo with only the roundel thread recoloured to silver, as a preview', width: 2200, height: 1294, origin: `${LIVE} · 2024/01/cocktail_bar_home2.jpeg (thread recoloured by hand)` },
  staffCew: { src: '/images/film/staff-cew.jpg', alt: 'Two Bar People staff in white shirts behind a chequered bar of champagne flutes', width: 1512, height: 2016, origin: `${LIVE} · 2024/02/IMG_8143.jpg (original 3024×4032)` },
  counterCopper: { src: '/images/film/counter-copper.jpg', alt: 'A white bar counter at night with rows of flutes, a copper tray with rosemary and a mixing glass', width: 2305, height: 1537, origin: `${LIVE} · 2024/04/IMG_9306.jpg` },
  counterGlasses: { src: '/images/events/martini-pour.jpg', alt: 'Upturned cocktail glasses and a copper tray with herbs on a white Bar People counter', width: 1024, height: 769, origin: `${REPO}/martini-pour.jpg` },
  lawnBar: { src: '/images/film/wedding-lawn-bar.jpg', alt: 'A white bar set up on a lawn, willow trees behind', width: 800, height: 600, origin: `${LIVE} · 2024/05/weddingchigwell.jpg` },
  busyBar: { src: '/images/film/busy-bar.jpg', alt: 'A back bar mid-service: bottles, ice and a drink being made', width: 800, height: 600, origin: `${LIVE} · 2024/05/busybar.jpg` },
  conservatory: { src: '/images/film/conservatory-bar.jpg', alt: 'A compact white bar in a conservatory', width: 800, height: 600, origin: `${LIVE} · 2024/05/nicebarconservatory.jpg` },
  smokeServe: { src: '/images/film/smoke-serve.jpg', alt: 'Three Bar People staff in roundel shirts serving with a smoke gun', width: 800, height: 600, origin: `${LIVE} · 2024/05/pez40th.jpg` },
  cewBar: { src: '/images/film/cew-bar.jpg', alt: 'A chequered bar of champagne flutes at a large hall event, the Bar People roundel on the backdrop', width: 1764, height: 936, origin: `${LIVE} · 2024/02/bar_hire_corporate.jpg` },
  toast: { src: '/images/film/wedding-toast.jpg', alt: 'Guests raising their glasses around a white bar', width: 800, height: 600, origin: `${LIVE} · 2024/05/weddingparty.jpg` },
  loveMarquee: { src: '/images/film/love-marquee.jpg', alt: 'A LOVE letter bar inside a clear marquee', width: 800, height: 600, origin: `${LIVE} · 2024/05/lovebar.jpg` },
  staffPouring: { src: '/images/film/staff-pouring.jpg', alt: 'A Bar People bartender in a roundel shirt pouring a drink', width: 800, height: 600, origin: `${LIVE} · 2024/05/willbirthdays.jpg` },
  strawberryCoupe: { src: '/images/events/martini-daiquiri.jpg', alt: 'A strawberry coupe on a white bar with copper tools', width: 1024, height: 769, origin: `${REPO}/martini-daiquiri.jpg` },
  espresso: { src: '/images/film/espresso-lawn.jpg', alt: 'An espresso martini on the bar edge with a garden party softly behind', width: 800, height: 600, origin: `${LIVE} · 2024/05/espresso.jpg` },
  alexServe: { src: '/images/events/staff-alex.jpg', alt: 'A Bar People bartender in a white shirt offering a yellow cocktail across a wooden counter', width: 1024, height: 769, origin: `${REPO}/staff-alex.jpg` },
} satisfies Record<string, FilmImage>;

export const HERO_COPY = {
  eyebrow: 'Mobile bar hire · London & nationwide',
  // The Bar People's own words, from thebarpeople.co.uk.
  title: 'Unforgettable events, unmatched service',
  sub: 'You bring the guests, we’ll bring the rest.',
  cta: 'Build your party quote',
};

export const SCENES: Scene[] = [
  {
    n: 1,
    id: 'shirt',
    title: 'Opening — the shirt',
    purpose: 'Opens close on the real uniform: white oxford, the roundel in silver thread, calm natural daylight. The first scroll moves towards the bar.',
    sources: [
      { image: IMG.shirtMartinis, shows: 'Closest to the opening shot: the shirt, the roundel, two cocktails, no face. The thread here already looks light grey — close to silver.', caveat: 'Only 800px online. We need the original file for a sharp full-screen opening.' },
      { image: IMG.shirtPour, shows: 'Our sharpest real shirt online: oxford weave, braces, roundel in black thread, pouring into martini glasses.', caveat: 'Roundel is small in the frame and the face is in shot. Fine as a stand-in; the close-up still fixes both.' },
      { image: IMG.staffCew, shows: 'A second real example of the uniform, from a very large original photo.', caveat: 'Roundel small; faces in frame — reference only.' },
    ],
    frame: { image: IMG.shirtPourSilver, desktop: '78% 30%', phone: '81% 38%', tag: 'Real photo · roundel recoloured to silver by hand (preview)' },
    overlay: { eyebrow: HERO_COPY.eyebrow, title: HERO_COPY.title, sub: HERO_COPY.sub, cta: HERO_COPY.cta },
    still: {
      needed: true,
      plan: 'Best route: the original file of the close-up shirt photo. If its grey thread is already the silver you want, it only needs a crop and gentle light — no AI. Otherwise, an OpenArt still conditioned on that photo and the logo file: same shirt, roundel in silver thread, natural light, no face.',
      status: 'Not made. Only after you approve this frame. No video.',
    },
    transitionOut: 'The bartender’s white sleeve crosses the lens, and we cut to the white bar.',
  },
  {
    n: 2,
    id: 'bar',
    title: 'The bar is set — Build your party quote',
    purpose: 'The camera settles on a genuine white bar with the copper tray. The quote builder is the second section, one scroll from the top.',
    sources: [
      { image: IMG.counterCopper, shows: 'White counter, rows of flutes, copper tray with rosemary, mixing glass, night windows behind.' },
      { image: IMG.counterGlasses, shows: 'White counter, upturned cocktail glasses, copper tray with herbs. Used as the first picture inside the quote builder.', caveat: '1024px — fine inside the builder, too small to go full-screen.' },
    ],
    frame: { image: IMG.counterCopper, desktop: '50% 62%', phone: '58% 60%', tag: 'Real photo' },
    overlay: { eyebrow: 'Instant · itemised · no obligation', title: 'Build your party quote', sub: 'Choose your bar, glasses, ice and team. The quote builds as you go.' },
    still: { needed: false, plan: 'The real photo works as it is. At most a gentle light match to scene 1 — no new content.', status: 'Ready.' },
    transitionOut: 'The white bar edge lines up with the next bar’s edge — a match cut into the services.',
  },
  {
    n: 3,
    id: 'services',
    title: 'Services, as real setups',
    purpose: 'Each service is shown on a real Bar People setup, chosen with simple, elegant controls.',
    sources: [
      { image: IMG.lawnBar, shows: 'All-inclusive: a white bar on a lawn.' },
      { image: IMG.busyBar, shows: 'Cash bar: the back bar mid-service.' },
      { image: IMG.conservatory, shows: 'Dry hire: a compact white bar in a conservatory.' },
      { image: IMG.smokeServe, shows: 'Staff hire: three of the team in roundel shirts.' },
      { image: IMG.cewBar, shows: 'Event management: a large hall event, roundel on the backdrop.', caveat: 'Event branding in shot — check you’re happy to feature it.' },
    ],
    frame: { image: IMG.lawnBar, desktop: '50% 55%', phone: '42% 55%', tag: 'Real photo' },
    overlay: { eyebrow: 'What we do', title: 'All-inclusive', sub: 'Drinks, bar, glassware, ice and the team — one booking.', chips: ['All-inclusive', 'Cash bar', 'Dry hire', 'Staff hire', 'Event management'] },
    still: { needed: false, plan: 'Real photos, matched crops and light only. Most are 800px online, so originals would help.', status: 'Ready to lay out once you pick the photos.' },
    transitionOut: 'A cut on a glass rim into the gallery.',
  },
  {
    n: 4,
    id: 'events',
    title: 'Real events',
    purpose: 'A calm, coordinated gallery of real events. Each photo is captioned for what it is — no pretending different nights are one party.',
    sources: [
      { image: IMG.toast, shows: 'Guests raising glasses around a white bar.' },
      { image: IMG.loveMarquee, shows: 'The LOVE bar in a clear marquee.' },
      { image: IMG.staffPouring, shows: 'A bartender in the roundel shirt, mid-pour.' },
      { image: IMG.staffCew, shows: 'Staff behind a chequered champagne bar.' },
    ],
    frame: { image: IMG.toast, desktop: '50% 40%', phone: '55% 40%', tag: 'Real photo' },
    overlay: { eyebrow: 'Real events', title: 'Weddings, launches, birthdays', sub: 'Every photo here is one of ours.' },
    still: { needed: false, plan: 'Real photos only, matched crops and light. Client-branded shots only where you have permission.', status: 'Ready once you pick the photos.' },
    transitionOut: 'A reflection in a coupe rim leads to the last drink.',
  },
  {
    n: 5,
    id: 'close',
    title: 'Last drink & contact',
    purpose: 'A calm close on one drink on the bar, then real contact details.',
    sources: [
      { image: IMG.strawberryCoupe, shows: 'A strawberry coupe on a white bar, copper tools, natural reflections.' },
      { image: IMG.espresso, shows: 'An espresso martini on the bar edge, the party soft behind.' },
      { image: IMG.alexServe, shows: 'A bartender offering a cocktail across a wooden counter.' },
    ],
    frame: { image: IMG.strawberryCoupe, desktop: '50% 60%', phone: '45% 60%', tag: 'Real photo' },
    overlay: { eyebrow: 'Ready when you are', title: 'Let’s plan your bar', sub: 'hello@thebarpeople.co.uk · Jake 07557 402200' },
    still: { needed: false, plan: 'Real photo. A calmer, wider original would be a bonus.', status: 'Ready.' },
  },
];
