// The site's side of anyvendor.bridge/v1, run for real: AnyVendor's own script
// (public/anyvendor-bridge.js, unchanged) against a stand-in page. The browser
// round trip is checked separately; this pins the safety rules.
// Run with: pnpm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const SOURCE = readFileSync('public/anyvendor-bridge.js', 'utf8');
const SCHEMA = 'anyvendor.bridge/v1';
const SLUG = 'the-bar-people';
const EDITOR = 'https://platform.anyvendor.co.uk';
const NONCE = 'n0nce_ABCDEFGH-12345';

class El {
  attrs: Record<string, string> = {};
  textContent = '';
  tagName: string;
  scrolled = false;
  constructor(tag: string, attrs: Record<string, string> = {}, text = '') { this.tagName = tag; this.attrs = { ...attrs }; this.textContent = text; }
  getAttribute(k: string) { return k in this.attrs ? this.attrs[k] : null; }
  setAttribute(k: string, v: string) { this.attrs[k] = String(v); }
  removeAttribute(k: string) { delete this.attrs[k]; }
  closest(sel: string) { const attr = /\[([a-z-]+)\]/.exec(sel)?.[1] ?? ''; return attr in this.attrs && (!sel.startsWith('a') || this.tagName === 'A') ? this : null; }
  scrollIntoView() { this.scrolled = true; }
}

function page(opts: { search?: string; framed?: boolean } = {}) {
  const els = [
    new El('H1', { 'data-av-field': 'nh_hero.headline' }, 'Saved headline'),
    new El('IMG', { 'data-av-field': 'nh_weddings.picture', src: '/images/a.jpg', srcset: 'x 1x', sizes: '100vw', alt: 'Saved' }),
    new El('SPAN', { 'data-av-field': 'nh_corporate.steps.1.title' }, 'Step'),
    new El('SPAN', { 'data-av-field': 'Not A Field' }, 'ignored'),
    new El('DIV', { 'data-av-chapter': 'weddings' }),
    new El('DIV', { 'data-av-chapter': 'gallery' }),
  ];
  const sent: { msg: Record<string, unknown>; to: string }[] = [];
  const listeners: Record<string, ((ev: unknown) => void)[]> = {};
  const docListeners: Record<string, ((ev: unknown) => void)[]> = {};
  const parent = { postMessage: (msg: Record<string, unknown>, to: string) => { sent.push({ msg, to }); } };
  let reloads = 0;
  const window: Record<string, unknown> = {
    location: { search: opts.search ?? '?token=3f2b6c1e-8a44-4f0b-9c1d-2e5a7b9c0d11&av_edit=1', reload: () => { reloads += 1; } },
    addEventListener: (type: string, fn: (ev: unknown) => void) => { (listeners[type] ??= []).push(fn); },
    setTimeout: () => 0,
    matchMedia: () => ({ matches: true }),
    document: {
      querySelectorAll: (sel: string) => { const attr = /\[([a-z-]+)\]/.exec(sel)?.[1] ?? ''; return els.filter((e) => attr in e.attrs); },
      createElement: (tag: string) => new El(tag.toUpperCase()),
      head: { appendChild: () => {} },
      addEventListener: (type: string, fn: (ev: unknown) => void) => { (docListeners[type] ??= []).push(fn); },
    },
  };
  window.parent = opts.framed === false ? window : parent;
  vm.runInNewContext(SOURCE, { window, URLSearchParams });
  const bridge = window.AnyVendorBridge as { start(o: unknown): boolean; schema: string };
  const post = (data: unknown, origin = EDITOR, source: unknown = parent) => { for (const fn of listeners.message ?? []) fn({ data, origin, source }); };
  const msg = (type: string, body: Record<string, unknown> = {}) => ({ schema: SCHEMA, slug: SLUG, type, ...body });
  return { els, sent, bridge, post, msg, parent, docListeners, reloads: () => reloads };
}
const OPTIONS = { slug: SLUG, origins: [EDITOR], capabilities: { text: true, image: true, chapters: true } };

