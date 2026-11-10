// Simple line drawings of marquee types, in the same style as the bar
// drawings: thin dark outlines, white fills, a soft floor shadow.

import { cn } from '@/lib/utils';

const INK = '#141414';

export default function MarqueeDiagram({ kind, className }: { kind: string; className?: string }) {
  return (
    <svg viewBox="0 0 320 210" className={cn('block h-auto', className)} aria-hidden>
      <ellipse cx="160" cy="186" rx="128" ry="12" fill="#000" opacity="0.1" />
      {kind === 'frame' ? <Frame /> : kind === 'stretch' ? <Stretch /> : <Pagoda />}
    </svg>
  );
}

const stroke = { stroke: INK, strokeWidth: 1.6, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** Pagoda ("Chinese hat"): square, with a tall pointed roof. */
function Pagoda() {
  return (
    <g {...stroke}>
      {/* walls */}
      <path d="M70 118 L160 140 L160 186 L70 164 Z" fill="#f4f3f0" />
      <path d="M160 140 L250 118 L250 164 L160 186 Z" fill="#ffffff" />
      {/* open doorway */}
      <path d="M186 133.6 L224 124.3 L224 170.3 L186 179.6 Z" fill="#dedcd6" />
      {/* roof: swept peak */}
      <path d="M160 22 C150 78 110 104 62 118 L160 142 Z" fill="#ecebe7" />
      <path d="M160 22 C170 78 210 104 258 118 L160 142 Z" fill="#ffffff" />
      <path d="M160 22 L160 142" fill="none" strokeWidth="1" opacity="0.5" />
      {/* valance */}
      <path d="M62 118 L160 142 L258 118" fill="none" />
      <path d="M160 14 L160 22" fill="none" />
    </g>
  );
}

/** Frame (clear-span) marquee: long, with a pitched roof and no centre poles. */
function Frame() {
  return (
    <g {...stroke}>
      <path d="M40 120 L150 146 L150 188 L40 162 Z" fill="#f4f3f0" />
      <path d="M150 146 L282 114 L282 156 L150 188 Z" fill="#ffffff" />
      {/* gable */}
      <path d="M40 120 L95 78 L150 146 Z" fill="#ecebe7" />
      {/* roof */}
      <path d="M95 78 L227 46 L282 114 L150 146 Z" fill="#ffffff" />
      <path d="M40 120 L95 78 L227 46" fill="none" />
      {/* bays */}
      <path d="M183 138 L183 180 M216 130 L216 172 M249 122 L249 164" fill="none" strokeWidth="1" opacity="0.5" />
      <path d="M128 112 L260 80" fill="none" strokeWidth="1" opacity="0.35" />
    </g>
  );
}

/** Stretch tent: a draped canopy on poles. */
function Stretch() {
  return (
    <g {...stroke}>
      <path d="M30 150 C70 96 110 70 150 58 C200 64 250 92 292 146 C250 128 215 122 180 130 C140 122 90 130 30 150 Z" fill="#ffffff" />
      <path d="M150 58 L150 180 M95 96 L95 176 M222 92 L222 174" fill="none" />
      <path d="M30 150 L18 176 M292 146 L304 172" fill="none" strokeWidth="1.2" />
    </g>
  );
}
