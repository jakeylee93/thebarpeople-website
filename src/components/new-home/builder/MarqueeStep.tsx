'use client';

// Marquee add-on. The marquee itself is chosen first; furniture, flooring,
// lighting, crockery and the rest are only offered once a marquee is in the
// quote. Prices are still to be agreed, so each line reads "To confirm".
//
// The range is long (over a hundred things), so it is two pages: choose the
// marquee, then its extras, shown one kind at a time under tabs.

import { useState } from 'react';
import {
  Armchair, ArrowLeft, ArrowRight, Check, CookingPot, DoorOpen, Flame, Grid2x2, Layers, Lightbulb, Mic, Music, Soup, Star, Tent,
  UtensilsCrossed, Wine, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPenceCompact } from '@/lib/visual-quote/money';
import { MARQUEE_GROUPS, hasStructure, type MarqueeGroup, type MarqueeItem } from '@/lib/quote/marquee';
import MarqueeDiagram from './MarqueeDiagram';
import { Counter, Note, ring } from './ui';
import type { StepProps } from './steps';

const STRUCTURES = MARQUEE_GROUPS.filter((g) => g.kind === 'structure');
const EXTRAS = MARQUEE_GROUPS.filter((g) => g.kind === 'extra');

/** A small picture for each kind of extra, so the list can be scanned. */
const GROUP_ICON: Record<string, LucideIcon> = {
  walls: DoorOpen, linings: Star, flooring: Grid2x2, 'dance-floor': Music, lighting: Lightbulb, heating: Flame,
  furniture: Armchair, linen: Layers, crockery: Soup, cutlery: UtensilsCrossed, tableware: Wine, catering: CookingPot, staging: Mic,
};

const priceLabel = (item: MarqueeItem) =>
  item.price === null ? 'Price to confirm' : `${formatPenceCompact(item.price)} ${item.unit}`;

