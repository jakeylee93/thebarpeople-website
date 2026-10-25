// Review board: real source photo → proposed still → desktop and phone frames,
// for each scene of the opening film. For Jake to approve before any new still
// is made, and before any video.

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import FilmFrame from './FilmFrame';
import { SCENES } from './scenes';

export default function Storyboard() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <div className="bg-[#0c0b0a] px-4 py-2 text-[12px] text-ivory/80 sm:px-6">
        <strong className="font-semibold text-ivory">Prototype</strong> · storyboard for review · nothing generated, nothing published ·{' '}
        <Link href="/concepts" className="font-semibold text-ivory underline decoration-ivory/40 underline-offset-4">See it as a page</Link>
      </div>

      <header className="mx-auto max-w-[1380px] px-4 pb-8 pt-12 sm:px-6 lg:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brass-ink">The Bar People · homepage</p>
        <h1 className="mt-2 font-heading text-[36px] leading-[1.05] sm:text-[48px]">The opening film — storyboard</h1>
        <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-stone">
          One continuous scroll, built only from your own photos. It opens on the shirt with the roundel in silver, moves to the white bar where
          you build a quote, then the services, real events and a calm last drink. For each scene: the real photo it comes from, how it frames on
          desktop and phone, and whether a new still is needed. Nothing new is made until you approve, and there’s no video before the stills are agreed.
        </p>
        <ul className="mt-5 grid max-w-4xl gap-2 text-[14px] text-stone sm:grid-cols-3">
          <li className="rounded-[3px] border border-hairline bg-white px-3 py-2"><strong className="text-ink">Real photos only.</strong> Every image is one of yours, labelled.</li>
          <li className="rounded-[3px] border border-hairline bg-white px-3 py-2"><strong className="text-ink">Cuts, not morphs.</strong> Sleeve across the lens, bar-edge and glass-rim matches.</li>
          <li className="rounded-[3px] border border-hairline bg-white px-3 py-2"><strong className="text-ink">Reversible.</strong> Scroll back and it plays back. Reduced motion shows still frames.</li>
        </ul>
      </header>

      <ol className="mx-auto max-w-[1380px] space-y-10 px-4 pb-16 sm:px-6 lg:px-10">
        {SCENES.map((scene) => (
          <li key={scene.id} className="rounded-[4px] border border-hairline bg-[#fbf8f2] p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-3xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone">Scene {scene.n} of {SCENES.length}</p>
                <h2 className="mt-1 font-heading text-[26px] leading-tight sm:text-[30px]">{scene.title}</h2>
                <p className="mt-1.5 text-[15px] leading-relaxed text-stone">{scene.purpose}</p>
              </div>
              <span className={cn(
                'rounded-full px-3 py-1 text-[12px] font-semibold',
                scene.still.needed ? 'bg-brass/20 text-brass-ink' : 'bg-ink text-ivory',
              )}>
                {scene.still.needed ? 'New still needed — after approval' : 'Real photo — ready'}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)_minmax(0,190px)]">
              {/* Sources */}
              <div>
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.18em] text-stone">Real source photos</h3>
                <ul className="mt-2 flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible">
                  {scene.sources.map((s) => (
                    <li key={s.image.src} className="w-[240px] shrink-0 lg:w-auto">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[3px] bg-white ring-1 ring-ink/10">
                        <Image src={s.image.src} alt={s.image.alt} fill sizes="(min-width: 1024px) 330px, 240px" className="object-cover" />
                      </div>
                      <p className="mt-1.5 text-[13px] leading-snug text-ink">{s.shows}</p>
                      {s.caveat && <p className="mt-0.5 text-[12.5px] leading-snug text-brass-ink">{s.caveat}</p>}
                      <p className="mt-0.5 text-[11.5px] leading-snug text-stone">{s.image.width}×{s.image.height} · {s.image.origin}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Desktop frame */}
              <figure>
                <figcaption className="text-[12px] font-semibold uppercase tracking-[0.18em] text-stone">Desktop</figcaption>
                <div className="mt-2"><FilmFrame scene={scene} format="desktop" /></div>
                <div className="mt-4 space-y-2 text-[14px] leading-relaxed">
                  <p><strong className="font-semibold">New still:</strong> <span className="text-stone">{scene.still.plan}</span></p>
                  <p><strong className="font-semibold">Status:</strong> <span className="text-stone">{scene.still.status}</span></p>
                  {scene.transitionOut && (
                    <p><strong className="font-semibold">Into the next scene:</strong> <span className="text-stone">{scene.transitionOut}</span></p>
                  )}
                </div>
              </figure>

              {/* Phone frame */}
              <figure className="mx-auto w-[60%] max-w-[220px] lg:w-full">
                <figcaption className="text-[12px] font-semibold uppercase tracking-[0.18em] text-stone">Phone</figcaption>
                <div className="mt-2"><FilmFrame scene={scene} format="phone" /></div>
              </figure>
            </div>
          </li>
        ))}
      </ol>

      <section className="mx-auto max-w-[1380px] px-4 pb-20 sm:px-6 lg:px-10" aria-labelledby="sb-next">
        <h2 id="sb-next" className="font-heading text-[28px]">What we need from you</h2>
        <ol className="mt-3 max-w-3xl list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-stone">
          <li><strong className="text-ink">Scene 1 photo.</strong> Is the close-up shirt shot (two pornstar martinis) the right opening? If you have its original file, send it — its grey thread may already be the silver you want.</li>
          <li><strong className="text-ink">Silver.</strong> Is silver a new thread for the shirts, or do some shirts already have it? The preview here is a hand recolour of a real photo, not a finished image.</li>
          <li><strong className="text-ink">Originals.</strong> Most photos online are 800–1024px. Originals (phone or photographer files) make the full-screen scenes sharp.</li>
          <li><strong className="text-ink">Client brands.</strong> Some event photos show client logos. Tell us which you’re happy to feature.</li>
          <li><strong className="text-ink">Budget for new stills.</strong> Only if scene 1 needs one: there’s no Bar People budget in OpenArt yet, so nothing has been spent.</li>
        </ol>
      </section>
    </div>
  );
}
