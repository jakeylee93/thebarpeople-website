// "Build your package": choices in, a priced quote out.
//
// Whole pence throughout. Anything without an agreed price is a "To confirm"
// line and is left out of the totals, never shown as £0.

import { z } from 'zod';
import { GLASSES } from './glasses.ts';
import { formatPence, formatPenceCompact, multiplyPence, rateForMinutes, sumPence, type Pence } from '../visual-quote/money.ts';
import { formatDuration, formatHoursShort, formatTime } from '../visual-quote/time.ts';
import {
  BAR_SHAPES, barName, barPrice, barSizeLabel, findFinish, findShape, normaliseBar, recommendBar, recommendStaff,
  type BarChoice, type BarShapeId, type FinishId,
} from './bars.ts';
import { drinksPerHead, findDrink, standardMenu } from './drinks.ts';
import { findMarqueeItem, hasStructure, marqueeGroupOf } from './marquee.ts';
import { PRICES } from './prices.ts';
import {
  buildSchedule, COLLECTION_DAYS, STAFF_EARLY_OPTIONS, usableDate,
  type CollectionDays, type Schedule, type SetupDay, type StaffEarly,
} from './schedule.ts';

export const GUESTS_MIN = 10;
export const GUESTS_MAX = 1000;
export const MAX_REQUESTS = 6;
export const STAFF_MAX = 60;

export type DrinksMode = 'all-inclusive' | 'own';

export interface QuoteState {
  guests: number;
  date: string | null;
  /** When the bar opens and closes, "HH:MM" in half hours. */
  open: string;
  close: string;
  /** Null until the guest reaches the bar step (the recommendation is then filled in). */
  bar: BarChoice | null;
  /** True once the guest has chosen their own shape or size; the bar then stops following the guest count. */
  barPicked: boolean;
  /** Null until the guest reaches the drinks step (all-inclusive is then ticked). */
  drinksMode: DrinksMode | null;
  /** Drinks ticked on the all-inclusive menu. */
  menu: string[];
  /** Champagne by the bottle: drink id → bottles. */
  bottles: Record<string, number>;
  /** Drinks the guest asked for that aren't on our list. */
  requests: string[];
  glasses: Record<string, number>;
  igloos: number;
  fridgesSingle: number;
  fridgesDouble: number;
  /** Null until the guest reaches the staff step (the recommendation is then filled in). */
  staffCount: number | null;
  /** True once the guest has chosen their own number; it then stops following the guest count. */
  staffPicked: boolean;
  /** Minutes the team arrives before the bar opens (at least 30). */
  staffEarly: StaffEarly;
  setupDay: SetupDay;
  collectionDays: CollectionDays;
  postcode: string;
  marquee: boolean;
  marqueeItems: Record<string, number>;
}

export const DEFAULT_STATE: QuoteState = {
  guests: 100,
  date: null,
  open: '18:00',
  close: '23:00',
  bar: null,
  barPicked: false,
  drinksMode: null,
  menu: standardMenu(),
  bottles: {},
  requests: [],
  glasses: {},
  igloos: 0,
  fridgesSingle: 0,
  fridgesDouble: 0,
  staffCount: null,
  staffPicked: false,
  staffEarly: 30,
  setupDay: 'day-before',
  collectionDays: 1,
  postcode: '',
  marquee: false,
  marqueeItems: {},
};

// ─── Recommendations and step defaults ──────────────────────────────────────

export interface Recommendation {
  bar: { shapeId: BarShapeId; sections: number };
  staff: number;
}

export function recommend(guests: number): Recommendation {
  return { bar: recommendBar(guests), staff: recommendStaff(guests) };
}

const defaultFinish = (shapeId: BarShapeId): FinishId => findShape(shapeId)!.finishes[0];

export function recommendedBar(guests: number): BarChoice {
  const rec = recommendBar(guests);
  return { ...rec, finishId: defaultFinish(rec.shapeId), branded: false };
}

