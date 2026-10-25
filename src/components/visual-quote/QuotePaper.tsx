'use client';

// The branded, itemised quote. Used in the desktop side panel, the phone
// pull-up sheet and the review step. New lines slide in with a brief brass
// wash (transform animation is dropped for reduced motion via MotionConfig).

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import type { LineGroup, QuoteInput, QuoteLine, QuoteResult } from '@/lib/visual-quote/engine';
import { QUOTE_POLICY } from '@/lib/visual-quote/engine';
import { formatPence } from '@/lib/visual-quote/money';
import { formatDate, formatDuration, formatTime } from '@/lib/visual-quote/time';
import { cn } from '@/lib/utils';

const GROUP_LABEL: Record<LineGroup, string> = {
  bar: 'Bar',
  glassware: 'Glassware',
  ice: 'Ice & storage',
  staff: 'Staff',
  drinks: 'Drinks',
  extras: 'Extras',
  delivery: 'Delivery',
};
const GROUP_ORDER: LineGroup[] = ['bar', 'glassware', 'ice', 'staff', 'drinks', 'extras', 'delivery'];

export type PaperVariant = 'panel' | 'sheet' | 'full';

export function eventSummary(input: QuoteInput, result: QuoteResult): string[] {
  const out: string[] = [];
  const t = result.timing;
  if (t) {
    const end = t.endMinutes === 0
      ? 'midnight'
      : `${formatTime(t.endMinutes)}${t.overnight ? ` (${formatDate(t.endDate, true)})` : ''}`;
    out.push(`${formatDate(t.date)}`);
    out.push(`${formatTime(t.startMinutes)} to ${end} · ${formatDuration(t.billableMinutes)}`);
  } else if (input.date) {
    out.push(formatDate(input.date));
  }
  const who = [input.guests ? `${input.guests} guests` : null, input.postcode.trim() ? input.postcode.trim().toUpperCase() : null]
    .filter(Boolean)
    .join(' · ');
  if (who) out.push(who);
  return out;
}

function Amount({ line }: { line: QuoteLine }) {
  const p = line.price;
  if (p.kind === 'priced') return <span className="tabular-nums font-medium text-ink">{formatPence(p.pence)}</span>;
  if (p.kind === 'included') {
    return <span className="text-[13px] font-medium text-stone">Included</span>;
  }
  return (
    <span className="whitespace-nowrap text-[13px] italic text-brass-ink underline decoration-brass-ink/40 decoration-dotted underline-offset-4">
      {p.optional ? 'On request' : 'To confirm'}
    </span>
  );
}

function LineRow({ line }: { line: QuoteLine }) {
  const sub =
    line.price.kind === 'priced'
      ? line.price.working
      : line.price.kind === 'included'
        ? `Covered by ${line.price.by}`
        : line.price.reason;
  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: -6, backgroundColor: 'rgba(201,149,107,0.28)' }}
      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(201,149,107,0)' }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.35, backgroundColor: { duration: 1.6, ease: 'easeOut' } }}
      className="-mx-2 rounded-sm px-2 py-2"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-medium leading-snug text-ink">{line.title}</span>
        <Amount line={line} />
      </div>
      <p className="mt-0.5 text-[13px] leading-snug text-stone">{line.detail}</p>
      {sub && <p className="mt-0.5 text-[12px] leading-snug text-stone/90">{sub}</p>}
    </motion.li>
  );
}

