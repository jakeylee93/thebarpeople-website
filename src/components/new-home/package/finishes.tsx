// The two finishes that need more than a flat colour to look real.
//
// Mirror: a real mirror shows what is around it, and because each panel of a
// bar faces a slightly different way, the reflection jumps at every joint.
// That jump, a horizon and the ground reflected below it are what make a
// mirror read as a mirror. So each panel shows the same surroundings (a
// garden, from a real photo), shifted by the way that panel faces.
//
// Shimmer: a sequin wall. Round mirror discs about 3cm across hang in rows on
// a black backing. Each disc catches the light at its own angle, so some are
// bright, some dark and a few flash white.
//
// Everything is in flat panel space, in centimetres. All random choices come
// from a fixed seed, so the server and the browser draw the same picture.

/** Height of a bar's front panel, cm (1.1m counter less the 4.5cm top). */
const PANEL_HEIGHT = 105.5;

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

/**
 * What the mirror shows: a garden, made from The Bar People's own lawn photo
 * (sky and willow trees above, lawn below), followed by its mirror image so it
 * repeats without a seam. 1440cm wide; 2cm of it per degree of turn.
 */
const ENV_IMAGE = '/images/new-home/mirror-surroundings.jpg';
const ENV_PERIOD = 1440;

export function MirrorDefs({ id }: { id: (name: string) => string }) {
  return (
    <>
      {/* The same surroundings as a fill, for mirror letters. */}
      <pattern id={id('m-env')} width={ENV_PERIOD} height={PANEL_HEIGHT} patternUnits="userSpaceOnUse" x={-180}>
        <image href={ENV_IMAGE} width={ENV_PERIOD} height={PANEL_HEIGHT} preserveAspectRatio="none" />
      </pattern>
      {/* A slightly cool, slightly dark glass, brightest across the middle. */}
      <linearGradient id={id('m-glass')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1d2a36" stopOpacity="0.16" />
        <stop offset="0.5" stopColor="#1d2a36" stopOpacity="0.02" />
        <stop offset="1" stopColor="#1d2a36" stopOpacity="0.18" />
      </linearGradient>
      <linearGradient id={id('m-streak')} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </>
  );
}

/** One copy of the surroundings. */
function Surroundings({ x, height }: { x: number; height: number }) {
  return <image href={ENV_IMAGE} x={x} y={0} width={ENV_PERIOD} height={height} preserveAspectRatio="none" />;
}

/**
 * A mirror panel's face, in flat panel space. `turn` is the way this part of
 * the panel faces (degrees); a turned mirror swings its reflection twice as far.
 */
export function MirrorFace({ id, width, height, turn }: { id: (name: string) => string; width: number; height: number; turn: number }) {
  const shift = (((turn * 2 * 2) % ENV_PERIOD) + ENV_PERIOD) % ENV_PERIOD;
  const streakAt = width * (0.2 + ((((turn + 90) * 7) % 60) + 60) % 60 / 100);
  return (
    <g>
      <rect width={width} height={height} fill="#c9cfd5" />
      {/* Enough copies to cover any panel after the shift. */}
      <Surroundings x={-shift} height={height} />
      <Surroundings x={ENV_PERIOD - shift} height={height} />
      {/* The dark line where the bar meets the floor, seen in the glass. */}
      <rect y={height - 3} width={width} height={3} fill="#3f474e" opacity="0.7" />
      <rect width={width} height={height} fill={`url(#${id('m-glass')})`} />
      {/* A soft reflection of a light across the glass; where it falls depends on the way the panel faces. */}
      <polygon points={`${streakAt},0 ${streakAt + 14},0 ${streakAt - 6},${height} ${streakAt - 20},${height}`} fill={`url(#${id('m-streak')})`} opacity="0.32" />
      {/* The polished edge of the glass. */}
      <rect x={0.4} y={0.4} width={width - 0.8} height={height - 0.8} fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="0.8" />
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

export { PANEL_HEIGHT };
