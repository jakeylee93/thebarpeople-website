import Image from 'next/image';
import { PARTIES } from '../data';
import { HowItWorksLink } from '../HowItWorks';
import { BuildButton, Points } from '../parts';

// Birthdays and private parties: dark, with the headline glowing like the neon
// sign in the photo and a price sticker on the corner. Phones: the photo runs
// edge to edge with the words on a sheet that laps over it. Desktop: a tall
// photo card on the left, words on the right.
export default function Parties() {
  const { image, sticker } = PARTIES;
  return (
    <section id="parties" data-snap aria-labelledby="parties-title" className="nh-section bg-nh-ink text-white">
      <div className="mx-auto flex h-full max-w-[1600px] flex-col pt-[var(--nh-head)] lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-[var(--nh-gutter)] xl:gap-24">
        <div data-reveal className="nh-media nh-fit relative min-h-0 flex-1 lg:self-stretch">
          <div className="nh-party-photo">
            <div className="absolute inset-0 overflow-hidden bg-black lg:rounded-[28px]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover [object-position:var(--fp)] lg:[object-position:var(--fd)]"
                style={{ '--fp': image.focus.phone, '--fd': image.focus.desktop } as React.CSSProperties}
              />
            </div>
            <p className="nh-sticker absolute right-4 top-4 flex h-[92px] w-[92px] rotate-[10deg] flex-col items-center justify-center rounded-full text-center leading-none text-nh-ink lg:-right-7 lg:-top-7 lg:h-[132px] lg:w-[132px]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] lg:text-[12.5px]">{sticker[0]}</span>
              <span className="mt-0.5 font-nh-display text-[27px] font-extrabold tracking-tight lg:text-[40px]">{sticker[1]}</span>
              <span className="mt-0.5 text-[10px] font-semibold lg:text-[12.5px]">{sticker[2]}</span>
            </p>
          </div>
        </div>

        <div className="relative z-10 -mt-6 shrink-0 rounded-t-[28px] bg-nh-ink px-[var(--nh-gutter)] pb-[clamp(14px,3dvh,28px)] pt-6 lg:mt-0 lg:rounded-none lg:p-0">
          <p data-reveal="1" className="nh-eyebrow text-white/70">{PARTIES.eyebrow}</p>
          <h2 id="parties-title" data-reveal="2" className="nh-title mt-2 lg:mt-4">
            {PARTIES.title[0]}{' '}
            <span className="nh-neon whitespace-nowrap">{PARTIES.title[1]}</span>
          </h2>
          <p data-reveal="3" className="nh-lede nh-if-tall mt-2.5 max-w-[44ch] text-white/75 lg:mt-5">{PARTIES.body}</p>
          <div data-reveal="3">
            <Points items={PARTIES.points} tone="dark" className="mt-3.5 lg:mt-6" />
          </div>
          <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,32px)] flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
            <BuildButton tone="dark">{PARTIES.cta}</BuildButton>
            <HowItWorksLink topic="parties" tone="dark" />
          </div>
        </div>
      </div>
    </section>
  );
}
