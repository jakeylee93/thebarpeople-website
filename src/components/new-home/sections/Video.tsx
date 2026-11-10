import Image from 'next/image';
import { VIDEO, VIDEO_CLIPS, VIDEO_STILLS } from '../data';
import { BuildButton } from '../parts';
import VideoCard from '../VideoCard';

// "See us in action": a tall video card set in a dark, hero-style section.
// The card plays VIDEO_CLIPS (data.ts); until those exist it shows VIDEO_STILLS.
export default function Video() {
  return (
    <section id="video" data-snap aria-labelledby="video-title" className="nh-section bg-nh-ink text-white">
      {/* Backdrop: a real event photo, blurred and drained of colour so the card is the only thing in focus. */}
      <Image src={VIDEO.backdrop} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" aria-hidden className="scale-110 object-cover opacity-35 blur-2xl grayscale" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(17,17,17,0.85))]" />

      <div className="relative mx-auto flex h-full max-w-[1320px] flex-col gap-[clamp(14px,2.6dvh,24px)] px-[var(--nh-gutter)] pb-[clamp(16px,3.4dvh,40px)] pt-[calc(var(--nh-head)+clamp(12px,2.6dvh,40px))] lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-center lg:gap-16">
        <div data-reveal className="nh-media nh-fit flex min-h-0 flex-1 items-center justify-center lg:order-2 lg:self-stretch">
          <VideoCard clips={VIDEO_CLIPS} stills={VIDEO_STILLS} className="nh-video-card" />
        </div>

        <div className="flex shrink-0 flex-col items-center text-center lg:order-1 lg:items-start lg:text-left">
          <p data-reveal="1" className="nh-eyebrow text-white/70">{VIDEO.eyebrow}</p>
          <h2 id="video-title" data-reveal="2" className="nh-title mt-2 max-w-[12ch] lg:mt-4">{VIDEO.title}</h2>
          <p data-reveal="3" className="nh-lede nh-if-room mt-2.5 max-w-[36ch] text-white/75 lg:mt-5">{VIDEO.body}</p>
          <div data-reveal="4" className="mt-[clamp(14px,2.6dvh,36px)]">
            <BuildButton tone="dark">{VIDEO.cta}</BuildButton>
          </div>
        </div>
      </div>
    </section>
  );
}
