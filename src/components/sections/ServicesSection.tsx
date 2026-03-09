"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

const services = [
  {
    slug: "all-inclusive",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "All Inclusive Hire",
    description: "Everything included. Drinks, staff, bar, glassware. The ultimate hassle-free experience.",
    price: "From £29.90/head",
    badge: "Most Popular",
  },
  {
    slug: "cash-bar",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
      </svg>
    ),
    title: "Cash Bar Hire",
    description: "Guests pay for their own drinks. You pay for the professional setup and staff.",
    price: "From £395",
    badge: null,
  },
  {
    slug: "dry-hire",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    title: "Dry Hire",
    description: "Bar equipment rental. You source the drinks, we provide the beautiful bar and glassware.",
    price: "From £295",
    badge: null,
  },
  {
    slug: "staff-hire",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "Staff Hire",
    description: "Professional, certified bartenders for your own bar setup. Experienced, personable, impeccable.",
    price: "From £200",
    badge: "Flexible",
  },
  {
    slug: "event-management",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    title: "Event Management",
    description: "Full event coordination from concept to execution. We handle everything so you can enjoy the night.",
    price: "POA",
    badge: "Premium",
  },
];

export function ServicesSection() {
  return (
    <Section id="services">
      <SectionHeading
        eyebrow="What We Do"
        heading="Tailored Bar Solutions for Every Event"
        subtitle="From intimate gatherings to 500-guest galas — we have a package that's right for you."
        center
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, i) => (
          <motion.div
            key={service.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <Link href={`/services/${service.slug}`}>
              <div className="group relative h-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-[#c9956b]/30 hover:shadow-xl hover:shadow-[#c9956b]/5 cursor-pointer">
                {service.badge && (
                  <span className="absolute top-4 right-4 text-xs font-semibold text-[#c9956b] bg-[#c9956b]/10 border border-[#c9956b]/20 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {service.badge}
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-[#c9956b]/10 flex items-center justify-center text-[#c9956b] mb-4 group-hover:bg-[#c9956b]/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-bold text-[#faf8f5] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#9ca3af] text-sm leading-relaxed mb-4 flex-1">
                  {service.description}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                  <span className="text-[#c9956b] font-semibold text-sm">
                    {service.price}
                  </span>
                  <span className="text-[#faf8f5]/40 group-hover:text-[#c9956b] transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
