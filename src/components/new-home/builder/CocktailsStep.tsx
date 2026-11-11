'use client';

// Cocktails: with all-inclusive drinks, guests pick the cocktails for their
// menu at no extra cost. A grid of cards; tap to add or remove.

import { Check, GlassWater } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COCKTAILS, MAX_COCKTAILS } from '@/lib/quote/drinks';
import { goToStep } from './route';
import { Note, ring } from './ui';
import type { StepProps } from './steps';

export default function CocktailsStep({ state, set }: StepProps) {
  if (state.drinksMode !== 'all-inclusive') {
    return (
      <div>
        <Note>Cocktails come with all-inclusive drinks. You’re bringing your own drinks, so there’s nothing to choose here.</Note>
        <button type="button" onClick={() => goToStep('drinks')} className={cn('mt-4 inline-flex h-11 items-center rounded-full border border-nh-ink px-5 text-[15px] font-semibold', ring)}>
          Switch to all-inclusive
        </button>
      </div>
    );
  }
  const chosen = state.cocktails;
  const full = chosen.length >= MAX_COCKTAILS;
  const toggle = (id: string) => set({ cocktails: chosen.includes(id) ? chosen.filter((c) => c !== id) : [...chosen, id].slice(0, MAX_COCKTAILS) });
  return (
    <div>
      <Note>
        Included with your all-inclusive drinks. Pick up to {MAX_COCKTAILS} for your menu.{' '}
        <strong className="text-nh-ink" aria-live="polite">{chosen.length} of {MAX_COCKTAILS} chosen.</strong>
      </Note>
      <ul className="mt-5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {COCKTAILS.map((c) => {
          const on = chosen.includes(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={on}
                disabled={!on && full}
                onClick={() => toggle(c.id)}
                className={cn(
                  'relative flex h-full w-full flex-col rounded-[16px] border-2 p-3 text-left transition disabled:opacity-40',
                  on ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white hover:border-nh-ink/40',
                  ring,
                )}
              >
                <span className={cn('flex h-8 w-8 items-center justify-center rounded-full', on ? 'bg-white text-nh-ink' : 'bg-nh-mist')}>
                  {on ? <Check className="h-4 w-4" aria-hidden /> : <GlassWater className="h-4 w-4" aria-hidden />}
                </span>
                <span className="mt-2 block text-[15px] font-bold leading-tight">{c.name}</span>
                <span className={cn('mt-0.5 block text-[12.5px] leading-snug', on ? 'text-white/75' : 'text-nh-ash')}>{c.detail}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-[13px] text-nh-ash">Want something that isn’t here? Tell us when we confirm your quote.</p>
    </div>
  );
}
