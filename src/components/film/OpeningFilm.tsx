'use client';

// SCENE 1 → SCENE 2 — the homepage opening, from real photos only.
//
// The shirt (roundel in silver — a hand recolour preview of a real photo)
// holds for a moment; as you scroll, a soft white band crosses the frame like
// the bartender's sleeve passing the lens, and behind it the camera settles
// on the genuine white bar with the copper tray. Directly after this comes
// Section Two, "Build your party quote".
//
// Native scroll, no hijacking. Everything is driven by scroll position, so
// scrolling back plays it backwards. With reduced motion there is no sticky
// stage or sweep: the two real photos simply sit one after the other.

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowDown } from 'lucide-react';
import { HERO_COPY, IMG } from './scenes';

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function OpeningFilm({ silver = true }: { silver?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const shirt = silver ? IMG.shirtPourSilver : IMG.shirtPour;

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const set = (k: string, v: number) => stage.style.setProperty(k, v.toFixed(4));
    const update = () => {
      frame = 0;
      if (reduce.matches) {
        set('--w', 0); set('--band', 0); set('--copy', 1); set('--settle', 1); set('--next', 0);
        return;
      }
      const r = track.getBoundingClientRect();
      const span = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / span));
      const w = smooth(0.1, 0.72, p);
      set('--w', w);
      set('--band', Math.sin(Math.PI * w));
      set('--copy', 1 - smooth(0.03, 0.28, p));
      set('--settle', smooth(0.4, 1, p));
      set('--next', smooth(0.66, 0.96, p));
    };
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    reduce.addEventListener('change', update);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      reduce.removeEventListener('change', update);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div ref={trackRef} className="relative h-[170svh] motion-reduce:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 h-[100svh] min-h-[560px] overflow-hidden bg-ink text-ivory motion-reduce:relative"
          style={{ ['--w' as string]: 0, ['--band' as string]: 0, ['--copy' as string]: 1, ['--settle' as string]: 0, ['--next' as string]: 0 }}
        >
          {/* Scene 2, waiting underneath: the genuine white bar */}
          <div className="absolute inset-0 motion-reduce:hidden" style={{ transform: 'scale(calc(1.09 - 0.09 * var(--settle)))' }}>
            <Image src={IMG.counterCopper.src} alt={IMG.counterCopper.alt} fill sizes="100vw"
              className="object-cover [object-position:58%_60%] md:[object-position:50%_62%]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,19,17,0.55)_0%,rgba(21,19,17,0)_40%,rgba(21,19,17,0)_70%,rgba(21,19,17,0.55)_100%)]" />
          </div>

          {/* Scene 1: the shirt */}
          <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 calc(var(--w) * 100%))' }}>
            <Image src={shirt.src} alt={shirt.alt} fill loading="eager" fetchPriority="high" sizes="100vw"
              className="object-cover [object-position:93%_38%] md:[object-position:78%_30%]" />
            <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,19,17,0.86)_0%,rgba(21,19,17,0.4)_38%,rgba(21,19,17,0.05)_58%,rgba(21,19,17,0.8)_100%)] md:bg-[linear-gradient(90deg,rgba(21,19,17,0.9)_0%,rgba(21,19,17,0.62)_32%,rgba(21,19,17,0.08)_60%,rgba(21,19,17,0)_100%)]" />
          </div>

          {/* The sleeve crossing the lens — a soft white band, not an image */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-[-10%] w-[52%] motion-reduce:hidden"
            style={{
              left: 'calc(var(--w) * 100% - 26%)',
              opacity: 'var(--band)',
              background: 'linear-gradient(90deg, rgba(244,242,238,0) 0%, rgba(244,242,238,0.9) 34%, rgba(250,249,246,0.98) 52%, rgba(236,233,227,0.9) 70%, rgba(244,242,238,0) 100%)',
              filter: 'blur(10px)',
            }}
          />

          {/* Site header */}
          <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-5 pt-5 md:px-12 md:pt-8">
            <a href="#" className="flex items-center gap-3 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ivory">
              <Image src="/images/logos/bar-people-logo.png" alt="" width={48} height={48} className="h-10 w-10 md:h-12 md:w-12" />
              <span className="font-heading text-[19px] tracking-wide md:text-[22px]">The Bar People</span>
            </a>
            <a href="#build-your-quote"
              className="hidden rounded-full border border-ivory/45 px-5 py-2.5 text-[14px] font-semibold transition hover:bg-ivory hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory sm:inline-flex">
              Get a quote
            </a>
          </header>

          {/* Real typography */}
          <div
            className="absolute inset-0 z-10 flex flex-col justify-between px-5 pb-[max(2.75rem,calc(env(safe-area-inset-bottom)+1.5rem))] pt-[96px] md:justify-center md:px-12 md:pb-16 md:pt-24"
            style={{ opacity: 'var(--copy)', transform: 'translateY(calc((1 - var(--copy)) * -28px))' }}
          >
            <div className="max-w-[35rem]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-brass md:text-[12px]">{HERO_COPY.eyebrow}</p>
              <h1 className="mt-4 font-heading text-[40px] leading-[1.03] sm:text-[48px] md:text-[64px] xl:text-[76px]">{HERO_COPY.title}</h1>
              <p className="mt-4 text-[17px] leading-relaxed text-ivory/85 md:mt-5 md:text-[20px]">{HERO_COPY.sub}</p>
            </div>
            <div className="md:mt-10">
              <a href="#build-your-quote"
                className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ivory px-7 text-[16px] font-semibold text-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink sm:w-auto">
                {HERO_COPY.cta} <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* As the bar settles, point gently to the quote */}
          <p aria-hidden="true" className="absolute inset-x-0 bottom-8 z-10 text-center text-[13px] font-semibold uppercase tracking-[0.24em] text-ivory motion-reduce:hidden"
            style={{ opacity: 'var(--next)' }}>
            Build your party quote ↓
          </p>

          {/* Honest labels */}
          <span className="pointer-events-none absolute bottom-[112px] right-3 z-10 max-w-[62%] rounded-sm bg-ink/75 px-2 py-1 text-right text-[11px] font-medium leading-tight text-ivory/90 md:bottom-4 md:right-4 md:max-w-[70%]"
            style={{ opacity: 'calc(1 - var(--w))' }}>
            {silver ? 'Real photo · roundel recoloured to silver by hand (preview)' : 'Real photo · roundel as stitched today'}
          </span>
          <span className="pointer-events-none absolute bottom-[112px] left-3 z-10 rounded-sm bg-ink/75 px-2 py-1 text-[11px] font-medium text-ivory/90 motion-reduce:hidden md:bottom-14 md:left-auto md:right-4"
            style={{ opacity: 'var(--w)' }}>
            Real photo · the bar
          </span>
        </div>
      </div>

      {/* Reduced motion: the bar as a calm still, between the shirt and the quote */}
      <div className="relative hidden h-[42svh] min-h-[260px] overflow-hidden bg-ink motion-reduce:block">
        <Image src={IMG.counterCopper.src} alt={IMG.counterCopper.alt} fill sizes="100vw"
          className="object-cover [object-position:58%_60%] md:[object-position:50%_62%]" />
      </div>
    </>
  );
}
