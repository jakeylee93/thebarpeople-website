// Vector drawings of the bars: one camera, one scale rule, every bar centred.
//
// A bar is a path of modules (1.5m sections, corner pieces, curved sections)
// walked along its customer side. This turns that path into flat shapes in a
// single fixed view, so every bar faces the same way. Each customer-facing
// panel comes with a transform from flat panel space (centimetres) to the
// drawing, so finishes and "your artwork here" sit on every panel.

import { barModules, type BarChoice } from './bars.ts';

// ─── Real-world sizes, in metres ────────────────────────────────────────────
export const BAR_DIMS = {
  section: 1.5,
  /** Face width of a 45° corner piece (about 0.5m each: six sections and two corners make "about 10m"). */
  corner: 0.56,
  /** Front to back. */
  depth: 0.6,
  /** Floor to counter top. */
  height: 1.1,
  /** Counter thickness (the black edge). */
  top: 0.045,
  /** How far the counter overhangs the panels. */
  lip: 0.03,
  /** Curved sections (Grumpy Joe's sectional system): eight make a 4m circle.
   *  The front panels sit at 1.95m radius with the counter overhanging to 2m. */
  curveRadius: 1.95,
  curveLip: 0.05,
  /** Black upright between curved sections. */
  curvePost: 0.03,
  /** Black plinth under the lit panel of an LED section, as a share of the panel height. */
  ledPlinth: 0.13,
  /** Flat facets used to draw each curved section. */
  curveFacets: 6,
} as const;

/** The one camera: turned 16° to show the right-hand end, looking down 22°. */
export const VIEW = { azimuth: 16, elevation: 22 } as const;

/** Every drawing uses this frame, in drawing units (1 unit = 1cm at full scale). */
export const FRAME = { width: 520, height: 340 } as const;

type V2 = [number, number];
type V3 = [number, number, number];

export interface PanelFacet {
  /** Affine map from flat panel space (cm; x along the panel, y down) to the drawing. */
  matrix: [number, number, number, number, number, number];
  /** This facet's slice of the panel, in cm from the panel's left edge. */
  u0: number;
  u1: number;
}

export interface Panel {
  /** Order along the bar. */
  index: number;
  kind: 'section' | 'corner' | 'curve';
  /** Flat size of the whole panel, cm. */
  width: number;
  height: number;
  /** One facet for flat panels, several for a curved one. Only facets that face the camera. */
  facets: PanelFacet[];
  /** 0 (in shadow) to 1 (fully lit), for shading. */
  light: number;
  /** Larger is further from the camera. */
  depth: number;
  /** Projected width ÷ flat width: below about 0.35 the panel is too side-on to read. */
  facing: number;
}

export interface Face {
  kind: 'inner' | 'cap' | 'edge';
  points: V2[];
  light: number;
  depth: number;
}

export interface BarGeometry {
  /** Customer-facing panels that face the camera, far to near. */
  panels: Panel[];
  /** Other upright faces that face the camera (inside of the bar, end caps, counter edge), far to near. */
  faces: Face[];
  /** The counter top as SVG path data (one shape, with a hole for closed bars). */
  top: string;
  /** Outline of the footprint on the floor, for the shadow. */
  floor: string;
  /** Lines where panels meet: a plain joint, either side of a corner piece, or the upright between curved sections. */
  seams: { line: [number, number, number, number]; kind: 'joint' | 'corner' | 'post' }[];
  /** Thin lines along the foot of the panels and at the ends of each run. */
  outline: [number, number, number, number][];
  /** Everything fits inside FRAME, centred. */
  scale: number;
}

const rad = (deg: number) => (deg * Math.PI) / 180;
const AZ = rad(VIEW.azimuth);
const EL = rad(VIEW.elevation);
const COS_A = Math.cos(AZ), SIN_A = Math.sin(AZ), COS_E = Math.cos(EL), SIN_E = Math.sin(EL);

/** World (x right, y away from the viewer, z up) → view (x right, y down) and depth. */
function project([x, y, z]: V3): { p: V2; depth: number } {
  const xr = x * COS_A + y * SIN_A;
  const yr = -x * SIN_A + y * COS_A;
  return { p: [xr, -(z * COS_E + yr * SIN_E)], depth: yr * COS_E - z * SIN_E };
}

/** True when a wall with this outward direction (in plan) faces the camera. */
const facesCamera = ([nx, ny]: V2) => -nx * SIN_A + ny * COS_A < -1e-9;

// Light comes from the front left.
const LIGHT: V2 = [-0.5, -0.866];
const lightOn = ([nx, ny]: V2) => Math.max(0, Math.min(1, 0.5 + 0.5 * (nx * LIGHT[0] + ny * LIGHT[1])));

interface Segment {
  a: V2; b: V2;
  dir: V2;
  /** Module this segment belongs to, and the module's kind. */
  module: number;
  kind: 'section' | 'corner' | 'curve';
  /** Distance along the module where this segment starts and ends, metres. */
  u0: number; u1: number;
}

const START_HEADING: Record<BarChoice['shapeId'], number> = {
  straight: 0, 'l-shape': 0, horseshoe: -90, island: 0, curved: -90, round: 0,
};

