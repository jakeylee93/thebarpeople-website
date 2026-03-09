"use client";

import { useRef, useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
    <Section id="testimonials" bright>
      <SectionHeading
        eyebrow="What Our Clients Say"
        heading="Trusted by Thousands of Happy Hosts"
        subtitle="From intimate weddings to major corporate events — we consistently deliver."
        center
        onLight
      />

      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scroll-hide pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 snap-x snap-mandatory"
      >
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="snap-start flex-shrink-0 w-[340px] sm:w-[380px] bg-[#0a0f1c] rounded-2xl p-6 border border-white/[0.06]"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: t.rating }).map((_, si) => (
                <svg key={si} className="w-4 h-4 text-[#c9956b]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            <blockquote className="text-[#faf8f5]/80 text-sm leading-relaxed mb-5">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#c9956b]/20 flex items-center justify-center text-[#c9956b] font-bold text-sm">
                {t.name[0]}
              </div>
              <div>
                <p className="text-[#faf8f5] text-sm font-semibold">{t.name}</p>
                <p className="text-[#9ca3af] text-xs">{t.eventType}</p>
              </div>
            </div>
          </div>
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
                : "w-2 h-2 bg-[#0a0f1c]/20 hover:bg-[#0a0f1c]/40"
            }`}
            aria-label={`Go to testimonial ${i + 1}`}
          />
        ))}
      </div>
    </Section>
  );
}
