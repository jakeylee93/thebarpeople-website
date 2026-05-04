'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-charcoal to-charcoal-light p-10 text-center md:p-16"
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Get Started Today
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-4xl">
            Ready to Build Your Perfect Bar?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-cream-dark/70">
            Get an instant estimate for your event — no commitment, no waiting around.
          </p>
          <Link
            href="/quote"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-hover hover:shadow-xl"
          >
            Price My Event
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
