// Media registry — every picture the site's content can point at today.
//
// For each file: size, what it honestly is, where it came from, and anything
// that needs a decision before it's shown (client branding, faces, not ours).
// AnyVendor's own media library will take over uploads; these entries let the
// first import carry provenance and honesty labels with each picture.
// Full source list: docs/visual-quotes/photo-sources.md.

export type MediaKind = 'photo' | 'photo-edited' | 'sketch' | 'illustration' | 'logo' | 'client-logo';
export type MediaUse = 'ok' | 'check' | 'avoid';

export interface MediaEntry {
  width: number;
  height: number;
  kind: MediaKind;
  origin: string;
  /** ok: ready · check: needs a decision first · avoid: don't use */
  use: MediaUse;
  note?: string;
}

const LIVE = 'thebarpeople.co.uk media library';
const EARLIER = 'repo (earlier build; same photos as the live site)';

const photo = (w: number, h: number, use: MediaUse = 'ok', note?: string, origin = EARLIER): MediaEntry =>
  ({ width: w, height: h, kind: 'photo', origin, use, ...(note ? { note } : {}) });
const sketch = (note?: string): MediaEntry =>
  ({ width: 2897, height: 1890, kind: 'sketch', origin: `${EARLIER}; bar line sketches from 2024`, use: 'ok', ...(note ? { note } : {}) });
const client = (w: number, h: number): MediaEntry =>
  ({ width: w, height: h, kind: 'client-logo', origin: EARLIER, use: 'check', note: 'Client logo: permission to show not confirmed.' });

