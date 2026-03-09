import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";

const serviceLinks = [
  { label: "All Inclusive Hire", href: "/services/all-inclusive" },
  { label: "Cash Bar Hire", href: "/services/cash-bar" },
  { label: "Dry Hire", href: "/services/dry-hire" },
  { label: "Staff Hire", href: "/services/staff-hire" },
  { label: "Event Management", href: "/services/event-management" },
];

const eventLinks = [
  { label: "Weddings", href: "/events/weddings" },
  { label: "Corporate Events", href: "/events/corporate" },
  { label: "Birthday Parties", href: "/events/birthday-parties" },
  { label: "Garden Parties", href: "/events/garden-parties" },
  { label: "Festivals", href: "/events/festivals" },
  { label: "Christmas Parties", href: "/events/christmas" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Our Bars", href: "/our-bars" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-[#060b16] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-[#c9956b] flex items-center justify-center flex-shrink-0">
                <span className="text-[#0a0f1c] font-bold text-sm">B</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[#faf8f5] font-bold text-sm tracking-[0.12em] uppercase">
                  The Bar People
                </span>
                <span className="text-[#c9956b] text-[10px] tracking-[0.2em] uppercase">
                  Est. 2014
                </span>
              </div>
            </div>
            <p className="text-[#9ca3af] text-sm leading-relaxed max-w-xs mb-6">
              London&apos;s premium mobile bar hire specialists. Pop-up bars, professional bartenders, and unforgettable experiences since 2014.
            </p>

            {/* Contact */}
            <div className="space-y-3">
              <div>
                <p className="text-[#faf8f5]/50 text-xs uppercase tracking-wider mb-1">
                  Corporate Events
                </p>
                <a
                  href="mailto:jake@thebarpeople.co.uk"
                  className="text-[#c9956b] text-sm hover:text-[#e0b48a] transition-colors block"
                >
                  jake@thebarpeople.co.uk
                </a>
                <a
                  href="tel:+447557402200"
                  className="text-[#faf8f5]/70 text-sm hover:text-[#faf8f5] transition-colors"
                >
                  07557 402200
                </a>
              </div>
              <div>
                <p className="text-[#faf8f5]/50 text-xs uppercase tracking-wider mb-1">
                  Private Events
                </p>
                <a
                  href="mailto:kim@thebarpeople.co.uk"
                  className="text-[#c9956b] text-sm hover:text-[#e0b48a] transition-colors block"
                >
                  kim@thebarpeople.co.uk
                </a>
                <a
                  href="tel:+447724601256"
                  className="text-[#faf8f5]/70 text-sm hover:text-[#faf8f5] transition-colors"
                >
                  07724 601256
                </a>
              </div>
              <div>
                <a
                  href="mailto:hello@thebarpeople.co.uk"
                  className="text-[#faf8f5]/50 text-sm hover:text-[#faf8f5] transition-colors"
                >
                  hello@thebarpeople.co.uk
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[#faf8f5] text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9ca3af] text-sm hover:text-[#c9956b] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div>
            <h3 className="text-[#faf8f5] text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Events
            </h3>
            <ul className="space-y-2.5">
              {eventLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9ca3af] text-sm hover:text-[#c9956b] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[#faf8f5] text-xs font-semibold uppercase tracking-[0.15em] mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#9ca3af] text-sm hover:text-[#c9956b] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[#faf8f5] font-medium mb-1">Stay in the loop</p>
              <p className="text-[#9ca3af] text-sm">
                Get event inspiration, seasonal menus, and exclusive offers.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#9ca3af] text-sm text-center sm:text-left">
            &copy; {new Date().getFullYear()} The Bar People Ltd. Company No. 12161824. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-[#9ca3af] text-sm hover:text-[#faf8f5] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-[#9ca3af] text-sm hover:text-[#faf8f5] transition-colors"
            >
              Terms
            </Link>
            <span className="text-[#9ca3af]/40 text-xs">Leytonstone, London</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
