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
import { anyVendorConfig, editorOrigins, fetchSiteV1 } from './anyvendor.ts';
import { getDraftContent, mergeRemote } from './index.ts';
import { focusOf, openingView, quoteView } from './views.ts';
import { BUNDLED_HOME, MARKED_LIST_KEYS, MOVABLE_SECTIONS, NEW_HOME_SECTION_KEYS, homeSeed, homeView, pictureSrc, shiftedLists, MEDIA_BUCKET } from './new-home.ts';
import { createHash } from 'node:crypto';
import { PRICES } from '../lib/quote/prices.ts';
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

// ─── The commissioned homepage (/new) ────────────────────────────────────────

const home = () => homeView(mergeRemote(TBP_MANIFEST, clone(C), C));

test('/new: rendering the seed through the adapter gives exactly the page the code ships', () => {
  assert.deepEqual(homeView(C), BUNDLED_HOME);
  // …and it survives the journey to AnyVendor and back (cleaning, then merging).
  assert.deepEqual(homeView(normaliseByManifest(TBP_MANIFEST, C)), BUNDLED_HOME);
  assert.deepEqual(home(), BUNDLED_HOME);
  assert.deepEqual(homeSeed(BUNDLED_HOME), Object.fromEntries(NEW_HOME_SECTION_KEYS.map((k) => [k, C[k]])));
});

test('/new: sections can be hidden, reordered, removed and added back; header and footer stay put', () => {
  const view = (chapters: unknown, menu: Record<string, string> = {}) =>
    homeView(mergeRemote(TBP_MANIFEST, { ...clone(C), page: { chapters }, nh_menu: { ...clone(C.nh_menu), ...menu } } as SiteContent, C));
  const edit = (chapters: unknown) => view(chapters).sections.map((s) => s.id);
  assert.deepEqual(edit(C.page.chapters), ['home', ...MOVABLE_SECTIONS, 'contact']);
  // The list has the shape AnyVendor's editor treats as chapters: one choice per row and a visible switch.
  const field = TBP_MANIFEST.sections.find((s) => s.key === 'page')?.fields.find((f) => f.key === 'chapters');
  assert.deepEqual(field?.fields?.map((f) => [f.key, f.type]), [['chapter', 'select'], ['visible', 'boolean']]);
  assert.deepEqual(field?.fields?.[0].options, [...MOVABLE_SECTIONS]);
  assert.equal(field?.max, MOVABLE_SECTIONS.length);
  // Reorder and rename.
  const moved = view([{ chapter: 'weddings', visible: true }, { chapter: 'corporate', visible: true }], { weddings_label: 'Wedding bars', corporate_label: '' });
  assert.deepEqual(moved.sections.map((s) => [s.id, s.label]), [['home', 'Home'], ['weddings', 'Wedding bars'], ['corporate', 'Corporate'], ['contact', 'Contact']]);
  // Every movable section is still known to the editing preview: listed ones first, the rest hidden.
  assert.deepEqual(moved.chapters.map((c) => c.id).sort(), [...MOVABLE_SECTIONS].sort());
  assert.deepEqual(moved.chapters.slice(0, 2).map((c) => [c.id, c.visible]), [['weddings', true], ['corporate', true]]);
  assert.ok(moved.chapters.slice(2).every((c) => !c.visible));
  // Hidden rows stay off the page; unknown and repeated sections are ignored.
  assert.deepEqual(edit([{ chapter: 'christmas', visible: false }, { chapter: 'gallery', visible: true },
    { chapter: 'gallery', visible: true }, { chapter: 'made_up', visible: true }, { chapter: 'home', visible: true }]), ['home', 'gallery', 'contact']);
  // Every section removed: the header film and the footer are still a page.
  assert.deepEqual(edit([]), ['home', 'contact']);
});

