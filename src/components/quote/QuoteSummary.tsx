"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { PenLine, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatGBP, BAR_DETAILS } from "@/lib/quote-pricing";
import type { QuoteState } from "@/lib/quote-types";
import type { PricingBreakdown } from "@/lib/quote-pricing";

interface QuoteSummaryProps {
  state: QuoteState;
  pricing: PricingBreakdown;
}

function AnimatedPrice({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 200, damping: 30 });
  const display = useTransform(spring, (v) => formatGBP(Math.round(v)));

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span>{display}</motion.span>;
}

const SERVICE_LABELS: Record<string, string> = {
  all_inclusive: "All Inclusive Package",
  cash_bar: "Cash Bar Service",
  dry_hire: "Dry Hire",
  staff_only: "Staff Only",
};

export function QuoteSummary({ state, pricing }: QuoteSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const hasContent = state.serviceType !== null || state.barSelection !== null;

  return (
    <>
      {/* Desktop panel */}
      <div
        className="hidden lg:block rounded-2xl overflow-hidden"
        style={{
          background: "rgba(26, 26, 46, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <SummaryContent state={state} pricing={pricing} hasContent={hasContent} />
      </div>

      {/* Mobile: collapsible bottom panel */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div
          className="rounded-t-2xl overflow-hidden"
          style={{
            background: "rgba(10, 15, 28, 0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "none",
          }}
        >
          {/* Toggle bar */}
          <button
            onClick={() => setIsCollapsed((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: isCollapsed ? "none" : "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <PenLine className="w-4 h-4" style={{ color: "#c9956b" }} />
              <span className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                Your Quote
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base font-bold" style={{ color: "#c9956b" }}>
                <AnimatedPrice value={pricing.total} />
              </span>
              {isCollapsed ? (
                <ChevronUp className="w-4 h-4" style={{ color: "#9ca3af" }} />
              ) : (
                <ChevronDown className="w-4 h-4" style={{ color: "#9ca3af" }} />
              )}
            </div>
          </button>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="max-h-[60vh] overflow-y-auto">
                  <SummaryContent state={state} pricing={pricing} hasContent={hasContent} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

function SummaryContent({
  state,
  pricing,
  hasContent,
}: {
  state: QuoteState;
  pricing: PricingBreakdown;
  hasContent: boolean;
}) {
  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(201, 149, 107, 0.15)" }}
        >
          <PenLine className="w-4 h-4" style={{ color: "#c9956b" }} />
        </div>
        <h3
          className="text-base font-semibold font-[family-name:var(--font-playfair)]"
          style={{ color: "#faf8f5" }}
        >
          Your Quote
        </h3>
      </div>

      {!hasContent ? (
        <div className="py-6 text-center">
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            Your quote will build up here as you make selections.
          </p>
        </div>
      ) : (
        <>
          {/* Line items */}
          <div className="space-y-2.5">
            {/* Service base */}
            {state.serviceType && pricing.serviceBase > 0 && (
              <LineItem
                label={SERVICE_LABELS[state.serviceType]}
                sublabel={`${state.guestCount} guests · ${state.duration}hrs`}
                amount={pricing.serviceBase}
              />
            )}
            {state.serviceType && pricing.serviceBase === 0 && (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#faf8f5" }}>
                    {SERVICE_LABELS[state.serviceType]}
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>
                    Price on consultation
                  </p>
                </div>
                <span className="text-sm" style={{ color: "#9ca3af" }}>
                  —
                </span>
              </div>
            )}

            {/* Bar */}
            {state.barSelection && pricing.barCost > 0 && (
              <LineItem
                label={BAR_DETAILS[state.barSelection].name}
                sublabel={BAR_DETAILS[state.barSelection].size}
                amount={pricing.barCost}
              />
            )}

            {/* Staff */}
            {pricing.staffCost > 0 && (
              <LineItem
                label="Staff"
                sublabel="Mixologists, bartenders & bar backs"
                amount={pricing.staffCost}
              />
            )}

            {/* Extras */}
            {pricing.extras.map((extra, i) => (
              <LineItem key={i} label={extra.label} amount={extra.amount} />
            ))}
          </div>

          {/* Divider */}
          <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.08)" }} />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                Subtotal
              </span>
              <span className="text-sm font-medium" style={{ color: "#faf8f5" }}>
                <AnimatedPrice value={pricing.subtotal} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                VAT (20%)
              </span>
              <span className="text-sm font-medium" style={{ color: "#faf8f5" }}>
                <AnimatedPrice value={pricing.vat} />
              </span>
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center rounded-xl px-3.5 py-3 mt-1"
              style={{ background: "rgba(201, 149, 107, 0.1)", border: "1px solid rgba(201, 149, 107, 0.2)" }}
            >
              <span className="font-semibold" style={{ color: "#faf8f5" }}>
                Total
              </span>
              <span
                className="text-xl font-bold font-[family-name:var(--font-playfair)]"
                style={{ color: "#c9956b" }}
              >
                <AnimatedPrice value={pricing.total} />
              </span>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
            This is an estimate. Final pricing confirmed after consultation.
          </p>

          {/* CTA */}
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: "rgba(201, 149, 107, 0.15)",
              border: "1px solid rgba(201, 149, 107, 0.3)",
              color: "#c9956b",
            }}
          >
            Get In Touch
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}
    </div>
  );
}

function LineItem({
  label,
  sublabel,
  amount,
}: {
  label: string;
  sublabel?: string;
  amount: number;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "#faf8f5" }}>
          {label}
        </p>
        {sublabel && (
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            {sublabel}
          </p>
        )}
      </div>
      <span className="text-sm font-semibold shrink-0" style={{ color: "#e0b48a" }}>
        <AnimatedPrice value={amount} />
      </span>
    </div>
  );
}
