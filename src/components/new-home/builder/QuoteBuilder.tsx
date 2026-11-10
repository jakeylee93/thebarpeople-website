'use client';

// "Build your package": a step-by-step quote that prices itself as you go.
// It opens over the page from any link to #build. Phone: full screen, with the
// running total and the full quote in a pull-up sheet. Desktop: a large panel
// with the live quote beside it. Nothing is sent anywhere; choices are kept in
// this browser only.

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPenceCompact } from '@/lib/visual-quote/money';
import { DEFAULT_STATE, buildQuote, reach, type QuoteState } from '@/lib/quote/quote';
import DrinksStep from './DrinksStep';
import MarqueeStep from './MarqueeStep';
import QuotePanel from './QuotePanel';
import QuoteStep from './QuoteStep';
import { STEPS, clearState, closeBuilder, goToStep, loadState, saveState, stepIndex, useBuildRoute, type StepId } from './route';
import { BarStep, DeliveryStep, EventStep, GlasswareStep, IceStep, StaffStep, StyleStep, type StepProps } from './steps';
import { ring } from './ui';

export default function QuoteBuilder() {
  const { open, step, shared } = useBuildRoute();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="qb-title"
      onCancel={(e) => { e.preventDefault(); closeBuilder(); }}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 text-left text-nh-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
    >
      {open && <Builder step={step} shared={shared} />}
    </dialog>
  );
}

const BODIES: Record<StepId, React.ComponentType<StepProps>> = {
  event: EventStep, bar: BarStep, style: StyleStep, drinks: DrinksStep, glassware: GlasswareStep,
  ice: IceStep, staff: StaffStep, delivery: DeliveryStep, marquee: MarqueeStep, quote: QuoteStep,
};

/** Fills in the recommendation for the section a step belongs to, the first time it's seen. */
function reachFor(state: QuoteState, step: StepId): QuoteState {
  if (step === 'bar' || step === 'style') return reach(state, 'bar');
  if (step === 'drinks') return reach(state, 'drinks');
  if (step === 'staff') return reach(state, 'staff');
  return state;
}

