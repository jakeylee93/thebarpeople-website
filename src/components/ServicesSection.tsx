'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/lib/constants';

export default function ServicesSection() {
  return (
    <section className="border-t border-pale bg-faint py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-light">What We Do</p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">
            Tailored Bar Solutions
          </h2>
          <p className="mt-4 text-mid">
            From intimate gatherings to 500-guest galas.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group relative flex h-full flex-col border border-pale bg-white p-6 transition-all hover:border-black"
              >
                {service.tag && (
                  <span className="absolute right-4 top-4 bg-black px-2 py-0.5 text-xs font-medium text-white">
                    {service.tag}
                  </span>
                )}
                <h3 className="font-heading text-xl font-semibold">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mid">{service.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-pale pt-4">
                  <span className="text-sm font-semibold">{service.price}</span>
                  <span className="text-xs text-light transition-colors group-hover:text-black">View →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
