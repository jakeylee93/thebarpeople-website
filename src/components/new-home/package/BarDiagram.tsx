'use client';

// A bar drawn as a clean vector: the same camera for every shape, centred,
// in the finishes The Bar People really have, and (when branded) with "your
// artwork" on every customer-facing panel. Pure SVG, sharp at any size.
//
// Finishes follow the business's own photos: gloss white with black edging;
// flat mirror panels under a black top; a sequin shimmer wall on black; the
// LOVE bar (mirror letters on white); and the lit, colour-changing curved
// sections with a black plinth and uprights.

import { useEffect, useId, useRef, useState } from 'react';
import { barName, findFinish, normaliseBar, type BarChoice } from '@/lib/quote/bars';
import { BAR_DIMS, barGeometry, FRAME, VIEW, type Face, type Panel } from '@/lib/quote/diagram';
import { cn } from '@/lib/utils';

/** The smallest size, in screen pixels, at which words on the artwork panels are worth showing. */
const READABLE_PX = 9;
const READABLE_SMALL_PX = 8;

/** How wide the drawing is on screen, once it has been laid out. Null until then, or when it isn't being watched. */
function useWidthOnScreen(watch: boolean) {
  const ref = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!watch || !el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [watch]);
  return [ref, watch ? width : null] as const;
}

