// The price list for "Build your package". Every amount is whole pence, ex VAT.
//
// Source for everything marked JAKE: Jake's brief of 9–10 Nov 2026. Anything
// marked DERIVED follows from his rules and is listed in
// docs/new-homepage/README.md for him to confirm.

import type { Pence } from '../visual-quote/money.ts';

export const PRICES = {
  // ── Staff (JAKE) ──
  /** £28 per bartender per hour. */
  staffPerHour: 2800 as Pence,
  /** "There should always be a minimum of 2 staff members on any job, any size." */
  staffMinimum: 2,
  /** Staff are hired from at least 30 minutes before the bar opens… */
  staffLeadMinutes: 30,
  /** …until 30 minutes after it closes. Both are charged. */
  staffTailMinutes: 30,

  // ── Bars (JAKE) ──
  /** One 1.5m (5ft) section. */
  barOneSection: 21500 as Pence,
  /** Two sections: the 3m bar. */
  barTwoSections: 32500 as Pence,
  /** Each 1.5m section after that. */
  barExtraSection: 10000 as Pence,
  /** Each corner piece. */
  barCorner: 10000 as Pence,
  /** Full round bar, mirror or LED. */
  barRound: 120000 as Pence,

  // ── Glassware, ice, fridges (JAKE) ──
  glass: 80 as Pence,
  igloo: 7500 as Pence,
  fridgeSingle: 6000 as Pence,
  fridgeDouble: 14000 as Pence,

  // ── Delivery and collection, bars and equipment (JAKE) ──
  delivery: 9500 as Pence,

  // ── All-inclusive drinks, per guest (JAKE) ──
  /** £7.50 an hour up to 5 hours, counted in half hours. */
  drinksPerHalfHourUnderFive: 375 as Pence,
  /** 5 hours is £35 a head. */
  drinksAtFiveHours: 3500 as Pence,
  /** Then £5 for each extra hour, counted in half hours. */
  drinksPerHalfHourOverFive: 250 as Pence,

  // ── VAT ──
  /** All prices are quoted plus VAT. UK standard rate, 20%. */
  vatBasisPoints: 2000,
} as const;

/** Times in the builder move in half hours, so every price lands on whole pence. */
export const TIME_STEP = 30;

/** Bars are built from 1.5m sections. */
export const SECTION_METRES = 1.5;
