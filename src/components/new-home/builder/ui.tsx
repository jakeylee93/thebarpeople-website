'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Info, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ring = 'outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2';
export const field = `mt-1.5 h-12 w-full rounded-xl border border-nh-line bg-white px-3 text-[16px] text-nh-ink ${ring}`;

// ─── Small things open on top of the builder (an info hint, say) ─────────────
// Escape should close the top one, not the whole builder. The builder asks
// here first when Escape is pressed.

const layers: Array<() => void> = [];

function pushLayer(close: () => void): () => void {
  layers.push(close);
  return () => {
    const i = layers.lastIndexOf(close);
    if (i >= 0) layers.splice(i, 1);
  };
}

/** Closes whatever is open on top. False when there was nothing to close. */
export function closeTopLayer(): boolean {
  const close = layers.pop();
  if (!close) return false;
  close();
  return true;
}

/**
 * − [n] + with a typed number in the middle.
 *
 * While someone is typing, the field holds exactly what they typed: the
 * smallest and largest allowed are only applied when they leave the field or
 * press Enter. (Applying them on every key turned a typed "150" into 1000.)
 * A typed number already inside the range updates the quote straight away.
 */
export function Counter({
  label, value, onChange, step = 1, min = 0, max = 9999, size = 'md',
}: {
  label: string; value: number; onChange: (n: number) => void;
  step?: number; min?: number; max?: number; size?: 'sm' | 'md' | 'xl';
}) {
  const id = useId();
  /** What is being typed; null when the field is showing the real value. */
  const [draft, setDraft] = useState<string | null>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : min)));
  const set = (n: number) => { setDraft(null); onChange(clamp(n)); };
  const settle = () => {
    if (draft === null) return;
    const typed = Number(draft);
    setDraft(null);
    if (draft.trim() !== '' && Number.isFinite(typed)) onChange(clamp(typed));
  };
  const big = size === 'xl';
  const small = size === 'sm';
  const btn = cn(
    'flex shrink-0 items-center justify-center rounded-full border border-nh-line bg-white text-nh-ink transition hover:border-nh-ink disabled:opacity-30 disabled:hover:border-nh-line',
    big ? 'h-14 w-14' : 'h-10 w-10',
    ring,
  );
  return (
    <div className={cn('flex items-center', big ? 'gap-4' : small ? 'gap-1' : 'gap-1.5')}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <button type="button" className={btn} onClick={() => set(value - step)} disabled={value <= min} aria-label={`Fewer: ${label}`}>
        <Minus className={big ? 'h-6 w-6' : 'h-4 w-4'} aria-hidden />
      </button>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        value={draft ?? String(value)}
        onChange={(e) => {
          const text = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 5);
          setDraft(text);
          const typed = Number(text);
          // A number inside the range updates the quote at once; one above it counts as the most we take.
          if (text !== '' && typed >= min) onChange(Math.min(typed, max));
        }}
        onBlur={settle}
        onKeyDown={(e) => {
          // Enter settles the number and selects it, so typing again replaces it.
          if (e.key === 'Enter') { e.preventDefault(); settle(); const box = e.currentTarget; requestAnimationFrame(() => box.select()); }
          else if (e.key === 'ArrowUp') { e.preventDefault(); set((draft !== null && draft !== '' ? Number(draft) : value) + step); }
          else if (e.key === 'ArrowDown') { e.preventDefault(); set((draft !== null && draft !== '' ? Number(draft) : value) - step); }
        }}
        onFocus={(e) => e.currentTarget.select()}
        className={cn(
          'rounded-xl bg-transparent text-center font-nh-display font-extrabold tabular-nums tracking-tight',
          big ? 'w-36 text-[60px] leading-none' : small ? 'h-10 w-11 text-[17px]' : 'h-10 w-14 text-[19px]',
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
  name, value, checked, onChange, children, className, disabled = false,
}: {
  name: string; value: string; checked: boolean; onChange: () => void; children: React.ReactNode; className?: string;
  /** Shown faded and skipped by the keyboard: the choice isn't available. */
  disabled?: boolean;
}) {
  return (
    <label
      className={cn(
        'relative block rounded-[18px] border-2 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2',
        checked ? 'border-nh-ink' : 'border-nh-line',
        disabled ? 'cursor-not-allowed opacity-55' : cn('cursor-pointer', !checked && 'hover:border-nh-ink/40'),
        className,
      )}
    >
      <input type="radio" name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="sr-only" />
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

const HINT_WIDTH = 256;

/** A small "i" that opens a short explanation. Works with tap and keyboard; Escape or a tap elsewhere closes it. */
export function Hint({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  /** Sideways nudge, in pixels, that keeps the note on the screen. */
  const [nudge, setNudge] = useState(0);
  const id = useId();
  const wrap = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    const drop = pushLayer(() => setOpen(false));
    return () => { document.removeEventListener('pointerdown', outside); drop(); };
  }, [open]);
  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!open) {
      const box = e.currentTarget.getBoundingClientRect();
      const ideal = box.left + box.width / 2 - HINT_WIDTH / 2;
      const kept = Math.max(12, Math.min(ideal, window.innerWidth - HINT_WIDTH - 12));
      setNudge(kept - ideal);
    }
    setOpen(!open);
  };
  return (
    <span ref={wrap} className="relative inline-flex align-middle">
      {/* The button is 40px to tap but takes the space of a 24px icon. */}
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={id}
        onClick={toggle}
        className={cn('-m-2 flex h-10 w-10 items-center justify-center rounded-full text-nh-ash transition hover:text-nh-ink', ring)}
      >
        <Info className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <span
          id={id}
          role="note"
          style={{ width: HINT_WIDTH, marginLeft: nudge }}
          className="nh-pop absolute left-1/2 top-full z-20 mt-3 block -translate-x-1/2 rounded-xl bg-nh-ink px-3.5 py-2.5 text-left text-[13px] font-normal leading-snug text-white shadow-lg"
        >
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
              'relative flex min-h-10 cursor-pointer items-center rounded-full border px-4 py-2 text-[15px] font-semibold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-nh-ink has-[:focus-visible]:ring-offset-2',
              o.value === value ? 'border-nh-ink bg-nh-ink text-white' : 'border-nh-line bg-white hover:border-nh-ink',
              o.disabled && 'cursor-not-allowed opacity-40 hover:border-nh-line',
            )}
          >
            <input type="radio" name={name} className="sr-only" checked={o.value === value} disabled={o.disabled} onChange={() => onChange(o.value)} />
            {o.label}
            {o.sub && (
              <>
                {/* A real separator, so it is read as "30 min, minimum", not "30 minminimum". */}
                <span className="sr-only">, </span>
                <span className={cn('ml-1.5 font-normal', o.value === value ? 'text-white/75' : 'text-nh-ash')}>{o.sub}</span>
              </>
            )}
            {o.marked && <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-nh-ink" aria-hidden />}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * A date box that is safe to type in. A half-typed year (the browser reports
 * "0002" after the first digit) or a date we can't take is never stored: the
 * box keeps what was typed and says what's wrong.
 */
