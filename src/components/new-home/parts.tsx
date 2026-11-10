// Small pieces every homepage section shares: the pill button, the tick list
// and the focus rings for light and dark backgrounds.

import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUILD_HREF } from './data';

export type Tone = 'light' | 'dark';

/** Focus rings: `onLight` for white and mist sections, `onDark` for ink and photos. */
export const ring = {
  onLight: 'outline-none focus-visible:ring-2 focus-visible:ring-nh-ink focus-visible:ring-offset-2',
  onDark: 'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nh-ink',
} as const;

/** The main button of a section. Always a link to the builder (#build…). */
export function BuildButton({
  children,
  tone,
  href = BUILD_HREF,
  className,
  onClick,
}: {
  children: React.ReactNode;
  /** The background the button sits on. */
  tone: Tone;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'group inline-flex h-[52px] shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-full px-5 text-[15.5px] font-semibold transition sm:gap-3 sm:px-7 sm:text-[16px]',
        tone === 'dark'
          ? cn('bg-white text-nh-ink hover:bg-white/90', ring.onDark)
          : cn('bg-nh-ink text-white hover:bg-black', ring.onLight),
        className,
      )}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden />
    </a>
  );
}

/** Short points, each with a tick: a list, or two columns for a checklist. */
export function Points({
  items, tone, columns = false, compact = false, className,
}: {
  items: readonly string[];
  tone: Tone;
  columns?: boolean;
  /** A fixed small size (dialogs) instead of one that grows with the screen. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        compact ? 'text-[15px] leading-snug' : 'nh-points leading-snug',
        columns ? 'grid grid-cols-2 gap-x-4 gap-y-2.5 lg:gap-x-8 lg:gap-y-[0.85em]' : 'space-y-2 lg:space-y-[0.6em]',
        tone === 'dark' ? 'text-white/90' : 'text-nh-ink',
        className,
      )}
    >
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span
            aria-hidden
            className={cn(
              'mt-px flex h-[1.35em] w-[1.35em] shrink-0 items-center justify-center rounded-full',
              tone === 'dark' ? 'bg-white text-nh-ink' : 'bg-nh-ink text-white',
            )}
          >
            <Check className="h-[0.8em] w-[0.8em]" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
