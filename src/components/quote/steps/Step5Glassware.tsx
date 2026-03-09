"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ArrowRight, ArrowLeft, Info } from "lucide-react";
import type { QuoteState, QuoteAction, GlassType } from "@/lib/quote-types";
import {
  GLASS_DEFINITIONS,
  GLASS_TYPE_ORDER,
  getGlassCrateCost,
  getRecommendedGlassCrates,
  formatGBP,
} from "@/lib/quote-pricing";

interface Step5Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
  onBack: () => void;
  guestCount: number;
}

function GlassCard({
  glassType,
  state,
  dispatch,
  recommended,
}: {
  glassType: GlassType;
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  recommended?: number;
}) {
  const def = GLASS_DEFINITIONS[glassType];
  const crates = (state.glassware[glassType] as number) ?? 0;
  const totalGlasses = crates * def.crateSize;
  const totalCost = getGlassCrateCost(glassType, crates);
  const isActive = crates > 0;

  return (
    <motion.div
      className="rounded-2xl p-4 transition-all"
      style={{
        background: isActive ? "rgba(201, 149, 107, 0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}
      layout
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
              {def.name}
            </p>
            {recommended !== undefined && recommended > 0 && (
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: "rgba(201,149,107,0.15)", color: "#c9956b" }}
              >
                Rec: {recommended} crate{recommended > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            {formatGBP(def.pricePerGlass)}/glass · Crate of {def.crateSize}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (crates > 0)
                dispatch({ type: "SET_GLASSWARE", glassType, crates: crates - 1 });
            }}
            disabled={crates === 0}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: crates > 0 ? "rgba(201,149,107,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${crates > 0 ? "rgba(201,149,107,0.3)" : "rgba(255,255,255,0.08)"}`,
              color: crates > 0 ? "#c9956b" : "#9ca3af",
              cursor: crates > 0 ? "pointer" : "not-allowed",
            }}
          >
            <Minus className="w-3 h-3" />
          </button>

          <div className="text-center min-w-[60px]">
            <span className="text-base font-bold" style={{ color: crates > 0 ? "#c9956b" : "#faf8f5" }}>
              {crates}
            </span>
            <span className="text-xs ml-1" style={{ color: "#9ca3af" }}>crate{crates !== 1 ? "s" : ""}</span>
          </div>

          <button
            onClick={() => dispatch({ type: "SET_GLASSWARE", glassType, crates: crates + 1 })}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
            style={{
              background: "rgba(201,149,107,0.15)",
              border: "1px solid rgba(201,149,107,0.3)",
              color: "#c9956b",
              cursor: "pointer",
            }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Live calc */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="text-right"
            >
              <p className="text-xs" style={{ color: "#9ca3af" }}>
                {totalGlasses} glasses
              </p>
              <p className="text-sm font-bold" style={{ color: "#c9956b" }}>
                {formatGBP(totalCost)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Step5Glassware({ state, dispatch, onNext, onBack, guestCount }: Step5Props) {
  const recommended = getRecommendedGlassCrates(guestCount);

  const glasswareTotal = GLASS_TYPE_ORDER.reduce((sum, gt) => {
    const crates = (state.glassware[gt] as number) ?? 0;
    return sum + getGlassCrateCost(gt, crates);
  }, 0);

  const hasSelections = GLASS_TYPE_ORDER.some((gt) => ((state.glassware[gt] as number) ?? 0) > 0);

  const applyRecommended = () => {
    Object.entries(recommended).forEach(([gt, crates]) => {
      dispatch({ type: "SET_GLASSWARE", glassType: gt as GlassType, crates });
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-[family-name:var(--font-young-serif)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          Glassware
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Select your glassware by the crate. We&apos;ll deliver and collect.
        </p>
      </div>

      {/* Recommended suggestion banner */}
      <div
        className="flex items-start gap-3 rounded-xl p-4"
        style={{ background: "rgba(201,149,107,0.06)", border: "1px solid rgba(201,149,107,0.15)" }}
      >
        <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#c9956b" }} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: "#e0b48a" }}>
            Recommended for {guestCount} guests
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            {Object.entries(recommended)
              .map(([gt, c]) => `${c} crate${c > 1 ? "s" : ""} ${GLASS_DEFINITIONS[gt as GlassType].name}`)
              .join(", ")}
          </p>
        </div>
        <button
          onClick={applyRecommended}
          className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
          style={{
            background: "rgba(201,149,107,0.15)",
            border: "1px solid rgba(201,149,107,0.3)",
            color: "#c9956b",
          }}
        >
          Apply
        </button>
      </div>

      {/* Skip option */}
      <p className="text-xs" style={{ color: "#9ca3af" }}>
        Glassware is optional — skip if you&apos;re providing your own or don&apos;t need it.
      </p>

      {/* Glass grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GLASS_TYPE_ORDER.map((gt) => (
          <GlassCard
            key={gt}
            glassType={gt}
            state={state}
            dispatch={dispatch}
            recommended={recommended[gt]}
          />
        ))}
      </div>

      {/* Running total */}
      <AnimatePresence>
        {hasSelections && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl p-4 flex items-center justify-between"
            style={{
              background: "rgba(201, 149, 107, 0.08)",
              border: "1px solid rgba(201, 149, 107, 0.2)",
            }}
          >
            <span className="text-sm font-medium" style={{ color: "#e0b48a" }}>
              Glassware subtotal
            </span>
            <span className="text-base font-bold" style={{ color: "#c9956b" }}>
              {formatGBP(glasswareTotal)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
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
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm"
          style={{
            background: "linear-gradient(135deg, #c9956b, #e0b48a)",
            color: "#0a0f1c",
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          {hasSelections ? "Continue" : "Skip — no glassware needed"}
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
