// Content for the new homepage (/new). Real Bar People photos throughout;
// the hero's first, second and fourth slides are 4K OpenArt clean-ups of real
// photos (see docs/new-homepage/README.md).

import { galleryImages } from '@/lib/constants';

export const NAV = [
  { href: '/our-bars', label: 'Our bars' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

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
  // Ready for Jake's own clips: muted, looping, with a still poster.
  | { kind: 'video'; src: string; poster: string; alt: string; focus: Focus };

export const HERO_SLIDES: HeroSlide[] = [
  {
    kind: 'image', src: '/images/new-home/hero-cocktails.jpg',
    alt: 'A row of pink martinis with fresh pineapple wedges on a white bar',
    focus: { desktop: '50% 50%', phone: '52% 50%' },
  },
  {
    kind: 'image', src: '/images/new-home/hero-lawn.jpg',
    alt: 'A white Bar People bar on a lawn, willow trees and a gazebo behind',
    focus: { desktop: '50% 62%', phone: '50% 70%' },
  },
  {
    kind: 'image', src: '/images/film/shirt-pour.jpg',
    alt: 'A Bar People bartender pouring cocktails at a garden bar',
    focus: { desktop: '50% 40%', phone: '58% 45%' },
  },
  {
    kind: 'image', src: '/images/new-home/hero-balloons.jpg',
    alt: 'A white bar under big white balloons on a garden terrace',
    focus: { desktop: '50% 58%', phone: '48% 62%' },
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

export const CHRISTMAS = {
  eyebrow: 'Christmas 2026',
  title: 'Christmas parties, sorted.',
  body: 'Office parties, client drinks and family get-togethers. We bring the bar, the bartenders and the festive cocktails. You just bring the guests.',
  points: ['Office parties', 'Client drinks', 'Family get-togethers'],
  cta: 'Build your Christmas package',
  small: 'Book early for December.',
  image: {
    src: '/images/new-home/christmas.jpg',
    alt: 'A white bar dressed for Christmas with a garland, fairy lights and festive cocktails',
  },
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
