// Quote engine for the visual quote-builder prototype.
//
// Pure and deterministic: same answers in, same itemised quote out. Integer
// pence throughout. Rules it follows:
//   - Only authorised prices are charged (today: staff at £28/person/hour).
//   - Anything without an authorised price is a PENDING line ("to confirm"),
//     never £0, and makes the whole quote a provisional estimate.
//   - Staff are priced on the chosen party start → finish only. A suggested
//     arrival an hour earlier is shown but neither billed nor promised free.
//   - A drinks package that already covers bar/staff/glassware/ice marks those
//     lines "Included" so nothing is charged twice.
//   - VAT: amounts are ex VAT ("+ VAT"), as on thebarpeople.co.uk, until the
//     business's own VAT settings are verified.

import type { Pence } from './money.ts';
import type { IncludedCategory } from './catalogue.ts';
import type { PartyTiming } from './time.ts';
import { formatPence, multiplyPence, rateForMinutes, sumPence } from './money.ts';
import {
  computeTiming, formatDuration, formatHoursShort, formatTime, SUGGESTED_ARRIVAL_LEAD_MINUTES,
} from './time.ts';
import {
  DELIVERY, EXTRAS, GLASSES, ICE_AND_STORAGE, STAFF_RATE, findBar, findPackage,
} from './catalogue.ts';

// ─── Policy ─────────────────────────────────────────────────────────────────

export type VatPolicy =
  | { status: 'unverified' }
  | { status: 'verified'; rateBasisPoints: number; rounding: 'nearest-penny' | 'round-down' };

export interface QuotePolicy {
  vat: VatPolicy;
  /** First number of the NEW website sequence. Shown as an example only; never allocated here. */
  exampleReference: number;
  arrivalLeadMinutes: number;
}

export const QUOTE_POLICY: QuotePolicy = {
  vat: { status: 'unverified' },
  exampleReference: 3033,
  arrivalLeadMinutes: SUGGESTED_ARRIVAL_LEAD_MINUTES,
};

// ─── Input / output ─────────────────────────────────────────────────────────

export const NO_BAR = 'none';
export const NO_PACKAGE = 'none';

export interface QuoteInput {
  date: string | null;
  postcode: string;
  guests: number | null;
  start: string | null;
  end: string | null;
  /** Bar id, NO_BAR, or null while undecided. */
  barId: string | null;
  glasses: Record<string, number>;
  iceAndStorage: Record<string, number>;
  /** "Let us advise on ice" instead of counting bags. */
  iceAdvice: boolean;
  staffCount: number;
  /** Package id, NO_PACKAGE, or null while undecided. */
  drinksPackageId: string | null;
  /** Hours of drinks service in minutes; defaults to the whole party. */
  drinksMinutes: number | null;
  extras: string[];
}

export const EMPTY_INPUT: QuoteInput = {
  date: null, postcode: '', guests: null, start: '19:00', end: '00:00',
  barId: null, glasses: {}, iceAndStorage: {}, iceAdvice: false, staffCount: 0,
  drinksPackageId: null, drinksMinutes: null, extras: [],
};

export type LineGroup = 'bar' | 'glassware' | 'ice' | 'staff' | 'drinks' | 'extras' | 'delivery';

export type LinePrice =
  | { kind: 'priced'; pence: Pence; working: string }
  | { kind: 'pending'; reason: string; optional: boolean }
  | { kind: 'included'; by: string };

export interface QuoteLine {
  id: string;
  group: LineGroup;
  title: string;
  detail: string;
  price: LinePrice;
}

