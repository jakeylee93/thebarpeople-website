"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight, ArrowLeft, Users, DollarSign, Package, UserCheck } from "lucide-react";
import type { QuoteState, QuoteAction, ServiceType } from "@/lib/quote-types";
import { formatGBP, getServiceStartingPrice } from "@/lib/quote-pricing";

interface Step3Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
  onBack: () => void;
  guestCount: number;
  duration: number;
}

interface ServiceOption {
  value: ServiceType;
  label: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  popular?: boolean;
  showPrice: boolean;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    value: "all_inclusive",
    label: "All Inclusive",
    tagline: "The full experience",
    description: "Everything included. Bar hire, professional staff, drinks, glassware, ice, garnishes — all taken care of.",
    icon: Users,
    popular: true,
    showPrice: true,
  },
  {
    value: "cash_bar",
    label: "Cash Bar",
    tagline: "Pay-as-you-go",
    description: "Guests pay for their own drinks. You cover the setup, staffing and equipment. Great for corporate events.",
    icon: DollarSign,
    showPrice: true,
  },
  {
    value: "dry_hire",
    label: "Dry Hire",
    tagline: "Bar equipment only",
    description: "Rent the bar equipment and have your own team run it. You provide the drinks, ice and staff.",
    icon: Package,
    showPrice: false,
  },
  {
    value: "staff_only",
    label: "Staff Only",
    tagline: "Professional bartenders",
    description: "You already have a bar. We provide experienced, fully uniformed bartenders and mixologists.",
    icon: UserCheck,
    showPrice: false,
  },
];

const STANDARD_PACKAGE_ITEMS = [
  "House spirits (vodka, gin, rum, whisky)",
  "Standard mixers & soft drinks",
  "Beer & cider selection",
  "House wine (red, white, rosé)",
];

const PREMIUM_UPGRADE_ITEMS = [
  "Champagne Service — £8/guest",
  "Premium Spirits Upgrade — £4/guest",
  "Craft Beer Selection — £3/guest",
  "Premium Wine Upgrade — £5/guest",
  "Signature Cocktail Menu — £5/guest",
];

export function Step3ServiceType({ state, dispatch, onNext, onBack, guestCount }: Step3Props) {
  const isValid = state.serviceType !== null;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-young-serif)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          Choose your service type
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Select the package that best suits your event
        </p>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SERVICE_OPTIONS.map(({ value, label, tagline, description, icon: Icon, popular, showPrice }) => {
          const isSelected = state.serviceType === value;
          const startingPrice = showPrice ? getServiceStartingPrice(value, guestCount) : null;

          return (
            <motion.button
              key={value}
              onClick={() => dispatch({ type: "SET_SERVICE_TYPE", value })}
              className="relative text-left p-5 rounded-2xl transition-all"
              style={{
                background: isSelected ? "rgba(201, 149, 107, 0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${isSelected ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
              }}
              whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.15)" }}
              whileTap={{ scale: 0.99 }}
            >
              {/* Popular badge */}
              {popular && (
                <div
                  className="absolute top-3.5 right-3.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #c9956b, #e0b48a)",
                    color: "#0a0f1c",
                  }}
                >
                  Most Popular
                </div>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "#c9956b" }}
                >
                  <Check className="w-3.5 h-3.5" style={{ color: "#0a0f1c" }} strokeWidth={3} />
                </motion.div>
              )}

              <div className="space-y-3 pr-10">
                {/* Icon + title */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isSelected ? "rgba(201, 149, 107, 0.2)" : "rgba(255,255,255,0.05)",
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isSelected ? "#c9956b" : "#9ca3af" }}
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: isSelected ? "#faf8f5" : "#faf8f5" }}>
                      {label}
                    </p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>
                      {tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                  {description}
                </p>

                {/* Price */}
                {startingPrice !== null ? (
                  <p className="text-sm font-semibold" style={{ color: "#c9956b" }}>
                    From {formatGBP(startingPrice)}
                  </p>
                ) : (
                  <p className="text-sm" style={{ color: "#9ca3af" }}>
                    Price on consultation
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {state.serviceType && (
        <div
          className="rounded-2xl p-5 space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "#c9956b" }}>
              What&apos;s Included
            </p>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              Standard Package
              {state.serviceType === "all_inclusive" ? " (included in your All Inclusive base price)" : " (available on consultation)"}
            </p>
            <ul className="mt-2 space-y-1.5">
              {STANDARD_PACKAGE_ITEMS.map((item) => (
                <li key={item} className="text-sm" style={{ color: "#faf8f5" }}>
                  • {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] mb-2" style={{ color: "#c9956b" }}>
              Premium Upgrades
            </p>
            <ul className="space-y-1.5">
              {PREMIUM_UPGRADE_ITEMS.map((item) => (
                <li key={item} className="text-sm" style={{ color: "#9ca3af" }}>
                  • {item}
                </li>
              ))}
            </ul>
            <p className="text-xs mt-2" style={{ color: "#9ca3af" }}>
              Select these in Step 6: Equipment & Extras.
            </p>
          </div>
        </div>
      )}

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
