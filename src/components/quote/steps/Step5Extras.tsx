"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Wine,
  Sparkles,
  Lightbulb,
  Tag,
  GlassWater,
  Clock,
  Users,
  Coffee,
  UserPlus,
  Check,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import type { QuoteState, QuoteAction, ExtraItem } from "@/lib/quote-types";
import { formatGBP } from "@/lib/quote-pricing";

interface Step5Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
  onBack: () => void;
  guestCount: number;
  duration: number;
}

interface ExtraDefinition {
  key: keyof ExtraItem;
  label: string;
  description: string;
  icon: React.ElementType;
  price: (guests: number, duration: number) => number;
  priceLabel: (guests: number, duration: number) => string;
  type: "toggle" | "lateNight" | "staffStepper";
}

const EXTRAS: ExtraDefinition[] = [
  {
    key: "cocktailMenu",
    label: "Cocktail Menu",
    description: "Custom printed menus for every table",
    icon: Wine,
    price: (g) => 5 * g,
    priceLabel: (g) => `${formatGBP(5 * g)} (£5 × ${g} guests)`,
    type: "toggle",
  },
  {
    key: "glasswareUpgrade",
    label: "Premium Crystal Glassware",
    description: "Upgrade to premium crystal glassware",
    icon: GlassWater,
    price: () => 150,
    priceLabel: () => formatGBP(150),
    type: "toggle",
  },
  {
    key: "ledLighting",
    label: "LED Bar Lighting",
    description: "Colour-changing LED strip lighting",
    icon: Lightbulb,
    price: () => 200,
    priceLabel: () => formatGBP(200),
    type: "toggle",
  },
  {
    key: "barBranding",
    label: "Bar Branding",
    description: "Custom printed panels for your event",
    icon: Tag,
    price: () => 350,
    priceLabel: () => formatGBP(350),
    type: "toggle",
  },
  {
    key: "welcomeDrinks",
    label: "Welcome Drinks",
    description: "Drinks on arrival for all guests",
    icon: Sparkles,
    price: (g) => 4 * g,
    priceLabel: (g) => `${formatGBP(4 * g)} (£4 × ${g} guests)`,
    type: "toggle",
  },
  {
    key: "cocktailMasterclass",
    label: "Cocktail Masterclass",
    description: "Interactive masterclass for guests",
    icon: Users,
    price: (g) => 25 * g,
    priceLabel: (g) => `${formatGBP(25 * g)} (£25 × ${g} guests)`,
    type: "toggle",
  },
  {
    key: "mocktailPackage",
    label: "Mocktail Package",
    description: "Non-alcoholic cocktail range included",
    icon: Coffee,
    price: (g) => 3 * g,
    priceLabel: (g) => `${formatGBP(3 * g)} (£3 × ${g} guests)`,
    type: "toggle",
  },
  {
    key: "lateNightExtension",
    label: "Late Night Extension",
    description: "Extend your bar service after midnight",
    icon: Clock,
    price: (_, __, hours?: number) => 150 * (hours ?? 1),
    priceLabel: () => "£150 per hour",
    type: "lateNight",
  },
  {
    key: "extraStaff",
    label: "Extra Staff",
    description: "Additional bartenders for faster service",
    icon: UserPlus,
    price: (_, d, count?: number) => 25 * d * (count ?? 1),
    priceLabel: (_, d) => `£25 per staff member × ${d}hrs`,
    type: "staffStepper",
  },
];

