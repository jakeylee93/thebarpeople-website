'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Info, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2';
export const field = `mt-1.5 h-12 w-full rounded-xl border border-nh-line bg-white px-3 text-[16px] text-nh-ink ${ring}`;

/** − [n] + with a typed number in the middle. */
export function Counter({
  label, value, onChange, step = 1, min = 0, max = 9999, size = 'md',
}: {
  label: string; value: number; onChange: (n: number) => void;
  step?: number; min?: number; max?: number; size?: 'sm' | 'md' | 'xl';
}) {
  const id = useId();
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : min))));
  const big = size === 'xl';
  const small = size === 'sm';
  const btn = cn(
    'flex shrink-0 items-center justify-center rounded-full border border-nh-line bg-white text-nh-ink transition hover:border-nh-ink disabled:opacity-30 disabled:hover:border-nh-line',
    big ? 'h-14 w-14' : small ? 'h-9 w-9' : 'h-10 w-10',
    ring,
  );
  return (
    <div className={cn('flex items-center', big ? 'gap-4' : 'gap-1.5')}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <button type="button" className={btn} onClick={() => set(value - step)} disabled={value <= min} aria-label={`Fewer: ${label}`}>
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
        onFocus={(e) => e.currentTarget.select()}
        className={cn(
          'rounded-xl bg-transparent text-center font-nh-display font-extrabold tabular-nums tracking-tight [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          big ? 'w-36 text-[60px] leading-none' : small ? 'w-12 text-[17px]' : 'w-14 text-[19px]',
          ring,
        )}
      />
      <button type="button" className={btn} onClick={() => set(value + step)} disabled={value >= max} aria-label={`More: ${label}`}>
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
  return <p className={cn('text-[15px] leading-relaxed text-nh-ash', className)}>{children}</p>;
}

export function Badge({ children, tone = 'ink' }: { children: React.ReactNode; tone?: 'ink' | 'soft' }) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold leading-5',
      tone === 'ink' ? 'bg-nh-ink text-white' : 'bg-nh-mist text-nh-ink',
    )}>
      {children}
    </span>
  );
}

/** A small "i" that opens a short explanation. Works with tap, keyboard and hover. */
export function Hint({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', close); };
  }, [open]);
  return (
    <span ref={wrap} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className={cn('flex h-6 w-6 items-center justify-center rounded-full text-nh-ash transition hover:text-nh-ink', ring)}
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <span id={id} role="note" className="nh-pop absolute left-1/2 top-full z-20 mt-2 block w-64 -translate-x-1/2 rounded-xl bg-nh-ink px-3.5 py-2.5 text-left text-[13px] font-normal leading-snug text-white shadow-lg">
          {children}
        </span>
      )}
    </span>
  );
}

/** Pill buttons that behave as a set of radio buttons. */
export function Segmented<T extends string | number>({
  legend, name, value, options, onChange, className,
}: {
  legend: string; name: string; value: T; onChange: (v: T) => void; className?: string;
  options: { value: T; label: string; sub?: string; disabled?: boolean; marked?: boolean }[];
}) {
  return (
    <fieldset className={className}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={String(o.value)}
            className={cn(
              'relative cursor-pointer rounded-full border px-4 py-2 text-[15px] font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2',
              o.value === value ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white hover:border-nh-ink',
              o.disabled && 'cursor-not-allowed opacity-40 hover:border-nh-line',
            )}
          >
            <input type="radio" name={name} className="sr-only" checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)} />
            {o.label}
            {o.sub && <span className={cn('ml-1.5 font-normal', o.value === value ? 'text-white/75' : 'text-nh-ash')}>{o.sub}</span>}
            {o.marked && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-nh-ink" aria-hidden />}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
