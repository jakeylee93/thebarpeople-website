import { test } from 'node:test';
import assert from 'node:assert/strict';
import { barModules, barName, barPrice, finishesFor, normaliseBar, recommendBar, recommendStaff, sectionsPrice, type BarChoice } from './bars.ts';
import { bottlePrice, drinksPerHead, MENU, searchMenu, standardMenu, upgradesPerHead } from './drinks.ts';
import { hasStructure, MARQUEE_GROUPS, MARQUEE_ITEMS } from './marquee.ts';
import { PRICES } from './prices.ts';
import {
  buildQuote, chooseShape, chooseStaff, decodeState, DEFAULT_STATE, encodeState, parseState, reach, setGuests, vatOn,
  type QuoteState,
} from './quote.ts';
import { buildSchedule, setupLeadMinutes } from './schedule.ts';

const state = (over: Partial<QuoteState> = {}): QuoteState => ({ ...DEFAULT_STATE, ...over });
const bar = (over: Partial<BarChoice> = {}): BarChoice => ({ shapeId: 'straight', sections: 2, finishId: 'white', branded: false, ...over });
const line = (q: ReturnType<typeof buildQuote>, id: string) => q.lines.find((l) => l.id === id);
const priced = (q: ReturnType<typeof buildQuote>, id: string) => {
  const l = line(q, id);
  assert.ok(l && l.price.kind === 'priced', `${id} should be priced`);
  return l.price.kind === 'priced' ? l.price.pence : -1;
};

// ─── Bars ───────────────────────────────────────────────────────────────────

test('bar sections: £215, £325, then £100 a section', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6].map(sectionsPrice), [21500, 32500, 42500, 52500, 62500, 72500]);
  assert.throws(() => sectionsPrice(0));
});

test('horseshoe is six sections and two £100 corners: £925', () => {
  assert.equal(barPrice(bar({ shapeId: 'horseshoe', sections: 6 }))?.pence, 92500);
  const { modules, closed } = barModules(bar({ shapeId: 'horseshoe', sections: 6 }));
  assert.equal(modules.filter((m) => m.kind === 'section').length, 6);
  assert.equal(modules.filter((m) => m.kind === 'corner').length, 2);
  assert.equal(closed, false);
});

test('L-shapes run from 3m to 15m, split evenly either side of the corner', () => {
  const ten = barModules(bar({ shapeId: 'l-shape', sections: 10 }));
  assert.deepEqual(ten.modules.map((m) => m.kind).join(','), 'section,section,section,section,section,corner,section,section,section,section,section');
  assert.equal(barPrice(bar({ shapeId: 'l-shape', sections: 10 }))?.pence, 112500 + 10000);
  assert.equal(normaliseBar(bar({ shapeId: 'l-shape', sections: 14 })).sections, 10);
  assert.equal(normaliseBar(bar({ shapeId: 'l-shape', sections: 1 })).sections, 2);
});

test('L-shape adds one corner; island is eight sections and four corners; round is £1,200', () => {
  assert.equal(barPrice(bar({ shapeId: 'l-shape', sections: 3 }))?.pence, 42500 + 10000);
  assert.equal(barPrice(bar({ shapeId: 'island', sections: 8 }))?.pence, 92500 + 40000);
  assert.equal(barPrice(bar({ shapeId: 'round', sections: 8, finishId: 'mirror' }))?.pence, 120000);
  assert.equal(barModules(bar({ shapeId: 'round', sections: 8 })).closed, true);
});

test('the island has a way in: two 4ft sections on the back with a gap between them', () => {
  const { modules, closed } = barModules(bar({ shapeId: 'island', sections: 8 }));
  assert.equal(closed, false);
  const sections = modules.filter((m) => m.kind === 'section');
  assert.equal(sections.length, 8);
  assert.equal(modules.filter((m) => m.kind === 'corner').length, 4);
  // First and last are the 4ft back sections; the six between are full 5ft sections.
  assert.deepEqual([modules[0], modules[modules.length - 1]], [{ kind: 'section', width: 1.2 }, { kind: 'section', width: 1.2 }]);
  assert.equal(sections.filter((m) => m.kind === 'section' && m.width === undefined).length, 6);
});

