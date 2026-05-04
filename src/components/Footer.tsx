import Link from 'next/link';
import { services, eventTypes } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-warm-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold text-charcoal">The Bar People</h3>
            <p className="text-sm leading-relaxed text-muted">
              London&apos;s premium mobile bar hire specialists. Pop-up bars, professional
              bartenders, and unforgettable experiences since 2014.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-charcoal">Corporate Events</p>
              <p className="text-muted">
                <a href="mailto:jake@thebarpeople.co.uk" className="transition-colors hover:text-gold">
                  jake@thebarpeople.co.uk
                </a>{' '}
                ·{' '}
                <a href="tel:+447557402200" className="transition-colors hover:text-gold">
                  07557 402200
                </a>
              </p>
              <p className="mt-2 font-medium text-charcoal">Private Events</p>
              <p className="text-muted">
                <a href="mailto:kim@thebarpeople.co.uk" className="transition-colors hover:text-gold">
                  kim@thebarpeople.co.uk
                </a>{' '}
                ·{' '}
                <a href="tel:+447724601256" className="transition-colors hover:text-gold">
                  07724 601256
                </a>
              </p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
              Services
            </h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
              Events
            </h4>
            <ul className="space-y-2">
              {eventTypes.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/events/${e.slug}`}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-charcoal">
              Company
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/our-bars', label: 'Our Bars' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
                { href: '/quote', label: 'Get a Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-warm-border pt-8 sm:flex-row">
          <p className="text-xs text-muted">
            © 2026 The Bar People Ltd. Company No. 12161824. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted">
            <Link href="/privacy" className="transition-colors hover:text-gold">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-gold">Terms</Link>
            <span>Leytonstone, London</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
