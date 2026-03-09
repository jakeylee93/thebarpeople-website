"use client";

import { useReducer, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { QuoteSummary } from "./QuoteSummary";
import { Step1EventBasics } from "./steps/Step1EventBasics";
import { Step2GuestCount } from "./steps/Step2GuestCount";
import { Step3ServiceType } from "./steps/Step3ServiceType";
import { Step4BarSelection } from "./steps/Step4BarSelection";
import { Step5Glassware } from "./steps/Step5Glassware";
import { Step6EquipmentExtras } from "./steps/Step6EquipmentExtras";
import { Step7ContactDetails } from "./steps/Step7ContactDetails";
import { Step8ReviewConfirm } from "./steps/Step8ReviewConfirm";
import { calculatePricing } from "@/lib/quote-pricing";
import type { QuoteState, QuoteAction, ExtraItem, EquipmentItem, DrinkUpgradeItem } from "@/lib/quote-types";

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

const DEFAULT_EQUIPMENT: EquipmentItem = {
  backBarFridge: 0,
  tallWineFridge: 0,
  circularLedFull: false,
  circularLedHalf: false,
};

const DEFAULT_DRINK_UPGRADES: DrinkUpgradeItem = {
  champagneService: false,
  premiumSpirits: false,
  craftBeerSelection: false,
  premiumWineUpgrade: false,
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
  glassware: {},
  equipment: DEFAULT_EQUIPMENT,
  drinks: DEFAULT_DRINK_UPGRADES,
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

    case "SET_GLASSWARE":
      return {
        ...state,
        glassware: {
          ...state.glassware,
          [action.glassType]: Math.max(0, action.crates),
        },
      };

    case "SET_EQUIPMENT":
      return {
        ...state,
        equipment: {
          ...state.equipment,
          [action.key]: action.value,
        } as EquipmentItem,
      };

    case "SET_DRINK_UPGRADE":
      return {
        ...state,
        drinks: {
          ...state.drinks,
          [action.key]: action.value,
        },
      };

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

const TOTAL_STEPS = 8;

// ─── QuoteBuilder ─────────────────────────────────────────────────────────────

export function QuoteBuilder() {
  const [state, dispatch] = useReducer(quoteReducer, INITIAL_STATE);
  const [direction, setDirection] = useState(1);
  const [editingGuests, setEditingGuests] = useState(false);
  const [guestDraft, setGuestDraft] = useState(String(INITIAL_STATE.guestCount));

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
  const commitGuestCount = useCallback(() => {
    const parsed = Number.parseInt(guestDraft, 10);
    const nextValue = Number.isFinite(parsed) ? parsed : state.guestCount;
    dispatch({ type: "SET_GUEST_COUNT", value: nextValue });
    setGuestDraft(String(Math.min(500, Math.max(10, nextValue))));
    setEditingGuests(false);
  }, [guestDraft, state.guestCount]);

  // Staff only: skip bar selection (step 4), render step 5 content at step 4 slot
  const isStaffOnly = state.serviceType === "staff_only";

  const renderStep = () => {
    const { currentStep } = state;

    if (currentStep === 1) {
      return <Step1EventBasics state={state} dispatch={dispatch} onNext={goNext} />;
    }
    if (currentStep === 2) {
      return <Step2GuestCount state={state} dispatch={dispatch} onNext={goNext} onBack={goBack} />;
    }
    if (currentStep === 3) {
      return (
        <Step3ServiceType
          state={state}
          dispatch={dispatch}
          onNext={goNext}
          onBack={goBack}
          guestCount={state.guestCount}
          duration={state.duration}
        />
      );
    }
    if (currentStep === 4) {
      if (isStaffOnly) {
        return (
          <Step5Glassware
            state={state}
            dispatch={dispatch}
            onNext={goNext}
            onBack={goBack}
            guestCount={state.guestCount}
          />
        );
      }
      return (
        <Step4BarSelection
          state={state}
          dispatch={dispatch}
          onNext={goNext}
          onBack={goBack}
          serviceType={state.serviceType ?? "all_inclusive"}
          guestCount={state.guestCount}
        />
      );
    }
    if (currentStep === 5) {
      return (
        <Step5Glassware
          state={state}
          dispatch={dispatch}
          onNext={goNext}
          onBack={goBack}
          guestCount={state.guestCount}
        />
      );
    }
    if (currentStep === 6) {
      return (
        <Step6EquipmentExtras
          state={state}
          dispatch={dispatch}
          onNext={goNext}
          onBack={goBack}
          guestCount={state.guestCount}
          duration={state.duration}
        />
      );
    }
    if (currentStep === 7) {
      return (
        <Step7ContactDetails
          state={state}
          dispatch={dispatch}
          onBack={goBack}
          onSubmit={goNext}
        />
      );
    }
    if (currentStep === 8) {
      return (
        <Step8ReviewConfirm
          state={state}
          onBack={goBack}
          onGoToStep={goToStep}
        />
      );
    }
    return null;
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3" style={{ color: "#c9956b" }}>
              Instant Estimate
            </p>
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-[family-name:var(--font-young-serif)] mb-4"
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
          background: "rgba(10,15,28,0.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <ProgressBar
            currentStep={state.currentStep}
            completedSteps={completedStepsArray}
            onStepClick={goToStep}
            totalSteps={TOTAL_STEPS}
          />
          <div
            className="mt-3 rounded-xl px-4 py-2.5 flex items-center justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" style={{ color: "#c9956b" }} />
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                {editingGuests ? "Set guests" : `👥 ${state.guestCount} guests`}
              </p>
            </div>
            {editingGuests ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={10}
                  max={500}
                  step={10}
                  value={guestDraft}
                  onChange={(e) => setGuestDraft(e.target.value)}
                  onBlur={commitGuestCount}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commitGuestCount();
                    if (e.key === "Escape") {
                      setGuestDraft(String(state.guestCount));
                      setEditingGuests(false);
                    }
                  }}
                  autoFocus
                  className="w-20 px-2 py-1 rounded-md text-sm"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#faf8f5" }}
                />
                <button
                  onClick={commitGuestCount}
                  className="text-xs px-2.5 py-1 rounded-md"
                  style={{ background: "rgba(201,149,107,0.2)", color: "#e0b48a", border: "1px solid rgba(201,149,107,0.4)" }}
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setGuestDraft(String(state.guestCount));
                  setEditingGuests(true);
                }}
                className="text-xs px-2.5 py-1 rounded-md"
                style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Edit
              </button>
            )}
          </div>
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
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Quote summary — 1/3 width on desktop, sticky */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <QuoteSummary state={state} pricing={pricing} onGoToStep={goToStep} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile summary */}
      <div className="lg:hidden">
        <QuoteSummary state={state} pricing={pricing} onGoToStep={goToStep} />
      </div>
    </div>
  );
}
