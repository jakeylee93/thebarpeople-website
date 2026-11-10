'use client';

// Marquee add-on. The marquee itself is chosen first; furniture, flooring,
// lighting, crockery and the rest are only offered once a marquee is in the
// quote. Prices are still to be agreed, so each line reads "To confirm".
//
// The range is long (over a hundred things), so each kind of extra folds
// away until it is opened, and the heading says how many are in the quote.

import {
  Armchair, Check, ChevronDown, CookingPot, DoorOpen, Flame, Grid2x2, Layers, Lightbulb, Lock, Mic, Music, Soup, Star, Tent,
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

  return (
    <div>
      <Note>
        Choose your marquee, then add what goes in it. Marquee prices are confirmed with your quote, so these lines read “To confirm” for now.
      </Note>

      {STRUCTURES.map((g) => (
        <section key={g.id} aria-labelledby={`mq-${g.id}`} className="mt-6">
          <h3 id={`mq-${g.id}`} className="text-[20px] font-extrabold tracking-tight">{g.name}</h3>
          {g.blurb && <p className="text-[14px] text-nh-ash">{g.blurb}</p>}
          <ul className="mt-3 grid gap-3 sm:grid-cols-3">
            {g.items.map((item) => {
              const qty = state.marqueeItems[item.id] ?? 0;
              return (
                <li key={item.id} className={cn('flex flex-col rounded-[18px] border-2 p-4 transition', qty > 0 ? 'border-nh-ink' : 'border-nh-line')}>
                  {item.diagram && <MarqueeDiagram kind={item.diagram} className="mx-auto mb-2 w-full max-w-[200px]" />}
                  <p className="text-[15px] font-bold leading-tight">{item.name}</p>
                  <p className="mt-1 flex-1 text-[13px] leading-snug text-nh-ash">{item.detail}</p>
                  <p className="mt-3 text-[12px] font-semibold text-nh-ash">{priceLabel(item)}</p>
                  <div className="mt-2">
                    <Counter label={item.name} value={qty} onChange={(n) => setQty(item.id, n)} min={0} max={g.max} size="sm" />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section aria-labelledby="mq-inside" className="mt-9">
        <h3 id="mq-inside" className="text-[20px] font-extrabold tracking-tight">Inside your marquee</h3>
        {structure ? (
          <>
            <p className="text-[14px] text-nh-ash">Open a section to add from it. Only available with a marquee.</p>
            <div className="mt-3 divide-y divide-nh-line overflow-hidden rounded-[18px] border border-nh-line">
              {EXTRAS.map((g) => <ExtraGroup key={g.id} group={g} items={state.marqueeItems} setQty={setQty} />)}
            </div>
          </>
        ) : (
          <div className="mt-3 flex items-start gap-3 rounded-[18px] bg-nh-mist p-4">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-nh-ash" aria-hidden />
            <p className="text-[14px] leading-relaxed text-nh-ash">
              Choose a marquee above first. Then you can add {EXTRAS.map((g) => g.name.toLowerCase()).slice(0, 6).join(', ')} and more.
            </p>
          </div>
        )}
      </section>

      <button type="button" onClick={() => set({ marquee: false })}
        className={cn('mt-6 min-h-10 rounded text-[14px] font-semibold text-nh-ash underline underline-offset-4 hover:text-nh-ink', ring)}>
        Remove the marquee from my quote
      </button>
    </div>
  );
}

/** One kind of extra, folded away until opened. */
function ExtraGroup({ group, items, setQty }: {
  group: MarqueeGroup; items: Record<string, number>; setQty: (id: string, n: number) => void;
}) {
  const chosen = group.items.filter((i) => (items[i.id] ?? 0) > 0).length;
  // A group with a largest quantity of one is a yes or no choice.
  const toggle = group.max === 1;
  const Icon = GROUP_ICON[group.id] ?? Tent;
  return (
    <details className="group bg-white">
      {/* The ring is drawn inside the row, because the rounded box around the list clips anything outside it. */}
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-nh-ink [&::-webkit-details-marker]:hidden">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-nh-mist text-nh-ink">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="flex-1 text-[16px] font-bold">{group.name}</span>
        {chosen > 0 && <span className="rounded-full bg-nh-ink px-2.5 py-0.5 text-[12px] font-semibold text-white">{chosen} added</span>}
        <ChevronDown className="h-5 w-5 shrink-0 text-nh-ash transition group-open:rotate-180" aria-hidden />
      </summary>
      <div className="px-4 pb-4">
        {group.blurb && <p className="mb-2 text-[13px] text-nh-ash">{group.blurb}</p>}
        <ul className="divide-y divide-nh-line">
          {group.items.map((item) => {
            const qty = items[item.id] ?? 0;
            return (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold leading-tight">{item.name}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-nh-ash">{item.detail}</p>
                  <p className="mt-1 text-[12px] font-semibold text-nh-ash">{priceLabel(item)}</p>
                </div>
                {toggle ? (
                  <button
                    type="button"
                    aria-pressed={qty > 0}
                    onClick={() => setQty(item.id, qty > 0 ? 0 : 1)}
                    className={cn(
                      'inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-[14px] font-semibold transition',
                      qty > 0 ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white text-nh-ink hover:border-nh-ink',
                      ring,
                    )}
                  >
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
    </details>
  );
}
