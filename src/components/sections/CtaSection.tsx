"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1a0f07] via-[#1a1209] to-[#0a0f1c] py-24 px-4 sm:px-6 lg:px-8">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c9956b]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,149,107,0.08)_0%,transparent_70%)]" />

      {/* Decorative lines */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9956b]/40 to-transparent" />
      <div className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#c9956b]/20 to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[#c9956b] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
            Get Started Today
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-[#faf8f5] mb-6 leading-tight">
            Ready to Build Your{" "}
            <span className="text-[#c9956b] italic">Perfect Bar?</span>
          </h2>
          <p className="text-[#faf8f5]/60 text-xl mb-10 max-w-2xl mx-auto">
            Get a personalised quote in 60 seconds. No commitment, no hassle. Just
            tell us about your event and we&apos;ll do the rest.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/quote">
              <Button size="lg" className="min-w-[220px]">
                Start Your Quote
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-[#faf8f5]/60">
              <span className="text-sm">or call Jake on</span>
              <a
                href="tel:+447557402200"
                className="text-[#c9956b] font-semibold text-sm hover:text-[#e0b48a] transition-colors"
              >
                07557 402200
              </a>
            </div>
          </div>

          {/* Reassurance */}
          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            {[
              "No upfront payment",
              "Free consultation",
              "Instant quote",
              "UK-wide service",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-[#faf8f5]/50 text-sm">
                <svg className="w-4 h-4 text-[#c9956b]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