function Builder({ step, shared }: { step: StepId; shared: string | null }) {
  const [state, setState] = useState<QuoteState>(() => {
    const loaded = loadState(shared);
    // Arriving straight at the marquee step (the "marquee package" button) adds the marquee.
    return step === 'marquee' ? { ...loaded, marquee: true } : loaded;
  });
  const [ledColour, setLedColour] = useState('#ff3d9a');
  const [sheet, setSheet] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // What this step shows: the saved choices plus the recommendation for this section.
  const view = reachFor(state, step);
  useEffect(() => { saveState(view); }, [view]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const quote = buildQuote(view);
  const idx = stepIndex(step);
  const meta = STEPS[idx];
  const next = STEPS[idx + 1];
  const set = (patch: Partial<QuoteState>) => setState((s) => ({ ...reachFor(s, step), ...patch }));
  const update = (fn: (s: QuoteState) => QuoteState) => setState((s) => fn(reachFor(s, step)));
  const go = (to: StepId) => { setSheet(false); setState((s) => reachFor(reachFor(s, step), to)); goToStep(to); };
  const back = () => (idx > 0 ? go(STEPS[idx - 1].id) : closeBuilder());
  const reset = () => { clearState(); setState(DEFAULT_STATE); setSheet(false); goToStep('event'); };

  const Body = BODIES[step];
  const props: StepProps = { state: view, set, update, quote, ledColour, setLedColour };
  const items = quote.lines.length;
  const running = quote.subtotal > 0 ? `${formatPenceCompact(quote.subtotal)} + VAT` : items > 0 ? `${items} ${items === 1 ? 'item' : 'items'}` : 'Builds as you go';
  const nextLabel = next ? (next.id === 'quote' ? 'See my quote' : `Next: ${next.label}`) : '';

  return (
    <div className="flex h-full w-full items-stretch justify-center md:p-5 lg:p-8">
      <div className={cn(
        'flex h-full w-full flex-col overflow-hidden bg-white md:grid md:rounded-[28px] md:shadow-2xl',
        // The last step is the quote itself, so it takes the full width.
        step === 'quote' ? 'max-w-[980px] md:grid-cols-1' : 'max-w-[1280px] md:grid-cols-[minmax(0,1fr)_400px]',
      )}>
        <section className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-5 md:px-8 md:pt-6">
            <button type="button" onClick={back} className={cn('flex h-11 w-11 items-center justify-center rounded-full hover:bg-nh-mist', ring)} aria-label={idx > 0 ? 'Back a step' : 'Close'}>
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <p id="qb-title" className="font-nh-display text-[16px] font-bold">Build your package</p>
            <button type="button" onClick={closeBuilder} className={cn('flex h-11 items-center gap-1 rounded-full px-3 text-[15px] font-semibold hover:bg-nh-mist', ring)}>
              <span className="hidden sm:inline">Close</span>
              <X className="h-5 w-5 sm:hidden" aria-hidden />
              <span className="sr-only sm:hidden">Close</span>
            </button>
          </div>

          <nav aria-label="Steps" className="px-4 sm:px-6 md:px-8">
            <ol className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}>
              {STEPS.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    aria-current={i === idx ? 'step' : undefined}
                    aria-label={`Step ${i + 1}: ${s.label}`}
                    className={cn('group block w-full rounded pb-1 pt-2 text-left', ring)}
                  >
                    <span className={cn('block h-1 rounded-full transition', i <= idx ? 'bg-nh-ink' : 'bg-nh-line group-hover:bg-nh-ash/40')} />
                    <span className={cn('mt-1.5 hidden truncate text-[11px] xl:block', i === idx ? 'font-bold text-nh-ink' : 'text-nh-ash')}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-1 text-[12px] text-nh-ash xl:hidden">Step {idx + 1} of {STEPS.length} · {meta.label}</p>
          </nav>

          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-36 pt-6 sm:px-6 md:px-8 md:pb-10">
            <h2 ref={headingRef} tabIndex={-1} className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] outline-none md:text-[42px]">
              {meta.title}
            </h2>
            <div className="mt-2"><Body key={step} {...props} /></div>
          </div>

          <div className="hidden items-center justify-between gap-4 border-t border-nh-line px-8 py-4 md:flex">
            <button type="button" onClick={back} className={cn('rounded-full px-5 py-3 text-[15px] font-semibold hover:bg-nh-mist', ring)}>
              {idx > 0 ? 'Back' : 'Close'}
            </button>
            {next && (
              <button type="button" onClick={() => go(next.id)} className={cn('inline-flex items-center gap-2 rounded-full bg-nh-ink px-7 py-3.5 text-[16px] font-semibold text-white hover:bg-black', ring)}>
                {nextLabel} <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        </section>

        {step !== 'quote' && (
          <aside aria-label="Your quote" className="hidden min-h-0 overflow-y-auto bg-nh-mist p-7 md:block">
            <QuotePanel state={view} quote={quote} ledColour={ledColour} onReset={reset} />
          </aside>
        )}
      </div>

      {/* Phone: running total and next */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-nh-line bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setSheet(true)} className={cn('min-w-0 rounded-xl px-1 py-1 text-left', ring)} aria-haspopup="dialog">
            <span className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-nh-ash">
              Your quote <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="block truncate font-nh-display text-[18px] font-extrabold tabular-nums" aria-live="polite">{running}</span>
          </button>
          {next && (
            <button type="button" onClick={() => go(next.id)} className={cn('inline-flex shrink-0 items-center gap-2 rounded-full bg-nh-ink px-5 py-3.5 text-[15px] font-semibold text-white', ring)}>
              {nextLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-20 flex items-end bg-black/50 md:hidden" onClick={() => setSheet(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Your quote"
            className="nh-sheet-in max-h-[88dvh] w-full overflow-y-auto rounded-t-[28px] bg-nh-mist p-5 pb-[max(20px,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setSheet(false); } }}
          >
            <div className="mb-2 flex justify-end">
              <button type="button" autoFocus onClick={() => setSheet(false)} className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-white', ring)} aria-label="Close quote">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <QuotePanel state={view} quote={quote} ledColour={ledColour} onReset={reset} />
          </div>
        </div>
      )}
    </div>
  );
}
