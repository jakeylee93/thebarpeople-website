'use client';

// Gentle falling snow for the Christmas advert: a few dozen small, soft flakes
// on one canvas. It only draws while its section is on screen and the tab is
// showing, at about 30 frames a second, and not at all for reduced motion.

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface Flake {
  x: number; y: number;
  /** Radius in CSS pixels; bigger flakes are nearer, so they fall faster. */
  r: number;
  /** Fall speed, px per second. */
  speed: number;
  alpha: number;
  /** Side-to-side drift. */
  sway: number; swaySpeed: number; phase: number;
}

const FRAME_MS = 1000 / 30;

function makeFlake(w: number, h: number, anywhere: boolean): Flake {
  const depth = Math.random(); // 0 far, 1 near
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : -8,
    r: 0.9 + depth * 2.1,
    speed: 14 + depth * 26 + Math.random() * 6,
    alpha: 0.35 + depth * 0.45,
    sway: 6 + Math.random() * 14,
    swaySpeed: 0.25 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  };
}

/** One soft white dot, drawn once and stamped for every flake. */
function makeSprite(): HTMLCanvasElement {
  const s = document.createElement('canvas');
  s.width = s.height = 32;
  const g = s.getContext('2d');
  if (g) {
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.45, 'rgba(255,255,255,0.75)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
  }
  return s;
}

export default function Snow({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sprite = makeSprite();
    let flakes: Flake[] = [];
    let w = 0, h = 0;
    let onScreen = false;
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Sparse on purpose: about one flake per 160 x 160 px.
      const count = Math.max(22, Math.min(64, Math.round((w * h) / 25000)));
      flakes = Array.from({ length: count }, () => makeFlake(w, h, true));
    };

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const elapsed = now - last;
      if (elapsed < FRAME_MS) return;
      last = now;
      const dt = Math.min(elapsed, 100) / 1000;
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.speed * dt;
        f.phase += f.swaySpeed * dt;
        if (f.y - f.r * 2 > h) Object.assign(f, makeFlake(w, h, false));
        const x = f.x + Math.sin(f.phase) * f.sway;
        const size = f.r * 4; // the sprite fades out towards its edge
        ctx.globalAlpha = f.alpha;
        ctx.drawImage(sprite, x - size / 2, f.y - size / 2, size, size);
      }
    };

    const stop = () => { cancelAnimationFrame(frame); frame = 0; };
    const sync = () => {
      const run = onScreen && !document.hidden && !motion.matches;
      if (run && !frame) { last = performance.now(); frame = requestAnimationFrame(draw); }
      if (!run && frame) stop();
      if (motion.matches) ctx.clearRect(0, 0, w, h);
    };

    resize();
    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);
    const view = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; sync(); }, { threshold: 0.05 });
    view.observe(canvas);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);

    return () => {
      stop();
      sizes.disconnect();
      view.disconnect();
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={cn('pointer-events-none', className)} />;
}
