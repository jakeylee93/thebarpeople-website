// All-inclusive drinks: the price per guest and the menu.
//
// Jake, 10 Nov 2026:
//   £7.50 a guest per hour up to 5 hours · 5 hours is £35 · then £5 an hour
//   (6h £40, 7h £45, 8h £50). Beer, wine, spirits and soft drinks.
//   The standard menu is included. Guests can untick drinks (no change in
//   price), add some at no extra cost, or upgrade for an extra amount per guest.
//   Champagne is charged by the bottle: the Majestic price plus 25%, to the
//   nearest pound.

import type { Pence } from '../visual-quote/money.ts';
import { PRICES, TIME_STEP } from './prices.ts';

/** Price per guest for the hours the bar is open. Minutes must be whole half hours. */
export function drinksPerHead(minutes: number): Pence {
  if (!Number.isSafeInteger(minutes) || minutes <= 0 || minutes % TIME_STEP !== 0) {
    throw new Error(`Drinks are priced in half hours (got ${minutes} minutes)`);
  }
  const halfHours = minutes / TIME_STEP;
  if (minutes < 300) return halfHours * PRICES.drinksPerHalfHourUnderFive;
  return PRICES.drinksAtFiveHours + (halfHours - 10) * PRICES.drinksPerHalfHourOverFive;
}

export type DrinkCategory = 'beer' | 'wine' | 'fizz' | 'vodka' | 'gin' | 'rum' | 'whiskey' | 'tequila' | 'liqueur' | 'soft' | 'champagne';

export const DRINK_CATEGORIES: { id: DrinkCategory; name: string }[] = [
  { id: 'beer', name: 'Beer' },
  { id: 'wine', name: 'Wine' },
  { id: 'fizz', name: 'Prosecco' },
  { id: 'vodka', name: 'Vodka' },
  { id: 'gin', name: 'Gin' },
  { id: 'rum', name: 'Rum' },
  { id: 'whiskey', name: 'Bourbon & whiskey' },
  { id: 'tequila', name: 'Tequila' },
  { id: 'liqueur', name: 'Liqueurs & aperitifs' },
  { id: 'soft', name: 'Soft drinks & mixers' },
  { id: 'champagne', name: 'Champagne, by the bottle' },
];

export type DrinkTerms =
  /** On every menu to start with. Unticking it doesn't change the price. */
  | { kind: 'standard' }
  /** Not on the menu to start with, but free to add. */
  | { kind: 'included' }
  /** Adds this much per guest. */
  | { kind: 'upgrade'; perHead: Pence }
  /** Charged per bottle, on top of the package. */
  | { kind: 'bottle'; perBottle: Pence; majestic: { pence: Pence; seen: string; product: string } }
  /** A premium choice whose price the team confirms. */
  | { kind: 'ask' };

export interface Drink {
  id: string;
  name: string;
  /** Short descriptor: "Italian lager", "Spiced rum". */
  detail: string;
  category: DrinkCategory;
  terms: DrinkTerms;
  /** Who set the terms: Jake's brief, or a suggestion for him to confirm. */
  source: 'jake' | 'suggested';
  /** Extra words the search should match. */
  keywords?: string;
}

/** Majestic single-bottle price plus 25%, to the nearest pound (halves round up). */
export function bottlePrice(majesticPence: Pence): Pence {
  if (!Number.isSafeInteger(majesticPence) || majesticPence <= 0) throw new Error(`Not a price: ${majesticPence}`);
  return Math.floor((majesticPence * 125 + 5000) / 10000) * 100;
}

const standard: DrinkTerms = { kind: 'standard' };
const included: DrinkTerms = { kind: 'included' };
const upgrade = (pounds: number): DrinkTerms => ({ kind: 'upgrade', perHead: pounds * 100 });
const ask: DrinkTerms = { kind: 'ask' };
const bottle = (product: string, majesticPence: Pence, seen: string): DrinkTerms => ({
  kind: 'bottle', perBottle: bottlePrice(majesticPence), majestic: { pence: majesticPence, seen, product },
});