test('custom branded is its own style: white panels with artwork, on any shape, never mixed', () => {
  for (const shapeId of ['straight', 'l-shape', 'horseshoe', 'island', 'curved', 'round'] as const) {
    for (const finishId of ['white', 'mirror', 'shimmer', 'love', 'led'] as const) {
      const b = normaliseBar({ shapeId, sections: 2, finishId, branded: true });
      assert.deepEqual([b.finishId, b.branded], ['white', true], `${shapeId} ${finishId}`);
    }
  }
  // Without branding, a curved bar still only comes in LED or mirror.
  assert.equal(normaliseBar({ shapeId: 'curved', sections: 4, finishId: 'white', branded: false }).finishId, 'led');
  const q = buildQuote(state({ bar: bar({ shapeId: 'horseshoe', sections: 6, branded: true }) }));
  assert.match(line(q, 'bar')?.detail ?? '', /Custom branded$/);
  assert.equal(line(q, 'bar-branded')?.price.kind, 'pending');
});

test('a bar without an agreed price is "to confirm", never £0', () => {
  assert.equal(barPrice(bar({ shapeId: 'curved', sections: 4, finishId: 'mirror' })), null);
  const q = buildQuote(state({ bar: bar({ shapeId: 'curved', sections: 4, finishId: 'mirror' }) }));
  assert.equal(line(q, 'bar')?.price.kind, 'pending');
});

test('sizes are kept inside each shape, and finishes to what the shape comes in', () => {
  assert.equal(barName(bar({ sections: 99 })), '9m bar');
  const q = buildQuote(state({ bar: bar({ shapeId: 'round', sections: 8, finishId: 'white' }) }));
  assert.match(line(q, 'bar')?.detail ?? '', /LED/);
});

test('the LOVE bar only comes as a 3m straight bar', () => {
  assert.ok(finishesFor('straight', 2).includes('love'));
  assert.ok(!finishesFor('straight', 3).includes('love'));
  assert.ok(!finishesFor('horseshoe', 6).includes('love'));
  assert.equal(normaliseBar(bar({ sections: 2, finishId: 'love' })).finishId, 'love');
  assert.equal(normaliseBar(bar({ sections: 4, finishId: 'love' })).finishId, 'white');
  assert.deepEqual(finishesFor('round', 8), ['led', 'mirror']);
});

test('recommended bar: one 1.5m section for every 25 guests (50 guests → 3m)', () => {
  assert.deepEqual(recommendBar(20), { shapeId: 'straight', sections: 1 });
  assert.deepEqual(recommendBar(50), { shapeId: 'straight', sections: 2 });
  assert.deepEqual(recommendBar(100), { shapeId: 'straight', sections: 4 });
  assert.deepEqual(recommendBar(125), { shapeId: 'straight', sections: 5 });
  assert.deepEqual(recommendBar(150), { shapeId: 'horseshoe', sections: 6 });
  assert.deepEqual(recommendBar(250), { shapeId: 'island', sections: 8 });
});

test('recommended staff: 3 for 50 guests, 5 for 100, never fewer than 2', () => {
  assert.equal(recommendStaff(10), 2);
  assert.equal(recommendStaff(25), 2);
  assert.equal(recommendStaff(50), 3);
  assert.equal(recommendStaff(75), 4);
  assert.equal(recommendStaff(100), 5);
  assert.equal(recommendStaff(150), 7);
  assert.equal(recommendStaff(200), 9);
});

// ─── Drinks ─────────────────────────────────────────────────────────────────

test('all-inclusive per guest: £7.50 an hour to 5 hours, £35 at 5, then £5 an hour', () => {
  assert.equal(drinksPerHead(60), 750);
  assert.equal(drinksPerHead(240), 3000);
  assert.equal(drinksPerHead(270), 3375);
  assert.equal(drinksPerHead(300), 3500);
  assert.equal(drinksPerHead(330), 3750);
  assert.equal(drinksPerHead(360), 4000);
  assert.equal(drinksPerHead(420), 4500);
  assert.equal(drinksPerHead(480), 5000);
  assert.throws(() => drinksPerHead(45));
  assert.throws(() => drinksPerHead(0));
});

test('the per-guest price never falls as the hours go up', () => {
  let last = 0;
  for (let m = 30; m <= 720; m += 30) {
    const p = drinksPerHead(m);
    assert.ok(p > last, `${m} min`);
    last = p;
  }
});

test('the standard menu is what Jake listed, and upgrades add per guest', () => {
  const std = standardMenu();
  for (const id of ['peroni', 'corona', 'villa-vito-pinot-grigio', 'aqualta-prosecco', 'absolut', 'bombay-sapphire', 'bacardi', 'kentucky-bourbon']) {
    assert.ok(std.includes(id), id);
  }
  assert.equal(upgradesPerHead(['desperados']), 300);
  assert.equal(upgradesPerHead(['alhambra-reserva', 'estrella-galicia', 'grey-goose', 'hendricks']), 500 + 300 + 300 + 300);
  assert.equal(upgradesPerHead(['absolut-vanilia', 'jack-daniels', 'sailor-jerry']), 0);
  assert.equal(upgradesPerHead(['grey-goose', 'grey-goose']), 300);
});

