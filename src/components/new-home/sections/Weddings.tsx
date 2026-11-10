import Image from 'next/image';
import { WEDDINGS } from '../data';
import { HowItWorksLink } from '../HowItWorks';
import { BuildButton, Points } from '../parts';

// Weddings: one wide photograph with the words set out beneath it.
export default function Weddings() {
  const { image } = WEDDINGS;
  return (
    <section id="weddings" data-snap aria-labelledby="weddings-title" className="nh-section bg-white text-nh-ink">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col px-[var(--nh-gutter)] pb-[clamp(14px,3dvh,40px)] pt-[calc(var(--nh-head)+12px)] lg:pt-[calc(var(--nh-head)+clamp(16px,3dvh,32px))]">
        <div data-reveal className="nh-media relative min-h-0 flex-1 overflow-hidden rounded-[22px] bg-nh-mist lg:rounded-[28px]">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1600px) 1520px, 100vw"
            className="object-cover [object-position:var(--fp)] lg:[object-position:var(--fd)]"
            style={{ '--fp': image.focus.phone, '--fd': image.focus.desktop } as React.CSSProperties}
          />
        </div>

        <div className="mt-[clamp(14px,2.6dvh,36px)] shrink-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
          <div>
            <p data-reveal="1" className="nh-eyebrow text-nh-ash">{WEDDINGS.eyebrow}</p>
            <h2 id="weddings-title" data-reveal="2" className="nh-title mt-2 lg:mt-4">{WEDDINGS.title}</h2>
            <p data-reveal="3" className="nh-lede nh-if-tall mt-2.5 max-w-[46ch] text-nh-ash lg:mt-5">{WEDDINGS.body}</p>
          </div>
          <div className="mt-3.5 lg:mt-0">
            <div data-reveal="3">
              <Points items={WEDDINGS.points} tone="light" />
            </div>
            <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,28px)] flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
              <BuildButton tone="light">{WEDDINGS.cta}</BuildButton>
              <HowItWorksLink topic="weddings" tone="light" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