function walk(choice: BarChoice): { segments: Segment[]; closed: boolean; moduleWidths: number[] } {
  const { modules, closed } = barModules(choice);
  const segments: Segment[] = [];
  const moduleWidths: number[] = [];
  let heading = START_HEADING[choice.shapeId] ?? 0;
  let pos: V2 = [0, 0];
  const step = (length: number, module: number, kind: Segment['kind'], u0: number) => {
    const dir: V2 = [Math.cos(rad(heading)), Math.sin(rad(heading))];
    const next: V2 = [pos[0] + dir[0] * length, pos[1] + dir[1] * length];
    segments.push({ a: pos, b: next, dir, module, kind, u0, u1: u0 + length });
    pos = next;
  };
  modules.forEach((m, i) => {
    if (m.kind === 'section') {
      step(BAR_DIMS.section, i, 'section', 0);
      moduleWidths.push(BAR_DIMS.section);
    } else if (m.kind === 'corner') {
      heading += 45;
      step(BAR_DIMS.corner, i, 'corner', 0);
      heading += 45;
      moduleWidths.push(BAR_DIMS.corner);
    } else {
      const k = BAR_DIMS.curveFacets;
      const turn = m.degrees / k;
      const chord = 2 * BAR_DIMS.curveRadius * Math.sin(rad(turn / 2));
      for (let j = 0; j < k; j++) {
        heading += turn / 2;
        step(chord, i, 'curve', j * chord);
        heading += turn / 2;
      }
      moduleWidths.push(k * chord);
    }
  });
  return { segments, closed, moduleWidths };
}

/** Offsets the path by `distance` to the left of travel (towards the bartenders), mitring the joins. */
function offsetPath(segments: Segment[], closed: boolean, distance: number): V2[] {
  const left = (s: Segment): V2 => [-s.dir[1], s.dir[0]];
  const n = segments.length;
  const out: V2[] = [];
  for (let i = 0; i <= n; i++) {
    const prev = i > 0 ? segments[i - 1] : closed ? segments[n - 1] : null;
    const next = i < n ? segments[i] : closed ? segments[0] : null;
    const at = i < n ? segments[i].a : segments[n - 1].b;
    if (prev && next) {
      const n1 = left(prev), n2 = left(next);
      const k = distance / (1 + n1[0] * n2[0] + n1[1] * n2[1]);
      out.push([at[0] + (n1[0] + n2[0]) * k, at[1] + (n1[1] + n2[1]) * k]);
    } else {
      const nn = left((prev ?? next)!);
      out.push([at[0] + nn[0] * distance, at[1] + nn[1] * distance]);
    }
  }
  return out;
}

const fmt = (n: number) => (Math.round(n * 100) / 100).toString();
const pathOf = (pts: V2[]) => `M${pts.map((p) => `${fmt(p[0])} ${fmt(p[1])}`).join('L')}Z`;

