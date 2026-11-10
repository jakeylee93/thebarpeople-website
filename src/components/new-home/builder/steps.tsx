'use client';

// The steps of "Build your package", except drinks, the marquee and the final
// quote (those have their own files). Headings live in the shell.

import { useState, useSyncExternalStore } from 'react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassGlyph, { IceGlyph } from '@/components/visual-quote/GlassGlyph';
import { GLASSES } from '@/lib/visual-quote/catalogue';
import { formatPence, formatPenceCompact } from '@/lib/visual-quote/money';
import { addDaysIso, formatDate, formatDuration, formatTime, timeOptions } from '@/lib/visual-quote/time';
import {
  BAR_SHAPES, FINISHES, barName, barNameInSentence, barPrice, barSizeLabel, findShape, finishesFor, normaliseBar, recommendStaff, runLength, sectionsPrice,
  type BarChoice, type BarShape,
} from '@/lib/quote/bars';
import { drinksPerHead } from '@/lib/quote/drinks';
import { PRICES, TIME_STEP } from '@/lib/quote/prices';
import { GUESTS_MAX, GUESTS_MIN, STAFF_MAX, chooseShape, chooseStaff, recommendedBar, setGuests, type Quote, type QuoteState } from '@/lib/quote/quote';
import { COLLECTION_DAYS, STAFF_EARLY_OPTIONS, setupLeadMinutes } from '@/lib/quote/schedule';
import BarDiagram from '../package/BarDiagram';
import { Badge, Counter, DateField, Hint, Note, RadioCard, Segmented, field, ring } from './ui';

export interface StepProps {
  state: QuoteState;
  /** Merge a change into the choices. */
  set: (patch: Partial<QuoteState>) => void;
  /** Replace the choices using the engine's helpers. */
  update: (fn: (s: QuoteState) => QuoteState) => void;
  quote: Quote;
  ledColour: string;
  setLedColour: (hex: string) => void;
}

const TIMES = timeOptions(TIME_STEP);
const noSubscribe = () => () => {};
const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
export const useToday = () => useSyncExternalStore(noSubscribe, localToday, () => undefined);

/** The days the builder takes: from tomorrow, up to five years ahead. */
export function dateRange(today: string | undefined): { min?: string; max?: string } {
  if (!today) return {};
  return { min: addDaysIso(today, 1), max: `${Number(today.slice(0, 4)) + 5}-12-31` };
}

/** Why the hours are an hour out on the night the clocks change. */
function ClockNote({ quote }: { quote: Quote }) {
  if (!quote.clockNote) return null;
  return <p role="note" className="mt-3 rounded-[14px] bg-nh-mist px-4 py-3 text-[14px] leading-relaxed">{quote.clockNote}</p>;
}

// ─── 1. Event ───────────────────────────────────────────────────────────────