// MENU-DATA-START
export const MENU: Drink[] = [
  // Beer
  { id: 'peroni', name: 'Peroni Nastro Azzurro', detail: 'Italian lager', category: 'beer', terms: standard, source: 'jake' },
  { id: 'corona', name: 'Corona Extra', detail: 'Mexican lager', category: 'beer', terms: standard, source: 'jake' },
  { id: 'desperados', name: 'Desperados', detail: 'Tequila-flavoured lager', category: 'beer', terms: upgrade(3), source: 'jake', keywords: 'desperado' },
  { id: 'estrella-galicia', name: 'Estrella Galicia', detail: 'Spanish lager', category: 'beer', terms: upgrade(3), source: 'jake' },
  { id: 'alhambra-reserva', name: 'Alhambra Reserva 1925', detail: 'Spanish premium lager', category: 'beer', terms: upgrade(5), source: 'jake' },

  // Wine and prosecco
  { id: 'villa-vito-pinot-grigio', name: 'Villa Vito Pinot Grigio', detail: 'White wine', category: 'wine', terms: standard, source: 'jake', keywords: 'white' },
  // Jake named the white and the prosecco. Majestic sells no Villa Vito red or
  // rosé, so these two stay unnamed until he picks the labels.
  { id: 'house-red', name: 'House red wine', detail: 'Red wine', category: 'wine', terms: standard, source: 'suggested', keywords: 'red merlot malbec rioja' },
  { id: 'house-rose', name: 'House rosé wine', detail: 'Rosé wine', category: 'wine', terms: standard, source: 'suggested', keywords: 'rose pink blush' },
  { id: 'aqualta-prosecco', name: 'Aqualta Prosecco', detail: 'Italian sparkling', category: 'fizz', terms: standard, source: 'jake', keywords: 'fizz sparkling bubbles' },

  // Vodka
  { id: 'absolut', name: 'Absolut Vodka', detail: 'House vodka', category: 'vodka', terms: standard, source: 'jake', keywords: 'absolute' },
  { id: 'absolut-vanilia', name: 'Absolut Vanilia', detail: 'Vanilla vodka', category: 'vodka', terms: included, source: 'jake', keywords: 'absolute vanilla' },
  { id: 'grey-goose', name: 'Grey Goose', detail: 'French premium vodka', category: 'vodka', terms: upgrade(3), source: 'jake' },

  // Gin
  { id: 'bombay-sapphire', name: 'Bombay Sapphire', detail: 'House gin', category: 'gin', terms: standard, source: 'jake' },
  { id: 'hendricks', name: 'Hendrick’s', detail: 'Scottish gin with cucumber and rose', category: 'gin', terms: upgrade(3), source: 'jake', keywords: 'hendricks hendrix' },

  // Rum
  { id: 'bacardi', name: 'Bacardí Carta Blanca', detail: 'House white rum', category: 'rum', terms: standard, source: 'jake', keywords: 'bacardi' },
  { id: 'sailor-jerry', name: 'Sailor Jerry', detail: 'Spiced rum', category: 'rum', terms: included, source: 'jake', keywords: 'spiced sailor jerrys' },
  { id: 'kraken', name: 'Kraken Black Spiced', detail: 'Premium spiced rum', category: 'rum', terms: ask, source: 'jake', keywords: 'spiced' },

  // Bourbon and whiskey
  { id: 'kentucky-bourbon', name: 'Kentucky bourbon', detail: 'House bourbon', category: 'whiskey', terms: standard, source: 'jake', keywords: 'whisky whiskey' },
  { id: 'jack-daniels', name: 'Jack Daniel’s', detail: 'Tennessee whiskey', category: 'whiskey', terms: included, source: 'jake', keywords: 'jack daniels jd whisky' },

  // Champagne, by the bottle: Majestic's single-bottle price on the date shown,
  // plus 25%, to the nearest pound (£56 → £70, £49 → £61, £215 → £269).
  { id: 'veuve-clicquot', name: 'Veuve Clicquot Yellow Label', detail: 'Champagne, 75cl', category: 'champagne', terms: bottle('Veuve Clicquot Brut, Champagne', 5600, '2026-11-10'), source: 'jake', keywords: 'veuve clique cliquot champagne fizz' },
  { id: 'moet', name: 'Moët & Chandon Impérial', detail: 'Champagne, 75cl', category: 'champagne', terms: bottle('Moët & Chandon Brut Impérial NV Champagne', 4900, '2026-11-10'), source: 'jake', keywords: 'moet chandon champagne fizz' },
  { id: 'dom-perignon', name: 'Dom Pérignon', detail: 'Vintage champagne, 75cl', category: 'champagne', terms: bottle('Dom Pérignon Brut Vintage Champagne 2017', 21500, '2026-11-10'), source: 'jake', keywords: 'dom perignon champagne vintage fizz' },

  // Soft drinks
  // Jake, 11 Nov 2026: Coca-Cola and 7UP free as standard.
  { id: 'coca-cola', name: 'Coca-Cola', detail: 'Classic cola', category: 'soft', terms: standard, source: 'jake', keywords: 'coke cola' },
  { id: 'seven-up', name: '7UP', detail: 'Lemon and lime', category: 'soft', terms: standard, source: 'jake', keywords: 'seven up 7 up lemonade sprite' },
  { id: 'soft-drinks', name: 'Mixers and juices', detail: 'Tonic, soda and fruit juices', category: 'soft', terms: standard, source: 'jake', keywords: 'tonic soda juice water orange cranberry mixer' },

  // More brands people ask for (Jake, 11 Nov 2026: "build our catalogue to be
  // bigger, like Malibu, Archers"). He has not set terms for these yet, so
  // each reads "Price to confirm" until he does.
  { id: 'malibu', name: 'Malibu', detail: 'Coconut rum liqueur', category: 'liqueur', terms: ask, source: 'suggested' },
  { id: 'archers', name: 'Archers', detail: 'Peach schnapps', category: 'liqueur', terms: ask, source: 'suggested', keywords: 'peach schnapps' },
  { id: 'baileys', name: 'Baileys', detail: 'Irish cream', category: 'liqueur', terms: ask, source: 'suggested', keywords: 'irish cream' },
  { id: 'aperol', name: 'Aperol', detail: 'Italian aperitif, for spritzes', category: 'liqueur', terms: ask, source: 'suggested', keywords: 'spritz' },
  { id: 'disaronno', name: 'Disaronno', detail: 'Amaretto', category: 'liqueur', terms: ask, source: 'suggested', keywords: 'amaretto' },
  { id: 'jagermeister', name: 'Jägermeister', detail: 'Herbal liqueur', category: 'liqueur', terms: ask, source: 'suggested', keywords: 'jager jagermeister shots' },
  { id: 'smirnoff', name: 'Smirnoff', detail: 'Vodka', category: 'vodka', terms: ask, source: 'suggested' },
  { id: 'gordons', name: 'Gordon’s', detail: 'London dry gin', category: 'gin', terms: ask, source: 'suggested', keywords: 'gordons pink' },
  { id: 'tanqueray', name: 'Tanqueray', detail: 'London dry gin', category: 'gin', terms: ask, source: 'suggested' },
  { id: 'captain-morgan', name: 'Captain Morgan Spiced', detail: 'Spiced rum', category: 'rum', terms: ask, source: 'suggested', keywords: 'morgan spice spiced' },
  { id: 'havana-club', name: 'Havana Club', detail: 'Cuban rum', category: 'rum', terms: ask, source: 'suggested' },
  { id: 'jameson', name: 'Jameson', detail: 'Irish whiskey', category: 'whiskey', terms: ask, source: 'suggested', keywords: 'whisky irish' },
  { id: 'patron', name: 'Patrón Silver', detail: 'Premium tequila', category: 'tequila', terms: ask, source: 'suggested', keywords: 'patron tequila' },
  { id: 'olmeca', name: 'Olmeca', detail: 'Tequila', category: 'tequila', terms: ask, source: 'suggested', keywords: 'tequila shots' },
  { id: 'heineken', name: 'Heineken', detail: 'Lager', category: 'beer', terms: ask, source: 'suggested' },
  { id: 'stella-artois', name: 'Stella Artois', detail: 'Belgian lager', category: 'beer', terms: ask, source: 'suggested', keywords: 'stella' },
  { id: 'guinness', name: 'Guinness', detail: 'Stout', category: 'beer', terms: ask, source: 'suggested', keywords: 'stout' },
  { id: 'peroni-zero', name: 'Peroni 0.0', detail: 'Alcohol-free lager', category: 'beer', terms: ask, source: 'suggested', keywords: 'alcohol free zero non alcoholic' },
];
// MENU-DATA-END

