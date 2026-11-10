'use client';

// The gallery, laid out like an Instagram grid: same-shape cards, no titles,
// and the videos play by themselves (silently, and only while on screen). It
// always fits one screen. Tap a card and it opens large: arrows, keyboard and
// swipe move through them, Esc closes.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEED, INSTAGRAM, type FeedItem } from './data';

const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2';
const ringDark = 'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

/** A silent, looping clip. Nothing is fetched until `play` is first true. */
function Clip({ item, play }: { item: Extract<FeedItem, { kind: 'video' }>; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) void v.play().catch(() => {});
    else v.pause();
  }, [play]);
  return <video ref={ref} src={item.src} poster={item.poster} muted loop playsInline preload="none" aria-label={item.alt} className="h-full w-full object-cover" />;
}

export default function GalleryCarousel() {
  const [open, setOpen] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const swipeX = useRef<number | null>(null);
  const n = FEED.length;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = (i: number) => setOpen(((i % n) + n) % n);
  const close = () => {
    setOpen(null);
    openerRef.current?.focus();
  };
  const item = open !== null ? FEED[open] : null;
  const playing = inView && !reduced && open === null;

  return (
    <section id="gallery" data-snap aria-labelledby="gallery-title" className="nh-section bg-nh-mist text-nh-ink">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-[var(--nh-gutter)] pb-[clamp(12px,2.6dvh,36px)] pt-[calc(var(--nh-head)+clamp(12px,2.6dvh,36px))]">
        <div className="flex shrink-0 items-end justify-between gap-4">
          <div>
            <p data-reveal="1" className="nh-eyebrow text-nh-ash">On Instagram</p>
            <h2 id="gallery-title" data-reveal="2" className="nh-title mt-1.5 max-sm:!text-[26px] lg:mt-3">{INSTAGRAM.handle}</h2>
          </div>
          <a
            data-reveal="2"
            href={INSTAGRAM.href}
            target="_blank"
            rel="noreferrer"
            className={cn('inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-nh-ink px-5 text-[15px] font-semibold text-white hover:bg-black', ring)}
          >
            Follow <ArrowRight className="h-4 w-4" aria-hidden />
            <span className="sr-only">The Bar People on Instagram (opens in a new tab)</span>
          </a>
        </div>

        {/* The grid takes whatever room is left; each card sizes itself from that (.nh-feed in home.css). */}
        <div data-reveal="3" className="nh-media nh-media-tall nh-fit mt-[clamp(10px,2.2dvh,28px)] min-h-0 flex-1">
          <ul ref={gridRef} className="nh-feed">
            {FEED.map((g, i) => (
              <li key={g.src} className="nh-feed-card">
                <button
                  type="button"
                  onClick={(e) => { openerRef.current = e.currentTarget; show(i); }}
                  className={cn('group relative block h-full w-full overflow-hidden rounded-[10px] bg-nh-line lg:rounded-[16px]', ring)}
                  aria-label={`Open ${g.kind === 'video' ? 'video' : 'photo'}: ${g.alt}`}
                >
                  {g.kind === 'image' ? (
                    <Image src={g.src} alt="" fill sizes="(min-width: 1024px) 16vw, 33vw" className="object-cover transition duration-500 group-hover:scale-[1.04]" />
                  ) : (
                    <>
                      <Clip item={g} play={playing} />
                      <span aria-hidden className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white lg:right-2.5 lg:top-2.5">
                        <Play className="h-3 w-3 fill-current" />
                      </span>
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => { if (open !== null) close(); }}
        aria-label="Photo viewer"
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-black p-0 text-white backdrop:bg-black"
        onKeyDown={(e) => {
          if (open === null) return;
          if (e.key === 'ArrowRight') { e.preventDefault(); show(open + 1); }
          if (e.key === 'ArrowLeft') { e.preventDefault(); show(open - 1); }
        }}
      >
        {item && open !== null && (
          <div
            className="flex h-full flex-col"
            onPointerDown={(e) => { swipeX.current = e.clientX; }}
            onPointerUp={(e) => {
              const start = swipeX.current; swipeX.current = null;
              if (start === null) return;
              const dx = e.clientX - start;
              if (Math.abs(dx) > 50) show(open + (dx < 0 ? 1 : -1));
            }}
          >
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
              <p className="text-[14px] tabular-nums text-white/70" aria-live="polite">{open + 1} / {n}</p>
              <button type="button" onClick={close} autoFocus aria-label="Close"
                className={cn('flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20', ringDark)}>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="relative min-h-0 flex-1 pb-6">
              {item.kind === 'image' ? (
                <Image key={item.src} src={item.src} alt={item.alt} fill sizes="100vw" className="nh-pop select-none object-contain" draggable={false} />
              ) : (
                <video key={item.src} src={item.src} poster={item.poster} muted loop playsInline autoPlay={!reduced} controls={reduced} aria-label={item.alt} className="nh-pop absolute inset-0 h-full w-full object-contain" />
              )}
              <button type="button" onClick={() => show(open - 1)} aria-label="Previous"
                className={cn('absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex', ringDark)}>
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button type="button" onClick={() => show(open + 1)} aria-label="Next"
                className={cn('absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex', ringDark)}>
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
