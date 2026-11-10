// Bar shapes, sizes and prices.
//
// Bars are built from 1.5m (5ft) sections and corner pieces (Jake, 10 Nov 2026):
//   1 section £215 · 2 sections (3m) £325 · each further section +£100
//   each corner piece +£100 · full round bar (mirror or LED) £1,200
// The horseshoe is six sections and two corners, about 10m.

import type { Pence } from '../visual-quote/money.ts';
import { formatPenceCompact } from '../visual-quote/money.ts';
import { PRICES, SECTION_METRES } from './prices.ts';

export type BarShapeId = 'straight' | 'l-shape' | 'horseshoe' | 'island' | 'curved' | 'round';
export type FinishId = 'white' | 'mirror' | 'shimmer' | 'love' | 'led';

/** How a bar is laid out, walking along its customer side. Every turn wraps
 *  round the bartenders (anticlockwise seen from above). */
export type BarModule =
  | { kind: 'section' }
  | { kind: 'corner' }
  | { kind: 'curve'; degrees: number };

export interface BarShape {
  id: BarShapeId;
  name: string;
  /** One plain line for the card. */
  blurb: string;
  /** 1.5m sections the guest can choose between (equal when the size is fixed). */
  minSections: number;
  maxSections: number;
  defaultSections: number;
  corners: number;
  pricing: 'sections' | 'round' | 'to-confirm';
  finishes: FinishId[];
  /** True when the price follows Jake's rules but he hasn't named this shape's price himself. */
  derivedPrice?: boolean;
}

export const BAR_SHAPES: BarShape[] = [
  {
    id: 'straight', name: 'Straight bar', blurb: 'One straight run. Add 1.5m sections to make it longer.',
    minSections: 1, maxSections: 6, defaultSections: 2, corners: 0, pricing: 'sections',
    finishes: ['white', 'mirror', 'shimmer', 'love'],
  },
  {
    id: 'l-shape', name: 'L-shaped bar', blurb: 'Two runs joined by a corner piece. Good against a wall or in a corner.',
    minSections: 2, maxSections: 10, defaultSections: 4, corners: 1, pricing: 'sections',
    finishes: ['white', 'mirror', 'shimmer'], derivedPrice: true,
  },
  {
    id: 'horseshoe', name: 'Horseshoe bar', blurb: 'Serves on three sides. Six 1.5m sections and two corner pieces.',
    minSections: 6, maxSections: 6, defaultSections: 6, corners: 2, pricing: 'sections',
    finishes: ['white', 'mirror', 'shimmer'],
  },
  {
    id: 'island', name: 'Island bar', blurb: 'A full island with two sections on every side. Guests can walk all the way round.',
    minSections: 8, maxSections: 8, defaultSections: 8, corners: 4, pricing: 'sections',
    finishes: ['white', 'mirror', 'shimmer'], derivedPrice: true,
  },
  {
    id: 'curved', name: 'Curved bar', blurb: 'A sweeping half circle of four curved sections, in LED or mirror.',
    minSections: 4, maxSections: 4, defaultSections: 4, corners: 0, pricing: 'to-confirm',
    finishes: ['led', 'mirror'],
  },
  {
    id: 'round', name: 'Full round bar', blurb: 'A complete 4m circle of eight curved sections, in LED or mirror. The centrepiece of the room.',
    minSections: 8, maxSections: 8, defaultSections: 8, corners: 0, pricing: 'round',
    finishes: ['led', 'mirror'],
  },
];

export const findShape = (id: string | null | undefined) => BAR_SHAPES.find((s) => s.id === id) ?? null;

export interface FinishInfo { id: FinishId; name: string; blurb: string }

export const FINISHES: FinishInfo[] = [
  { id: 'white', name: 'Classic white', blurb: 'Gloss white panels with a black edge.' },
  { id: 'mirror', name: 'Mirror', blurb: 'Mirrored panels that reflect the room.' },
  { id: 'shimmer', name: 'Shimmer', blurb: 'A wall of sequin discs that catch the light.' },
  { id: 'love', name: 'LOVE', blurb: 'Giant mirror letters across a white 3m bar.' },
  { id: 'led', name: 'LED', blurb: 'Lit panels that glow in any colour.' },
];
export const findFinish = (id: string | null | undefined) => FINISHES.find((f) => f.id === id) ?? null;

export interface BarChoice {
  shapeId: BarShapeId;
  sections: number;
  finishId: FinishId;
  /** Custom branded panels ("Your artwork here"). */
  branded: boolean;
}

/** The LOVE bar is two sections: "LO" and "VE". */
export const LOVE_SECTIONS = 2;

/** Finishes a bar of this shape and size comes in. */
export function finishesFor(shapeId: BarShapeId, sections: number): FinishId[] {
  const shape = findShape(shapeId) ?? BAR_SHAPES[0];
  return shape.finishes.filter((f) => f !== 'love' || (shape.id === 'straight' && sections === LOVE_SECTIONS));
}

