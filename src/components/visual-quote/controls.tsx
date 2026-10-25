'use client';

// Small accessible controls shared by the quote-builder steps.

import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const focusRing =
  'outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-ivory';

/** − [n] + with a typed input. `label` names the thing being counted. */
export function Stepper({
  label,
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  size = 'md',
  unit,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  unit?: string;
}) {
  const id = useId();
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : 0))));
  const btn = cn(
    'flex shrink-0 items-center justify-center rounded-full border border-ink/25 bg-white text-ink transition hover:border-ink disabled:opacity-30',
    size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
    focusRing,
  );
  return (
    <div className={cn('flex items-center', size === 'sm' ? 'gap-1.5' : 'gap-2')}>
      <button type="button" className={btn} onClick={() => set(value - step)} disabled={value <= min}
        aria-label={`Fewer: ${label}`}>
        <Minus size={size === 'lg' ? 18 : 15} aria-hidden="true" />
      </button>
      <label className="sr-only" htmlFor={id}>{label}</label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className={cn(
          'rounded-md border border-ink/15 bg-white text-center font-medium tabular-nums text-ink [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          size === 'lg' ? 'h-12 w-20 font-heading text-2xl' : size === 'sm' ? 'h-8 w-12 text-[14px]' : 'h-9 w-16 text-[15px]',
          focusRing,
        )}
      />
      <button type="button" className={btn} onClick={() => set(value + step)} disabled={value >= max}
        aria-label={`More: ${label}`}>
        <Plus size={size === 'lg' ? 18 : 15} aria-hidden="true" />
      </button>
      {unit && <span className="text-[13px] text-stone">{unit}</span>}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children?: React.ReactNode }) {
  if (!children) return null;
  return <p id={id} className="mt-1.5 text-[13px] font-medium text-[#9b2c1f]">{children}</p>;
}

export const inputClass = cn(
  'h-12 w-full rounded-md border border-ink/20 bg-white px-3.5 text-[16px] text-ink placeholder:text-stone/70 aria-[invalid=true]:border-[#9b2c1f]',
  focusRing,
);

export const labelClass = 'mb-1.5 block text-[13px] font-semibold text-ink';

/** Small honest tag shown on images: "Layout sketch", "Illustration", "Real event". */
export function ImageTag({ children, tone = 'light' }: { children: React.ReactNode; tone?: 'light' | 'dark' }) {
  return (
    <span className={cn(
      'pointer-events-none absolute bottom-2.5 left-2.5 rounded-sm px-2 py-1 text-[11px] font-medium tracking-wide',
      tone === 'light' ? 'bg-white/90 text-ink' : 'bg-ink/75 text-ivory',
    )}>
      {children}
    </span>
  );
}