test('menu ids are unique and every search word must match', () => {
  assert.equal(new Set(MENU.map((d) => d.id)).size, MENU.length);
  assert.deepEqual(searchMenu('grey goose').map((d) => d.id), ['grey-goose']);
  assert.ok(searchMenu('spiced').some((d) => d.id === 'sailor-jerry'));
  assert.ok(searchMenu('hendrix').some((d) => d.id === 'hendricks'));
  assert.equal(searchMenu('zzzz').length, 0);
  assert.equal(searchMenu('  ').length, MENU.length);
});

test('champagne by the bottle is the Majestic price plus 25%, to the nearest pound', () => {
  assert.equal(bottlePrice(4400), 5500);
  assert.equal(bottlePrice(4500), 5600);
  assert.equal(bottlePrice(4600), 5800);
  assert.equal(bottlePrice(4999), 6200);
  assert.equal(bottlePrice(20000), 25000);
  for (const d of MENU) if (d.terms.kind === 'bottle') assert.equal(d.terms.perBottle, bottlePrice(d.terms.majestic.pence), d.id);
});

// ─── Times ──────────────────────────────────────────────────────────────────

const sched = (over: Partial<Parameters<typeof buildSchedule>[0]> = {}) => {
  const r = buildSchedule({ date: '2027-06-12', open: '18:00', close: '23:00', guests: 100, staffEarly: 30, setupDay: 'day-before', collectionDays: 1, ...over });
  assert.ok(r.ok, r.ok ? '' : r.reason);
  return r.ok ? r.schedule : (null as never);
};

test('staff are hired 30 minutes before the bar opens until 30 minutes after it closes', () => {
  const s = sched();
  assert.equal(s.barMinutes, 300);
  assert.equal(s.staffMinutes, 360);
  assert.equal(s.staffArrive, 17 * 60 + 30);
  assert.equal(s.staffFinish, 23 * 60 + 30);
  const late = sched({ open: '19:00', close: '01:00', staffEarly: 60 });
  assert.equal(late.barMinutes, 360);
  assert.equal(late.staffMinutes, 60 + 360 + 30);
  assert.equal(late.staffFinish, 90);
});

test('set-up needs 2 hours to 50 guests, 4 to 100, 6 above', () => {
  assert.deepEqual([30, 50, 51, 100, 101, 400].map(setupLeadMinutes), [120, 120, 240, 240, 360, 360]);
});

test('on-the-day set-up is only offered when there is time; otherwise the day before', () => {
  const evening = sched({ guests: 150, setupDay: 'on-the-day' });
  assert.equal(evening.setupOnTheDayBy, 12 * 60);
  assert.equal(evening.setupDay, 'on-the-day');
  assert.equal(evening.setupDate, '2027-06-12');
  const morning = sched({ guests: 150, open: '10:00', close: '15:00', setupDay: 'on-the-day' });
  assert.equal(morning.setupOnTheDayBy, null);
  assert.equal(morning.setupDay, 'day-before');
  assert.equal(morning.setupDate, '2027-06-11');
});

test('collection is 1 to 3 days after the event', () => {
  assert.equal(sched({ collectionDays: 1 }).collectionDate, '2027-06-13');
  assert.equal(sched({ collectionDays: 3 }).collectionDate, '2027-06-15');
});

test('times work before a date is chosen; dates wait for it', () => {
  const s = sched({ date: null });
  assert.equal(s.staffMinutes, 360);
  assert.equal(s.setupDate, null);
  assert.equal(s.collectionDate, null);
});

test('times that are missing, equal or not on the half hour are refused', () => {
  assert.equal(buildSchedule({ date: null, open: '18:00', close: '18:00', guests: 50, staffEarly: 30, setupDay: 'day-before', collectionDays: 1 }).ok, false);
  assert.equal(buildSchedule({ date: null, open: '18:15', close: '23:00', guests: 50, staffEarly: 30, setupDay: 'day-before', collectionDays: 1 }).ok, false);
  assert.equal(buildSchedule({ date: null, open: null, close: '23:00', guests: 50, staffEarly: 30, setupDay: 'day-before', collectionDays: 1 }).ok, false);
});

// ─── The quote ──────────────────────────────────────────────────────────────