test('/new: edits show, and nothing an editor sends can blank or break the page', () => {
  const draft = clone(C);
  draft.nh_hero.headline = 'A new headline';
  draft.nh_corporate.title = '';
  (draft.nh_hero.slides as Record<string, FieldValue>[])[0].video_file = 'javascript:alert(1)';
  draft.nh_weddings.picture = { src: 'http://insecure.example/x.jpg', alt: 'x' };
  (draft.nh_team.cards as Record<string, FieldValue>[]).push({ kind: 'video', picture: { src: '', alt: '' }, video_file: '/videos/new-home/feed-4-blue.mp4' });
  draft.nh_footer.contacts = [];
  const h = homeView(mergeRemote(TBP_MANIFEST, draft, C));
  assert.equal(h.hero.headline, 'A new headline');
  assert.equal(h.corporate.title, BUNDLED_HOME.corporate.title, 'a required heading falls back');
  assert.equal(h.hero.slides[0].kind, 'image', 'a film without a usable file is shown as its still');
  assert.deepEqual(h.weddings.image, BUNDLED_HOME.weddings.image, 'an unusable photo falls back');
  assert.equal(h.team.cards.length, BUNDLED_HOME.team.cards.length, 'a clip with no still is skipped');
  assert.deepEqual(h.footer.contacts, BUNDLED_HOME.footer.contacts);
  // Rubbish in, a whole page out.
  for (const junk of [{}, { page: 7, nh_hero: [] }, { nh_hero: { slides: [{ kind: 'video' }] } }]) {
    const page = homeView(mergeRemote(TBP_MANIFEST, junk as SiteContent, C));
    assert.ok(page.hero.slides.length > 0 && page.sections.length >= 2 && page.hero.headline.length > 0);
  }
});

test('/new: no price is content. The party sticker has words only, and the amount comes from the price list', () => {
  for (const key of NEW_HOME_SECTION_KEYS) for (const v of walk(C[key])) if (typeof v === 'string') assert.doesNotMatch(v, /£|\bVAT\b/, v);
  assert.equal(BUNDLED_HOME.parties.stickerLabel, 'Bars from');
  assert.equal(PRICES.barOneSection, 21500);
  const text = readFileSync('src/components/new-home/HomeDocument.tsx', 'utf8');
  assert.match(text, /PRICES\.barOneSection/);
});

test('/new: the page reads its content through the adapter, and no section still imports page copy', () => {
  assert.match(readFileSync('src/app/new/page.tsx', 'utf8'), /<HomeDocument loaded=\{await getSiteContent\(\)\} \/>/);
  assert.match(readFileSync('src/components/new-home/HomeDocument.tsx', 'utf8'), /homeView\(loaded\.content\)/);
  const copy = /\b(HERO_COPY|HERO_SLIDES|CHRISTMAS|CORPORATE|WEDDINGS|PARTIES|TEAM|TEAM_FEED|MARQUEE|FEED|INSTAGRAM|HOW_IT_WORKS|CONTACTS|SOCIALS|CLIENT_LOGOS|SECTIONS)\b[^;]*from '\.\.?\/data'/;
  for (const f of readdirSync('src/components/new-home', { recursive: true }) as string[]) {
    if (!/\.tsx$/.test(f) || f.startsWith('builder') || f.startsWith('package')) continue;
    const src = readFileSync(join('src/components/new-home', f), 'utf8');
    for (const line of src.split('\n')) if (line.startsWith('import')) assert.doesNotMatch(line, copy, `${f} still imports page copy: ${line}`);
  }
});

// ─── The editing preview (/preview) and AnyVendor's editor link ──────────────

const ROOT = 'src/components/new-home';
const homeSources = () => (readdirSync(ROOT, { recursive: true }) as string[])
  .filter((f) => /\.tsx$/.test(f) && !f.startsWith('builder') && !f.startsWith('package'))
  .map((f) => [f, readFileSync(join(ROOT, f), 'utf8')] as const);
