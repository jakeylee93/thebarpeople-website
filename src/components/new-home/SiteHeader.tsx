'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HomeContent } from '@/content/new-home';
import { BUILD_HREF, SCROLLER_ID, WHATSAPP_HREF, navOf } from './data';
import { av } from './av';

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

/** The WhatsApp mark, as a link that opens a chat with us. */
function WhatsApp({ className }: { className?: string }) {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noreferrer"
      aria-label="Message us on WhatsApp (opens WhatsApp)"
      className={cn('flex shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white transition hover:brightness-110', nhFocus, className)}
    >
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="currentColor" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
      </svg>
    </a>
  );
}

export default function SiteHeader({ activeId, sections, contacts: CONTACTS, cta }: {
  activeId?: string; sections: HomeContent['sections']; contacts: HomeContent['footer']['contacts']; cta: string;
}) {
  const NAV = navOf(sections);
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
              {...av(`nh_menu.${l.id}_label`)}
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
            {...av('nh_hero.cta_label')}
          >
            {cta}
          </a>
          <WhatsApp className="-ml-3 h-10 w-10 xl:-ml-4" />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <WhatsApp className={cn('transition-[width,height] duration-300', scrolled ? 'h-10 w-10' : 'h-11 w-11')} />
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={cn(
              'flex items-center justify-center rounded-full bg-white text-nh-ink transition-[width,height] duration-300',
              scrolled ? 'h-10 w-10' : 'h-11 w-11',
              nhFocus,
            )}
            aria-label="Open menu"
            aria-haspopup="dialog"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
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
                {...av(`nh_menu.${l.id}_label`)}
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
            {cta}
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
