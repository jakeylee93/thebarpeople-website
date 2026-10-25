// Party timing for the visual quote builder.
//
// Dates are "YYYY-MM-DD" (the day the party starts). Times are "HH:MM" in
// 15-minute steps. A finish time at or before the start time means the party
// ends the next day.
//
// Billable time is the real time between the chosen start and finish in UK
// time. On the two nights a year the clocks change, that differs from what
// the clock faces say, so the difference is reported for the team to confirm.

export const TIME_STEP_MINUTES = 15;
export const DAY_MINUTES = 24 * 60;
const MINUTE_MS = 60_000;

export function parseTime(value: string | null | undefined): number | null {
  if (!value) return null;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export function toTimeValue(minutes: number): string {
  const m = ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

/** "7pm", "7:30pm", "midnight", "12:30am". */
export function formatTime(minutes: number): string {
  const m = ((minutes % DAY_MINUTES) + DAY_MINUTES) % DAY_MINUTES;
  if (m === 0) return 'midnight';
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const suffix = h24 < 12 ? 'am' : 'pm';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return mm === 0 ? `${h12}${suffix}` : `${h12}:${String(mm).padStart(2, '0')}${suffix}`;
}

/** "6 hours", "5½ hours", "6 hours 15 min". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hours = (n: number) => `${n} ${n === 1 ? 'hour' : 'hours'}`;
  if (m === 0) return hours(h);
  if (m === 30) return h === 0 ? '30 min' : `${h}½ hours`;
  return h === 0 ? `${m} min` : `${hours(h)} ${m} min`;
}

/** Compact form for calculations: "6h", "5.5h", "6.25h". */
export function formatHoursShort(minutes: number): string {
  const hours = minutes / 60;
  return `${Number.isInteger(hours) ? hours : hours.toFixed(2).replace(/0$/, '')}h`;
}

/** Quarter-hour choices for a time picker. */
export function timeOptions(step = TIME_STEP_MINUTES): { value: string; label: string }[] {
  const out: { value: string; label: string }[] = [];
  for (let m = 0; m < DAY_MINUTES; m += step) out.push({ value: toTimeValue(m), label: formatTime(m) });
  return out;
}

// ─── Dates ──────────────────────────────────────────────────────────────────

export function parseIsoDate(value: string | null | undefined): { y: number; m: number; d: number } | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  const probe = new Date(Date.UTC(y, m - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== m - 1 || probe.getUTCDate() !== d) return null;
  return { y, m, d };
}

export function addDaysIso(iso: string, days: number): string {
  const p = parseIsoDate(iso);
  if (!p) throw new Error(`Not a date: ${iso}`);
  return new Date(Date.UTC(p.y, p.m - 1, p.d + days)).toISOString().slice(0, 10);
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
});
const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC',
});

/** "Sat 14 Nov 2026" (or "Sat 14 Nov" with short). */
export function formatDate(iso: string, short = false): string {
  const p = parseIsoDate(iso);
  if (!p) return iso;
  return (short ? shortDateFormatter : dateFormatter).format(new Date(Date.UTC(p.y, p.m - 1, p.d)));
}

// ─── UK clock changes ───────────────────────────────────────────────────────
// British Summer Time runs from 01:00 UTC on the last Sunday of March to
// 01:00 UTC on the last Sunday of October.

function lastSundayAt0100Utc(year: number, monthIndex: number): number {
  const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0));
  const date = lastDay.getUTCDate() - lastDay.getUTCDay();
  return Date.UTC(year, monthIndex, date, 1, 0);
}

function ukOffsetMinutes(utcMs: number): 0 | 60 {
  const year = new Date(utcMs).getUTCFullYear();
  return utcMs >= lastSundayAt0100Utc(year, 2) && utcMs < lastSundayAt0100Utc(year, 9) ? 60 : 0;
}

type LocalReading = { utcMs: number; kind: 'normal' | 'repeated' | 'skipped' };