test('bartenders: 2 × 7 hours × £28 = £392 for a bar open 6pm to midnight', () => {
  const q = buildQuote(state({ open: '18:00', close: '00:00', staffCount: 2 }));
  assert.equal(priced(q, 'staff'), 2 * 7 * 2800);
});

test('there are never fewer than two bartenders', () => {
  const q = buildQuote(state({ staffCount: 1 }));
  assert.match(line(q, 'staff')?.detail ?? '', /^2 bartenders/);
  // A saved or shared "1 bartender" is not accepted: the number goes back to unset.
  assert.equal(parseState({ ...DEFAULT_STATE, staffCount: 1 })?.staffCount, null);
  assert.equal(chooseStaff(state(), 1).staffCount, 2);
  assert.equal(chooseStaff(state(), 500).staffCount, 60);
});

test('any quote with a bar or drinks has bartenders, however the guest got there', () => {
  // Nothing chosen yet: no team.
  assert.equal(line(buildQuote(state()), 'staff'), undefined);
  // A bar but no number chosen (jumped straight to the quote, or an old link): the recommended team is quoted.
  const withBar = buildQuote(state({ guests: 100, bar: bar() }));
  assert.match(line(withBar, 'staff')?.detail ?? '', /^5 bartenders/);
  assert.equal(priced(withBar, 'staff'), 5 * 6 * 2800);
  const drinksOnly = buildQuote(state({ guests: 50, drinksMode: 'own' }));
  assert.match(line(drinksOnly, 'staff')?.detail ?? '', /^3 bartenders/);
});

test('all-inclusive is priced per guest for the hours the bar is open', () => {
  const q = buildQuote(state({ guests: 100, drinksMode: 'all-inclusive' }));
  assert.equal(q.drinksPerHead, 3500);
  assert.equal(priced(q, 'drinks-package'), 350000);
  const six = buildQuote(state({ guests: 80, close: '00:00', drinksMode: 'all-inclusive' }));
  assert.equal(priced(six, 'drinks-package'), 80 * 4000);
});

test('unticking a standard drink changes nothing; adding an included one is free; upgrades add per guest', () => {
  const base = buildQuote(state({ drinksMode: 'all-inclusive' })).subtotal;
  const fewer = buildQuote(state({ drinksMode: 'all-inclusive', menu: ['peroni'] })).subtotal;
  const free = buildQuote(state({ drinksMode: 'all-inclusive', menu: [...standardMenu(), 'jack-daniels', 'sailor-jerry', 'absolut-vanilia'] }));
  const up = buildQuote(state({ drinksMode: 'all-inclusive', menu: [...standardMenu(), 'grey-goose', 'desperados'] }));
  assert.equal(fewer, base);
  assert.equal(free.subtotal, base);
  assert.equal(free.lines.filter((l) => l.group === 'drinks').length, 1);
  assert.equal(priced(up, 'drink-grey-goose'), 100 * 300);
  assert.equal(up.subtotal, base + 100 * 600);
});

test('a premium drink without a price, and a requested drink, are "to confirm"', () => {
  const q = buildQuote(state({ drinksMode: 'all-inclusive', menu: [...standardMenu(), 'kraken'], requests: ['Patrón Silver'] }));
  assert.equal(line(q, 'drink-kraken')?.price.kind, 'pending');
  assert.equal(line(q, 'request-0')?.title, 'Patrón Silver');
  assert.equal(q.toConfirm, 2);
});

test('bringing your own drinks adds no drinks lines', () => {
  const q = buildQuote(state({ drinksMode: 'own', menu: [...standardMenu(), 'grey-goose'], bottles: { 'veuve-clicquot': 6 } }));
  assert.equal(q.lines.filter((l) => l.group === 'drinks').length, 0);
});

test('glassware is 80p a glass; igloo £75; fridges £60 and £140', () => {
  const q = buildQuote(state({ glasses: { 'glass-flute': 100, 'glass-wine': 50 }, igloos: 2, fridgesSingle: 1, fridgesDouble: 1 }));
  assert.equal(priced(q, 'glass-flute'), 8000);
  assert.equal(priced(q, 'glass-wine'), 4000);
  // Three glasses cost more: premium flute £1, large wine glass 90p, gin bowl £1.
  const dearer = buildQuote(state({ glasses: { 'glass-flute-premium': 10, 'glass-wine-large': 10, 'glass-gin': 10 } }));
  assert.deepEqual(['glass-flute-premium', 'glass-wine-large', 'glass-gin'].map((id) => priced(dearer, id)), [1000, 900, 1000]);
  assert.equal(priced(q, 'igloo'), 15000);
  assert.equal(priced(q, 'fridge-single'), 6000);
  assert.equal(priced(q, 'fridge-double'), 14000);
});

