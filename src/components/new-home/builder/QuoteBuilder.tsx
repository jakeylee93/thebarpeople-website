'use client';

// "Build your package": a step-by-step quote that prices itself as you go.
// It opens over the page from any link to #build. Phone and tablet: full
// screen, with the running total and the full quote in a pull-up sheet.
// Desktop: a large panel with the live quote beside it. Nothing is sent
// anywhere; choices are kept in this browser only.

import { Component, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPenceCompact } from '@/lib/visual-quote/money';
import { DEFAULT_STATE, buildQuote, reach, type QuoteState } from '@/lib/quote/quote';
import DrinksStep from './DrinksStep';
import MarqueeStep from './MarqueeStep';
import QuotePanel from './QuotePanel';
import QuoteStep from './QuoteStep';
import {
  STEPS, clearState, closeBuilder, goToStep, loadState, replaceStep, saveState, stepIndex, useBuildRoute, type StepId,
} from './route';
import { BarStep, DeliveryStep, EventStep, GlasswareStep, IceStep, StaffStep, StyleStep, type StepProps } from './steps';
import { closeTopLayer, ring } from './ui';

export default function QuoteBuilder() {
  const { open, step, shared, marqueePackage } = useBuildRoute();
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
      // Escape closes the top thing first (an info hint), and only then the builder.
      // React also passes up the phone sheet's own Escape; that one is left to close itself.
      onCancel={(e) => {
        if (e.target !== e.currentTarget) return;
        e.preventDefault();
        if (!closeTopLayer()) closeBuilder();
      }}
      // overflow-hidden: the panel itself must never scroll; only the step inside it does.
      className="m-0 h-[100dvh] max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 text-left text-nh-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
    >
      {open && (
        <Boundary>
          {/* A different shared link is a different quote: start it afresh. */}
          <Builder key={shared ?? 'local'} step={step} shared={shared} marqueePackage={marqueePackage} />
        </Boundary>
      )}
    </dialog>
  );
}

/**
 * A safety net. If a step ever fails to draw, the visitor gets a way forward
 * instead of a blank page. Their choices are cleared, since a saved choice is
 * the likeliest cause and would otherwise fail again on reload.
 */
class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { clearState(); }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="flex h-full w-full items-center justify-center p-5">
        <div role="alert" className="w-full max-w-md rounded-[28px] bg-white p-7 text-center">
          <p id="qb-title" className="font-nh-display text-[24px] font-extrabold leading-tight">Sorry, something went wrong</p>
          <p className="mt-2 text-[15px] leading-relaxed text-nh-ash">Your quote couldn’t be shown. Please start it again, or call us and we’ll do it with you.</p>
          <button type="button" onClick={() => { this.setState({ failed: false }); goToStep('event'); }}
            className={cn('mt-5 inline-flex h-12 items-center rounded-full bg-nh-ink px-6 text-[15px] font-semibold text-white', ring)}>
            Start again
          </button>
          <button type="button" onClick={closeBuilder} className={cn('ml-2 inline-flex h-12 items-center rounded-full px-5 text-[15px] font-semibold', ring)}>Close</button>
        </div>
      </div>
    );
  }
}

const BODIES: Record<StepId, React.ComponentType<StepProps>> = {
  event: EventStep, bar: BarStep, style: StyleStep, drinks: DrinksStep, glassware: GlasswareStep,
  ice: IceStep, staff: StaffStep, delivery: DeliveryStep, marquee: MarqueeStep, quote: QuoteStep,
};

/**
 * Fills in our recommendation for every section up to and including this step,
 * the first time each is reached. So a visitor who jumps ahead with the step
 * buttons gets the same package as one who presses Next each time.
 */
function reachFor(state: QuoteState, step: StepId): QuoteState {
  const at = stepIndex(step);
  let s = state;
  if (at >= stepIndex('bar')) s = reach(s, 'bar');
  if (at >= stepIndex('drinks')) s = reach(s, 'drinks');
  if (at >= stepIndex('staff')) s = reach(s, 'staff');
  return s;
}

const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

