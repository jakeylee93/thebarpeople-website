import { MARQUEE } from '../data';
import MarqueeDrawing from '../MarqueeDrawing';
import { BuildButton, Points } from '../parts';

// Packages: the marquee package. One quote for the marquee and everything in it.
export default function MarqueePackage() {
  return (
    <section id="marquees" data-snap aria-labelledby="marquees-title" className="nh-section bg-white text-nh-ink">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col gap-[clamp(14px,2.6dvh,24px)] px-[var(--nh-gutter)] pb-[clamp(14px,3dvh,40px)] pt-[calc(var(--nh-head)+12px)] lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16 lg:pt-[calc(var(--nh-head)+clamp(16px,3dvh,40px))] xl:gap-24">
        <div data-reveal className="nh-media relative min-h-0 flex-1 rounded-[22px] bg-nh-mist lg:self-stretch lg:rounded-[28px]">
          <MarqueeDrawing className="absolute inset-0 h-full w-full p-2 lg:p-8" />
        </div>

        <div className="shrink-0">
          <p data-reveal="1" className="nh-eyebrow text-nh-ash">{MARQUEE.eyebrow}</p>
          <h2 id="marquees-title" data-reveal="2" className="nh-title mt-2 lg:mt-4">{MARQUEE.title}</h2>
          <p data-reveal="3" className="nh-lede mt-2.5 max-w-[42ch] text-nh-ash lg:mt-5">{MARQUEE.body}</p>
          <div data-reveal="3">
            <Points items={MARQUEE.items} tone="light" columns className="mt-3.5 max-w-[440px] font-semibold lg:mt-7" />
          </div>
          <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,32px)]">
            <BuildButton tone="light" href={MARQUEE.href}>{MARQUEE.cta}</BuildButton>
          </div>
          <p data-reveal="5" className="mt-3 max-w-[46ch] text-[13px] leading-snug text-nh-ash lg:mt-4 lg:text-[14px]">{MARQUEE.note}</p>
        </div>
      </div>
    </section>
  );
}
