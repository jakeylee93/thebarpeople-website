'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-28 md:pb-24 md:pt-36">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-light"
          >
            The Team Your Event Deserves
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Unforgettable Moments Since 2014
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-mid md:text-xl"
          >
            We bring the bar, the staff, the drinks, and the vibe. You just bring the guests.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/quote"
              className="bg-black px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-dark"
            >
              Price My Event
            </Link>
            <Link
              href="/contact"
              className="border border-black px-8 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all hover:bg-black hover:text-white"
            >
              Contact
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-8 border-t border-pale pt-8 md:grid-cols-4"
          >
            {[
              { value: '10+', label: 'Years' },
              { value: '850+', label: 'Events' },
              { value: '5★', label: 'Rating' },
              { value: 'UK', label: 'Nationwide' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-heading text-2xl font-bold md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-light">
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
