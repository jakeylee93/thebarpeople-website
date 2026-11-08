import { test } from 'node:test';
import assert from 'node:assert/strict';
import { panelBox, projectPoint, quadMatrix3d, type Point } from './perspective.ts';

const close = (a: Point, b: Point) => assert.ok(Math.hypot(a[0] - b[0], a[1] - b[1]) < 1e-6, `${a} ≈ ${b}`);

test('the box corners land exactly on the panel corners (perspective quad)', () => {
  const quad: Point[] = [[120, 80], [610, 160], [600, 700], [130, 560]];
  const w = 400, h = 300;
  close(projectPoint(w, h, quad, [0, 0]), quad[0]);
  close(projectPoint(w, h, quad, [w, 0]), quad[1]);
  close(projectPoint(w, h, quad, [w, h]), quad[2]);
  close(projectPoint(w, h, quad, [0, h]), quad[3]);
});

test('a parallelogram uses the affine shortcut and still maps the corners', () => {
  const quad: Point[] = [[0, 0], [100, 10], [100, 60], [0, 50]];
  close(projectPoint(10, 5, quad, [10, 5]), [100, 60]);
  close(projectPoint(10, 5, quad, [0, 5]), [0, 50]);
});

test('matrix3d is a 16-number CSS transform and panel size follows the sides', () => {
  const quad: Point[] = [[0, 0], [300, 0], [300, 100], [0, 100]];
  const m = quadMatrix3d(300, 100, quad);
  assert.match(m, /^matrix3d\(([-\d.e]+,){15}[-\d.e]+\)$/);
  assert.equal(m, 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)');
  assert.deepEqual(panelBox(quad), { w: 300, h: 100 });
});
