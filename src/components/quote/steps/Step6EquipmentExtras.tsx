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
  Refrigerator,
  Zap,
} from "lucide-react";
import type { QuoteState, QuoteAction, ExtraItem, EquipmentItem, DrinkUpgradeItem } from "@/lib/quote-types";
import { formatGBP, EQUIPMENT_PRICES, DRINK_UPGRADE_PRICES } from "@/lib/quote-pricing";

interface Step6Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
  onBack: () => void;
  guestCount: number;
  duration: number;
}

// ─── Equipment Section ───────────────────────────────────────────────────────

interface EquipmentDef {
  key: keyof EquipmentItem;
  label: string;
  description: string;
  price: string;
  type: "stepper" | "toggle";
}

const EQUIPMENT_ITEMS: EquipmentDef[] = [
  {
    key: "backBarFridge",
    label: "Double Back Bar Fridge",
    description: "Professional double-door back bar fridge",
    price: `${formatGBP(EQUIPMENT_PRICES.backBarFridge)} each`,
    type: "stepper",
  },
  {
    key: "tallWineFridge",
    label: "Tall Wine Fridge",
    description: "Temperature-controlled tall wine fridge",
    price: `${formatGBP(EQUIPMENT_PRICES.tallWineFridge)} each`,
    type: "stepper",
  },
  {
    key: "circularLedFull",
    label: "Circular LED Bar (Full Circle)",
    description: "Stunning full-circle LED feature bar",
    price: formatGBP(EQUIPMENT_PRICES.circularLedFull),
    type: "toggle",
  },
  {
    key: "circularLedHalf",
    label: "Circular LED Bar (Half Circle)",
    description: "Half-circle LED feature bar",
    price: formatGBP(EQUIPMENT_PRICES.circularLedHalf),
    type: "toggle",
  },
];