test('bridge: it only starts inside a frame, with av_edit=1, a valid slug and an exact https origin', () => {
  assert.equal(page().bridge.schema, SCHEMA);
  assert.equal(page({ framed: false }).bridge.start(OPTIONS), false);
  assert.equal(page({ search: '?token=3f2b6c1e-8a44-4f0b-9c1d-2e5a7b9c0d11' }).bridge.start(OPTIONS), false);
  assert.equal(page({ search: '?av_edit=true' }).bridge.start(OPTIONS), false);
  assert.equal(page().bridge.start({ ...OPTIONS, slug: 'The Bar People' }), false);
  for (const bad of ['*', 'https://*.anyvendor.co.uk', 'http://platform.anyvendor.co.uk', 'https://platform.anyvendor.co.uk:444', 'https://platform.anyvendor.co.uk/', 'null'])
    assert.equal(page().bridge.start({ ...OPTIONS, origins: [bad] }), false, bad);
  assert.equal(page().bridge.start({ ...OPTIONS, origins: [] }), false, 'no origin switched on: the link stays off');
  assert.equal(page().bridge.start(OPTIONS), true);
});

test('bridge: silent until a listed editor says hello; wrong origin, window, slug, schema or nonce get no reply', () => {
  const p = page();
  p.bridge.start(OPTIONS);
  p.post(p.msg('hello', { nonce: NONCE }), 'https://evil.example');
  p.post(p.msg('hello', { nonce: NONCE }), EDITOR, {});
  p.post({ ...p.msg('hello', { nonce: NONCE }), slug: 'tl-executive-cars' });
  p.post({ ...p.msg('hello', { nonce: NONCE }), schema: 'anyvendor.bridge/v2' });
  p.post(p.msg('hello', { nonce: 'short' }));
  p.post(p.msg('hello', { nonce: `${NONCE}<script>` }));
  p.post(p.msg('set', { field: 'nh_hero.headline', value: 'Before the handshake' }));
  p.post('hello');
  assert.equal(p.sent.length, 0);
  assert.equal(p.els[0].textContent, 'Saved headline');
  assert.equal(p.docListeners.click, undefined, 'the page behaves normally until the handshake');
});

test('bridge: ready echoes the nonce to the exact origin, lists only well-formed marks, and carries no token or address', () => {
  const p = page();
  p.bridge.start(OPTIONS);
  p.post(p.msg('hello', { nonce: NONCE }));
  assert.equal(p.sent.length, 1);
  assert.equal(p.sent[0].to, EDITOR);
  assert.deepEqual(JSON.parse(JSON.stringify(p.sent[0].msg)), {
    schema: SCHEMA, slug: SLUG, type: 'ready', nonce: NONCE,
    fields: ['nh_hero.headline', 'nh_weddings.picture', 'nh_corporate.steps.1.title'],
    chapters: ['weddings', 'gallery'],
    capabilities: { text: true, image: true, chapters: true },
  });
  assert.doesNotMatch(JSON.stringify(p.sent), /3f2b6c1e|token|http:|localhost|\/preview/);
  assert.ok(p.sent.every((s) => s.to !== '*'));
});

