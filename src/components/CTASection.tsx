'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl bg-charcoal p-12 text-center md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-dark to-charcoal" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Get Started</p>
            <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
              Ready to Build Your Perfect Bar?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-white/50">
              Get an instant estimate — no commitment, no waiting.
            </p>
            <Link
              href="/quote"
              className="mt-8 inline-block bg-gold px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-gold-hover"
            >
              Price My Event
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