function EquipmentCard({
  item,
  state,
  dispatch,
}: {
  item: EquipmentDef;
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
}) {
  if (item.type === "stepper") {
    const val = state.equipment[item.key] as number;
    const isActive = val > 0;
    return (
      <div
        className="rounded-2xl p-4 transition-all"
        style={{
          background: isActive ? "rgba(201,149,107,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isActive ? "rgba(201,149,107,0.2)" : "rgba(255,255,255,0.05)" }}
            >
              <Refrigerator className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{item.description}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>{item.price}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (val > 0) dispatch({ type: "SET_EQUIPMENT", key: item.key, value: val - 1 });
              }}
              disabled={val === 0}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
              style={{
                background: val > 0 ? "rgba(201,149,107,0.15)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${val > 0 ? "rgba(201,149,107,0.3)" : "rgba(255,255,255,0.08)"}`,
                color: val > 0 ? "#c9956b" : "#9ca3af",
                cursor: val > 0 ? "pointer" : "not-allowed",
              }}
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-5 text-center text-sm font-bold" style={{ color: "#faf8f5" }}>{val}</span>
            <button
              onClick={() => dispatch({ type: "SET_EQUIPMENT", key: item.key, value: val + 1 })}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
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
        </div>
      </div>
    );
  }

  // Toggle
  const isActive = state.equipment[item.key] as boolean;
  return (
    <motion.button
      onClick={() => dispatch({ type: "SET_EQUIPMENT", key: item.key, value: !isActive })}
      className="relative text-left rounded-2xl p-4 w-full transition-all"
      style={{
        background: isActive ? "rgba(201,149,107,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
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
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isActive ? "rgba(201,149,107,0.2)" : "rgba(255,255,255,0.05)" }}
        >
          <Zap className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{item.label}</p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{item.description}</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>{item.price}</p>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Add-ons Section ─────────────────────────────────────────────────────────

interface ExtraDef {
  key: keyof ExtraItem;
  label: string;
  description: string;
  icon: React.ElementType;
  price: (guests: number, duration: number) => number;
  priceLabel: (guests: number, duration: number) => string;
  type: "toggle" | "lateNight" | "staffStepper";
}

interface DrinkUpgradeDef {
  key: keyof DrinkUpgradeItem;
  label: string;
  description: string;
  icon: React.ElementType;
  perGuest: number;
}

const DRINK_UPGRADES: DrinkUpgradeDef[] = [
  {
    key: "champagneService",
    label: "Champagne Service",
    description: "Welcome champagne and top-ups throughout service",
    icon: Sparkles,
    perGuest: DRINK_UPGRADE_PRICES.champagneService,
  },
  {
    key: "premiumSpirits",
    label: "Premium Spirits Upgrade",
    description: "Grey Goose, Hendricks and premium house pours",
    icon: Wine,
    perGuest: DRINK_UPGRADE_PRICES.premiumSpirits,
  },
  {
    key: "craftBeerSelection",
    label: "Craft Beer Selection",
    description: "Expanded rotating craft beer and cider lineup",
    icon: Coffee,
    perGuest: DRINK_UPGRADE_PRICES.craftBeerSelection,
  },
  {
    key: "premiumWineUpgrade",
    label: "Premium Wine Upgrade",
    description: "Enhanced red, white and rosé wine menu",
    icon: GlassWater,
    perGuest: DRINK_UPGRADE_PRICES.premiumWineUpgrade,
  },
];

const EXTRAS: ExtraDef[] = [
  {
    key: "cocktailMenu",
    label: "Signature Cocktail Menu",
    description: "Custom signature cocktail list for your event",
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
  extra: ExtraDef;
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
          background: isActive ? "rgba(201,149,107,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
        }}
        layout
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isActive ? "rgba(201,149,107,0.2)" : "rgba(255,255,255,0.05)" }}>
              <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{extra.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{extra.description}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>{extra.priceLabel(guestCount, duration)}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: "SET_EXTRA", key: "lateNightExtension", value: isActive ? 0 : 1 })}
            className="w-10 h-6 rounded-full relative transition-all shrink-0"
            style={{ background: isActive ? "#c9956b" : "rgba(255,255,255,0.1)" }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 rounded-full"
              style={{ background: "#faf8f5" }}
              animate={{ left: isActive ? "calc(100% - 1.25rem)" : "0.25rem" }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>
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
          background: isActive ? "rgba(201,149,107,0.08)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
        }}
        layout
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: isActive ? "rgba(201,149,107,0.2)" : "rgba(255,255,255,0.05)" }}>
              <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{extra.label}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{extra.description}</p>
              <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>{extra.priceLabel(guestCount, duration)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { if (currentVal > 0) dispatch({ type: "SET_EXTRA", key: "extraStaff", value: currentVal - 1 }); }}
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
            <span className="w-5 text-center text-sm font-bold" style={{ color: "#faf8f5" }}>{currentVal}</span>
            <button
              onClick={() => { if (currentVal < 5) dispatch({ type: "SET_EXTRA", key: "extraStaff", value: currentVal + 1 }); }}
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

  const isActive = state.extras[extra.key] as boolean;
  return (
    <motion.button
      onClick={() => dispatch({ type: "SET_EXTRA", key: extra.key, value: !isActive })}
      className="relative text-left rounded-2xl p-4 w-full transition-all"
      style={{
        background: isActive ? "rgba(201,149,107,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
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
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isActive ? "rgba(201,149,107,0.2)" : "rgba(255,255,255,0.05)" }}>
          <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{extra.label}</p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{extra.description}</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>{extra.priceLabel(guestCount, duration)}</p>
        </div>
      </div>
    </motion.button>
  );
}

