'use client';

// Drinks: all-inclusive (ticked first) or bring your own, with a searchable
// menu. Standard drinks are included, some can be added free, upgrades add a
// little per guest, champagne is by the bottle.

import { useState } from 'react';
import { Check, Plus, RotateCcw, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPence, formatPenceCompact } from '@/lib/visual-quote/money';
import { formatDuration } from '@/lib/visual-quote/time';
import { DRINK_CATEGORIES, MENU, drinksPerHead, searchMenu, standardMenu, termsLabel, upgradesPerHead, type Drink } from '@/lib/quote/drinks';
import { MAX_REQUESTS } from '@/lib/quote/quote';
import { Badge, Counter, Note, RadioCard, ring } from './ui';
import type { StepProps } from './steps';

export default function DrinksStep({ state, set, quote }: StepProps) {
  const mode = state.drinksMode ?? 'all-inclusive';
  const s = quote.schedule;
  const perHead = s ? drinksPerHead(s.barMinutes) : null;
  const upgrades = upgradesPerHead(state.menu);
  return (
    <div>
      <Note>Let us bring the drinks, or supply your own and we’ll serve them.</Note>
      <fieldset className="mt-6">
        <legend className="sr-only">Drinks</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <RadioCard name="drinks-mode" value="all-inclusive" checked={mode === 'all-inclusive'} onChange={() => set({ drinksMode: 'all-inclusive' })} className="p-4">
            <span className="flex items-start justify-between gap-3">
              <span>
                <Badge>Most popular</Badge>
                <span className="mt-2 block text-[18px] font-bold leading-tight">All-inclusive</span>
                <span className="mt-1 block text-[14px] leading-snug text-nh-ash">Beer, wine, spirits and soft drinks for every guest, all night.</span>
                {perHead !== null && s && (
                  <span className="mt-2 block text-[15px] font-semibold">
                    {formatPenceCompact(perHead)} a guest <span className="font-normal text-nh-ash">for {formatDuration(s.barMinutes)}</span>
                  </span>
                )}
              </span>
              {mode === 'all-inclusive' && <Tick />}
            </span>
          </RadioCard>
          <RadioCard name="drinks-mode" value="own" checked={mode === 'own'} onChange={() => set({ drinksMode: 'own' })} className="p-4">
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block text-[18px] font-bold leading-tight sm:mt-[30px]">We’ll bring our own</span>
                <span className="mt-1 block text-[14px] leading-snug text-nh-ash">You supply the drinks. We bring the bar and the team to serve them.</span>
              </span>
              {mode === 'own' && <Tick />}
            </span>
          </RadioCard>
        </div>
      </fieldset>

      {mode === 'all-inclusive' && (
        <>
          <div className="mt-4 rounded-[18px] bg-nh-mist px-5 py-4" aria-live="polite">
            {perHead !== null ? (
              <>
                <p className="text-[16px]">
                  <span className="text-nh-ash">{state.guests} guests × {formatPence(perHead + upgrades)} = </span>
                  <strong className="font-nh-display text-[24px] tabular-nums">{formatPence((perHead + upgrades) * state.guests)}</strong>
                  <span className="text-nh-ash"> + VAT</span>
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-nh-ash">
                  {formatPenceCompact(perHead)} a guest for {s ? formatDuration(s.barMinutes) : 'your hours'}
                  {upgrades > 0 ? `, plus ${formatPenceCompact(upgrades)} a guest in upgrades` : ''}. £7.50 an hour up to 5 hours, £35 for 5 hours, then £5 for each extra hour.
                </p>
              </>
            ) : (
              <p className="text-[15px]">Add your bar times to see the price per guest.</p>
            )}
          </div>
          <MenuEditor state={state} set={set} />
        </>
      )}
    </div>
  );
}

function Tick() {
  return <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nh-ink text-white"><Check className="h-3.5 w-3.5" aria-hidden /></span>;
}

