// Saved form state for the visual quote builder — this device only.
//
// Choices are kept in localStorage so a refresh or a return visit picks up
// where the guest left off. Contact details are deliberately NOT stored.
// Every read is validated and every access is wrapped: private windows and
// blocked storage simply mean nothing is remembered.

import { z } from 'zod';
import type { QuoteInput } from './engine.ts';

export const DRAFT_KEY = 'tbp.visualQuote.draft.v1';
export const SAVED_KEY = 'tbp.visualQuote.saved.v1';

const InputSchema = z.object({
  date: z.string().max(10).nullable(),
  postcode: z.string().max(10),
  guests: z.number().int().min(1).max(5000).nullable(),
  start: z.string().max(5).nullable(),
  end: z.string().max(5).nullable(),
  barId: z.string().max(40).nullable(),
  glasses: z.record(z.string().max(40), z.number().int().min(0).max(100_000)),
  iceAndStorage: z.record(z.string().max(40), z.number().int().min(0).max(10_000)),
  iceAdvice: z.boolean(),
  staffCount: z.number().int().min(0).max(100),
  drinksPackageId: z.string().max(40).nullable(),
  drinksMinutes: z.number().int().min(0).max(1440).nullable(),
  extras: z.array(z.string().max(40)).max(20),
});

const DraftSchema = z.object({
  v: z.literal(1),
  input: InputSchema,
  step: z.string().max(20),
  furthest: z.number().int().min(0).max(20),
  /** Idempotency key a real request would carry, so a retried send can never create two quotes. */
  requestKey: z.string().min(8).max(64),
  updatedAt: z.string().max(40),
});

const SavedSchema = z.object({
  v: z.literal(1),
  savedAt: z.string().max(40),
  input: InputSchema,
  requestKey: z.string().min(8).max(64),
});

export type Draft = z.infer<typeof DraftSchema>;
export type SavedQuote = z.infer<typeof SavedSchema>;

export function safeStorage(): Storage | null {
  try {
    if (typeof window === 'undefined') return null;
    const s = window.localStorage;
    const probe = '__tbp_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

function read<T>(storage: Storage | null, key: string, schema: z.ZodType<T>): T | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = schema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function write(storage: Storage | null, key: string, value: unknown): boolean {
  if (!storage) return false;
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const readDraft = (storage: Storage | null) => read(storage, DRAFT_KEY, DraftSchema);
export const readSaved = (storage: Storage | null) => read(storage, SAVED_KEY, SavedSchema);

export function writeDraft(storage: Storage | null, draft: Omit<Draft, 'v'>): boolean {
  return write(storage, DRAFT_KEY, { v: 1, ...draft });
}

export function writeSaved(storage: Storage | null, input: QuoteInput, requestKey: string): SavedQuote | null {
  const saved: SavedQuote = { v: 1, savedAt: new Date().toISOString(), input, requestKey };
  return write(storage, SAVED_KEY, saved) ? saved : null;
}

export function clearAll(storage: Storage | null): void {
  if (!storage) return;
  try {
    storage.removeItem(DRAFT_KEY);
    storage.removeItem(SAVED_KEY);
  } catch {
    /* nothing to clear */
  }
}

export function newRequestKey(): string {
  try {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `rk-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
