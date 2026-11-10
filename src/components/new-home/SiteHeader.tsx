'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUILD_HREF, CONTACTS, NAV, SCROLLER_ID, type SectionId } from './data';

// The page scrolls inside the snap box (SnapPage), not the window, so the
// header watches that box to know when to turn solid.
const scroller = () => document.getElementById(SCROLLER_ID);
const subscribeScroll = (cb: () => void) => {
  const el = scroller();
  el?.addEventListener('scroll', cb, { passive: true });
  return () => el?.removeEventListener('scroll', cb);
};
const isScrolled = () => (scroller()?.scrollTop ?? 0) > 24;

export const nhFocus =
  'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nh-ink';

export default function SiteHeader({ activeId }: { activeId?: SectionId }) {
  const scrolled = useSyncExternalStore(subscribeScroll, isScrolled, () => false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (menuOpen && !d.open) d.showModal();
    if (!menuOpen && d.open) d.close();
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-colors duration-300',
        scrolled ? 'bg-nh-ink/85 backdrop-blur-md' : 'bg-gradient-to-b from-black/45 to-transparent',
      )}
    >
      {/* Once scrolled the bar is 56px (64px on desktop): the --nh-head every section starts below. */}
      <div
        className={cn(
          'mx-auto flex max-w-[1600px] items-center justify-between px-4 transition-[height] duration-300 sm:px-6 lg:px-10',
          scrolled ? 'h-14 lg:h-16' : 'h-16 lg:h-20',
        )}
      >
        <a href="#home" aria-label="The Bar People, back to the top" className={cn('rounded-full', nhFocus)}>
          <Image
            src="/images/logos/bar-people-logo.png"
            alt=""
            width={1000}
            height={1000}
            preload
            sizes="64px"
            className={cn('h-auto transition-[width] duration-300', scrolled ? 'w-10 lg:w-11' : 'w-12 lg:w-16')}
          />
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-9">
          {NAV.map((l) => (
            <a
              key={l.id}
              href={l.href}
              aria-current={l.id === activeId ? 'location' : undefined}
              className={cn(
                'rounded text-[15px] font-semibold text-white/80 underline-offset-[10px] transition hover:text-white aria-[current]:text-white aria-[current]:underline',
                nhFocus,
              )}
            >
              {l.label}
            </a>
          ))}
          <a
            href={BUILD_HREF}
            className={cn('rounded-full bg-white px-5 py-2.5 text-[15px] font-semibold text-nh-ink transition hover:bg-white/90', nhFocus)}
          >
            Build your package
          </a>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className={cn(
            'flex items-center justify-center rounded-full bg-white text-nh-ink transition-[width,height] duration-300 lg:hidden',
            scrolled ? 'h-10 w-10' : 'h-11 w-11',
            nhFocus,
          )}
          aria-label="Open menu"
          aria-haspopup="dialog"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setMenuOpen(false)}
        aria-label="Menu"
        className="m-0 h-[100dvh] max-h-none w-full max-w-none bg-nh-ink p-0 text-white backdrop:bg-black/60"
      >
        <div className="flex h-full flex-col overflow-y-auto px-5 pb-8 pt-4">
          <div className="flex items-center justify-between">
            <Image src="/images/logos/bar-people-logo.png" alt="The Bar People" width={1000} height={1000} sizes="48px" className="h-auto w-12" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={cn('flex h-11 w-11 items-center justify-center rounded-full bg-white text-nh-ink', nhFocus)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Main" className="mt-8 flex flex-col gap-0.5">
            {NAV.map((l) => (
              <a
                key={l.id}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={cn('rounded py-1.5 font-nh-display text-[clamp(26px,5.2dvh,34px)] font-bold tracking-tight', nhFocus)}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <a
            href={BUILD_HREF}
            onClick={() => setMenuOpen(false)}
            className={cn('mt-7 flex h-14 shrink-0 items-center justify-center rounded-full bg-white text-[17px] font-semibold text-nh-ink', nhFocus)}
          >
            Build your package
          </a>
          <div className="mt-auto space-y-1 pt-6 text-[15px] text-white/70">
            {CONTACTS.map((c) => (
              <p key={c.email}>
                {c.name} · <a className="underline-offset-4 hover:underline" href={`tel:${c.tel}`}>{c.phone}</a>
              </p>
            ))}
          </div>
        </div>
      </dialog>
    </header>
  );
}
