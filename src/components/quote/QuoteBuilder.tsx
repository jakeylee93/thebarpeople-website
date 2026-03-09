"use client";

import { useReducer, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { QuoteSummary } from "./QuoteSummary";
import { Step1EventBasics } from "./steps/Step1EventBasics";
import { Step2GuestCount } from "./steps/Step2GuestCount";
import { Step3ServiceType } from "./steps/Step3ServiceType";
import { Step4BarSelection } from "./steps/Step4BarSelection";
import { Step5Extras } from "./steps/Step5Extras";
import { Step6ContactDetails } from "./steps/Step6ContactDetails";
import { calculatePricing } from "@/lib/quote-pricing";
import type { QuoteState, QuoteAction, ExtraItem } from "@/lib/quote-types";

// ─── Initial State ──────────────────────────────────────────────────────────

const DEFAULT_EXTRAS: ExtraItem = {
  cocktailMenu: false,
  glasswareUpgrade: false,
  ledLighting: false,
  barBranding: false,
  welcomeDrinks: false,
  lateNightExtension: 0,
  cocktailMasterclass: false,
  mocktailPackage: false,
  extraStaff: 0,
};

const INITIAL_STATE: QuoteState = {
  currentStep: 1,
  completedSteps: new Set<number>(),
  eventType: null,
  eventDate: "",
  postcode: "",
  venueType: null,
  guestCount: 50,
  duration: 4,
  serviceType: null,
  barSelection: null,
  extras: DEFAULT_EXTRAS,
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  contactCompany: "",
  eventNotes: "",
  termsAccepted: false,
};

// ─── Reducer ─────────────────────────────────────────────────────────────────

function quoteReducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step };

    case "NEXT_STEP": {
      const completed = new Set(state.completedSteps);
      completed.add(state.currentStep);
      return { ...state, currentStep: state.currentStep + 1, completedSteps: completed };
    }

    case "PREV_STEP":
      return { ...state, currentStep: Math.max(1, state.currentStep - 1) };

    case "SET_EVENT_TYPE":
      return { ...state, eventType: action.value };

    case "SET_EVENT_DATE":
      return { ...state, eventDate: action.value };

    case "SET_POSTCODE":
      return { ...state, postcode: action.value };

    case "SET_VENUE_TYPE":
      return { ...state, venueType: action.value };

    case "SET_GUEST_COUNT":
      return { ...state, guestCount: Math.min(500, Math.max(10, action.value)) };

    case "SET_DURATION":
      return { ...state, duration: action.value };

    case "SET_SERVICE_TYPE":
      return { ...state, serviceType: action.value };

    case "SET_BAR_SELECTION":
      return { ...state, barSelection: action.value };

    case "SET_EXTRA":
      return {
        ...state,
        extras: {
          ...state.extras,
          [action.key]: action.value,
        } as ExtraItem,
      };

    case "SET_CONTACT":
      return { ...state, [action.key]: action.value };

    case "SET_TERMS":
      return { ...state, termsAccepted: action.value };

    default:
      return state;
  }
}

// ─── Animation Variants ───────────────────────────────────────────────────────

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -60 : 60, opacity: 0 }),
};

const transition = { type: "tween" as const, duration: 0.3, ease: "easeInOut" as const };

// ─── QuoteBuilder ─────────────────────────────────────────────────────────────

export function QuoteBuilder() {
  const [state, dispatch] = useReducer(quoteReducer, INITIAL_STATE);
  const [direction, setDirection] = useState(1);

  const pricing = calculatePricing(state);

  const goNext = useCallback(() => {
    setDirection(1);
    dispatch({ type: "NEXT_STEP" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    dispatch({ type: "PREV_STEP" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step > state.currentStep ? 1 : -1);
      dispatch({ type: "SET_STEP", step });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [state.currentStep]
  );

  const completedStepsArray = Array.from(state.completedSteps);

  // If step 3 is staff_only, skip step 4
  const effectiveNextFromStep3 = () => {
    if (state.serviceType === "staff_only") {
      setDirection(1);
      const completed = new Set(state.completedSteps);
      completed.add(3);
      completed.add(4); // mark step 4 as completed (skipped)
      dispatch({ type: "SET_STEP", step: 5 });
      // We need to update completedSteps separately — use NEXT_STEP twice
      dispatch({ type: "NEXT_STEP" });
      // Actually let's just go next twice via setTimeout
    } else {
      goNext();
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1c" }}>
      {/* Hero header */}
      <div
        className="relative py-12 md:py-16"
        style={{
          background: "linear-gradient(to bottom, rgba(201,149,107,0.06) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p
              className="text-xs font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "#c9956b" }}
            >
              Instant Estimate
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] mb-4"
              style={{ color: "#faf8f5" }}
            >
              Build Your Perfect Bar
            </h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto" style={{ color: "#9ca3af" }}>
              Get an instant estimate in under 60 seconds
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress */}
      <div
        className="sticky top-0 z-30 py-4 px-4 sm:px-6"
        style={{
          background: "rgba(10,15,28,0.9)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <ProgressBar
            currentStep={state.currentStep}
            completedSteps={completedStepsArray}
            onStepClick={goToStep}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step content — 2/3 width on desktop */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={state.currentStep}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={transition}
                >
                  {state.currentStep === 1 && (
                    <Step1EventBasics state={state} dispatch={dispatch} onNext={goNext} />
                  )}
                  {state.currentStep === 2 && (
                    <Step2GuestCount state={state} dispatch={dispatch} onNext={goNext} onBack={goBack} />
                  )}
                  {state.currentStep === 3 && (
                    <Step3ServiceType
                      state={state}
                      dispatch={dispatch}
                      onNext={goNext}
                      onBack={goBack}
                      guestCount={state.guestCount}
                      duration={state.duration}
                    />
                  )}
                  {state.currentStep === 4 && state.serviceType !== "staff_only" && (
                    <Step4BarSelection
                      state={state}
                      dispatch={dispatch}
                      onNext={goNext}
                      onBack={goBack}
                      serviceType={state.serviceType ?? "all_inclusive"}
                      guestCount={state.guestCount}
                    />
                  )}
                  {state.currentStep === 4 && state.serviceType === "staff_only" && (
                    // Staff only: skip bar, go to extras
                    <Step5Extras
                      state={state}
                      dispatch={dispatch}
                      onNext={goNext}
                      onBack={goBack}
                      guestCount={state.guestCount}
                      duration={state.duration}
                    />
                  )}
                  {state.currentStep === 5 && state.serviceType !== "staff_only" && (
                    <Step5Extras
                      state={state}
                      dispatch={dispatch}
                      onNext={goNext}
                      onBack={goBack}
                      guestCount={state.guestCount}
                      duration={state.duration}
                    />
                  )}
                  {state.currentStep === 5 && state.serviceType === "staff_only" && (
                    <Step6ContactDetails
                      state={state}
                      dispatch={dispatch}
                      onBack={goBack}
                      onSubmit={() => dispatch({ type: "NEXT_STEP" })}
                    />
                  )}
                  {state.currentStep === 6 && (
                    <Step6ContactDetails
                      state={state}
                      dispatch={dispatch}
                      onBack={goBack}
                      onSubmit={() => dispatch({ type: "NEXT_STEP" })}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quote summary — 1/3 width on desktop, sticky */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <QuoteSummary state={state} pricing={pricing} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile summary (rendered inside QuoteSummary component as fixed bottom panel) */}
      <div className="lg:hidden">
        <QuoteSummary state={state} pricing={pricing} />
      </div>
    </div>
  );
}
