"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

interface NavLink {
  label: string;
  href: string;
}

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
}

export function MobileNav({ isOpen, onClose, links }: MobileNavProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-[70] w-[300px] bg-[#0f1525] border-l border-white/[0.08] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <span className="text-[#faf8f5] font-bold text-sm tracking-[0.12em] uppercase">
                Menu
              </span>
              <button
                onClick={onClose}
                className="p-2 text-[#faf8f5]/60 hover:text-[#faf8f5] hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="block px-4 py-3 text-[#faf8f5]/80 hover:text-[#faf8f5] font-medium rounded-xl hover:bg-white/5 transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* CTA */}
            <div className="px-6 py-6 border-t border-white/[0.06] flex flex-col gap-3">
              <Link href="/quote" onClick={onClose}>
                <Button className="w-full" size="md">
                  Build Your Quote
                </Button>
              </Link>
              <Link href="/contact" onClick={onClose}>
                <Button variant="secondary" className="w-full" size="md">
                  Contact Us
                </Button>
              </Link>
              <div className="mt-2 text-center">
                <p className="text-[#9ca3af] text-xs mb-1">Prefer to talk?</p>
                <a
                  href="tel:+447557402200"
                  className="text-[#c9956b] text-sm font-medium hover:underline"
                >
                  07557 402200
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
