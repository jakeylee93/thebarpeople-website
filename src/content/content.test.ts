// Run with: pnpm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type { FieldValue, ImageValue, SiteContent } from './contract.ts';
import { isEmptyValue, manifestProblems, normaliseByManifest, safeUrl, withRequiredDefaults } from './contract.ts';
import { TBP_MANIFEST } from './manifest.ts';
import { ANYOS_LIVE_EDIT_MAP, TBP_DEFAULT_CONTENT } from './defaults.ts';
import { MEDIA } from './media.ts';
import { anyVendorConfig, fetchSiteV1 } from './anyvendor.ts';
import { mergeRemote } from './index.ts';
import { focusOf, openingView, quoteView } from './views.ts';
import { bars, brandLogos, brands, eventTypes, galleryImages, navLinks, services, testimonials } from '../lib/constants.ts';

const C = TBP_DEFAULT_CONTENT;
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function* walk(v: FieldValue | SiteContent | Record<string, FieldValue>): Generator<FieldValue> {
  if (Array.isArray(v)) for (const row of v) yield* walk(row);
  else if (v && typeof v === 'object') for (const x of Object.values(v)) yield* walk(x as FieldValue);
  else yield v as FieldValue;
}
function* images(v: unknown): Generator<ImageValue> {
  if (Array.isArray(v)) for (const x of v) yield* images(x);
  else if (v && typeof v === 'object') {
    if ('src' in v && 'alt' in v) yield v as ImageValue;
    else for (const x of Object.values(v)) yield* images(x);
  }
}

// ─── Manifest & seed ────────────────────────────────────────────────────────

test('the manifest passes the contract rules (keys, types, nesting, ≤ 40 sections)', () => {
  assert.deepEqual(manifestProblems(TBP_MANIFEST), []);
  assert.ok(JSON.stringify(TBP_MANIFEST).length < 200_000, 'AnyVendor caps a manifest at 200 KB');
});

test('the seed survives AnyVendor’s cleaning unchanged (nothing truncated, dropped or invalid)', () => {
  assert.deepEqual(normaliseByManifest(TBP_MANIFEST, C), C);
});

test('every required field has a seed value', () => {
  for (const s of TBP_MANIFEST.sections) {
    for (const f of s.fields) if (f.required) assert.ok(!isEmptyValue(C[s.key][f.key]), `${s.key}.${f.key} is required`);
  }
});

test('every picture exists, is registered with provenance, and nothing marked "avoid" is used', () => {
  const used = new Set<string>();
  for (const img of images(C)) {
    if (!img.src) continue;
    used.add(img.src);
    assert.ok(existsSync(join('public', img.src)), `missing file ${img.src}`);
    assert.ok(MEDIA[img.src], `not in the media registry: ${img.src}`);
    assert.notEqual(MEDIA[img.src].use, 'avoid', `${img.src} is marked avoid`);
    assert.ok(img.alt.length > 0, `alt text missing for ${img.src}`);
  }
  for (const src of Object.keys(MEDIA)) assert.ok(existsSync(join('public', src)), `registry points at a missing file ${src}`);
  assert.ok(used.size >= 30, `only ${used.size} pictures referenced`);
});

test('no prices, stock, availability or WhatsApp in AnyVendor content (those stay in anyOS)', () => {
  const keys: string[] = [];
  for (const s of TBP_MANIFEST.sections) for (const f of s.fields) { keys.push(f.key); for (const sub of f.fields ?? []) keys.push(sub.key); }
  for (const k of keys) assert.doesNotMatch(k, /price|cost|vat|stock|availab|whatsapp|deposit/, k);
  for (const v of walk(C)) if (typeof v === 'string') assert.ok(!v.includes('£'), `price in content: ${v}`);
});

// ─── anyOS live-edit keys are preserved ─────────────────────────────────────

