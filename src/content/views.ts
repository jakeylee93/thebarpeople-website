// Typed views over the loosely typed content, for the components that render it.
// Pure functions; safe on server or client. Values passed to client components
// are plain JSON.

import type { FieldValue, ImageValue, LinkValue, SiteContent } from './contract.ts';
import { QUOTE_STEP_IDS } from './manifest.ts';

export const textOf = (c: SiteContent, section: string, field: string): string => {
  const v = c[section]?.[field];
  return typeof v === 'string' ? v : typeof v === 'number' ? String(v) : '';
};

export const imageOf = (c: SiteContent, section: string, field: string): ImageValue => {
  const v = c[section]?.[field] as ImageValue | undefined;
  return v && typeof v === 'object' && 'src' in v ? { src: v.src, alt: v.alt } : { src: '', alt: '' };
};

export const linkOf = (c: SiteContent, section: string, field: string): LinkValue => {
  const v = c[section]?.[field] as LinkValue | undefined;
  return v && typeof v === 'object' && 'href' in v ? { href: v.href, label: v.label } : { href: '', label: '' };
};

export const listOf = (c: SiteContent, section: string, field: string): Record<string, FieldValue>[] => {
  const v = c[section]?.[field];
  return Array.isArray(v) ? v : [];
};

/** CSS object-position from an editor value; anything odd falls back to the centre. */
export function focusOf(value: string, fallback = '50% 50%'): string {
  const v = value.trim().toLowerCase();
  if (/^\d{1,3}(\.\d+)?% \d{1,3}(\.\d+)?%$/.test(v)) return v;
  if (/^(center|top|bottom|left|right)( (center|top|bottom|left|right))?$/.test(v)) return v;
  return fallback;
}

/** Fill {tokens} that the site owns (e.g. {staff_rate} from the catalogue). Unknown tokens are left visible. */
export const fillTokens = (s: string, vars: Record<string, string>): string =>
  s.replace(/\{([a-z_]+)\}/g, (m, k: string) => (k in vars ? vars[k] : m));

// ─── Opening film ───────────────────────────────────────────────────────────

export interface SlotImage {
  src: string;
  alt: string;
  note: string;
  focusDesktop: string;
  focusPhone: string;
}

export interface OpeningCopy {
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  headerCtaLabel: string;
  shirt: SlotImage;
  bar: SlotImage;
  scrollCue: string;
}

const slot = (c: SiteContent, prefix: string): SlotImage => {
  const img = imageOf(c, 'opening', `${prefix}_image`);
  return {
    src: img.src,
    alt: img.alt,
    note: textOf(c, 'opening', `${prefix}_note`),
    focusDesktop: focusOf(textOf(c, 'opening', `${prefix}_focus_desktop`)),
    focusPhone: focusOf(textOf(c, 'opening', `${prefix}_focus_phone`)),
  };
};

export function openingView(c: SiteContent): OpeningCopy {
  return {
    eyebrow: textOf(c, 'opening', 'eyebrow'),
    headline: textOf(c, 'opening', 'headline'),
    subheadline: textOf(c, 'opening', 'subheadline'),
    ctaLabel: textOf(c, 'opening', 'cta_label'),
    headerCtaLabel: textOf(c, 'opening', 'header_cta_label'),
    shirt: slot(c, 'shirt'),
    bar: slot(c, 'bar'),
    scrollCue: textOf(c, 'opening', 'scroll_cue'),
  };
}

// ─── Quote builder wording ──────────────────────────────────────────────────

export type QuoteStepId = (typeof QUOTE_STEP_IDS)[number];

export interface QuoteCopy {
  eyebrow: string;
  title: string;
  intro: string;
  emptyState: string;
  disclaimer: string;
  welcomeBack: string;
  requestButton: string;
  saveButton: string;
  steps: Record<QuoteStepId, { question: string; hint: string }>;
}

export function quoteView(c: SiteContent, vars: Record<string, string>): QuoteCopy {
  const steps = Object.fromEntries(
    QUOTE_STEP_IDS.map((id) => [id, {
      question: fillTokens(textOf(c, 'quote_steps', `${id}_question`), vars),
      hint: fillTokens(textOf(c, 'quote_steps', `${id}_hint`), vars),
    }]),
  ) as QuoteCopy['steps'];
  const t = (f: string) => fillTokens(textOf(c, 'quote_intro', f), vars);
  return {
    eyebrow: t('eyebrow'),
    title: t('title'),
    intro: t('intro'),
    emptyState: t('empty_state'),
    disclaimer: t('disclaimer'),
    welcomeBack: t('welcome_back'),
    requestButton: t('request_button'),
    saveButton: t('save_button'),
    steps,
  };
}
