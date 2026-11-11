'use client';

// Full-screen hero: photos and a short film crossfade on their own.
// No left/right arrows by design. The thin line under the active slide is its
// clock: when the line fills, the next slide comes in. Pausable, and still for
// reduced motion. It is the first one-screen section of the page: on phones
// the photo flexes to whatever height the white quote sheet leaves it.

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HomeContent } from '@/content/new-home';
import { BUILD_HREF, type HeroSlide } from './data';
import { nhFocus } from './SiteHeader';
import { av, avRow } from './av';

const IMAGE_SECONDS = 6.5;

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

// Below the md breakpoint the hero is a tall frame, so the film has an upright cut.
const phoneQuery = '(max-width: 767px)';
const subscribePhone = (cb: () => void) => {
  const m = window.matchMedia(phoneQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getPhone = () => window.matchMedia(phoneQuery).matches;

// False on the server and while the page is waking up in the browser. Until
// then we don't know which cut of the film this screen wants, so none is asked for.
const subscribeNever = () => () => {};
const useAwake = () => useSyncExternalStore(subscribeNever, () => true, () => false);

type VideoSlide = Extract<HeroSlide, { kind: 'video' }>;

/**
 * The film. Nothing is downloaded until its turn is next; then it loads, and
 * it plays once from the top each time its slide comes round. With reduced
 * motion it never plays: the poster stands in as a photo.
 */
function SlideVideo({ slide, active, near, playing, loop }: { slide: VideoSlide; active: boolean; near: boolean; playing: boolean; loop: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const awake = useAwake();
  const phone = useSyncExternalStore(subscribePhone, getPhone, () => false);
  const file = phone && slide.phone ? slide.phone : slide;

  // Start fetching one slide early, so the film is ready when it fades in.
  useEffect(() => {
    const v = ref.current;
    if (!v || !awake || !(near || active)) return;
    if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); }
  }, [awake, near, active, file.src]);

  // Each time the slide comes round, the film starts from the top.
  useEffect(() => {
    const v = ref.current;
    if (active && v && v.currentTime > 0) v.currentTime = 0;
  }, [active]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (playing && awake) void v.play().catch(() => {});
    else v.pause();
  }, [playing, awake, file.src]);

  return (
    <video
      ref={ref}
      src={awake ? file.src : undefined}
      poster={file.poster}
      muted
      loop={loop}
      playsInline
      preload="none"
      aria-label={slide.alt}
      className="h-full w-full object-cover [object-position:var(--fp)] md:[object-position:var(--fd)]"
    />
  );
}