test('delivery is one £95 fee whenever we bring equipment, and not otherwise', () => {
  assert.equal(line(buildQuote(state({ staffCount: 2, drinksMode: 'all-inclusive' })), 'delivery'), undefined);
  const q = buildQuote(state({ bar: bar(), glasses: { 'glass-flute': 10 }, igloos: 1 }));
  assert.equal(priced(q, 'delivery'), 9500);
  assert.equal(q.lines.filter((l) => l.id === 'delivery').length, 1);
});

test('custom branding is a "to confirm" line next to the bar', () => {
  const q = buildQuote(state({ bar: bar({ branded: true }) }));
  assert.deepEqual(q.lines.slice(0, 2).map((l) => l.id), ['bar', 'bar-branded']);
  assert.equal(line(q, 'bar-branded')?.price.kind, 'pending');
});

test('VAT is 20% of the subtotal, exact to the penny', () => {
  assert.equal(vatOn(10000), 2000);
  assert.equal(vatOn(80), 16);
  // A price that isn't a multiple of 5p rounds to the nearest penny instead of failing.
  assert.equal(vatOn(22), 4); // 4.4p
  assert.equal(vatOn(13), 3); // 2.6p
  assert.equal(vatOn(0), 0);
  assert.throws(() => vatOn(-1));
  assert.throws(() => vatOn(1.5));
  const q = buildQuote(state({ bar: bar(), glasses: { 'glass-flute': 37 } }));
  assert.equal(q.vat * 5, q.subtotal);
  assert.equal(q.total, q.subtotal + q.vat);
});

test('a full example adds up', () => {
  // 100 guests, bar open 6pm–midnight (6 hours).
  const q = buildQuote(state({
    guests: 100, date: '2027-06-12', open: '18:00', close: '00:00',
    bar: bar({ sections: 4, finishId: 'mirror' }),
    drinksMode: 'all-inclusive', menu: [...standardMenu(), 'hendricks'],
    glasses: { 'glass-highball': 100, 'glass-wine': 100, 'glass-flute': 100 },
    igloos: 1, fridgesDouble: 1, staffCount: 5, postcode: 'e11 1aa',
  }));
  const expected =
    52500 +            // 6m bar
    100 * 4000 +       // drinks, 6 hours
    100 * 300 +        // Hendrick's
    300 * 80 +         // glasses
    7500 + 14000 +     // igloo, double fridge
    5 * 7 * 2800 +     // 5 bartenders, 5:30pm to 12:30am
    9500;              // delivery
  assert.equal(q.subtotal, expected);
  assert.equal(q.vat, expected / 5);
  assert.equal(q.toConfirm, 0);
  assert.match(line(q, 'delivery')?.detail ?? '', /E11 1AA/);
  assert.match(line(q, 'staff')?.detail ?? '', /5:30pm to 12:30am/);
  assert.deepEqual([...new Set(q.lines.map((l) => l.group))], ['bar', 'drinks', 'glassware', 'ice', 'staff', 'delivery']);
});

// ─── Steps, saving and sharing ──────────────────────────────────────────────

test('reaching a step fills in the recommendation once and never overrides a choice', () => {
  const s = reach(reach(reach(state({ guests: 50 }), 'bar'), 'drinks'), 'staff');
  assert.deepEqual(s.bar, { shapeId: 'straight', sections: 2, finishId: 'white', branded: false });
  assert.equal(s.drinksMode, 'all-inclusive');
  assert.equal(s.staffCount, 3);
  const own = reach(state({ drinksMode: 'own', staffCount: 6 }), 'drinks');
  assert.equal(own.drinksMode, 'own');
  assert.equal(reach(own, 'staff').staffCount, 6);
});

test('changing the guests moves the recommended bar and team, but not the guest’s own choices', () => {
  const auto = setGuests(reach(reach(state({ guests: 50 }), 'bar'), 'staff'), 100);
  assert.equal(auto.bar?.sections, 4);
  assert.equal(auto.staffCount, 5);
  const own = setGuests(chooseStaff(chooseShape(state({ guests: 50 }), 'straight', 5), 8), 100);
  assert.equal(own.bar?.sections, 5);
  assert.equal(own.staffCount, 8);
  assert.equal(setGuests(state(), 5).guests, 10);
});

