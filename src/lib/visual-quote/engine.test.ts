// Run with: pnpm test   (Node's built-in test runner; no extra dependencies)
import { test } from 'node:test';
import assert from 'node:assert/strict';

import type { QuoteInput } from './engine.ts';
import { buildQuote, EMPTY_INPUT, NO_PACKAGE, QUOTE_POLICY } from './engine.ts';
import { formatPence, formatPenceCompact, rateForMinutes, sumPence } from './money.ts';
import { computeTiming, formatDuration, formatTime } from './time.ts';
import { suggestedStaff } from './catalogue.ts';

const party = (over: Partial<QuoteInput> = {}): QuoteInput => ({
  ...EMPTY_INPUT,
  date: '2026-11-14',
  postcode: 'e11 1aa',
  guests: 120,
  start: '19:00',
  end: '01:00',
  ...over,
});

test('Jake’s example: 6 hours × 2 staff × £28 = £336.00 before VAT', () => {
  const q = buildQuote(party({ staffCount: 2 }));
  const staff = q.lines.find((l) => l.group === 'staff');
  assert.ok(staff);
  assert.equal(staff.price.kind, 'priced');
  if (staff.price.kind === 'priced') {
    assert.equal(staff.price.pence, 33_600);
    assert.equal(staff.price.working, '2 × 6h × £28.00');
  }
  assert.equal(q.pricedSubtotal, 33_600);
  assert.equal(formatPence(q.pricedSubtotal), '£336.00');
  assert.equal(q.status, 'complete');
  assert.deepEqual(q.vat, { status: 'unverified' });
});

test('staff are billed on party time only; arrival an hour earlier is suggested, flagged, not billed', () => {
  const q = buildQuote(party({ staffCount: 2 }));
  assert.equal(q.pricedSubtotal, 33_600, 'no extra prep hour added');
  assert.match(q.notes.join(' '), /Suggested team arrival: 6pm/);
  assert.match(q.assumptions.join(' '), /prep-hour policy/);
});

test('overnight party: finish before start means the next day', () => {
  const t = computeTiming('2026-11-14', '20:00', '02:00');
  assert.ok(t.ok);
  if (t.ok) {
    assert.equal(t.timing.overnight, true);
    assert.equal(t.timing.endDate, '2026-11-15');
    assert.equal(t.timing.billableMinutes, 360);
  }
});

test('party from 11:30pm to 5am crosses midnight correctly (5½ hours)', () => {
  const q = buildQuote(party({ start: '23:30', end: '05:00', staffCount: 1 }));
  const staff = q.lines.find((l) => l.group === 'staff');
  assert.ok(staff && staff.price.kind === 'priced');
  if (staff.price.kind === 'priced') assert.equal(staff.price.pence, 15_400); // 5.5 × £28
  assert.equal(q.timing?.arrival.minutes, 22 * 60 + 30);
});

test('arrival before midnight start rolls back to the previous day', () => {
  const t = computeTiming('2026-12-31', '00:30', '03:00');
  assert.ok(t.ok);
  if (t.ok) {
    assert.equal(t.timing.arrival.date, '2026-12-30');
    assert.equal(formatTime(t.timing.arrival.minutes), '11:30pm');
  }
});

test('clocks go back (Sat 24 Oct 2026): 8pm–2am is 7 real hours, priced and flagged', () => {
  const q = buildQuote(party({ date: '2026-10-24', start: '20:00', end: '02:00', staffCount: 2 }));
  assert.equal(q.timing?.wallMinutes, 360);
  assert.equal(q.timing?.billableMinutes, 420);
  assert.equal(q.pricedSubtotal, 39_200); // 2 × 7 × £28
  assert.match(q.notes.join(' '), /clocks go back/);
  assert.match(q.assumptions.join(' '), /Clock-change night/);
});

test('clocks go forward (Sat 28 Mar 2026): 8pm–2am is 5 real hours', () => {
  const t = computeTiming('2026-03-28', '20:00', '02:00');
  assert.ok(t.ok);
  if (t.ok) {
    assert.equal(t.timing.billableMinutes, 300);
    assert.equal(t.timing.clockChange?.direction, 'forward');
  }
});

test('a time inside the repeated 1am hour is flagged for checking', () => {
  const q = buildQuote(party({ date: '2026-10-24', start: '20:00', end: '01:30', staffCount: 1 }));
  assert.equal(q.timing?.billableMinutes, 330);
  assert.match(q.notes.join(' '), /hour the clocks change/);
});

test('invalid timings are explained, and staff stay pending rather than £0', () => {
  assert.deepEqual(computeTiming('2026-11-14', '19:00', '19:00'), { ok: false, reason: 'The finish time needs to be different from the start' });
  assert.equal(computeTiming('2026-02-30', '19:00', '23:00').ok, false);
  assert.equal(computeTiming('2026-11-14', '19:10', '23:00').ok, false);
  const q = buildQuote(party({ date: null, staffCount: 2 }));
  const staff = q.lines.find((l) => l.group === 'staff');
  assert.equal(staff?.price.kind, 'pending');
  assert.equal(q.pricedSubtotal, 0);
  assert.equal(q.status, 'provisional');
});

