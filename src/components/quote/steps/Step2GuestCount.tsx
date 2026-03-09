"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ArrowRight, ArrowLeft, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuoteState, QuoteAction, Duration } from "@/lib/quote-types";
import { DURATION_OPTIONS } from "@/lib/quote-types";
import { getRecommendedBar, BAR_DETAILS } from "@/lib/quote-pricing";

interface Step2Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
  onBack: () => void;
}

export function Step2GuestCount({ state, dispatch, onNext, onBack }: Step2Props) {
  const { guestCount, duration } = state;

  const recommendedBar = getRecommendedBar(guestCount);
  const barDetails = BAR_DETAILS[recommendedBar];

  const adjustGuests = (delta: number) => {
    const next = Math.min(500, Math.max(10, guestCount + delta));
    dispatch({ type: "SET_GUEST_COUNT", value: next });
  };

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          How many guests &amp; how long?
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          This helps us match the right bar and staffing for your event
        </p>
      </div>

      {/* Guest Count */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold tracking-wide uppercase" style={{ color: "#9ca3af" }}>
          Guest Count
        </label>

        <div
          className="rounded-2xl p-6"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Big number + controls */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <motion.button
              onClick={() => adjustGuests(-10)}
              disabled={guestCount <= 10}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: guestCount <= 10 ? "rgba(255,255,255,0.03)" : "rgba(201, 149, 107, 0.15)",
                border: `1px solid ${guestCount <= 10 ? "rgba(255,255,255,0.08)" : "rgba(201, 149, 107, 0.3)"}`,
                color: guestCount <= 10 ? "#9ca3af" : "#c9956b",
                cursor: guestCount <= 10 ? "not-allowed" : "pointer",
              }}
              whileHover={guestCount > 10 ? { scale: 1.08 } : {}}
              whileTap={guestCount > 10 ? { scale: 0.93 } : {}}
            >
              <Minus className="w-5 h-5" />
            </motion.button>

            <div className="text-center w-32">
              <AnimatePresence mode="wait">
                <motion.span
                  key={guestCount}
                  className="block text-6xl font-bold font-[family-name:var(--font-playfair)]"
                  style={{ color: "#faf8f5" }}
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {guestCount}
                </motion.span>
              </AnimatePresence>
              <span className="text-sm" style={{ color: "#9ca3af" }}>
                guests
              </span>
            </div>

            <motion.button
              onClick={() => adjustGuests(10)}
              disabled={guestCount >= 500}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{
                background: guestCount >= 500 ? "rgba(255,255,255,0.03)" : "rgba(201, 149, 107, 0.15)",
                border: `1px solid ${guestCount >= 500 ? "rgba(255,255,255,0.08)" : "rgba(201, 149, 107, 0.3)"}`,
                color: guestCount >= 500 ? "#9ca3af" : "#c9956b",
                cursor: guestCount >= 500 ? "not-allowed" : "pointer",
              }}
              whileHover={guestCount < 500 ? { scale: 1.08 } : {}}
              whileTap={guestCount < 500 ? { scale: 0.93 } : {}}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Slider */}
          <div className="px-2">
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={guestCount}
              onChange={(e) => dispatch({ type: "SET_GUEST_COUNT", value: Number(e.target.value) })}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #c9956b ${((guestCount - 10) / 490) * 100}%, rgba(255,255,255,0.1) ${((guestCount - 10) / 490) * 100}%)`,
                accentColor: "#c9956b",
              }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: "#9ca3af" }}>10</span>
              <span className="text-xs" style={{ color: "#9ca3af" }}>500</span>
            </div>
          </div>
        </div>

        {/* Recommendation callout */}
        <motion.div
          layout
          className="flex items-start gap-3 rounded-xl p-4"
          style={{
            background: "rgba(201, 149, 107, 0.08)",
            border: "1px solid rgba(201, 149, 107, 0.2)",
          }}
        >
          <Info className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#c9956b" }} />
          <p className="text-sm" style={{ color: "#e0b48a" }}>
            For <strong style={{ color: "#faf8f5" }}>{guestCount} guests</strong>, we recommend the{" "}
            <strong style={{ color: "#faf8f5" }}>
              {barDetails.name} ({barDetails.size})
            </strong>
            . Accommodates up to{" "}
            <strong style={{ color: "#faf8f5" }}>
              {barDetails.capacity >= 999 ? "500+" : barDetails.capacity}
            </strong>{" "}
            guests.
          </p>
        </motion.div>
      </div>

      {/* Duration */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold tracking-wide uppercase" style={{ color: "#9ca3af" }}>
          Bar Service Duration
        </label>
        <div className="flex flex-wrap gap-2">
          {DURATION_OPTIONS.map((hrs) => {
            const isSelected = duration === hrs;
            return (
              <motion.button
                key={hrs}
                onClick={() => dispatch({ type: "SET_DURATION", value: hrs as Duration })}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: isSelected ? "rgba(201, 149, 107, 0.2)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${isSelected ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
                  color: isSelected ? "#e0b48a" : "#9ca3af",
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                {hrs}h
              </motion.button>
            );
          })}
        </div>
        <p className="text-xs" style={{ color: "#9ca3af" }}>
          Base pricing calculated at 4 hours. Extra hours billed additionally.
        </p>
      </div>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
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
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: "linear-gradient(135deg, #c9956b, #e0b48a)",
            color: "#0a0f1c",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
