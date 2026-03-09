"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";

const bars = [
  {
    name: "Shimmer Bar",
    size: "5FT",
    description: "Intimate events & private parties",
    capacity: "Up to 50 guests",
    price: "From £295",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=600&q=80&fit=crop",
    badge: null,
  },
  {
    name: "Classic Cocktail Bar",
    size: "10FT",
    description: "Weddings, birthdays & corporate",
    capacity: "Up to 100 guests",
    price: "From £395",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80&fit=crop",
    badge: "Popular",
  },
  {
    name: "Horseshoe Bar",
    size: "15FT",
    description: "Larger events & festivals",
    capacity: "Up to 150 guests",
    price: "From £595",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80&fit=crop",
    badge: null,
  },
  {
    name: "Large Horseshoe",
    size: "35FT",
    description: "Major corporate events & galas",
    capacity: "Up to 250 guests",
    price: "From £895",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80&fit=crop",
    badge: "Recommended",
  },
  {
    name: "Island Bar",
    size: "40FT",
    description: "Showstopper statement events",
    capacity: "250+ guests",
    price: "From £1,195",
    image: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80&fit=crop",
    badge: "Statement",
  },
];

export function BarsShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <Section id="our-bars" dark>
      <SectionHeading
        eyebrow="Our Bars"
        heading="A Bar for Every Event"
        subtitle="Any colour. Indoor or outdoor. Fully modular. Choose your perfect setup."
        center
      />

      {/* Scrollable carousel */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-hide pb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
      >
        {bars.map((bar, i) => (
          <motion.div
            key={bar.name}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="flex-shrink-0 w-[300px] sm:w-[320px] snap-start"
          >
            <Link href="/our-bars">
              <div className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#c9956b]/30 hover:shadow-xl hover:shadow-[#c9956b]/10">
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={bar.image}
                    alt={bar.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c]/80 via-[#0a0f1c]/20 to-transparent" />

                  {/* Size badge */}
                  <div className="absolute top-3 left-3 bg-[#0a0f1c]/70 backdrop-blur-sm border border-white/10 rounded-lg px-2.5 py-1">
                    <span className="text-[#c9956b] text-xs font-bold tracking-wider">
                      {bar.size}
                    </span>
                  </div>

                  {bar.badge && (
                    <div className="absolute top-3 right-3">
                      <Badge variant="gold">{bar.badge}</Badge>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="font-[family-name:var(--font-playfair)] text-lg font-bold text-[#faf8f5] mb-1">
                    {bar.name}
                  </h3>
                  <p className="text-[#9ca3af] text-sm mb-3">{bar.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#faf8f5]/50 text-xs mb-0.5">{bar.capacity}</p>
                      <p className="text-[#c9956b] font-bold">{bar.price}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#c9956b]/10 flex items-center justify-center text-[#c9956b] group-hover:bg-[#c9956b] group-hover:text-[#0a0f1c] transition-all duration-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}

        {/* Peek spacer */}
        <div className="flex-shrink-0 w-4" />
      </div>

      {/* Scroll hint */}
      <p className="text-center text-[#9ca3af] text-sm mt-4 md:hidden">
        Swipe to see all bars →
      </p>
    </Section>
  );
}
