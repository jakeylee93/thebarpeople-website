'use client';

// A tall card that plays short clips one after another, fading each into the
// next and looping the set. No sound, and it only runs while it is on screen.
// With no clips yet it fades through still photos instead, so the section is
// finished either way. Reduced motion: it starts paused on the first poster.

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Still, VideoClip } from './data';
import { ring } from './parts';

/** How long each still shows. */
const STILL_SECONDS = 4.5;
/** The next clip starts fading in this long before the current one ends. */
const OVERLAP_SECONDS = 0.9;

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

function Clip({
  clip, active, run, loop, onNearEnd, onProgress,
}: {
  clip: VideoClip;
  active: boolean;
  /** Playing right now: the showing clip, or the one fading out behind it. */
  run: boolean;
  loop: boolean;
  onNearEnd: () => void;
  onProgress: (fraction: number) => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  // Each time a clip comes round again it starts from the top.
  useEffect(() => {
    if (active && ref.current && ref.current.currentTime > 0) ref.current.currentTime = 0;
  }, [active]);

  // `active` is a dependency so a clip that was still running as it faded out
  // is started again when its turn comes back.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (run) void v.play().catch(() => {});
    else v.pause();
  }, [run, active]);

  return (
    <video
      ref={ref}
      src={clip.src}
      poster={clip.poster}
      muted
      playsInline
      loop={loop}
      preload="metadata"
      aria-label={active ? clip.alt : undefined}
      aria-hidden={!active || undefined}
      onTimeUpdate={(e) => {
        if (!active) return;
        const v = e.currentTarget;
        if (!Number.isFinite(v.duration) || v.duration <= 0) return;
        onProgress(v.currentTime / v.duration);
        if (!loop && v.duration - v.currentTime <= OVERLAP_SECONDS) onNearEnd();
      }}
      onEnded={() => { if (active) onNearEnd(); }}
      className="h-full w-full object-cover"
    />
  );
}

export default function VideoCard({
  clips,
  stills,
  className,
}: {
  clips: VideoClip[];
  /** Photos to fade through while there are no clips. */
  stills: Still[];
  className?: string;
}) {
  const hasClips = clips.length > 0;
  const count = hasClips ? clips.length : stills.length;
  const noun = hasClips ? 'video' : 'photos';

  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [inView, setInView] = useState(false);
  /** null until the visitor presses the button: then their choice wins. */
  const [choice, setChoice] = useState<'play' | 'pause' | null>(null);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const wantsPlay = choice ? choice === 'play' : !reduced;
  const playing = wantsPlay && inView;
  // Stills are timed by a CSS animation, which reduced motion switches off, so
  // there is nothing to play or pause then.
  const showClock = count > 1 && (hasClips || !reduced);
  const showButton = hasClips || showClock;

  const advance = () => {
    if (count < 2) return;
    setLeaving(index);
    setIndex((index + 1) % count);
  };

  return (
    <div
      ref={rootRef}
      className={cn(
        'relative isolate overflow-hidden rounded-[28px] bg-nh-ink shadow-[0_30px_80px_rgba(0,0,0,0.55)] ring-1 ring-white/15',
        !playing && 'nh-paused',
        className,
      )}
    >
      {hasClips
        ? clips.map((clip, i) => (
            <div key={clip.src} className={cn('absolute inset-0 transition-opacity duration-[900ms] ease-out', i === index ? 'opacity-100' : 'opacity-0')}>
              <Clip
                clip={clip}
                active={i === index}
                run={playing && (i === index || i === leaving)}
                loop={count === 1}
                onNearEnd={advance}
                onProgress={(fraction) => { if (barRef.current) barRef.current.style.transform = `scaleX(${fraction.toFixed(3)})`; }}
              />
            </div>
          ))
        : stills.map((still, i) => (
            <div key={still.src} className={cn('absolute inset-0 transition-opacity duration-[1200ms] ease-out', i === index ? 'opacity-100' : 'opacity-0')}>
              <div className={cn('absolute inset-0', (i === index || i === leaving) && !reduced && 'nh-kb')}>
                <Image
                  src={still.src}
                  alt={i === index ? still.alt : ''}
                  fill
                  sizes="(min-width: 1024px) 400px, 60vw"
                  className="object-cover"
                  style={{ objectPosition: still.focus }}
                />
              </div>
            </div>
          ))}

      {/* Soft shade top and bottom so the clock and the button always show. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.38),transparent_18%,transparent_78%,rgba(0,0,0,0.45))]" />

      {showClock && (
        <div aria-hidden className="absolute inset-x-4 top-4 flex gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <span key={i} className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
              {i < index && <span className="absolute inset-0 bg-white/90" />}
              {i === index && (hasClips ? (
                <span key={index} ref={barRef} className="nh-clip-bar absolute inset-0 bg-white" />
              ) : (
                <span
                  key={index}
                  className="nh-progress absolute inset-0 bg-white"
                  style={{ '--nh-slide': `${STILL_SECONDS}s` } as CSSProperties}
                  onAnimationEnd={advance}
                />
              ))}
            </span>
          ))}
        </div>
      )}

      {showButton && (
        <button
          type="button"
          onClick={() => setChoice(wantsPlay ? 'pause' : 'play')}
          aria-label={wantsPlay ? `Pause the ${noun}` : `Play the ${noun}`}
          className={cn(
            'absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/65',
            ring.onDark,
          )}
        >
          {wantsPlay ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4 translate-x-px" aria-hidden />}
        </button>
      )}
    </div>
  );
}
