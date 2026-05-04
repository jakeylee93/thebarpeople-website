'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/lib/constants';

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            What Our Clients Say
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-charcoal md:text-4xl">
            Trusted by Thousands of Happy Hosts
          </h2>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-warm-border bg-cream p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                {/* Stars */}
                <div className="mb-6 flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className="fill-gold text-gold" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-heading text-lg leading-relaxed text-charcoal md:text-xl">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="mt-6 flex items-center justify-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
                    {t.initial}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-charcoal">{t.name}</p>
                    <p className="text-xs text-muted">{t.event}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-warm-border bg-white p-2 text-muted shadow-sm transition-all hover:border-gold hover:text-gold md:-left-5"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-warm-border bg-white p-2 text-muted shadow-sm transition-all hover:border-gold hover:text-gold md:-right-5"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-gold' : 'w-2 bg-warm-border'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