function Builder({ step, shared, marqueePackage }: { step: StepId; shared: string | null; marqueePackage: boolean }) {
  const [start] = useState(() => {
    const loaded = loadState(shared);
    let state = loaded.state;
    // A saved or shared quote whose date has gone by asks for a new date.
    if (state.date !== null && state.date <= localToday()) state = { ...state, date: null };
    // Arriving from the "marquee package" button switches the marquee on.
    if (marqueePackage) state = { ...state, marquee: true };
    return { state, badLink: loaded.badLink };
  });
  const [state, setState] = useState<QuoteState>(start.state);
  const [ledColour, setLedColour] = useState('#ff3d9a');
  const [sheet, setSheet] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // The package link is used once: after that the address is the plain first step.
  useEffect(() => { if (marqueePackage) replaceStep('event'); }, [marqueePackage]);

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
    <div className="flex h-full w-full items-stretch justify-center lg:p-8">
      <div className={cn(
        'flex h-full w-full flex-col overflow-hidden bg-white lg:grid lg:rounded-[28px] lg:shadow-2xl',
        // The last step is the quote itself, so it takes the full width.
        step === 'quote' ? 'max-w-[980px] lg:grid-cols-1' : 'max-w-[1280px] lg:grid-cols-[minmax(0,1fr)_400px]',
      )}>
        <section className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-5 lg:px-8 lg:pt-6">
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

          <nav aria-label="Steps" className="px-4 sm:px-6 lg:px-8">
            <ol className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${STEPS.length}, minmax(0, 1fr))` }}>
              {STEPS.map((s, i) => (
                <li key={s.id}>
                  {/* The line is thin, but the button reaches 12px above and below it so it is easy to tap. */}
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    aria-current={i === idx ? 'step' : undefined}
                    aria-label={`Step ${i + 1}: ${s.label}`}
                    className={cn('group -my-3 block w-full rounded py-[18px] text-left xl:my-0 xl:pb-1 xl:pt-2', ring)}
                  >
                    <span className={cn('block h-1 rounded-full transition', i <= idx ? 'bg-nh-ink' : 'bg-nh-line group-hover:bg-nh-ash/40')} />
                    <span className={cn('mt-1.5 hidden truncate text-[11px] xl:block', i === idx ? 'font-bold text-nh-ink' : 'text-nh-ash')}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-1 text-[12px] text-nh-ash xl:hidden">Step {idx + 1} of {STEPS.length} · {meta.label}</p>
          </nav>

          {/* relative: hidden form controls inside are placed within this box, so focusing one never scrolls the page behind. */}
          <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-36 pt-6 sm:px-6 lg:px-8 lg:pb-6 lg:pt-[clamp(10px,2.2dvh,24px)]">
            <h2 ref={headingRef} tabIndex={-1} className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] outline-none lg:text-[clamp(28px,5dvh,42px)]">
              {meta.title}
            </h2>
            {start.badLink && step === 'quote' && (
              <p role="status" className="mt-3 rounded-[14px] bg-nh-mist px-4 py-3 text-[14px] leading-relaxed">
                We couldn’t open that quote link, so this is the quote saved on this device. Ask for the link to be sent again if it looks wrong.
              </p>
            )}
            <div className="mt-2"><Body key={step} {...props} /></div>
          </div>

          <div className="hidden items-center justify-between gap-4 border-t border-nh-line px-8 py-4 lg:flex">
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
          <aside aria-label="Your quote" className="hidden min-h-0 overflow-y-auto bg-nh-mist p-7 lg:block">
            <QuotePanel state={view} quote={quote} ledColour={ledColour} onReset={reset} />
          </aside>
        )}
      </div>

      {/* Phone and tablet: running total and next */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-nh-line bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 lg:hidden">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3">
          <button type="button" onClick={() => setSheet(true)} className={cn('min-h-11 shrink-0 rounded-xl px-1 py-1 text-left', ring)} aria-haspopup="dialog">
            <span className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-nh-ash">
              Your quote <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="block whitespace-nowrap font-nh-display text-[18px] font-extrabold tabular-nums" aria-live="polite">{running}</span>
          </button>
          {next && (
            <button type="button" onClick={() => go(next.id)} className={cn('inline-flex min-w-0 items-center gap-2 rounded-full bg-nh-ink px-5 py-3.5 text-[15px] font-semibold text-white', ring)}>
              {/* On the narrowest phones the total keeps its room and this label is cut short instead. */}
              <span className="truncate">{nextLabel}</span> <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </button>
          )}
        </div>
      </div>

      <Sheet open={sheet} onClose={() => setSheet(false)}>
        <QuotePanel state={view} quote={quote} ledColour={ledColour} onReset={reset} />
      </Sheet>
    </div>
  );
}

/**
 * The pull-up quote on phones. A real modal dialog, so the browser keeps the
 * keyboard inside it, Escape closes only this sheet, and focus goes back to the
 * button that opened it.
 */
function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); closeRef.current?.focus(); }
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label="Your quote"
      onClose={onClose}
      // A tap on the dimmed area (the dialog itself, not the sheet inside it) closes it.
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none items-end overflow-hidden bg-black/50 p-0 text-left text-nh-ink backdrop:bg-transparent open:flex"
    >
      {open && (
        <div className="nh-sheet-in max-h-[88dvh] w-full overflow-y-auto overscroll-contain rounded-t-[28px] bg-nh-mist p-5 pb-[max(20px,env(safe-area-inset-bottom))]">
          <div className="mb-2 flex justify-end">
            <button ref={closeRef} type="button" onClick={onClose} className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-white', ring)} aria-label="Close quote">
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
