'use client';

// "Build your package": a quick step-by-step quote that opens over the page
// from any "Build your package" button (links to #build). Phone: full screen
// with the quote in a pull-up sheet. Desktop: a large panel with the quote
// beside it. Nothing is sent anywhere; choices are kept in this browser only.

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPenceCompact } from '@/lib/visual-quote/money';
import {
  DEFAULT_PACKAGE, PACKAGE_STEPS, buildPackageQuote, onEnterStep, stepIndex,
  type PackageState, type StepId,
} from '@/lib/new-home/package';
import QuoteSummary from './QuoteSummary';
import { clearPackage, closeBuilder, goToStep, loadPackage, savePackage, useBuildRoute } from './route';
import {
  BarStep, ColourStep, DetailsStep, DrinksStep, FridgesStep, GlasswareStep, GuestsStep, IceStep, REQUEST_FORM_ID, StaffStep,
  type StepProps,
} from './steps';
import { ring } from './ui';

export default function PackageBuilder() {
  const { open, step } = useBuildRoute();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
    if (!open) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => { html.style.overflow = previous; };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="pkg-title"
      onCancel={(e) => { e.preventDefault(); closeBuilder(); }}
      className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-transparent p-0 text-nh-ink backdrop:bg-black/60 backdrop:backdrop-blur-[2px]"
    >
      {open && <Builder step={step} />}
    </dialog>
  );
}

const BODIES: Record<Exclude<StepId, 'details'>, React.ComponentType<StepProps>> = {
  guests: GuestsStep, bar: BarStep, colour: ColourStep, glassware: GlasswareStep,
  ice: IceStep, fridges: FridgesStep, staff: StaffStep, drinks: DrinksStep,
};