test('a choice stays the guest’s own even when it happens to match a recommendation later', () => {
  // 100 guests: they pick a 3m bar and 3 bartenders, both smaller than recommended.
  let s = reach(reach(state({ guests: 100 }), 'bar'), 'staff');
  s = chooseStaff(chooseShape(s, 'straight', 2), 3);
  assert.equal(s.barPicked, true);
  assert.equal(s.staffPicked, true);
  // At 50 guests those are exactly what we'd recommend. Going on to 150 must not move them.
  s = setGuests(setGuests(s, 50), 150);
  assert.deepEqual([s.bar?.shapeId, s.bar?.sections, s.staffCount], ['straight', 2, 3]);
  // Choosing our recommendation hands them back to us.
  s = chooseStaff(chooseShape(s, 'horseshoe', 6), 7);
  assert.equal(s.barPicked, false);
  assert.equal(s.staffPicked, false);
  s = setGuests(s, 100);
  assert.deepEqual([s.bar?.shapeId, s.bar?.sections, s.staffCount], ['straight', 4, 5]);
});

test('a bar is not moved if that would lose the finish the guest chose', () => {
  // The LOVE bar only comes as a 3m bar. More guests must not swap it for a plain horseshoe.
  const love = { ...reach(state({ guests: 50 }), 'bar') };
  const withLove = { ...love, bar: { ...love.bar!, finishId: 'love' as const } };
  const more = setGuests(withLove, 200);
  assert.deepEqual(more.bar, { shapeId: 'straight', sections: 2, finishId: 'love', branded: false });
  // A finish every bar comes in moves with the bar.
  const mirror = setGuests({ ...love, bar: { ...love.bar!, finishId: 'mirror' as const } }, 100);
  assert.deepEqual(mirror.bar, { shapeId: 'straight', sections: 4, finishId: 'mirror', branded: false });
});

test('choosing a shape keeps the finish where it can', () => {
  const s = chooseShape(state({ bar: bar({ finishId: 'mirror' }) }), 'round');
  assert.deepEqual(s.bar, { shapeId: 'round', sections: 8, finishId: 'mirror', branded: false });
  const branded = chooseShape(state({ bar: bar({ branded: true }) }), 'round');
  assert.deepEqual(branded.bar, { shapeId: 'round', sections: 8, finishId: 'white', branded: true });
  assert.equal(chooseShape(state({ bar: bar() }), 'round').bar?.finishId, 'led');
});

test('choices survive a share link, without the postcode', () => {
  const s = state({ guests: 120, date: '2027-06-12', bar: bar({ shapeId: 'horseshoe', sections: 6 }), drinksMode: 'all-inclusive', postcode: 'E11 1AA', glasses: { 'glass-flute': 120 } });
  const back = decodeState(encodeState(s));
  assert.deepEqual(back, { ...s, postcode: '' });
  assert.equal(decodeState('not-a-quote'), null);
  assert.equal(decodeState('%%%'), null);
  for (const notChoices of [null, undefined, 7, 'x', [], [DEFAULT_STATE]]) assert.equal(parseState(notChoices), null);
});

test('one bad value costs only that value, never the whole quote', () => {
  const good = state({ guests: 120, bar: bar({ sections: 3 }), drinksMode: 'all-inclusive', igloos: 2 });
  const fix = (over: Record<string, unknown>) => parseState({ ...good, ...over });
  assert.equal(fix({ guests: 5 })?.guests, 100);
  assert.equal(fix({ guests: 5 })?.igloos, 2);
  assert.equal(fix({ open: '18:15' })?.open, '18:00');
  assert.equal(fix({ igloos: -3 })?.igloos, 0);
  assert.equal(fix({ igloos: 1e9 })?.igloos, 0);
  assert.equal(fix({ bar: { shapeId: 'pyramid', sections: 2, finishId: 'white', branded: false } })?.bar, null);
  assert.equal(fix({ drinksMode: 'free-bar' })?.drinksMode, null);
  // A link made before a field existed still opens.
  const older = Object.fromEntries(Object.entries(good).filter(([key]) => !['barPicked', 'staffPicked', 'marqueeItems'].includes(key)));
  assert.deepEqual(parseState(older), good);
  // Things we don't list are dropped rather than carried round in links.
  const tidy = fix({ menu: ['peroni', 'peroni', 'gone'], bottles: { moet: 2, peroni: 4, gone: 1 }, glasses: { 'glass-flute': 10, gone: 5 }, marqueeItems: { 'mq-clear-span': 1, gone: 3 }, __proto__: { guests: 999 } });
  assert.deepEqual(tidy?.menu, ['peroni']);
  assert.deepEqual(tidy?.bottles, { moet: 2 });
  assert.deepEqual(tidy?.glasses, { 'glass-flute': 10 });
  assert.deepEqual(tidy?.marqueeItems, { 'mq-clear-span': 1 });
  assert.equal(tidy?.guests, 120);
});

