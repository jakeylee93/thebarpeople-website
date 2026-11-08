'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUILD_HREF, CONTACTS, NAV } from './data';

const subscribeScroll = (cb: () => void) => {
  window.addEventListener('scroll', cb, { passive: true });
  return () => window.removeEventListener('scroll', cb);
};
const isScrolled = () => window.scrollY > 24;

export const nhFocus =
  'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nh-ink';

export default function SiteHeader() {
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
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-6 md:h-20 lg:px-10">
        <Link href="/new" aria-label="The Bar People, home" className={cn('rounded-full', nhFocus)}>
          <Image
            src="/images/logos/bar-people-logo.png"
            alt=""
            width={1000}
            height={1000}
            preload
            className={cn('h-auto transition-[width] duration-300', scrolled ? 'w-11 md:w-12' : 'w-12 md:w-16')}
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} className={cn('rounded text-[15px] font-semibold text-white/90 transition hover:text-white', nhFocus)}>
              {l.label}
            </Link>
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
          className={cn('flex h-11 w-11 items-center justify-center rounded-full bg-white text-nh-ink md:hidden', nhFocus)}
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
        <div className="flex h-full flex-col px-5 pb-8 pt-4">
          <div className="flex items-center justify-between">
            <Image src="/images/logos/bar-people-logo.png" alt="The Bar People" width={1000} height={1000} className="h-auto w-12" />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={cn('flex h-11 w-11 items-center justify-center rounded-full bg-white text-nh-ink', nhFocus)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav aria-label="Main" className="mt-10 flex flex-col gap-1">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} className={cn('rounded py-2 font-nh-display text-[34px] font-bold tracking-tight', nhFocus)}>
                {l.label}
              </Link>
            ))}
          </nav>
          <a
            href={BUILD_HREF}
            onClick={() => setMenuOpen(false)}
            className={cn('mt-8 flex h-14 items-center justify-center rounded-full bg-white text-[17px] font-semibold text-nh-ink', nhFocus)}
          >
            Build your package
          </a>
          <div className="mt-auto space-y-1 text-[15px] text-white/70">
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
