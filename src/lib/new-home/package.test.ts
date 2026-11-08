import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  BAR_ART, DEFAULT_PACKAGE, PACKAGE_BARS, PACKAGE_STEPS, buildPackageQuote, finishLines, isStepId,
  onEnterStep, recommendedBarId, suggestedBartenders, toQuoteInput, type PackageState,
} from './package.ts';

const party = (over: Partial<PackageState> = {}): PackageState => ({ ...DEFAULT_PACKAGE, ...over });

test('recommends the smallest bar that suits the guests', () => {
  assert.equal(recommendedBarId(30), 'bar-1-5m');
  assert.equal(recommendedBarId(50), 'bar-1-5m');
  assert.equal(recommendedBarId(51), 'bar-3m');
  assert.equal(recommendedBarId(100), 'bar-3m');
  assert.equal(recommendedBarId(150), 'bar-4-5m');
  assert.equal(recommendedBarId(151), 'bar-full-horseshoe');
  assert.equal(recommendedBarId(900), 'bar-full-horseshoe');
});

test('every bar has a cut-out render on disk and a four-corner front panel', () => {
  assert.equal(PACKAGE_BARS.length, 6);
  for (const b of PACKAGE_BARS) {
    const art = BAR_ART[b.id];
    assert.ok(art, b.id);
    assert.ok(existsSync(join(process.cwd(), 'public', art.src)), art.src);
    assert.equal(art.panel.length, 4, b.id);
    for (const [x, y] of art.panel) assert.ok(x >= 0 && x <= 100 && y >= 0 && y <= 100, `${b.id} ${x},${y}`);
  }
});

test('step ids are unique and recognised', () => {
  const ids = PACKAGE_STEPS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(isStepId('colour'));
  assert.ok(!isStepId('dry-hire'));
});

test('entering a step pre-fills the suggestion but never overrides a choice', () => {
  const s = onEnterStep(party({ guests: 120 }), 'bar');
  assert.equal(s.barId, 'bar-4-5m');
  assert.equal(onEnterStep(party({ guests: 120, barId: 'bar-1-5m' }), 'bar').barId, 'bar-1-5m');
  const staff = onEnterStep(party({ guests: 120 }), 'staff');
  assert.equal(staff.staffCount, suggestedBartenders(120).low);
  assert.equal(onEnterStep(party({ staffCount: 0 }), 'staff').staffCount, 0);
});

test('staff are priced at £28 per bartender per hour on party time: 6h × 2 = £336', () => {
  const q = buildPackageQuote(party({ guests: 120, barId: 'bar-3m', staffCount: 2, date: '2027-06-12', start: '18:00', end: '00:00' }));
  const staff = q.lines.find((l) => l.group === 'staff');
  assert.ok(staff && staff.price.kind === 'priced');
  assert.equal(staff.price.kind === 'priced' && staff.price.pence, 33600);
  assert.equal(q.pricedSubtotal, 33600);
});

test('LED colour and custom branding sit right after the bar, priced on confirmation (never £0)', () => {
  const q = buildPackageQuote(party({ barId: 'bar-horseshoe', led: 'pink', branded: true }));
  const ids = q.lines.map((l) => l.id);
  assert.deepEqual(ids.slice(0, 3), ['bar-horseshoe', 'bar-led', 'bar-branded']);
  for (const id of ['bar-led', 'bar-branded']) {
    const line = q.lines.find((l) => l.id === id);
    assert.equal(line?.price.kind, 'pending');
  }
  assert.equal(q.pricedSubtotal, 0);
});

test('no finish lines before a bar is chosen', () => {
  assert.deepEqual(finishLines(party({ led: 'blue', branded: true })), []);
});

test('a drinks package covers bar, staff, glassware and ice so nothing is charged twice', () => {
  const q = buildPackageQuote(party({
    barId: 'bar-3m', staffCount: 2, glasses: { 'glass-flute': 100 }, iceBags: 4,
    date: '2027-06-12', start: '18:00', end: '00:00', drinks: 'drinks-cocktails',
  }));
  for (const group of ['bar', 'staff', 'glassware', 'ice'] as const) {
    const line = q.lines.find((l) => l.group === group && !l.id.startsWith('bar-led') && !l.id.startsWith('bar-branded'));
    assert.equal(line?.price.kind, 'included', group);
  }
  assert.equal(q.pricedSubtotal, 0);
});

test('zero quantities never reach the quote', () => {
  const input = toQuoteInput(party({ glasses: { a: 0, b: 6 }, iceBags: 0, igloos: 1, fridges: 0 }));
  assert.deepEqual(input.glasses, { b: 6 });
  assert.deepEqual(input.iceAndStorage, { 'igloo-box': 1 });
});