test('every anyOS live-edit key in the site is mapped, and the seed keeps what anyOS serves today', () => {
  const keys = new Set<string>();
  for (const dir of ['src/app', 'src/components']) {
    for (const f of readdirSync(dir, { recursive: true }) as string[]) {
      if (!/\.(tsx?|jsx?)$/.test(f)) continue;
      for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/data-anyos="([^"]+)"/g)) keys.add(m[1]);
    }
  }
  assert.equal(keys.size, 17);
  for (const k of keys) assert.ok(ANYOS_LIVE_EDIT_MAP[k], `unmapped anyOS key ${k}`);
  for (const [k, { section, field, savedInAnyos }] of Object.entries(ANYOS_LIVE_EDIT_MAP)) {
    assert.ok(TBP_MANIFEST.sections.find((s) => s.key === section)?.fields.find((f) => f.key === field), `${k} → missing ${section}.${field}`);
    if (savedInAnyos !== undefined) assert.equal(C[section][field], savedInAnyos, `${k} must keep the anyOS value`);
  }
});

// ─── Seed matches today's code (no detached second copy) ────────────────────

const list = (section: string, field = 'items') => C[section][field] as Record<string, FieldValue>[];

test('services, bars, event types, gallery, testimonials, logos and menu match the current code', () => {
  assert.deepEqual(list('services').map((r) => [r.slug, r.name, r.tag, r.summary, r.features, (r.image as ImageValue).src]),
    services.map((s) => [s.slug, s.name, s.tag ?? '', s.description, s.features.join('\n'), s.image]));
  assert.deepEqual(list('bars').map((r) => [r.name, r.size, r.tag, r.summary, r.guests_note, (r.image as ImageValue).src]),
    bars.map((b) => [b.name, b.size, b.tag ?? '', b.description, b.guests, b.image]));
  assert.deepEqual(list('event_types').map((r) => [r.slug, r.name, r.summary, (r.image as ImageValue).src]),
    eventTypes.map((e) => [e.slug, e.name, e.description, e.image]));
  assert.deepEqual(list('gallery').map((r) => [(r.image as ImageValue).src, r.caption, r.category]),
    galleryImages.map((g) => [g.src, g.label, g.category]));
  assert.deepEqual(list('testimonials').map((r) => [r.quote, r.name, r.event]),
    testimonials.map((t) => [t.quote, t.name, t.event]));
  assert.deepEqual(list('brands', 'logos').map((r) => [r.name, (r.logo as ImageValue).src]), brandLogos.map((b) => [b.name, b.src]));
  assert.equal(C.brands.also_named, brands.join(', '));
  assert.deepEqual(list('navigation', 'links').map((r) => r.link), navLinks.map((l) => ({ href: l.href, label: l.label })));
});

const pageText = (file: string) => readFileSync(file, 'utf8').replace(/&apos;/g, "'").replace(/\s+/g, ' ');
const has = (file: string, s: string) => assert.ok(pageText(file).includes(s.replace(/\s+/g, ' ')), `"${s.slice(0, 60)}…" not found in ${file}`);

test('page copy in the seed is the copy the pages render today', () => {
  for (const [file, section, fields] of [
    ['src/app/about/page.tsx', 'about_page', ['eyebrow', 'title', 'image_caption', 'team_title', 'seo_description']],
    ['src/app/contact/page.tsx', 'contact_page', ['eyebrow', 'title', 'intro', 'general_title', 'form_button', 'success_title', 'success_text']],
    ['src/app/our-bars/page.tsx', 'our_bars_page', ['eyebrow', 'title', 'intro', 'seo_description']],
    ['src/app/gallery/page.tsx', 'gallery_page', ['eyebrow', 'title', 'intro']],
    ['src/app/privacy/page.tsx', 'privacy_page', ['eyebrow', 'title', 'intro', 'seo_description']],
    ['src/app/terms/page.tsx', 'terms_page', ['eyebrow', 'title', 'intro', 'seo_description']],
    ['src/components/CTASection.tsx', 'cta', ['eyebrow', 'title', 'subtitle']],
    ['src/components/ServicesSection.tsx', 'services_intro', ['eyebrow', 'title', 'subtitle']],
    ['src/components/BarsSection.tsx', 'bars_intro', ['eyebrow', 'title', 'subtitle']],
    ['src/components/TestimonialsSection.tsx', 'testimonials_intro', ['eyebrow', 'title']],
    ['src/app/layout.tsx', 'seo', ['default_title', 'title_template', 'description', 'keywords', 'share_title', 'share_description']],
  ] as const) {
    for (const f of fields) has(file, C[section][f] as string);
  }
  for (const p of (C.about_page.body as string).split('\n\n')) has('src/app/about/page.tsx', p);
  for (const section of ['privacy_page', 'terms_page'] as const) {
    const file = `src/app/${section.replace('_page', '')}/page.tsx`;
    for (const row of list(section, 'sections')) {
      has(file, row.heading as string);
      for (const p of (row.body as string).split('\n\n')) has(file, p);
    }
  }
  has('src/components/Footer.tsx', C.business.strapline as string);
  has('src/components/Hero.tsx', C.home_hero.eyebrow as string);
  for (const r of list('home_hero', 'stats')) { has('src/components/Hero.tsx', r.value as string); has('src/components/Hero.tsx', r.label as string); }
});

