"use client";

import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  {
    value: 10,
    suffix: "+",
    label: "Years of Events",
    description: "Est. 2014",
  },
  {
    value: 850,
    suffix: "+",
    label: "Events Delivered",
    description: "Weddings, corporate & more",
  },
  {
    value: 5,
    suffix: "★",
    label: "Average Rating",
    description: "Consistently excellent",
  },
  {
    value: 100,
    suffix: "%",
    label: "Nationwide",
    description: "We travel to you",
    isNationwide: true,
  },
];

export function StatsBar() {
  return (
    <div className="bg-[#0d1220] border-y border-[#c9956b]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl sm:text-5xl text-[#c9956b] mb-1 font-[family-name:var(--font-young-serif)]">
                {stat.isNationwide ? (
                  <span>Nationwide</span>
                ) : (
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                )}
              </div>
              <div className="text-[#faf8f5] font-semibold text-sm sm:text-base mb-0.5">
                {stat.label}
              </div>
              <div className="text-[#9ca3af] text-xs">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