export default function HeroSlider({ data: HERO_COPY }: { data: HomeContent['hero'] }) {
  const slides = HERO_COPY.slides;
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  const advance = () => {
    setLeaving(index);
    setIndex((index + 1) % slides.length);
  };
  const current = slides[index];
  const seconds = current.kind === 'video' ? current.seconds : IMAGE_SECONDS;
  const hasVideo = slides.some((s) => s.kind === 'video');
  // A film on its own is the whole header: it loops, and there is no slide clock.
  const solo = slides.length === 1;

  return (
    <section id="home" data-snap aria-label="Welcome" className={cn('nh-section flex flex-col bg-white', paused && 'nh-paused')}>
      <div className="nh-hero-photo relative min-h-0 flex-1 overflow-hidden bg-nh-ink">
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.src}
              aria-hidden={!active}
              className={cn('absolute inset-0 transition-opacity duration-[1400ms] ease-out', active ? 'opacity-100' : 'opacity-0')}
              style={{ '--fp': s.focus.phone, '--fd': s.focus.desktop } as CSSProperties}
            >
              <div className={cn('absolute inset-0', s.kind === 'image' && (active || i === leaving) && !reduced && 'nh-kb')}>
                {s.kind === 'image' ? (
                  <Image
                    src={s.src}
                    alt={active ? s.alt : ''}
                    fill
                    sizes="100vw"
                    preload={i === 0}
                    className="object-cover [object-position:var(--fp)] md:[object-position:var(--fd)]"
                    {...avRow('nh_hero.slides', i, 'picture')}
                  />
                ) : (
                  <SlideVideo
                    slide={s}
                    active={active}
                    near={solo || (index + 1) % slides.length === i}
                    loop={solo}
                    // Keeps running while it fades out, so it never freezes on screen.
                    playing={(active || i === leaving) && !reduced && !paused}
                  />
                )}
              </div>
            </div>
          );
        })}

        {/* Scrims keep the words readable on any photo. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/25 md:bg-black/35" />
        <div aria-hidden className="absolute inset-0 hidden bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_65%)] md:block" />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-[78px] text-white sm:px-6 md:inset-0 md:flex md:flex-col md:items-center md:justify-center md:px-6 md:pb-0 md:text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/85 md:text-[13px]" {...av('nh_hero.eyebrow')}>{HERO_COPY.eyebrow}</p>
          <h1 {...av('nh_hero.headline')} className="nh-hero-title mt-3 max-w-[13ch] font-extrabold leading-[1.02] tracking-[-0.025em] md:mt-5 md:max-w-[15ch]">
            {HERO_COPY.headline}
          </h1>
          <p className="mt-[clamp(14px,2.6dvh,24px)] hidden max-w-[50ch] text-[18px] leading-relaxed text-white/85 md:block" {...av('nh_hero.sub')}>{HERO_COPY.sub}</p>
          <div className="mt-[clamp(18px,4dvh,36px)] hidden flex-col items-center gap-3 md:flex">
            <a
              href={BUILD_HREF}
              className={cn(
                'group inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[17px] font-semibold text-nh-ink shadow-[0_10px_40px_rgba(0,0,0,0.25)] transition hover:bg-white/90',
                nhFocus,
              )}
            >
              <span {...av('nh_hero.cta_label')}>{HERO_COPY.cta}</span>
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden />
            </a>
            <p className="text-[13px] text-white/75" {...av('nh_hero.small')}>{HERO_COPY.small}</p>
          </div>
        </div>

        {/* Slide clock: thin lines, no arrows. */}
        <div className="absolute bottom-9 left-5 flex items-center gap-3 sm:left-6 md:bottom-[clamp(16px,3.5dvh,32px)] md:left-1/2 md:-translate-x-1/2">
          <div className={cn('items-center gap-1.5', solo ? 'hidden' : 'flex')} aria-hidden>
            {slides.map((s, i) => (
              <span key={s.src} className="relative h-[3px] w-7 overflow-hidden rounded-full bg-white/30 md:w-10">
                {i < index && <span className="absolute inset-0 bg-white/90" />}
                {i === index && (
                  <span
                    key={index}
                    className="nh-progress absolute inset-0 bg-white"
                    style={{ '--nh-slide': `${seconds}s` } as CSSProperties}
                    onAnimationEnd={solo ? undefined : advance}
                  />
                )}
              </span>
            ))}
          </div>
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className={cn('flex items-center justify-center rounded-full text-white/80 transition hover:text-white', solo ? 'h-10 w-10 bg-black/30 backdrop-blur-sm' : 'h-7 w-7', nhFocus)}
              aria-label={solo ? (paused ? 'Play the film' : 'Pause the film') : hasVideo ? (paused ? 'Play the slideshow' : 'Pause the slideshow') : paused ? 'Play the photos' : 'Pause the photos'}
            >
              {paused ? <Play className="h-3.5 w-3.5" aria-hidden /> : <Pause className="h-3.5 w-3.5" aria-hidden />}
            </button>
          )}
        </div>
      </div>

      {/* Phone: the quote starts in a white sheet under the photo. */}
      <div className="relative z-10 -mt-6 shrink-0 rounded-t-[28px] bg-white px-5 pb-6 pt-6 sm:px-6 md:hidden">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-nh-ash" {...av('nh_hero.sheet_eyebrow')}>{HERO_COPY.sheetEyebrow}</p>
        <h2 className="mt-2 text-[28px] font-extrabold leading-tight tracking-[-0.02em]" {...av('nh_hero.sheet_title')}>{HERO_COPY.sheetTitle}</h2>
        <p className="mt-2 text-[15px] leading-relaxed text-nh-ash" {...av('nh_hero.sub')}>{HERO_COPY.sub}</p>
        <a
          href={BUILD_HREF}
          className="mt-5 flex h-14 items-center justify-between rounded-full bg-nh-ink pl-6 pr-2 text-[17px] font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2"
        >
          <span {...av('nh_hero.cta_label')}>{HERO_COPY.cta}</span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-nh-ink">
            <ArrowRight className="h-5 w-5" aria-hidden />
          </span>
        </a>
        <p className="mt-3 text-center text-[13px] text-nh-ash" {...av('nh_hero.small')}>{HERO_COPY.small}</p>
      </div>
    </section>
  );
}
