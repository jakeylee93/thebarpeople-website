'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { services } from '@/lib/constants';
import { Wine, CreditCard, Beer, Users, CalendarCheck } from 'lucide-react';

const icons: Record<string, React.ReactNode> = {
  'all-inclusive': <Wine size={20} />,
  'cash-bar': <CreditCard size={20} />,
  'dry-hire': <Beer size={20} />,
  'staff-hire': <Users size={20} />,
  'event-management': <CalendarCheck size={20} />,
};

export default function ServicesSection() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">What We Do</p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-4xl">
            Tailored Bar Solutions for Every Event
          </h2>
          <p className="mt-4 text-mid">
            From intimate gatherings to 500-guest galas — we have a package that&apos;s right for you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                className="group relative flex h-full flex-col rounded-xl border border-pale bg-white p-6 transition-all hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5"
              >
                {service.tag && (
                  <span className="absolute right-4 top-4 rounded-full bg-gold/10 px-2.5 py-0.5 text-xs font-semibold text-gold">
                    {service.tag}
                  </span>
                )}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-faint text-charcoal">
                  {icons[service.slug]}
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-mid">{service.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-pale pt-4">
                  <span className="text-sm font-semibold text-gold">{service.price}</span>
                  <span className="text-xs text-light transition-colors group-hover:text-gold">Learn more →</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
