'use client';

// Full-screen hero: photos (or, later, Jake's videos) crossfade on their own.
// No left/right arrows by design. The thin line under the active slide is its
// clock: when the line fills, the next slide comes in. Pausable, and still for
// reduced motion. It is the first one-screen section of the page: on phones
// the photo flexes to whatever height the white quote sheet leaves it.

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUILD_HREF, HERO_COPY, type HeroSlide } from './data';
import { nhFocus } from './SiteHeader';

const IMAGE_SECONDS = 6.5;
const VIDEO_SECONDS = 10;

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

function SlideVideo({ slide, active, reduced }: { slide: Extract<HeroSlide, { kind: 'video' }>; active: boolean; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && !reduced) void v.play().catch(() => {});
    else v.pause();
  }, [active, reduced]);
  return (
    <video
      ref={ref}
      src={slide.src}
      poster={slide.poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={slide.alt}
      className="h-full w-full object-cover [object-position:var(--fp)] md:[object-position:var(--fd)]"
    />
  );
}

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  const advance = () => {
    setLeaving(index);
    setIndex((index + 1) % slides.length);
  };
  const current = slides[index];
  const seconds = current.kind === 'video' ? VIDEO_SECONDS : IMAGE_SECONDS;

  return (
    <section id="home" data-snap aria-label="Welcome" className={cn('nh-section flex flex-col bg-white', paused && 'nh-paused')}>
      <div className="nh-media relative min-h-0 flex-1 overflow-hidden bg-nh-ink">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.src}
              aria-hidden={!active}
              className={cn('absolute inset-0 transition-opacity duration-[1400ms] ease-out', active ? 'opacity-100' : 'opacity-0')}
              style={{ '--fp': s.focus.phone, '--fd': s.focus.desktop } as CSSProperties}
            >
              <div className={cn('absolute inset-0', (active || i === leaving) && !reduced && 'nh-kb')}>
                {s.kind === 'image' ? (
                  <Image
                    src={s.src}
                    alt={active ? s.alt : ''}
                    fill
                    sizes="100vw"
                    preload={i === 0}
                    className="object-cover [object-position:var(--fp)] md:[object-position:var(--fd)]"
                  />
                ) : (
                  <SlideVideo slide={s} active={active} reduced={reduced} />
                )}
              </div>
            </div>
          );
        })}

        {/* Scrims keep the words readable on any photo. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25 md:bg-black/35" />
        <div aria-hidden className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_65%)] md:block" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-[78px] text-white sm:px-6 md:inset-0 md:flex md:flex-col md:items-center md:justify-center md:px-6 md:pb-0 md:text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 md:text-[13px]">{HERO_COPY.eyebrow}</p>
          <h1 className="nh-hero-title mt-3 max-w-[13ch] font-extrabold leading-[1.02] tracking-[-0.025em] md:mt-5 md:max-w-[15ch]">
            {HERO_COPY.headline}
          </h1>
          <p className="mt-[clamp(14px,2.6dvh,24px)] hidden max-w-[50ch] text-[18px] leading-relaxed text-white/85 md:block">{HERO_COPY.sub}</p>
          <div className="mt-[clamp(18px,4dvh,36px)] hidden flex-col items-center gap-3 md:flex">
            <a
              href={BUILD_HREF}
              className={cn(
                'group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[17px] font-semibold text-nh-ink shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition hover:bg-white/90',
                nhFocus,
              )}
            >
              {HERO_COPY.cta}
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden />
            </a>
            <p className="text-[13px] text-white/75">{HERO_COPY.small}</p>
          </div>
        </div>

        {/* Slide clock: thin lines, no arrows. */}
        <div className="absolute bottom-9 left-5 flex items-center gap-3 sm:left-6 md:bottom-[clamp(16px,3.5dvh,32px)] md:left-1/2 md:-translate-x-1/2">
          <div className="flex items-center gap-1.5" aria-hidden>
            {slides.map((s, i) => (
              <span key={s.src} className="relative h-[3px] w-7 overflow-hidden rounded-full bg-white/30 md:w-10">
                {i < index && <span className="absolute inset-0 bg-white/90" />}
                {i === index && (
                  <span
                    key={index}
                    className="nh-progress absolute inset-0 bg-white"
                    style={{ '--nh-slide': `${seconds}s` } as CSSProperties}
                    onAnimationEnd={advance}
                  />
                )}
              </span>
            ))}
          </div>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className={cn('flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition hover:text-white', nhFocus)}
              aria-label={paused ? 'Play the photos' : 'Pause the photos'}
            >
              {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            </button>
          )}
        </div>
      </div>

      {/* Phone: the quote starts in a white sheet under the photo. */}
      <div className="relative z-10 -mt-6 shrink-0 rounded-t-[28px] bg-white px-5 pb-6 pt-6 sm:px-6 md:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-nh-ash">Instant quote</p>
        <h2 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.02em]">Get an instant quote</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-nh-ash">{HERO_COPY.sub}</p>
        <a
          href={BUILD_HREF}
          className="mt-5 flex h-14 items-center justify-between rounded-full bg-nh-ink pl-6 pr-2 text-[17px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2"
        >
          {HERO_COPY.cta}
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-nh-ink">
            <ArrowRight className="h-5 w-5" aria-hidden />
          </span>
        </a>
        <p className="mt-3 text-center text-[13px] text-nh-ash">{HERO_COPY.small}</p>
      </div>
    </section>
  );
}