/** UK wall-clock time → instant. A repeated 1am hour reads as its first occurrence. */
function ukLocalToUtc(iso: string, minutes: number): LocalReading {
  const p = parseIsoDate(iso);
  if (!p) throw new Error(`Not a date: ${iso}`);
  const wall = Date.UTC(p.y, p.m - 1, p.d) + minutes * MINUTE_MS;
  const asSummer = wall - 60 * MINUTE_MS;
  const summerFits = ukOffsetMinutes(asSummer) === 60;
  const winterFits = ukOffsetMinutes(wall) === 0;
  if (summerFits && winterFits) return { utcMs: asSummer, kind: 'repeated' };
  if (summerFits) return { utcMs: asSummer, kind: 'normal' };
  if (winterFits) return { utcMs: wall, kind: 'normal' };
  return { utcMs: wall, kind: 'skipped' };
}

// ─── Party timing ───────────────────────────────────────────────────────────

export const SUGGESTED_ARRIVAL_LEAD_MINUTES = 60;

export interface PartyTiming {
  date: string;
  endDate: string;
  startMinutes: number;
  endMinutes: number;
  overnight: boolean;
  /** What the clock faces say between start and finish. */
  wallMinutes: number;
  /** Real elapsed time between the chosen start and finish — what staff are priced on. */
  billableMinutes: number;
  /** Set when the clocks change during the party, or a chosen time falls in the changing hour. */
  clockChange: null | { direction: 'back' | 'forward'; differenceMinutes: number; timeInChangingHour: boolean };
  /** Suggested team arrival (not billed — see the prep-hour assumption). */
  arrival: { date: string; minutes: number };
}

export type TimingResult = { ok: true; timing: PartyTiming } | { ok: false; reason: string };

export function computeTiming(
  date: string | null | undefined,
  start: string | null | undefined,
  end: string | null | undefined,
  arrivalLeadMinutes = SUGGESTED_ARRIVAL_LEAD_MINUTES,
): TimingResult {
  if (!parseIsoDate(date)) return { ok: false, reason: 'Choose your party date' };
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  if (startMinutes === null) return { ok: false, reason: 'Choose a start time' };
  if (endMinutes === null) return { ok: false, reason: 'Choose a finish time' };
  if (startMinutes % TIME_STEP_MINUTES !== 0 || endMinutes % TIME_STEP_MINUTES !== 0) {
    return { ok: false, reason: 'Times are chosen in 15-minute steps' };
  }
  if (startMinutes === endMinutes) return { ok: false, reason: 'The finish time needs to be different from the start' };

  const day = date as string;
  const overnight = endMinutes < startMinutes;
  const endDate = overnight ? addDaysIso(day, 1) : day;
  const wallMinutes = overnight ? endMinutes + DAY_MINUTES - startMinutes : endMinutes - startMinutes;

  const startUtc = ukLocalToUtc(day, startMinutes);
  const endUtc = ukLocalToUtc(endDate, endMinutes);
  const billableMinutes = Math.round((endUtc.utcMs - startUtc.utcMs) / MINUTE_MS);

  const difference = billableMinutes - wallMinutes;
  const inChangingHour = startUtc.kind !== 'normal' || endUtc.kind !== 'normal';
  let clockChange: PartyTiming['clockChange'] = null;
  if (difference !== 0 || inChangingHour) {
    const direction: 'back' | 'forward' =
      difference > 0 || startUtc.kind === 'repeated' || endUtc.kind === 'repeated' ? 'back' : 'forward';
    clockChange = { direction, differenceMinutes: difference, timeInChangingHour: inChangingHour };
  }

  let arrivalMinutes = startMinutes - arrivalLeadMinutes;
  let arrivalDate = day;
  if (arrivalMinutes < 0) {
    arrivalMinutes += DAY_MINUTES;
    arrivalDate = addDaysIso(day, -1);
  }

  return {
    ok: true,
    timing: {
      date: day,
      endDate,
      startMinutes,
      endMinutes,
      overnight,
      wallMinutes,
      billableMinutes,
      clockChange,
      arrival: { date: arrivalDate, minutes: arrivalMinutes },
    },
  };
}