test('a date that is not a real, sensible day is treated as no date, and never breaks the quote', () => {
  for (const bad of ['0002-12-06', '0027-06-12', '20277-06-12', '2027-02-30', '9999-12-31', '2027-13-01', 'tomorrow', '', 12]) {
    assert.equal(parseState({ ...DEFAULT_STATE, date: bad })?.date, null, String(bad));
  }
  assert.equal(parseState({ ...DEFAULT_STATE, date: '2027-06-12' })?.date, '2027-06-12');
  // Even if one slips through (typed straight into the page), the quote still builds, without dates.
  for (const bad of ['0002-12-06', '2027-02-30', '9999-12-31']) {
    const q = buildQuote(state({ date: bad, close: '01:00', bar: bar(), drinksMode: 'all-inclusive' }));
    assert.equal(q.schedule?.date, null, bad);
    assert.equal(q.schedule?.setupDate, null, bad);
    assert.equal(priced(q, 'drinks-package'), 100 * 4500);
  }
});

test('on a clock-change night the quote says what happens to the hours', () => {
  const ordinary = buildQuote(state({ date: '2027-10-23', open: '19:00', close: '02:00', drinksMode: 'all-inclusive' }));
  assert.equal(ordinary.clockNote, null);
  assert.equal(ordinary.drinksPerHead, 4500);
  const back = buildQuote(state({ date: '2027-10-30', open: '19:00', close: '02:00', drinksMode: 'all-inclusive' }));
  assert.equal(back.drinksPerHead, 5000);
  assert.match(back.clockNote ?? '', /go back.*8 hours.*1 hour more/);
  assert.ok(back.notes.includes(back.clockNote!));
  const forward = buildQuote(state({ date: '2027-03-27', open: '19:00', close: '02:00', drinksMode: 'all-inclusive' }));
  assert.equal(forward.drinksPerHead, 4000);
  assert.match(forward.clockNote ?? '', /go forward.*6 hours.*1 hour less/);
});

test('champagne is by the bottle: Majestic price plus 25%, to the nearest pound', () => {
  const perBottle = (id: string) => {
    const d = MENU.find((m) => m.id === id);
    assert.ok(d && d.terms.kind === 'bottle', id);
    return d.terms.kind === 'bottle' ? d.terms.perBottle : -1;
  };
  assert.equal(perBottle('veuve-clicquot'), 7000); // £56 × 1.25 = £70
  assert.equal(perBottle('moet'), 6100); // £49 × 1.25 = £61.25
  assert.equal(perBottle('dom-perignon'), 26900); // £215 × 1.25 = £268.75

  const base = buildQuote(state({ drinksMode: 'all-inclusive' }));
  const q = buildQuote(state({ drinksMode: 'all-inclusive', bottles: { 'veuve-clicquot': 6, moet: 2 } }));
  assert.equal(priced(q, 'bottle-veuve-clicquot'), 42000);
  assert.equal(priced(q, 'bottle-moet'), 12200);
  assert.equal(q.subtotal - base.subtotal, 54200);
  // Bottles never change the price per guest.
  assert.equal(q.drinksPerHead, base.drinksPerHead);
  // A bottle count for something that isn't sold by the bottle is ignored.
  assert.equal(buildQuote(state({ drinksMode: 'all-inclusive', bottles: { peroni: 10 } })).subtotal, base.subtotal);
});

test('the standard menu has a red, a white, a rosé and a prosecco, and no champagne', () => {
  const menu = standardMenu();
  for (const id of ['villa-vito-pinot-grigio', 'house-red', 'house-rose', 'aqualta-prosecco']) assert.ok(menu.includes(id), id);
  for (const id of ['veuve-clicquot', 'moet', 'dom-perignon']) assert.equal(menu.includes(id), false, id);
  assert.equal(searchMenu('champagne').filter((d) => d.terms.kind === 'bottle').length, 3);
  assert.ok(searchMenu('veuve clique').some((d) => d.id === 'veuve-clicquot'));
  assert.ok(searchMenu('moet').some((d) => d.id === 'moet'));
});

test('soft drinks: Coca-Cola and 7UP are on the standard menu; new brands wait for a price', () => {
  const std = standardMenu();
  for (const id of ['coca-cola', 'seven-up', 'soft-drinks']) assert.ok(std.includes(id), id);
  for (const id of ['malibu', 'archers']) {
    assert.equal(MENU.find((d) => d.id === id)?.terms.kind, 'ask', id);
    assert.equal(std.includes(id), false);
  }
  assert.ok(searchMenu('malibu').length === 1 && searchMenu('peach schnapps')[0]?.id === 'archers');
});

