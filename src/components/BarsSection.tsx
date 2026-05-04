'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { bars } from '@/lib/constants';

export default function BarsSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our Bars</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-charcoal md:text-4xl">
            A Bar for Every Event
          </h2>
          <p className="mt-4 text-muted">
            Any colour. Indoor or outdoor. Fully modular. Choose your perfect setup.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {bars.map((bar, i) => (
            <motion.div
              key={bar.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                href="/our-bars"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-warm-border bg-white transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
              >
                {/* Image placeholder */}
                <div className="relative flex h-44 items-center justify-center bg-gradient-to-br from-cream-dark to-cream">
                  <span className="font-heading text-4xl font-bold text-gold/30">{bar.size}</span>
                  {bar.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-0.5 text-xs font-semibold text-white">
                      {bar.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-charcoal">{bar.name}</h3>
                  <p className="mt-1 text-sm text-muted">{bar.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted">{bar.guests}</p>
                      <p className="font-semibold text-gold">{bar.price}</p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-muted transition-all group-hover:translate-x-1 group-hover:text-gold"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
