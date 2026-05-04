'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { services } from '@/lib/constants';

export default function ServicesSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">What We Do</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-charcoal md:text-4xl">
            Tailored Bar Solutions for Every Event
          </h2>
          <p className="mt-4 text-muted">
            From intimate gatherings to 500-guest galas — we have a package that&apos;s right for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group relative flex h-full flex-col rounded-2xl border border-warm-border bg-cream p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
              >
                {service.tag && (
                  <span className="absolute right-4 top-4 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    {service.tag}
                  </span>
                )}
                <span className="text-3xl">{service.icon}</span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-charcoal">
                  {service.name}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gold">{service.price}</span>
                  <ArrowRight
                    size={16}
                    className="text-muted transition-all group-hover:translate-x-1 group-hover:text-gold"
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