// ─── Server adapter (inert until configured; read-only) ─────────────────────

const ENV = { ANYVENDOR_API_URL: 'https://av.example', ANYVENDOR_SITE_SLUG: 'the-bar-people' };
const TOKEN = '0b9f2b8e-3c1d-4e5f-9a7b-1c2d3e4f5a6b';
const okBody = (mode: 'published' | 'draft', content: SiteContent) => ({
  schema: 'anyvendor.site/v1', mode, business: { name: 'The Bar People', slug: 'the-bar-people' }, kind: 'bespoke',
  manifestVersion: 1, manifest: TBP_MANIFEST, revision: mode === 'draft' ? 'draft-2' : 'rev-uuid', revisionVersion: 2, content,
});
const stub = (status: number, body: unknown, calls: { url: string; init: Record<string, unknown> }[] = []) =>
  (async (url: string, init?: Record<string, unknown>) => { calls.push({ url, init: init ?? {} }); return new Response(JSON.stringify(body), { status }); }) as never;

test('adapter is off unless an https origin and slug are set on the server', async () => {
  assert.equal(anyVendorConfig({}), null);
  assert.equal(anyVendorConfig({ ANYVENDOR_API_URL: 'http://av.example', ANYVENDOR_SITE_SLUG: 'the-bar-people' }), null);
  assert.equal(anyVendorConfig({ ANYVENDOR_API_URL: 'https://av.example/', ANYVENDOR_SITE_SLUG: 'The Bar People' }), null);
  assert.deepEqual(anyVendorConfig({ ...ENV, ANYVENDOR_API_URL: 'https://av.example/' }), { base: 'https://av.example', slug: 'the-bar-people' });
  let called = false;
  assert.equal(await fetchSiteV1(null, { env: {}, fetch: (async () => { called = true; return new Response('{}'); }) as never }), null);
  assert.equal(called, false, 'no request at all when not configured');
});

test('published read: GET only, cached 60s under the "anyvendor" tag, no bypass header', async () => {
  const calls: { url: string; init: Record<string, unknown> }[] = [];
  const r = await fetchSiteV1(null, { env: ENV, fetch: stub(200, okBody('published', C), calls) });
  assert.equal(r?.revision, 'rev-uuid');
  assert.equal(calls[0].url, 'https://av.example/api/sites/the-bar-people/content');
  assert.equal(calls[0].init.method, 'GET');
  assert.deepEqual(calls[0].init.next, { revalidate: 60, tags: ['anyvendor'] });
  assert.ok(!JSON.stringify(calls[0].init.headers).toLowerCase().includes('bypass'));
});

test('draft read only with a well-formed preview token, never cached', async () => {
  const calls: { url: string; init: Record<string, unknown> }[] = [];
  assert.equal(await fetchSiteV1('not-a-token', { env: ENV, fetch: stub(200, okBody('draft', C), calls) }), null);
  assert.equal(calls.length, 0);
  const r = await fetchSiteV1(TOKEN, { env: ENV, fetch: stub(200, okBody('draft', C), calls) });
  assert.equal(r?.mode, 'draft');
  assert.equal(calls[0].url, `https://av.example/api/sites/the-bar-people/content?preview=${TOKEN}`);
  assert.equal(calls[0].init.cache, 'no-store');
});

test('404, wrong schema, wrong slug, wrong mode or network failure all fall back (null)', async () => {
  assert.equal(await fetchSiteV1(null, { env: ENV, fetch: stub(404, { error: 'not_found' }) }), null);
  assert.equal(await fetchSiteV1(null, { env: ENV, fetch: stub(200, { ...okBody('published', C), schema: 'anyvendor.site/v2' }) }), null);
  assert.equal(await fetchSiteV1(null, { env: ENV, fetch: stub(200, { ...okBody('published', C), business: { slug: 'mr-tees-crazy-golf' } }) }), null);
  assert.equal(await fetchSiteV1(null, { env: ENV, fetch: stub(200, okBody('draft', C)) }), null);
  assert.equal(await fetchSiteV1(null, { env: ENV, fetch: (async () => { throw new Error('offline'); }) as never }), null);
});

