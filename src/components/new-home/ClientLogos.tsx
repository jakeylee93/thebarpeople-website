/* eslint-disable @next/next/no-img-element -- small logo files (mostly SVG) in an
   endless strip; plain img keeps them crisp at any size with no optimiser round trip. */
import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import { CLIENT_LOGOS, CORPORATE, logoHeight } from './data';

// "Trusted by": one endless, slow row of client logos along the foot of the
// Corporate section. The logo files are black artwork; on the dark section
// they are flattened to solid white with a CSS filter. Pauses on hover; a
// still row for reduced motion.
export default function ClientLogos({ className }: { className?: string }) {
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
          className="h-[calc(var(--h)*0.7)] w-auto max-w-none opacity-80 brightness-0 invert transition hover:opacity-100 lg:h-[calc(var(--h)*0.85)]"
        />
      </li>
    ));
  return (
    <div className={cn('flex items-center gap-5 lg:gap-8', className)}>
      <p id="clients-label" className="nh-eyebrow shrink-0 text-white/60">{CORPORATE.trusted}</p>
      <div className="nh-marquee nh-logos-row min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
        <ul aria-labelledby="clients-label" className="nh-marquee-track flex w-max items-center gap-11 px-[22px] lg:gap-16 lg:px-8">
          {set(false)}
          {set(true)}
        </ul>
      </div>
    </div>
  );
}
