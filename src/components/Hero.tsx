'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-cream pb-16 pt-28 md:pb-24 md:pt-36">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/5" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-gold/5" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-gold"
          >
            The Team Your Event Deserves
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Unforgettable Moments{' '}
            <span className="text-gold-gradient">Since 2014</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted md:text-xl"
          >
            We bring the bar, the staff, the drinks, and the vibe. You just bring the guests.
            Instant pricing online.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/quote"
              className="group flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-hover hover:shadow-xl hover:shadow-gold/30"
            >
              Price My Event
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 rounded-full border-2 border-warm-border bg-white px-8 py-3.5 text-base font-semibold text-charcoal transition-all hover:border-gold hover:text-gold"
            >
              <Phone size={16} />
              Contact
            </Link>
          </motion.div>

          {/* Stats inline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4"
          >
            {[
              { value: '10+', label: 'Years of events' },
              { value: '850+', label: 'Events delivered' },
              { value: '5★', label: 'Average rating' },
              { value: 'Nationwide', label: 'Coverage' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-bold text-gold md:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
