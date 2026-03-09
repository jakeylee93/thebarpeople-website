"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";
import { X, ChevronRight } from "lucide-react";
import { formatGBP, BAR_DETAILS, GLASS_DEFINITIONS, GLASS_TYPE_ORDER } from "@/lib/quote-pricing";
import type { QuoteState, GlassType } from "@/lib/quote-types";
import type { PricingBreakdown } from "@/lib/quote-pricing";

interface QuoteSummaryProps {
  state: QuoteState;
  pricing: PricingBreakdown;
  onGoToStep?: (step: number) => void;
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

export function QuoteSummary({ state, pricing, onGoToStep }: QuoteSummaryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        <SummaryContent state={state} pricing={pricing} hasContent={hasContent} onGoToStep={onGoToStep} />
      </div>

      {/* Mobile: sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div
          className="px-4 py-3 flex items-center gap-3"
          style={{
            background: "rgba(10,15,28,0.97)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* View Quote button */}
          <motion.button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 flex items-center justify-between px-5 py-3 rounded-xl font-bold text-sm"
            style={{
              background: "linear-gradient(135deg, #c9956b, #e0b48a)",
              color: "#0a0f1c",
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>View Your Quote</span>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base">
                <AnimatedPrice value={pricing.total} />
              </span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </motion.button>
        </div>
      </div>

      {/* Mobile: slide-up modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl overflow-hidden"
              style={{
                background: "#0f1525",
                border: "1px solid rgba(255,255,255,0.1)",
                borderBottom: "none",
                maxHeight: "85vh",
              }}
            >
              {/* Handle + close */}
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto" />
              </div>
              <div className="flex items-center justify-between px-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <h3 className="text-base font-semibold font-[family-name:var(--font-young-serif)]" style={{ color: "#faf8f5" }}>
                  Your Quote
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <X className="w-4 h-4" style={{ color: "#9ca3af" }} />
                </button>
              </div>

              <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 80px)" }}>
                <SummaryContent
                  state={state}
                  pricing={pricing}
                  hasContent={hasContent}
                  onGoToStep={(step) => {
                    setIsModalOpen(false);
                    onGoToStep?.(step);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function SummaryContent({
  state,
  pricing,
  hasContent,
  onGoToStep,
}: {
  state: QuoteState;
  pricing: PricingBreakdown;
  hasContent: boolean;
  onGoToStep?: (step: number) => void;
}) {
  return (
    <div className="p-5 space-y-4">
      {/* Header */}
      <div>
        <h3
          className="text-base font-semibold font-[family-name:var(--font-young-serif)] mb-0.5"
          style={{ color: "#faf8f5" }}
        >
          Your Quote
        </h3>
        <p className="text-xs" style={{ color: "#9ca3af" }}>
          Live estimate — updates as you build
        </p>
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
                onEdit={onGoToStep ? () => onGoToStep(3) : undefined}
              />
            )}
            {state.serviceType && pricing.serviceBase === 0 && (
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium" style={{ color: "#faf8f5" }}>
                    {SERVICE_LABELS[state.serviceType]}
                  </p>
                  <p className="text-xs" style={{ color: "#9ca3af" }}>Price on consultation</p>
                </div>
                <span className="text-sm" style={{ color: "#9ca3af" }}>—</span>
              </div>
            )}

            {/* Bar */}
            {state.barSelection && pricing.barCost > 0 && (
              <LineItem
                label={BAR_DETAILS[state.barSelection].name}
                sublabel={BAR_DETAILS[state.barSelection].size}
                amount={pricing.barCost}
                onEdit={onGoToStep ? () => onGoToStep(4) : undefined}
              />
            )}

            {/* Staff */}
            {pricing.staffCost > 0 && (
              <LineItem label="Staff" sublabel="Mixologists, bartenders & bar backs" amount={pricing.staffCost} />
            )}

            {/* Glassware */}
            {pricing.glasswareCost > 0 && (
              <LineItem
                label="Glassware"
                sublabel={`${GLASS_TYPE_ORDER.filter((gt) => ((state.glassware[gt] as number) ?? 0) > 0).length} type(s) selected`}
                amount={pricing.glasswareCost}
                onEdit={onGoToStep ? () => onGoToStep(5) : undefined}
              />
            )}

            {/* Equipment */}
            {pricing.equipmentCost > 0 && (
              <LineItem
                label="Equipment"
                amount={pricing.equipmentCost}
                onEdit={onGoToStep ? () => onGoToStep(6) : undefined}
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
              <span className="text-sm" style={{ color: "#9ca3af" }}>Subtotal</span>
              <span className="text-sm font-medium" style={{ color: "#faf8f5" }}>
                <AnimatedPrice value={pricing.subtotal} />
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm" style={{ color: "#9ca3af" }}>VAT (20%)</span>
              <span className="text-sm font-medium" style={{ color: "#faf8f5" }}>
                <AnimatedPrice value={pricing.vat} />
              </span>
            </div>

            <div
              className="flex justify-between items-center rounded-xl px-3.5 py-3 mt-1"
              style={{ background: "rgba(201,149,107,0.1)", border: "1px solid rgba(201,149,107,0.2)" }}
            >
              <span className="font-semibold" style={{ color: "#faf8f5" }}>Total</span>
              <span
                className="text-xl font-bold font-[family-name:var(--font-young-serif)]"
                style={{ color: "#c9956b" }}
              >
                <AnimatedPrice value={pricing.total} />
              </span>
            </div>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
            Estimate only. Final pricing confirmed after consultation.
          </p>
        </>
      )}
    </div>
  );
}

function LineItem({
  label,
  sublabel,
  amount,
  onEdit,
}: {
  label: string;
  sublabel?: string;
  amount: number;
  onEdit?: () => void;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate" style={{ color: "#faf8f5" }}>
            {label}
          </p>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xs shrink-0 transition-colors hover:opacity-80"
              style={{ color: "#9ca3af" }}
            >
              edit
            </button>
          )}
        </div>
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
