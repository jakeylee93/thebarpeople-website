'use client';

// The builder lives in the URL hash, so the phone's Back gesture steps back:
//   #build            opens it          #build/<step>   a step
//   #quote=<choices>  a shared quote, opened on the last step
// Any link to #build anywhere on the page opens it.

import { useSyncExternalStore } from 'react';
import { DEFAULT_STATE, decodeState, encodeState, parseState, type QuoteState } from '@/lib/quote/quote';

export const STEPS = [
  { id: 'event', label: 'Event', title: 'Tell us about your event' },
  { id: 'bar', label: 'Bar', title: 'Choose your bar' },
  { id: 'style', label: 'Style', title: 'Choose your style' },
  { id: 'drinks', label: 'Drinks', title: 'Drinks' },
  { id: 'glassware', label: 'Glassware', title: 'Glassware' },
  { id: 'ice', label: 'Ice & fridges', title: 'Ice and fridges' },
  { id: 'staff', label: 'Bartenders', title: 'Your bartenders' },
  { id: 'delivery', label: 'Delivery', title: 'Delivery and set-up' },
  { id: 'marquee', label: 'Marquee', title: 'Add a marquee' },
  { id: 'quote', label: 'Your quote', title: 'Your quote' },
] as const;
export type StepId = (typeof STEPS)[number]['id'];
export const isStepId = (v: unknown): v is StepId => STEPS.some((s) => s.id === v);
export const stepIndex = (id: StepId) => STEPS.findIndex((s) => s.id === id);

const ROUTE_EVENT = 'tbp:route';

function subscribe(cb: () => void) {
  window.addEventListener('hashchange', cb);
  window.addEventListener('popstate', cb);
  window.addEventListener(ROUTE_EVENT, cb);
  return () => {
    window.removeEventListener('hashchange', cb);
    window.removeEventListener('popstate', cb);
    window.removeEventListener(ROUTE_EVENT, cb);
  };
}

export interface BuildRoute { open: boolean; step: StepId; shared: string | null }

export function parseRoute(hash: string): BuildRoute {
  const shared = /^#quote=([A-Za-z0-9_-]+)$/.exec(hash);
  if (shared) return { open: true, step: 'quote', shared: shared[1] };
  const m = /^#build(?:\/([a-z-]+))?$/.exec(hash);
  const step = m?.[1];
  return { open: m !== null, step: isStepId(step) ? step : 'event', shared: null };
}

export function useBuildRoute(): BuildRoute {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  return parseRoute(hash);
}

export function goToStep(step: StepId) {
  window.history.pushState(null, '', `#build/${step}`);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export function closeBuilder() {
  window.history.pushState(null, '', window.location.pathname + window.location.search);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

/** A link that reopens these choices on any device. */
export function shareLink(state: QuoteState): string {
  return `${window.location.origin}${window.location.pathname}#quote=${encodeState(state)}`;
}

// ─── Saved choices: this browser only, and never the postcode or contact details ───

const KEY = 'tbp-quote-v2';

export function loadState(shared: string | null): QuoteState {
  if (shared) {
    const fromLink = decodeState(shared);
    if (fromLink) return fromLink;
  }
  try {
    const raw = window.localStorage.getItem(KEY);
    return (raw ? parseState(JSON.parse(raw)) : null) ?? DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: QuoteState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...state, postcode: '' }));
  } catch {
    // Private mode or storage full: the builder still works, it just won't remember.
  }
}

export function clearState() {
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
