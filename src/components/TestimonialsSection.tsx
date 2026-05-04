'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/lib/constants';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const t = testimonials[current];

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Testimonials</p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">Trusted by Thousands</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl bg-faint p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="mb-6 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <blockquote className="font-heading text-lg leading-relaxed md:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-light">{t.event}</p>
                </div>
              </motion.div>
            </AnimatePresence>

            <button onClick={() => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-pale bg-white p-1.5 text-light transition-all hover:border-gold hover:text-gold md:-left-4">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-pale bg-white p-1.5 text-light transition-all hover:border-gold hover:text-gold md:-right-4">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-6 bg-gold' : 'w-1.5 bg-pale'}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
