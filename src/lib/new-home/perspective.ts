// Map a flat w×h box onto any four-corner panel (a projective transform), so an
// HTML "Your artwork here" panel can sit on the front of a bar in a photo.

export type Point = [number, number];

/** 3×3 homography from the unit square to the quad (top-left, top-right, bottom-right, bottom-left). */
function squareToQuad([[x0, y0], [x1, y1], [x2, y2], [x3, y3]]: Point[]) {
  const sx = x0 - x1 + x2 - x3;
  const sy = y0 - y1 + y2 - y3;
  if (Math.abs(sx) < 1e-9 && Math.abs(sy) < 1e-9) {
    return { a: x1 - x0, b: x3 - x0, c: x0, d: y1 - y0, e: y3 - y0, f: y0, g: 0, h: 0 };
  }
  const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const h = (dx1 * sy - sx * dy1) / den;
  return {
    a: x1 - x0 + g * x1, b: x3 - x0 + h * x3, c: x0,
    d: y1 - y0 + g * y1, e: y3 - y0 + h * y3, f: y0,
    g, h,
  };
}

/** CSS matrix3d that maps a box of size w×h (transform-origin 0 0) onto the quad. */
export function quadMatrix3d(w: number, h: number, quad: Point[]): string {
  const m = squareToQuad(quad);
  const v = [m.a / w, m.d / w, 0, m.g / w, m.b / h, m.e / h, 0, m.h / h, 0, 0, 1, 0, m.c, m.f, 0, 1];
  return `matrix3d(${v.map((n) => +n.toFixed(8)).join(',')})`;
}

/** Where a point of the w×h box lands (for tests and placing labels). */
export function projectPoint(w: number, h: number, quad: Point[], [x, y]: Point): Point {
  const m = squareToQuad(quad);
  const u = x / w, v = y / h;
  const z = m.g * u + m.h * v + 1;
  return [(m.a * u + m.b * v + m.c) / z, (m.d * u + m.e * v + m.f) / z];
}

const dist = ([ax, ay]: Point, [bx, by]: Point) => Math.hypot(bx - ax, by - ay);

/** A box size close to the panel's own proportions, so text isn't squashed. */
export function panelBox(quad: Point[]): { w: number; h: number } {
  const [p0, p1, p2, p3] = quad;
  return { w: (dist(p0, p1) + dist(p3, p2)) / 2, h: (dist(p0, p3) + dist(p1, p2)) / 2 };
}
