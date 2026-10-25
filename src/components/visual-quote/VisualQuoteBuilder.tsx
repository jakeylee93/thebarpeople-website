'use client';

// SECTION TWO — "Build your party quote" (PROTOTYPE).
//
// Desktop: the current step's image + choices on the left, the branded
// itemised quote on the right. Phone: image + question on top, choices, then
// a compact total pinned to the bottom that opens the full quote.
//
// Safety: this prototype makes NO network requests. "Request my quote" only
// shows what would happen; it never calls /api/quote (which creates real
// enquiries in anyOS). Reference numbers shown are examples, never allocated.

import { useCallback, useEffect, useMemo, useReducer, useRef, useState, useSyncExternalStore } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, ChevronUp, RotateCcw, X } from 'lucide-react';

import type { QuoteInput, QuoteLine, QuoteResult } from '@/lib/visual-quote/engine';
import { buildQuote, EMPTY_INPUT, NO_BAR, NO_PACKAGE, QUOTE_POLICY } from '@/lib/visual-quote/engine';
import { EXTRAS, GLASSES, ICE_AND_STORAGE, findBar, findPackage } from '@/lib/visual-quote/catalogue';
import { formatPence } from '@/lib/visual-quote/money';
import {
  clearAll, newRequestKey, readDraft, readSaved, safeStorage, writeDraft, writeSaved,
} from '@/lib/visual-quote/draft';
import { cn } from '@/lib/utils';
import QuotePaper, { compactTotal, eventSummary } from './QuotePaper';
import type { FlipOrigin, PartyErrors } from './steps';
import { BarStep, DrinksStep, ExtrasStep, GlassesStep, IceStep, PartyStep, StaffStep } from './steps';
import { FieldError, focusRing, inputClass, labelClass } from './controls';

export const STEPS = [
  { id: 'party', nav: 'Party', eyebrow: 'Your party', question: 'When and where is the party?', hint: 'Finishing after midnight is fine — we’ll work out the next day for you.' },
  { id: 'bar', nav: 'Bar', eyebrow: 'The bar', question: 'Choose your bar', hint: 'Six layouts to start from. Tap one to see it larger.' },
  { id: 'glasses', nav: 'Glasses', eyebrow: 'Glassware', question: 'Which glasses, and how many?', hint: 'Tap Add for one per guest as a starting point. We’ll help you balance the mix.' },
  { id: 'ice', nav: 'Ice', eyebrow: 'Ice & storage', question: 'Ice and keeping things cold', hint: 'Count what you need, or let us advise.' },
  { id: 'staff', nav: 'Staff', eyebrow: 'Your team', question: 'How many bartenders?', hint: '£28 per bartender per hour, plus VAT, for the hours of your party.' },
  { id: 'drinks', nav: 'Drinks', eyebrow: 'Drinks', question: 'Shall we supply the drinks?', hint: 'Optional. A package covers your guests for the hours you choose.' },
  { id: 'extras', nav: 'Extras', eyebrow: 'Anything else', question: 'Anything else for the party?', hint: 'Optional — we’ll price these for you.' },
  { id: 'review', nav: 'Review', eyebrow: 'Review', question: 'Check your quote', hint: 'Change anything you like, then save it or ask us to confirm it.' },
] as const;

type StepId = (typeof STEPS)[number]['id'];
const stepIndexOf = (id: string) => STEPS.findIndex((s) => s.id === id);
const hashFor = (i: number) => `#quote-${STEPS[i].id}`;

// ─── State ──────────────────────────────────────────────────────────────────

interface State {
  input: QuoteInput;
  index: number;
  furthest: number;
  requestKey: string;
  ready: boolean;
  restoredAt: string | null;
}

type Action =
  | { type: 'patch'; patch: Partial<QuoteInput> }
  | { type: 'goto'; index: number }
  | { type: 'hydrate'; requestKey: string; input?: QuoteInput; index?: number; furthest?: number; restoredAt?: string | null }
  | { type: 'reset'; requestKey: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'patch':
      return { ...state, input: { ...state.input, ...action.patch } };
    case 'goto': {
      const index = Math.max(0, Math.min(STEPS.length - 1, action.index));
      return { ...state, index, furthest: Math.max(state.furthest, index) };
    }
    case 'hydrate':
      return {
        ...state,
        ready: true,
        requestKey: action.requestKey,
        input: action.input ?? state.input,
        index: action.index ?? state.index,
        furthest: action.furthest ?? state.furthest,
        restoredAt: action.restoredAt ?? null,
      };
    case 'reset':
      return { input: EMPTY_INPUT, index: 0, furthest: 0, requestKey: action.requestKey, ready: true, restoredAt: null };
  }
}