test('bridge: unsaved text is written as text, pictures are re-checked, and nothing outside the marks is touched', () => {
  const p = page();
  p.bridge.start(OPTIONS);
  p.post(p.msg('hello', { nonce: NONCE }));
  p.post(p.msg('set', { field: 'nh_hero.headline', value: '<img src=x onerror=alert(1)>Hi' }));
  assert.equal(p.els[0].textContent, '<img src=x onerror=alert(1)>Hi', 'text, never HTML');
  p.post(p.msg('set', { field: 'nh_hero.headline', value: { src: '/x.jpg', alt: '' } }));
  assert.equal(p.els[0].textContent, '<img src=x onerror=alert(1)>Hi', 'a picture value never lands on a text element');
  for (const src of ['javascript:alert(1)', 'data:image/png;base64,AAAA', 'blob:https://x/y', '//evil.example/x.jpg', 'http://insecure.example/x.jpg'])
    p.post(p.msg('set', { field: 'nh_weddings.picture', value: { src, alt: 'Bad' } }));
  assert.equal(p.els[1].attrs.src, '/images/a.jpg');
  p.post(p.msg('set', { field: 'nh_weddings.picture', value: { src: 'https://rsqgsnfyusqhtgcwbddc.supabase.co/storage/v1/object/public/website-media/a.jpg', alt: 'New' } }));
  assert.equal(p.els[1].attrs.src, 'https://rsqgsnfyusqhtgcwbddc.supabase.co/storage/v1/object/public/website-media/a.jpg');
  assert.equal(p.els[1].attrs.alt, 'New');
  assert.equal('srcset' in p.els[1].attrs, false);
  p.post(p.msg('set', { field: '../../etc', value: 'x' }));
  p.post(p.msg('set', { field: 'Not A Field', value: 'x' }));
  assert.equal(p.els[3].textContent, 'ignored');
  // Highlight, then clear.
  p.post(p.msg('highlight', { field: 'nh_corporate.steps.1.title' }));
  assert.ok('data-av-active' in p.els[2].attrs && p.els[2].scrolled);
  p.post(p.msg('highlight', { field: null }));
  assert.equal('data-av-active' in p.els[2].attrs, false);
});

test('bridge: chapters reach the page as a cleaned list; one editor per page load; unknown types do nothing', () => {
  const p = page();
  let got: unknown = null;
  p.bridge.start({ ...OPTIONS, onChapters: (rows: unknown) => { got = rows; } });
  p.post(p.msg('hello', { nonce: NONCE }));
  p.post(p.msg('chapters', { order: [
    { chapter: 'gallery', visible: true }, { chapter: 'weddings', visible: 'yes' }, { chapter: 'gallery', visible: false },
    { chapter: 'Bad Key', visible: true }, null, 'x',
  ] }));
  assert.deepEqual(JSON.parse(JSON.stringify(got)), [{ chapter: 'gallery', visible: true }, { chapter: 'weddings', visible: false }]);
  got = null;
  p.post(p.msg('chapters', { order: Array.from({ length: 41 }, (_, i) => ({ chapter: `c${i}`, visible: true })) }));
  assert.equal(got, null, 'an oversized list is dropped whole');
  p.post(p.msg('save', { content: {} }));
  p.post(p.msg('navigate', { href: 'https://evil.example' }));
  assert.equal(p.sent.length, 1);
  assert.equal(p.reloads(), 0);
  p.post(p.msg('reload'));
  assert.equal(p.reloads(), 1);
});

test('bridge: in the editor a click selects the field, links stay put and no form is sent', () => {
  const p = page();
  p.bridge.start(OPTIONS);
  p.post(p.msg('hello', { nonce: NONCE }));
  const ev = (target: El) => { const e = { target, prevented: false, stopped: false, preventDefault() { e.prevented = true; }, stopPropagation() { e.stopped = true; } }; return e; };
  const click = ev(p.els[0]);
  p.docListeners.click[0](click);
  assert.ok(click.prevented && click.stopped);
  assert.deepEqual(JSON.parse(JSON.stringify(p.sent[1])), { msg: { schema: SCHEMA, slug: SLUG, type: 'select', field: 'nh_hero.headline' }, to: EDITOR });
  const out = ev(new El('A', { href: 'https://wa.me/447557402200' }));
  p.docListeners.click[0](out);
  assert.ok(out.prevented, 'a link elsewhere does nothing in the editor');
  const inPage = ev(new El('A', { href: '#build' }));
  p.docListeners.click[0](inPage);
  assert.equal(inPage.prevented, false, 'same-page links still work');
  const submit = ev(new El('FORM'));
  p.docListeners.submit[0](submit);
  assert.ok(submit.prevented && submit.stopped, 'no enquiry can be sent from an editing session');
});
