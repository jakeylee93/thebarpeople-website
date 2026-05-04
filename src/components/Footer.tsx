import Link from 'next/link';
import { services, eventTypes } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t border-pale bg-faint">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h3 className="font-heading text-xl font-bold">The Bar People</h3>
            <p className="text-sm leading-relaxed text-mid">
              Premium mobile bar hire. Pop-up bars, professional bartenders,
              and unforgettable experiences since 2014.
            </p>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Corporate Events</p>
              <p className="text-mid">
                <a href="mailto:jake@thebarpeople.co.uk" className="transition-colors hover:text-black">jake@thebarpeople.co.uk</a>
                {' · '}
                <a href="tel:+447557402200" className="transition-colors hover:text-black">07557 402200</a>
              </p>
              <p className="mt-2 font-medium">Private Events</p>
              <p className="text-mid">
                <a href="mailto:kim@thebarpeople.co.uk" className="transition-colors hover:text-black">kim@thebarpeople.co.uk</a>
                {' · '}
                <a href="tel:+447724601256" className="transition-colors hover:text-black">07724 601256</a>
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-light">Services</h4>
            <ul className="space-y-2">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="text-sm text-mid transition-colors hover:text-black">{s.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-light">Events</h4>
            <ul className="space-y-2">
              {eventTypes.map((e) => (
                <li key={e.slug}>
                  <Link href={`/events/${e.slug}`} className="text-sm text-mid transition-colors hover:text-black">{e.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-light">Company</h4>
            <ul className="space-y-2">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/our-bars', label: 'Our Bars' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
                { href: '/quote', label: 'Get a Quote' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-mid transition-colors hover:text-black">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-pale pt-8 sm:flex-row">
          <p className="text-xs text-light">© 2026 The Bar People Ltd. Company No. 12161824.</p>
          <div className="flex items-center gap-4 text-xs text-light">
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
            <span>Leytonstone, London</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