export interface QuoteResult {
  lines: QuoteLine[];
  /** Sum of priced lines, ex VAT. */
  pricedSubtotal: Pence;
  /** Lines still waiting for a price that the party needs. */
  pendingRequired: number;
  /** Optional lines priced on request (extras). */
  pendingOptional: number;
  status: 'empty' | 'provisional' | 'complete';
  vat:
    | { status: 'unverified' }
    | { status: 'verified'; ratePercentLabel: string; vat: Pence; totalIncVat: Pence };
  timing: PartyTiming | null;
  timingIssue: string | null;
  /** Plain-English notes for the guest. */
  notes: string[];
  /** Internal assumptions Jake needs to confirm before real pricing. */
  assumptions: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function vatFor(subtotal: Pence, policy: VatPolicy): QuoteResult['vat'] {
  if (policy.status === 'unverified') return { status: 'unverified' };
  const raw = subtotal * policy.rateBasisPoints;
  const vat = policy.rounding === 'nearest-penny' ? Math.floor((raw + 5000) / 10000) : Math.floor(raw / 10000);
  const pct = policy.rateBasisPoints / 100;
  return { status: 'verified', ratePercentLabel: `${pct}%`, vat, totalIncVat: sumPence([subtotal, vat]) };
}

// ─── The engine ─────────────────────────────────────────────────────────────

export function buildQuote(input: QuoteInput, policy: QuotePolicy = QUOTE_POLICY): QuoteResult {
  const lines: QuoteLine[] = [];
  const notes: string[] = [];
  const assumptions: string[] = [];

  const timingResult = computeTiming(input.date, input.start, input.end, policy.arrivalLeadMinutes);
  const timing = timingResult.ok ? timingResult.timing : null;
  const timingIssue = timingResult.ok ? null : timingResult.reason;

  const pkg = input.drinksPackageId && input.drinksPackageId !== NO_PACKAGE ? findPackage(input.drinksPackageId) : null;
  const covered = (category: IncludedCategory): string | null =>
    pkg && pkg.includes.includes(category) ? pkg.name : null;
  const pendingOrIncluded = (category: IncludedCategory, reason = 'Price to confirm'): LinePrice => {
    const by = covered(category);
    return by ? { kind: 'included', by } : { kind: 'pending', reason, optional: false };
  };

  // Bar
  const bar = input.barId && input.barId !== NO_BAR ? findBar(input.barId) : null;
  if (bar) {
    lines.push({
      id: bar.id, group: 'bar', title: bar.name, detail: `${bar.shape} · ${bar.size}`,
      price: pendingOrIncluded('bar'),
    });
  }

  // Glassware — one line per type chosen
  for (const g of GLASSES) {
    const qty = Math.max(0, Math.floor(input.glasses[g.id] ?? 0));
    if (qty > 0) {
      lines.push({
        id: g.id, group: 'glassware', title: g.name, detail: plural(qty, 'glass', 'glasses'),
        price: pendingOrIncluded('glassware'),
      });
    }
  }

  // Ice & storage
  for (const item of ICE_AND_STORAGE) {
    const qty = Math.max(0, Math.floor(input.iceAndStorage[item.id] ?? 0));
    if (qty > 0) {
      const category: IncludedCategory | null = item.id === 'ice-bag' ? 'ice' : null;
      lines.push({
        id: item.id, group: 'ice', title: item.name, detail: plural(qty, item.unit, item.unitPlural),
        price: category ? pendingOrIncluded(category) : { kind: 'pending', reason: 'Price to confirm', optional: false },
      });
    }
  }
  if (input.iceAdvice) {
    lines.push({
      id: 'ice-advice', group: 'ice', title: 'Ice — we’ll advise',
      detail: input.guests ? `The right amount for ${input.guests} guests` : 'The right amount for your guests',
      price: pendingOrIncluded('ice'),
    });
  }

  // Staff — the one authorised price
  const staffCount = Math.max(0, Math.floor(input.staffCount));
  if (staffCount > 0) {
    const by = covered('staff');
    let price: LinePrice;
    let detail = plural(staffCount, 'bartender', 'bartenders');
    if (by) {
      price = { kind: 'included', by };
    } else if (!timing) {
      price = { kind: 'pending', reason: 'Add your party times to price staff', optional: false };
    } else {
      const perPerson = rateForMinutes(STAFF_RATE.unitPence, timing.billableMinutes);
      price = {
        kind: 'priced',
        pence: multiplyPence(perPerson, staffCount),
        working: `${staffCount} × ${formatHoursShort(timing.billableMinutes)} × ${formatPence(STAFF_RATE.unitPence)}`,
      };
    }
    if (timing) {
      detail += ` · ${formatTime(timing.startMinutes)}–${formatTime(timing.endMinutes)}`
        + `${timing.overnight ? ' (next day)' : ''} · ${formatDuration(timing.billableMinutes)}`;
    }
    lines.push({ id: STAFF_RATE.id, group: 'staff', title: STAFF_RATE.name, detail, price });

    if (timing && !by) {
      notes.push(`Suggested team arrival: ${formatTime(timing.arrival.minutes)}, an hour before your party, to set up. We’ll confirm timings with you.`);
      assumptions.push('Staff are priced on party start → finish only. The suggested arrival an hour earlier is not billed here and has not been promised as free — confirm the prep-hour policy before real quotes.');
    }
  }

  // Drinks package
  if (pkg) {
    const partyMinutes = timing?.billableMinutes ?? null;
    let drinksMinutes = input.drinksMinutes ?? partyMinutes;
    if (drinksMinutes !== null && partyMinutes !== null && drinksMinutes > partyMinutes) drinksMinutes = partyMinutes;
    const parts = [
      input.guests ? plural(input.guests, 'guest', 'guests') : 'Guests to confirm',
      drinksMinutes ? `${formatDuration(drinksMinutes)} of drinks` : 'Hours to confirm',
    ];
    lines.push({
      id: pkg.id, group: 'drinks', title: pkg.name, detail: parts.join(' · '),
      price: { kind: 'pending', reason: 'Draft menu — price to confirm', optional: false },
    });
    assumptions.push(`"${pkg.name}" is a draft menu: contents, price and what it includes (${pkg.includes.join(', ')}) need confirming.`);
  }

  // Extras — priced on request
  for (const extra of EXTRAS) {
    if (input.extras.includes(extra.id)) {
      lines.push({
        id: extra.id, group: 'extras', title: extra.name, detail: extra.detail,
        price: { kind: 'pending', reason: 'Priced on request', optional: true },
      });
    }
  }

  // Delivery whenever something physical is coming
  const hasKit = Boolean(bar) || lines.some((l) => l.group === 'glassware' || l.group === 'ice');
  if (hasKit) {
    lines.push({
      id: DELIVERY.id, group: 'delivery', title: DELIVERY.name,
      detail: input.postcode.trim() ? `To ${input.postcode.trim().toUpperCase()}` : DELIVERY.detail,
      price: { kind: 'pending', reason: 'Confirmed for your postcode', optional: false },
    });
  }

  // Clock changes
  if (timing?.clockChange) {
    const { direction, differenceMinutes, timeInChangingHour } = timing.clockChange;
    if (differenceMinutes !== 0) {
      notes.push(
        `The clocks go ${direction} during your party, so it runs ${formatDuration(timing.billableMinutes)} in real time `
        + `(${formatDuration(timing.wallMinutes)} on the clock). We’ve priced the real time and will confirm it with you.`,
      );
    }
    if (timeInChangingHour) {
      notes.push('One of your times falls in the hour the clocks change. We’ll check the exact time with you.');
    }
    assumptions.push('Clock-change night: staff priced on real elapsed time, not clock-face time — confirm this policy.');
  }

  const priced = lines.flatMap((l) => (l.price.kind === 'priced' ? [l.price.pence] : []));
  const pricedSubtotal = sumPence(priced);
  const pendingRequired = lines.filter((l) => l.price.kind === 'pending' && !l.price.optional).length;
  const pendingOptional = lines.filter((l) => l.price.kind === 'pending' && l.price.optional).length;

  if (policy.vat.status === 'unverified' && lines.length > 0) {
    assumptions.push('VAT is shown as "+ VAT" only, as on thebarpeople.co.uk. Rate and rounding are not yet verified against the business’s VAT settings.');
  }

  return {
    lines,
    pricedSubtotal,
    pendingRequired,
    pendingOptional,
    status: lines.length === 0 ? 'empty' : pendingRequired + pendingOptional > 0 ? 'provisional' : 'complete',
    vat: vatFor(pricedSubtotal, policy.vat),
    timing,
    timingIssue,
    notes,
    assumptions,
  };
}
