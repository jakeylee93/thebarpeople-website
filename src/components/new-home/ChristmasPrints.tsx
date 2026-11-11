'use client';

// Snapshots on the Christmas advert: two small prints that each shuffle
// through party photos, like disposable-camera prints dropped on the page.
// For reduced motion they stay on their first photo.

import { useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

const EVERY_MS = 3600;

function Print({ photos, turn, className }: { photos: readonly string[]; turn: number; className: string }) {
  const showing = turn % photos.length;
  return (
    <span className={cn('absolute block bg-white p-1.5 pb-5 shadow-[0_14px_40px_rgba(0,0,0,0.45)] lg:p-2.5 lg:pb-9', className)}>
      <span className="relative block h-[clamp(58px,9dvh,84px)] w-[clamp(72px,20vw,104px)] overflow-hidden bg-nh-ink lg:h-[clamp(120px,19dvh,190px)] lg:w-[clamp(150px,13vw,236px)]">
        {photos.map((src, i) => (
          <Image key={src} src={src} alt="" fill sizes="(min-width: 1024px) 236px, 104px"
            className={cn('object-cover transition-opacity duration-700', i === showing ? 'opacity-100' : 'opacity-0')} />
        ))}
      </span>
    </span>
  );
}

export default function ChristmasPrints({ left, right }: { left: readonly string[]; right: readonly string[] }) {
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const [turn, setTurn] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setTurn((n) => n + 1), EVERY_MS / 2);
    return () => window.clearInterval(t);
  }, [reduced]);
  // The two prints change in turn, not together.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Print photos={left} turn={Math.floor((turn + 1) / 2)} className="left-3 top-[calc(var(--nh-head)+26px)] -rotate-[9deg] lg:left-[7%] lg:top-auto lg:bottom-[13%]" />
      <Print photos={right} turn={Math.floor(turn / 2)} className="right-3 top-[calc(var(--nh-head)+34px)] rotate-[7deg] lg:right-[7%] lg:top-auto lg:bottom-[17%]" />
    </div>
  );
}
