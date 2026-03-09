"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialCard } from "@/components/ui/TestimonialCard";

const testimonials = [
  {
    quote: "Jake and his team were incredible at our wedding. The cocktail bar was the highlight of the entire evening — guests are still talking about it months later.",
    name: "Sarah & Tom",
    eventType: "Wedding Reception",
    rating: 5,
  },
  {
    quote: "Professional, punctual, and the cocktails were outstanding. Our corporate event was elevated to another level entirely. We'll be booking again.",
    name: "David Chen",
    eventType: "Corporate Event",
    rating: 5,
  },
  {
    quote: "We've used The Bar People three years running for our Christmas party. Wouldn't go anywhere else — they know us, they know our guests, and they deliver every time.",
    name: "Rachel Moore",
    eventType: "Christmas Party",
    rating: 5,
  },
  {
    quote: "The team handled our 200-guest charity gala flawlessly. Vish and Monique were absolute stars. The signature cocktail they created for us was perfect.",
    name: "James Wright",
    eventType: "Charity Gala",
    rating: 5,
  },
  {
    quote: "From the initial quote to the event itself, everything was seamless. The Porsche team absolutely loved it — premium in every sense.",
    name: "Mark Stevens",
    eventType: "Corporate Launch",
    rating: 5,
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const next = (current + 1) % testimonials.length;
      setCurrent(next);
      const card = scrollRef.current.children[next] as HTMLElement;
      if (card) {
        scrollRef.current.scrollTo({
          left: card.offsetLeft - scrollRef.current.offsetLeft,
          behavior: "smooth",
        });
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <Section id="testimonials">
      <SectionHeading
        eyebrow="What Our Clients Say"
        heading="Trusted by Thousands of Happy Hosts"
        subtitle="From intimate weddings to major corporate events — we consistently deliver."
        center
      />

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
      >
        {testimonials.map((t, i) => (
          <TestimonialCard
            key={i}
            quote={t.quote}
            name={t.name}
            eventType={t.eventType}
            rating={t.rating}
            className="snap-start flex-shrink-0"
          />
        ))}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrent(i);
              const card = scrollRef.current?.children[i] as HTMLElement;
              if (card && scrollRef.current) {
                scrollRef.current.scrollTo({
                  left: card.offsetLeft - scrollRef.current.offsetLeft,
                  behavior: "smooth",
                });
              }
            }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-2 bg-[#c9956b]"
                : "w-2 h-2 bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </Section>
  );
}
