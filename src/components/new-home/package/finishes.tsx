// The two finishes that need more than a flat colour to look real.
//
// Mirror: polished silver. It shows no scene (Jake, 11 Nov 2026: it should
// look like a shiny mirror, not a reflection of a field). What makes it read
// as mirror is a bright band of light high on the glass, a darker band where
// the floor would be, soft diagonal glints, and the light falling in a
// different place on each panel because each faces a different way.
//
// Shimmer: a sequin wall. Round mirror discs about 3cm across hang in rows on
// a black backing. Each disc catches the light at its own angle, so some are
// bright, some dark and a few flash white.
//
// Everything is in flat panel space, in centimetres. All random choices come
// from a fixed seed, so the server and the browser draw the same picture.

const round2 = (n: number) => Math.round(n * 100) / 100;

/** A small, fixed sequence of "random" numbers. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Mirror ──────────────────────────────────────────────────────────────────

export function MirrorDefs({ id }: { id: (name: string) => string }) {
  return (
    <>
      {/* Top to bottom: bright sky-light, a soft horizon, the darker floor, a lift at the foot. */}
      <linearGradient id={id('m-silver')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f7f9fa" />
        <stop offset="0.3" stopColor="#dfe4e8" />
        <stop offset="0.47" stopColor="#c2c9cf" />
        <stop offset="0.5" stopColor="#8f989f" />
        <stop offset="0.56" stopColor="#a4acb3" />
        <stop offset="0.9" stopColor="#ccd2d7" />
        <stop offset="1" stopColor="#aab1b8" />
      </linearGradient>
      {/* The same silver as a fill for mirror letters. */}
      <linearGradient id={id('m-env')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f7f9fa" />
        <stop offset="0.45" stopColor="#c6cdd3" />
        <stop offset="0.5" stopColor="#8f989f" />
        <stop offset="0.6" stopColor="#aab2b9" />
        <stop offset="1" stopColor="#d5dade" />
      </linearGradient>
      <linearGradient id={id('m-streak')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id={id('m-shade')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#27323c" stopOpacity="0.2" />
        <stop offset="0.5" stopColor="#27323c" stopOpacity="0" />
        <stop offset="1" stopColor="#27323c" stopOpacity="0.16" />
      </linearGradient>
    </>
  );
}

/**
 * A mirror panel's face, in flat panel space. `turn` is the way this part of
 * the panel faces (degrees): it moves the glints, so no two panels match.
 */
export function MirrorFace({ id, width, height, turn }: { id: (name: string) => string; width: number; height: number; turn: number }) {
  const at = (((turn + 90) * 7) % 55 + 55) % 55 / 100;
  const wide = width * (0.18 + at);
  const thin = width * (0.62 + at * 0.4);
  const lean = height * 0.42;
  return (
    <g>
      <rect width={width} height={height} fill={`url(#${id('m-silver')})`} />
      <rect width={width} height={height} fill={`url(#${id('m-shade')})`} />
      {/* Glints: one broad, one narrow, leaning the same way. */}
      <polygon points={`${wide},0 ${wide + width * 0.2},0 ${wide + width * 0.2 - lean},${height} ${wide - lean},${height}`} fill={`url(#${id('m-streak')})`} opacity="0.55" />
      <polygon points={`${thin},0 ${thin + width * 0.06},0 ${thin + width * 0.06 - lean},${height} ${thin - lean},${height}`} fill={`url(#${id('m-streak')})`} opacity="0.5" />
      {/* The polished edge of the glass. */}
      <rect x={0.4} y={0.4} width={width - 0.8} height={height - 0.8} fill="none" stroke="#ffffff" strokeOpacity="0.65" strokeWidth="0.9" />
    </g>
  );
}

// ─── Shimmer ─────────────────────────────────────────────────────────────────

/** Disc spacing and size, cm: about 40 columns across a 1.5m panel, as in the photos. */
const PITCH = 3.75;
const DISC_R = 1.78;
/** The repeating block of discs: 60 x 60cm, large enough that the repeat isn't noticed. */
const TILE = 60;

/** How each disc catches the light: mostly silver, some dark, a few flashing white or warm. */
const DISC_TONES: { light: string; base: string; weight: number }[] = [
  { light: '#5d646b', base: '#23272b', weight: 0.13 },
  { light: '#8d959c', base: '#41474d', weight: 0.14 },
  { light: '#c3c9ce', base: '#7a8188', weight: 0.22 },
  { light: '#e6eaed', base: '#a6adb4', weight: 0.24 },
  { light: '#ffffff', base: '#cfd5da', weight: 0.19 },
  { light: '#f6efe0', base: '#b8ae98', weight: 0.04 },
  { light: '#ffffff', base: '#f3f5f6', weight: 0.04 },
];

const DISCS = (() => {
  const rand = seeded(7);
  const pick = () => {
    let r = rand();
    for (let i = 0; i < DISC_TONES.length; i++) {
      r -= DISC_TONES[i].weight;
      if (r <= 0) return i;
    }
    return 2;
  };
  const out: { cx: number; cy: number; tone: number; tilt: number }[] = [];
  const n = TILE / PITCH;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      out.push({
        cx: round2(PITCH / 2 + col * PITCH),
        // Discs hang from a peg and swing a little.
        cy: round2(PITCH / 2 + row * PITCH + (rand() - 0.5) * 0.5),
        tone: pick(),
        // Turned discs look slightly oval.
        tilt: round2(0.78 + rand() * 0.22),
      });
    }
  }
  return out;
})();

