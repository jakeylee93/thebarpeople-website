// The quote as a PDF, with The Bar People's logo. Built in the browser on
// demand (this file is loaded only when the guest asks for the PDF).

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFImage, type PDFPage } from 'pdf-lib';
import { formatPence } from '../visual-quote/money.ts';
import { formatDate, formatDuration, formatTime } from '../visual-quote/time.ts';
import { DRINK_CATEGORIES, findDrink } from './drinks.ts';
import { GROUP_LABELS, type LineGroup, type Quote, type QuoteState } from './quote.ts';

export interface QuotePdfInput {
  state: QuoteState;
  quote: Quote;
  /** The roundel as PNG bytes; left out if it could not be loaded. */
  logoPng: Uint8Array | null;
  /** The day the quote was made, "YYYY-MM-DD". */
  preparedOn: string;
  /** Who it's for, if they told us. */
  customerName?: string;
  /** A link that reopens these choices. */
  shareUrl?: string;
}

export const QUOTE_CONTACTS = [
  'Jake  07557 402200  jake@thebarpeople.co.uk',
  'Kim  07724 601256  kim@thebarpeople.co.uk',
];

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const INK = rgb(0.07, 0.07, 0.07);
const ASH = rgb(0.42, 0.42, 0.42);
const LINE = rgb(0.89, 0.886, 0.867);
const MIST = rgb(0.949, 0.945, 0.933);

const PLAIN: Record<string, string> = {
  ł: 'l', Ł: 'L', đ: 'd', Đ: 'D', ı: 'i', ħ: 'h', Ħ: 'H', ŋ: 'n', Ŋ: 'N', ŧ: 't', Ŧ: 'T', ĸ: 'k',
  '→': 'to', '‘': '’', '‚': ',', '−': '-', '‐': '-', '‑': '-', '―': '-',
};

/**
 * Text the PDF's font can print. The built-in font covers Western European
 * text. Other letters are swapped for the nearest plain one (ł → l, Ż → Z) so
 * a name stays readable; anything with no plain equivalent (emoji, Chinese,
 * Arabic) is left out. Tabs and line breaks become a space.
 */
export function toPrintable(text: string, canPrint: (codePoint: number) => boolean): string {
  let out = '';
  for (const ch of text.replace(/\s+/g, ' ')) {
    if (canPrint(ch.codePointAt(0)!)) { out += ch; continue; }
    if (PLAIN[ch] !== undefined) { out += PLAIN[ch]; continue; }
    // Split an accented letter into the letter and its accent, and keep the letter.
    for (const part of ch.normalize('NFKD')) {
      if (canPrint(part.codePointAt(0)!) && !/\p{M}/u.test(part)) out += part;
      else if (PLAIN[part] !== undefined) out += PLAIN[part];
    }
  }
  return out.replace(/ {2,}/g, ' ').trim();
}