function Builder({ step }: { step: StepId }) {
  const [state, setState] = useState<PackageState>(loadPackage);
  const [sheet, setSheet] = useState(false);
  const [sent, setSent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { savePackage(state); }, [state]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const quote = buildPackageQuote(state);
  const idx = stepIndex(step);
  const meta = PACKAGE_STEPS[idx];
  const next = PACKAGE_STEPS[idx + 1];
  const set = (patch: Partial<PackageState>) => { setSent(false); setState((s) => ({ ...s, ...patch })); };
  const go = (to: StepId) => { setSheet(false); setState((s) => onEnterStep(s, to)); goToStep(to); };
  const back = () => (idx > 0 ? go(PACKAGE_STEPS[idx - 1].id) : closeBuilder());
  const reset = () => { clearPackage(); setState(DEFAULT_PACKAGE); setSent(false); go('guests'); };

  const props: StepProps = { state, set, quote };
  const Body = step === 'details' ? null : BODIES[step];
  const body = Body ? <Body key={step} {...props} /> : <DetailsStep {...props} sent={sent} onSent={() => setSent(true)} />;

  const total = quote.pricedSubtotal > 0 ? `${formatPenceCompact(quote.pricedSubtotal)} + VAT` : null;
  const items = quote.lines.length;

  return (
    <div className="flex h-full w-full items-stretch justify-center md:p-5 lg:p-8">
      <div className="flex h-full w-full max-w-[1240px] flex-col overflow-hidden bg-white md:grid md:grid-cols-[minmax(0,1fr)_380px] md:rounded-[28px] md:shadow-2xl">
        <section className="flex min-h-0 flex-1 flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-5 md:px-8 md:pt-6">
            <button type="button" onClick={back} className={cn('flex h-11 w-11 items-center justify-center rounded-full hover:bg-nh-mist', ring)} aria-label={idx > 0 ? 'Back a step' : 'Close'}>
              <ArrowLeft className="h-5 w-5" aria-hidden />
            </button>
            <p id="pkg-title" className="font-nh-display text-[16px] font-bold">Build your package</p>
            <button type="button" onClick={closeBuilder} className={cn('flex h-11 items-center gap-1 rounded-full px-3 text-[15px] font-semibold hover:bg-nh-mist', ring)}>
              <span className="hidden sm:inline">Close</span>
              <X className="h-5 w-5 sm:hidden" aria-hidden />
              <span className="sr-only sm:hidden">Close</span>
            </button>
          </div>

          {/* Progress */}
          <nav aria-label="Steps" className="px-4 sm:px-6 md:px-8">
            <ol className="mt-3 grid grid-cols-9 gap-1">
              {PACKAGE_STEPS.map((s, i) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => go(s.id)}
                    aria-current={i === idx ? 'step' : undefined}
                    aria-label={`Step ${i + 1}: ${s.label}`}
                    className={cn('group block w-full rounded pb-1 pt-2 text-left', ring)}
                  >
                    <span className={cn('block h-1 rounded-full transition', i <= idx ? 'bg-nh-ink' : 'bg-nh-line group-hover:bg-nh-ash/40')} />
                    <span className={cn('mt-1.5 hidden truncate text-[11px] lg:block', i === idx ? 'font-bold text-nh-ink' : 'text-nh-ash')}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="mt-1 text-[12px] text-nh-ash lg:hidden">Step {idx + 1} of {PACKAGE_STEPS.length} · {meta.label}</p>
          </nav>

          {/* Step */}
          <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-36 pt-6 sm:px-6 md:px-8 md:pb-10">
            <h2 ref={headingRef} tabIndex={-1} className="text-[32px] font-extrabold leading-[1.05] tracking-[-0.02em] outline-none md:text-[44px]">
              {meta.title}
            </h2>
            <div className="mt-2">{body}</div>
            {step === 'details' && (
              <div className="mt-8 rounded-[24px] bg-nh-mist p-5 md:hidden">
                <QuoteSummary state={state} quote={quote} onReset={reset} />
              </div>
            )}
          </div>

          {/* Desktop footer */}
          <div className="hidden items-center justify-between gap-4 border-t border-nh-line px-8 py-4 md:flex">
            <button type="button" onClick={back} className={cn('rounded-full px-5 py-3 text-[15px] font-semibold hover:bg-nh-mist', ring)}>
              {idx > 0 ? 'Back' : 'Close'}
            </button>
            {next ? (
              <button key="next" type="button" onClick={() => go(next.id)} className={cn('inline-flex items-center gap-2 rounded-full bg-nh-ink px-7 py-3.5 text-[16px] font-semibold text-white hover:bg-black', ring)}>
                Next: {next.label} <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            ) : (
              <button key="submit" type="submit" form={REQUEST_FORM_ID} className={cn('inline-flex items-center gap-2 rounded-full bg-nh-ink px-7 py-3.5 text-[16px] font-semibold text-white hover:bg-black', ring)}>
                Request my quote <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            )}
          </div>
        </section>

        <aside aria-label="Your quote" className="hidden min-h-0 overflow-y-auto bg-nh-mist p-7 md:block">
          <QuoteSummary state={state} quote={quote} onReset={reset} />
        </aside>
      </div>

      {/* Phone: quote bar + next */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-nh-line bg-white px-4 pb-[max(14px,env(safe-area-inset-bottom))] pt-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => setSheet(true)} className={cn('min-w-0 rounded-xl px-1 py-1 text-left', ring)} aria-haspopup="dialog">
            <span className="flex items-center gap-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-nh-ash">
              Your quote <ChevronUp className="h-3.5 w-3.5" aria-hidden />
            </span>
            <span className="block truncate text-[16px] font-bold">
              {total ?? (items > 0 ? `${items} ${items === 1 ? 'item' : 'items'}` : 'Builds as you go')}
            </span>
          </button>
          {next ? (
            <button key="next" type="button" onClick={() => go(next.id)} className={cn('inline-flex shrink-0 items-center gap-2 rounded-full bg-nh-ink px-5 py-3.5 text-[15px] font-semibold text-white', ring)}>
              Next: {next.label} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          ) : (
            <button key="submit" type="submit" form={REQUEST_FORM_ID} className={cn('inline-flex shrink-0 items-center gap-2 rounded-full bg-nh-ink px-5 py-3.5 text-[15px] font-semibold text-white', ring)}>
              Request my quote <ArrowRight className="h-4 w-4" aria-hidden />
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
            className="nh-sheet-in max-h-[85dvh] w-full overflow-y-auto rounded-t-[28px] bg-nh-mist p-5 pb-[max(20px,env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setSheet(false); } }}
          >
            <div className="mb-3 flex justify-end">
              <button type="button" autoFocus onClick={() => setSheet(false)} className={cn('flex h-10 w-10 items-center justify-center rounded-full bg-white', ring)} aria-label="Close quote">
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <QuoteSummary state={state} quote={quote} onReset={reset} />
          </div>
        </div>
      )}
    </div>
  );
}