export const MEDIA: Record<string, MediaEntry> = {
  // Own brand
  '/images/logos/bar-people-logo.png': { width: 1000, height: 1000, kind: 'logo', origin: `${LIVE} 2024/01/Bar-People-Logo.png (byte-identical)`, use: 'ok' },
  '/images/logos/logo-header.png': { width: 1479, height: 263, kind: 'logo', origin: `${LIVE} 2023/09/logo_header_tbp.png (byte-identical)`, use: 'ok' },

  // Opening film and storyboard (added 25 Oct from the live media library)
  '/images/film/shirt-pour.jpg': photo(2200, 1294, 'ok', 'Real staff shirt, roundel in black thread.', `${LIVE} 2024/01/cocktail_bar_home2.jpeg`),
  '/images/film/shirt-pour-silver-preview.jpg': { width: 2200, height: 1294, kind: 'photo-edited', origin: `${LIVE} 2024/01/cocktail_bar_home2.jpeg`, use: 'check', note: 'Same real photo, only the roundel thread recoloured to silver by hand. Must stay labelled as a preview until silver is decided.' },
  '/images/film/shirt-martinis.jpg': photo(800, 600, 'check', 'Best opening composition, light grey thread; only 800px online, original needed.', `${LIVE} 2024/05/cupplapornstarsmate.jpg`),
  '/images/film/counter-copper.jpg': photo(2305, 1537, 'ok', 'Genuine white counter, copper tray.', `${LIVE} 2024/04/IMG_9306.jpg`),
  '/images/film/staff-cew.jpg': photo(1512, 2016, 'check', 'Faces in frame; event branding nearby.', `${LIVE} 2024/02/IMG_8143.jpg (original 3024×4032)`),
  '/images/film/cew-bar.jpg': photo(1764, 936, 'check', 'Event branding visible.', `${LIVE} 2024/02/bar_hire_corporate.jpg`),
  '/images/film/wedding-lawn-bar.jpg': photo(800, 600, 'ok', undefined, `${LIVE} 2024/05/weddingchigwell.jpg`),
  '/images/film/conservatory-bar.jpg': photo(800, 600, 'ok', undefined, `${LIVE} 2024/05/nicebarconservatory.jpg`),
  '/images/film/wedding-toast.jpg': photo(800, 600, 'check', 'Guests’ faces.', `${LIVE} 2024/05/weddingparty.jpg`),
  '/images/film/love-marquee.jpg': photo(800, 600, 'ok', undefined, `${LIVE} 2024/05/lovebar.jpg`),
  '/images/film/smoke-serve.jpg': photo(800, 600, 'ok', 'Staff faces.', `${LIVE} 2024/05/pez40th.jpg`),
  '/images/film/espresso-lawn.jpg': photo(800, 600, 'ok', undefined, `${LIVE} 2024/05/espresso.jpg`),
  '/images/film/staff-pouring.jpg': photo(800, 600, 'ok', 'Staff faces.', `${LIVE} 2024/05/willbirthdays.jpg`),
  '/images/film/busy-bar.jpg': photo(800, 600, 'ok', undefined, `${LIVE} 2024/05/busybar.jpg`),

  // Earlier build's photos
  '/images/events/about-us.jpg': photo(988, 988, 'avoid', 'Not a Bar People photo (office stock image).'),
  '/images/events/alex.jpg': photo(1000, 1000, 'ok', 'Staff face.'),
  '/images/events/bar-event.jpg': photo(900, 630, 'check', 'Busy launch crowd; client event.'),
  '/images/events/boux-avenue.jpg': photo(1024, 769, 'check', 'Client event.'),
  '/images/events/cocktails.jpg': photo(1024, 769),
  '/images/events/garden-bar.jpg': photo(1024, 769),
  '/images/events/glody.jpg': photo(1000, 1000, 'check', 'Staff face; client event backdrop.'),
  '/images/events/hip-hooray.jpg': photo(1024, 769),
  '/images/events/hp-bar.jpg': photo(1024, 769, 'check', 'Client logo on the bar.'),
  '/images/events/hp-mini-island.jpg': photo(1024, 769, 'check', 'Client event.'),
  '/images/events/jake-corporate.jpg': photo(1000, 1000, 'check', 'Third-party shirt and lanyard branding — not the Bar People uniform.'),
  '/images/events/love-mirror.jpg': photo(1000, 1000),
  '/images/events/marquee-bar.jpg': photo(1024, 769),
  '/images/events/martini-daiquiri.jpg': photo(1024, 769),
  '/images/events/martini-pour.jpg': photo(1024, 769, 'ok', 'Upturned cocktail glasses and a copper tray — not a pour.'),
  '/images/events/mirror-bar-outside.jpg': photo(1024, 769),
  '/images/events/mirror-bar.jpg': photo(1024, 769, 'ok', 'Straight mirror bar (not the curved one).'),
  '/images/events/outdoor-bar.jpg': photo(1024, 769),
  '/images/events/pina-colada.jpg': photo(1024, 769),
  '/images/events/porsche-custom.jpg': photo(1000, 1000, 'check', 'Client branding on the bar.'),
  '/images/events/porsche-staff.jpg': photo(900, 630, 'check', 'Client branding on the bar.'),
  '/images/events/porsche.jpg': photo(1024, 769, 'check', 'Client showroom.'),
  '/images/events/salesforce-bar-2.jpg': photo(1024, 769),
  '/images/events/salesforce-bar.jpg': photo(1024, 769, 'check', 'Client logo on the bar.'),
  '/images/events/special-occasions.jpg': photo(1000, 1000),
  '/images/events/staff-alex.jpg': photo(1024, 769, 'ok', 'Staff face.'),
  '/images/events/superdrug.jpg': photo(900, 630, 'check', 'Client event branding.'),

  // Bar layouts (drawings, labelled as such wherever shown)
  '/images/bars/compact-5ft.png': sketch(),
  '/images/bars/straight-10ft.png': sketch(),
  '/images/bars/open-island-15ft.png': sketch(),
  '/images/bars/horseshoe-small.png': sketch(),
  '/images/bars/horseshoe-large.png': sketch(),
  '/images/bars/island.png': sketch('40ft island — not one of the six current layouts.'),
  '/images/visual-quote/curved-mirror-sketch.svg': { width: 2897, height: 1890, kind: 'illustration', origin: 'drawn for the quote builder (25 Oct 2026)', use: 'ok', note: 'Illustration — a photo of the curved mirror bar is still needed.' },

  // Client logos
  '/images/brands/o2.png': client(400, 200),
  '/images/brands/sky.png': client(400, 200),
  '/images/brands/salesforce.png': client(400, 200),
  '/images/brands/hpe.png': client(1667, 697),
  '/images/brands/itv2.png': client(400, 200),
  '/images/brands/boux-avenue.png': client(400, 200),
  '/images/brands/batiste.png': client(400, 200),
  '/images/brands/bulb.png': client(400, 200),

  // The commissioned homepage (/new), added 8 to 11 Nov 2026
  '/images/new-home/hero-cocktails.jpg': { width: 2880, height: 1620, kind: 'photo-edited', origin: `OpenArt 4K clean-up of a real Bar People photo (${LIVE})`, use: 'ok', note: 'Real photo, cleaned up: fuller martinis, neater pineapple.' },
  '/images/new-home/hero-lawn.jpg': { width: 2880, height: 1620, kind: 'photo-edited', origin: `OpenArt 4K clean-up of the real lawn bar photo (${LIVE})`, use: 'ok', note: 'Real photo, cleaned up and widened to 16:9.' },
  '/images/new-home/hero-balloons.jpg': { width: 2880, height: 1620, kind: 'photo-edited', origin: `OpenArt 4K clean-up of the real balloon bar photo (${LIVE})`, use: 'ok', note: 'Real photo, cleaned up and widened to 16:9.' },
  '/images/new-home/christmas.jpg': { width: 2016, height: 1344, kind: 'illustration', origin: 'OpenArt festive scene built around the real white bar', use: 'check', note: 'A promo image, not a real event. Swap for a real Christmas party photo when there is one.' },
  '/videos/new-home/card-1-toast.jpg': { width: 720, height: 1280, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/card-2-pour.jpg': { width: 720, height: 1280, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/card-4-bubbles.jpg': { width: 720, height: 1280, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/card-5-shimmer.jpg': { width: 720, height: 1280, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/card-6-shaker.jpg': { width: 720, height: 1280, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/feed-4-blue.jpg': { width: 654, height: 818, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/feed-6-shake.jpg': { width: 654, height: 818, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/feed-7-tray.jpg': { width: 654, height: 818, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/hero-reel-phone.jpg': { width: 654, height: 818, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/videos/new-home/hero-reel.jpg': { width: 1600, height: 682, kind: 'photo', origin: `still from The Bar People's own promo film (${LIVE})`, use: 'ok', note: 'Poster frame for the clip of the same name.' },
  '/images/clients/batiste.svg': { width: 126, height: 54, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/boux-avenue.svg': { width: 395, height: 186, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/bulb.svg': { width: 142, height: 54, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/hpe.svg': { width: 531, height: 222, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/itv2.svg': { width: 1000, height: 330, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/o2.svg': { width: 24, height: 24, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/salesforce.svg': { width: 272, height: 191, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/sky.svg': { width: 24, height: 15, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
  '/images/clients/superdrug.svg': { width: 999, height: 221, kind: 'client-logo', origin: 'vector logo; sources in docs/new-homepage/README.md', use: 'check', note: 'Client logo: permission to show not confirmed.' },
};