/** Pre-fills a section the first time the guest reaches it. Never overrides a choice. */
export function reach(state: QuoteState, section: 'bar' | 'drinks' | 'staff'): QuoteState {
  if (section === 'bar' && state.bar === null) return { ...state, bar: recommendedBar(state.guests) };
  if (section === 'drinks' && state.drinksMode === null) return { ...state, drinksMode: 'all-inclusive' };
  if (section === 'staff' && state.staffCount === null) return { ...state, staffCount: recommendStaff(state.guests) };
  return state;
}

/**
 * Changing the guest count moves the bar and team along with it, unless the
 * guest picked their own. A bar is also left alone when moving it would lose
 * the finish they chose (the LOVE bar only comes as a 3m bar, for one).
 */
export function setGuests(state: QuoteState, guests: number): QuoteState {
  const next = Math.min(GUESTS_MAX, Math.max(GUESTS_MIN, Math.round(Number.isFinite(guests) ? guests : state.guests)));
  const now = recommend(next);
  let bar = state.bar;
  if (bar && !state.barPicked) {
    const moved = normaliseBar({ ...bar, shapeId: now.bar.shapeId, sections: now.bar.sections });
    if (moved.finishId === bar.finishId) bar = moved;
  }
  const staffCount = state.staffCount !== null && !state.staffPicked ? now.staff : state.staffCount;
  return { ...state, guests: next, bar, staffCount };
}

/** Picks a shape, keeping the finish where the new shape comes in it. Picking our recommendation lets the bar follow the guest count again. */
export function chooseShape(state: QuoteState, shapeId: BarShapeId, sections?: number): QuoteState {
  const shape = findShape(shapeId) ?? BAR_SHAPES[0];
  const current = state.bar;
  const bar = normaliseBar({
    shapeId: shape.id,
    sections: sections ?? (current?.shapeId === shape.id ? current.sections : shape.defaultSections),
    finishId: current?.finishId && shape.finishes.includes(current.finishId) ? current.finishId : shape.finishes[0],
    branded: current?.branded ?? false,
  });
  const rec = recommendBar(state.guests);
  return { ...state, bar, barPicked: !(bar.shapeId === rec.shapeId && bar.sections === rec.sections) };
}

/** Sets the number of bartenders (never fewer than two). Choosing our recommendation lets it follow the guest count again. */
export function chooseStaff(state: QuoteState, count: number): QuoteState {
  const staffCount = Math.min(STAFF_MAX, Math.max(PRICES.staffMinimum, Math.round(Number.isFinite(count) ? count : PRICES.staffMinimum)));
  return { ...state, staffCount, staffPicked: staffCount !== recommendStaff(state.guests) };
}

// ─── The quote ──────────────────────────────────────────────────────────────

export type LineGroup = 'bar' | 'drinks' | 'glassware' | 'ice' | 'staff' | 'delivery' | 'marquee';

export const GROUP_LABELS: Record<LineGroup, string> = {
  bar: 'Bar', drinks: 'Drinks', glassware: 'Glassware', ice: 'Ice and fridges', staff: 'Bartenders',
  delivery: 'Delivery and set-up', marquee: 'Marquee',
};

export type LinePrice =
  | { kind: 'priced'; pence: Pence; working: string }
  | { kind: 'pending'; reason: string };

export interface QuoteLine {
  id: string;
  group: LineGroup;
  title: string;
  detail: string;
  price: LinePrice;
}

