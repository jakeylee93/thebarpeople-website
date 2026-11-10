// Times and dates around the event (Jake, 10 Nov 2026).
//
// - The guest gives the time the bar opens and closes.
// - Bartenders are hired from at least 30 minutes before the bar opens until
//   30 minutes after it closes, and are paid for that whole time.
// - Set-up needs 2 hours for about 50 guests, 4 hours for 100 and 6 hours for
//   more. We set up the day before, or on the day if there's time.
// - Collection is the day after, or up to 3 days after.

import { addDaysIso, computeTiming, DAY_MINUTES, parseIsoDate, parseTime, type PartyTiming } from '../visual-quote/time.ts';
import { PRICES, TIME_STEP } from './prices.ts';

export const STAFF_EARLY_OPTIONS = [30, 60, 90, 120] as const;
export type StaffEarly = (typeof STAFF_EARLY_OPTIONS)[number];

export type SetupDay = 'day-before' | 'on-the-day';
export const COLLECTION_DAYS = [1, 2, 3] as const;
export type CollectionDays = (typeof COLLECTION_DAYS)[number];

/** DERIVED: on-the-day set-up isn't offered if we'd have to start before 7am. To confirm. */
export const EARLIEST_SETUP_START = 7 * 60;

/** A mid-winter day with no clock change, used for durations before a date is chosen. */
const NEUTRAL_DATE = '2027-01-16';

/** Hours we need to set up before the bar opens: 2h up to 50 guests, 4h up to 100, 6h above. */
export function setupLeadMinutes(guests: number): number {
  if (guests <= 50) return 120;
  if (guests <= 100) return 240;
  return 360;
}

export interface Schedule {
  /** Bar open → close, with clock-change handling. */
  timing: PartyTiming;
  /** Real time the bar is open. */
  barMinutes: number;
  /** Per bartender: early arrival + bar time + 30 minutes after close. */
  staffMinutes: number;
  staffEarly: StaffEarly;
  /** Wall-clock minutes of the day (0–1439). */
  staffArrive: number;
  staffFinish: number;
  setupLead: number;
  /** Latest we can start setting up on the day; null when that would be before 7am. */
  setupOnTheDayBy: number | null;
  setupDay: SetupDay;
  /** Null until the guest has given a date. */
  date: string | null;
  setupDate: string | null;
  collectionDate: string | null;
}

export type ScheduleResult = { ok: true; schedule: Schedule } | { ok: false; reason: string };

export function buildSchedule(input: {
  date: string | null;
  open: string | null;
  close: string | null;
  guests: number;
  staffEarly: StaffEarly;
  setupDay: SetupDay;
  collectionDays: CollectionDays;
}): ScheduleResult {
  // Durations don't need the date; only a clock-change night can alter them.
  const date = parseIsoDate(input.date) ? (input.date as string) : null;
  const open = parseTime(input.open);
  const close = parseTime(input.close);
  if (open === null) return { ok: false, reason: 'Choose when the bar opens' };
  if (close === null) return { ok: false, reason: 'Choose when the bar closes' };
  if (open % TIME_STEP !== 0 || close % TIME_STEP !== 0) return { ok: false, reason: 'Times are chosen in half hours' };
  const result = computeTiming(date ?? NEUTRAL_DATE, input.open, input.close);
  if (!result.ok) {
    return { ok: false, reason: open === close ? 'The bar needs to close at a different time from when it opens' : result.reason };
  }
  const timing = result.timing;
  const barMinutes = timing.billableMinutes;
  if (barMinutes <= 0 || barMinutes % TIME_STEP !== 0) {
    return { ok: false, reason: 'The clocks change during your event. We’ll confirm your times with you.' };
  }
  const staffEarly = STAFF_EARLY_OPTIONS.includes(input.staffEarly) ? input.staffEarly : PRICES.staffLeadMinutes;

  const setupLead = setupLeadMinutes(input.guests);
  const latestStart = open - setupLead;
  const setupOnTheDayBy = latestStart >= EARLIEST_SETUP_START ? latestStart : null;
  const setupDay: SetupDay = input.setupDay === 'on-the-day' && setupOnTheDayBy !== null ? 'on-the-day' : 'day-before';

  return {
    ok: true,
    schedule: {
      timing,
      barMinutes,
      staffMinutes: staffEarly + barMinutes + PRICES.staffTailMinutes,
      staffEarly: staffEarly as StaffEarly,
      staffArrive: (((open - staffEarly) % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES,
      staffFinish: (close + PRICES.staffTailMinutes) % DAY_MINUTES,
      setupLead,
      setupOnTheDayBy,
      setupDay,
      date,
      setupDate: date === null ? null : setupDay === 'on-the-day' ? date : addDaysIso(date, -1),
      collectionDate: date === null ? null : addDaysIso(date, COLLECTION_DAYS.includes(input.collectionDays) ? input.collectionDays : 1),
    },
  };
}
