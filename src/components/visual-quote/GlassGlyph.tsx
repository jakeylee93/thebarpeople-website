// Line drawings of each glass type, drawn for the quote builder (no photo
// library exists for individual glasses). Same thin-line language as the
// bar sketches. Decorative: the option label carries the name.

import type { GlassGlyph as Glyph } from '@/lib/visual-quote/catalogue';

const LIQUID = 'currentColor';

const shapes: Record<Glyph, React.ReactNode> = {
  highball: (
    <>
      <path d="M22 36 L23.6 84 H40.4 L42 36 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M21 16 L23.6 86 H40.4 L43 16" />
      <path d="M23.4 80 H40.6" />
      <path d="M36 10 L33 60" strokeWidth={1.1} />
    </>
  ),
  wine: (
    <>
      <path d="M19.5 32 C20 44 25 52 32 52 C39 52 44 44 44.5 32 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M18 12 C17.5 40 24 52 32 52 C40 52 46.5 40 46 12" />
      <path d="M32 52 V84" />
      <path d="M21 86 Q32 82 43 86" />
    </>
  ),
  flute: (
    <>
      <path d="M25.8 24 C26 40 28 50 32 52 C36 50 38 40 38.2 24 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M25 8 C25 40 27.5 51 32 53 C36.5 51 39 40 39 8" />
      <path d="M32 53 V84" />
      <path d="M23 86 Q32 82.5 41 86" />
      <circle cx="31" cy="40" r="0.9" />
      <circle cx="33.5" cy="33" r="0.8" />
      <circle cx="31.5" cy="28" r="0.7" />
    </>
  ),
  martini: (
    <>
      <path d="M18.5 22 H45.5 L32 42 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M13 16 L32 46 L51 16" />
      <path d="M32 46 V84" />
      <path d="M22 86 Q32 82.5 42 86" />
      <path d="M40 8 L34 30" strokeWidth={1.1} />
      <circle cx="34.6" cy="27.5" r="2.6" />
    </>
  ),
  margarita: (
    <>
      <path d="M14 24 C15 31 25 33 28 35 C25 39 27 45 32 46 C37 45 39 39 36 35 C39 33 49 31 50 24 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M11 18 C12 31 25 33 28 35 C25 39 27 45 32 47 C37 45 39 39 36 35 C39 33 52 31 53 18" />
      <path d="M32 47 V84" />
      <path d="M22 86 Q32 82.5 42 86" />
      <path d="M12 18 H52" strokeDasharray="1 2.4" strokeWidth={1.3} />
    </>
  ),
  gin: (
    <>
      <path d="M15.5 34 C16 50 22 58 32 58 C42 58 48 50 48.5 34 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M17 14 C11 44 19 60 32 60 C45 60 53 44 47 14" />
      <path d="M32 60 V84" />
      <path d="M22 86 Q32 82.5 42 86" />
      <circle cx="40" cy="40" r="4.2" />
      <path d="M40 35.8 V44.2 M35.8 40 H44.2" strokeWidth={0.9} />
    </>
  ),
  whisky: (
    <>
      <path d="M17.3 60 L18.4 78 H45.6 L46.7 60 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M16 44 L18.2 86 H45.8 L48 44" />
      <path d="M18.6 79 H45.4" strokeWidth={2.2} />
      <rect x="24" y="58" width="12" height="12" rx="1.5" transform="rotate(-12 30 64)" />
    </>
  ),
  pint: (
    <>
      <path d="M21.5 34 L23 86 H41 L42.5 34 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M19 12 L20.5 26 Q21.6 31 19.6 36 L23 87 H41 L44.4 36 Q42.4 31 43.5 26 L45 12" />
      <path d="M19.8 20 Q32 23 44.2 20" strokeWidth={1.1} />
    </>
  ),
  'half-pint': (
    <>
      <path d="M23 52 L24.2 86 H39.8 L41 52 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M21 36 L22.2 46 Q23 50 21.6 53 L24.2 87 H39.8 L42.4 53 Q41 50 41.8 46 L43 36" />
      <path d="M21.6 42 Q32 44.5 42.4 42" strokeWidth={1.1} />
    </>
  ),
  shot: (
    <>
      <path d="M24.4 70 L25.4 80 H38.6 L39.6 70 Z" fill={LIQUID} fillOpacity={0.12} stroke="none" />
      <path d="M23 60 L25.2 87 H38.8 L41 60" />
      <path d="M25.6 81 H38.4" strokeWidth={2.4} />
    </>
  ),
};

export default function GlassGlyph({ glyph, className }: { glyph: Glyph; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 96"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {shapes[glyph]}
    </svg>
  );
}

/** Ice, cool box and fridge — for the ice & storage step. Decorative. */
export function IceGlyph({ kind, className }: { kind: 'ice-bag' | 'igloo-box' | 'bar-fridge' | 'advice'; className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {kind === 'ice-bag' && (
        <>
          <path d="M18 18 Q32 12 46 18 L50 52 Q32 58 14 52 Z" fill="currentColor" fillOpacity={0.06} />
          <path d="M22 18 L26 12 M42 18 L38 12 M26 12 Q32 9 38 12" />
          <rect x="22" y="30" width="9" height="9" rx="1.5" transform="rotate(-10 26 34)" />
          <rect x="33" y="34" width="9" height="9" rx="1.5" transform="rotate(14 37 38)" />
          <rect x="26" y="42" width="8" height="8" rx="1.5" transform="rotate(4 30 46)" />
        </>
      )}
      {kind === 'igloo-box' && (
        <>
          <rect x="10" y="26" width="44" height="26" rx="4" fill="currentColor" fillOpacity={0.06} />
          <path d="M8 26 Q32 18 56 26" />
          <path d="M24 21 Q32 12 40 21" />
          <path d="M14 34 H50" strokeWidth={1.1} />
        </>
      )}
      {kind === 'bar-fridge' && (
        <>
          <rect x="16" y="10" width="32" height="44" rx="3" fill="currentColor" fillOpacity={0.06} />
          <rect x="20" y="14" width="24" height="36" rx="1.5" />
          <path d="M44 22 V34" strokeWidth={2} />
          <path d="M20 26 H44 M20 38 H44" strokeWidth={1} />
          <path d="M18 54 V58 M46 54 V58" />
        </>
      )}
      {kind === 'advice' && (
        <>
          <rect x="14" y="22" width="12" height="12" rx="2" transform="rotate(-12 20 28)" fill="currentColor" fillOpacity={0.06} />
          <rect x="30" y="30" width="12" height="12" rx="2" transform="rotate(10 36 36)" fill="currentColor" fillOpacity={0.06} />
          <path d="M44 14 Q52 14 52 21 Q52 26 46 27 V31" />
          <circle cx="46" cy="36" r="0.9" fill="currentColor" />
        </>
      )}
    </svg>
  );
}
