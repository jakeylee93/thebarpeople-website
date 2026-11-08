'use client';

// The body of each "Build your package" step. Headings live in the shell.

import { useState, useSyncExternalStore } from 'react';
import { Check, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import GlassGlyph, { IceGlyph } from '@/components/visual-quote/GlassGlyph';
import { DRINKS_PACKAGES, GLASSES, ICE_AND_STORAGE, findBar } from '@/lib/visual-quote/catalogue';
import { formatPence } from '@/lib/visual-quote/money';
import { timeOptions } from '@/lib/visual-quote/time';
import {
  BAR_ART, BAR_GUESTS, GUESTS_MAX, GUESTS_MIN, LED_COLOURS, PACKAGE_BARS, recommendedBarId, suggestedBartenders,
  type DrinksChoice, type PackageQuote, type PackageState,
} from '@/lib/new-home/package';
import BarStage from './BarStage';
import { Counter, Note, RadioCard, ring } from './ui';

export interface StepProps {
  state: PackageState;
  set: (patch: Partial<PackageState>) => void;
  quote: PackageQuote;
}

// ─── Guests ─────────────────────────────────────────────────────────────────

export function GuestsStep({ state, set }: StepProps) {
  const rec = findBar(recommendedBarId(state.guests));
  const staff = suggestedBartenders(state.guests);
  return (
    <div>
      <Note>Roughly is fine. We’ll use it to suggest the right bar and team.</Note>
      <div className="mt-10 flex flex-col items-center gap-7">
        <Counter label="Guests" value={state.guests} onChange={(guests) => set({ guests })} step={10} min={GUESTS_MIN} max={GUESTS_MAX} size="xl" />
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Quick picks">
          {[50, 100, 150, 200, 300].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set({ guests: n })}
              aria-pressed={state.guests === n}
              className={cn(
                'rounded-full border px-4 py-2 text-[15px] font-semibold tabular-nums transition',
                state.guests === n ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line hover:border-nh-ink',
                ring,
              )}
            >
              {n === 300 ? '300+' : n}
            </button>
          ))}
        </div>
        {rec && (
          <p className="max-w-md rounded-[18px] bg-nh-mist px-5 py-4 text-center text-[15px] leading-relaxed">
            For {state.guests} guests we’d suggest the <strong>{rec.name}</strong> and{' '}
            <strong>{staff.low === staff.high ? staff.low : `${staff.low}–${staff.high}`} bartenders</strong>.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Bar ────────────────────────────────────────────────────────────────────

export function BarStep({ state, set }: StepProps) {
  const recId = recommendedBarId(state.guests);
  const rec = findBar(recId);
  const chosen = state.barId ?? recId;
  return (
    <div>
      <Note>
        Recommended for {state.guests} guests: <strong className="text-nh-ink">{rec?.name}</strong>. Tap any bar to choose it.
      </Note>
      <fieldset className="mt-6">
        <legend className="sr-only">Bar</legend>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {PACKAGE_BARS.map((b) => {
            const checked = chosen === b.id;
            const guests = BAR_GUESTS[b.id];
            return (
              <RadioCard key={b.id} name="bar" value={b.id} checked={checked} onChange={() => set({ barId: b.id })} className="bg-nh-mist p-3 pb-4">
                <span className="flex h-6 items-center justify-between">
                  {b.id === recId ? (
                    <span className="rounded-full bg-nh-ink px-2.5 py-0.5 text-[11px] font-semibold text-white">Recommended</span>
                  ) : <span />}
                  {checked && (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-nh-ink text-white">
                      <Check className="h-3.5 w-3.5" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="mt-3 flex h-[var(--ch)] items-end justify-center [--ch:104px] sm:[--ch:140px] lg:[--ch:150px]">
                  <BarStage barId={b.id} alt="" sizes="(min-width: 1024px) 240px, 44vw"
                    style={{ width: `min(92%, calc(var(--ch) * ${(BAR_ART[b.id].width / BAR_ART[b.id].height).toFixed(3)}))` }} />
                </span>
                <span className="mt-5 block text-[15px] font-bold leading-tight">{b.name}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-nh-ash">
                  {guests ? `Up to ${guests} guests` : b.shape}
                </span>
              </RadioCard>
            );
          })}
        </div>
      </fieldset>
      <Note className="mt-4">Guest numbers are a guide. We’ll check the space and the set-up with you.</Note>
    </div>
  );
}

// ─── Colour and branding ────────────────────────────────────────────────────

export function ColourStep({ state, set }: StepProps) {
  const barId = state.barId ?? recommendedBarId(state.guests);
  const bar = findBar(barId);
  const led = LED_COLOURS.find((c) => c.id === state.led) ?? null;
  return (
    <div>
      <Note>Pick an LED colour for your bar, or keep it classic white. You can also brand it with your own artwork.</Note>
      <div className="mt-6 rounded-[24px] bg-[radial-gradient(ellipse_at_50%_40%,#ffffff,#ecebe7)] px-5 pb-9 pt-16 sm:px-10">
        <BarStage
          barId={barId}
          led={state.led}
          branded={state.branded}
          alt={`${bar?.name ?? 'Bar'}${led ? `, glowing ${led.name.toLowerCase()}` : ', classic white'}${state.branded ? ', with your artwork on the front' : ''}`}
          sizes="(min-width: 1024px) 460px, 88vw"
          preload
          className="mx-auto w-full max-w-[460px]"
        />
      </div>

      <fieldset className="mt-6">
        <legend className="text-[15px] font-bold">Bar colour</legend>
        <div className="mt-3 flex flex-wrap gap-3">
          <Swatch name="Classic white" checked={state.led === null} onChange={() => set({ led: null })} style={{ background: '#ffffff' }} />
          {LED_COLOURS.map((c) => (
            <Swatch
              key={c.id}
              name={c.name}
              checked={state.led === c.id}
              onChange={() => set({ led: c.id })}
              style={{ background: c.id === 'cycle' ? 'conic-gradient(#ff3d9a, #9b5cff, #2e7dff, #19d3e6, #2fdc6f, #ffb020, #ff3d9a)' : c.hex }}
            />
          ))}
        </div>
        <p className="mt-3 text-[14px] text-nh-ash" aria-live="polite">{led ? `${led.name} LED glow` : 'Classic white'}</p>
      </fieldset>

      <label
        className={cn(
          'mt-6 flex cursor-pointer items-start gap-4 rounded-[18px] border-2 p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2',
          state.branded ? 'border-nh-ink' : 'border-nh-line hover:border-nh-ink/40',
        )}
      >
        <input type="checkbox" checked={state.branded} onChange={(e) => set({ branded: e.currentTarget.checked })} className="sr-only" />
        <span aria-hidden className={cn('mt-0.5 flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition', state.branded ? 'bg-nh-ink' : 'bg-nh-line')}>
          <span className={cn('h-5 w-5 rounded-full bg-white shadow transition', state.branded && 'translate-x-5')} />
        </span>
        <span>
          <span className="block text-[16px] font-bold">Custom branded</span>
          <span className="mt-0.5 block text-[14px] leading-relaxed text-nh-ash">
            Put your logo, names or a pattern on the front panels.
          </span>
          {state.branded && (
            <span className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Free artwork service: send us your logo and we’ll set it up.
            </span>
          )}
        </span>
      </label>
    </div>
  );
}

function Swatch({ name, checked, onChange, style }: { name: string; checked: boolean; onChange: () => void; style: React.CSSProperties }) {
  return (
    <label className="group relative cursor-pointer" title={name}>
      <input type="radio" name="led" checked={checked} onChange={onChange} className="peer sr-only" aria-label={name} />
      <span
        className={cn(
          'block h-11 w-11 rounded-full border border-black/10 shadow-inner transition peer-focus-visible:ring-2 peer-focus-visible:ring-nh-ink peer-focus-visible:ring-offset-2',
          checked ? 'ring-2 ring-nh-ink ring-offset-2' : 'group-hover:scale-105',
        )}
        style={style}
      />
    </label>
  );
}

// ─── Glassware ──────────────────────────────────────────────────────────────

export function GlasswareStep({ state, set }: StepProps) {
  const [more, setMore] = useState(() => GLASSES.some((g) => !g.common && (state.glasses[g.id] ?? 0) > 0));
  const shown = GLASSES.filter((g) => g.common || more);
  const setQty = (id: string, n: number) => set({ glasses: { ...state.glasses, [id]: n } });
  return (
    <div>
      <Note>Choose the glasses you need. Tap “One per guest” to match your {state.guests} guests.</Note>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {shown.map((g) => {
          const qty = state.glasses[g.id] ?? 0;
          return (
            <li key={g.id} className={cn('rounded-[18px] border-2 p-4 transition', qty > 0 ? 'border-nh-ink' : 'border-nh-line')}>
              <div className="flex items-center gap-3">
                <GlassGlyph glyph={g.glyph} className="h-12 w-12 shrink-0 text-nh-ink" />
                <div className="min-w-0">
                  <p className="text-[15px] font-bold leading-tight">{g.name}</p>
                  <p className="text-[13px] leading-snug text-nh-ash">{g.detail}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Counter label={g.name} value={qty} onChange={(n) => setQty(g.id, n)} step={10} min={0} max={5000} />
                <button type="button" onClick={() => setQty(g.id, state.guests)} className={cn('rounded-full px-3 py-1.5 text-[13px] font-semibold underline underline-offset-4', ring)}>
                  One per guest
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {!more && (
        <button type="button" onClick={() => setMore(true)} className={cn('mt-4 inline-flex items-center gap-1.5 rounded-full border border-nh-line px-4 py-2 text-[14px] font-semibold hover:border-nh-ink', ring)}>
          More glasses <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      )}
    </div>
  );
}

// ─── Ice and fridges ────────────────────────────────────────────────────────

function CountedCard({ id, value, onChange, step = 1 }: { id: 'ice-bag' | 'igloo-box' | 'bar-fridge'; value: number; onChange: (n: number) => void; step?: number }) {
  const item = ICE_AND_STORAGE.find((i) => i.id === id)!;
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-4 rounded-[18px] border-2 p-4 transition', value > 0 ? 'border-nh-ink' : 'border-nh-line')}>
      <div className="flex items-center gap-3">
        <IceGlyph kind={id} className="h-12 w-12 shrink-0 text-nh-ink" />
        <div>
          <p className="text-[16px] font-bold leading-tight">{item.name}</p>
          <p className="text-[13px] leading-snug text-nh-ash">{item.detail}</p>
        </div>
      </div>
      <Counter label={item.unitPlural} value={value} onChange={onChange} step={step} min={0} max={500} />
    </div>
  );
}

export function IceStep({ state, set }: StepProps) {
  return (
    <div>
      <Note>Not sure how much? Leave it at zero and we’ll advise on the right amount for {state.guests} guests.</Note>
      <div className="mt-6 space-y-3">
        <CountedCard id="ice-bag" value={state.iceBags} onChange={(iceBags) => set({ iceBags })} />
        <CountedCard id="igloo-box" value={state.igloos} onChange={(igloos) => set({ igloos })} />
      </div>
    </div>
  );
}

export function FridgesStep({ state, set }: StepProps) {
  return (
    <div>
      <Note>Bar fridges keep wine, beer and mixers cold behind the bar.</Note>
      <div className="mt-6">
        <CountedCard id="bar-fridge" value={state.fridges} onChange={(fridges) => set({ fridges })} />
      </div>
    </div>
  );
}

// ─── Staff ──────────────────────────────────────────────────────────────────

const noSubscribe = () => () => {};
const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const TIMES = timeOptions();

export function StaffStep({ state, set, quote }: StepProps) {
  const today = useSyncExternalStore(noSubscribe, localToday, () => undefined);
  const s = suggestedBartenders(state.guests);
  const staffLine = quote.lines.find((l) => l.group === 'staff');
  const field = 'mt-1.5 h-12 w-full rounded-xl border border-nh-line bg-white px-3 text-[16px] ' + ring;
  return (
    <div>
      <Note>
        For {state.guests} guests we suggest {s.low === s.high ? s.low : `${s.low}–${s.high}`} bartenders.
      </Note>
      <div className="mt-6 flex justify-center">
        <Counter label="Bartenders" value={state.staffCount ?? s.low} onChange={(staffCount) => set({ staffCount })} min={0} max={50} size="xl" />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <label className="block text-[14px] font-semibold">
          Party date
          <input type="date" min={today} value={state.date ?? ''} onChange={(e) => set({ date: e.currentTarget.value || null })} className={field} />
        </label>
        <label className="block text-[14px] font-semibold">
          Bar opens
          <select value={state.start} onChange={(e) => set({ start: e.currentTarget.value })} className={field}>
            {TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
        <label className="block text-[14px] font-semibold">
          Bar closes
          <select value={state.end} onChange={(e) => set({ end: e.currentTarget.value })} className={field}>
            {TIMES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-[18px] bg-nh-mist px-5 py-4" aria-live="polite">
        {staffLine?.price.kind === 'priced' ? (
          <p className="text-[16px]">
            <span className="text-nh-ash">{staffLine.price.working} = </span>
            <strong className="font-nh-display text-[22px] tabular-nums">{formatPence(staffLine.price.pence)}</strong>
            <span className="text-nh-ash"> + VAT</span>
          </p>
        ) : staffLine?.price.kind === 'included' ? (
          <p className="text-[15px]">Bartenders are included in your drinks package.</p>
        ) : staffLine?.price.kind === 'pending' ? (
          <p className="text-[15px]">{staffLine.price.reason} to see your staff price.</p>
        ) : (
          <p className="text-[15px]">No bartenders: you’ll run the bar yourselves.</p>
        )}
        {quote.engine.notes.map((n) => <p key={n} className="mt-2 text-[13px] leading-relaxed text-nh-ash">{n}</p>)}
        {quote.engine.timingIssue && <p className="mt-2 text-[13px] text-nh-ash">{quote.engine.timingIssue}</p>}
      </div>
    </div>
  );
}

// ─── Drinks ─────────────────────────────────────────────────────────────────

export function DrinksStep({ state, set }: StepProps) {
  const options: { id: DrinksChoice; name: string; detail: string }[] = [
    { id: 'own', name: 'We’ll bring our own drinks', detail: 'You supply the drinks; we bring the bar and run it.' },
    ...DRINKS_PACKAGES.map((p) => ({ id: p.id as DrinksChoice, name: p.name, detail: p.detail })),
  ];
  return (
    <div>
      <Note>Want us to bring the drinks too? A drinks package covers your bar, bartenders, glassware and ice in one price.</Note>
      <fieldset className="mt-6">
        <legend className="sr-only">Drinks</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {options.map((o) => (
            <RadioCard key={o.id} name="drinks" value={o.id} checked={state.drinks === o.id} onChange={() => set({ drinks: o.id })} className="p-4">
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-[16px] font-bold leading-tight">{o.name}</span>
                  <span className="mt-1 block text-[14px] leading-snug text-nh-ash">{o.detail}</span>
                  {o.id !== 'own' && <span className="mt-2 block text-[12.5px] font-semibold text-nh-ash">Menu and price to confirm</span>}
                </span>
                {state.drinks === o.id && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nh-ink text-white"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                )}
              </span>
            </RadioCard>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

// ─── Your details ───────────────────────────────────────────────────────────

export const REQUEST_FORM_ID = 'tbp-package-request';

export function DetailsStep({ state, set, onSent, sent }: StepProps & { onSent: () => void; sent: boolean }) {
  const field = 'mt-1.5 h-12 w-full rounded-xl border border-nh-line bg-white px-3 text-[16px] ' + ring;
  return (
    <form id={REQUEST_FORM_ID} onSubmit={(e) => { e.preventDefault(); onSent(); }}>
      <Note>Add your details and we’ll come back with your confirmed quote.</Note>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <label className="block text-[14px] font-semibold">Your name<input name="name" autoComplete="name" required className={field} /></label>
        <label className="block text-[14px] font-semibold">Email<input name="email" type="email" autoComplete="email" required className={field} /></label>
        <label className="block text-[14px] font-semibold">Phone<input name="phone" type="tel" autoComplete="tel" className={field} /></label>
        <label className="block text-[14px] font-semibold">
          Event postcode
          <input name="postcode" autoComplete="postal-code" value={state.postcode} onChange={(e) => set({ postcode: e.currentTarget.value.slice(0, 10) })} className={cn(field, 'uppercase')} />
        </label>
      </div>
      {sent && (
        <div role="status" className="nh-pop mt-6 rounded-[18px] border-2 border-nh-ink p-5">
          <p className="text-[16px] font-bold">Preview only: nothing has been sent.</p>
          <p className="mt-1 text-[14px] leading-relaxed text-nh-ash">
            On the live site this sends your package to Jake and Kim, and you get a copy by email.
          </p>
        </div>
      )}
    </form>
  );
}
