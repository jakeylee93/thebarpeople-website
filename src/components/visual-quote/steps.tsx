'use client';

// The step bodies for the visual quote builder. Each step is a fieldset whose
// legend is the step question, so screen readers hear the question with the
// choices. Images are honest: sketches, illustrations and real event photos
// are labelled as such.

import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, MessageCircle } from 'lucide-react';

import type { QuoteInput, QuoteResult } from '@/lib/visual-quote/engine';
import { NO_BAR, NO_PACKAGE } from '@/lib/visual-quote/engine';
import type { BarOption, DrinksPackage, ImageRef } from '@/lib/visual-quote/catalogue';
import {
  BARS, BAR_PHOTOS, DRINKS_PACKAGES, EXTRAS, GLASSES, ICE_AND_STORAGE, STAFF_RATE, WHATSAPP_LINK,
  findBar, findPackage, suggestedStaff,
} from '@/lib/visual-quote/catalogue';
import { formatPence, rateForMinutes } from '@/lib/visual-quote/money';
import { formatDate, formatDuration, formatHoursShort, formatTime, timeOptions } from '@/lib/visual-quote/time';
import { cn } from '@/lib/utils';
import GlassGlyph, { IceGlyph } from './GlassGlyph';
import { FieldError, ImageTag, Stepper, focusRing, inputClass, labelClass } from './controls';

export type Patch = (patch: Partial<QuoteInput>) => void;

const TIME_OPTIONS = timeOptions();

// ─── Shared stage (the big image) ───────────────────────────────────────────

/** Remembers the thumbnail that was tapped so the stage image can grow out of it. */
export type FlipOrigin = React.RefObject<DOMRect | null>;

/**
 * The large image for the current choice. When a thumbnail was just tapped it
 * grows out of that thumbnail (a measured, uniform-scale FLIP); otherwise, or
 * with reduced motion, it simply fades in.
 */
function StageImage({ image, originRef, contain = false }: { image: ImageRef; originRef?: FlipOrigin; contain?: boolean }) {
  const reduce = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = boxRef.current;
    const from = originRef?.current ?? null;
    if (originRef) originRef.current = null;
    if (!el || typeof el.animate !== 'function') return;
    if (reduce || !from) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: 'ease-out' });
      return;
    }
    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const scale = Math.min(from.width / box.width, 1);
    const dx = from.left + from.width / 2 - (box.left + (box.width * scale) / 2);
    const dy = from.top + from.height / 2 - (box.top + (box.height * scale) / 2);
    el.animate(
      [
        { transformOrigin: 'top left', transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.6 },
        { transformOrigin: 'top left', transform: 'none', opacity: 1 },
      ],
      { duration: 560, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    );
  }, [image.src, originRef, reduce]);

  return (
    <div ref={boxRef} className={cn('absolute inset-0', contain ? 'bg-white' : 'bg-ink')}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className={contain ? 'object-contain p-4 sm:p-8' : 'object-cover'}
        style={image.focal ? { objectPosition: image.focal } : undefined}
      />
      {image.kind === 'sketch' && <ImageTag>Layout sketch · not to scale</ImageTag>}
      {image.kind === 'illustration' && <ImageTag>{image.note ?? 'Illustration'}</ImageTag>}
      {image.kind === 'photo' && <ImageTag tone="dark">Real Bar People event</ImageTag>}
    </div>
  );
}

export function Stage({ image, originRef, contain, tall }: { image: ImageRef; originRef?: FlipOrigin; contain?: boolean; tall?: boolean }) {
  return (
    <div className={cn(
      'relative w-full overflow-hidden rounded-[3px]',
      tall ? 'aspect-[16/10] lg:aspect-auto lg:h-[clamp(240px,34vh,380px)]' : 'aspect-[16/10] lg:aspect-auto lg:h-[clamp(200px,27vh,310px)]',
    )}>
      <StageImage key={image.src} image={image} originRef={originRef} contain={contain} />
    </div>
  );
}

