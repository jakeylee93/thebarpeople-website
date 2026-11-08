'use client';

// A swipeable strip of real event photos. Tap one and it opens large in a
// modal: arrows, keyboard and swipe move through them, Esc closes.

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GALLERY } from './data';

const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2';
const ringDark = 'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

export default function GalleryCarousel() {
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const swipeX = useRef<number | null>(null);
  const n = GALLERY.length;

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open !== null && !d.open) d.showModal();
    if (open === null && d.open) d.close();
  }, [open]);

  const show = (i: number) => setOpen(((i % n) + n) % n);
  const close = () => {
    setOpen(null);
    openerRef.current?.focus();
  };
  const scrollStrip = (dir: 1 | -1) => {
    const t = trackRef.current;
    if (t) t.scrollBy({ left: dir * t.clientWidth * 0.8, behavior: 'smooth' });
  };

  const item = open !== null ? GALLERY[open] : null;

  return (
    <section aria-labelledby="gallery-title" className="bg-white py-16 md:py-24">
      <div className="mx-auto flex max-w-[1440px] items-end justify-between gap-6 px-5 sm:px-6 lg:px-10">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-nh-ash">Our events</p>
          <h2 id="gallery-title" className="mt-2 text-[34px] font-extrabold leading-[1.05] tracking-[-0.02em] md:text-[52px]">
            Real bars, real parties
          </h2>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <button type="button" onClick={() => scrollStrip(-1)} aria-label="Scroll photos left"
            className={cn('flex h-12 w-12 items-center justify-center rounded-full border border-nh-line transition hover:border-nh-ink', ring)}>
            <ArrowLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={() => scrollStrip(1)} aria-label="Scroll photos right"
            className={cn('flex h-12 w-12 items-center justify-center rounded-full border border-nh-line transition hover:border-nh-ink', ring)}>
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      <ul ref={trackRef} className="nh-scroll-x mt-8 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 pb-2 sm:scroll-px-6 sm:px-6 md:mt-10 md:gap-4 lg:scroll-px-10 lg:px-10">
        {GALLERY.map((g, i) => (
          <li key={g.src} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[31vw] lg:w-[23vw] xl:w-[19vw]">
            <button
              type="button"
              onClick={(e) => { openerRef.current = e.currentTarget; show(i); }}
              className={cn('group block w-full rounded-[18px] text-left', ring)}
              aria-label={`Open photo: ${g.caption}`}
            >
              <span className="relative block aspect-[4/5] overflow-hidden rounded-[18px] bg-nh-mist">
                <Image src={g.src} alt="" fill sizes="(min-width: 1280px) 19vw, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, (min-width: 640px) 44vw, 72vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.04]" />
              </span>
              <span className="mt-3 block text-[14px] font-semibold">{g.caption}</span>
              <span className="block text-[13px] text-nh-ash">{g.category}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mx-auto mt-8 max-w-[1440px] px-5 sm:px-6 lg:px-10">
        <Link href="/gallery" className={cn('inline-flex items-center gap-2 rounded text-[15px] font-semibold underline decoration-nh-ink/30 underline-offset-4 hover:decoration-nh-ink', ring)}>
          See the full gallery <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
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
              <button type="button" onClick={close} autoFocus aria-label="Close photo"
                className={cn('flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20', ringDark)}>
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image key={item.src} src={item.src} alt={item.caption} fill sizes="100vw" className="nh-pop select-none object-contain" draggable={false} />
              <button type="button" onClick={() => show(open - 1)} aria-label="Previous photo"
                className={cn('absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex', ringDark)}>
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button type="button" onClick={() => show(open + 1)} aria-label="Next photo"
                className={cn('absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20 sm:flex', ringDark)}>
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </div>
            <div className="px-4 pb-6 pt-4 text-center sm:px-6">
              <p className="text-[16px] font-semibold">{item.caption}</p>
              <p className="text-[13px] text-white/60">{item.category} · swipe or use the arrows</p>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