/** Keeps a choice valid: sections inside the shape's range, a finish the bar comes in. */
export function normaliseBar(choice: BarChoice): BarChoice {
  const shape = findShape(choice.shapeId) ?? BAR_SHAPES[0];
  const sections = Math.min(shape.maxSections, Math.max(shape.minSections, Math.round(choice.sections) || shape.defaultSections));
  const finishes = finishesFor(shape.id, sections);
  const finishId = finishes.includes(choice.finishId) ? choice.finishId : finishes[0];
  // The LOVE bar is its own design, so it isn't offered with custom artwork as well.
  return { shapeId: shape.id, sections, finishId, branded: Boolean(choice.branded) && finishId !== 'love' };
}

/** Straight sections only: £215, £325, then £100 a section. */
export function sectionsPrice(sections: number): Pence {
  if (!Number.isSafeInteger(sections) || sections < 1) throw new Error(`A bar needs at least one section (got ${sections})`);
  if (sections === 1) return PRICES.barOneSection;
  return PRICES.barTwoSections + (sections - 2) * PRICES.barExtraSection;
}

export interface BarPrice { pence: Pence; working: string }

/** The bar's hire price, or null when the price isn't set yet (shown as "To confirm", never £0). */
export function barPrice(choice: BarChoice): BarPrice | null {
  const bar = normaliseBar(choice);
  const shape = findShape(bar.shapeId)!;
  if (shape.pricing === 'to-confirm') return null;
  if (shape.pricing === 'round') return { pence: PRICES.barRound, working: 'Full round bar' };
  const run = sectionsPrice(bar.sections);
  const corners = shape.corners * PRICES.barCorner;
  const sectionsLabel = `${bar.sections} × 1.5m ${bar.sections === 1 ? 'section' : 'sections'}`;
  return {
    pence: run + corners,
    working: shape.corners === 0
      ? sectionsLabel
      : `${sectionsLabel} ${formatPenceCompact(run)} + ${shape.corners} ${shape.corners === 1 ? 'corner' : 'corners'} ${formatPenceCompact(corners)}`,
  };
}

/** "3m", "4.5m" for straight runs. */
export function runLength(sections: number): string {
  return `${Number((sections * SECTION_METRES).toFixed(1))}m`;
}

/** What the guest sees as the bar's name: "3m bar", "Horseshoe bar". */
export function barName(choice: BarChoice): string {
  const bar = normaliseBar(choice);
  const shape = findShape(bar.shapeId)!;
  if (shape.id === 'straight') return `${runLength(bar.sections)} bar`;
  return shape.name;
}

/** The bar's name for the middle of a sentence: "your 3m bar", "your horseshoe bar", "your L-shaped bar". */
export function barNameInSentence(choice: BarChoice): string {
  const name = barName(choice);
  return /^[A-Z][a-z]/.test(name) ? name.charAt(0).toLowerCase() + name.slice(1) : name;
}

/** One line of size detail: "Two 1.5m sections · 10ft", "6 sections + 2 corners · about 10m". */
export function barSizeLabel(choice: BarChoice): string {
  const bar = normaliseBar(choice);
  const shape = findShape(bar.shapeId)!;
  const feet = bar.sections * 5;
  if (shape.id === 'straight') return `${runLength(bar.sections)} · ${feet}ft`;
  if (shape.id === 'curved') return 'Half circle';
  if (shape.id === 'round') return 'Full circle';
  const corners = `${shape.corners} ${shape.corners === 1 ? 'corner' : 'corners'}`;
  return `${bar.sections} sections + ${corners}`;
}

/** The modules that make up a bar, in order along its customer side. */
export function barModules(choice: BarChoice): { modules: BarModule[]; closed: boolean } {
  const bar = normaliseBar(choice);
  const run = (n: number): BarModule[] => Array.from({ length: n }, () => ({ kind: 'section' }) as BarModule);
  const corner: BarModule = { kind: 'corner' };
  switch (bar.shapeId) {
    case 'straight':
      return { modules: run(bar.sections), closed: false };
    case 'l-shape': {
      const front = Math.ceil(bar.sections / 2);
      return { modules: [...run(front), corner, ...run(bar.sections - front)], closed: false };
    }
    case 'horseshoe':
      return { modules: [...run(2), corner, ...run(2), corner, ...run(2)], closed: false };
    case 'island':
      return { modules: [...run(2), corner, ...run(2), corner, ...run(2), corner, ...run(2), corner], closed: true };
    case 'curved':
      return { modules: Array.from({ length: bar.sections }, () => ({ kind: 'curve', degrees: 45 }) as BarModule), closed: false };
    case 'round':
      return { modules: Array.from({ length: bar.sections }, () => ({ kind: 'curve', degrees: 45 }) as BarModule), closed: true };
  }
}

// ─── Recommendations ────────────────────────────────────────────────────────

/** DERIVED from Jake's "50 guests: a 3m bar": one 1.5m section for every 25 guests. */
export const GUESTS_PER_SECTION = 25;

export function recommendBar(guests: number): { shapeId: BarShapeId; sections: number } {
  const sections = Math.max(1, Math.ceil(guests / GUESTS_PER_SECTION));
  if (sections <= 5) return { shapeId: 'straight', sections };
  if (guests <= 200) return { shapeId: 'horseshoe', sections: 6 };
  return { shapeId: 'island', sections: 8 };
}

/** Jake: 3 staff for 50 guests, 5 for 100, never fewer than 2. So one, plus one for every 25 guests. */
export function recommendStaff(guests: number): number {
  return Math.max(PRICES.staffMinimum, 1 + Math.ceil(Math.max(0, guests) / 25));
}