export async function buildQuotePdf(input: QuotePdfInput): Promise<Uint8Array> {
  const { state, quote } = input;
  const doc = await PDFDocument.create();
  doc.setTitle('Your quote from The Bar People');
  doc.setAuthor('The Bar People');
  doc.setSubject('Mobile bar hire quote');
  const regular = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let logo: PDFImage | null = null;
  if (input.logoPng) {
    try { logo = await doc.embedPng(input.logoPng); } catch { logo = null; }
  }

  const charset = new Set(regular.getCharacterSet());
  const safe = (text: string) => toPrintable(text, (codePoint) => charset.has(codePoint));
  /** A line title that would print as nothing (a request typed in emoji, say) gets a stand-in. */
  const titleOf = (title: string) => safe(title) || 'Your request (see your online quote)';

  const width = A4[0] - MARGIN * 2;
  let page: PDFPage = doc.addPage(A4);
  let y = A4[1] - MARGIN;

  const text = (s: string, x: number, yy: number, size: number, font: PDFFont = regular, color = INK) =>
    page.drawText(safe(s), { x, y: yy, size, font, color });
  const right = (s: string, xRight: number, yy: number, size: number, font: PDFFont = regular, color = INK) => {
    const t = safe(s);
    page.drawText(t, { x: xRight - font.widthOfTextAtSize(t, size), y: yy, size, font, color });
  };
  const rule = (yy: number, color = LINE) => page.drawLine({ start: { x: MARGIN, y: yy }, end: { x: MARGIN + width, y: yy }, thickness: 0.7, color });
  const wrap = (s: string, size: number, font: PDFFont, max: number): string[] => {
    const words = safe(s).split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let current = '';
    for (let w of words) {
      // A single word wider than the line (a long link) is broken by character.
      while (font.widthOfTextAtSize(w, size) > max) {
        let cut = w.length - 1;
        while (cut > 1 && font.widthOfTextAtSize(w.slice(0, cut), size) > max) cut--;
        if (current) { lines.push(current); current = ''; }
        lines.push(w.slice(0, cut));
        w = w.slice(cut);
      }
      const next = current ? `${current} ${w}` : w;
      if (font.widthOfTextAtSize(next, size) <= max || !current) current = next;
      else { lines.push(current); current = w; }
    }
    if (current) lines.push(current);
    return lines;
  };
  const footer = () => {
    const fy = MARGIN - 18;
    page.drawLine({ start: { x: MARGIN, y: fy + 22 }, end: { x: MARGIN + width, y: fy + 22 }, thickness: 0.7, color: LINE });
    text('The Bar People  ·  thebarpeople.co.uk', MARGIN, fy + 8, 8.5, bold);
    text(QUOTE_CONTACTS.join('   ·   '), MARGIN, fy - 4, 8, regular, ASH);
  };
  const ensure = (space: number) => {
    if (y - space >= MARGIN + 24) return;
    footer();
    page = doc.addPage(A4);
    y = A4[1] - MARGIN;
    text('Your quote from The Bar People (continued)', MARGIN, y - 4, 9, regular, ASH);
    y -= 26;
  };

  // ── Header ──
  const logoSize = 62;
  if (logo) page.drawImage(logo, { x: MARGIN, y: y - logoSize, width: logoSize, height: logoSize });
  right('QUOTE', MARGIN + width, y - 14, 9, bold, ASH);
  right(`Prepared ${formatDate(input.preparedOn)}`, MARGIN + width, y - 30, 10, regular, INK);
  const forName = safe(Array.from(input.customerName ?? '').slice(0, 60).join(''));
  if (forName) right(`For ${forName}`, MARGIN + width, y - 45, 10, regular, INK);
  y -= logoSize + 26;
  text('Your package', MARGIN, y, 26, bold);
  y -= 18;
  text('You bring the guests, we’ll bring the rest.', MARGIN, y, 10.5, regular, ASH);
  y -= 24;

  // ── Event summary ──
  const s = quote.schedule;
  const facts: [string, string][] = [['Guests', String(state.guests)]];
  facts.push(['Date', state.date ? formatDate(state.date) : 'To be confirmed']);
  if (s) {
    facts.push(['Bar open', `${formatTime(s.timing.startMinutes)} to ${formatTime(s.timing.endMinutes)} (${formatDuration(s.barMinutes)})`]);
    if (state.staffCount !== null) facts.push(['Team on site', `${formatTime(s.staffArrive)} to ${formatTime(s.staffFinish)}`]);
    if (quote.lines.some((l) => l.id === 'delivery')) {
      const setup = s.setupDay === 'on-the-day'
        ? `On the day${s.setupOnTheDayBy !== null ? `, by ${formatTime(s.setupOnTheDayBy)}` : ''}`
        : s.setupDate ? `The day before, ${formatDate(s.setupDate, true)}` : 'The day before';
      facts.push(['Set-up', setup]);
      facts.push(['Collection', s.collectionDate ? formatDate(s.collectionDate, true) : `${state.collectionDays === 1 ? 'The day' : `${state.collectionDays} days`} after`]);
    }
  }
  if (state.postcode.trim()) facts.push(['Postcode', state.postcode.trim().toUpperCase()]);
  const rows = Math.ceil(facts.length / 2);
  const boxH = rows * 30 + 14;
  page.drawRectangle({ x: MARGIN, y: y - boxH, width, height: boxH, color: MIST });
  facts.forEach(([label, value], i) => {
    const cx = MARGIN + 16 + (i % 2) * (width / 2);
    const cy = y - 20 - Math.floor(i / 2) * 30;
    text(label.toUpperCase(), cx, cy, 7, bold, ASH);
    text(value, cx, cy - 12, 10.5, regular, INK);
  });
  y -= boxH + 26;

  // ── Lines, by section ──
  const amountX = MARGIN + width;
  const detailMax = width - 110;
  let lastGroup: LineGroup | null = null;
  for (const line of quote.lines) {
    const working = line.price.kind === 'priced' ? line.price.working : '';
    const detail = wrap([line.detail, working].filter(Boolean).join('  ·  '), 8.5, regular, detailMax);
    const height = 12 + detail.length * 10.5 + 13;
    ensure(height + (line.group !== lastGroup ? 26 : 0));
    if (line.group !== lastGroup) {
      if (lastGroup !== null) y -= 4;
      text(GROUP_LABELS[line.group].toUpperCase(), MARGIN, y, 7.5, bold, ASH);
      y -= 7;
      rule(y, INK);
      y -= 15;
      lastGroup = line.group;
    }
    text(titleOf(line.title), MARGIN, y, 10, bold);
    if (line.price.kind === 'priced') right(formatPence(line.price.pence), amountX, y, 10, bold);
    else right(line.price.reason.startsWith('Add ') ? line.price.reason : 'To confirm', amountX, y, 9.5, regular, ASH);
    y -= 11.5;
    for (const d of detail) { text(d, MARGIN, y, 8.5, regular, ASH); y -= 10.5; }
    y -= 1;
    rule(y);
    y -= 12.5;
  }
  if (quote.lines.length === 0) {
    text('Nothing chosen yet.', MARGIN, y, 10.5, regular, ASH);
    y -= 24;
  }

  // ── Totals ──
  ensure(120);
  y -= 4;
  const tx = MARGIN + width - 230;
  const total = (label: string, value: string, strong = false) => {
    text(label, tx, y, strong ? 12 : 10, strong ? bold : regular, strong ? INK : ASH);
    right(value, amountX, y, strong ? 14 : 10, strong ? bold : regular, INK);
    y -= strong ? 22 : 16;
  };
  if (quote.subtotal === 0 && quote.toConfirm > 0) {
    // Nothing priced yet: never print that as £0.
    total('Total', 'To confirm', true);
    text(`We’ll confirm a price for ${quote.toConfirm === 1 ? 'this item' : `these ${quote.toConfirm} items`}.`, tx, y, 8.5, regular, ASH);
    y -= 14;
  } else {
    total('Subtotal', formatPence(quote.subtotal));
    total('VAT at 20%', formatPence(quote.vat));
    page.drawLine({ start: { x: tx, y: y + 8 }, end: { x: amountX, y: y + 8 }, thickness: 1, color: INK });
    y -= 8;
    total('Total', formatPence(quote.total), true);
    if (quote.toConfirm > 0) {
      text(`Plus ${quote.toConfirm} ${quote.toConfirm === 1 ? 'item' : 'items'} we’ll confirm a price for.`, tx, y, 8.5, regular, ASH);
      y -= 14;
    }
  }
  y -= 12;

  // ── Drinks menu ──
  if (state.drinksMode === 'all-inclusive') {
    const chosen = [...new Set(state.menu)].map(findDrink).filter((d): d is NonNullable<typeof d> => d !== null && d.terms.kind !== 'bottle');
    const byCategory = DRINK_CATEGORIES
      .map((c) => ({ name: c.name, drinks: chosen.filter((d) => d.category === c.id).map((d) => d.name) }))
      .filter((c) => c.drinks.length > 0);
    if (byCategory.length > 0) {
      ensure(40 + byCategory.length * 13);
      text('YOUR DRINKS MENU', MARGIN, y, 7.5, bold, ASH);
      y -= 8; rule(y, INK); y -= 15;
      for (const c of byCategory) {
        const lines = wrap(c.drinks.join(', '), 9, regular, width - 120);
        ensure(lines.length * 12 + 4);
        text(c.name, MARGIN, y, 9, bold);
        for (const l of lines) { text(l, MARGIN + 120, y, 9, regular, INK); y -= 12; }
        y -= 2;
      }
      y -= 12;
    }
  }

  // ── Notes ──
  const notes = [
    ...(quote.scheduleIssue ? [`${quote.scheduleIssue}. Drinks and bartenders are priced once your bar times are set.`] : []),
    ...quote.notes,
    'All prices are plus VAT, shown above. This is a quote, not a booking: nothing is charged, and dates are held only once we confirm.',
    // Only a short link is worth printing; the long self-contained one stays on screen.
    ...(input.shareUrl && input.shareUrl.length <= 90 ? [`Reopen or change this quote: ${input.shareUrl}`] : []),
  ];
  ensure(30 + notes.length * 14);
  text('GOOD TO KNOW', MARGIN, y, 7.5, bold, ASH);
  y -= 8; rule(y, INK); y -= 15;
  for (const note of notes) {
    const lines = wrap(note, 9, regular, width);
    ensure(lines.length * 12 + 6);
    for (const l of lines) { text(l, MARGIN, y, 9, regular, INK); y -= 12; }
    y -= 5;
  }

  footer();
  return doc.save();
}
