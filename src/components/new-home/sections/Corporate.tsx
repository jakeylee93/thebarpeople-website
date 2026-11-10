import Image from 'next/image';
import BarDiagram from '@/components/new-home/package/BarDiagram';
import ClientLogos from '../ClientLogos';
import { CORPORATE } from '../data';
import { HowItWorksLink } from '../HowItWorks';
import { BuildButton, Points } from '../parts';

// Corporate events, the premium section: a real branded bar, a drawing that
// shows the visitor's own artwork on every panel, and the clients along the foot.
export default function Corporate() {
  const { image } = CORPORATE;
  return (
    <section id="corporate" data-snap aria-labelledby="corporate-title" className="nh-section bg-nh-ink text-white">
      <div className="flex h-full flex-col pt-[var(--nh-head)]">
        <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-[clamp(14px,2.4dvh,22px)] px-[var(--nh-gutter)] pb-[clamp(12px,2.2dvh,20px)] pt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-[clamp(20px,4dvh,48px)] xl:gap-20">
          {/* Photo, with the drawing card pinned to its corner */}
          <div data-reveal className="nh-media nh-fit relative min-h-0 flex-1 lg:order-2 lg:self-stretch">
            <div className="nh-corp-visual">
              <div className="relative h-full overflow-hidden rounded-[22px] ring-1 ring-white/10 lg:rounded-[28px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover [object-position:var(--fp)] lg:[object-position:var(--fd)]"
                  style={{ '--fp': image.focus.phone, '--fd': image.focus.desktop } as React.CSSProperties}
                />
              </div>
              <figure className="nh-inset absolute left-2.5 top-2.5 w-[40%] max-w-[230px] rounded-[16px] bg-white p-1.5 pb-2 text-nh-ink shadow-[0_18px_50px_rgba(0,0,0,0.45)] lg:-bottom-9 lg:-left-10 lg:top-auto lg:w-[47%] lg:max-w-[340px] lg:rounded-[22px] lg:p-2.5 lg:pb-3.5">
                <div className="rounded-[11px] bg-nh-mist lg:rounded-[14px]">
                  <BarDiagram bar={{ shapeId: 'island', sections: 8, finishId: 'white', branded: true }} decorative />
                </div>
                <figcaption className="mt-1.5 text-center text-[11px] font-semibold leading-tight lg:mt-2.5 lg:text-[13.5px]">
                  {CORPORATE.diagramCaption}
                </figcaption>
              </figure>
            </div>
          </div>

          <div className="shrink-0 lg:order-1">
            <p data-reveal="1" className="nh-eyebrow text-white/70">{CORPORATE.eyebrow}</p>
            <h2 id="corporate-title" data-reveal="2" className="nh-title mt-2 lg:mt-4">{CORPORATE.title}</h2>
            <p data-reveal="3" className="nh-lede nh-if-room mt-2.5 max-w-[46ch] text-white/75 lg:mt-5">{CORPORATE.body}</p>
            <div data-reveal="3">
              <Points items={CORPORATE.points} tone="dark" className="mt-3.5 lg:mt-6" />
            </div>
            <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,32px)] flex flex-wrap items-center gap-x-3 gap-y-1 sm:gap-x-5">
              <BuildButton tone="dark">{CORPORATE.cta}</BuildButton>
              <HowItWorksLink topic="corporate" tone="dark" />
            </div>
          </div>
        </div>

        <div data-reveal="5" className="shrink-0 border-t border-white/12">
          <ClientLogos className="mx-auto h-[clamp(52px,8dvh,76px)] max-w-[1600px] px-[var(--nh-gutter)]" />
        </div>
      </div>
    </section>
  );
}
