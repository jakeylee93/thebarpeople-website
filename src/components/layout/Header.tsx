"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

const navLinksLeft = [
  { label: "Services", href: "/services" },
  { label: "Our Bars", href: "/our-bars" },
  { label: "Events", href: "/events" },
];

const navLinksRight = [
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/reviews" },
];

const navLinks = [...navLinksLeft, ...navLinksRight];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-[#0a0f1c]/95 backdrop-blur-md border-b border-white/[0.06] shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop: 3-column centred layout */}
          <div className="hidden lg:flex items-center justify-between h-20">
            {/* Left nav */}
            <nav className="flex items-center gap-1 flex-1">
              {navLinksLeft.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[#faf8f5]/70 hover:text-[#faf8f5] text-sm font-medium rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Centred logo */}
            <Link href="/" className="flex items-center justify-center flex-shrink-0 mx-6">
              <Image
                src="/logo-header.png"
                alt="The Bar People"
                width={220}
                height={52}
                className="h-14 w-auto brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.35)] transition-all duration-300"
                priority
              />
            </Link>

            {/* Right nav + CTA */}
            <nav className="flex items-center gap-1 flex-1 justify-end">
              {navLinksRight.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-[#faf8f5]/70 hover:text-[#faf8f5] text-sm font-medium rounded-lg hover:bg-white/5 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 ml-2">
                <Link href="/contact">
                  <Button variant="ghost" size="sm">
                    Contact
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button size="sm">
                    Build Your Quote
                  </Button>
                </Link>
              </div>
            </nav>
          </div>

          {/* Mobile/Tablet: logo left, CTA + burger right */}
          <div className="flex lg:hidden items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-header.png"
                alt="The Bar People"
                width={160}
                height={38}
                className="h-9 w-auto brightness-0 invert"
                priority
              />
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/quote">
                <Button size="sm" className="hidden sm:flex">
                  Build Your Quote
                </Button>
                <Button size="sm" className="sm:hidden px-3">
                  Quote
                </Button>
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 text-[#faf8f5]/70 hover:text-[#faf8f5] hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