export function EventStep({ state, set, update, quote }: StepProps) {
  const range = dateRange(useToday());
  const rec = quote.recommended;
  const recBar = recommendedBar(state.guests);
  const s = quote.schedule;
  return (
    <div>
      <Note>Roughly is fine. We’ll use it to recommend the right bar and team, and you can change anything.</Note>

      <div className="mt-8 flex flex-col items-center gap-5">
        <p className="text-[14px] font-semibold">Guests</p>
        <Counter label="Guests" value={state.guests} onChange={(n) => update((st) => setGuests(st, n))} step={10} min={GUESTS_MIN} max={GUESTS_MAX} size="xl" />
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Quick picks">
          {[50, 100, 150, 200, 300].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update((st) => setGuests(st, n))}
              aria-pressed={state.guests === n}
              className={cn(
                'rounded-full border px-4 py-2 text-[15px] font-semibold tabular-nums transition',
                state.guests === n ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line hover:border-nh-ink',
                ring,
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-9 grid gap-3 sm:grid-cols-3">
        <DateField label="Event date" value={state.date} onChange={(date) => set({ date })} min={range.min} max={range.max} />
        <label className="block text-[14px] font-semibold">
          Bar opens
          <select value={state.open} onChange={(e) => set({ open: e.currentTarget.value })} className={field}>
            {TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="block text-[14px] font-semibold">
          Bar closes
          <select value={state.close} onChange={(e) => set({ close: e.currentTarget.value })} className={field}>
            {TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>
      {quote.scheduleIssue && <p role="alert" className="mt-2 text-[14px] font-semibold text-[#a12b2b]">{quote.scheduleIssue}.</p>}
      <ClockNote quote={quote} />

      <div className="mt-7 rounded-[20px] bg-nh-mist p-5" aria-live="polite">
        <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-nh-ash">We’d recommend</p>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          <li>
            <p className="font-nh-display text-[22px] font-extrabold leading-tight">{barName(recBar)}</p>
            <p className="text-[13px] text-nh-ash">for {state.guests} guests</p>
          </li>
          <li>
            <p className="font-nh-display text-[22px] font-extrabold leading-tight">{rec.staff} bartenders</p>
            <p className="text-[13px] text-nh-ash">at least two on every job</p>
          </li>
          {s && (
            <li>
              <p className="font-nh-display text-[22px] font-extrabold leading-tight">{formatPenceCompact(drinksPerHead(s.barMinutes))} a guest</p>
              <p className="text-[13px] text-nh-ash">all-inclusive drinks, {formatDuration(s.barMinutes)}</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

// ─── 2. Bar ─────────────────────────────────────────────────────────────────

function shapePriceLabel(shape: BarShape, current: BarChoice | null): string {
  if (shape.pricing === 'to-confirm') return 'Price to confirm';
  if (shape.pricing === 'round') return formatPenceCompact(PRICES.barRound);
  const corners = shape.corners * PRICES.barCorner;
  if (current?.shapeId === shape.id || shape.minSections === shape.maxSections) {
    const sections = current?.shapeId === shape.id ? current.sections : shape.defaultSections;
    return formatPenceCompact(sectionsPrice(sections) + corners);
  }
  return `From ${formatPenceCompact(sectionsPrice(shape.minSections) + corners)}`;
}

export function BarStep({ state, update, quote }: StepProps) {
  const rec = quote.recommended.bar;
  const bar = state.bar ?? recommendedBar(state.guests);
  const shape = findShape(bar.shapeId)!;
  const sizes = Array.from({ length: shape.maxSections - shape.minSections + 1 }, (_, i) => shape.minSections + i);
  const price = barPrice(bar);
  return (
    <div>
      <Note>
        For {state.guests} guests we’d recommend the <strong className="text-nh-ink">{barName(recommendedBar(state.guests))}</strong>. Pick any shape you like.
      </Note>
      <fieldset className="mt-6">
        <legend className="sr-only">Bar shape</legend>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {BAR_SHAPES.map((sh) => {
            const checked = bar.shapeId === sh.id;
            const preview = normaliseBar({
              shapeId: sh.id,
              sections: checked ? bar.sections : sh.id === rec.shapeId ? rec.sections : sh.defaultSections,
              finishId: bar.finishId, branded: false,
            });
            return (
              <RadioCard key={sh.id} name="bar-shape" value={sh.id} checked={checked}
                onChange={() => update((st) => chooseShape(st, sh.id, sh.id === rec.shapeId && !checked ? rec.sections : undefined))}
                className="bg-nh-mist p-3 pb-3.5">
                <span className="flex h-6 items-center justify-between">
                  {sh.id === rec.shapeId ? <Badge>Recommended</Badge> : <span />}
                  {checked && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nh-ink text-white"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                  )}
                </span>
                <BarDiagram bar={preview} decorative artworkText={false} className="mt-1" />
                <span className="mt-1 block text-[15px] font-bold leading-tight">{sh.name}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-nh-ash">{shapePriceLabel(sh, state.bar)}</span>
              </RadioCard>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 rounded-[20px] border-2 border-nh-ink p-4 sm:p-5" aria-live="polite">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <p className="font-nh-display text-[22px] font-extrabold leading-tight">{barName(bar)}</p>
          <p className="font-nh-display text-[22px] font-extrabold tabular-nums">
            {price ? formatPenceCompact(price.pence) : <span className="text-[16px] font-semibold text-nh-ash">Price to confirm</span>}
            {price && <span className="text-[13px] font-semibold text-nh-ash"> + VAT</span>}
          </p>
        </div>
        <p className="text-[14px] text-nh-ash">{shape.blurb}</p>
        {sizes.length > 1 && (
          <div className="mt-4">
            <p className="text-[14px] font-semibold">{shape.id === 'straight' ? 'Length' : 'Size'}</p>
            <Segmented
              className="mt-2"
              legend={shape.id === 'straight' ? 'Bar length' : 'Number of 1.5m sections'}
              name="bar-size"
              value={bar.sections}
              onChange={(n) => update((st) => chooseShape(st, shape.id, n))}
              options={sizes.map((n) => ({
                value: n,
                label: shape.id === 'straight' ? runLength(n) : `${n} sections`,
                marked: shape.id === rec.shapeId && n === rec.sections,
              }))}
            />
            <p className="mt-2 text-[13px] text-nh-ash">
              {price?.working}.{' '}
              {shape.id === 'straight' && bar.sections === 1
                ? `The 3m bar is ${formatPenceCompact(PRICES.barTwoSections)}, and each 1.5m section after that adds ${formatPenceCompact(PRICES.barExtraSection)}.`
                : `Each extra 1.5m section adds ${formatPenceCompact(PRICES.barExtraSection)}.`}
            </p>
          </div>
        )}
        {sizes.length === 1 && price && <p className="mt-2 text-[13px] text-nh-ash">{price.working}.</p>}
      </div>
    </div>
  );
}

// ─── 3. Style ───────────────────────────────────────────────────────────────

export const LED_COLOURS = [
  { name: 'Pink', hex: '#ff3d9a' },
  { name: 'Purple', hex: '#9b5cff' },
  { name: 'Blue', hex: '#2e7dff' },
  { name: 'Aqua', hex: '#19d3e6' },
  { name: 'Green', hex: '#2fdc6f' },
  { name: 'Amber', hex: '#ffb020' },
  { name: 'Red', hex: '#ff3b3b' },
] as const;

export function StyleStep({ state, set, ledColour, setLedColour }: StepProps) {
  const bar = state.bar ?? recommendedBar(state.guests);
  const finishes = finishesFor(bar.shapeId, bar.sections);
  const setBar = (patch: Partial<BarChoice>) => set({ bar: normaliseBar({ ...bar, ...patch }) });
  return (
    <div>
      <Note>Choose the finish for your {barNameInSentence(bar)}, and add your own artwork if you’d like it branded.</Note>

      <div className="relative mt-5 rounded-[24px] bg-[radial-gradient(ellipse_at_50%_35%,#ffffff,#eceae5)] px-2 pb-2 pt-9 sm:px-8">
        {bar.branded && (
          <div className="nh-pop pointer-events-none absolute left-1/2 top-3 z-10 -translate-x-1/2">
            <div className="nh-glow-ring rounded-full p-[2px] shadow-[0_0_26px_rgba(155,92,255,0.5)]">
              <p className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-nh-ink px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
                <Sparkles className="h-3.5 w-3.5" aria-hidden /> Free artwork service
              </p>
            </div>
          </div>
        )}
        <BarDiagram bar={bar} ledColour={ledColour} className="mx-auto max-w-[620px]" />
      </div>

      <fieldset className="mt-6">
        <legend className="text-[15px] font-bold">Finish</legend>
        <div className={cn('mt-3 grid grid-cols-2 gap-3', finishes.length >= 4 ? 'lg:grid-cols-4' : finishes.length === 3 ? 'lg:grid-cols-3' : '')}>
          {FINISHES.filter((f) => finishes.includes(f.id)).map((f) => (
            <RadioCard key={f.id} name="finish" value={f.id} checked={bar.finishId === f.id} onChange={() => setBar({ finishId: f.id })} className="overflow-hidden bg-white">
              {/* Your own bar in each finish, drawn the same way as everywhere else. */}
              <span className="relative flex aspect-[4/3] items-center bg-[radial-gradient(ellipse_at_50%_35%,#ffffff,#eceae5)] px-1">
                <BarDiagram bar={normaliseBar({ ...bar, finishId: f.id, branded: false })} ledColour={ledColour} decorative artworkText={false} />
                {bar.finishId === f.id && (
                  <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-nh-ink text-white"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                )}
              </span>
              <span className="block px-3 pb-3 pt-2.5">
                <span className="block text-[15px] font-bold leading-tight">{f.name}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-nh-ash">{f.blurb}</span>
              </span>
            </RadioCard>
          ))}
        </div>
      </fieldset>

      {bar.finishId === 'led' && (
        <fieldset className="mt-5">
          <legend className="text-[15px] font-bold">Preview a colour</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {LED_COLOURS.map((c) => (
              <label key={c.hex} className="group relative flex h-10 w-10 cursor-pointer items-center justify-center" title={c.name}>
                <input type="radio" name="led-colour" checked={ledColour === c.hex} onChange={() => setLedColour(c.hex)} className="peer sr-only" aria-label={c.name} />
                <span
                  className={cn(
                    'block h-10 w-10 rounded-full border border-black/10 shadow-inner transition peer-focus-visible:ring-2 peer-focus-visible:ring-nh-ink peer-focus-visible:ring-offset-2',
                    ledColour === c.hex ? 'ring-2 ring-nh-ink ring-offset-2' : 'group-hover:scale-105',
                  )}
                  style={{ background: c.hex }}
                />
              </label>
            ))}
          </div>
          <p className="mt-2 text-[13px] text-nh-ash">LED bars change colour on the night, so you’re not tied to one.</p>
        </fieldset>
      )}

      {bar.finishId !== 'love' && <label
        className={cn(
          'relative mt-6 flex cursor-pointer items-start gap-4 rounded-[18px] border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2',
          bar.branded ? 'border-nh-ink' : 'border-nh-line hover:border-nh-ink/40',
        )}
      >
        <input type="checkbox" checked={bar.branded} onChange={(e) => setBar({ branded: e.currentTarget.checked })} className="sr-only" />
        <span aria-hidden className={cn('mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition', bar.branded ? 'bg-nh-ink' : 'bg-nh-line')}>
          <span className={cn('h-5 w-5 rounded-full bg-white shadow transition', bar.branded && 'translate-x-5')} />
        </span>
        <span>
          <span className="block text-[16px] font-bold">Custom branded</span>
          <span className="mt-0.5 block text-[14px] leading-relaxed text-nh-ash">
            Your logo, names or a pattern on every panel. Free artwork service: send us your logo and we’ll set it up.
          </span>
        </span>
      </label>}
    </div>
  );
}

// ─── 5. Glassware ───────────────────────────────────────────────────────────

export function GlasswareStep({ state, set }: StepProps) {
  const [more, setMore] = useState(() => GLASSES.some((g) => !g.common && (state.glasses[g.id] ?? 0) > 0));
  const shown = GLASSES.filter((g) => g.common || more);
  const setQty = (id: string, n: number) => set({ glasses: { ...state.glasses, [id]: n } });
  const total = GLASSES.reduce((sum, g) => sum + (state.glasses[g.id] ?? 0), 0);
  return (
    <div>
      <Note>
        Every glass is <strong className="text-nh-ink">{formatPence(PRICES.glass)}</strong> to hire. Tap “One per guest” to match your {state.guests} guests.
      </Note>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {shown.map((g) => {
          const qty = state.glasses[g.id] ?? 0;
          return (
            <li key={g.id} className={cn('rounded-[18px] border-2 p-4 transition', qty > 0 ? 'border-nh-ink' : 'border-nh-line')}>
              <div className="flex items-center gap-3">
                <GlassGlyph glyph={g.glyph} className="h-12 w-12 shrink-0 text-nh-ink" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold leading-tight">{g.name}</p>
                  <p className="text-[13px] leading-snug text-nh-ash">{g.detail}</p>
                </div>
                {qty > 0 && <p className="shrink-0 text-[15px] font-semibold tabular-nums">{formatPence(qty * PRICES.glass)}</p>}
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Counter label={g.name} value={qty} onChange={(n) => setQty(g.id, n)} step={10} min={0} max={5000} />
                <button type="button" onClick={() => setQty(g.id, state.guests)} className={cn('min-h-10 rounded-full px-3 text-[13px] font-semibold underline underline-offset-4', ring)}>
                  One per guest
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {!more ? (
          <button type="button" onClick={() => setMore(true)} className={cn('inline-flex min-h-10 items-center gap-1.5 rounded-full border border-nh-line px-4 text-[14px] font-semibold hover:border-nh-ink', ring)}>
            More glasses <ChevronDown className="h-4 w-4" aria-hidden />
          </button>
        ) : <span />}
        {total > 0 && <p className="text-[14px] text-nh-ash" aria-live="polite">{total} glasses · {formatPence(total * PRICES.glass)}</p>}
      </div>
    </div>
  );
}

// ─── 6. Ice and fridges ─────────────────────────────────────────────────────

function CountedRow({ icon, name, detail, each, value, onChange }: {
  icon: 'igloo-box' | 'bar-fridge'; name: string; detail: string; each: number; value: number; onChange: (n: number) => void;
}) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4 rounded-[18px] border-2 p-4 transition', value > 0 ? 'border-nh-ink' : 'border-nh-line')}>
      <div className="flex min-w-0 items-center gap-3">
        <IceGlyph kind={icon} className="h-12 w-12 shrink-0 text-nh-ink" />
        <div className="min-w-0">
          <p className="text-[16px] font-bold leading-tight">{name}</p>
          <p className="text-[13px] leading-snug text-nh-ash">{detail}</p>
          <p className="mt-0.5 text-[14px] font-semibold">{formatPenceCompact(each)} each</p>
        </div>
      </div>
      <Counter label={name} value={value} onChange={onChange} min={0} max={50} />
    </div>
  );
}

export function IceStep({ state, set }: StepProps) {
  return (
    <div>
      <Note>Keep everything cold. Add what you need, or leave these at zero.</Note>
      <div className="mt-6 space-y-3">
        <CountedRow icon="igloo-box" name="Igloo of ice" detail="A full insulated chest of ice, delivered with the bar." each={PRICES.igloo}
          value={state.igloos} onChange={(igloos) => set({ igloos })} />
        <CountedRow icon="bar-fridge" name="Single bar fridge" detail="An under-counter fridge for wine, beer and mixers." each={PRICES.fridgeSingle}
          value={state.fridgesSingle} onChange={(fridgesSingle) => set({ fridgesSingle })} />
        <CountedRow icon="bar-fridge" name="Double back-bar fridge" detail="A double-door fridge for bigger bars." each={PRICES.fridgeDouble}
          value={state.fridgesDouble} onChange={(fridgesDouble) => set({ fridgesDouble })} />
      </div>
      <Note className="mt-4 text-[13px]">Fridges need a power socket close to the bar.</Note>
    </div>
  );
}

// ─── 7. Bartenders ──────────────────────────────────────────────────────────

const EARLY_LABEL: Record<number, string> = { 30: '30 min', 60: '1 hour', 90: '1½ hours', 120: '2 hours' };

export function StaffStep({ state, set, update, quote }: StepProps) {
  const rec = recommendStaff(state.guests);
  const count = state.staffCount ?? rec;
  const s = quote.schedule;
  const line = quote.lines.find((l) => l.id === 'staff');
  return (
    <div>
      <Note>
        We recommend <strong className="text-nh-ink">{rec} bartenders</strong> for {state.guests} guests. There are always at least {PRICES.staffMinimum} on every job.
      </Note>

      <div className="mt-7 flex flex-col items-center gap-3">
        <Counter label="Bartenders" value={count} onChange={(n) => update((st) => chooseStaff(st, n))} min={PRICES.staffMinimum} max={STAFF_MAX} size="xl" />
        {count === rec ? <Badge>Recommended</Badge> : (
          <button type="button" onClick={() => update((st) => chooseStaff(st, rec))} className={cn('min-h-10 rounded-full px-3 text-[13px] font-semibold underline underline-offset-4', ring)}>
            Use our recommendation ({rec})
          </button>
        )}
      </div>

      <div className="mt-8">
        <p className="flex items-center gap-2 text-[14px] font-semibold">
          Team arrives before the bar opens
          <Hint label="About staff times">
            Tell us when the bar opens and closes. Your bartenders are hired from at least 30 minutes before it opens, to set up, until 30 minutes after it closes, to clear down.
          </Hint>
        </p>
        <Segmented
          className="mt-2"
          legend="How early the team arrives"
          name="staff-early"
          value={state.staffEarly}
          onChange={(staffEarly) => set({ staffEarly })}
          options={STAFF_EARLY_OPTIONS.map((m) => ({ value: m, label: EARLY_LABEL[m], sub: m === 30 ? 'minimum' : undefined }))}
        />
      </div>

      {s ? (
        <ol className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Times on the day">
          {[
            ['Team arrives', formatTime(s.staffArrive)],
            ['Bar opens', formatTime(s.timing.startMinutes)],
            ['Bar closes', formatTime(s.timing.endMinutes)],
            ['Team finishes', formatTime(s.staffFinish)],
          ].map(([label, value], i) => (
            <li key={label} className={cn('rounded-[14px] px-3 py-2.5', i === 0 || i === 3 ? 'bg-nh-ink text-white' : 'bg-nh-mist')}>
              <p className={cn('text-[12px]', i === 0 || i === 3 ? 'text-white/70' : 'text-nh-ash')}>{label}</p>
              <p className="font-nh-display text-[19px] font-extrabold leading-tight">{value}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p role="alert" className="mt-6 text-[14px] font-semibold text-[#a12b2b]">{quote.scheduleIssue}.</p>
      )}
      <ClockNote quote={quote} />

      <div className="mt-4 rounded-[18px] bg-nh-mist px-5 py-4" aria-live="polite">
        {line?.price.kind === 'priced' ? (
          <p className="text-[16px]">
            <span className="text-nh-ash">{line.price.working} = </span>
            <strong className="font-nh-display text-[24px] tabular-nums">{formatPence(line.price.pence)}</strong>
            <span className="text-nh-ash"> + VAT</span>
          </p>
        ) : (
          <p className="text-[15px]">Add your bar times to see the price.</p>
        )}
        <p className="mt-1 text-[13px] leading-relaxed text-nh-ash">
          {formatPenceCompact(PRICES.staffPerHour)} per bartender per hour, from arrival to finish.
        </p>
      </div>
    </div>
  );
}

// ─── 8. Delivery and set-up ─────────────────────────────────────────────────

export function DeliveryStep({ state, set, quote }: StepProps) {
  const range = dateRange(useToday());
  const s = quote.schedule;
  // Dates come from the schedule, which only ever holds a real, checked date.
  const date = s?.date ?? null;
  const lead = setupLeadMinutes(state.guests);
  const onTheDayBy = s?.setupOnTheDayBy ?? null;
  const chosen = s?.setupDay ?? state.setupDay;
  return (
    <div>
      <Note>
        Delivery, set-up and collection is one fee of <strong className="text-nh-ink">{formatPenceCompact(PRICES.delivery)}</strong> for your bar and equipment.
      </Note>

      <DateField label="Event date" value={state.date} onChange={(d) => set({ date: d })} min={range.min} max={range.max} className="mt-6 max-w-xs" />
      {!s && quote.scheduleIssue && <p role="alert" className="mt-3 text-[14px] font-semibold text-[#a12b2b]">{quote.scheduleIssue}.</p>}

      <fieldset className="mt-6">
        <legend className="flex items-center gap-2 text-[15px] font-bold">
          When shall we set up?
          <Hint label="About set-up time">
            We need {formatDuration(lead)} to set up for {state.guests} guests: 2 hours for up to 50, 4 hours for up to 100 and 6 hours for more.
          </Hint>
        </legend>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <RadioCard name="setup" value="day-before" checked={chosen === 'day-before'} onChange={() => set({ setupDay: 'day-before' })} className="p-4">
            <span className="block text-[16px] font-bold">The day before</span>
            <span className="mt-0.5 block text-[14px] text-nh-ash">
              {date ? formatDate(addDaysIso(date, -1)) : 'Ready and waiting on the day'}
            </span>
          </RadioCard>
          <RadioCard
            name="setup" value="on-the-day"
            checked={chosen === 'on-the-day'}
            disabled={onTheDayBy === null}
            onChange={() => set({ setupDay: 'on-the-day' })}
            className="p-4"
          >
            <span className="block text-[16px] font-bold">On the day</span>
            <span className="mt-0.5 block text-[14px] text-nh-ash">
              {onTheDayBy !== null
                ? `We’ll arrive by ${formatTime(onTheDayBy)}${date ? `, ${formatDate(date, true)}` : ''}`
                : s
                  ? `Not available: we need ${formatDuration(lead)} before your bar opens, and we start from 7am`
                  : 'Add your bar times first'}
            </span>
          </RadioCard>
        </div>
      </fieldset>

      <div className="mt-6">
        <p className="text-[15px] font-bold">When shall we collect?</p>
        <Segmented
          className="mt-3"
          legend="Collection day"
          name="collection"
          value={state.collectionDays}
          onChange={(collectionDays) => set({ collectionDays })}
          options={COLLECTION_DAYS.map((d) => ({
            value: d,
            label: d === 1 ? 'The day after' : `${d} days after`,
            sub: date ? formatDate(addDaysIso(date, d), true) : undefined,
          }))}
        />
      </div>

      <label className="mt-6 block max-w-xs text-[14px] font-semibold">
        Event postcode
        <input
          name="postcode" autoComplete="postal-code" value={state.postcode} placeholder="e.g. E11 1AA"
          onChange={(e) => set({ postcode: e.currentTarget.value.slice(0, 10) })}
          className={cn(field, 'uppercase placeholder:normal-case')}
        />
      </label>
    </div>
  );
}

export { barSizeLabel };
