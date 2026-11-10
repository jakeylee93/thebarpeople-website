import Image from 'next/image';
import { PARTIES } from '../data';
import { HowItWorksLink } from '../HowItWorks';
import { BuildButton, Points } from '../parts';

// Birthdays and private parties. Phones: the photo runs edge to edge with the
// words on a sheet that laps over it, like the hero. Desktop: a tall photo
// card on the left, words on the right.
export default function Parties() {
  const { image } = PARTIES;
  return (
    <section id="parties" data-snap aria-labelledby="parties-title" className="nh-section bg-nh-mist text-nh-ink">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col pt-[var(--nh-head)] lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-[var(--nh-gutter)] xl:gap-24">
        <div data-reveal className="nh-media nh-fit relative min-h-0 flex-1 lg:self-stretch">
          <div className="nh-party-photo overflow-hidden bg-nh-line lg:rounded-[28px]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover [object-position:var(--fp)] lg:[object-position:var(--fd)]"
              style={{ '--fp': image.focus.phone, '--fd': image.focus.desktop } as React.CSSProperties}
            />
          </div>
        </div>

        <div className="relative z-10 -mt-6 shrink-0 rounded-t-[28px] bg-nh-mist px-[var(--nh-gutter)] pb-[clamp(14px,3dvh,28px)] pt-6 lg:mt-0 lg:rounded-none lg:p-0">
          <p data-reveal="1" className="nh-eyebrow text-nh-ash">{PARTIES.eyebrow}</p>
          <h2 id="parties-title" data-reveal="2" className="nh-title mt-2 lg:mt-4">{PARTIES.title}</h2>
          <p data-reveal="3" className="nh-lede nh-if-tall mt-2.5 max-w-[44ch] text-nh-ash lg:mt-5">{PARTIES.body}</p>
          <div data-reveal="3">
            <Points items={PARTIES.points} tone="light" className="mt-3.5 lg:mt-6" />
          </div>
          <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,32px)] flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
            <BuildButton tone="light">{PARTIES.cta}</BuildButton>
            <HowItWorksLink topic="parties" tone="light" />
          </div>
        </div>
      </div>
    </section>
  );
}