export default function MarqueeStep({ state, set }: StepProps) {
  const structure = hasStructure(state.marqueeItems);
  // Two pages: choose the marquee, then its extras.
  const [page, setPage] = useState<'choose' | 'extras'>('choose');
  const [tab, setTab] = useState(EXTRAS[0].id);
  const extrasAdded = EXTRAS.reduce((n, g) => n + g.items.filter((i) => (state.marqueeItems[i.id] ?? 0) > 0).length, 0);
  const setQty = (id: string, n: number) => set({ marqueeItems: { ...state.marqueeItems, [id]: n } });

  if (!state.marquee) {
    return (
      <div>
        <Note>Need cover, or a whole venue in a field? Add a marquee and we’ll bring it with the bar, in one quote.</Note>
        <div className="mt-6 rounded-[24px] bg-nh-mist p-6 text-center sm:p-10">
          <MarqueeDiagram kind="pagoda" className="mx-auto w-full max-w-[340px]" />
          <p className="mt-4 font-nh-display text-[24px] font-extrabold leading-tight">The marquee package</p>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-nh-ash">
            Marquee, bar, bartenders, drinks, glassware, ice and fridges together. Furniture, flooring, lighting and crockery can be added with a marquee.
          </p>
          <button type="button" onClick={() => set({ marquee: true })}
            className={cn('mt-6 inline-flex items-center gap-2 rounded-full bg-nh-ink px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-black', ring)}>
            <Tent className="h-5 w-5" aria-hidden /> Add a marquee
          </button>
          <p className="mt-3 text-[13px] text-nh-ash">No marquee needed? Just carry on to your quote.</p>
        </div>
      </div>
    );
  }

  if (page === 'extras' && structure) {
    const group = EXTRAS.find((g) => g.id === tab) ?? EXTRAS[0];
    const added = (g: MarqueeGroup) => g.items.filter((i) => (state.marqueeItems[i.id] ?? 0) > 0).length;
    const toggle = group.max === 1;
    return (
      <div>
        <button type="button" onClick={() => setPage('choose')} className={cn('inline-flex min-h-10 items-center gap-1.5 rounded text-[14px] font-semibold underline underline-offset-4', ring)}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to your marquee
        </button>
        <Note className="mt-1">Add what goes in your marquee. Prices are confirmed with your quote.</Note>

        {/* One kind of extra at a time, so there is little to scroll. */}
        <div role="tablist" aria-label="Extras" className="mt-4 flex flex-wrap gap-1.5">
          {EXTRAS.map((g) => {
            const Icon = GROUP_ICON[g.id] ?? Tent;
            const n = added(g);
            const on = g.id === group.id;
            return (
              <button key={g.id} type="button" role="tab" aria-selected={on} onClick={() => setTab(g.id)}
                className={cn('inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3 text-[13px] font-semibold transition',
                  on ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white hover:border-nh-ink', ring)}>
                <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {g.name}
                {n > 0 && <span className={cn('rounded-full px-1.5 text-[11px] tabular-nums', on ? 'bg-white text-nh-ink' : 'bg-nh-ink text-white')}>{n}</span>}
              </button>
            );
          })}
        </div>

        <div role="tabpanel" aria-label={group.name} className="mt-4">
          {group.blurb && <p className="mb-2 text-[13px] text-nh-ash">{group.blurb}</p>}
          <ul className="grid gap-2 lg:grid-cols-2">
            {group.items.map((item) => {
              const qty = state.marqueeItems[item.id] ?? 0;
              return (
                <li key={item.id} className={cn('flex items-center gap-3 rounded-[14px] border-2 px-3 py-2.5 transition', qty > 0 ? 'border-nh-ink' : 'border-nh-line')}>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold leading-tight">{item.name}</p>
                    <p className="mt-0.5 text-[12.5px] leading-snug text-nh-ash">{item.detail}</p>
                  </div>
                  {toggle ? (
                    <button type="button" aria-pressed={qty > 0} onClick={() => setQty(item.id, qty > 0 ? 0 : 1)}
                      className={cn('inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[14px] font-semibold transition',
                        qty > 0 ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white text-nh-ink hover:border-nh-ink', ring)}>
                      {qty > 0 && <Check className="h-4 w-4" aria-hidden />}
                      {qty > 0 ? 'Added' : 'Add'}
                      <span className="sr-only">: {item.name}</span>
                    </button>
                  ) : (
                    <Counter label={item.name} value={qty} onChange={(n) => setQty(item.id, n)} min={0} max={group.max} size="sm" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Note>Choose your marquee. Then add the extras: walls, linings, flooring, furniture and more.</Note>

      {STRUCTURES.map((g) => (
        <section key={g.id} aria-labelledby={`mq-${g.id}`} className="mt-5">
          <h3 id={`mq-${g.id}`} className="sr-only">{g.name}</h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {g.items.map((item) => {
              const qty = state.marqueeItems[item.id] ?? 0;
              return (
                <li key={item.id} className={cn('flex flex-col rounded-[18px] border-2 p-3.5 transition', qty > 0 ? 'border-nh-ink' : 'border-nh-line')}>
                  {item.diagram && <MarqueeDiagram kind={item.diagram} className="mx-auto mb-1 w-full max-w-[170px]" />}
                  <p className="text-[15px] font-bold leading-tight">{item.name}</p>
                  <p className="mt-1 flex-1 text-[13px] leading-snug text-nh-ash">{item.detail}</p>
                  <p className="mt-2 text-[12px] font-semibold text-nh-ash">{priceLabel(item)}</p>
                  <div className="mt-1.5">
                    <Counter label={item.name} value={qty} onChange={(n) => setQty(item.id, n)} min={0} max={g.max} size="sm" />
                  </div>
                </li>
              );
            })}
          </ul>
          {g.blurb && <p className="mt-2 text-[13px] text-nh-ash">{g.blurb}</p>}
        </section>
      ))}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button type="button" disabled={!structure} onClick={() => setPage('extras')}
          className={cn('inline-flex h-12 items-center gap-2 rounded-full bg-nh-ink px-6 text-[15px] font-semibold text-white hover:bg-black disabled:opacity-40', ring)}>
          Choose extras <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
        <p className="text-[13px] text-nh-ash">
          {structure ? (extrasAdded > 0 ? `${extrasAdded} ${extrasAdded === 1 ? 'extra' : 'extras'} added.` : 'Walls, linings, flooring, lighting, furniture, crockery and more.') : 'Add a marquee first.'}
        </p>
      </div>

      <button type="button" onClick={() => set({ marquee: false })}
        className={cn('mt-4 min-h-10 rounded text-[14px] font-semibold text-nh-ash underline underline-offset-4 hover:text-nh-ink', ring)}>
        Remove the marquee from my quote
      </button>
    </div>
  );
}

