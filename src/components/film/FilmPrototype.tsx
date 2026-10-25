'use client';

// /concepts — the homepage as it would flow: the opening film (scene 1 → 2),
// then Section Two, the quote builder. Scenes 3–5 are on the storyboard for
// review first.

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import OpeningFilm from './OpeningFilm';
import { SCENES } from './scenes';
import VisualQuoteBuilder from '@/components/visual-quote/VisualQuoteBuilder';
import { cn } from '@/lib/utils';

export default function FilmPrototype({ initialShirt }: { initialShirt?: string }) {
  const [silver, setSilver] = useState(initialShirt !== 'real');

  const choose = (next: boolean) => {
    setSilver(next);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('shirt', next ? 'silver' : 'real');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    } catch {
      /* convenience only */
    }
  };

  return (
    <>
      {/* Prototype strip — outside the design */}
      <div className="relative z-50 flex items-center justify-between gap-x-3 bg-[#0c0b0a] px-3 py-1.5 text-[11.5px] text-ivory/80 sm:px-6 sm:py-2 sm:text-[12px]">
        <p className="min-w-0 truncate"><strong className="font-semibold text-ivory">Prototype</strong><span className="hidden sm:inline"> · not live · nothing is sent, booked or charged</span><span className="sm:hidden"> · nothing sent</span></p>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <fieldset className="flex items-center gap-0.5 sm:gap-1">
            <legend className="sr-only">Roundel on the shirt</legend>
            <span aria-hidden="true" className="mr-1 hidden sm:inline">Roundel</span>
            {[{ v: true, label: 'Silver', long: 'Silver preview' }, { v: false, label: 'Stitched', long: 'As stitched' }].map((o) => (
              <label key={o.label} className={cn(
                'relative cursor-pointer rounded-full px-2 py-1 font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brass sm:px-2.5',
                silver === o.v ? 'bg-ivory text-ink' : 'text-ivory/80 hover:bg-ivory/10',
              )}>
                <input type="radio" name="roundel" checked={silver === o.v} onChange={() => choose(o.v)} className="sr-only" />
                <span className="sm:hidden">{o.label}</span><span className="hidden sm:inline">{o.long}</span>
              </label>
            ))}
          </fieldset>
          <Link href="/concepts/storyboard" className="font-semibold text-ivory underline decoration-ivory/40 underline-offset-4 hover:decoration-ivory">
            Storyboard
          </Link>
        </div>
      </div>

      <main>
        <OpeningFilm silver={silver} />
        <VisualQuoteBuilder />

        {/* Scenes 3–5 come next, after the storyboard is agreed */}
        <section aria-labelledby="next-scenes" className="bg-ink px-4 py-14 text-ivory sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1380px]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass">Coming next, after your review</p>
            <h2 id="next-scenes" className="mt-2 font-heading text-[30px] leading-tight sm:text-[38px]">Services, real events, last drink</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {SCENES.slice(2).map((s) => (
                <li key={s.id}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[3px]">
                    <Image src={s.frame.image.src} alt={s.frame.image.alt} fill sizes="(min-width: 640px) 30vw, 92vw" className="object-cover" style={{ objectPosition: s.frame.desktop }} />
                    <span className="absolute bottom-2 left-2 rounded-sm bg-ink/75 px-2 py-0.5 text-[11px]">Real photo</span>
                  </div>
                  <p className="mt-2 text-[15px] font-semibold">Scene {s.n}: {s.title}</p>
                  <p className="text-[13.5px] leading-snug text-ivory/70">{s.purpose}</p>
                </li>
              ))}
            </ul>
            <Link href="/concepts/storyboard"
              className="mt-8 inline-flex h-12 items-center rounded-full border border-ivory/40 px-6 text-[15px] font-semibold transition hover:bg-ivory hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass">
              Review the full storyboard
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