/** Bright flashes: a few discs catching the light full on. */
const GLINTS = DISCS.filter((_, i) => i % 23 === 5);

export function ShimmerDefs({ id }: { id: (name: string) => string }) {
  return (
    <>
      {DISC_TONES.map((t, i) => (
        <radialGradient key={i} id={id(`s-disc-${i}`)} cx="0.38" cy="0.32" r="0.75">
          <stop offset="0" stopColor={t.light} />
          <stop offset="1" stopColor={t.base} />
        </radialGradient>
      ))}
      <pattern id={id('s-wall')} width={TILE} height={TILE} patternUnits="userSpaceOnUse">
        <rect width={TILE} height={TILE} fill="#0b0b0c" />
        {DISCS.map((d, i) => (
          <ellipse key={i} cx={d.cx} cy={d.cy} rx={round2(DISC_R * d.tilt)} ry={DISC_R} fill={`url(#${id(`s-disc-${d.tone}`)})`} />
        ))}
        {GLINTS.map((d, i) => (
          <g key={`g${i}`} transform={`translate(${d.cx} ${d.cy})`}>
            <circle r={DISC_R * 0.8} fill="#fff" />
            <path d="M-2.6 0 L2.6 0 M0 -2.6 L0 2.6" stroke="#fff" strokeWidth="0.3" strokeLinecap="round" opacity="0.7" />
          </g>
        ))}
      </pattern>
      {/* The wall ripples: a soft swell of light and a little shade across each panel. */}
      <radialGradient id={id('s-swell')} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={id('s-shade')} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.22" />
      </linearGradient>
    </>
  );
}

/** A shimmer panel's face. Each panel starts the discs at a different place, so neighbours don't match. */
export function ShimmerFace({ id, width, height, index }: { id: (name: string) => string; width: number; height: number; index: number }) {
  const ox = (index * 21) % TILE;
  const oy = (index * 33) % TILE;
  return (
    <g>
      <g transform={`translate(${-ox} ${-oy})`}>
        <rect x={ox} y={oy} width={width} height={height} fill={`url(#${id('s-wall')})`} />
      </g>
      {/* Where the swell of light falls changes from panel to panel. */}
      <ellipse cx={width * (0.25 + ((index * 37) % 50) / 100)} cy={height * 0.38} rx={width * 0.45} ry={height * 0.55} fill={`url(#${id('s-swell')})`} />
      <rect width={width} height={height} fill={`url(#${id('s-shade')})`} />
    </g>
  );
}

