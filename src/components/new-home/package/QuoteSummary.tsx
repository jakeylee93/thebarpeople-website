'use client';

import { cn } from '@/lib/utils';
import { findBar } from '@/lib/visual-quote/catalogue';
import { formatPence, formatPenceCompact } from '@/lib/visual-quote/money';
import type { QuoteLine } from '@/lib/visual-quote/engine';
import { STAFF_RATE_PENCE, type PackageQuote, type PackageState } from '@/lib/new-home/package';
import BarStage from './BarStage';

function priceLabel(line: QuoteLine): { text: string; muted: boolean } {
  if (line.price.kind === 'priced') return { text: formatPence(line.price.pence), muted: false };
  if (line.price.kind === 'included') return { text: 'Included', muted: true };
  return { text: 'To confirm', muted: true };
}

export default function QuoteSummary({ state, quote, className, onReset }: {
  state: PackageState; quote: PackageQuote; className?: string; onReset?: () => void;
}) {
  const bar = findBar(state.barId);
  const { lines, pricedSubtotal, toConfirm } = quote;
  return (
    <div className={cn('flex flex-col', className)}>
      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-nh-ash">Your package</p>
      <p className="mt-1 text-[15px] text-nh-ash">{state.guests} guests</p>

      {bar && (
        <div className="mt-5 rounded-[20px] bg-white px-6 pb-6 pt-8">
          <BarStage barId={bar.id} led={state.led} alt={`${bar.name}, your choice`} sizes="320px" className="mx-auto w-full max-w-[300px]" />
          <p className="mt-4 text-center text-[14px] font-semibold">{bar.name}</p>
        </div>
      )}

      {lines.length === 0 ? (
        <p className="mt-6 text-[15px] leading-relaxed text-nh-ash">Your quote builds here as you choose.</p>
      ) : (
        <ul className="mt-5 divide-y divide-nh-line/80" aria-live="polite">
          {lines.map((l) => {
            const p = priceLabel(l);
            return (
              <li key={l.id} className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug">{l.title}</p>
                  <p className="text-[13px] leading-snug text-nh-ash">{l.detail}</p>
                  {l.price.kind === 'priced' && <p className="text-[12px] text-nh-ash">{l.price.working}</p>}
                </div>
                <p className={cn('shrink-0 text-right text-[15px] tabular-nums', p.muted ? 'text-nh-ash' : 'font-semibold')}>{p.text}</p>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-4 rounded-[18px] bg-nh-ink px-5 py-4 text-white">
        {pricedSubtotal > 0 ? (
          <p className="flex items-baseline justify-between gap-3">
            <span className="text-[14px] text-white/75">So far</span>
            <span className="font-nh-display text-[26px] font-extrabold tabular-nums">{formatPenceCompact(pricedSubtotal)} <span className="text-[14px] font-semibold text-white/75">+ VAT</span></span>
          </p>
        ) : (
          <p className="text-[15px] font-semibold">Your quote builds as you go</p>
        )}
        {toConfirm > 0 && (
          <p className="mt-1 text-[13px] text-white/70">
            Plus {toConfirm} {toConfirm === 1 ? 'price' : 'prices'} our team will confirm for you.
          </p>
        )}
      </div>

      <p className="mt-4 text-[12.5px] leading-relaxed text-nh-ash">
        Bartenders are {formatPenceCompact(STAFF_RATE_PENCE)} per person per hour + VAT, for the hours of your party. Everything
        else is confirmed by our team. This is a quote, not a booking: nothing is charged.
      </p>
      {onReset && lines.length > 0 && (
        <button type="button" onClick={onReset} className="mt-3 self-start rounded text-[13px] font-semibold text-nh-ash underline underline-offset-4 hover:text-nh-ink">
          Start again
        </button>
      )}
    </div>
  );
}