const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?(\s*\d[A-Z]{2})?$/i;

function validateParty(input: QuoteInput, result: QuoteResult, today: string | null): PartyErrors {
  const e: PartyErrors = {};
  if (!input.date) e.date = 'Choose your party date';
  else if (today && input.date < today) e.date = 'That date has passed — choose another';
  if (!input.guests || input.guests < 1) e.guests = 'Roughly how many guests?';
  if (!input.postcode.trim()) e.postcode = 'Add the venue postcode';
  else if (!POSTCODE.test(input.postcode.trim())) e.postcode = 'That doesn’t look like a UK postcode';
  if (input.date && !result.timing && result.timingIssue) e.time = result.timingIssue;
  return e;
}

// Browser-only values, read without a setState-in-effect round trip.
const noSubscribe = () => () => {};
const localToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const storedSavedAt = () => readSaved(safeStorage())?.savedAt ?? null;

const priceWords = (l: QuoteLine) =>
  l.price.kind === 'priced' ? `${formatPence(l.price.pence)} plus VAT` : l.price.kind === 'included' ? 'included' : 'price to confirm';

// ─── Component ──────────────────────────────────────────────────────────────

export default function VisualQuoteBuilder() {
  const [state, dispatch] = useReducer(reducer, {
    input: EMPTY_INPUT, index: 0, furthest: 0, requestKey: '', ready: false, restoredAt: null,
  });
  const result = useMemo(() => buildQuote(state.input), [state.input]);
  const step = STEPS[state.index];
  const reduce = useReducedMotion();

  const today = useSyncExternalStore(noSubscribe, localToday, () => null);
  const [showErrors, setShowErrors] = useState(false);
  const [showAllGlasses, setShowAllGlasses] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [inView, setInView] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const stepTopRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const sheetRef = useRef<HTMLDialogElement>(null);
  const originRef: FlipOrigin = useRef<DOMRect | null>(null);
  const userNav = useRef(false);
  const furthestRef = useRef(0);
  useEffect(() => { furthestRef.current = state.furthest; }, [state.furthest]);

  const patch = useCallback((p: Partial<QuoteInput>) => dispatch({ type: 'patch', patch: p }), []);

  // Restore saved choices (this device only) once, after mount.
  useEffect(() => {
    const draft = readDraft(safeStorage());
    const hashStep = /^#quote-([a-z]+)$/.exec(window.location.hash)?.[1];
    if (draft) {
      const furthest = Math.min(draft.furthest, STEPS.length - 1);
      const fromHash = hashStep ? stepIndexOf(hashStep) : -1;
      const index = fromHash >= 0 && fromHash <= furthest ? fromHash : Math.max(0, Math.min(stepIndexOf(draft.step), furthest));
      dispatch({ type: 'hydrate', requestKey: draft.requestKey, input: { ...EMPTY_INPUT, ...draft.input }, index, furthest, restoredAt: draft.updatedAt });
    } else {
      dispatch({ type: 'hydrate', requestKey: newRequestKey() });
    }
  }, []);

  // Save choices as they change (debounced). Contact details are never stored.
  useEffect(() => {
    if (!state.ready) return;
    const id = window.setTimeout(() => {
      writeDraft(safeStorage(), {
        input: state.input, step: step.id, furthest: state.furthest, requestKey: state.requestKey, updatedAt: new Date().toISOString(),
      });
    }, 350);
    return () => window.clearTimeout(id);
  }, [state.input, state.furthest, state.requestKey, state.ready, step.id]);

  // Browser Back / Forward move between steps.
  useEffect(() => {
    const onPop = () => {
      const m = /^#quote-([a-z]+)$/.exec(window.location.hash);
      const i = m ? stepIndexOf(m[1]) : 0;
      if (i >= 0 && i <= furthestRef.current) {
        userNav.current = true;
        dispatch({ type: 'goto', index: i });
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Phone total bar shows only while the builder is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // After a step change the user asked for: focus the question, keep it in view.
  useEffect(() => {
    if (!userNav.current) return;
    userNav.current = false;
    headingRef.current?.focus({ preventScroll: true });
    const heading = headingRef.current;
    const nav = navRef.current;
    if (heading && nav) {
      const r = heading.getBoundingClientRect();
      if (r.top < 0 || r.top > window.innerHeight * 0.3) {
        nav.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      }
    }
  }, [state.index, reduce]);

  // Announce quote changes for screen readers (debounced, latest two changes).
  const prevLines = useRef<Map<string, QuoteLine> | null>(null);
  useEffect(() => {
    const now = new Map(result.lines.map((l) => [l.id, l]));
    const prev = prevLines.current;
    prevLines.current = now;
    if (!prev || !state.ready) return;
    const msgs: string[] = [];
    for (const [id, l] of now) {
      const p = prev.get(id);
      if (!p) msgs.push(`Added ${l.title}, ${priceWords(l)}`);
      else if (priceWords(p) !== priceWords(l) || p.detail !== l.detail) msgs.push(`Updated ${l.title}, ${priceWords(l)}`);
    }
    for (const [id, l] of prev) if (!now.has(id)) msgs.push(`Removed ${l.title}`);
    if (!msgs.length) return;
    const t = window.setTimeout(() => {
      setAnnouncement(`${msgs.slice(-2).join('. ')}. Priced so far ${formatPence(result.pricedSubtotal)} plus VAT.`);
    }, 700);
    return () => window.clearTimeout(t);
  }, [result, state.ready]);

  const partyErrors = showErrors ? validateParty(state.input, result, today) : {};

  const go = useCallback((index: number) => {
    const i = Math.max(0, Math.min(STEPS.length - 1, index));
    userNav.current = true;
    dispatch({ type: 'goto', index: i });
    try { window.history.pushState(null, '', hashFor(i)); } catch { /* history unavailable */ }
  }, []);

  const next = () => {
    if (step.id === 'party') {
      const e = validateParty(state.input, result, today);
      if (Object.keys(e).length) {
        setShowErrors(true);
        const first = (['date', 'guests', 'postcode', 'time'] as const).find((k) => e[k]);
        const id = first === 'time' ? 'vq-end' : `vq-${first}`;
        window.setTimeout(() => document.getElementById(id)?.focus(), 0);
        return;
      }
    }
    go(state.index + 1);
  };

  const startAgain = () => {
    clearAll(safeStorage());
    setShowErrors(false);
    dispatch({ type: 'reset', requestKey: newRequestKey() });
    userNav.current = true;
    try { window.history.replaceState(null, '', hashFor(0)); } catch { /* ignore */ }
  };

  const total = compactTotal(result);
  const headingId = 'vq-step-heading';

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="build-your-quote"
        ref={sectionRef}
        aria-labelledby="vq-title"
        className="relative bg-ivory pb-28 pt-12 text-ink lg:pb-16 lg:pt-14"
      >
        <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
          {/* Section header */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass-ink">Instant · itemised · no obligation</p>
              <h2 id="vq-title" className="mt-2 font-heading text-[32px] leading-[1.05] sm:text-[40px]">Build your party quote</h2>
              <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-stone">
                Choose your bar, glasses, ice and team. Your quote builds line by line as you go — every price shows how it’s worked out.
              </p>
            </div>
            {state.restoredAt && (
              <div className="flex items-center gap-3 self-start rounded-full border border-hairline bg-white/70 py-1.5 pl-4 pr-1.5 text-[13px] text-stone lg:self-end">
                <span>Welcome back — your choices are saved on this device.</span>
                <button type="button" onClick={startAgain}
                  className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold text-ink hover:bg-ivory-deep', focusRing)}>
                  <RotateCcw size={13} aria-hidden="true" /> Start again
                </button>
              </div>
            )}
          </div>

          {/* Progress */}
          <nav ref={navRef} aria-label="Quote steps" className="mt-6 scroll-mt-3">
            <ol className="relative flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-1.5">
              {STEPS.map((s, i) => {
                const reachable = i <= state.furthest;
                const current = i === state.index;
                return (
                  <li key={s.id} className="relative min-w-[64px] flex-1">
                    <button
                      type="button"
                      disabled={!reachable}
                      onClick={() => go(i)}
                      aria-current={current ? 'step' : undefined}
                      className={cn('group w-full text-left disabled:cursor-default', focusRing)}
                    >
                      <span className={cn('block h-[3px] rounded-full transition-colors',
                        current ? 'bg-ink' : i < state.furthest || (reachable && i < state.index) ? 'bg-brass' : reachable ? 'bg-brass/50' : 'bg-hairline')} />
                      <span className={cn('mt-1.5 block text-[11.5px] font-semibold tracking-wide',
                        current ? 'text-ink' : reachable ? 'text-stone group-hover:text-ink' : 'text-stone/50')}>
                        <span className="sr-only">Step {i + 1}: </span>{s.nav}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_440px]">
            {/* LEFT — the step */}
            <div ref={stepTopRef} className="min-w-0 scroll-mt-4">
              <div className="mb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">
                  Step {state.index + 1} of {STEPS.length} · {step.eyebrow}
                </p>
                <h3 id={headingId} ref={headingRef} tabIndex={-1} className="mt-1 font-heading text-[26px] leading-tight outline-none sm:text-[30px]">
                  {step.question}
                </h3>
                <p className="mt-1 text-[14px] text-stone">{step.hint}</p>
              </div>

              <div>
                {step.id === 'party' && <PartyStep input={state.input} patch={patch} result={result} errors={partyErrors} minDate={today ?? undefined} />}
                {step.id === 'bar' && <BarStep input={state.input} patch={patch} originRef={originRef} />}
                {step.id === 'glasses' && <GlassesStep input={state.input} patch={patch} showAll={showAllGlasses} setShowAll={setShowAllGlasses} />}
                {step.id === 'ice' && <IceStep input={state.input} patch={patch} />}
                {step.id === 'staff' && <StaffStep input={state.input} patch={patch} result={result} />}
                {step.id === 'drinks' && <DrinksStep input={state.input} patch={patch} result={result} originRef={originRef} />}
                {step.id === 'extras' && <ExtrasStep input={state.input} patch={patch} />}
                {step.id === 'review' && (
                  <ReviewStep input={state.input} result={result} onEdit={(id) => go(stepIndexOf(id))} requestKey={state.requestKey} />
                )}
              </div>

              {/* Back / Continue */}
              <div className="mt-7 flex items-center justify-between gap-3 border-t border-hairline pt-5">
                <button
                  type="button"
                  onClick={() => go(state.index - 1)}
                  disabled={state.index === 0}
                  className={cn('inline-flex h-12 items-center gap-2 rounded-full px-4 text-[15px] font-semibold text-ink transition hover:bg-ivory-deep disabled:invisible', focusRing)}
                >
                  <ArrowLeft size={17} aria-hidden="true" /> Back
                </button>
                {step.id !== 'review' && (
                  <button
                    type="button"
                    onClick={next}
                    className={cn('inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-ivory transition hover:bg-ink-soft', focusRing)}
                  >
                    {state.index === STEPS.length - 2 ? 'Review my quote' : 'Continue'} <ArrowRight size={17} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT — the quote (desktop) */}
            <aside className="hidden lg:block" aria-label="Your quote">
              <div className="sticky top-6">
                <QuotePaper input={state.input} result={result} headingId="vq-quote-panel" />
              </div>
            </aside>
          </div>
        </div>

        {/* PHONE — compact total, opens the full quote */}
        <div
          className={cn(
            'fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-[#fbf8f2]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-18px_rgba(21,19,17,0.5)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden',
            inView && step.id !== 'review' ? 'translate-y-0' : 'pointer-events-none translate-y-full',
          )}
          aria-hidden={!(inView && step.id !== 'review')}
        >
          <button
            type="button"
            onClick={() => sheetRef.current?.showModal()}
            tabIndex={inView && step.id !== 'review' ? 0 : -1}
            className={cn('flex w-full items-center justify-between gap-3 text-left', focusRing)}
            aria-haspopup="dialog"
          >
            <span className="min-w-0">
              <span className="block font-heading text-[21px] leading-tight tabular-nums">{total.amount}</span>
              <span className="block truncate text-[12.5px] text-stone">{total.status}</span>
            </span>
            <span className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[14px] font-semibold text-ivory">
              View quote <ChevronUp size={16} aria-hidden="true" />
            </span>
          </button>
        </div>

        <dialog
          ref={sheetRef}
          aria-labelledby="vq-quote-sheet"
          onClick={(e) => { if (e.target === sheetRef.current) sheetRef.current?.close(); }}
          className="vq-sheet fixed inset-x-0 bottom-0 top-auto m-0 max-h-[88dvh] w-full max-w-none overflow-y-auto rounded-t-2xl bg-[#fbf8f2] p-0 text-ink shadow-2xl backdrop:bg-ink/55 lg:hidden"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-hairline bg-[#fbf8f2] px-4 py-2">
            <span className="mx-auto h-1 w-10 rounded-full bg-hairline" aria-hidden="true" />
            <button type="button" onClick={() => sheetRef.current?.close()}
              className={cn('absolute right-2 top-1.5 inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-ivory-deep', focusRing)}
              aria-label="Close quote">
              <X size={18} aria-hidden="true" />
            </button>
          </div>
          <QuotePaper input={state.input} result={result} variant="sheet" headingId="vq-quote-sheet" />
        </dialog>

        <p aria-live="polite" className="sr-only">{announcement}</p>
      </section>
    </MotionConfig>
  );
}

// ─── Review ─────────────────────────────────────────────────────────────────

function ReviewStep({ input, result, onEdit, requestKey }: {
  input: QuoteInput; result: QuoteResult; onEdit: (id: StepId) => void; requestKey: string;
}) {
  const bar = findBar(input.barId);
  const pkg = findPackage(input.drinksPackageId);
  const glasses = GLASSES.filter((g) => (input.glasses[g.id] ?? 0) > 0).map((g) => `${input.glasses[g.id]} × ${g.name.toLowerCase()}`);
  const cold = ICE_AND_STORAGE.filter((i) => (input.iceAndStorage[i.id] ?? 0) > 0).map((i) => `${input.iceAndStorage[i.id]} × ${i.name.toLowerCase()}`);
  if (input.iceAdvice) cold.push('advice on ice');
  const extras = EXTRAS.filter((x) => input.extras.includes(x.id)).map((x) => x.name);

  const rows: { id: StepId; label: string; value: string }[] = [
    { id: 'party', label: 'Party', value: eventSummary(input, result).join(' · ') || 'Not set yet' },
    { id: 'bar', label: 'Bar', value: bar ? `${bar.name} · ${bar.size}` : input.barId === NO_BAR ? 'No bar needed' : 'Not chosen' },
    { id: 'glasses', label: 'Glasses', value: glasses.join(', ') || 'None' },
    { id: 'ice', label: 'Ice & storage', value: cold.join(', ') || 'None' },
    { id: 'staff', label: 'Staff', value: input.staffCount ? `${input.staffCount} bartender${input.staffCount === 1 ? '' : 's'}` : 'None' },
    { id: 'drinks', label: 'Drinks', value: pkg ? pkg.name : input.drinksPackageId === NO_PACKAGE ? 'We’ll supply our own' : 'Not decided' },
    { id: 'extras', label: 'Extras', value: extras.join(', ') || 'None' },
  ];

  const [contact, setContact] = useState({ name: '', email: '', phone: '', notes: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const storedAt = useSyncExternalStore(noSubscribe, storedSavedAt, () => null);
  const [justSavedAt, setJustSavedAt] = useState<string | null>(null);
  const savedAt = justSavedAt ?? storedAt;
  const [requested, setRequested] = useState(false);

  const save = () => {
    const s = writeSaved(safeStorage(), input, requestKey);
    setJustSavedAt(s ? s.savedAt : null);
  };

  const request = () => {
    const e: { name?: string; email?: string } = {};
    if (!contact.name.trim()) e.name = 'Your name, please';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) e.email = 'An email we can send your quote to';
    setErrors(e);
    if (Object.keys(e).length) {
      window.setTimeout(() => document.getElementById(e.name ? 'vq-name' : 'vq-email')?.focus(), 0);
      return;
    }
    // PROTOTYPE: deliberately no network call. A live version would POST once,
    // carrying requestKey so a retry can never create a second quote.
    setRequested(true);
  };

  const pending = result.pendingRequired + result.pendingOptional;
  const savedLabel = savedAt
    ? new Date(savedAt).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div className="space-y-6">
      {/* Phones see the whole quote here (desktop has it alongside). */}
      <div className="lg:hidden">
        <QuotePaper input={input} result={result} variant="full" headingId="vq-quote-review" />
      </div>

      <dl className="divide-y divide-hairline rounded-[3px] border border-hairline bg-white">
        {rows.map((r) => (
          <div key={r.id} className="flex items-start justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone">{r.label}</dt>
              <dd className="mt-0.5 text-[14.5px] leading-snug text-ink">{r.value}</dd>
            </div>
            <button type="button" onClick={() => onEdit(r.id)}
              className={cn('shrink-0 rounded-full px-3 py-1.5 text-[13px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-ink', focusRing)}>
              Edit<span className="sr-only"> {r.label.toLowerCase()}</span>
            </button>
          </div>
        ))}
      </dl>

      {requested ? (
        <div role="status" className="rounded-[3px] border border-ink bg-white p-5">
          <p className="inline-block bg-ink px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ivory">Prototype · nothing was sent</p>
          <p className="mt-3 font-heading text-[22px] leading-snug">Here’s what would happen next</p>
          <ul className="mt-3 space-y-2 text-[14.5px] leading-relaxed text-stone">
            <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
              <span>Your quote is saved with a party number, for example <strong className="text-ink">Party no. {QUOTE_POLICY.exampleReference}</strong>. <span className="text-[12.5px]">(Example only — real numbers are issued only when a quote is created for real.)</span></span></li>
            <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
              <span>{contact.email ? `A copy goes to ${contact.email}.` : 'A copy goes to your email.'} {pending > 0 ? `We price the ${pending} ${pending === 1 ? 'item' : 'items'} still marked “to confirm”.` : 'Every line is already priced.'}</span></li>
            <li className="flex gap-2"><Check size={16} className="mt-1 shrink-0 text-ink" aria-hidden="true" />
              <span>Nothing is booked or charged, and your date isn’t held, until you confirm with us.</span></li>
          </ul>
          <button type="button" onClick={() => setRequested(false)}
            className={cn('mt-4 text-[14px] font-semibold underline decoration-ink/30 underline-offset-4', focusRing)}>
            Back to the form
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); request(); }} className="space-y-4" aria-label="Your details">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="vq-name" className={labelClass}>Your name</label>
              <input id="vq-name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })}
                aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'vq-name-err' : undefined} className={inputClass} />
              <FieldError id="vq-name-err">{errors.name}</FieldError>
            </div>
            <div>
              <label htmlFor="vq-email" className={labelClass}>Email</label>
              <input id="vq-email" type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })}
                aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'vq-email-err' : undefined} className={inputClass} />
              <FieldError id="vq-email-err">{errors.email}</FieldError>
            </div>
            <div>
              <label htmlFor="vq-phone" className={labelClass}>Phone <span className="font-normal text-stone">(optional)</span></label>
              <input id="vq-phone" type="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="vq-notes" className={labelClass}>Anything we should know? <span className="font-normal text-stone">(optional)</span></label>
              <input id="vq-notes" value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} className={inputClass} />
            </div>
          </div>
          <p className="text-[12.5px] text-stone">Your details aren’t saved on this device. Your choices are.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit"
              className={cn('inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[15px] font-semibold text-ivory transition hover:bg-ink-soft', focusRing)}>
              Request my quote
            </button>
            <button type="button" onClick={save}
              className={cn('inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/30 px-6 text-[15px] font-semibold text-ink transition hover:border-ink', focusRing)}>
              Save on this device
            </button>
            <p role="status" className="text-[13px] text-stone">{savedLabel ? `Saved on this device at ${savedLabel}.` : ''}</p>
          </div>
        </form>
      )}
    </div>
  );
}
