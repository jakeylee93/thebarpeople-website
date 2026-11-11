import Image from 'next/image';
import type { HomeContent } from '@/content/new-home';
import { HowItWorksLink } from '../HowItWorks';
import { BuildButton, Points } from '../parts';
import { av, avRow } from '../av';

// Weddings. Desktop: the lawn photo fills the screen, the words sit on a white
// card, and two small prints lie across the corner like photos on a table.
// Phones: the photo on top with the prints lapping over it, words beneath.
export default function Weddings({ data: WEDDINGS }: { data: HomeContent['weddings'] }) {
  const { image, prints } = WEDDINGS;
  return (
    <section id="weddings" data-snap aria-labelledby="weddings-title" className="nh-section bg-white text-nh-ink">
      <div className="flex h-full flex-col pt-[var(--nh-head)] lg:block lg:pt-0">
        <div data-reveal className="nh-media relative min-h-0 flex-1 lg:absolute lg:inset-0">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="100vw"
            className="object-cover [object-position:var(--fp)] lg:[object-position:var(--fd)]"
            style={{ '--fp': image.focus.phone, '--fd': image.focus.desktop } as React.CSSProperties}
            {...av('nh_weddings.picture')}
          />
          {/* Prints */}
          <div aria-hidden className="pointer-events-none absolute -bottom-5 right-4 z-10 flex items-end lg:bottom-[9%] lg:right-[6%]">
            {prints.map((p, i) => (
              <span
                key={p.src}
                className={`block bg-white p-1.5 pb-5 shadow-[0_14px_40px_rgba(0,0,0,0.28)] lg:p-2.5 lg:pb-9 ${i === 0 ? '-rotate-6' : '-ml-5 translate-y-2 rotate-[5deg] lg:-ml-8'}`}
              >
                <span className="relative block h-[clamp(64px,11dvh,96px)] w-[clamp(84px,24vw,128px)] overflow-hidden lg:h-[clamp(120px,19dvh,190px)] lg:w-[clamp(160px,15vw,250px)]">
                  <Image src={p.src} alt="" fill sizes="(min-width: 1024px) 250px, 128px" className="object-cover" {...avRow('nh_weddings.prints', i, 'photo')} />
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="relative shrink-0 px-[var(--nh-gutter)] pb-[clamp(14px,3dvh,28px)] pt-[clamp(18px,3.4dvh,30px)] lg:absolute lg:left-[var(--nh-edge)] lg:top-1/2 lg:w-[min(520px,42vw)] lg:-translate-y-[calc(50%-var(--nh-head)/2)] lg:rounded-[32px] lg:bg-white lg:p-[clamp(28px,4.5dvh,52px)] lg:shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
          <p data-reveal="1" {...av('nh_weddings.eyebrow')} className="nh-eyebrow text-nh-ash">{WEDDINGS.eyebrow}</p>
          <h2 id="weddings-title" data-reveal="2" className="nh-title nh-title-card mt-2 lg:mt-4">
            <span {...av('nh_weddings.title_lead')}>{WEDDINGS.title[0]}</span>{' '}
            <em {...av('nh_weddings.title_accent')} className="nh-script whitespace-nowrap">{WEDDINGS.title[1]}</em>
          </h2>
          <p data-reveal="3" {...av('nh_weddings.body')} className="nh-lede nh-if-tall mt-2.5 max-w-[46ch] text-nh-ash lg:mt-5">{WEDDINGS.body}</p>
          <div data-reveal="3">
            <Points items={WEDDINGS.points} list="nh_weddings.points" field="point" tone="light" className="mt-3.5 lg:mt-6" />
          </div>
          <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,28px)] flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
            <BuildButton tone="light" field="nh_weddings.cta_label">{WEDDINGS.cta}</BuildButton>
            <HowItWorksLink topic="weddings" tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
