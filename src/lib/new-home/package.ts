// "Build your package": the quote logic behind the new homepage's step-by-step
// form. It reuses the pricing engine (whole pence, staff at £28/person/hour +
// VAT on party time, unknown prices shown as "to confirm", never £0).

import { BARS, STAFF_RATE, suggestedStaff, findBar } from '../visual-quote/catalogue.ts';
import { buildQuote, EMPTY_INPUT, type QuoteInput, type QuoteLine, type QuoteResult } from '../visual-quote/engine.ts';
import type { Pence } from '../visual-quote/money.ts';

export const PACKAGE_STEPS = [
  { id: 'guests', label: 'Guests', title: 'How many guests?' },
  { id: 'bar', label: 'Bar', title: 'Choose your bar' },
  { id: 'colour', label: 'Colour', title: 'Make it yours' },
  { id: 'glassware', label: 'Glassware', title: 'Glassware' },
  { id: 'ice', label: 'Ice', title: 'Ice' },
  { id: 'fridges', label: 'Fridges', title: 'Fridges' },
  { id: 'staff', label: 'Staff', title: 'Bartenders' },
  { id: 'drinks', label: 'Drinks', title: 'Drinks' },
  { id: 'details', label: 'Your quote', title: 'Your quote' },
] as const;
export type StepId = (typeof PACKAGE_STEPS)[number]['id'];
export const isStepId = (v: unknown): v is StepId => PACKAGE_STEPS.some((s) => s.id === v);
export const stepIndex = (id: StepId) => PACKAGE_STEPS.findIndex((s) => s.id === id);

// ─── Bars ───────────────────────────────────────────────────────────────────

/** Guest numbers from the current site's bar cards ("Up to N guests"). To confirm. */
export const BAR_GUESTS: Record<string, number | null> = {
  'bar-1-5m': 50,
  'bar-3m': 100,
  'bar-4-5m': 150,
  'bar-horseshoe': null,
  'bar-full-horseshoe': 250,
  'bar-curved-mirror': null,
};

/** The smallest bar that suits the guest count (the largest for big parties). */
export function recommendedBarId(guests: number): string {
  if (guests <= 50) return 'bar-1-5m';
  if (guests <= 100) return 'bar-3m';
  if (guests <= 150) return 'bar-4-5m';
  return 'bar-full-horseshoe';
}

/** Clean white studio renders of each bar (cut out), with the main front panel's
 *  corners (% of the image: top-left, top-right, bottom-right, bottom-left) so a
 *  "your artwork here" panel can sit on it in perspective. */
export interface BarArt { src: string; width: number; height: number; panel: [number, number][]; mirror?: boolean }

export const BAR_ART: Record<string, BarArt> = {
  'bar-1-5m': { src: '/images/new-home/bars/bar-1-5m.webp', width: 1176, height: 991, panel: [[4.08, 11.2], [76.28, 23.41], [75.77, 96.67], [5.53, 74.87]] },
  'bar-3m': { src: '/images/new-home/bars/bar-3m.webp', width: 1200, height: 678, panel: [[11.06, 34.44], [97.09, 10.53], [95.86, 62.36], [11.58, 96.34]] },
  'bar-4-5m': { src: '/images/new-home/bars/bar-4-5m.webp', width: 1200, height: 804, panel: [[25.03, 45.63], [74.97, 45.72], [73.61, 96.41], [26.45, 96.41]] },
  'bar-horseshoe': { src: '/images/new-home/bars/bar-horseshoe.webp', width: 1200, height: 818, panel: [[25.61, 45.05], [74.75, 44.95], [73.17, 96.63], [27.04, 96.63]] },
  'bar-full-horseshoe': { src: '/images/new-home/bars/bar-full-horseshoe.webp', width: 1200, height: 575, panel: [[2.79, 27.6], [52.37, 43.94], [52.37, 96.04], [3.08, 69.68]] },
  'bar-curved-mirror': { src: '/images/new-home/bars/bar-curved-mirror.webp', width: 1200, height: 604, panel: [[32.42, 23.04], [78.92, 16.96], [78.85, 84.43], [32.36, 94.3]], mirror: true },
};

export const PACKAGE_BARS = BARS.filter((b) => BAR_ART[b.id]);

// ─── Colour and branding ────────────────────────────────────────────────────

