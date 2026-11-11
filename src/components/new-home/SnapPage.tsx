'use client';

// The page shell: one full-height box that scrolls and snaps, a section at a
// time, on phones and desktops alike. Because the document itself never
// scrolls, a few things the browser would normally do are done here:
//   1. keyboard paging (PageDown, Space, arrows, Home, End) moves one section;
//   2. links to a section (#weddings) and the dots scroll this box smoothly;
//   3. one click of a mouse wheel moves one section;
//   4. the dots and the header follow the section that is showing.

import { useEffect, useRef, useState } from 'react';
import SiteHeader from './SiteHeader';
import type { HomeContent } from '@/content/new-home';
import { SCROLLER_ID } from './data';

/** Matches the fallback in home.css: too short to snap, so the page scrolls freely. */
const TOO_SHORT = '(max-height: 539px)';
const REDUCED = '(prefers-reduced-motion: reduce)';

export default function SnapPage({ sections: SECTIONS, contacts, cta, children }: {
  /** The sections on the page, in order (content decides which and in what order). */
  sections: HomeContent['sections']; contacts: HomeContent['footer']['contacts']; cta: string; children: React.ReactNode;
}) {
  const LAST = SECTIONS.length - 1;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /** Where a keyboard, wheel or dot scroll is heading, so quick repeats add up. */
  const heading = useRef<{ index: number; timer: number } | null>(null);
  /** The run of wheel events in progress: when the last one came, whether the run
   *  is a mouse wheel's clicks, and until when further clicks are ignored. */
  const wheel = useRef({ last: 0, clicks: false, quietUntil: 0 });

  const behavior = (): ScrollBehavior => (window.matchMedia(REDUCED).matches ? 'instant' : 'smooth');

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    const el = document.getElementById(SECTIONS[index].id);
    if (!scroller || !el) return;
    const top = index === LAST
      ? scroller.scrollHeight - scroller.clientHeight
      : el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    if (heading.current) window.clearTimeout(heading.current.timer);
    heading.current = { index, timer: window.setTimeout(() => { heading.current = null; }, 900) };
    scroller.scrollTo({ top, behavior: behavior() });
  };

  /** The section whose top is nearest the top of the screen. */
  const nearest = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return 0;
    if (scroller.scrollTop >= scroller.scrollHeight - scroller.clientHeight - 2) return LAST;
    const box = scroller.getBoundingClientRect().top;
    let best = 0, gap = Infinity;
    SECTIONS.forEach((s, i) => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const d = Math.abs(el.getBoundingClientRect().top - box);
      if (d < gap) { best = i; gap = d; }
    });
    return best;
  };

  const step = (by: number) => {
    const from = heading.current?.index ?? nearest();
    goTo(Math.max(0, Math.min(LAST, from + by)));
  };

  // Follow the showing section, and let each section's content fade in once.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => el !== null);

    // Sections already on screen are marked seen before anything is hidden, so
    // nothing visible blinks. These are plain DOM attributes (not React state)
    // so the server-rendered sections never have to re-render.
    const screen = scroller.clientHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < screen * 0.75 && r.bottom > screen * 0.25) el.dataset.seen = '';
    }
    scroller.dataset.ready = '';

    // Lazy photos are fetched as they near the screen, which in Safari is too
    // late for a page that snaps: start the next section's photos as soon as
    // its neighbour is showing. (Only what would be on screen, not the whole
    // gallery strip.)
    const warm = (el?: HTMLElement) => {
      el?.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
        const r = img.getBoundingClientRect();
        if (r.right > 0 && r.left < window.innerWidth) img.loading = 'eager';
      });
    };

    const shown = new Map<Element, number>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        shown.set(e.target, e.intersectionRatio);
        if (e.intersectionRatio >= 0.35) (e.target as HTMLElement).dataset.seen = '';
      }
      // The section showing most of itself wins; the short footer wins once it is fully in.
      let best = 0, most = -1;
      els.forEach((el, i) => {
        const ratio = shown.get(el) ?? 0;
        if (ratio > most) { best = i; most = ratio; }
      });
      setActive(best);
      warm(els[best + 1]);
    }, { root: scroller, threshold: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [SECTIONS]);

  // Keyboard paging, mouse wheel and in-page links.
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const tooShort = window.matchMedia(TOO_SHORT);

    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      // An open dialog (menu, builder, photo viewer, How it works) owns the keyboard.
      if (document.querySelector('dialog[open]')) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      // Space and the arrows already mean something on a button or link.
      const onControl = Boolean(target?.closest('a[href], button, summary, [role="button"], video'));
      // On a screen too short to snap, sections are taller than the screen: page by distance instead.
      const page = (by: number) => (tooShort.matches ? scroller.scrollBy({ top: by * scroller.clientHeight * 0.85, behavior: behavior() }) : step(by));
      const line = (by: number) => (tooShort.matches ? scroller.scrollBy({ top: by * 80, behavior: behavior() }) : step(by));
      switch (e.key) {
        case 'PageDown': page(1); break;
        case 'PageUp': page(-1); break;
        case 'Home': goTo(0); break;
        case 'End': goTo(LAST); break;
        case ' ': if (onControl) return; page(e.shiftKey ? -1 : 1); break;
        case 'ArrowDown': if (onControl) return; line(1); break;
        case 'ArrowUp': if (onControl) return; line(-1); break;
        default: return;
      }
      e.preventDefault();
    };

    // One click of a mouse wheel is about 100px, and the browser's snapping
    // springs back from that, so a wheel felt stuck. Take each click as "next
    // section" (a spin of several clicks still moves one). Trackpads and touch
    // are left alone: they scroll by the pixel and already snap well.
    // Telling them apart: a wheel reports whole clicks (wheelDelta in 120s, or
    // lines in Firefox) from the first event of a run; a trackpad run starts
    // with a few pixels, and only by chance lands on a 120 later.
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || tooShort.matches || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const legacy = (e as WheelEvent & { wheelDeltaY?: number }).wheelDeltaY;
      const click = e.deltaMode === WheelEvent.DOM_DELTA_LINE || (typeof legacy === 'number' && legacy !== 0 && legacy % 120 === 0);
      const run = wheel.current;
      const newRun = e.timeStamp - run.last > 150;
      run.last = e.timeStamp;
      if (newRun) run.clicks = click;
      else if (!click) run.clicks = false;
      if (!run.clicks) return;
      e.preventDefault();
      if (e.timeStamp < run.quietUntil) return;
      run.quietUntil = e.timeStamp + 450;
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
      const id = link?.getAttribute('href')?.slice(1);
      const index = SECTIONS.findIndex((s) => s.id === id);
      if (index < 0) return; // #build and friends belong to the builder
      e.preventDefault();
      goTo(index);
    };

    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    scroller.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
      scroller.removeEventListener('wheel', onWheel);
    };
  });

  return (
    <>
      <SiteHeader activeId={SECTIONS[Math.min(active, LAST)].id} sections={SECTIONS} contacts={contacts} cta={cta} />
      <div ref={scrollerRef} id={SCROLLER_ID} className="nh-snap">
        {children}
      </div>

      <nav aria-label="Sections" data-tone={SECTIONS[Math.min(active, LAST)].tone} className="nh-dots fixed right-1.5 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <ul>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.label}`}
                aria-current={i === active ? 'true' : undefined}
                className="relative flex h-[26px] w-7 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                <span className="nh-dot" />
                <span className="nh-dot-label" aria-hidden>{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