export interface Quote {
  lines: QuoteLine[];
  /** Sum of the priced lines, ex VAT. */
  subtotal: Pence;
  vat: Pence;
  total: Pence;
  /** Lines the team still needs to price. */
  toConfirm: number;
  schedule: Schedule | null;
  /** Why there is no schedule yet (for the guest). */
  scheduleIssue: string | null;
  recommended: Recommendation;
  /** The all-inclusive price per guest for these hours, when it applies. */
  drinksPerHead: Pence | null;
  /** Short notes for the guest, in order. */
  notes: string[];
  /** What the clocks changing does to the hours that night, in words. Null on an ordinary night. */
  clockNote: string | null;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;
const pending = (reason = 'To confirm'): LinePrice => ({ kind: 'pending', reason });
const whole = (n: unknown, max: number) => (typeof n === 'number' && Number.isFinite(n) ? Math.min(max, Math.max(0, Math.floor(n))) : 0);

/** VAT at the standard rate, to the nearest penny (half a penny rounds up). */
export function vatOn(subtotal: Pence): Pence {
  if (!Number.isSafeInteger(subtotal) || subtotal < 0) throw new Error(`Not an amount in pence: ${subtotal}`);
  return Math.floor((subtotal * PRICES.vatBasisPoints + 5000) / 10000);
}

/** Says in words what a clock change does to the hours, or null on an ordinary night. */
function clockChangeNote(schedule: Schedule): string | null {
  const change = schedule.timing.clockChange;
  if (!change) return null;
  const way = change.direction === 'back' ? 'go back' : 'go forward';
  const hours = formatDuration(schedule.barMinutes);
  const by = formatDuration(Math.abs(change.differenceMinutes));
  if (change.differenceMinutes > 0) return `The clocks ${way} that night, so the bar is open for ${hours}: ${by} more than the clock times show.`;
  if (change.differenceMinutes < 0) return `The clocks ${way} that night, so the bar is open for ${hours}: ${by} less than the clock times show.`;
  return `The clocks ${way} that night, so we’ll confirm your exact times with you.`;
}

export function buildQuote(state: QuoteState): Quote {
  const lines: QuoteLine[] = [];
  const notes: string[] = [];
  const guests = Math.min(GUESTS_MAX, Math.max(1, Math.floor(state.guests) || 1));
  const recommended = recommend(guests);

  const built = buildSchedule({
    date: state.date, open: state.open, close: state.close, guests,
    staffEarly: state.staffEarly, setupDay: state.setupDay, collectionDays: state.collectionDays,
  });
  const schedule = built.ok ? built.schedule : null;
  const scheduleIssue = built.ok ? null : built.reason;

  // ── Bar ──
  const bar = state.bar ? normaliseBar(state.bar) : null;
  if (bar) {
    const price = barPrice(bar);
    const finish = findFinish(bar.finishId);
    lines.push({
      id: 'bar', group: 'bar', title: barName(bar),
      detail: [barSizeLabel(bar), bar.branded ? 'Custom branded' : finish?.name].filter(Boolean).join(' · '),
      price: price ? { kind: 'priced', pence: price.pence, working: price.working } : pending('Price to confirm'),
    });
    if (bar.branded) {
      lines.push({
        id: 'bar-branded', group: 'bar', title: 'Custom branded panels',
        detail: 'Your artwork on every panel · free artwork service', price: pending('Price to confirm'),
      });
    }
  }

  // ── Drinks ──
  let perHead: Pence | null = null;
  if (state.drinksMode === 'all-inclusive') {
    if (schedule) {
      perHead = drinksPerHead(schedule.barMinutes);
      lines.push({
        id: 'drinks-package', group: 'drinks', title: 'All-inclusive drinks',
        detail: `Beer, wine, spirits and soft drinks · ${formatDuration(schedule.barMinutes)}`,
        price: {
          kind: 'priced', pence: multiplyPence(perHead, guests),
          working: `${plural(guests, 'guest', 'guests')} × ${formatPence(perHead)}`,
        },
      });
    } else {
      lines.push({
        id: 'drinks-package', group: 'drinks', title: 'All-inclusive drinks',
        detail: 'Beer, wine, spirits and soft drinks', price: pending('Add your bar times'),
      });
    }
    for (const id of new Set(state.menu)) {
      const drink = findDrink(id);
      if (!drink) continue;
      if (drink.terms.kind === 'upgrade') {
        lines.push({
          id: `drink-${drink.id}`, group: 'drinks', title: drink.name, detail: 'Menu upgrade',
          price: {
            kind: 'priced', pence: multiplyPence(drink.terms.perHead, guests),
            working: `${plural(guests, 'guest', 'guests')} × ${formatPenceCompact(drink.terms.perHead)}`,
          },
        });
      } else if (drink.terms.kind === 'ask') {
        lines.push({ id: `drink-${drink.id}`, group: 'drinks', title: drink.name, detail: 'Premium choice', price: pending('Price to confirm') });
      }
    }
    for (const [id, raw] of Object.entries(state.bottles)) {
      const drink = findDrink(id);
      const qty = whole(raw, 500);
      if (!drink || drink.terms.kind !== 'bottle' || qty === 0) continue;
      lines.push({
        id: `bottle-${drink.id}`, group: 'drinks', title: drink.name, detail: plural(qty, 'bottle', 'bottles'),
        price: {
          kind: 'priced', pence: multiplyPence(drink.terms.perBottle, qty),
          working: `${qty} × ${formatPenceCompact(drink.terms.perBottle)}`,
        },
      });
    }
    state.requests.slice(0, MAX_REQUESTS).forEach((text, i) => {
      // Cut by whole characters, so an emoji or accented letter is never split.
      const trimmed = Array.from(text.replace(/\s+/g, ' ').trim()).slice(0, 40).join('');
      const name = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      if (name) lines.push({ id: `request-${i}`, group: 'drinks', title: name, detail: 'Your request', price: pending('Price to confirm') });
    });
  } else if (state.drinksMode === 'own') {
    notes.push('You’re supplying the drinks. We bring the bar and the team to serve them.');
  }

  // ── Glassware ──
  for (const glass of GLASSES) {
    const qty = whole(state.glasses[glass.id], 5000);
    if (qty === 0) continue;
    lines.push({
      id: glass.id, group: 'glassware', title: glass.name, detail: plural(qty, 'glass', 'glasses'),
      price: { kind: 'priced', pence: multiplyPence(glass.price, qty), working: `${qty} × ${formatPence(glass.price)}` },
    });
  }

  // ── Ice and fridges ──
  const counted: [string, string, string, string, number, Pence][] = [
    ['igloo', 'Igloo of ice', 'igloo', 'igloos', whole(state.igloos, 50), PRICES.igloo],
    ['fridge-single', 'Single bar fridge', 'fridge', 'fridges', whole(state.fridgesSingle, 50), PRICES.fridgeSingle],
    ['fridge-double', 'Double back-bar fridge', 'fridge', 'fridges', whole(state.fridgesDouble, 50), PRICES.fridgeDouble],
  ];
  for (const [id, title, one, many, qty, each] of counted) {
    if (qty === 0) continue;
    lines.push({
      id, group: 'ice', title, detail: plural(qty, one, many),
      price: { kind: 'priced', pence: multiplyPence(each, qty), working: `${qty} × ${formatPenceCompact(each)}` },
    });
  }

  // ── Bartenders: always on a job with a bar or drinks, and never fewer than two ──
  // Until the guest has chosen a number, the recommended team is quoted.
  const needsTeam = bar !== null || state.drinksMode !== null;
  const chosenStaff = state.staffCount ?? (needsTeam ? recommended.staff : null);
  if (chosenStaff !== null) {
    const count = Math.min(STAFF_MAX, Math.max(PRICES.staffMinimum, Math.floor(chosenStaff) || PRICES.staffMinimum));
    if (schedule) {
      const each = rateForMinutes(PRICES.staffPerHour, schedule.staffMinutes);
      lines.push({
        id: 'staff', group: 'staff', title: 'Bartenders',
        detail: `${plural(count, 'bartender', 'bartenders')} · ${formatTime(schedule.staffArrive)} to ${formatTime(schedule.staffFinish)}`,
        price: {
          kind: 'priced', pence: multiplyPence(each, count),
          working: `${count} × ${formatHoursShort(schedule.staffMinutes)} × ${formatPence(PRICES.staffPerHour)}`,
        },
      });
      notes.push(
        `Your team arrives at ${formatTime(schedule.staffArrive)}, ${schedule.staffEarly} minutes before the bar opens, and finishes at ${formatTime(schedule.staffFinish)}, 30 minutes after it closes.`,
      );
    } else {
      lines.push({ id: 'staff', group: 'staff', title: 'Bartenders', detail: plural(count, 'bartender', 'bartenders'), price: pending('Add your bar times') });
    }
  }

  // ── Delivery, set-up and collection: one fee whenever we bring equipment ──
  const hasEquipment = lines.some((l) => l.group === 'bar' || l.group === 'glassware' || l.group === 'ice');
  if (hasEquipment) {
    const parts: string[] = [];
    if (schedule) {
      parts.push(schedule.setupDay === 'on-the-day' ? 'Set up on the day' : 'Set up the day before');
      parts.push(`collected ${state.collectionDays === 1 ? 'the day after' : `${state.collectionDays} days after`}`);
    }
    const postcode = state.postcode.trim().toUpperCase();
    if (postcode) parts.push(`to ${postcode}`);
    lines.push({
      id: 'delivery', group: 'delivery', title: 'Delivery, set-up and collection',
      detail: parts.join(' · ') || 'Bar and equipment',
      price: { kind: 'priced', pence: PRICES.delivery, working: 'Bars and equipment' },
    });
    if (schedule) {
      notes.push(
        `We need ${formatDuration(schedule.setupLead)} to set up for ${plural(guests, 'guest', 'guests')}` +
        (schedule.setupDay === 'on-the-day' && schedule.setupOnTheDayBy !== null
          ? `, so we’ll arrive by ${formatTime(schedule.setupOnTheDayBy)} on the day.`
          : ', so we’ll set up the day before.'),
      );
    }
  }

  // ── Marquee ──
  if (state.marquee) {
    const structure = hasStructure(state.marqueeItems);
    for (const [id, raw] of Object.entries(state.marqueeItems)) {
      const item = findMarqueeItem(id);
      const group = marqueeGroupOf(id);
      if (!item || !group) continue;
      const qty = whole(raw, group.max);
      if (qty === 0) continue;
      // Extras are only offered with a marquee.
      if (group.kind === 'extra' && !structure) continue;
      lines.push({
        id: `marquee-${item.id}`, group: 'marquee', title: item.name,
        detail: item.unit === 'each' ? `Quantity: ${qty}` : `${qty} ${item.unit}${qty === 1 ? '' : 's'}`,
        price: item.price === null
          ? pending('Price to confirm')
          : { kind: 'priced', pence: multiplyPence(item.price, qty), working: `${qty} × ${formatPenceCompact(item.price)}` },
      });
    }
    if (!lines.some((l) => l.group === 'marquee')) {
      lines.push({ id: 'marquee', group: 'marquee', title: 'Marquee', detail: 'Choose your marquee and extras', price: pending('Price to confirm') });
    }
  }

  const clockNote = schedule ? clockChangeNote(schedule) : null;
  if (clockNote) notes.push(clockNote);

  const order: LineGroup[] = ['bar', 'drinks', 'glassware', 'ice', 'staff', 'delivery', 'marquee'];
  lines.sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group));

  const subtotal = sumPence(lines.flatMap((l) => (l.price.kind === 'priced' ? [l.price.pence] : [])));
  const vat = vatOn(subtotal);
  return {
    lines, subtotal, vat, total: sumPence([subtotal, vat]),
    toConfirm: lines.filter((l) => l.price.kind === 'pending').length,
    schedule, scheduleIssue, recommended, drinksPerHead: perHead, notes, clockNote,
  };
}

