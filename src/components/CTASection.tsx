'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl bg-black p-10 text-center md:p-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
            Get Started
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Ready to Build Your Perfect Bar?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm text-white/60">
            Get an instant estimate — no commitment, no waiting.
          </p>
          <Link
            href="/quote"
            className="mt-8 inline-block border border-white bg-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-black transition-all hover:bg-transparent hover:text-white"
          >
            Price My Event
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
