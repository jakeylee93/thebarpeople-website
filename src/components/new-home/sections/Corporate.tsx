import Image from 'next/image';
import { Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import ClientLogos from '../ClientLogos';
import type { HomeContent } from '@/content/new-home';
import { BuildButton, ring } from '../parts';
import { av, avRow } from '../av';

// Corporate events: says plainly what we do, in three steps, beside four real
// branded bars. One clear button, a phone number, and the clients along the foot.
export default function Corporate({ data: CORPORATE, contact: jake }: { data: HomeContent['corporate']; contact: HomeContent['footer']['contacts'][number] | undefined }) {
  const [main, ...rest] = CORPORATE.photos;
  return (
    <section id="corporate" data-snap aria-labelledby="corporate-title" className="nh-section bg-nh-ink text-white">
      <div className="flex h-full flex-col pt-[var(--nh-head)]">
        <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 flex-col gap-[clamp(12px,2.2dvh,20px)] px-[var(--nh-gutter)] pb-[clamp(10px,2dvh,20px)] pt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14 lg:py-[clamp(20px,4dvh,48px)] xl:gap-20">
          {/* Four real branded bars: one large, three small. */}
          <div data-reveal className="nh-media nh-fit relative min-h-0 flex-1 lg:order-2 lg:self-stretch">
            <div className="nh-corp-mosaic grid grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] grid-rows-3 gap-1.5 lg:gap-2.5">
              <div className="relative row-span-3 overflow-hidden rounded-[18px] lg:rounded-[26px]">
                <Image src={main.src} alt={main.alt} fill sizes="(min-width: 1024px) 34vw, 64vw" className="object-cover" style={{ objectPosition: main.focus }} {...avRow('nh_corporate.photos', 0, 'photo')} />
              </div>
              {rest.map((p, i) => (
                <div key={p.src} className="relative overflow-hidden rounded-[12px] lg:rounded-[18px]">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 18vw, 34vw" className="object-cover" style={{ objectPosition: p.focus }} {...avRow('nh_corporate.photos', i + 1, 'photo')} />
                </div>
              ))}
            </div>
          </div>

          <div className="shrink-0 lg:order-1">
            <p data-reveal="1" {...av('nh_corporate.eyebrow')} className="nh-eyebrow text-white/70">{CORPORATE.eyebrow}</p>
            <h2 id="corporate-title" data-reveal="2" {...av('nh_corporate.title')} className="nh-title mt-2 lg:mt-4">{CORPORATE.title}</h2>
            <p data-reveal="3" {...av('nh_corporate.body')} className="nh-lede nh-if-room mt-2.5 max-w-[46ch] text-white/75 lg:mt-5">{CORPORATE.body}</p>
            <ol data-reveal="3" className="mt-3 space-y-2 lg:mt-7 lg:space-y-4">
              {CORPORATE.steps.map((s, i) => (
                <li key={s.title} className="flex items-start gap-3 lg:gap-4">
                  <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white font-nh-display text-[14px] font-extrabold text-nh-ink lg:h-9 lg:w-9 lg:text-[17px]">{i + 1}</span>
                  <p className="nh-points leading-snug">
                    <strong className="font-semibold text-white"><span {...avRow('nh_corporate.steps', i, 'title')}>{s.title}</span>.</strong>{' '}
                    <span {...avRow('nh_corporate.steps', i, 'detail')} className={cn('text-white/70', 'nh-if-tall')}>{s.detail}</span>
                  </p>
                </li>
              ))}
            </ol>
            <div data-reveal="4" className="mt-[clamp(12px,2.4dvh,32px)] flex flex-wrap items-center gap-x-4 gap-y-1">
              <BuildButton tone="dark" field="nh_corporate.cta_label">{CORPORATE.cta}</BuildButton>
              {jake?.tel && <a href={`tel:${jake.tel}`} className={cn('inline-flex h-11 items-center gap-2 rounded px-1 text-[15px] font-semibold text-white/85 hover:text-white', ring.onDark)}>
                <Phone className="h-4 w-4" aria-hidden />
                <span><span className="hidden sm:inline"><span {...av('nh_corporate.call_label')}>{CORPORATE.call}</span> </span>{jake.phone}</span>
              </a>}
            </div>
          </div>
        </div>

        <div data-reveal="5" className="shrink-0 border-t border-white/12">
          <ClientLogos logos={CORPORATE.logos} label={CORPORATE.trusted} className="mx-auto h-[clamp(48px,7.5dvh,76px)] max-w-[1600px] px-[var(--nh-gutter)]" />
        </div>
      </div>
    </section>
  );
}