// ─── Saving and sharing ─────────────────────────────────────────────────────

// Each choice is checked on its own. One that doesn't fit (a half-typed date,
// a drink we no longer list, a field added after the link was made) falls back
// to its starting value, so a single bad value never costs the whole quote.

const time = z.string().regex(/^([01]\d|2[0-3]):(00|30)$/);
const count = (max: number) => z.number().int().min(0).max(max);
const shapeIds = BAR_SHAPES.map((s) => s.id) as [BarShapeId, ...BarShapeId[]];
const D = DEFAULT_STATE;

const StateSchema = z.object({
  guests: z.number().int().min(GUESTS_MIN).max(GUESTS_MAX).catch(D.guests),
  date: z.string().refine((v) => usableDate(v) !== null).nullable().catch(null),
  open: time.catch(D.open),
  close: time.catch(D.close),
  bar: z.object({
    shapeId: z.enum(shapeIds),
    sections: z.number().int().min(1).max(12),
    finishId: z.enum(['white', 'mirror', 'shimmer', 'love', 'led']),
    branded: z.boolean(),
  }).nullable().catch(null),
  barPicked: z.boolean().catch(false),
  drinksMode: z.enum(['all-inclusive', 'own']).nullable().catch(null),
  menu: z.array(z.string().max(40)).max(80).catch(D.menu),
  bottles: z.record(z.string().max(40), count(500)).catch({}),
  requests: z.array(z.string().max(160)).max(MAX_REQUESTS).catch([]),
  glasses: z.record(z.string().max(40), count(5000)).catch({}),
  igloos: count(50).catch(0),
  fridgesSingle: count(50).catch(0),
  fridgesDouble: count(50).catch(0),
  staffCount: z.number().int().min(PRICES.staffMinimum).max(STAFF_MAX).nullable().catch(null),
  staffPicked: z.boolean().catch(false),
  staffEarly: z.union([z.literal(30), z.literal(60), z.literal(90), z.literal(120)]).catch(D.staffEarly),
  setupDay: z.enum(['day-before', 'on-the-day']).catch(D.setupDay),
  collectionDays: z.union([z.literal(1), z.literal(2), z.literal(3)]).catch(D.collectionDays),
  postcode: z.string().max(10).catch(''),
  marquee: z.boolean().catch(false),
  marqueeItems: z.record(z.string().max(60), count(2000)).catch({}),
});

