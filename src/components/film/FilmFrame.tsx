// A scaled desktop (16:9) or phone (9:16) frame for one storyboard scene.
// Text is real HTML typography sized in container units, so the frame looks
// the same at any size on the review board.

import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Scene } from './scenes';

export default function FilmFrame({ scene, format }: { scene: Scene; format: 'desktop' | 'phone' }) {
  const { frame, overlay } = scene;
  const desktop = format === 'desktop';
  const top = scene.n <= 2; // opening + quote heading sit high; later scenes sit low
  return (
    <div className={cn('@container relative overflow-hidden rounded-[6px] bg-ink text-ivory ring-1 ring-ink/15', desktop ? 'aspect-video' : 'aspect-[9/16]')}>
      <Image
        src={frame.image.src}
        alt=""
        fill
        sizes={desktop ? '(min-width: 1024px) 44vw, 92vw' : '(min-width: 1024px) 15vw, 45vw'}
        className="object-cover"
        style={{ objectPosition: desktop ? frame.desktop : frame.phone }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: desktop
            ? top
              ? 'linear-gradient(90deg, rgba(21,19,17,0.88) 0%, rgba(21,19,17,0.55) 36%, rgba(21,19,17,0) 66%)'
              : 'linear-gradient(0deg, rgba(21,19,17,0.86) 0%, rgba(21,19,17,0.35) 38%, rgba(21,19,17,0) 62%)'
            : top
              ? 'linear-gradient(180deg, rgba(21,19,17,0.86) 0%, rgba(21,19,17,0.3) 42%, rgba(21,19,17,0) 58%, rgba(21,19,17,0.72) 100%)'
              : 'linear-gradient(0deg, rgba(21,19,17,0.88) 0%, rgba(21,19,17,0.3) 44%, rgba(21,19,17,0) 64%)',
        }}
      />

      {scene.n === 1 && (
        <div className={cn('absolute flex items-center', desktop ? 'left-[3.5cqw] top-[3cqw] gap-[0.9cqw]' : 'left-[5cqw] top-[4cqw] gap-[2cqw]')}>
          <Image src="/images/logos/bar-people-logo.png" alt="" width={48} height={48} className={desktop ? 'h-[3.2cqw] w-[3.2cqw]' : 'h-[9cqw] w-[9cqw]'} />
          <span className={cn('font-heading', desktop ? 'text-[1.6cqw]' : 'text-[4.6cqw]')}>The Bar People</span>
        </div>
      )}

      <div
        className={cn(
          'absolute',
          desktop
            ? top ? 'left-[3.5cqw] top-1/2 w-[42%] -translate-y-1/2' : 'bottom-[4cqw] left-[3.5cqw] w-[56%]'
            : top ? 'inset-x-[5cqw] top-[18cqw]' : 'inset-x-[5cqw] bottom-[7cqw]',
        )}
      >
        {overlay.eyebrow && (
          <p className={cn('font-semibold uppercase text-brass', desktop ? 'text-[0.95cqw] tracking-[0.24em]' : 'text-[2.7cqw] tracking-[0.2em]')}>{overlay.eyebrow}</p>
        )}
        <p className={cn('font-heading leading-[1.03]', desktop ? 'mt-[0.8cqw] text-[3.9cqw]' : 'mt-[2cqw] text-[9.6cqw]')}>{overlay.title}</p>
        {overlay.sub && <p className={cn('text-ivory/85', desktop ? 'mt-[0.9cqw] text-[1.35cqw]' : 'mt-[2.4cqw] text-[3.9cqw]')}>{overlay.sub}</p>}
        {overlay.chips && (
          <div className={cn('flex flex-wrap', desktop ? 'mt-[1.4cqw] gap-[0.6cqw]' : 'mt-[3cqw] gap-[1.6cqw]')}>
            {overlay.chips.map((c, i) => (
              <span key={c} className={cn('rounded-full border', i === 0 ? 'border-ivory bg-ivory text-ink' : 'border-ivory/50', desktop ? 'px-[0.9cqw] py-[0.35cqw] text-[0.95cqw]' : 'px-[2.4cqw] py-[1cqw] text-[2.8cqw]')}>{c}</span>
            ))}
          </div>
        )}
      </div>

      {overlay.cta && (
        <span className={cn(
          'absolute inline-flex items-center justify-center rounded-full bg-ivory font-semibold text-ink',
          desktop ? 'bottom-[24%] left-[3.5cqw] h-[3.6cqw] px-[2cqw] text-[1.15cqw]' : 'inset-x-[5cqw] bottom-[6cqw] h-[11cqw] text-[3.8cqw]',
        )}>
          {overlay.cta}
        </span>
      )}

      <span className={cn('absolute rounded-sm bg-ink/75 font-medium text-ivory/90', desktop ? 'bottom-[1.4cqw] right-[1.4cqw] px-[0.6cqw] py-[0.3cqw] text-[0.85cqw]' : cn('right-[3cqw] max-w-[70%] px-[1.6cqw] py-[0.8cqw] text-right text-[2.3cqw] leading-tight', overlay.cta ? 'bottom-[20cqw]' : 'top-[3cqw]'))}>
        {frame.tag}
      </span>
    </div>
  );
}
