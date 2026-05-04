'use client';

import { brands } from '@/lib/constants';

export default function BrandMarquee() {
  const all = [...brands, ...brands, ...brands];
  return (
    <section className="overflow-hidden border-y border-pale bg-faint py-6">
      <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-light">
        Trusted by leading brands
      </p>
      <div className="relative">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {all.map((b, i) => (
            <span key={`${b}-${i}`} className="text-sm font-semibold text-pale">{b}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
