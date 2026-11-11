import Image from 'next/image';
import { CHRISTMAS } from '../data';
import { BuildButton } from '../parts';
import ChristmasPrints from '../ChristmasPrints';
import Snow from '../Snow';

// The Christmas advert: one full-screen poster. The photo runs edge to edge,
// a thin keyline frames it like a magazine page, and snow drifts down behind
// the words.
export default function Christmas() {
  const { image } = CHRISTMAS;
  return (
    <section id="christmas" data-snap aria-labelledby="christmas-title" className="nh-section nh-poster bg-nh-ink text-white">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="100vw"
        className="object-cover [object-position:var(--fp)] lg:[object-position:var(--fd)]"
        style={{ '--fp': image.focus.phone, '--fd': image.focus.desktop } as React.CSSProperties}
      />
      {/* Darkened for white words: an even wash, then a deeper pool behind the headline. */}
      <div aria-hidden className="absolute inset-0 bg-black/45" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_55%,rgba(0,0,0,0.5),transparent)]" />
      <Snow className="nh-snow absolute inset-0 h-full w-full" />
      <ChristmasPrints left={CHRISTMAS.prints.left} right={CHRISTMAS.prints.right} />

      <div className="absolute inset-x-3 bottom-3 top-[calc(var(--nh-head)+12px)] rounded-[4px] border border-white/45 sm:inset-x-5 sm:bottom-5 sm:top-[calc(var(--nh-head)+20px)] lg:inset-x-7 lg:bottom-7 lg:top-[calc(var(--nh-head)+28px)]">
        <div className="flex h-full flex-col items-center px-5 py-[clamp(16px,3.2dvh,36px)] text-center sm:px-10">
          <Image
            src="/images/logos/bar-people-logo.png"
            alt="The Bar People"
            width={1000}
            height={1000}
            sizes="64px"
            data-reveal
            className="h-auto w-[clamp(44px,7dvh,64px)]"
          />

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <p data-reveal="1" className="nh-eyebrow flex items-center gap-4 text-white/90">
              <span aria-hidden className="h-px w-8 bg-white/50 lg:w-12" />
              {CHRISTMAS.eyebrow}
              <span aria-hidden className="h-px w-8 bg-white/50 lg:w-12" />
            </p>
            <h2
              id="christmas-title"
              data-reveal="2"
              className="mt-[clamp(12px,2.4dvh,24px)] max-w-[11ch] text-[clamp(2.5rem,min(9.5vw+0.5rem,13dvh),5.25rem)] font-extrabold leading-[0.98] tracking-[-0.03em] [text-shadow:0_2px_30px_rgba(0,0,0,0.35)] lg:max-w-none lg:text-[clamp(3.5rem,min(7.6vw,13dvh),9rem)]"
            >
              {CHRISTMAS.titleLines[0]} <br className="hidden lg:block" />
              {CHRISTMAS.titleLines[1]}
            </h2>
            <p data-reveal="3" className="nh-lede mt-[clamp(12px,2.6dvh,28px)] max-w-[40ch] text-white/90">
              {CHRISTMAS.body}
            </p>
            <div data-reveal="4" className="mt-[clamp(18px,3.6dvh,36px)]">
              <BuildButton tone="dark" href={CHRISTMAS.href} className="shadow-[0_10px_40px_rgba(0,0,0,0.3)]">{CHRISTMAS.cta}</BuildButton>
            </div>
          </div>

          <p data-reveal="5" className="nh-eyebrow text-white/80">{CHRISTMAS.small}</p>
        </div>
      </div>
    </section>
  );
}
