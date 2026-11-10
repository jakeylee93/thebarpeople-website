'use client';

// The page shell: one full-height box that scrolls and snaps, a section at a
// time, on phones and desktops alike. Because the document itself never
// scrolls, three things the browser would normally do are done here:
//   1. keyboard paging (PageDown, Space, arrows, Home, End) moves one section;
//   2. links to a section (#weddings) and the dots scroll this box smoothly;
//   3. the dots and the header follow the section that is showing.

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import SiteHeader from './SiteHeader';
import { SCROLLER_ID, SECTIONS } from './data';

const LAST = SECTIONS.length - 1;

export default function SnapPage({ children }: { children: React.ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  /** Where a keyboard or dot scroll is heading, so quick repeat presses add up. */
  const heading = useRef<{ index: number; timer: number } | null>(null);

  const goTo = (index: number) => {
    const scroller = scrollerRef.current;
    const el = document.getElementById(SECTIONS[index].id);
    if (!scroller || !el) return;
    const top = index === LAST
      ? scroller.scrollHeight - scroller.clientHeight
      : el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (heading.current) window.clearTimeout(heading.current.timer);
    heading.current = { index, timer: window.setTimeout(() => { heading.current = null; }, 900) };
    scroller.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
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
    }, { root: scroller, threshold: [0, 0.2, 0.35, 0.5, 0.65, 0.8, 1] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Keyboard paging and in-page links.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      // An open dialog (menu, builder, photo viewer, How it works) owns the keyboard.
      if (document.querySelector('dialog[open]')) return;
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
      // Space and the arrows already mean something on a button or link.
      const onControl = Boolean(target?.closest('a[href], button, summary, [role="button"], video'));
      switch (e.key) {
        case 'PageDown': step(1); break;
        case 'PageUp': step(-1); break;
        case 'Home': goTo(0); break;
        case 'End': goTo(LAST); break;
        case ' ': if (onControl) return; step(e.shiftKey ? -1 : 1); break;
        case 'ArrowDown': if (onControl) return; step(1); break;
        case 'ArrowUp': if (onControl) return; step(-1); break;
        default: return;
      }
      e.preventDefault();
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
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  });

  return (
    <>
      <SiteHeader activeId={SECTIONS[active].id} />
      <div ref={scrollerRef} id={SCROLLER_ID} className="nh-snap">
        {children}
      </div>

      <nav aria-label="Sections" data-tone={SECTIONS[active].tone} className="nh-dots fixed right-1.5 top-1/2 z-30 hidden -translate-y-1/2 lg:block">
        <ul>
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to ${s.label}`}
                aria-current={i === active ? 'true' : undefined}
                className={cn(
                  'relative flex h-[26px] w-7 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-current',
                )}
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