export function barGeometry(choice: BarChoice): BarGeometry {
  const { segments, closed, moduleWidths } = walk(choice);
  const n = segments.length;
  const H = BAR_DIMS.height;
  const panelTop = H - BAR_DIMS.top;
  const outer: V2[] = [...segments.map((s) => s.a), segments[n - 1].b];
  const inner = offsetPath(segments, closed, BAR_DIMS.depth);
  const lip = offsetPath(segments, closed, segments[0].kind === 'curve' ? -BAR_DIMS.curveLip : -BAR_DIMS.lip);

  // Fit and centre: project every corner of the solid, then scale into the frame.
  const corners: V2[] = [];
  for (const ring of [lip, inner]) for (const [x, y] of ring) for (const z of [0, H]) corners.push(project([x, y, z]).p);
  const xs = corners.map((c) => c[0]), ys = corners.map((c) => c[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  // Small bars are drawn at up to this scale, so a 1.5m bar reads as smaller than a 3m one.
  const maxScale = (FRAME.width * 0.72) / 3.05;
  const scale = Math.min((FRAME.width * 0.92) / (maxX - minX), (FRAME.height * 0.84) / (maxY - minY), maxScale);
  const ox = FRAME.width / 2 - ((minX + maxX) / 2) * scale;
  const oy = FRAME.height / 2 - ((minY + maxY) / 2) * scale;
  const at = (v: V3): V2 => {
    const { p } = project(v);
    return [p[0] * scale + ox, p[1] * scale + oy];
  };
  const depthOf = (v: V3) => project(v).depth;

  const panelsByModule = new Map<number, Panel>();
  const faces: Face[] = [];
  const seams: BarGeometry['seams'] = [];
  const outline: BarGeometry['outline'] = [];
  const outwardOf = (seg: Segment): V2 => [seg.dir[1], -seg.dir[0]];
  const visibleOuter = (seg: Segment | null | undefined) => Boolean(seg && facesCamera(outwardOf(seg)));

  segments.forEach((s, i) => {
    const outward: V2 = [s.dir[1], -s.dir[0]];
    const mid: V3 = [(s.a[0] + s.b[0]) / 2, (s.a[1] + s.b[1]) / 2, H / 2];
    if (facesCamera(outward)) {
      // Customer-facing panel facet, in flat panel space (cm).
      const tl = at([s.a[0], s.a[1], panelTop]);
      const tr = at([s.b[0], s.b[1], panelTop]);
      const bl = at([s.a[0], s.a[1], 0]);
      const w = (s.u1 - s.u0) * 100, h = panelTop * 100;
      const matrix: PanelFacet['matrix'] = [(tr[0] - tl[0]) / w, (tr[1] - tl[1]) / w, (bl[0] - tl[0]) / h, (bl[1] - tl[1]) / h, tl[0], tl[1]];
      let panel = panelsByModule.get(s.module);
      if (!panel) {
        panel = { index: s.module, kind: s.kind, width: moduleWidths[s.module] * 100, height: h, facets: [], light: 0, depth: 0, facing: 0 };
        panelsByModule.set(s.module, panel);
      }
      panel.facets.push({ matrix, u0: s.u0 * 100, u1: s.u1 * 100 });
      // Counter edge above the panel.
      const la = lip[i], lb = lip[i + 1];
      faces.push({
        kind: 'edge',
        points: [at([la[0], la[1], H]), at([lb[0], lb[1], H]), at([lb[0], lb[1], panelTop]), at([la[0], la[1], panelTop])],
        light: lightOn(outward), depth: depthOf(mid) - 0.001,
      });
      // A seam where this module meets the next (not between the facets of one curve).
      const next = segments[i + 1] ?? (closed ? segments[0] : null);
      const prev = segments[i - 1] ?? (closed ? segments[n - 1] : null);
      const upright = (v: V2) => [...at([v[0], v[1], panelTop]), ...at([v[0], v[1], 0])] as [number, number, number, number];
      if (next && next.module !== s.module && visibleOuter(next)) {
        const kind = s.kind === 'curve' || next.kind === 'curve' ? 'post' : s.kind === 'corner' || next.kind === 'corner' ? 'corner' : 'joint';
        seams.push({ line: upright(s.b), kind });
      }
      outline.push([...bl, ...at([s.b[0], s.b[1], 0])] as [number, number, number, number]);
      if (!visibleOuter(prev)) outline.push(upright(s.a));
      if (!visibleOuter(next)) outline.push(upright(s.b));
    }
    const inward: V2 = [-outward[0], -outward[1]];
    if (facesCamera(inward)) {
      const qa = inner[i], qb = inner[i + 1];
      faces.push({
        kind: 'inner',
        points: [at([qa[0], qa[1], H]), at([qb[0], qb[1], H]), at([qb[0], qb[1], 0]), at([qa[0], qa[1], 0])],
        light: lightOn(inward),
        depth: depthOf([(qa[0] + qb[0]) / 2, (qa[1] + qb[1]) / 2, H / 2]),
      });
    }
  });

  for (const panel of panelsByModule.values()) {
    const segs = segments.filter((s) => s.module === panel.index);
    const first = segs[0], last = segs[segs.length - 1];
    const chord: V2 = [last.b[0] - first.a[0], last.b[1] - first.a[1]];
    const len = Math.hypot(chord[0], chord[1]);
    const outward: V2 = [chord[1] / len, -chord[0] / len];
    panel.light = lightOn(outward);
    panel.depth = depthOf([(first.a[0] + last.b[0]) / 2, (first.a[1] + last.b[1]) / 2, H / 2]);
    panel.facing = Math.abs(panel.facets.reduce((sum, f) => sum + f.matrix[0] * (f.u1 - f.u0), 0)) / panel.width / scale * 100;
  }

  if (!closed) {
    // Square ends.
    const ends: [V2, V2, V2][] = [
      [outer[0], inner[0], [-segments[0].dir[0], -segments[0].dir[1]]],
      [outer[n], inner[n], segments[n - 1].dir],
    ];
    for (const [p, q, normal] of ends) {
      if (!facesCamera(normal)) continue;
      faces.push({
        kind: 'cap',
        points: [at([p[0], p[1], H]), at([q[0], q[1], H]), at([q[0], q[1], 0]), at([p[0], p[1], 0])],
        light: lightOn(normal),
        depth: depthOf([(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, H / 2]),
      });
    }
  }

  const topOuter = lip.map(([x, y]) => at([x, y, H]));
  const topInner = inner.map(([x, y]) => at([x, y, H]));
  const top = closed
    ? `${pathOf(topOuter.slice(0, n))}${pathOf(topInner.slice(0, n).reverse())}`
    : pathOf([...topOuter, ...topInner.reverse()]);
  const floorOuter = outer.map(([x, y]) => at([x, y, 0]));
  const floorInner = inner.map(([x, y]) => at([x, y, 0]));
  const floor = closed ? pathOf(floorOuter.slice(0, n)) : pathOf([...floorOuter, ...floorInner.reverse()]);

  const byDepth = <T extends { depth: number }>(list: T[]) => list.sort((a, b) => b.depth - a.depth);
  return { panels: byDepth([...panelsByModule.values()]), faces: byDepth(faces), top, floor, seams, outline, scale };
}
