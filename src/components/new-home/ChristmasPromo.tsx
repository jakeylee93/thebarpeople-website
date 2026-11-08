import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { BUILD_HREF, CHRISTMAS } from './data';

export default function ChristmasPromo() {
  return (
    <section aria-labelledby="xmas-title" className="bg-nh-ink text-white">
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[1.15fr_1fr]">
        <div className="relative aspect-[3/2] md:aspect-auto md:min-h-[600px]">
          <Image src={CHRISTMAS.image.src} alt={CHRISTMAS.image.alt} fill sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center px-5 py-14 sm:px-8 md:px-14 md:py-20 lg:px-20">
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">{CHRISTMAS.eyebrow}</p>
          <h2 id="xmas-title" className="mt-3 text-[38px] font-extrabold leading-[1.04] tracking-[-0.02em] md:text-[56px]">
            {CHRISTMAS.title}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-white/80">{CHRISTMAS.body}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CHRISTMAS.points.map((p) => (
              <li key={p} className="rounded-full border border-white/25 px-4 py-1.5 text-[14px] text-white/90">{p}</li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col items-start gap-3">
            <a
              href={BUILD_HREF}
              className="group inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 text-[16px] font-semibold text-nh-ink transition hover:bg-white/90 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nh-ink"
            >
              {CHRISTMAS.cta}
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden />
            </a>
            <p className="text-[13px] text-white/65">{CHRISTMAS.small}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
