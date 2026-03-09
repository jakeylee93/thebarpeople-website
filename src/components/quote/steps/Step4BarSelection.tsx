"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, ArrowRight, ArrowLeft, Users } from "lucide-react";
import type { QuoteState, QuoteAction, BarType, ServiceType } from "@/lib/quote-types";
import { BAR_PRICES, BAR_DETAILS, getRecommendedBar } from "@/lib/quote-pricing";
import { formatGBP } from "@/lib/quote-pricing";

interface Step4Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
  onBack: () => void;
  serviceType: ServiceType;
  guestCount: number;
}

const BAR_ORDER: BarType[] = [
  "shimmer_5ft",
  "classic_10ft",
  "horseshoe_15ft",
  "large_horseshoe_35ft",
  "island_40ft",
];

const BAR_GRADIENTS: Record<BarType, string> = {
  shimmer_5ft: "linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 50%, #1a1a2e 100%)",
  classic_10ft: "linear-gradient(135deg, #0a1628 0%, #1a2840 50%, #0d1f35 100%)",
  horseshoe_15ft: "linear-gradient(135deg, #1c1400 0%, #3d2e00 50%, #2a2000 100%)",
  large_horseshoe_35ft: "linear-gradient(135deg, #0e1a0e 0%, #1a3020 50%, #0e1a0e 100%)",
  island_40ft: "linear-gradient(135deg, #1a0e0e 0%, #3d1515 50%, #2a0f0f 100%)",
};

export function Step4BarSelection({ state, dispatch, onNext, onBack, serviceType, guestCount }: Step4Props) {
  if (serviceType === "staff_only") return null;

  const recommended = getRecommendedBar(guestCount);
  const isValid = state.barSelection !== null;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-young-serif)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          Choose your bar
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Select the bar that fits your venue and guest count
        </p>
      </div>

      {/* Bar Cards */}
      <div className="space-y-3">
        {BAR_ORDER.map((barKey) => {
          const details = BAR_DETAILS[barKey];
          const price = BAR_PRICES[barKey];
          const isSelected = state.barSelection === barKey;
          const isRecommended = barKey === recommended;
          const isTooSmall = details.capacity < guestCount && details.capacity < 999;

          return (
            <motion.button
              key={barKey}
              onClick={() => dispatch({ type: "SET_BAR_SELECTION", value: barKey })}
              className="relative w-full text-left rounded-2xl overflow-hidden transition-all"
              style={{
                border: `1px solid ${isSelected ? "#c9956b" : isRecommended ? "rgba(52, 211, 153, 0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
              whileHover={{ scale: 1.005, borderColor: "rgba(255,255,255,0.2)" }}
              whileTap={{ scale: 0.998 }}
            >
              <div className="flex items-stretch">
                {/* Image placeholder */}
                <div
                  className="w-24 sm:w-36 shrink-0 flex items-center justify-center"
                  style={{ background: BAR_GRADIENTS[barKey], minHeight: "100px" }}
                >
                  <div className="text-center px-2">
                    <p
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: "rgba(201, 149, 107, 0.7)" }}
                    >
                      {details.size}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex-1 p-4 sm:p-5"
                  style={{
                    background: isSelected ? "rgba(201, 149, 107, 0.08)" : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base" style={{ color: "#faf8f5" }}>
                          {details.name}
                        </h3>
                        {/* Size badge */}
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{
                            background: "rgba(255,255,255,0.06)",
                            color: "#9ca3af",
                          }}
                        >
                          {details.size}
                        </span>
                        {/* Recommended badge */}
                        {isRecommended && (
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-md uppercase tracking-wide"
                            style={{
                              background: "rgba(52, 211, 153, 0.15)",
                              color: "#34d399",
                              border: "1px solid rgba(52, 211, 153, 0.25)",
                            }}
                          >
                            Recommended
                          </span>
                        )}
                      </div>

                      {/* Capacity */}
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
                        <span className="text-sm" style={{ color: "#9ca3af" }}>
                          Up to {details.capacity >= 999 ? "500+" : details.capacity} guests
                        </span>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-semibold" style={{ color: "#c9956b" }}>
                        From {formatGBP(price)}
                      </p>

                      {/* Too small warning */}
                      {isTooSmall && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" style={{ color: "#f59e0b" }} />
                          <p className="text-xs" style={{ color: "#f59e0b" }}>
                            This bar may be too small for {guestCount} guests
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Checkmark */}
                    {isSelected ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: "#c9956b" }}
                      >
                        <Check className="w-3.5 h-3.5" style={{ color: "#0a0f1c" }} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full shrink-0"
                        style={{ border: "1.5px solid rgba(255,255,255,0.15)" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#9ca3af",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.button
          onClick={onNext}
          disabled={!isValid}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm"
          style={{
            background: isValid ? "linear-gradient(135deg, #c9956b, #e0b48a)" : "rgba(255,255,255,0.05)",
            color: isValid ? "#0a0f1c" : "#9ca3af",
            border: isValid ? "none" : "1px solid rgba(255,255,255,0.08)",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
