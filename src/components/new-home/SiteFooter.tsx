import Image from 'next/image';
import Link from 'next/link';
import { BUILD_HREF, CONTACTS, HERO_COPY, NAV, SOCIALS } from './data';

const link = 'rounded text-white/75 transition hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white';

export default function SiteFooter() {
  return (
    <footer className="bg-nh-ink text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-6 md:py-20 lg:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md">
            <Image src="/images/logos/bar-people-logo.png" alt="The Bar People" width={1000} height={1000} className="h-auto w-16" />
            <p className="mt-6 text-[30px] font-extrabold leading-[1.08] tracking-[-0.02em] [font-family:var(--font-nh-display)] md:text-[40px]">
              {HERO_COPY.headline}
            </p>
          </div>
          <a
            href={BUILD_HREF}
            className="inline-flex items-center justify-center rounded-full bg-white px-7 py-4 text-[16px] font-semibold text-nh-ink transition hover:bg-white/90 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nh-ink"
          >
            Build your package
          </a>
        </div>

        <div className="mt-14 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3">
          <nav aria-label="Footer">
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">Explore</p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {NAV.map((l) => <li key={l.href}><Link className={link} href={l.href}>{l.label}</Link></li>)}
            </ul>
          </nav>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">Talk to us</p>
            <ul className="mt-4 space-y-3 text-[15px]">
              {CONTACTS.map((c) => (
                <li key={c.email}>
                  <span className="font-semibold">{c.name}</span>
                  <br />
                  <a className={link} href={`tel:${c.tel}`}>{c.phone}</a> · <a className={link} href={`mailto:${c.email}`}>{c.email}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">Follow</p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {SOCIALS.map((s) => <li key={s.href}><a className={link} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 text-[13px] text-white/50 sm:flex-row sm:justify-between">
          <p>© 2026 The Bar People</p>
          <p className="flex gap-5">
            <Link className={link} href="/privacy">Privacy</Link>
            <Link className={link} href="/terms">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