function ExtraCard({
  extra,
  state,
  dispatch,
  guestCount,
  duration,
}: {
  extra: ExtraDefinition;
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  guestCount: number;
  duration: number;
}) {
  const Icon = extra.icon;

  if (extra.type === "lateNight") {
    const currentVal = state.extras.lateNightExtension as number;
    const isActive = currentVal > 0;

    return (
      <motion.div
        className="rounded-2xl p-4 transition-all"
        style={{
          background: isActive ? "rgba(201, 149, 107, 0.1)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
        }}
        layout
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: isActive ? "rgba(201, 149, 107, 0.2)" : "rgba(255,255,255,0.05)" }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: isActive ? "#faf8f5" : "#faf8f5" }}>
                {extra.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                {extra.description}
              </p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>
                {extra.priceLabel(guestCount, duration)}
              </p>
            </div>
          </div>

          {/* Toggle on/off */}
          <button
            onClick={() =>
              dispatch({
                type: "SET_EXTRA",
                key: "lateNightExtension",
                value: isActive ? 0 : 1,
              })
            }
            className="w-10 h-6 rounded-full relative transition-all shrink-0"
            style={{
              background: isActive ? "#c9956b" : "rgba(255,255,255,0.1)",
            }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 rounded-full"
              style={{ background: "#faf8f5" }}
              animate={{ left: isActive ? "calc(100% - 1.25rem)" : "0.25rem" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Hours selector */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[1, 2, 3].map((h) => (
                  <button
                    key={h}
                    onClick={() => dispatch({ type: "SET_EXTRA", key: "lateNightExtension", value: h as 0 | 1 | 2 | 3 })}
                    className="flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all"
                    style={{
                      background: currentVal === h ? "#c9956b" : "rgba(255,255,255,0.06)",
                      color: currentVal === h ? "#0a0f1c" : "#9ca3af",
                    }}
                  >
                    +{h}h
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  if (extra.type === "staffStepper") {
    const currentVal = state.extras.extraStaff as number;
    const isActive = currentVal > 0;

    return (
      <motion.div
        className="rounded-2xl p-4 transition-all"
        style={{
          background: isActive ? "rgba(201, 149, 107, 0.1)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
        }}
        layout
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
              style={{ background: isActive ? "rgba(201, 149, 107, 0.2)" : "rgba(255,255,255,0.05)" }}
            >
              <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                {extra.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
                {extra.description}
              </p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>
                {extra.priceLabel(guestCount, duration)}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (currentVal > 0)
                  dispatch({ type: "SET_EXTRA", key: "extraStaff", value: currentVal - 1 });
              }}
              disabled={currentVal === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                background: currentVal > 0 ? "rgba(201,149,107,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${currentVal > 0 ? "rgba(201,149,107,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: currentVal > 0 ? "#c9956b" : "#9ca3af",
                cursor: currentVal > 0 ? "pointer" : "not-allowed",
              }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-5 text-center text-sm font-bold" style={{ color: "#faf8f5" }}>
              {currentVal}
            </span>
            <button
              onClick={() => {
                if (currentVal < 5)
                  dispatch({ type: "SET_EXTRA", key: "extraStaff", value: currentVal + 1 });
              }}
              disabled={currentVal >= 5}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                background: currentVal < 5 ? "rgba(201,149,107,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${currentVal < 5 ? "rgba(201,149,107,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: currentVal < 5 ? "#c9956b" : "#9ca3af",
                cursor: currentVal < 5 ? "pointer" : "not-allowed",
              }}
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard toggle
  const isActive = state.extras[extra.key] as boolean;

  return (
    <motion.button
      onClick={() => dispatch({ type: "SET_EXTRA", key: extra.key, value: !isActive })}
      className="relative text-left rounded-2xl p-4 transition-all"
      style={{
        background: isActive ? "rgba(201, 149, 107, 0.1)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {/* Checkmark corner */}
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ background: "#c9956b" }}
        >
          <Check className="w-3 h-3" style={{ color: "#0a0f1c" }} strokeWidth={3} />
        </motion.div>
      )}

      <div className="flex items-start gap-3 pr-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: isActive ? "rgba(201, 149, 107, 0.2)" : "rgba(255,255,255,0.05)" }}
        >
          <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
            {extra.label}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>
            {extra.description}
          </p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>
            {extra.priceLabel(guestCount, duration)}
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export function Step5Extras({ state, dispatch, onNext, onBack, guestCount, duration }: Step5Props) {
  // Calculate extras total
  const extrasTotal =
    (state.extras.cocktailMenu ? 5 * guestCount : 0) +
    (state.extras.glasswareUpgrade ? 150 : 0) +
    (state.extras.ledLighting ? 200 : 0) +
    (state.extras.barBranding ? 350 : 0) +
    (state.extras.welcomeDrinks ? 4 * guestCount : 0) +
    state.extras.lateNightExtension * 150 +
    (state.extras.cocktailMasterclass ? 25 * guestCount : 0) +
    (state.extras.mocktailPackage ? 3 * guestCount : 0) +
    state.extras.extraStaff * 25 * duration;

  return (
    <div className="space-y-8 pb-20">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          Enhance your experience
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Add extras to make your event unforgettable
        </p>
      </div>

      {/* Extras grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {EXTRAS.map((extra) => (
          <ExtraCard
            key={extra.key}
            extra={extra}
            state={state}
            dispatch={dispatch}
            guestCount={guestCount}
            duration={duration}
          />
        ))}
      </div>

      {/* Extras running total */}
      <AnimatePresence>
        {extrasTotal > 0 && (
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
              Extras subtotal
            </span>
            <span className="text-base font-bold" style={{ color: "#c9956b" }}>
              {formatGBP(extrasTotal)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

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
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm"
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