const fieldOf = (path: string) => {
  const [section, field, , sub] = path.split('.');
  const f = TBP_MANIFEST.sections.find((s) => s.key === section)?.fields.find((x) => x.key === field);
  return sub === undefined ? f : f?.type === 'list' ? f.fields?.find((x) => x.key === sub) : undefined;
};

test('editor marks: every mark on the page is a text or picture field this manifest declares', () => {
  const LIVE = ['text', 'textarea', 'richtext', 'image'];
  const marks = new Set<string>();
  for (const [, src] of homeSources()) {
    for (const m of src.matchAll(/\bav\('([a-z0-9_.]+)'\)/g)) marks.add(m[1]);
    for (const m of src.matchAll(/\bfield="([a-z0-9_]+\.[a-z0-9_]+)"/g)) marks.add(m[1]);
    for (const m of src.matchAll(/\bavRow\('([a-z0-9_.]+)', [a-z0-9 +]+, '([a-z0-9_]+)'\)/g)) marks.add(`${m[1]}.0.${m[2]}`);
    for (const m of src.matchAll(/\blist="([a-z0-9_.]+)" field="([a-z0-9_]+)"/g)) marks.add(`${m[1]}.0.${m[2]}`);
    for (const m of src.matchAll(/field=\{`([a-z0-9_.]+)\.\$\{i\}\.([a-z0-9_]+)`\}/g)) marks.add(`${m[1]}.0.${m[2]}`);
    // Marks built from a section or topic name: every value they can take.
    if (/av\(`nh_menu\.\$\{l\.id\}_label`\)/.test(src)) for (const id of MOVABLE_SECTIONS) marks.add(`nh_menu.${id}_label`);
    if (/av\(`nh_how\.\$\{topic\}_label`\)/.test(src)) for (const t of ['corporate', 'weddings', 'parties']) { marks.add(`nh_how.${t}_label`); marks.add(`nh_how.${t}_included.0.item`); }
  }
  assert.ok(marks.size >= 70, `only ${marks.size} marks found`);
  const FIELD = /^[a-z][a-z0-9_]{0,39}\.[a-z][a-z0-9_]{0,39}(\.\d{1,2}\.[a-z][a-z0-9_]{0,39})?$/; // the bridge's own test
  for (const m of marks) {
    assert.match(m, FIELD, m);
    const f = fieldOf(m);
    assert.ok(f, `${m} is not in the manifest`);
    assert.ok(LIVE.includes(f.type), `${m} is a ${f.type} field: the editor never sends those live`);
    // A marked list must be one the page checks for skipped rows.
    if (m.split('.').length === 4) assert.ok(MARKED_LIST_KEYS.includes(m.split('.').slice(0, 2).join('.')), `${m}: list not in MARKED_LISTS`);
  }
  // Nothing outside the commissioned page is bound, and no price, link or builder field is.
  for (const m of marks) assert.match(m, /^(nh_[a-z]+)\./, m);
  // No template mark was missed by the scan above.
  for (const [f, src] of homeSources()) {
    const templated = [...src.matchAll(/av(?:Row)?\(`[^`]*`/g)].map((x) => x[0]);
    for (const t of templated) assert.match(t, /nh_menu\.\$\{l\.id\}_label|nh_how\.\$\{topic\}_label/, `${f}: unchecked mark ${t}`);
  }
});

test('editor marks: a list where the page skipped a row loses its marks, so a live edit cannot land on the wrong row', () => {
  assert.deepEqual(shiftedLists(C, homeView(C)), []);
  const draft = clone(C);
  (draft.nh_corporate.steps as Record<string, FieldValue>[])[0].title = '';
  (draft.nh_gallery.cards as Record<string, FieldValue>[])[1].picture = { src: '', alt: '' };
  const cleaned = mergeRemote(TBP_MANIFEST, draft, C);
  assert.deepEqual(shiftedLists(cleaned, homeView(cleaned)).sort(), ['nh_corporate.steps', 'nh_gallery.cards']);
});

test("editor link: AnyVendor's bridge script is installed unchanged, and only the draft page can start it", () => {
  const hash = createHash('sha256').update(readFileSync('public/anyvendor-bridge.js')).digest('hex');
  assert.equal(hash, '0a4f34338806c9e2604135165182280346f7a342c19d017278d3b909dd1f43df', 'public/anyvendor-bridge.js differs from the file AnyVendor supplied');
  const users = ['src/app', 'src/components'].flatMap((dir) => (readdirSync(dir, { recursive: true }) as string[]).map((f) => join(dir, f)))
    .filter((f) => /\.tsx?$/.test(f) && /anyvendor-bridge\.js|AnyVendorBridge/.test(readFileSync(f, 'utf8')));
  assert.deepEqual(users, ['src/components/new-home/HomePage.tsx']);
  // Only /preview passes the switch that loads it; /new never does.
  assert.doesNotMatch(readFileSync('src/app/new/page.tsx', 'utf8'), /edit=/);
  const preview = readFileSync('src/app/preview/page.tsx', 'utf8');
  assert.match(preview, /if \(!isPreviewToken\(token\)\) notFound\(\);/);
  assert.match(preview, /if \(!loaded\) notFound\(\);/);
  assert.match(preview, /avEdit === '1' && origins\.length > 0 && cfg/);
  // The token never reaches the browser's scripts: it is not a prop of anything rendered.
  assert.doesNotMatch(preview, /token=\{|token\}/);
  // The anyOS live-edit script is not on the draft page; it is still on every other page.
  const anyos = readFileSync('src/components/AnyOsLiveEdit.tsx', 'utf8');
  assert.match(anyos, /\(new\|preview\)/);
  assert.match(anyos, /platform\.anyos\.co\.uk\/edit\.js/);
  assert.match(readFileSync('src/app/layout.tsx', 'utf8'), /<AnyOsLiveEdit \/>/);
});

test('editor link: off by default; only exact https editor origins are ever allowed', () => {
  assert.deepEqual(editorOrigins({}), []);
  assert.deepEqual(editorOrigins({ ANYVENDOR_EDITOR_ORIGINS: 'https://platform.anyvendor.co.uk' }), ['https://platform.anyvendor.co.uk']);
  assert.deepEqual(editorOrigins({ ANYVENDOR_EDITOR_ORIGINS: [
    '*', 'https://*.anyvendor.co.uk', 'http://platform.anyvendor.co.uk', 'https://platform.anyvendor.co.uk:8443', 'https://platform.anyvendor.co.uk/path',
    'https://user:pw@platform.anyvendor.co.uk', 'https://localhost', "https://a.b 'unsafe-inline'", ' https://platform.anyvendor.co.uk ', 'https://platform.anyvendor.co.uk',
  ].join(',') }), ['https://platform.anyvendor.co.uk']);
});

test('draft page: strict. A draft is shown only when AnyVendor serves that token\'s draft for this site', async () => {
  const env = { ANYVENDOR_CONTENT_ORIGIN: 'https://anyvendor.co.uk', ANYVENDOR_SITE_SLUG: 'the-bar-people' };
  assert.deepEqual(anyVendorConfig(env), { base: 'https://anyvendor.co.uk', slug: 'the-bar-people' });
  const token = '3f2b6c1e-8a44-4f0b-9c1d-2e5a7b9c0d11';
  const body = (mode: string, slug = 'the-bar-people') => ({ schema: 'anyvendor.site/v1', mode, business: { name: 'x', slug }, kind: 'bespoke', manifestVersion: 1, revision: 'r9', content: clone(C) });
  const calls: { url: string; init: RequestInit }[] = [];
  const reply = (status: number, json: unknown) => (async (url: string, init: RequestInit) => { calls.push({ url, init }); return new Response(JSON.stringify(json), { status }); }) as never;
  const ok = await getDraftContent(token, { env, fetch: reply(200, body('draft')) });
  assert.equal(ok?.source, 'draft');
  assert.equal(calls[0].url, `https://anyvendor.co.uk/api/sites/the-bar-people/content?preview=${token}`);
  assert.equal(calls[0].init.cache, 'no-store');
  // No fallback to published or bundled content, whatever goes wrong.
  assert.equal(await getDraftContent(token, { env, fetch: reply(404, { error: 'not_found' }) }), null);
  assert.equal(await getDraftContent(token, { env, fetch: reply(200, body('published')) }), null);
  assert.equal(await getDraftContent(token, { env, fetch: reply(200, body('draft', 'tl-executive-cars')) }), null);
  assert.equal(await getDraftContent(token, { env: {}, fetch: reply(200, body('draft')) }), null);
  const before = calls.length;
  assert.equal(await getDraftContent('not-a-token', { env, fetch: reply(200, body('draft')) }), null);
  assert.equal(await getDraftContent(`${token}&x=1`, { env, fetch: reply(200, body('draft')) }), null);
  assert.equal(calls.length, before, 'a malformed token is never sent anywhere');
});

test('draft page headers: framed by listed editor origins only, never cached, indexed or referred', async () => {
  process.env.ANYVENDOR_EDITOR_ORIGINS = "https://platform.anyvendor.co.uk, https://evil.example/x, *";
  const config = (await import('../../next.config.ts')).default;
  delete process.env.ANYVENDOR_EDITOR_ORIGINS;
  const rules = await config.headers!();
  assert.deepEqual(rules.map((r) => r.source), ['/preview'], 'no other page is made frameable');
  const h = Object.fromEntries(rules[0].headers.map((x) => [x.key, x.value]));
  assert.equal(h['Content-Security-Policy'], "frame-ancestors 'self' https://platform.anyvendor.co.uk");
  assert.match(h['Cache-Control'], /no-store/);
  assert.equal(h['Referrer-Policy'], 'no-referrer');
  assert.match(h['X-Robots-Tag'], /noindex/);
  assert.equal(rules[0].headers.some((x) => x.key.toLowerCase() === 'x-frame-options'), false);
});

test('pictures: only this site\'s files or AnyVendor\'s media bucket; anything else is treated as missing', () => {
  const ok = `${MEDIA_BUCKET}the-bar-people/hero.jpg`;
  assert.equal(pictureSrc(ok), ok);
  assert.equal(pictureSrc('/images/new-home/christmas.jpg'), '/images/new-home/christmas.jpg');
  for (const bad of ['https://example.com/a.jpg', 'https://rsqgsnfyusqhtgcwbddc.supabase.co/storage/v1/object/public/other/a.jpg', `${MEDIA_BUCKET}../secret.jpg`,
    `${MEDIA_BUCKET}a.jpg?x=1`, '//evil.example/a.jpg', 'http://x/a.jpg', 'data:image/png;base64,AA', '']) assert.equal(pictureSrc(bad), '', bad);
  // The optimiser's allow-list (next.config.ts) is the same bucket.
  const cfg = readFileSync('next.config.ts', 'utf8');
  const u = new URL(MEDIA_BUCKET);
  assert.ok(cfg.includes(`hostname: "${u.hostname}"`) && cfg.includes(`pathname: "${u.pathname}**"`));
  // A draft with a picture hosted elsewhere still renders: that picture falls back or is skipped.
  const draft = clone(C);
  draft.nh_christmas.picture = { src: 'https://example.com/a.jpg', alt: 'x' };
  (draft.nh_gallery.cards as Record<string, FieldValue>[])[0].picture = { src: 'https://example.com/b.jpg', alt: 'x' };
  const h = homeView(mergeRemote(TBP_MANIFEST, draft, C));
  assert.deepEqual(h.christmas.image, BUNDLED_HOME.christmas.image);
  assert.equal(h.gallery.cards.length, BUNDLED_HOME.gallery.cards.length - 1);
});
