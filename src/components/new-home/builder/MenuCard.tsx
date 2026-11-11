// The all-inclusive menu as it stands: one row for each kind of drink.

import type { Quote } from '@/lib/quote/quote';
import { cn } from '@/lib/utils';

export default function MenuCard({ quote, className }: { quote: Quote; className?: string }) {
  if (quote.menu.length === 0) return null;
  return (
    <section aria-label="Your drinks menu" className={cn('rounded-[20px] bg-nh-ink px-5 py-4 text-white', className)}>
      <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/60 [font-family:var(--font-inter)]">Your menu</h3>
      <dl className="mt-2 grid gap-x-6 gap-y-1.5 text-[14px] leading-snug sm:grid-cols-2">
        {quote.menu.map((row) => (
          <div key={row.name} className="flex gap-2">
            <dt className="w-[7.5rem] shrink-0 font-semibold text-white/60">{row.name}</dt>
            <dd className="min-w-0">{row.drinks.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