const INK = '#141414';
type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(' ')})`;

export default function BarDiagram({
  bar: choice,
  ledColour = '#ff3d9a',
  cycle = false,
  artworkText = 'auto',
  className,
  decorative = false,
}: {
  bar: BarChoice;
  /** Glow colour for the LED finish. */
  ledColour?: string;
  /** Slowly cycle the LED through its colours. */
  cycle?: boolean;
  /**
   * Words on the artwork panels ("Your artwork"). They are only ever drawn when
   * they would be big enough to read on screen; otherwise the picture icon
   * stands alone. False switches them off altogether.
   */
  artworkText?: boolean | 'auto';
  className?: string;
  /** True when the drawing only repeats nearby text. */
  decorative?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const bar = normaliseBar(choice);
  const geo = barGeometry(bar);
  const finish = bar.finishId;
  const curved = bar.shapeId === 'curved' || bar.shapeId === 'round';
  const id = (name: string) => `${uid}-${name}`;
  const label = `${barName(bar)}, ${findFinish(finish)?.name ?? ''} finish${bar.branded ? ', with your artwork on every panel' : ''}`;
  const wantWords = bar.branded && artworkText !== false;
  const [svgRef, widthOnScreen] = useWidthOnScreen(wantWords);
  // Screen pixels for one centimetre of panel height, in this drawing at this size.
  const pxPerCm = widthOnScreen === null ? 0 : (geo.scale * Math.cos((VIEW.elevation * Math.PI) / 180) / 100) * (widthOnScreen / FRAME.width);

  const draw = [
    ...geo.faces.map((face) => ({ depth: face.depth, face, panel: null as Panel | null })),
    ...geo.panels.map((panel) => ({ depth: panel.depth, face: null as Face | null, panel })),
  ].sort((a, b) => b.depth - a.depth);

  // The mirror and shimmer bars have a black top; the others a white one.
  const darkTop = !curved && (finish === 'mirror' || finish === 'shimmer');
  const darkInside = finish === 'led' || curved;
  const shadeMax = finish === 'white' || finish === 'love' ? 0.16 : finish === 'led' ? 0.08 : 0.3;

  const faceFill = (face: Face) => {
    if (face.kind === 'edge') return INK;
    if (face.kind === 'inner') return darkInside ? mix([30, 30, 30], [40, 40, 40], face.light) : mix([150, 148, 143], [214, 212, 207], face.light);
    if (finish === 'mirror') return mix([140, 148, 158], [214, 220, 226], face.light);
    // The shimmer wall is only on the front: the end of the bar stays white gloss, like the classic bar.
    if (finish === 'led') return INK;
    return mix([212, 211, 206], [250, 250, 249], face.light);
  };

  const plinth = finish === 'led' ? BAR_DIMS.ledPlinth : 0;
  const loveLetters = ['LO', 'VE'];

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${FRAME.width} ${FRAME.height}`}
      className={cn('block h-auto w-full', className)}
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
    >
      <defs>
        <linearGradient id={id('mirror')} x1="0" y1="0" x2="1" y2="0.6">
          <stop offset="0" stopColor="#bfc7cf" />
          <stop offset="0.16" stopColor="#f6f8f9" />
          <stop offset="0.34" stopColor="#aeb7c1" />
          <stop offset="0.55" stopColor="#e7ebee" />
          <stop offset="0.78" stopColor="#a3adb8" />
          <stop offset="1" stopColor="#dce1e6" />
        </linearGradient>
        <linearGradient id={id('ground')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.5" stopColor="#2f363d" stopOpacity="0" />
          <stop offset="1" stopColor="#2f363d" stopOpacity="0.36" />
        </linearGradient>
        {/* Sequin wall: round mirror discs hanging on a black backing. */}
        <pattern id={id('shimmer')} width="7" height="7" patternUnits="userSpaceOnUse">
          <rect width="7" height="7" fill="#0e0e0e" />
          <circle cx="1.75" cy="1.75" r="1.55" fill="#eef1f3" />
          <circle cx="5.25" cy="1.75" r="1.55" fill="#aab3bc" />
          <circle cx="1.75" cy="5.25" r="1.55" fill="#c9d0d6" />
          <circle cx="5.25" cy="5.25" r="1.55" fill="#f8f3e6" />
        </pattern>
        <linearGradient id={id('sheen')} x1="0" y1="0" x2="1" y2="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.25" stopColor="#000" stopOpacity="0.2" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.24" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>
        {/* Opal light box: brightest through the middle, deeper colour at the edges. */}
        <linearGradient id={id('opal')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
        <filter id={id('soft')} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id={id('glow')} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="15" />
        </filter>
      </defs>

      <path d={geo.floor} transform="translate(0 7)" fill="#000" opacity="0.2" filter={`url(#${id('soft')})`} />

      <g className={finish === 'led' && cycle ? 'nh-cycle' : undefined}>
        {finish === 'led' && (
          <g filter={`url(#${id('glow')})`} opacity="0.8" aria-hidden>
            <path d={geo.floor} transform="translate(0 8)" fill={ledColour} />
            {geo.panels.map((p) => p.facets.map((f, i) => (
              <g key={`${p.index}-${i}`} transform={`matrix(${f.matrix.map((n) => +n.toFixed(5)).join(' ')})`}>
                <rect x={0} y={0} width={f.u1 - f.u0} height={p.height} fill={ledColour} />
              </g>
            )))}
          </g>
        )}

        {draw.map(({ face, panel }, i) => {
          if (face) {
            return (
              <polygon key={`f${i}`} points={face.points.map((p) => p.map((n) => n.toFixed(2)).join(',')).join(' ')} fill={faceFill(face)}
                stroke={INK} strokeOpacity={face.kind === 'edge' ? 1 : curved ? 0 : 0.55} strokeWidth={face.kind === 'edge' ? 0.4 : 0.8} strokeLinejoin="round" />
            );
          }
          const p = panel!;
          const shade = (1 - p.light) * shadeMax;
          const litHeight = p.height * (1 - plinth);
          const fs = Math.min(15, p.width * 0.105);
          const showWords = wantWords && p.kind !== 'corner' && p.facing > 0.42 && fs * pxPerCm >= READABLE_PX;
          const showSmallWords = showWords && fs * 0.56 * pxPerCm >= READABLE_SMALL_PX;
          const artTop = 7, artBottom = (finish === 'led' ? litHeight : p.height) - 7;
          const artMid = (artTop + artBottom) / 2;
          return (
            <g key={`p${p.index}`}>
              {p.facets.map((f, j) => (
                <g key={j} transform={`matrix(${f.matrix.map((n) => +n.toFixed(5)).join(' ')})`}>
                  {/* A window onto this facet's slice of the flat panel (a hair wider, to hide the joins between facets). */}
                  <svg x={0} y={0} width={f.u1 - f.u0 + 0.6} height={p.height} viewBox={`${f.u0} 0 ${f.u1 - f.u0 + 0.6} ${p.height}`} preserveAspectRatio="none" overflow="hidden">
                    {finish === 'white' && <rect width={p.width} height={p.height} fill="#fff" />}
                    {finish === 'love' && (
                      <>
                        <rect width={p.width} height={p.height} fill="#fff" />
                        {p.kind === 'section' && loveLetters[p.index] && (
                          <text x={p.width / 2} y={p.height * 0.9} textAnchor="middle" fontSize={p.height * 1.02} fontWeight="900"
                            textLength={p.width * 0.86} lengthAdjust="spacingAndGlyphs" fill={`url(#${id('mirror')})`} stroke="#8c96a1" strokeWidth="0.6"
                            style={{ fontFamily: '"Arial Black", var(--font-nh-display), Impact, system-ui, sans-serif' }}>
                            {loveLetters[p.index]}
                          </text>
                        )}
                      </>
                    )}
                    {finish === 'mirror' && (
                      <>
                        <rect width={p.width} height={p.height} fill={`url(#${id('mirror')})`} />
                        <rect width={p.width} height={p.height} fill={`url(#${id('ground')})`} />
                        {/* Curved mirror bars are built from narrow upright mirror strips. */}
                        {p.kind === 'curve' && Array.from({ length: 14 }, (_, k) => (
                          <line key={k} x1={(p.width / 15) * (k + 1)} y1={0} x2={(p.width / 15) * (k + 1)} y2={p.height} stroke="#5c6670" strokeOpacity="0.55" strokeWidth="0.7" />
                        ))}
                      </>
                    )}
                    {finish === 'shimmer' && (
                      <>
                        <rect width={p.width} height={p.height} fill={`url(#${id('shimmer')})`} />
                        <rect width={p.width} height={p.height} fill={`url(#${id('sheen')})`} />
                      </>
                    )}
                    {finish === 'led' && (
                      <>
                        <rect width={p.width} height={litHeight} fill={ledColour} />
                        <rect width={p.width} height={litHeight} fill={`url(#${id('opal')})`} />
                        <rect y={litHeight} width={p.width} height={p.height - litHeight} fill={INK} />
                      </>
                    )}
                    {shade > 0.005 && <rect width={p.width} height={p.height} fill="#000" opacity={shade.toFixed(3)} />}
                    {bar.branded && (
                      <g>
                        <rect x={6} y={artTop} width={p.width - 12} height={artBottom - artTop} rx={3} fill="#fff" fillOpacity={finish === 'white' || finish === 'love' ? 0.72 : 0.92}
                          stroke={INK} strokeOpacity="0.55" strokeWidth="1.1" strokeDasharray="5 4" />
                        <g transform={`translate(${p.width / 2} ${artMid - (showWords ? fs * (showSmallWords ? 1.05 : 0.7) : 0)})`} stroke={INK} strokeOpacity="0.7" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <rect x={-9} y={-7.5} width={18} height={15} rx={2.5} />
                          <path d="M-9 4 L-3.5 -1.5 L1 3 L4 0.5 L9 5" />
                          <circle cx={4.2} cy={-3} r={1.6} />
                        </g>
                        {showWords && (
                          <text x={p.width / 2} y={artMid + fs * (showSmallWords ? 0.75 : 1.1)} textAnchor="middle" fontSize={fs} fontWeight="800" fill={INK}
                            style={{ fontFamily: 'var(--font-nh-display), system-ui, sans-serif', letterSpacing: '-0.02em' }}>
                            Your artwork
                          </text>
                        )}
                        {showSmallWords && (
                          <text x={p.width / 2} y={artMid + fs * 1.75} textAnchor="middle" fontSize={fs * 0.56} fill={INK} fillOpacity="0.62"
                            style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
                            Logo, names or a pattern
                          </text>
                        )}
                      </g>
                    )}
                  </svg>
                </g>
              ))}
            </g>
          );
        })}

        {geo.outline.map((s, i) => (
          <line key={`o${i}`} x1={s[0]} y1={s[1]} x2={s[2]} y2={s[3]} stroke={INK} strokeWidth="0.9" strokeOpacity={finish === 'led' ? 0.9 : 0.7} strokeLinecap="round" />
        ))}
        {geo.seams.map((s, i) => (
          <line key={i} x1={s.line[0]} y1={s.line[1]} x2={s.line[2]} y2={s.line[3]} stroke={INK}
            strokeWidth={s.kind === 'post' ? Math.max(2, BAR_DIMS.curvePost * geo.scale) : s.kind === 'corner' ? 2.4 : 1.3} />
        ))}
      </g>

      <path d={geo.top} fill={darkTop ? '#1b1b1b' : '#fbfbfa'} fillRule="evenodd" stroke={INK} strokeWidth="1.1" strokeLinejoin="round" />
      {darkTop && <path d={geo.top} fill="#fff" fillOpacity="0.07" fillRule="evenodd" />}
    </svg>
  );
}
