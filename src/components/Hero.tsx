'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden bg-charcoal">
      {/* Background Video */}
      <video
        autoPlay muted loop playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-50"
        poster="/video-poster.jpg"
      >
        <source src="https://videos.pexels.com/video-files/3196487/3196487-uhd_2560_1440_25fps.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-semibold uppercase tracking-[0.25em] text-gold"
            >
              Premium Mobile Bar Hire
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 font-heading text-5xl font-bold leading-tight text-white sm:text-6xl md:text-7xl"
            >
              Unforgettable Events Since 2014
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-lg text-lg text-white/70"
            >
              We bring the bar, the staff, the drinks, and the vibe. You just bring the guests.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/quote"
                className="bg-gold px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gold-hover"
              >
                Price My Event
              </Link>
              <Link
                href="/contact"
                className="border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10"
              >
                Get In Touch
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 flex gap-10"
            >
              {[
                { value: '10+', label: 'Years' },
                { value: '850+', label: 'Events' },
                { value: '5★', label: 'Rating' },
                { value: 'UK Wide', label: 'Coverage' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-heading text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/40">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="h-8 w-5 rounded-full border border-white/30"
        >
          <div className="mx-auto mt-1.5 h-2 w-0.5 rounded-full bg-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