export const LED_COLOURS = [
  { id: 'pink', name: 'Pink', hex: '#ff3d9a' },
  { id: 'purple', name: 'Purple', hex: '#9b5cff' },
  { id: 'blue', name: 'Blue', hex: '#2e7dff' },
  { id: 'aqua', name: 'Aqua', hex: '#19d3e6' },
  { id: 'green', name: 'Green', hex: '#2fdc6f' },
  { id: 'amber', name: 'Amber', hex: '#ffb020' },
  { id: 'red', name: 'Red', hex: '#ff3b3b' },
  { id: 'cycle', name: 'Colour cycle', hex: '#ff3b3b' },
] as const;
export type LedId = (typeof LED_COLOURS)[number]['id'];
export const findLed = (id: string | null) => LED_COLOURS.find((c) => c.id === id) ?? null;

// ─── State ──────────────────────────────────────────────────────────────────

export type DrinksChoice = 'own' | 'drinks-all-inclusive' | 'drinks-cocktails' | 'drinks-alcohol-free';

export interface PackageState {
  guests: number;
  barId: string | null;
  /** null = classic white, no LED. */
  led: LedId | null;
  branded: boolean;
  glasses: Record<string, number>;
  iceBags: number;
  igloos: number;
  fridges: number;
  /** null until the guest reaches the staff step (then the suggestion is filled in). */
  staffCount: number | null;
  date: string | null;
  start: string;
  end: string;
  drinks: DrinksChoice;
  postcode: string;
}

export const GUESTS_MIN = 10;
export const GUESTS_MAX = 2000;

export const DEFAULT_PACKAGE: PackageState = {
  guests: 100,
  barId: null,
  led: null,
  branded: false,
  glasses: {},
  iceBags: 0,
  igloos: 0,
  fridges: 0,
  staffCount: null,
  date: null,
  start: '19:00',
  end: '00:00',
  drinks: 'own',
  postcode: '',
};

export function suggestedBartenders(guests: number): { low: number; high: number } {
  return suggestedStaff(guests) ?? { low: 1, high: 1 };
}

/** What the state needs when the guest arrives on a step (pre-fills, never overrides a choice). */
export function onEnterStep(state: PackageState, step: StepId): PackageState {
  if (step === 'bar' && !state.barId) return { ...state, barId: recommendedBarId(state.guests) };
  if (step === 'staff' && state.staffCount === null) return { ...state, staffCount: suggestedBartenders(state.guests).low };
  return state;
}

const positive = (r: Record<string, number>) => Object.fromEntries(Object.entries(r).filter(([, n]) => n > 0));

export function toQuoteInput(s: PackageState): QuoteInput {
  return {
    ...EMPTY_INPUT,
    date: s.date,
    postcode: s.postcode,
    guests: s.guests,
    start: s.start,
    end: s.end,
    barId: s.barId,
    glasses: positive(s.glasses),
    iceAndStorage: positive({ 'ice-bag': s.iceBags, 'igloo-box': s.igloos, 'bar-fridge': s.fridges }),
    // Nothing chosen for ice yet: we'll advise once the bar is picked.
    iceAdvice: s.barId !== null && s.iceBags === 0 && s.igloos === 0,
    staffCount: s.staffCount ?? 0,
    drinksPackageId: s.drinks === 'own' ? null : s.drinks,
    drinksMinutes: null,
    extras: [],
  };
}

/** LED colour and custom branding sit with the bar; priced on confirmation. */
export function finishLines(s: PackageState): QuoteLine[] {
  if (!findBar(s.barId)) return [];
  const lines: QuoteLine[] = [];
  const led = findLed(s.led);
  if (led) {
    lines.push({
      id: 'bar-led', group: 'bar', title: 'LED bar lighting', detail: led.name,
      price: { kind: 'pending', reason: 'Price to confirm', optional: false },
    });
  }
  if (s.branded) {
    lines.push({
      id: 'bar-branded', group: 'bar', title: 'Custom branded panels', detail: 'Your artwork · free artwork service',
      price: { kind: 'pending', reason: 'Price to confirm', optional: false },
    });
  }
  return lines;
}

export interface PackageQuote {
  lines: QuoteLine[];
  pricedSubtotal: Pence;
  toConfirm: number;
  engine: QuoteResult;
}

export function buildPackageQuote(s: PackageState): PackageQuote {
  const engine = buildQuote(toQuoteInput(s));
  const extra = finishLines(s);
  const lines = [...engine.lines];
  const afterBar = lines.findIndex((l) => l.group !== 'bar');
  lines.splice(afterBar === -1 ? lines.length : afterBar, 0, ...extra);
  return {
    lines,
    pricedSubtotal: engine.pricedSubtotal,
    toConfirm: lines.filter((l) => l.price.kind === 'pending').length,
    engine,
  };
}

export const STAFF_RATE_PENCE = STAFF_RATE.unitPence;
