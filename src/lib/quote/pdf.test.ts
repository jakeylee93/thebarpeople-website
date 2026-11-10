import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { standardMenu } from './drinks.ts';
import { buildQuotePdf, toPrintable } from './pdf.ts';
import { buildQuote, DEFAULT_STATE, encodeState, type QuoteState } from './quote.ts';

const full: QuoteState = {
  ...DEFAULT_STATE,
  guests: 120, date: '2026-12-12', open: '18:00', close: '00:00',
  bar: { shapeId: 'horseshoe', sections: 6, finishId: 'mirror', branded: true },
  drinksMode: 'all-inclusive', menu: [...standardMenu(), 'grey-goose', 'hendricks', 'jack-daniels', 'kraken'],
  requests: ['Patrón Silver'],
  glasses: { 'glass-highball': 120, 'glass-wine': 120, 'glass-flute': 120, 'glass-martini': 60 },
  igloos: 2, fridgesSingle: 1, fridgesDouble: 1, staffCount: 6, staffEarly: 60,
  setupDay: 'on-the-day', collectionDays: 2, postcode: 'e11 1aa',
};

test('the quote PDF builds with the logo, is a valid PDF and a full quote fits two pages', async () => {
  const logo = new Uint8Array(readFileSync(join(process.cwd(), 'public/images/logos/bar-people-logo-360.png')));
  const bytes = await buildQuotePdf({
    state: full, quote: buildQuote(full), logoPng: logo, preparedOn: '2026-11-10', customerName: 'Sam Example',
    shareUrl: `https://thebarpeople.co.uk/#quote=${encodeState(full)}`,
  });
  if (process.env.PDF_OUT) writeFileSync(process.env.PDF_OUT, bytes);
  assert.equal(new TextDecoder().decode(bytes.slice(0, 5)), '%PDF-');
  const doc = await PDFDocument.load(bytes);
  assert.ok(doc.getPageCount() >= 1 && doc.getPageCount() <= 2, `pages: ${doc.getPageCount()}`);
  assert.equal(doc.getTitle(), 'Your quote from The Bar People');
});

test('it still builds with nothing chosen and no logo', async () => {
  const bytes = await buildQuotePdf({ state: DEFAULT_STATE, quote: buildQuote(DEFAULT_STATE), logoPng: null, preparedOn: '2026-11-10' });
  assert.equal((await PDFDocument.load(bytes)).getPageCount(), 1);
});

test('a very long quote runs onto more pages instead of off the page', async () => {
  const glasses = Object.fromEntries(['glass-highball', 'glass-wine', 'glass-flute', 'glass-martini', 'glass-whisky', 'glass-gin', 'glass-margarita', 'glass-pint', 'glass-half-pint', 'glass-shot'].map((id) => [id, 200]));
  const big: QuoteState = { ...full, glasses, menu: [...standardMenu(), 'grey-goose', 'hendricks', 'desperados', 'estrella-galicia', 'alhambra-reserva', 'kraken'], requests: ['One', 'Two', 'Three', 'Four', 'Five', 'Six'] };
  const bytes = await buildQuotePdf({ state: big, quote: buildQuote(big), logoPng: null, preparedOn: '2026-11-10' });
  assert.ok((await PDFDocument.load(bytes)).getPageCount() >= 2);
});

test('names and requests the font cannot print stay readable, and never break the PDF', async () => {
  const doc = await PDFDocument.create();
  const helvetica = new Set((await doc.embedFont(StandardFonts.Helvetica)).getCharacterSet());
  const print = (text: string) => toPrintable(text, (cp) => helvetica.has(cp));
  assert.equal(print('Michał Żółkowski'), 'Michal Zólkowski');
  assert.equal(print('Żubrówka wódka'), 'Zubrówka wódka');
  assert.equal(print('Patrón Silver'), 'Patrón Silver');
  assert.equal(print('gin\ttonic\nplease'), 'gin tonic please');
  assert.equal(print('茅台酒 Moutai'), 'Moutai');
  assert.equal(print('🍾🍾'), '');
  assert.equal(print('  spaced   out  '), 'spaced out');

  const state: QuoteState = { ...full, requests: ['🍾🍾', 'Żubrówka', '茅台酒', 'مشروب', 'A'.repeat(40)] };
  const pdf = await buildQuotePdf({ state, quote: buildQuote(state), logoPng: null, preparedOn: '2026-11-10', customerName: '王芳 \t Żółć 😀' });
  assert.equal((await PDFDocument.load(pdf)).getPageCount() >= 1, true);
});

test('the PDF builds when the bar times are not usable', async () => {
  const state: QuoteState = { ...full, close: full.open };
  const quote = buildQuote(state);
  assert.ok(quote.scheduleIssue);
  const pdf = await buildQuotePdf({ state, quote, logoPng: null, preparedOn: '2026-11-10' });
  assert.ok(pdf.length > 1000);
});
