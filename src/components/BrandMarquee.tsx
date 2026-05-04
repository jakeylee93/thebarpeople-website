'use client';

import { brands } from '@/lib/constants';

export default function BrandMarquee() {
  const allBrands = [...brands, ...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-pale bg-white py-8">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.2em] text-light">
        Trusted by leading brands
      </p>
      <div className="relative">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {allBrands.map((brand, i) => (
            <span key={`${brand}-${i}`} className="text-sm font-semibold text-pale">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