function MenuEditor({ state, set }: Pick<StepProps, 'state' | 'set'>) {
  const [query, setQuery] = useState('');
  const results = searchMenu(query);
  const ticked = new Set(state.menu);
  const searching = query.trim().length > 0;
  const isStandard = state.menu.length === standardMenu().length && standardMenu().every((id) => ticked.has(id))
    && Object.values(state.bottles).every((n) => !n) && state.requests.length === 0;

  const toggle = (id: string) => set({ menu: ticked.has(id) ? state.menu.filter((m) => m !== id) : [...state.menu, id] });
  const setBottles = (id: string, n: number) => set({ bottles: { ...state.bottles, [id]: n } });
  const wanted = query.trim().slice(0, 40);
  const canRequest = searching && results.length === 0 && state.requests.length < MAX_REQUESTS
    && !state.requests.some((r) => r.toLowerCase() === wanted.toLowerCase());

  return (
    <section aria-labelledby="menu-title" className="mt-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 id="menu-title" className="text-[20px] font-extrabold tracking-tight">Your drinks menu</h3>
          <p className="text-[14px] text-nh-ash">Tick what you’d like behind the bar. Swap or add drinks as you like.</p>
        </div>
        {!isStandard && (
          <button type="button" onClick={() => { set({ menu: standardMenu(), bottles: {}, requests: [] }); setQuery(''); }}
            className={cn('inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold text-nh-ash underline underline-offset-4 hover:text-nh-ink', ring)}>
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Back to the standard menu
          </button>
        )}
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-nh-ash" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          placeholder="Search drinks: try Grey Goose, spiced rum or champagne"
          aria-label="Search drinks"
          className={cn('h-12 w-full rounded-full border border-nh-line bg-white pl-12 pr-11 text-[16px]', ring)}
        />
        {searching && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search"
            className={cn('absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-nh-mist', ring)}>
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
      <p className="sr-only" aria-live="polite">{searching ? `${results.length} ${results.length === 1 ? 'drink' : 'drinks'} found` : ''}</p>

      {searching && results.length === 0 && (
        <div className="mt-4 rounded-[18px] border-2 border-dashed border-nh-line p-5">
          <p className="text-[15px] font-semibold">We don’t list “{wanted}” yet.</p>
          <p className="mt-1 text-[14px] text-nh-ash">Ask for it and we’ll confirm a price with your quote.</p>
          {canRequest ? (
            <button type="button" onClick={() => { set({ requests: [...state.requests, wanted] }); setQuery(''); }}
              className={cn('mt-3 inline-flex items-center gap-2 rounded-full bg-nh-ink px-4 py-2.5 text-[14px] font-semibold text-white', ring)}>
              <Plus className="h-4 w-4" aria-hidden /> Ask for {wanted}
            </button>
          ) : (
            <p className="mt-2 text-[13px] text-nh-ash">
              {state.requests.length >= MAX_REQUESTS ? `You can ask for up to ${MAX_REQUESTS} extra drinks here; tell us about any others when we confirm.` : 'It’s already on your list.'}
            </p>
          )}
        </div>
      )}

      {state.requests.length > 0 && (
        <div className="mt-4">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-nh-ash">You’ve asked for</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {state.requests.map((r) => (
              <li key={r} className="inline-flex items-center gap-1 rounded-full bg-nh-mist pl-3.5 text-[14px] font-semibold">
                {r}
                <button type="button" aria-label={`Remove ${r}`} onClick={() => set({ requests: state.requests.filter((x) => x !== r) })}
                  className={cn('flex h-10 w-10 items-center justify-center rounded-full hover:bg-white', ring)}>
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 space-y-5">
        {DRINK_CATEGORIES.map((cat) => {
          const drinks = results.filter((d) => d.category === cat.id);
          if (drinks.length === 0) return null;
          return (
            <section key={cat.id} aria-label={cat.name}>
              <h4 className="border-b border-nh-ink pb-1.5 text-[12px] font-bold uppercase tracking-[0.16em] text-nh-ash [font-family:var(--font-inter)]">{cat.name}</h4>
              <ul className="divide-y divide-nh-line">
                {drinks.map((d) => (
                  <li key={d.id}>
                    {d.terms.kind === 'bottle'
                      ? <BottleRow drink={d} qty={state.bottles[d.id] ?? 0} onChange={(n) => setBottles(d.id, n)} />
                      : <DrinkRow drink={d} checked={ticked.has(d.id)} onToggle={() => toggle(d.id)} />}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      {!searching && (
        <p className="mt-4 text-[13px] leading-relaxed text-nh-ash">
          {MENU.length} drinks listed. Can’t see yours? Search for it and ask: we’ll confirm a price.
        </p>
      )}
    </section>
  );
}

function TermsChip({ drink }: { drink: Drink }) {
  const k = drink.terms.kind;
  return (
    <span className={cn(
      'shrink-0 rounded-full px-2.5 py-1 text-[12.5px] font-semibold tabular-nums',
      k === 'upgrade' || k === 'bottle' ? 'bg-nh-ink text-white' : k === 'ask' ? 'border border-nh-line text-nh-ash' : 'bg-nh-mist text-nh-ink',
    )}>
      {termsLabel(drink.terms)}
    </span>
  );
}

function DrinkRow({ drink, checked, onToggle }: { drink: Drink; checked: boolean; onToggle: () => void }) {
  return (
    <label className="relative flex cursor-pointer items-center gap-3 py-3 has-[:focus-visible]:rounded-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2">
      <input type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <span aria-hidden className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition', checked ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white')}>
        {checked && <Check className="h-4 w-4" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-tight">{drink.name}</span>
        <span className="block text-[13px] leading-snug text-nh-ash">{drink.detail}</span>
      </span>
      <TermsChip drink={drink} />
    </label>
  );
}

function BottleRow({ drink, qty, onChange }: { drink: Drink; qty: number; onChange: (n: number) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold leading-tight">{drink.name}</p>
        <p className="text-[13px] leading-snug text-nh-ash">{drink.detail}</p>
      </div>
      <TermsChip drink={drink} />
      <Counter label={`${drink.name} bottles`} value={qty} onChange={onChange} min={0} max={500} size="sm" />
    </div>
  );
}
