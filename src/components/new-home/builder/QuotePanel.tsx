'use client';

// The live quote: every line priced as the guest builds, with VAT and a total.

import { cn } from '@/lib/utils';
import { formatPence } from '@/lib/visual-quote/money';
import { GROUP_LABELS, type LineGroup, type Quote, type QuoteState } from '@/lib/quote/quote';
import BarDiagram from '../package/BarDiagram';

export function QuoteLines({ quote, dense = false }: { quote: Quote; dense?: boolean }) {
  const groups: { group: LineGroup; lines: Quote['lines'] }[] = [];
  for (const line of quote.lines) {
    const last = groups[groups.length - 1];
    if (last?.group === line.group) last.lines.push(line);
    else groups.push({ group: line.group, lines: [line] });
  }
  if (groups.length === 0) {
    return <p className="text-[15px] leading-relaxed text-nh-ash">Your quote builds here as you choose.</p>;
  }
  return (
    <div className="space-y-4" aria-live="polite">
      {groups.map(({ group, lines }) => (
        <section key={group} aria-label={GROUP_LABELS[group]}>
          <h4 className="border-b border-nh-ink pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-nh-ash [font-family:var(--font-inter)]">
            {GROUP_LABELS[group]}
          </h4>
          <ul className="divide-y divide-nh-line">
            {lines.map((l) => (
              <li key={l.id} className={cn('nh-pop flex items-start justify-between gap-4', dense ? 'py-2' : 'py-2.5')}>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold leading-snug">{l.title}</p>
                  <p className="text-[13px] leading-snug text-nh-ash">{l.detail}</p>
                  {l.price.kind === 'priced' && <p className="text-[12.5px] leading-snug text-nh-ash">{l.price.working}</p>}
                </div>
                {l.price.kind === 'priced' ? (
                  <p className="shrink-0 text-right text-[15px] font-semibold tabular-nums">{formatPence(l.price.pence)}</p>
                ) : (
                  // The engine's own reason is shown when it tells the guest what to do ("Add your bar times").
                  <p className="max-w-[9rem] shrink-0 text-right text-[13px] text-nh-ash">{l.price.reason.startsWith('Add ') ? l.price.reason : 'To confirm'}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function QuoteTotals({ quote, tone = 'dark' }: { quote: Quote; tone?: 'dark' | 'light' }) {
  const dark = tone === 'dark';
  const box = cn('rounded-[18px] px-5 py-4', dark ? 'bg-nh-ink text-white' : 'border-2 border-nh-ink bg-white');
  // Nothing priced yet (a marquee on its own, say): never show that as £0.
  if (quote.subtotal === 0 && quote.toConfirm > 0) {
    return (
      <div className={box}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-[15px] font-semibold">Total</p>
          <p className="font-nh-display text-[22px] font-extrabold leading-none">To confirm</p>
        </div>
        <p className={cn('mt-2 text-[13px]', dark ? 'text-white/70' : 'text-nh-ash')}>
          We’ll confirm a price for {quote.toConfirm === 1 ? 'this item' : `these ${quote.toConfirm} items`}.
        </p>
      </div>
    );
  }
  return (
    <div className={box}>
      <dl className="space-y-1 text-[14px]">
        <div className="flex justify-between gap-4">
          <dt className={dark ? 'text-white/70' : 'text-nh-ash'}>Subtotal</dt>
          <dd className="tabular-nums">{formatPence(quote.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className={dark ? 'text-white/70' : 'text-nh-ash'}>VAT at 20%</dt>
          <dd className="tabular-nums">{formatPence(quote.vat)}</dd>
        </div>
        <div className={cn('flex items-baseline justify-between gap-4 border-t pt-2', dark ? 'border-white/25' : 'border-nh-line')}>
          <dt className="text-[15px] font-semibold">Total</dt>
          <dd className="font-nh-display text-[28px] font-extrabold leading-none tabular-nums">{formatPence(quote.total)}</dd>
        </div>
      </dl>
      {quote.toConfirm > 0 && (
        <p className={cn('mt-2 text-[13px]', dark ? 'text-white/70' : 'text-nh-ash')}>
          Plus {quote.toConfirm} {quote.toConfirm === 1 ? 'item' : 'items'} we’ll confirm a price for.
        </p>
      )}
    </div>
  );
}

export default function QuotePanel({ state, quote, ledColour, onReset, className }: {
  state: QuoteState; quote: Quote; ledColour: string; onReset?: () => void; className?: string;
}) {
  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[12px] font-bold uppercase tracking-[0.2em] text-nh-ash [font-family:var(--font-inter)]">Your quote</h3>
        <p className="text-[14px] text-nh-ash">{state.guests} guests</p>
      </div>
      {state.bar && (
        <div className="mt-4 rounded-[20px] bg-white px-3 py-2">
          <BarDiagram bar={state.bar} ledColour={ledColour} artworkText={false} decorative />
        </div>
      )}
      <div className="mt-5"><QuoteLines quote={quote} dense /></div>
      {quote.lines.length > 0 && <div className="mt-5"><QuoteTotals quote={quote} /></div>}
      <p className="mt-4 text-[12.5px] leading-relaxed text-nh-ash">
        Prices are plus VAT. This is a quote, not a booking: nothing is charged.
      </p>
      {onReset && quote.lines.length > 0 && (
        <button type="button" onClick={onReset} className="mt-1 min-h-10 self-start rounded text-[13px] font-semibold text-nh-ash underline underline-offset-4 outline-none hover:text-nh-ink focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2">
          Start again
        </button>
      )}
    </div>
  );
}
