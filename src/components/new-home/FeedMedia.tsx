'use client';

// A same-shape card for the photo grids: a photo, or a silent looping clip
// that plays only while `play` is true (nothing is fetched until then).

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { FeedItem } from './data';
import { av } from './av';

export function AutoClip({ item, play }: { item: Extract<FeedItem, { kind: 'video' }>; play: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (play) void v.play().catch(() => {});
    else v.pause();
  }, [play]);
  return <video ref={ref} src={item.src} poster={item.poster} muted loop playsInline preload="none" aria-label={item.alt} className="h-full w-full object-cover" />;
}

/** The picture inside a card. `showAlt` is for cards that aren't buttons with their own label. */
export default function FeedMedia({ item, play, sizes, showAlt = false, field }: { item: FeedItem; play: boolean; sizes: string; showAlt?: boolean; /** The picture's content field, for the editor (see av.ts). Photos only. */ field?: string }) {
  if (item.kind === 'image') {
    return <Image src={item.src} alt={showAlt ? item.alt : ''} fill sizes={sizes} className="object-cover transition duration-500 group-hover:scale-[1.04]" {...(field ? av(field) : {})} />;
  }
  return (
    <>
      <AutoClip item={item} play={play} />
      <span aria-hidden className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/45 text-white lg:right-2.5 lg:top-2.5">
        <Play className="h-3 w-3 fill-current" />
      </span>
    </>
  );
}
