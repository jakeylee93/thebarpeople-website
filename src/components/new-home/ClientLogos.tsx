/* eslint-disable @next/next/no-img-element -- small logo files (mostly SVG) in an
   endless strip; plain img keeps them crisp at any size with no optimiser round trip. */
import type { CSSProperties } from 'react';
import { CLIENT_LOGOS, logoHeight } from './data';

// "Who we've worked with": an endless, slow strip of client logos in solid
// black. Pauses on hover; a still, wrapped row for reduced motion.
export default function ClientLogos() {
  const set = (dup: boolean) =>
    CLIENT_LOGOS.map((l) => (
      <li key={`${l.name}-${dup ? 'b' : 'a'}`} className={dup ? 'nh-marquee-dup' : undefined} aria-hidden={dup || undefined}>
        <img
          src={l.src}
          alt={dup ? '' : l.name}
          width={Math.round(logoHeight(l.ratio) * l.ratio)}
          height={logoHeight(l.ratio)}
          loading="lazy"
          style={{ '--h': `${logoHeight(l.ratio)}px` } as CSSProperties}
          className="h-[calc(var(--h)*0.8)] w-auto opacity-75 brightness-0 transition hover:opacity-100 md:h-[var(--h)]"
        />
      </li>
    ));
  return (
    <section aria-labelledby="clients-title" className="border-b border-nh-line bg-white py-10 md:py-14">
      <h2 id="clients-title" className="px-5 text-center text-[11px] font-semibold uppercase tracking-[0.22em] text-nh-ash md:text-[12px]">
        Trusted by brands we’ve worked with
      </h2>
      <div className="nh-marquee mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] md:mt-9">
        <ul className="nh-marquee-track flex w-max items-center gap-14 px-7 md:gap-24 md:px-12">
          {set(false)}
          {set(true)}
        </ul>
      </div>
    </section>
  );
}
