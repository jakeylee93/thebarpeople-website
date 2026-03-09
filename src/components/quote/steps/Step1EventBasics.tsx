"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Briefcase,
  Cake,
  Flower2,
  Gift,
  Music,
  Sparkles,
  Building2,
  Trees,
  LayoutGrid,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuoteState, QuoteAction, EventType, VenueType } from "@/lib/quote-types";
import { step1Schema } from "@/lib/quote-types";

interface Step1Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onNext: () => void;
}

const EVENT_TYPES: { value: EventType; label: string; icon: React.ElementType }[] = [
  { value: "wedding", label: "Wedding", icon: Heart },
  { value: "corporate", label: "Corporate", icon: Briefcase },
  { value: "birthday", label: "Birthday", icon: Cake },
  { value: "garden_party", label: "Garden Party", icon: Flower2 },
  { value: "christmas", label: "Christmas", icon: Gift },
  { value: "festival", label: "Festival", icon: Music },
  { value: "other", label: "Other", icon: Sparkles },
];

const VENUE_TYPES: { value: VenueType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: "indoor", label: "Indoor", icon: Building2, desc: "Venue, hall, marquee" },
  { value: "outdoor", label: "Outdoor", icon: Trees, desc: "Garden, field, terrace" },
  { value: "both", label: "Both", icon: LayoutGrid, desc: "Indoor & outdoor areas" },
];

const today = new Date().toISOString().split("T")[0];

export function Step1EventBasics({ state, dispatch, onNext }: Step1Props) {
  const [touched, setTouched] = useState<Partial<Record<"eventDate" | "postcode", boolean>>>({});
  const [postcodeError, setPostcodeError] = useState("");

  const validatePostcode = (value: string) => {
    const result = step1Schema.shape.postcode.safeParse(value);
    setPostcodeError(result.success ? "" : "Please enter a valid UK postcode (e.g. E11 1AA)");
  };

  const isValid =
    state.eventType !== null &&
    state.eventDate !== "" &&
    state.postcode !== "" &&
    state.venueType !== null &&
    step1Schema.shape.postcode.safeParse(state.postcode).success;

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          Tell us about your event
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Let&apos;s start with the basics
        </p>
      </div>

      {/* Event Type */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold tracking-wide uppercase" style={{ color: "#9ca3af" }}>
          Event Type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {EVENT_TYPES.map(({ value, label, icon: Icon }) => {
            const isSelected = state.eventType === value;
            return (
              <motion.button
                key={value}
                onClick={() => dispatch({ type: "SET_EVENT_TYPE", value })}
                className="relative flex flex-col items-center gap-2 p-3.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isSelected ? "rgba(201, 149, 107, 0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isSelected ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
                  color: isSelected ? "#e0b48a" : "#9ca3af",
                }}
                whileHover={{ scale: 1.02, borderColor: "rgba(255,255,255,0.15)" }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon
                  className="w-5 h-5"
                  style={{ color: isSelected ? "#c9956b" : "#9ca3af" }}
                />
                <span style={{ color: isSelected ? "#faf8f5" : "#9ca3af" }}>{label}</span>
                {isSelected && (
                  <motion.div
                    layoutId="event-type-selection"
                    className="absolute inset-0 rounded-xl"
                    style={{ border: "1px solid #c9956b", pointerEvents: "none" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Date & Postcode row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Event Date */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold tracking-wide uppercase" style={{ color: "#9ca3af" }}>
            Event Date
          </label>
          <input
            type="date"
            min={today}
            value={state.eventDate}
            onChange={(e) => dispatch({ type: "SET_EVENT_DATE", value: e.target.value })}
            onBlur={() => setTouched((t) => ({ ...t, eventDate: true }))}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${touched.eventDate && !state.eventDate ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
              color: state.eventDate ? "#faf8f5" : "#9ca3af",
              colorScheme: "dark",
            }}
          />
          {touched.eventDate && !state.eventDate && (
            <p className="text-xs" style={{ color: "#ef4444" }}>
              Please select a date
            </p>
          )}
        </div>

        {/* Postcode */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold tracking-wide uppercase" style={{ color: "#9ca3af" }}>
            Event Postcode
          </label>
          <input
            type="text"
            placeholder="e.g. E11 1AA"
            value={state.postcode}
            onChange={(e) => {
              dispatch({ type: "SET_POSTCODE", value: e.target.value.toUpperCase() });
              if (touched.postcode) validatePostcode(e.target.value);
            }}
            onBlur={() => {
              setTouched((t) => ({ ...t, postcode: true }));
              validatePostcode(state.postcode);
            }}
            maxLength={8}
            className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${touched.postcode && postcodeError ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
              color: "#faf8f5",
            }}
          />
          {touched.postcode && postcodeError && (
            <p className="text-xs" style={{ color: "#ef4444" }}>
              {postcodeError}
            </p>
          )}
        </div>
      </div>

      {/* Venue Type */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold tracking-wide uppercase" style={{ color: "#9ca3af" }}>
          Venue Type
        </label>
        <div className="grid grid-cols-3 gap-3">
          {VENUE_TYPES.map(({ value, label, icon: Icon, desc }) => {
            const isSelected = state.venueType === value;
            return (
              <motion.button
                key={value}
                onClick={() => dispatch({ type: "SET_VENUE_TYPE", value })}
                className="flex flex-col items-center gap-2 p-4 rounded-xl transition-all"
                style={{
                  background: isSelected ? "rgba(201, 149, 107, 0.12)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isSelected ? "#c9956b" : "rgba(255,255,255,0.08)"}`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <Icon className="w-5 h-5" style={{ color: isSelected ? "#c9956b" : "#9ca3af" }} />
                <span className="text-sm font-semibold" style={{ color: isSelected ? "#faf8f5" : "#9ca3af" }}>
                  {label}
                </span>
                <span className="text-xs text-center hidden sm:block" style={{ color: "#9ca3af" }}>
                  {desc}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <motion.button
        onClick={onNext}
        disabled={!isValid}
        className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition-all"
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
  );
}
