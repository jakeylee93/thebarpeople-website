"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

const HERO_IMAGES = [
  "/hero-team-cropped.jpg",
  "/hero-festival.jpg",
  "/hero-champagne.jpg",
  "/hero-rooftop.jpg",
  "/hero-party.jpg",
  "/hero-outdoor.jpg",
  "/hero-cocktails.jpg",
];

const CROSSFADE_INTERVAL = 6000;

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, CROSSFADE_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Crossfade background images */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${HERO_IMAGES[currentIndex]}')` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Dark overlay — layered for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f1c]/80 via-[#0a0f1c]/55 to-[#0a0f1c]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c]/50 via-transparent to-[#0a0f1c]/30" />

      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c9956b]/8 rounded-full blur-[120px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[#c9956b] text-sm font-semibold uppercase tracking-[0.2em] mb-6">
            London&apos;s Premium Mobile Bar Hire
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="font-[family-name:var(--font-young-serif)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#faf8f5] leading-[1.05] mb-6"
        >
          Build Your{" "}
          <span className="text-[#c9956b] italic">Perfect Bar</span>
          <br />
          in 60 Seconds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-[#faf8f5]/75 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Pop-up bars, professional bartenders, and unforgettable experiences for
          any event. Get an instant quote with no commitment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/quote">
            <Button size="lg">
              Build Your Quote
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
          <Link href="/gallery">
            <Button variant="secondary" size="lg">
              View Our Work
            </Button>
          </Link>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex items-center justify-center gap-8 mt-14 flex-wrap"
        >
          {[
            { label: "10+ Years", sub: "of events" },
            { label: "850+", sub: "events delivered" },
            { label: "5★", sub: "average rating" },
            { label: "Nationwide", sub: "coverage" },
          ].map((badge) => (
            <div key={badge.label} className="text-center">
              <div className="text-[#faf8f5] font-bold text-lg leading-none">
                {badge.label}
              </div>
              <div className="text-[#9ca3af] text-xs mt-0.5">{badge.sub}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Crossfade dots indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === currentIndex ? "1.5rem" : "0.5rem",
              height: "0.5rem",
              background: i === currentIndex ? "#c9956b" : "rgba(255,255,255,0.3)",
            }}
            aria-label={`Show image ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[#faf8f5]/40 text-xs tracking-[0.15em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-[#c9956b] rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
