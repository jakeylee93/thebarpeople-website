'use client';

import { brands } from '@/lib/constants';

export default function BrandMarquee() {
  const allBrands = [...brands, ...brands, ...brands];

  return (
    <section className="overflow-hidden border-y border-warm-border bg-cream-dark py-8">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted">
        Trusted by leading brands &amp; organisations
      </p>
      <div className="relative">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {allBrands.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="text-sm font-semibold text-charcoal/30 md:text-base"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
