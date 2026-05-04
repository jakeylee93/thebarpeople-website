'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { bars } from '@/lib/constants';

export default function BarsSection() {
  return (
    <section className="bg-faint py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Our Bars</p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">A Bar for Every Event</h2>
          <p className="mt-4 text-mid">Any colour. Indoor or outdoor. Fully modular.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {bars.map((bar, i) => (
            <motion.div
              key={bar.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                href="/our-bars"
                className="group flex flex-col overflow-hidden rounded-xl border border-pale bg-white transition-all hover:border-gold/30 hover:shadow-lg"
              >
                <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-charcoal to-dark">
                  <span className="font-heading text-3xl font-bold text-white/20">{bar.size}</span>
                  {bar.tag && (
                    <span className="absolute left-2 top-2 rounded bg-gold px-1.5 py-0.5 text-[10px] font-semibold text-white">{bar.tag}</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-semibold">{bar.name}</h3>
                  <p className="text-xs text-mid">{bar.description}</p>
                  <p className="mt-1 text-xs text-light">{bar.guests}</p>
                  <p className="text-sm font-semibold text-gold">{bar.price}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
