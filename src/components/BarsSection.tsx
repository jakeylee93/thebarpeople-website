'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { bars } from '@/lib/constants';

export default function BarsSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-light">Our Bars</p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">
            A Bar for Every Event
          </h2>
          <p className="mt-4 text-mid">
            Any colour. Indoor or outdoor. Fully modular.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
                className="group flex flex-col border border-pale bg-white transition-all hover:border-black"
              >
                <div className="relative flex h-36 items-center justify-center bg-faint">
                  <span className="font-heading text-4xl font-bold text-pale">{bar.size}</span>
                  {bar.tag && (
                    <span className="absolute left-3 top-3 bg-black px-2 py-0.5 text-xs font-medium text-white">
                      {bar.tag}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-base font-semibold">{bar.name}</h3>
                  <p className="mt-1 text-xs text-mid">{bar.description}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="text-xs text-light">{bar.guests}</p>
                      <p className="font-semibold">{bar.price}</p>
                    </div>
                    <span className="text-xs text-light transition-colors group-hover:text-black">→</span>
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