test('unknown prices are pending, never £0, and make the quote provisional', () => {
  const q = buildQuote(party({ barId: 'bar-3m', glasses: { 'glass-wine': 120 }, staffCount: 2 }));
  const bar = q.lines.find((l) => l.group === 'bar');
  const glass = q.lines.find((l) => l.group === 'glassware');
  const delivery = q.lines.find((l) => l.group === 'delivery');
  assert.equal(bar?.price.kind, 'pending');
  assert.equal(glass?.price.kind, 'pending');
  assert.equal(delivery?.price.kind, 'pending');
  assert.equal(delivery?.detail, 'To E11 1AA');
  assert.equal(q.pricedSubtotal, 33_600, 'only the authorised staff price is charged');
  assert.equal(q.pendingRequired, 3);
  assert.equal(q.status, 'provisional');
});

test('a drinks package that covers bar/staff/glasses/ice never charges them twice', () => {
  const q = buildQuote(party({
    barId: 'bar-4-5m', glasses: { 'glass-flute': 120 }, iceAndStorage: { 'ice-bag': 6, 'igloo-box': 2 },
    staffCount: 3, drinksPackageId: 'drinks-all-inclusive',
  }));
  const byGroup = (g: string) => q.lines.filter((l) => l.group === g);
  assert.equal(byGroup('bar')[0].price.kind, 'included');
  assert.equal(byGroup('staff')[0].price.kind, 'included');
  assert.equal(byGroup('glassware')[0].price.kind, 'included');
  assert.equal(q.lines.find((l) => l.id === 'ice-bag')?.price.kind, 'included');
  assert.equal(q.lines.find((l) => l.id === 'igloo-box')?.price.kind, 'pending', 'cool boxes are not covered');
  assert.equal(q.pricedSubtotal, 0, 'the £28/h staff charge is not added on top of the package');
  assert.equal(byGroup('drinks')[0].price.kind, 'pending');
  assert.match(byGroup('drinks')[0].detail, /120 guests · 6 hours of drinks/);
});

test('drinks hours cannot exceed the party', () => {
  const q = buildQuote(party({ drinksPackageId: 'drinks-cocktails', drinksMinutes: 600 }));
  assert.match(q.lines.find((l) => l.group === 'drinks')?.detail ?? '', /6 hours of drinks/);
});

test('choosing no package leaves staff priced normally', () => {
  const q = buildQuote(party({ staffCount: 2, drinksPackageId: NO_PACKAGE }));
  assert.equal(q.pricedSubtotal, 33_600);
});

test('extras are optional, priced on request, and keep the estimate provisional', () => {
  const q = buildQuote(party({ staffCount: 2, extras: ['extra-marquee'] }));
  assert.equal(q.pendingOptional, 1);
  assert.equal(q.pendingRequired, 0);
  assert.equal(q.status, 'provisional');
  assert.equal(q.pricedSubtotal, 33_600);
});

test('VAT is only calculated once a verified policy is supplied', () => {
  const input = party({ staffCount: 2, start: '19:00', end: '00:15' }); // 5.25h
  const unverified = buildQuote(input);
  assert.deepEqual(unverified.vat, { status: 'unverified' });
  const verified = buildQuote(input, { ...QUOTE_POLICY, vat: { status: 'verified', rateBasisPoints: 2000, rounding: 'nearest-penny' } });
  assert.equal(verified.pricedSubtotal, 29_400);
  assert.deepEqual(verified.vat, { status: 'verified', ratePercentLabel: '20%', vat: 5_880, totalIncVat: 35_280 });
});

test('money helpers refuse to round or accept floats', () => {
  assert.equal(rateForMinutes(2800, 15), 700);
  assert.throws(() => rateForMinutes(2800, 7), /no rounding rule/);
  assert.throws(() => sumPence([100, 0.5]), /whole/);
  assert.equal(formatPence(123_456), '£1,234.56');
  assert.equal(formatPenceCompact(33_600), '£336');
  assert.equal(formatPenceCompact(33_650), '£336.50');
});

test('plain-English formatting', () => {
  assert.equal(formatTime(0), 'midnight');
  assert.equal(formatTime(19 * 60 + 30), '7:30pm');
  assert.equal(formatTime(12 * 60), '12pm');
  assert.equal(formatDuration(330), '5½ hours');
  assert.equal(formatDuration(375), '6 hours 15 min');
});

test('staff suggestion follows the published 50–75 guests per bartender guide', () => {
  assert.deepEqual(suggestedStaff(120), { low: 2, high: 3 });
  assert.deepEqual(suggestedStaff(40), { low: 1, high: 1 });
  assert.equal(suggestedStaff(null), null);
});

test('an empty quote is empty', () => {
  const q = buildQuote(EMPTY_INPUT);
  assert.equal(q.status, 'empty');
  assert.equal(q.lines.length, 0);
});
