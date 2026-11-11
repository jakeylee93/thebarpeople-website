'use client';

// The team: a grid of our own bartenders at work, photos and short silent
// clips in same-shape cards. It always fits one screen.

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { HomeContent } from '@/content/new-home';
import FeedMedia from '../FeedMedia';
import { BuildButton } from '../parts';
import { av } from '../av';

const reducedQuery = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const m = window.matchMedia(reducedQuery);
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
};
const getReduced = () => window.matchMedia(reducedQuery).matches;

export default function Team({ data: TEAM }: { data: HomeContent['team'] }) {
  const TEAM_FEED = TEAM.cards;
  const [inView, setInView] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, () => false);
  const gridRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="team" data-snap aria-labelledby="team-title" className="nh-section bg-nh-ink text-white">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-[var(--nh-gutter)] pb-[clamp(12px,2.6dvh,36px)] pt-[calc(var(--nh-head)+clamp(12px,2.6dvh,36px))]">
        <div className="flex shrink-0 flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div>
            <p data-reveal="1" {...av('nh_team.eyebrow')} className="nh-eyebrow text-white/70">{TEAM.eyebrow}</p>
            <h2 id="team-title" data-reveal="2" {...av('nh_team.title')} className="nh-title mt-1.5 lg:mt-3">{TEAM.title}</h2>
          </div>
          <div data-reveal="3" className="flex items-center gap-5">
            <p {...av('nh_team.body')} className="nh-lede nh-if-tall hidden max-w-[34ch] text-white/75 lg:block">{TEAM.body}</p>
            <BuildButton tone="dark" field="nh_team.cta_label" className="max-sm:hidden">{TEAM.cta}</BuildButton>
          </div>
        </div>

        <div data-reveal="3" className="nh-media nh-media-tall nh-fit mt-[clamp(10px,2.2dvh,28px)] min-h-0 flex-1">
          <ul ref={gridRef} className="nh-feed">
            {TEAM_FEED.map((item, i) => (
              <li key={item.src} className="nh-feed-card group relative overflow-hidden rounded-[10px] bg-white/10 lg:rounded-[16px]">
                <FeedMedia item={item} play={inView && !reduced} sizes="(min-width: 1024px) 16vw, 33vw" showAlt field={`nh_team.cards.${i}.picture`} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