function DrinkUpgradeCard({
  item,
  state,
  dispatch,
  guestCount,
}: {
  item: DrinkUpgradeDef;
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  guestCount: number;
}) {
  const isActive = state.drinks[item.key];
  const Icon = item.icon;
  const total = item.perGuest * guestCount;

  return (
    <motion.button
      onClick={() => dispatch({ type: "SET_DRINK_UPGRADE", key: item.key, value: !isActive })}
      className="relative text-left rounded-2xl p-4 w-full transition-all"
      style={{
        background: isActive ? "rgba(201,149,107,0.08)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isActive ? "rgba(201,149,107,0.4)" : "rgba(255,255,255,0.08)"}`,
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
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
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: isActive ? "rgba(201,149,107,0.2)" : "rgba(255,255,255,0.05)" }}
        >
          <Icon className="w-4 h-4" style={{ color: isActive ? "#c9956b" : "#9ca3af" }} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{item.label}</p>
          <p className="text-xs mt-0.5" style={{ color: "#9ca3af" }}>{item.description}</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: "#c9956b" }}>
            {formatGBP(total)} ({formatGBP(item.perGuest)} × {guestCount} guests)
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export function Step6EquipmentExtras({ state, dispatch, onNext, onBack, guestCount, duration }: Step6Props) {
  const equipmentTotal =
    state.equipment.backBarFridge * EQUIPMENT_PRICES.backBarFridge +
    state.equipment.tallWineFridge * EQUIPMENT_PRICES.tallWineFridge +
    (state.equipment.circularLedFull ? EQUIPMENT_PRICES.circularLedFull : 0) +
    (state.equipment.circularLedHalf ? EQUIPMENT_PRICES.circularLedHalf : 0);

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

  const drinksTotal =
    (state.drinks.champagneService ? DRINK_UPGRADE_PRICES.champagneService * guestCount : 0) +
    (state.drinks.premiumSpirits ? DRINK_UPGRADE_PRICES.premiumSpirits * guestCount : 0) +
    (state.drinks.craftBeerSelection ? DRINK_UPGRADE_PRICES.craftBeerSelection * guestCount : 0) +
    (state.drinks.premiumWineUpgrade ? DRINK_UPGRADE_PRICES.premiumWineUpgrade * guestCount : 0);

  const sectionTotal = equipmentTotal + drinksTotal + extrasTotal;

  return (
    <div className="space-y-8 pb-20">
      {/* Heading */}
      <div>
        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-young-serif)] mb-2" style={{ color: "#faf8f5" }}>
          Equipment & Extras
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Add equipment hire and enhancements to complete your setup
        </p>
      </div>

      {/* Equipment section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c9956b" }}>
          Equipment Hire
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {EQUIPMENT_ITEMS.map((item) => (
            <EquipmentCard key={item.key} item={item} state={state} dispatch={dispatch} />
          ))}
        </div>
      </div>

      {/* Drinks upgrades section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "#c9956b" }}>
          Drinks Package Upgrades
        </h3>
        <p className="text-sm mb-4" style={{ color: "#9ca3af" }}>
          Standard Package is included for All Inclusive. Add premium upgrades per guest below.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DRINK_UPGRADES.map((item) => (
            <DrinkUpgradeCard
              key={item.key}
              item={item}
              state={state}
              dispatch={dispatch}
              guestCount={guestCount}
            />
          ))}
        </div>
      </div>

      {/* Add-ons section */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-4" style={{ color: "#c9956b" }}>
          Add-ons & Enhancements
        </h3>
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
      </div>

      {/* Running total */}
      <AnimatePresence>
        {sectionTotal > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl p-4 flex items-center justify-between"
            style={{ background: "rgba(201,149,107,0.08)", border: "1px solid rgba(201,149,107,0.2)" }}
          >
            <span className="text-sm font-medium" style={{ color: "#e0b48a" }}>
              Equipment & extras subtotal
            </span>
            <span className="text-base font-bold" style={{ color: "#c9956b" }}>
              {formatGBP(sectionTotal)}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex gap-3">
        <motion.button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#9ca3af" }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>

        <motion.button
          onClick={onNext}
          className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm"
          style={{ background: "linear-gradient(135deg, #c9956b, #e0b48a)", color: "#0a0f1c" }}
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
