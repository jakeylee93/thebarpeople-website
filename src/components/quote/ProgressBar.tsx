"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  totalSteps?: number;
}

const STEP_LABELS = ["Event", "Guests", "Service", "Bar", "Glasses", "Extras", "Contact", "Review"];

export function ProgressBar({ currentStep, completedSteps, onStepClick, totalSteps = 8 }: ProgressBarProps) {
  const labels = STEP_LABELS.slice(0, totalSteps);

  return (
    <>
      {/* Mobile: simple progress bar */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        <p className="text-sm font-medium" style={{ color: "#9ca3af" }}>
          Step <span style={{ color: "#c9956b" }}>{currentStep}</span> of {totalSteps} —{" "}
          <span style={{ color: "#faf8f5" }}>{labels[currentStep - 1]}</span>
        </p>
        <div
          className="w-full h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #a97a52, #c9956b, #e0b48a)" }}
            initial={false}
            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Desktop: step dots */}
      <div className="hidden md:flex items-center justify-center w-full">
        <div className="flex items-center w-full max-w-3xl">
          {Array.from({ length: totalSteps }, (_, i) => {
            const stepNumber = i + 1;
            const isCompleted = completedSteps.includes(stepNumber);
            const isCurrent = currentStep === stepNumber;
            const isClickable = isCompleted || stepNumber <= currentStep;

            return (
              <div key={stepNumber} className="flex items-center flex-1 last:flex-none">
                {/* Step circle */}
                <div className="flex flex-col items-center gap-1.5">
                  <motion.button
                    onClick={() => isClickable && onStepClick(stepNumber)}
                    disabled={!isClickable}
                    className={cn(
                      "relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                      isClickable ? "cursor-pointer" : "cursor-default"
                    )}
                    style={{
                      backgroundColor: isCompleted
                        ? "#c9956b"
                        : isCurrent
                        ? "transparent"
                        : "rgba(255,255,255,0.05)",
                      border: isCurrent
                        ? "2px solid #c9956b"
                        : isCompleted
                        ? "2px solid #c9956b"
                        : "2px solid rgba(255,255,255,0.12)",
                      color: isCompleted ? "#0a0f1c" : isCurrent ? "#c9956b" : "#9ca3af",
                    }}
                    whileHover={isClickable ? { scale: 1.08 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                    animate={{
                      backgroundColor: isCompleted
                        ? "#c9956b"
                        : isCurrent
                        ? "transparent"
                        : "rgba(255,255,255,0.05)",
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    {isCompleted ? (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      >
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </motion.span>
                    ) : (
                      <span>{stepNumber}</span>
                    )}

                    {/* Pulse ring for current step */}
                    {isCurrent && (
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ border: "2px solid #c9956b" }}
                        animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                    )}
                  </motion.button>

                  <span
                    className="text-[10px] font-medium whitespace-nowrap"
                    style={{ color: isCurrent ? "#c9956b" : isCompleted ? "#e0b48a" : "#9ca3af" }}
                  >
                    {labels[i]}
                  </span>
                </div>

                {/* Connector line */}
                {stepNumber < totalSteps && (
                  <div
                    className="flex-1 h-px mx-1 mb-5 overflow-hidden"
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <motion.div
                      className="h-full"
                      style={{ transformOrigin: "left", background: "linear-gradient(90deg, #c9956b, #e0b48a)" }}
                      initial={false}
                      animate={{ scaleX: completedSteps.includes(stepNumber) ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
