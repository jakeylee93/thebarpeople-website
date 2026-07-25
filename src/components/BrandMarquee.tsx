'use client';

/* eslint-disable @next/next/no-img-element -- tiny grayscale marquee logos;
   plain img keeps the infinite strip simple. */
import { brandLogos, brands } from '@/lib/constants';

export default function BrandMarquee() {
  const strip = [...brandLogos, ...brandLogos, ...brandLogos];
  return (
    <section className="overflow-hidden border-y border-pale bg-faint py-6">
      <p className="mb-4 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-light">
        Trusted by leading brands — {brands.join(', ')} & more
      </p>
      <div className="relative">
        <div className="animate-marquee flex items-center gap-14 whitespace-nowrap">
          {strip.map((b, i) => (
            <img
              key={`${b.name}-${i}`}
              src={b.src}
              alt={b.name}
              className="h-7 w-auto flex-none opacity-50 grayscale transition hover:opacity-90 hover:grayscale-0 md:h-8"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