/** Four real bar photos — shown before a bar is chosen. */
function BarMosaic() {
  return (
    <div className="grid h-full grid-cols-4 gap-1 lg:gap-1.5">
      {BAR_PHOTOS.map((p) => (
        <div key={p.src} className="relative h-full overflow-hidden">
          <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 15vw, 25vw" className="object-cover" />
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: party ──────────────────────────────────────────────────────────

export interface PartyErrors { date?: string; guests?: string; postcode?: string; time?: string }

export function PartyStep({ input, patch, result, errors, minDate }: {
  input: QuoteInput; patch: Patch; result: QuoteResult; errors: PartyErrors; minDate?: string;
}) {
  const t = result.timing;
  return (
    <div className="space-y-5">
      <Stage image={{ src: '/images/events/martini-pour.jpg', alt: 'Upturned cocktail glasses and a copper tray with herbs on a white Bar People counter', kind: 'photo', width: 1024, height: 769 }} />
      <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-6">
        <div className="col-span-2 sm:col-span-2">
          <label htmlFor="vq-date" className={labelClass}>Party date</label>
          <input id="vq-date" name="date" type="date" min={minDate} value={input.date ?? ''}
            onChange={(e) => patch({ date: e.target.value || null })}
            aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'vq-date-err' : undefined}
            className={inputClass} />
          <FieldError id="vq-date-err">{errors.date}</FieldError>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="vq-guests" className={labelClass}>Guests</label>
          <input id="vq-guests" name="guests" type="number" inputMode="numeric" min={1} max={5000} placeholder="e.g. 120"
            value={input.guests ?? ''}
            onChange={(e) => {
              const n = Math.round(Number(e.target.value));
              patch({ guests: e.target.value === '' || !Number.isFinite(n) ? null : Math.max(1, Math.min(5000, n)) });
            }}
            aria-invalid={Boolean(errors.guests)} aria-describedby={errors.guests ? 'vq-guests-err' : undefined}
            className={inputClass} />
          <FieldError id="vq-guests-err">{errors.guests}</FieldError>
        </div>
        <div className="col-span-1 sm:col-span-2">
          <label htmlFor="vq-postcode" className={labelClass}>Venue postcode</label>
          <input id="vq-postcode" name="postcode" type="text" autoComplete="postal-code" placeholder="e.g. E11 1AA"
            value={input.postcode} maxLength={8}
            onChange={(e) => patch({ postcode: e.target.value.toUpperCase() })}
            aria-invalid={Boolean(errors.postcode)}
            aria-describedby={errors.postcode ? 'vq-postcode-err' : 'vq-postcode-hint'}
            className={cn(inputClass, 'uppercase placeholder:normal-case')} />
          {errors.postcode
            ? <FieldError id="vq-postcode-err">{errors.postcode}</FieldError>
            : <p id="vq-postcode-hint" className="mt-1.5 text-[12px] text-stone">The first half is fine</p>}
        </div>
        <div className="col-span-1 sm:col-span-3">
          <label htmlFor="vq-start" className={labelClass}>Party starts</label>
          <select id="vq-start" name="start" value={input.start ?? ''} onChange={(e) => patch({ start: e.target.value })}
            aria-describedby="vq-timing" className={inputClass}>
            {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div className="col-span-1 sm:col-span-3">
          <label htmlFor="vq-end" className={labelClass}>Party finishes</label>
          <select id="vq-end" name="end" value={input.end ?? ''} onChange={(e) => patch({ end: e.target.value })}
            aria-invalid={Boolean(errors.time)} aria-describedby="vq-timing" className={inputClass}>
            {TIME_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
      <p id="vq-timing" aria-live="polite" className={cn('min-h-[1.5rem] text-[14px]', errors.time ? 'font-medium text-[#9b2c1f]' : 'text-stone')}>
        {errors.time ?? (t
          ? <>
              {formatTime(t.startMinutes)} to {t.endMinutes === 0 ? 'midnight' : formatTime(t.endMinutes)}
              {t.overnight && t.endMinutes !== 0 && <> on {formatDate(t.endDate, true)}</>}
              {' · '}<strong className="font-semibold text-ink">{formatDuration(t.billableMinutes)}</strong>
              {t.overnight && t.endMinutes !== 0 && <span className="ml-2 rounded-sm bg-ink px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-ivory">Next day</span>}
            </>
          : 'Pick a date to see your party length.')}
      </p>
    </div>
  );
}

// ─── Step 2: bar ────────────────────────────────────────────────────────────

export function BarStep({ input, patch, originRef }: { input: QuoteInput; patch: Patch; originRef: FlipOrigin }) {
  const chosen = findBar(input.barId);
  const pick = (bar: BarOption, el: HTMLElement | null) => {
    if (el) originRef.current = el.getBoundingClientRect();
    patch({ barId: bar.id });
  };
  return (
    <div className="space-y-4">
      {chosen ? (
        <div>
          <Stage image={chosen.image} originRef={originRef} contain tall />
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-heading text-[22px] leading-tight">{chosen.name}</p>
            <p className="text-[14px] text-stone">{chosen.shape} · {chosen.size} · <span className="italic text-brass-ink">Price to confirm</span></p>
          </div>
        </div>
      ) : (
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[3px] lg:aspect-auto lg:h-[clamp(240px,34vh,380px)]">
          <BarMosaic />
          <ImageTag tone="dark">Our bars at real events</ImageTag>
        </div>
      )}

      <fieldset>
        <legend className="sr-only">Bar layouts</legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {BARS.map((bar) => {
            const on = input.barId === bar.id;
            return (
              <label key={bar.id}
                className={cn(
                  'group relative cursor-pointer rounded-[3px] border bg-white p-1.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2',
                  on ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline hover:border-ink/40',
                )}>
                <input type="radio" name="bar" value={bar.id} checked={on} className="sr-only"
                  onChange={(e) => pick(bar, (e.currentTarget.parentElement as HTMLElement | null)?.querySelector('[data-thumb]') as HTMLElement | null)} />
                <span data-thumb className="relative block aspect-[3/2] w-full bg-ivory">
                  <Image src={bar.image.src} alt="" fill sizes="(min-width: 640px) 12vw, 30vw" className="object-contain p-1" />
                </span>
                <span className="mt-1 block text-center text-[12.5px] font-semibold leading-tight text-ink">{bar.name}</span>
                <span className="block text-center text-[11px] leading-tight text-stone">{bar.size}</span>
                {on && (
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory">
                    <Check size={12} aria-hidden="true" />
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
      <label className="inline-flex cursor-pointer items-center gap-2 text-[14px] text-stone has-[:focus-visible]:underline">
        <input type="radio" name="bar" value={NO_BAR} checked={input.barId === NO_BAR} onChange={() => patch({ barId: NO_BAR })}
          className="h-4 w-4 accent-[var(--color-ink)]" />
        No bar needed — we have our own
      </label>
    </div>
  );
}

// ─── Step 3: glasses ────────────────────────────────────────────────────────

export function GlassesStep({ input, patch, showAll, setShowAll }: {
  input: QuoteInput; patch: Patch; showAll: boolean; setShowAll: (v: boolean) => void;
}) {
  const setQty = (id: string, n: number) => patch({ glasses: { ...input.glasses, [id]: Math.max(0, n) } });
  const list = GLASSES.filter((g) => showAll || g.common || (input.glasses[g.id] ?? 0) > 0);
  const total = Object.values(input.glasses).reduce((a, b) => a + (b || 0), 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-4">
        {list.map((g) => {
          const qty = input.glasses[g.id] ?? 0;
          return (
            <div key={g.id} className={cn(
              'flex flex-col rounded-[3px] border bg-white p-3 transition',
              qty > 0 ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline',
            )}>
              <div className="flex items-start gap-2">
                <GlassGlyph glyph={g.glyph} className={cn('h-[68px] w-[46px] shrink-0', qty > 0 ? 'text-ink' : 'text-stone')} />
                <div className="min-w-0 pt-1">
                  <p className="text-[14px] font-semibold leading-tight text-ink">{g.name}</p>
                  <p className="mt-0.5 text-[12px] leading-snug text-stone">{g.detail}</p>
                </div>
              </div>
              <div className="mt-auto pt-3">
                {qty === 0 ? (
                  <button type="button" onClick={() => setQty(g.id, input.guests ?? 50)}
                    className={cn('h-9 w-full rounded-full border border-ink/25 text-[13px] font-semibold text-ink transition hover:border-ink', focusRing)}
                    aria-label={`Add ${g.name}${input.guests ? `, one per guest (${input.guests})` : ''}`}>
                    Add{input.guests ? ` ${input.guests}` : ''}
                  </button>
                ) : (
                  <Stepper label={`${g.name} quantity`} value={qty} step={10} max={20000} size="sm" onChange={(n) => setQty(g.id, n)} />
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-[14px]">
        <button type="button" onClick={() => setShowAll(!showAll)} aria-expanded={showAll}
          className={cn('font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink', focusRing)}>
          {showAll ? 'Show fewer glasses' : `More glasses (${GLASSES.filter((g) => !g.common).length})`}
        </button>
        <p className="text-stone">{total > 0 ? `${total.toLocaleString('en-GB')} glasses so far` : 'No glasses yet — that’s fine if you have your own.'}</p>
      </div>
    </div>
  );
}

// ─── Step 4: ice & storage ──────────────────────────────────────────────────

export function IceStep({ input, patch }: { input: QuoteInput; patch: Patch }) {
  const setQty = (id: string, n: number) => patch({ iceAndStorage: { ...input.iceAndStorage, [id]: Math.max(0, n) } });
  return (
    <div className="space-y-4">
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {ICE_AND_STORAGE.map((item) => {
          const qty = input.iceAndStorage[item.id] ?? 0;
          return (
            <div key={item.id} className={cn(
              'flex items-center gap-3 rounded-[3px] border bg-white p-3 sm:flex-col sm:items-stretch',
              qty > 0 ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline',
            )}>
              <IceGlyph kind={item.id as 'ice-bag' | 'igloo-box' | 'bar-fridge'} className={cn('h-14 w-14 shrink-0 sm:h-16 sm:w-16', qty > 0 ? 'text-ink' : 'text-stone')} />
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold leading-tight">{item.name}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-stone">{item.detail}</p>
                <div className="mt-2.5">
                  <Stepper label={`${item.name}, number of ${item.unitPlural}`} value={qty} onChange={(n) => setQty(item.id, n)} max={500} />
                </div>
              </div>
            </div>
          );
        })}
        <label className={cn(
          'flex cursor-pointer items-center gap-3 rounded-[3px] border bg-white p-3 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink sm:flex-col sm:items-stretch',
          input.iceAdvice ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline hover:border-ink/40',
        )}>
          <IceGlyph kind="advice" className={cn('h-14 w-14 shrink-0 sm:h-16 sm:w-16', input.iceAdvice ? 'text-ink' : 'text-stone')} />
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold leading-tight">Let us advise</span>
            <span className="mt-0.5 block text-[12px] leading-snug text-stone">We’ll suggest the right amount of ice for {input.guests ? `${input.guests} guests` : 'your guests'}</span>
            <span className="mt-2.5 flex items-center gap-2 text-[13px] font-medium">
              <input type="checkbox" checked={input.iceAdvice} onChange={(e) => patch({ iceAdvice: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-ink)]" />
              Yes, advise me
            </span>
          </span>
        </label>
      </div>
    </div>
  );
}

// ─── Step 5: staff ──────────────────────────────────────────────────────────

export function StaffStep({ input, patch, result }: { input: QuoteInput; patch: Patch; result: QuoteResult }) {
  const s = suggestedStaff(input.guests);
  const t = result.timing;
  const pkg = input.drinksPackageId && input.drinksPackageId !== NO_PACKAGE ? findPackage(input.drinksPackageId) : null;
  const included = pkg?.includes.includes('staff') ? pkg.name : null;
  const preview = t && input.staffCount > 0 && !included
    ? rateForMinutes(STAFF_RATE.unitPence, t.billableMinutes) * input.staffCount
    : null;
  return (
    <div className="space-y-5">
      <Stage image={{ src: '/images/events/staff-alex.jpg', alt: 'A Bar People bartender in a white shirt offering a yellow cocktail across a wooden counter', kind: 'photo', width: 1024, height: 769, focal: '50% 12%' }} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Stepper label="Bartenders" value={input.staffCount} onChange={(n) => patch({ staffCount: n })} max={60} size="lg" unit="bartenders" />
          {s && (
            <p className="mt-3 text-[14px] text-stone">
              For {input.guests} guests we’d usually suggest {s.low === s.high ? s.low : `${s.low}–${s.high}`}.{' '}
              {input.staffCount !== s.low && (
                <button type="button" onClick={() => patch({ staffCount: s.low })}
                  className={cn('font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink', focusRing)}>
                  Use {s.low}
                </button>
              )}
            </p>
          )}
        </div>
        <div className="rounded-[3px] border border-hairline bg-white px-4 py-3 sm:min-w-[260px] sm:text-right">
          {included ? (
            <p className="text-[14px] text-stone">Included with <strong className="font-semibold text-ink">{included}</strong> — not charged twice.</p>
          ) : preview !== null && t ? (
            <>
              <p className="text-[13px] text-stone">{input.staffCount} × {formatHoursShort(t.billableMinutes)} × {formatPence(STAFF_RATE.unitPence)}</p>
              <p className="font-heading text-[26px] leading-tight tabular-nums">{formatPence(preview)} <span className="font-body text-[13px] text-stone">+ VAT</span></p>
            </>
          ) : (
            <p className="text-[14px] text-stone">{t ? 'Add bartenders to see the cost.' : 'Add your party times to price staff.'}</p>
          )}
        </div>
      </div>
      {t && !included && input.staffCount > 0 && (
        <p className="border-l-2 border-brass pl-3 text-[14px] leading-relaxed text-stone">
          Priced for your party, {formatTime(t.startMinutes)} to {t.endMinutes === 0 ? 'midnight' : formatTime(t.endMinutes)}.
          {' '}We’d suggest the team arrives around <strong className="font-semibold text-ink">{formatTime(t.arrival.minutes)}</strong> to set up — we’ll confirm timings with you.
        </p>
      )}
    </div>
  );
}

// ─── Step 6: drinks ─────────────────────────────────────────────────────────

export function DrinksStep({ input, patch, result, originRef }: { input: QuoteInput; patch: Patch; result: QuoteResult; originRef: FlipOrigin }) {
  const pkg = findPackage(input.drinksPackageId);
  const partyMinutes = result.timing?.billableMinutes ?? null;
  const hourChoices: number[] = [];
  if (partyMinutes) for (let m = 60; m <= partyMinutes; m += 30) hourChoices.push(m);
  if (partyMinutes && hourChoices[hourChoices.length - 1] !== partyMinutes) hourChoices.push(partyMinutes);
  const pick = (p: DrinksPackage, el: HTMLElement | null) => {
    if (el) originRef.current = el.getBoundingClientRect();
    patch({ drinksPackageId: p.id, drinksMinutes: null });
  };
  const stageImage: ImageRef = pkg ? pkg.image : DRINKS_PACKAGES[1].image;
  return (
    <div className="space-y-4">
      <Stage image={stageImage} originRef={originRef} />
      <fieldset>
        <legend className="sr-only">Drinks options</legend>
        <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
          <label className={cn(
            'flex cursor-pointer flex-col justify-between rounded-[3px] border bg-white p-3.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2',
            input.drinksPackageId === NO_PACKAGE ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline hover:border-ink/40',
          )}>
            <input type="radio" name="drinks" className="sr-only" checked={input.drinksPackageId === NO_PACKAGE}
              onChange={() => patch({ drinksPackageId: NO_PACKAGE, drinksMinutes: null })} />
            <span className="text-[14px] font-semibold">No thanks</span>
            <span className="mt-1 text-[12.5px] leading-snug text-stone">We’ll supply our own drinks — you bring the bar and team.</span>
          </label>
          {DRINKS_PACKAGES.map((p) => {
            const on = input.drinksPackageId === p.id;
            return (
              <label key={p.id} className={cn(
                'relative flex cursor-pointer gap-3 rounded-[3px] border bg-white p-2.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2 xl:flex-col',
                on ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline hover:border-ink/40',
              )}>
                <input type="radio" name="drinks" className="sr-only" checked={on}
                  onChange={(e) => pick(p, (e.currentTarget.parentElement as HTMLElement | null)?.querySelector('[data-thumb]') as HTMLElement | null)} />
                <span data-thumb className="relative block aspect-square w-20 shrink-0 overflow-hidden rounded-[2px] xl:aspect-[16/9] xl:w-full">
                  <Image src={p.image.src} alt="" fill sizes="(min-width: 1280px) 12vw, 80px" className="object-cover" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-[14px] font-semibold leading-tight">{p.name}</span>
                  </span>
                  <span className="mt-1 block text-[12px] leading-snug text-stone">{p.pours.join(' · ')}</span>
                  <span className="mt-1.5 inline-block rounded-sm bg-ivory-deep px-1.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-stone">Draft menu</span>
                </span>
                {on && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory">
                    <Check size={12} aria-hidden="true" />
                  </span>
                )}
              </label>
            );
          })}
        </div>
      </fieldset>
      {pkg && (
        <div className="flex flex-col gap-3 rounded-[3px] bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] leading-snug text-stone">
            Covers the bar, bartenders, glassware and ice — <strong className="font-semibold text-ink">so those aren’t charged twice</strong>.
          </p>
          {hourChoices.length > 0 && (
            <label className="flex items-center gap-2 text-[14px] font-semibold">
              Drinks for
              <select value={input.drinksMinutes ?? partyMinutes ?? ''} onChange={(e) => patch({ drinksMinutes: Number(e.target.value) })}
                className={cn('h-10 rounded-md border border-ink/20 bg-white px-2 text-[15px] font-medium', focusRing)}>
                {hourChoices.map((m) => <option key={m} value={m}>{formatDuration(m)}{m === partyMinutes ? ' (whole party)' : ''}</option>)}
              </select>
            </label>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Step 7: extras ─────────────────────────────────────────────────────────

export function ExtrasStep({ input, patch }: { input: QuoteInput; patch: Patch }) {
  const toggle = (id: string, on: boolean) =>
    patch({ extras: on ? [...new Set([...input.extras, id])] : input.extras.filter((x) => x !== id) });
  const any = input.extras.length > 0;
  return (
    <div className="space-y-4">
      <Stage image={{ src: '/images/events/outdoor-bar.jpg', alt: 'A white bar dressed with balloons in a garden', kind: 'photo', width: 1024, height: 769 }} />
      <fieldset>
        <legend className="sr-only">Extras</legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {EXTRAS.map((x) => {
            const on = input.extras.includes(x.id);
            return (
              <label key={x.id} className={cn(
                'flex cursor-pointer items-start gap-3 rounded-[3px] border bg-white p-3.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ink has-[:focus-visible]:ring-offset-2',
                on ? 'border-ink shadow-[0_0_0_1px_var(--color-ink)]' : 'border-hairline hover:border-ink/40',
              )}>
                <input type="checkbox" checked={on} onChange={(e) => toggle(x.id, e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-ink)]" />
                <span>
                  <span className="block text-[14px] font-semibold leading-tight">{x.name}</span>
                  <span className="mt-0.5 block text-[12.5px] leading-snug text-stone">{x.detail}</span>
                  <span className="mt-1 block text-[12px] italic text-brass-ink">Priced on request</span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <AnimatePresence initial={false}>
        {any && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 rounded-[3px] bg-ink px-4 py-3.5 text-ivory sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[14px] leading-snug">Easier to talk it through? Message us with your ideas.</p>
              <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ivory px-5 text-[14px] font-semibold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                <MessageCircle size={16} aria-hidden="true" /> Message us on WhatsApp
                <span className="sr-only">(opens WhatsApp; nothing is sent until you press send)</span>
              </a>
            </div>
            <p className="mt-1.5 text-[12px] text-stone">Opens WhatsApp. Nothing is sent until you press send.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