export const findDrink = (id: string) => MENU.find((d) => d.id === id) ?? null;

// ─── Cocktails ───────────────────────────────────────────────────────────────
// Jake, 11 Nov 2026: with all-inclusive drinks, guests choose cocktails at no
// extra cost. How many is not settled: four is our working limit, to confirm.

export interface Cocktail { id: string; name: string; detail: string }

export const MAX_COCKTAILS = 4;

export const COCKTAILS: Cocktail[] = [
  { id: 'pornstar-martini', name: 'Pornstar Martini', detail: 'Vanilla vodka, passion fruit, prosecco on the side' },
  { id: 'espresso-martini', name: 'Espresso Martini', detail: 'Vodka, coffee liqueur, fresh espresso' },
  { id: 'mojito', name: 'Mojito', detail: 'White rum, lime, mint, soda' },
  { id: 'aperol-spritz', name: 'Aperol Spritz', detail: 'Aperol, prosecco, soda, orange' },
  { id: 'margarita', name: 'Margarita', detail: 'Tequila, triple sec, lime' },
  { id: 'cosmopolitan', name: 'Cosmopolitan', detail: 'Vodka, triple sec, cranberry, lime' },
  { id: 'strawberry-daiquiri', name: 'Strawberry Daiquiri', detail: 'White rum, strawberry, lime' },
  { id: 'pina-colada', name: 'Piña Colada', detail: 'White rum, coconut, pineapple' },
  { id: 'old-fashioned', name: 'Old Fashioned', detail: 'Bourbon, sugar, bitters, orange' },
  { id: 'gin-fizz', name: 'Gin Fizz', detail: 'Gin, lemon, sugar, soda' },
  { id: 'negroni', name: 'Negroni', detail: 'Gin, vermouth, bitter orange' },
  { id: 'virgin-mojito', name: 'Virgin Mojito', detail: 'Lime, mint, soda. No alcohol' },
];
export const findCocktail = (id: string) => COCKTAILS.find((c) => c.id === id) ?? null;

