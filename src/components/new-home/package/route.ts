'use client';

// The builder lives in the URL hash: #build opens it, #build/<step> is each
// step. Every step is a history entry, so the phone's Back gesture goes back a
// step. Any link to #build anywhere on the page opens it.

import { useSyncExternalStore } from 'react';
import { z } from 'zod';
import { DEFAULT_PACKAGE, LED_COLOURS, isStepId, type PackageState, type StepId } from '@/lib/new-home/package';

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

export function useBuildRoute(): { open: boolean; step: StepId } {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash, () => '');
  const m = /^#build(?:\/([a-z-]+))?$/.exec(hash);
  const step = m?.[1];
  return { open: m !== null, step: isStepId(step) ? step : 'guests' };
}

export function goToStep(step: StepId) {
  window.history.pushState(null, '', `#build/${step}`);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

export function closeBuilder() {
  window.history.pushState(null, '', window.location.pathname + window.location.search);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

// ─── Saved choices (this browser only; never contact details or postcode) ─────

const KEY = 'tbp-package-v1';
const ledIds = LED_COLOURS.map((c) => c.id) as [string, ...string[]];
const time = z.string().regex(/^\d{2}:\d{2}$/);
const count = z.number().int().min(0).max(5000);

const Saved = z.object({
  guests: z.number().int().min(1).max(5000),
  barId: z.string().max(40).nullable(),
  led: z.enum(ledIds).nullable(),
  branded: z.boolean(),
  glasses: z.record(z.string().max(40), count),
  iceBags: count,
  igloos: count,
  fridges: count,
  staffCount: z.number().int().min(0).max(50).nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  start: time,
  end: time,
  drinks: z.enum(['own', 'drinks-all-inclusive', 'drinks-cocktails', 'drinks-alcohol-free']),
});

export function loadPackage(): PackageState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT_PACKAGE;
    const parsed = Saved.safeParse(JSON.parse(raw));
    return parsed.success ? { ...DEFAULT_PACKAGE, ...(parsed.data as Omit<PackageState, 'postcode'>), postcode: '' } : DEFAULT_PACKAGE;
  } catch {
    return DEFAULT_PACKAGE;
  }
}

export function savePackage(s: PackageState) {
  try {
    const { postcode: _postcode, ...rest } = s;
    void _postcode;
    window.localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    // Private mode or storage full: the builder still works, it just won't remember.
  }
}

export function clearPackage() {
  try { window.localStorage.removeItem(KEY); } catch { /* ignore */ }
}
