// A pagoda marquee with a bar under it, drawn in the same style as the bar
// drawings (BarDiagram): thin dark outlines, white fills, a soft floor shadow,
// and the same camera, so the two sit happily on one page. Pure SVG.

import { useId } from 'react';
import { VIEW as CAMERA } from '@/lib/quote/diagram';
import { cn } from '@/lib/utils';

const INK = '#141414';

// The bar drawings' camera (src/lib/quote/diagram.ts), so the marquee and the bars match.
const rad = (deg: number) => (deg * Math.PI) / 180;
const COS_A = Math.cos(rad(CAMERA.azimuth)), SIN_A = Math.sin(rad(CAMERA.azimuth));
const COS_E = Math.cos(rad(CAMERA.elevation)), SIN_E = Math.sin(rad(CAMERA.elevation));

const VIEW = { width: 436, height: 428 } as const;
/** Pixels per metre, and where the middle of the floor lands. */
const SCALE = 66, ORIGIN_X = 212, ORIGIN_Y = 330;

type P2 = [number, number];
type Plan = [number, number];

/** Metres (x right, y away from the viewer, z up) to the drawing. */
function project(x: number, y: number, z: number): P2 {
  const xr = x * COS_A + y * SIN_A;
  const yr = -x * SIN_A + y * COS_A;
  return [ORIGIN_X + xr * SCALE, ORIGIN_Y - (z * COS_E + yr * SIN_E) * SCALE];
}
const n = (v: number) => v.toFixed(1);
const at = (p: P2) => `${n(p[0])} ${n(p[1])}`;
const points = (...ps: P2[]) => ps.map((p) => `${n(p[0])},${n(p[1])}`).join(' ');

// ─── The marquee, in metres ──────────────────────────────────────────────────
const HALF = 2.5; // a 5m square
const EAVE = 2.42;
const VALANCE = 0.3;
const PEAK = 4.95;
const FRONT_LEFT: Plan = [-HALF, -HALF], FRONT_RIGHT: Plan = [HALF, -HALF];
const BACK_RIGHT: Plan = [HALF, HALF], BACK_LEFT: Plan = [-HALF, HALF];

/** One side of the roof: two curved ridges sweeping up to the point. */
function roofSide(a: Plan, b: Plan): string {
  const pull = 0.34, sag = EAVE + 0.5;
  const peak = project(0, 0, PEAK);
  return [
    `M${at(project(a[0], a[1], EAVE))}`,
    `Q${at(project(a[0] * pull, a[1] * pull, sag))} ${at(peak)}`,
    `Q${at(project(b[0] * pull, b[1] * pull, sag))} ${at(project(b[0], b[1], EAVE))}`,
    'Z',
  ].join(' ');
}
/** The seam down the middle of a roof side. */
function roofSeam(a: Plan, b: Plan): string {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
  return `M${at(project(mx, my, EAVE))} Q${at(project(mx * 0.3, my * 0.3, EAVE + 0.75))} ${at(project(0, 0, PEAK))}`;
}
const valance = (a: Plan, b: Plan) =>
  points(project(a[0], a[1], EAVE - VALANCE), project(b[0], b[1], EAVE - VALANCE), project(b[0], b[1], EAVE), project(a[0], a[1], EAVE));
const leg = (c: Plan): [P2, P2] => [project(c[0], c[1], 0), project(c[0], c[1], EAVE - VALANCE + 0.03)];

// ─── The bar: two 1.5m sections, just inside the front ──────────────────────
const BAR = { half: 1.5, front: -1.55, back: -0.93, height: 1.08, top: 0.045, lip: 0.03 };
const panelTop = BAR.height - BAR.top;
const counter = (z: number): P2[] => [
  project(-BAR.half - BAR.lip, BAR.front - BAR.lip, z), project(BAR.half + BAR.lip, BAR.front - BAR.lip, z),
  project(BAR.half + BAR.lip, BAR.back + BAR.lip, z), project(-BAR.half - BAR.lip, BAR.back + BAR.lip, z),
];
const counterUnder = counter(panelTop), counterTop = counter(BAR.height);

const FLOOR = points(project(-HALF, -HALF, 0), project(HALF, -HALF, 0), project(HALF, HALF, 0), project(-HALF, HALF, 0));
const BAR_FRONT = points(project(-BAR.half, BAR.front, 0), project(BAR.half, BAR.front, 0), project(BAR.half, BAR.front, panelTop), project(-BAR.half, BAR.front, panelTop));
const BAR_END = points(project(BAR.half, BAR.front, 0), project(BAR.half, BAR.back, 0), project(BAR.half, BAR.back, panelTop), project(BAR.half, BAR.front, panelTop));
const BAR_SEAM = [project(0, BAR.front, 0), project(0, BAR.front, panelTop)];

/** A string of lights along the front. */
const LIGHTS: P2[] = Array.from({ length: 11 }, (_, i) => {
  const t = (i + 1) / 12;
  return project(-HALF + 2 * HALF * t, -HALF, EAVE - VALANCE - 0.05 - 0.1 * Math.sin(Math.PI * t));
});
const LIGHT_WIRE = `M${at(project(-HALF, -HALF, EAVE - VALANCE))} Q${at(project(0, -HALF, EAVE - VALANCE - 0.2))} ${at(project(HALF, -HALF, EAVE - VALANCE))}`;

