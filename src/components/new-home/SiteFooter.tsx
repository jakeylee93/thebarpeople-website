import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { HomeContent } from '@/content/new-home';
import { BUILD_HREF, navOf } from './data';
import { av, avRow } from './av';

const link = 'inline-block rounded py-0.5 text-white/75 transition hover:text-white outline-none focus-visible:ring-2 focus-visible:ring-white';
const label = 'nh-eyebrow text-white/50';

// The last stop of the page: shorter than a screen, it snaps to the bottom.
export default function SiteFooter({ home, sections }: { home: HomeContent; /** The sections showing now (the editing preview can change them live). */ sections?: HomeContent['sections'] }) {
  const NAV = navOf(sections ?? home.sections);
  const { contacts: CONTACTS, socials: SOCIALS } = home.footer;
  const HERO_COPY = home.hero;
  return (
    <footer id="contact" className="nh-footer bg-nh-ink text-white">
      <div className="mx-auto max-w-[1600px] px-[var(--nh-gutter)] pb-5 pt-7 lg:pb-8 lg:pt-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="lg:max-w-xl">
            <Image src="/images/logos/bar-people-logo.png" alt="The Bar People" width={1000} height={1000} sizes="64px" className="hidden h-auto w-14 lg:block" />
            <p className="text-[26px] font-extrabold leading-[1.08] tracking-[-0.02em] [font-family:var(--font-nh-display)] lg:mt-5 lg:text-[40px]" {...av('nh_hero.headline')}>
              {HERO_COPY.headline}
            </p>
          </div>
          <a
            href={BUILD_HREF}
            className="group inline-flex h-[52px] items-center justify-center gap-3 rounded-full bg-white px-7 sm:self-start lg:self-auto text-[16px] font-semibold text-nh-ink transition hover:bg-white/90 outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-nh-ink"
          >
            <span {...av('nh_hero.cta_label')}>{HERO_COPY.cta}</span>
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-0.5" aria-hidden />
          </a>
        </div>

        <div className="mt-6 grid grid-cols-[auto_minmax(0,1fr)] gap-x-10 gap-y-6 border-t border-white/15 pt-5 lg:mt-10 lg:grid-cols-3 lg:pt-8">
          <nav aria-label="Footer">
            <p className={label} {...av('nh_footer.explore_heading')}>{home.footer.exploreHeading}</p>
            <ul className="mt-2.5 space-y-0.5 text-[15px] lg:mt-3.5 lg:space-y-1">
              {NAV.map((l) => <li key={l.id}><a className={link} href={l.href} {...av(`nh_menu.${l.id}_label`)}>{l.label}</a></li>)}
            </ul>
          </nav>
          <div>
            <p className={label} {...av('nh_footer.contact_heading')}>{home.footer.contactHeading}</p>
            <ul className="mt-2.5 space-y-1.5 text-[15px] leading-snug lg:mt-3.5 lg:space-y-2.5">
              {CONTACTS.map((c, i) => (
                <li key={c.email}>
                  <span className="font-semibold" {...avRow('nh_footer.contacts', i, 'name')}>{c.name}</span>
                  <br />
                  <a className={link} href={`tel:${c.tel}`}>{c.phone}</a>
                  <span aria-hidden className="hidden lg:inline"> · </span>
                  <br className="lg:hidden" />
                  <a className={link} href={`mailto:${c.email}`}>{c.email}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 lg:col-span-1">
            <p className={`${label} hidden lg:block`} {...av('nh_footer.follow_heading')}>{home.footer.followHeading}</p>
            <ul className="flex gap-6 text-[15px] lg:mt-3.5 lg:block lg:space-y-1">
              {SOCIALS.map((s) => <li key={s.href}><a className={link} href={s.href} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 text-[13px] text-white/50 lg:mt-10">
          <p>© 2026 The Bar People</p>
          <p className="flex gap-5">
            <Link className={`${link} py-1`} href="/privacy">Privacy</Link>
            <Link className={`${link} py-1`} href="/terms">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
