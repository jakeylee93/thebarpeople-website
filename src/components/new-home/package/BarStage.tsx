'use client';

// A clean white bar that can glow in an LED colour and wear "your artwork
// here" on its front panel. The bar is a cut-out render; colour is a multiply
// tint masked to the bar's own shape, plus a soft glow and floor light.

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { ImagePlus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BAR_ART, findLed, type LedId } from '@/lib/new-home/package';
import { panelBox, projectPoint, quadMatrix3d, type Point } from '@/lib/new-home/perspective';

export default function BarStage({
  barId,
  led = null,
  branded = false,
  alt,
  sizes,
  preload = false,
  className,
  style,
}: {
  barId: string;
  led?: LedId | null;
  branded?: boolean;
  alt: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const art = BAR_ART[barId];
  const colour = findLed(led);
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !branded) return;
    const ro = new ResizeObserver(([entry]) => setBox({ w: entry.contentRect.width, h: entry.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, [branded]);

  if (!art) return null;
  const mask: CSSProperties = {
    WebkitMaskImage: `url(${art.src})`, maskImage: `url(${art.src})`,
    WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
    WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
  };

  return (
    <div ref={boxRef} className={cn('relative isolate', className)} style={{ ...style, aspectRatio: `${art.width} / ${art.height}` }}>
      {/* contact shadow */}
      <div aria-hidden className="absolute inset-x-[6%] -bottom-[3%] h-[12%] rounded-[50%] bg-black/30 blur-xl" />
      <div className={cn('absolute inset-0', led === 'cycle' && 'nh-cycle')}>
        {colour && (
          <div aria-hidden className="absolute inset-x-0 -bottom-[12%] h-[34%] rounded-[50%] opacity-60 blur-2xl" style={{ background: colour.hex }} />
        )}
        <Image
          src={art.src}
          alt={alt}
          fill
          sizes={sizes}
          preload={preload}
          className="object-contain"
          style={colour ? { filter: `drop-shadow(0 0 10px ${colour.hex}) drop-shadow(0 0 38px ${colour.hex}aa)` } : undefined}
        />
        {colour && (
          <>
            <div aria-hidden className="absolute inset-0" style={{ ...mask, background: colour.hex, mixBlendMode: 'multiply', opacity: art.mirror ? 0.5 : 0.9 }} />
            <div aria-hidden className="absolute inset-0" style={{ ...mask, background: colour.hex, mixBlendMode: 'screen', opacity: 0.14 }} />
          </>
        )}
      </div>
      {branded && box && box.w > 0 && <Artwork panel={art.panel} box={box} />}
    </div>
  );
}

function Artwork({ panel, box }: { panel: Point[]; box: { w: number; h: number } }) {
  const quad = panel.map(([x, y]) => [(x / 100) * box.w, (y / 100) * box.h] as Point);
  const { w, h } = panelBox(quad);
  const transform = quadMatrix3d(w, h, quad);
  const [px, ty] = projectPoint(w, h, quad, [w / 2, 0]);
  // Keep the ~200px chip inside the stage on narrow phones.
  const tx = Math.min(Math.max(px, 104), box.w - 104);
  const fs = Math.max(11, Math.min(30, h * 0.12));
  return (
    <>
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: w, height: h, transform }}>
        <div className="nh-pop flex h-full w-full flex-col items-center justify-center gap-[6%] border-2 border-dashed border-nh-ink/40 bg-white/85 px-[6%] text-center">
          <ImagePlus className="text-nh-ink/70" style={{ width: fs * 1.4, height: fs * 1.4 }} />
          <span className="font-nh-display font-extrabold leading-none tracking-tight text-nh-ink" style={{ fontSize: fs }}>
            Your artwork here
          </span>
          <span className="leading-none text-nh-ash" style={{ fontSize: fs * 0.55 }}>Logo, names or a pattern</span>
        </div>
      </div>
      {/* Positioning transform on the outer box; the pop-in animation on the inner one
          (an animated transform would otherwise replace the positioning). */}
      <div className="pointer-events-none absolute z-10" style={{ left: tx, top: ty, transform: 'translate(-50%, calc(-100% - 12px))' }}>
        <div className="nh-pop relative">
          <div className="nh-glow-ring rounded-full p-[2px] shadow-[0_0_28px_rgba(155,92,255,0.55)]">
            <p className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-nh-ink px-3.5 py-1.5 text-[12.5px] font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" aria-hidden /> Free artwork service
            </p>
          </div>
          <span aria-hidden className="absolute top-full -mt-[5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-nh-ink" style={{ left: `calc(50% + ${px - tx}px)` }} />
        </div>
      </div>
    </>
  );
}