export default function QuotePaper({
  input,
  result,
  variant = 'panel',
  headingId,
  className,
}: {
  input: QuoteInput;
  result: QuoteResult;
  variant?: PaperVariant;
  headingId?: string;
  className?: string;
}) {
  const summary = eventSummary(input, result);
  const groups = GROUP_ORDER.map((g) => ({ g, lines: result.lines.filter((l) => l.group === g) })).filter((x) => x.lines.length);
  const pending = result.pendingRequired + result.pendingOptional;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        'relative flex flex-col bg-[#fbf8f2] text-ink',
        variant === 'panel' && 'max-h-[calc(100vh-7rem)] rounded-[3px] border border-hairline shadow-[0_24px_60px_-28px_rgba(21,19,17,0.45)]',
        variant === 'full' && 'rounded-[3px] border border-hairline',
        className,
      )}
    >
      {/* Letterhead */}
      <header className="flex items-start justify-between gap-4 border-b border-hairline px-6 pb-4 pt-5">
        <div className="flex items-center gap-3">
          <Image src="/images/logos/bar-people-logo.png" alt="" width={44} height={44} className="h-11 w-11" />
          <div>
            <p id={headingId} className="font-heading text-[19px] leading-tight">The Bar People</p>
            <p className="text-[11px] uppercase tracking-[0.18em] text-stone">Party quote</p>
          </div>
        </div>
        <div className="text-right" title="Example only. Real numbers are issued only when a quote is saved for real.">
          <p className="inline-block border border-dashed border-brass-ink/60 px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.16em] text-brass-ink">
            Example
          </p>
          <p className="mt-1 font-heading text-[15px] tabular-nums">Party no. {QUOTE_POLICY.exampleReference}</p>
        </div>
      </header>

      {/* Event */}
      {summary.length > 0 && (
        <div className="border-b border-hairline px-6 py-3 text-[13px] leading-relaxed text-stone">
          {summary.map((s) => <p key={s}>{s}</p>)}
        </div>
      )}

      {/* Lines */}
      <div className={cn('flex-1 px-6 py-3', variant === 'panel' && 'overflow-y-auto overscroll-contain')}>
        {groups.length === 0 ? (
          <p className="py-8 text-center text-[14px] leading-relaxed text-stone">
            Your quote builds here as you choose.
            <br />
            Every line shows exactly how it’s worked out.
          </p>
        ) : (
          groups.map(({ g, lines }) => (
            <section key={g} className="py-1.5" aria-label={GROUP_LABEL[g]}>
              <h4 className="pt-1 text-[10.5px] font-semibold uppercase tracking-[0.2em] text-stone">{GROUP_LABEL[g]}</h4>
              <ul>
                <AnimatePresence initial={false}>
                  {lines.map((line) => <LineRow key={line.id} line={line} />)}
                </AnimatePresence>
              </ul>
            </section>
          ))
        )}
      </div>

      {/* Totals */}
      <footer className="border-t-2 border-ink px-6 pb-5 pt-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">
              {result.status === 'complete' ? 'Subtotal' : 'Priced so far'}
            </p>
            <p className="mt-0.5 text-[12px] text-stone">Excludes VAT</p>
          </div>
          <p className="font-heading text-[30px] leading-none tabular-nums">
            {formatPence(result.pricedSubtotal)}
            <span className="ml-1.5 align-middle font-body text-[13px] font-medium text-stone">+ VAT</span>
          </p>
        </div>

        {result.vat.status === 'verified' && (
          <div className="mt-2 flex justify-between text-[13px] text-stone">
            <span>VAT ({result.vat.ratePercentLabel})</span>
            <span className="tabular-nums">{formatPence(result.vat.vat)}</span>
          </div>
        )}

        {result.status !== 'empty' && (
          <p className={cn(
            'mt-3 flex items-center gap-2 text-[13px] font-medium',
            result.status === 'complete' ? 'text-ink' : 'text-brass-ink',
          )}>
            <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', result.status === 'complete' ? 'bg-ink' : 'bg-brass')} />
            {result.status === 'complete'
              ? 'Itemised quote'
              : `Provisional estimate · ${pending} ${pending === 1 ? 'item' : 'items'} to confirm`}
          </p>
        )}
        <p className="mt-2 text-[12px] leading-relaxed text-stone">
          A quote, not a booking: your date isn’t held and nothing is charged. VAT is added on your final quote.
        </p>
      </footer>
    </article>
  );
}

/** One-line total for the phone bar. */
export function compactTotal(result: QuoteResult): { amount: string; status: string } {
  const pending = result.pendingRequired + result.pendingOptional;
  return {
    amount: `${formatPence(result.pricedSubtotal)} + VAT`,
    status: result.status === 'empty'
      ? 'Nothing added yet'
      : result.status === 'complete'
        ? `${result.lines.length} items · itemised`
        : `${result.lines.length} ${result.lines.length === 1 ? 'item' : 'items'} · ${pending} to confirm`,
  };
}