test('cocktails are free with all-inclusive drinks, up to four, and appear on the menu', () => {
  const base = buildQuote(state({ drinksMode: 'all-inclusive' }));
  const q = buildQuote(state({ drinksMode: 'all-inclusive', cocktails: ['mojito', 'espresso-martini'] }));
  assert.equal(q.subtotal, base.subtotal);
  assert.deepEqual(q.menu.at(-1), { name: 'Cocktails', drinks: ['Mojito', 'Espresso Martini'] });
  assert.ok(q.menu.some((row) => row.name === 'Beer' && row.drinks.includes('Corona Extra')));
  // Own drinks: no menu.
  assert.deepEqual(buildQuote(state({ drinksMode: 'own', cocktails: ['mojito'] })).menu, []);
  // Saved choices keep only cocktails we list, and no more than four.
  const kept = parseState({ ...DEFAULT_STATE, cocktails: ['mojito', 'gone', 'negroni', 'margarita', 'cosmopolitan', 'pina-colada'] });
  assert.deepEqual(kept?.cocktails, ['mojito', 'negroni', 'margarita', 'cosmopolitan']);
});

// ─── Marquee ────────────────────────────────────────────────────────────────

test('marquee extras only count once a marquee is in the quote', () => {
  const chairsOnly = buildQuote(state({ marquee: true, marqueeItems: { 'mq-wooden-folding-chair': 80 } }));
  assert.equal(line(chairsOnly, 'marquee-mq-wooden-folding-chair'), undefined);
  assert.equal(line(chairsOnly, 'marquee')?.price.kind, 'pending');

  const withMarquee = buildQuote(state({ marquee: true, marqueeItems: { 'mq-clear-span': 1, 'mq-wooden-folding-chair': 80 } }));
  assert.equal(line(withMarquee, 'marquee-mq-clear-span')?.price.kind, 'pending');
  assert.equal(line(withMarquee, 'marquee-mq-wooden-folding-chair')?.detail, 'Quantity: 80');
  assert.equal(line(withMarquee, 'marquee-mq-clear-span')?.detail, '1 marquee');
  assert.ok(withMarquee.toConfirm >= 2);

  // Switched off, nothing from the marquee is in the quote, whatever was picked before.
  const off = buildQuote(state({ marquee: false, marqueeItems: { 'mq-clear-span': 1, 'mq-wooden-folding-chair': 80 } }));
  assert.equal(off.lines.some((l) => l.group === 'marquee'), false);
});

test('marquee prices are never shown as £0: unpriced lines stay out of the total', () => {
  const base = buildQuote(state({ bar: bar() }));
  const withMarquee = buildQuote(state({ bar: bar(), marquee: true, marqueeItems: { 'mq-chinese-hat': 2, 'mq-starlit-ceiling': 1 } }));
  assert.equal(withMarquee.subtotal, base.subtotal);
  assert.ok(withMarquee.toConfirm > base.toConfirm);
});

test('marquee quantities are kept to what the builder offers', () => {
  const q = buildQuote(state({ marquee: true, marqueeItems: { 'mq-clear-span': 2000, 'mq-starlit-ceiling': 2000, 'mq-wooden-folding-chair': 2000 } }));
  assert.equal(line(q, 'marquee-mq-clear-span')?.detail, '6 marquees');
  assert.equal(line(q, 'marquee-mq-starlit-ceiling')?.detail, '1 set');
  assert.equal(line(q, 'marquee-mq-wooden-folding-chair')?.detail, 'Quantity: 1000');
});

test('marquee range: unique ids, a structure group, and no partner name in customer wording', () => {
  assert.equal(new Set(MARQUEE_ITEMS.map((i) => i.id)).size, MARQUEE_ITEMS.length);
  assert.ok(MARQUEE_GROUPS.some((g) => g.kind === 'structure'));
  assert.equal(hasStructure({ 'mq-wooden-folding-chair': 10 }), false);
  assert.equal(hasStructure({ 'mq-chinese-hat': 1 }), true);
  for (const item of MARQUEE_ITEMS) {
    assert.doesNotMatch(`${item.name} ${item.detail}`, /\bTM\b|Event Hire|the site|the page/i, item.id);
    assert.ok(item.id.length <= 60, item.id);
  }
});

test('price list sanity', () => {
  assert.equal(PRICES.staffPerHour, 2800);
  assert.equal(PRICES.glass, 80);
  assert.equal(PRICES.delivery, 9500);
});
