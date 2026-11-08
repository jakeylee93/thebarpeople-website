'use client';

import { useId } from 'react';
import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2';

/** − [n] + with a typed number in the middle. */
export function Counter({
  label, value, onChange, step = 1, min = 0, max = 9999, size = 'md', hideLabel = true,
}: {
  label: string; value: number; onChange: (n: number) => void;
  step?: number; min?: number; max?: number; size?: 'md' | 'xl'; hideLabel?: boolean;
}) {
  const id = useId();
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : 0))));
  const big = size === 'xl';
  const btn = cn(
    'flex shrink-0 items-center justify-center rounded-full border border-nh-line bg-white text-nh-ink transition hover:border-nh-ink disabled:opacity-30',
    big ? 'h-14 w-14' : 'h-10 w-10',
    ring,
  );
  return (
    <div className={cn('flex items-center', big ? 'gap-4' : 'gap-2')}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'mr-1 text-[14px] font-semibold'}>{label}</label>
      <button type="button" className={btn} onClick={() => set(value - step)} disabled={value <= min} aria-label={`Fewer ${label.toLowerCase()}`}>
        <Minus className={big ? 'h-6 w-6' : 'h-4 w-4'} aria-hidden />
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(e.currentTarget.valueAsNumber)}
        className={cn(
          'rounded-xl bg-transparent text-center font-nh-display font-extrabold tabular-nums tracking-tight [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          big ? 'w-32 text-[56px] leading-none' : 'w-16 text-[20px]',
          ring,
        )}
      />
      <button type="button" className={btn} onClick={() => set(value + step)} disabled={value >= max} aria-label={`More ${label.toLowerCase()}`}>
        <Plus className={big ? 'h-6 w-6' : 'h-4 w-4'} aria-hidden />
      </button>
    </div>
  );
}

/** A card that behaves as a radio button. */
export function RadioCard({
  name, value, checked, onChange, children, className,
}: {
  name: string; value: string; checked: boolean; onChange: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <label
      className={cn(
        'relative block cursor-pointer rounded-[18px] border-2 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2',
        checked ? 'border-nh-ink' : 'border-nh-line hover:border-nh-ink/40',
        className,
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      {children}
    </label>
  );
}

export function Note({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('text-[14px] leading-relaxed text-nh-ash', className)}>{children}</p>;
}
