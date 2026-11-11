// Glassware to hire (Jake, 10 and 11 Nov 2026).
//
// 80p a glass, except: premium champagne flute £1, large wine glass 90p and
// gin bowl £1. Photos are from our glassware supplier's own listing.

import type { Pence } from '../visual-quote/money.ts';
import { PRICES } from './prices.ts';

export interface Glass {
  id: string;
  name: string;
  detail: string;
  /** Hire price for one glass, before VAT. */
  price: Pence;
  photo: string;
}

const photo = (name: string) => `/images/new-home/hire/glass-${name}.jpg`;

export const GLASSES: Glass[] = [
  { id: 'glass-highball', name: '12oz highball', detail: 'Long drinks, spritzes, soft drinks', price: PRICES.glass, photo: photo('highball') },
  { id: 'glass-wine', name: 'Wine glass', detail: 'Red, white and rosé', price: PRICES.glass, photo: photo('wine') },
  { id: 'glass-wine-large', name: 'Large wine glass', detail: 'A bigger bowl for a bigger pour', price: 90, photo: photo('wine-large') },
  { id: 'glass-flute', name: 'Champagne flute', detail: 'Fizz and toasts', price: PRICES.glass, photo: photo('flute') },
  { id: 'glass-flute-premium', name: 'Premium champagne flute', detail: 'A taller, finer flute', price: 100, photo: photo('flute-premium') },
  { id: 'glass-martini', name: 'Martini glass', detail: 'Martinis and short cocktails', price: PRICES.glass, photo: photo('martini') },
  { id: 'glass-gin', name: 'Gin bowl', detail: 'Gin and tonic, Spanish style', price: 100, photo: photo('gin') },
  { id: 'glass-whisky', name: 'Whisky tumbler', detail: 'Spirits over ice, old fashioneds', price: PRICES.glass, photo: photo('whisky') },
  { id: 'glass-margarita', name: 'Margarita glass', detail: 'Margaritas and frozen drinks', price: PRICES.glass, photo: photo('margarita') },
  { id: 'glass-pint', name: 'Pint glass', detail: 'Beer and cider', price: PRICES.glass, photo: photo('pint') },
  { id: 'glass-half-pint', name: 'Half-pint glass', detail: 'Smaller beers', price: PRICES.glass, photo: photo('half-pint') },
  { id: 'glass-shot', name: 'Shot glass', detail: 'Shots and tasters', price: PRICES.glass, photo: photo('shot') },
];