export function DateField({
  label, value, onChange, min, max, className,
}: {
  label: string;
  /** The stored date, or null. */
  value: string | null;
  /** Called with a date we can take, or null. */
  onChange: (date: string | null) => void;
  /** Earliest and latest days we take, "YYYY-MM-DD". Undefined until the page knows today's date. */
  min?: string; max?: string;
  className?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  /** A real day inside the range we take. */
  const takes = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d) && !Number.isNaN(Date.parse(`${d}T00:00:00Z`)) && d >= '2020-01-01'
    && (min === undefined || d >= min) && (max === undefined || d <= max);
  // What was typed stays in the box while it is the stored date, or can't be
  // stored. If the stored date changes some other way ("Start again"), that wins.
  const shown = draft !== null && (draft === value || (value === null && !takes(draft))) ? draft : value ?? '';
  const problem = shown === '' || takes(shown) ? null
    : min !== undefined && /^\d{4}-\d{2}-\d{2}$/.test(shown) && shown >= '2020-01-01' && shown < min
      ? 'Please choose a date from tomorrow onwards. For anything sooner, call us.'
      : 'That date doesn’t look right. Please check the year.';
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-[14px] font-semibold">{label}</label>
      <input
        id={id}
        type="date"
        min={min}
        max={max}
        value={shown}
        aria-invalid={problem ? true : undefined}
        aria-describedby={problem ? `${id}-problem` : undefined}
        onChange={(e) => {
          const typed = e.currentTarget.value;
          setDraft(typed);
          onChange(takes(typed) ? typed : null);
        }}
        className={field}
      />
      {problem && <p id={`${id}-problem`} role="alert" className="mt-1.5 text-[13px] font-semibold text-[#a12b2b]">{problem}</p>}
    </div>
  );
}