const PEAK_FOOT = project(0, 0, PEAK), PEAK_TIP = project(0, 0, PEAK + 0.28);

function Leg({ at: c }: { at: Plan }) {
  const [a, b] = leg(c);
  const line = { x1: n(a[0]), y1: n(a[1]), x2: n(b[0]), y2: n(b[1]), strokeLinecap: 'round' as const };
  return (
    <>
      <line {...line} stroke={INK} strokeWidth="4.2" />
      <line {...line} stroke="#fff" strokeWidth="2.2" />
    </>
  );
}

export default function MarqueeDrawing({ className }: { className?: string }) {
  const soft = `${useId().replace(/[^a-zA-Z0-9]/g, '')}-soft`;
  const outline = { stroke: INK, strokeLinejoin: 'round' as const };
  return (
    <svg
      viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
      className={cn('block', className)}
      role="img"
      aria-label="A pagoda marquee with a pointed roof and a white bar under it"
    >
      <defs>
        <filter id={soft} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      {/* Floor and its shadow */}
      <polygon points={FLOOR} transform="translate(0 9)" fill="#000" opacity="0.2" filter={`url(#${soft})`} />
      <polygon points={FLOOR} fill="#fbfbfa" {...outline} strokeOpacity="0.55" strokeWidth="0.9" />

      {/* The far left leg is hidden behind the roof from this angle. */}
      <Leg at={BACK_RIGHT} />

      {/* Bar */}
      <polygon points={BAR_FRONT} transform="translate(0 5)" fill="#000" opacity="0.14" filter={`url(#${soft})`} />
      <polygon points={BAR_END} fill="#dedcd7" {...outline} strokeOpacity="0.55" strokeWidth="0.8" />
      <polygon points={BAR_FRONT} fill="#fff" {...outline} strokeOpacity="0.7" strokeWidth="0.9" />
      <line x1={n(BAR_SEAM[0][0])} y1={n(BAR_SEAM[0][1])} x2={n(BAR_SEAM[1][0])} y2={n(BAR_SEAM[1][1])} stroke={INK} strokeWidth="1.4" strokeOpacity="0.9" />
      <polygon points={points(counterUnder[1], counterUnder[2], counterTop[2], counterTop[1])} fill={INK} stroke={INK} strokeWidth="0.4" />
      <polygon points={points(counterUnder[0], counterUnder[1], counterTop[1], counterTop[0])} fill={INK} stroke={INK} strokeWidth="0.4" />
      <polygon points={points(...counterTop)} fill="#fbfbfa" {...outline} strokeWidth="1.1" />

      <Leg at={FRONT_LEFT} />
      <Leg at={FRONT_RIGHT} />

      {/* Valance, lights, then the roof from the far side to the near side */}
      <polygon points={valance(BACK_LEFT, FRONT_LEFT)} fill="#e3e1dc" {...outline} strokeOpacity="0.7" strokeWidth="0.9" />
      <polygon points={valance(FRONT_RIGHT, BACK_RIGHT)} fill="#e3e1dc" {...outline} strokeOpacity="0.7" strokeWidth="0.9" />
      <polygon points={valance(FRONT_LEFT, FRONT_RIGHT)} fill="#fdfdfc" {...outline} strokeOpacity="0.7" strokeWidth="0.9" />
      <path d={LIGHT_WIRE} fill="none" stroke={INK} strokeOpacity="0.55" strokeWidth="0.8" />
      {LIGHTS.map((p, i) => (
        <circle key={i} cx={n(p[0])} cy={n(p[1] + 3)} r="2.5" fill="#fff" stroke={INK} strokeOpacity="0.75" strokeWidth="0.9" />
      ))}

      <path d={roofSide(BACK_RIGHT, BACK_LEFT)} fill="#d9d7d2" {...outline} strokeOpacity="0.7" strokeWidth="1" />
      <path d={roofSide(BACK_LEFT, FRONT_LEFT)} fill="#ecebe7" {...outline} strokeOpacity="0.7" strokeWidth="1" />
      <path d={roofSide(FRONT_RIGHT, BACK_RIGHT)} fill="#e6e4df" {...outline} strokeOpacity="0.75" strokeWidth="1" />
      <path d={roofSeam(FRONT_RIGHT, BACK_RIGHT)} fill="none" stroke={INK} strokeOpacity="0.22" strokeWidth="0.9" />
      <path d={roofSide(FRONT_LEFT, FRONT_RIGHT)} fill="#fff" {...outline} strokeOpacity="0.8" strokeWidth="1.1" />
      <path d={roofSeam(FRONT_LEFT, FRONT_RIGHT)} fill="none" stroke={INK} strokeOpacity="0.22" strokeWidth="0.9" />

      <line x1={n(PEAK_FOOT[0])} y1={n(PEAK_FOOT[1])} x2={n(PEAK_TIP[0])} y2={n(PEAK_TIP[1])} stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={n(PEAK_TIP[0])} cy={n(PEAK_TIP[1])} r="3" fill="#fff" stroke={INK} strokeWidth="1.1" />
    </svg>
  );
}