test('remote content: edits apply, unknown fields drop, missing fields keep the seed, required blanks fall back', () => {
  const remote = clone(C) as SiteContent;
  remote.opening.headline = 'A new headline';
  remote.opening.subheadline = '';            // required → falls back
  remote.testimonials.items = [];             // optional list emptied → stays empty
  (remote.business as Record<string, FieldValue>).secret_field = 'x';
  delete (remote.cta as Record<string, FieldValue>).title;   // not sent → keeps the seed
  const merged = mergeRemote(TBP_MANIFEST, remote, C);
  assert.equal(merged.opening.headline, 'A new headline');
  assert.equal(merged.opening.subheadline, C.opening.subheadline);
  assert.deepEqual(merged.testimonials.items, []);
  assert.equal('secret_field' in merged.business, false);
  assert.equal(merged.cta.title, C.cta.title);
});

test('links and images only accept https, site paths, mailto: and tel:', () => {
  assert.equal(safeUrl('javascript:alert(1)'), '');
  assert.equal(safeUrl('http://insecure.example'), '');
  assert.equal(safeUrl('/images/film/shirt-pour.jpg'), '/images/film/shirt-pour.jpg');
  assert.equal(safeUrl('tel:+447557402200'), 'tel:+447557402200');
});

// ─── Views ──────────────────────────────────────────────────────────────────

test('views: opening copy, focus fallback and the staff rate filled from the catalogue', () => {
  const o = openingView(C);
  assert.equal(o.headline, 'Unforgettable events, unmatched service');
  assert.equal(o.shirt.focusPhone, '93% 38%');
  assert.equal(focusOf('url(x)'), '50% 50%');
  const q = quoteView(C, { staff_rate: '£28' });
  assert.equal(q.steps.staff.hint, '£28 per bartender per hour, plus VAT, for the hours of your party.');
  assert.equal(quoteView(C, {}).steps.staff.hint.startsWith('{staff_rate}'), true, 'unknown tokens stay visible');
  assert.deepEqual(withRequiredDefaults(TBP_MANIFEST, normaliseByManifest(TBP_MANIFEST, C), C), C);
});

// ─── Handoff files stay in step ─────────────────────────────────────────────

test('docs/anyvendor JSON handoff files match the code (run pnpm content:export)', () => {
  assert.deepEqual(JSON.parse(readFileSync('docs/anyvendor/the-bar-people.manifest.json', 'utf8')), JSON.parse(JSON.stringify(TBP_MANIFEST)));
  assert.deepEqual(JSON.parse(readFileSync('docs/anyvendor/the-bar-people.content.json', 'utf8')), JSON.parse(JSON.stringify(normaliseByManifest(TBP_MANIFEST, C))));
});

// ─── Publish webhook check (inert until a per-site secret is set) ───────────

test('revalidate check: off without a secret; needs the exact bearer and this site’s slug', async () => {
  const { checkRevalidate } = await import('./revalidate.ts');
  const env = { ANYVENDOR_REVALIDATE_SECRET: 'x'.repeat(32), ANYVENDOR_SITE_SLUG: 'the-bar-people' };
  assert.deepEqual(checkRevalidate('Bearer anything', { slug: 'the-bar-people' }, {}), { ok: false, status: 404, error: 'not_configured' });
  assert.equal(checkRevalidate('Bearer wrong', { slug: 'the-bar-people' }, env).ok, false);
  assert.equal(checkRevalidate(null, { slug: 'the-bar-people' }, env).ok, false);
  assert.deepEqual(checkRevalidate(`Bearer ${'x'.repeat(32)}`, { slug: 'floriography-studio' }, env), { ok: false, status: 400, error: 'wrong_site' });
  assert.deepEqual(checkRevalidate(`Bearer ${'x'.repeat(32)}`, { slug: 'the-bar-people', revision: 'r1' }, env), { ok: true, revision: 'r1' });
});