/** The chosen drinks as a menu: one row for each kind of drink, cocktails last. Bottles are not on the menu. */
export function menuOf(menu: readonly string[], cocktails: readonly string[]): { name: string; drinks: string[] }[] {
  const chosen = [...new Set(menu)].map(findDrink).filter((d): d is Drink => d !== null && d.terms.kind !== 'bottle');
  const rows = DRINK_CATEGORIES
    .map((c) => ({ name: c.name, drinks: chosen.filter((d) => d.category === c.id).map((d) => d.name) }))
    .filter((c) => c.drinks.length > 0);
  const mixed = [...new Set(cocktails)].map(findCocktail).filter((c): c is Cocktail => c !== null).slice(0, MAX_COCKTAILS).map((c) => c.name);
  if (mixed.length > 0) rows.push({ name: 'Cocktails', drinks: mixed });
  return rows;
}

/** The menu every all-inclusive package starts with. */
export function standardMenu(): string[] {
  return MENU.filter((d) => d.terms.kind === 'standard').map((d) => d.id);
}

/** Extra per guest for the upgrades ticked. */
export function upgradesPerHead(selected: readonly string[]): Pence {
  let total = 0;
  for (const id of new Set(selected)) {
    const d = findDrink(id);
    if (d?.terms.kind === 'upgrade') total += d.terms.perHead;
  }
  return total;
}

const fold = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();

/** Search the menu by name, type or category. Every word typed must match. */
export function searchMenu(query: string): Drink[] {
  const words = fold(query).split(' ').filter(Boolean);
  if (words.length === 0) return MENU;
  return MENU.filter((d) => {
    const category = DRINK_CATEGORIES.find((c) => c.id === d.category)?.name ?? '';
    const hay = fold(`${d.name} ${d.detail} ${category} ${d.keywords ?? ''}`);
    return words.every((w) => hay.includes(w));
  });
}

/** "+£3 a guest", "Included", "£69 a bottle", "Price to confirm". */
export function termsLabel(terms: DrinkTerms): string {
  switch (terms.kind) {
    case 'standard': return 'Included';
    case 'included': return 'Included';
    case 'upgrade': return `+£${terms.perHead / 100} a guest`;
    case 'bottle': return `£${terms.perBottle / 100} a bottle`;
    case 'ask': return 'Price to confirm';
  }
}