/** Checks saved or shared choices. Returns null only when the value isn't a set of choices at all. */
export function parseState(value: unknown): QuoteState | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null;
  const parsed = StateSchema.safeParse(value);
  if (!parsed.success) return null;
  const s = parsed.data as QuoteState;
  // Only things we still list are kept, so old ids never pile up in links.
  const known = <T,>(record: Record<string, T>, ok: (id: string) => boolean) =>
    Object.fromEntries(Object.entries(record).filter(([id]) => ok(id))) as Record<string, T>;
  return {
    ...s,
    bar: s.bar ? normaliseBar(s.bar) : null,
    barPicked: s.bar !== null && s.barPicked,
    staffPicked: s.staffCount !== null && s.staffPicked,
    menu: [...new Set(s.menu)].filter((id) => findDrink(id) !== null),
    bottles: known(s.bottles, (id) => findDrink(id)?.terms.kind === 'bottle'),
    glasses: known(s.glasses, (id) => GLASSES.some((g) => g.id === id)),
    marqueeItems: known(s.marqueeItems, (id) => findMarqueeItem(id) !== null),
  };
}

/** The choices as a compact, URL-safe string for a share link. */
export function encodeState(state: QuoteState): string {
  // The postcode is never saved or shared.
  const json = JSON.stringify({ ...state, postcode: '' });
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeState(encoded: string): QuoteState | null {
  try {
    if (!/^[A-Za-z0-9_-]{1,6000}$/.test(encoded)) return null;
    const binary = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return parseState(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

export { COLLECTION_DAYS, STAFF_EARLY_OPTIONS };
