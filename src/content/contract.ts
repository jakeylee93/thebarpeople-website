// AnyVendor site-content contract — LOCAL MIRROR of the v1 DRAFT.
//
// Shapes and cleaning rules mirror the draft `manifest.ts` the AnyVendor
// backend owner was writing on 3 Nov 2026 (version 1: sections of typed fields;
// the editor renders a form from the manifest; the site reads published content).
// It is NOT the official contract. When Codex hands over the versioned contract
// (endpoint, schema, auth, caching/revalidation), replace this file with it and
// keep the tests green. No endpoint, credential or write path lives here.

export type FieldType = 'text' | 'textarea' | 'richtext' | 'image' | 'link' | 'number' | 'boolean' | 'select' | 'list';

export interface Field {
  key: string;
  label?: string;
  type: FieldType;
  help?: string;
  max?: number;
  options?: string[];
  fields?: Field[];
  required?: boolean;
}

export interface Section {
  key: string;
  label?: string;
  help?: string;
  fields: Field[];
}

export interface Manifest {
  version: 1;
  name?: string;
  sections: Section[];
}

export type ImageValue = { src: string; alt: string };
export type LinkValue = { href: string; label: string };
export type ListRow = Record<string, FieldValue>;
export type FieldValue = string | number | boolean | ImageValue | LinkValue | ListRow[];
export type SiteContent = Record<string, Record<string, FieldValue>>;

export const KEY = /^[a-z][a-z0-9_]{0,39}$/;
const TYPES: FieldType[] = ['text', 'textarea', 'richtext', 'image', 'link', 'number', 'boolean', 'select', 'list'];
export const MAX_SECTIONS = 40;

/** Problems with a manifest (empty array means valid). Same rules as the draft. */
export function manifestProblems(m: Manifest): string[] {
  const out: string[] = [];
  if (m.version !== 1) out.push('version must be 1.');
  if (!Array.isArray(m.sections) || m.sections.length === 0) return [...out, 'sections must be a non-empty array.'];
  if (m.sections.length > MAX_SECTIONS) out.push(`At most ${MAX_SECTIONS} sections.`);
  const checkFields = (fields: Field[] | undefined, where: string, depth: number) => {
    if (!Array.isArray(fields) || fields.length === 0) { out.push(`${where}: fields must be a non-empty array.`); return; }
    const keys = new Set<string>();
    for (const f of fields) {
      if (!KEY.test(f.key)) out.push(`${where}: field key "${f.key}" must be lowercase letters, digits or _ (max 40).`);
      if (keys.has(f.key)) out.push(`${where}: duplicate field key "${f.key}".`);
      keys.add(f.key);
      if (!TYPES.includes(f.type)) out.push(`${where}.${f.key}: unknown type "${f.type}".`);
      if (f.type === 'select' && !f.options?.length) out.push(`${where}.${f.key}: select needs options.`);
      if (f.type === 'list') {
        if (depth >= 1) out.push(`${where}.${f.key}: lists cannot contain lists.`);
        else checkFields(f.fields, `${where}.${f.key}`, depth + 1);
      }
    }
  };
  const seen = new Set<string>();
  for (const s of m.sections) {
    if (!KEY.test(s.key)) out.push(`Section key "${s.key}" must be lowercase letters, digits or _.`);
    if (seen.has(s.key)) out.push(`Duplicate section key "${s.key}".`);
    seen.add(s.key);
    checkFields(s.fields, s.key, 0);
  }
  return out;
}

// ─── Cleaning (same as the draft) ───────────────────────────────────────────

const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : typeof v === 'number' ? String(v) : '');

/** Allowed URLs: https://…, site-relative /path, mailto:, tel:. Anything else becomes ''. */
export function safeUrl(v: unknown): string {
  const t = str(v, 1000);
  return /^https:\/\/[^\s]+$/.test(t) || /^\/[a-z0-9/_.-]*$/i.test(t) || /^mailto:[^\s]+$/.test(t) || /^tel:[+\d\s]+$/.test(t) ? t : '';
}

function cleanValue(f: Field, raw: unknown): FieldValue {
  switch (f.type) {
    case 'text': return str(raw, f.max ?? 200);
    case 'textarea': return str(raw, f.max ?? 2000);
    case 'richtext': return str(raw, f.max ?? 10000).replace(/<[^>]*>/g, '');
    case 'number': { const n = Number(raw); return Number.isFinite(n) ? n : 0; }
    case 'boolean': return raw === true || raw === 'true' || raw === 'on';
    case 'select': return f.options?.includes(String(raw)) ? String(raw) : (f.options?.[0] ?? '');
    case 'image': {
      const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
      const src = safeUrl(o.src);
      return { src, alt: src ? str(o.alt, 200) : '' };
    }
    case 'link': {
      const o = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
      return { href: safeUrl(o.href), label: str(o.label, 80) };
    }
    case 'list': {
      const items = Array.isArray(raw) ? raw : [];
      return items.slice(0, f.max ?? 24).map((it) => {
        const o = (it && typeof it === 'object' ? it : {}) as Record<string, unknown>;
        const row: ListRow = {};
        for (const sub of f.fields ?? []) row[sub.key] = cleanValue(sub, o[sub.key]);
        return row;
      }).filter((row) => Object.values(row).some((v) => (typeof v === 'object' && v ? Object.values(v as object).some(Boolean) : Boolean(v))));
    }
  }
}

/** Content cleaned against the manifest: unknown sections and fields are dropped. */
export function normaliseByManifest(manifest: Manifest, raw: unknown): SiteContent {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const out: SiteContent = {};
  for (const s of manifest.sections) {
    const sec = (r[s.key] && typeof r[s.key] === 'object' ? r[s.key] : {}) as Record<string, unknown>;
    out[s.key] = {};
    for (const f of s.fields) out[s.key][f.key] = cleanValue(f, sec[f.key]);
  }
  return out;
}

// ─── Site-side safety net (ours, not part of the draft) ─────────────────────

export function isEmptyValue(v: FieldValue | undefined): boolean {
  if (v === undefined || v === '') return true;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return !('src' in v ? v.src : v.href);
  return false;
}

/**
 * Required fields that arrive empty fall back to the bundled default, so a
 * missing headline or hero image can never blank the bespoke design. Optional
 * fields are left as the editor set them (an emptied list stays empty).
 */
export function withRequiredDefaults(manifest: Manifest, content: SiteContent, defaults: SiteContent): SiteContent {
  const out: SiteContent = {};
  for (const s of manifest.sections) {
    out[s.key] = { ...content[s.key] };
    for (const f of s.fields) {
      if (f.required && isEmptyValue(out[s.key][f.key])) out[s.key][f.key] = defaults[s.key]?.[f.key] ?? out[s.key][f.key];
    }
  }
  return out;
}
