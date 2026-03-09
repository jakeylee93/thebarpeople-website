"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Mail, Phone } from "lucide-react";
import type { QuoteState, QuoteAction } from "@/lib/quote-types";
import { step7Schema } from "@/lib/quote-types";

interface Step7Props {
  state: QuoteState;
  dispatch: React.Dispatch<QuoteAction>;
  onBack: () => void;
  onSubmit: () => void;
}

type FieldErrors = Partial<Record<"contactName" | "contactEmail" | "contactPhone" | "termsAccepted", string>>;

export function Step7ContactDetails({ state, dispatch, onBack, onSubmit }: Step7Props) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FieldErrors, boolean>>>({});

  const validateField = (field: keyof FieldErrors, value: string | boolean) => {
    const schema = step7Schema.shape[field];
    if (!schema) return;
    const result = schema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      [field]: result.success ? undefined : result.error.errors[0]?.message,
    }));
  };

  const handleSubmit = async () => {
    // Validate all
    const result = step7Schema.safeParse({
      contactName: state.contactName,
      contactEmail: state.contactEmail,
      contactPhone: state.contactPhone,
      termsAccepted: state.termsAccepted,
    });

    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof FieldErrors;
        fieldErrors[path] = err.message;
      });
      setErrors(fieldErrors);
      setTouched({ contactName: true, contactEmail: true, contactPhone: true, termsAccepted: true });
      return;
    }

    setLoading(true);
    // Simulate async submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Quote submission:", state);
    setLoading(false);
    setSubmitted(true);
    onSubmit();
  };

  const isCorporate = state.eventType === "corporate";
  const contactEmail = isCorporate ? "jake@thebarpeople.co.uk" : "kim@thebarpeople.co.uk";
  const contactName = isCorporate ? "Jake Lee" : "Kim Knight";
  const contactPhone = isCorporate ? "07557 402200" : "07724 601256";

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-12 space-y-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(201, 149, 107, 0.15)", border: "2px solid #c9956b" }}
          >
            <CheckCircle2 className="w-10 h-10" style={{ color: "#c9956b" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2
            className="text-3xl font-bold font-[family-name:var(--font-young-serif)]"
            style={{ color: "#faf8f5" }}
          >
            Your quote has been sent!
          </h2>
          <p className="text-base max-w-md" style={{ color: "#9ca3af" }}>
            We&apos;ll be in touch within 24 hours to discuss your event in detail and confirm your personalised quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-5 w-full max-w-sm space-y-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "#9ca3af" }}>
            Your point of contact
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "rgba(201,149,107,0.15)" }}
              >
                <span className="text-sm font-bold" style={{ color: "#c9956b" }}>
                  {contactName.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>
                  {contactName}
                </p>
                <p className="text-xs" style={{ color: "#9ca3af" }}>
                  {isCorporate ? "Corporate Events" : "Private Events"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 shrink-0" style={{ color: "#c9956b" }} />
              <a href={`mailto:${contactEmail}`} className="text-sm hover:underline" style={{ color: "#e0b48a" }}>
                {contactEmail}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 shrink-0" style={{ color: "#c9956b" }} />
              <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="text-sm" style={{ color: "#e0b48a" }}>
                {contactPhone}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2
          className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-young-serif)] mb-2"
          style={{ color: "#faf8f5" }}
        >
          Almost there
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          How do we reach you?
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name + Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            required
            value={state.contactName}
            placeholder="Jane Smith"
            error={touched.contactName ? errors.contactName : undefined}
            onChange={(v) => dispatch({ type: "SET_CONTACT", key: "contactName", value: v })}
            onBlur={() => {
              setTouched((t) => ({ ...t, contactName: true }));
              validateField("contactName", state.contactName);
            }}
          />
          <FormField
            label="Email Address"
            required
            type="email"
            value={state.contactEmail}
            placeholder="jane@example.com"
            error={touched.contactEmail ? errors.contactEmail : undefined}
            onChange={(v) => dispatch({ type: "SET_CONTACT", key: "contactEmail", value: v })}
            onBlur={() => {
              setTouched((t) => ({ ...t, contactEmail: true }));
              validateField("contactEmail", state.contactEmail);
            }}
          />
        </div>

        {/* Phone + Company row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="Phone Number"
            required
            type="tel"
            value={state.contactPhone}
            placeholder="07700 900000"
            error={touched.contactPhone ? errors.contactPhone : undefined}
            onChange={(v) => dispatch({ type: "SET_CONTACT", key: "contactPhone", value: v })}
            onBlur={() => {
              setTouched((t) => ({ ...t, contactPhone: true }));
              validateField("contactPhone", state.contactPhone);
            }}
          />
          <FormField
            label="Company / Organisation"
            hint="optional"
            value={state.contactCompany}
            placeholder="Acme Corp"
            onChange={(v) => dispatch({ type: "SET_CONTACT", key: "contactCompany", value: v })}
          />
        </div>

        {/* Event notes */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" style={{ color: "#9ca3af" }}>
            Tell us about your event{" "}
            <span className="font-normal text-xs" style={{ color: "rgba(156,163,175,0.6)" }}>
              optional
            </span>
          </label>
          <textarea
            rows={4}
            value={state.eventNotes}
            onChange={(e) => dispatch({ type: "SET_CONTACT", key: "eventNotes", value: e.target.value })}
            placeholder="Any special requirements, themes, or additional details..."
            className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#faf8f5",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(201,149,107,0.5)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,149,107,0.08)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Terms */}
        <div className="space-y-1.5">
          <label className="flex items-start gap-3 cursor-pointer">
            <div
              className="relative mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                background: state.termsAccepted ? "#c9956b" : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${state.termsAccepted ? "#c9956b" : touched.termsAccepted && errors.termsAccepted ? "#ef4444" : "rgba(255,255,255,0.15)"}`,
              }}
              onClick={() => {
                dispatch({ type: "SET_TERMS", value: !state.termsAccepted });
                setTouched((t) => ({ ...t, termsAccepted: true }));
              }}
            >
              <AnimatePresence>
                {state.termsAccepted && (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="w-3 h-3"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="#0a0f1c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                )}
              </AnimatePresence>
            </div>
            <span className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
              I agree to the{" "}
              <a href="/terms" className="underline hover:opacity-90" style={{ color: "#c9956b" }}>
                Terms &amp; Conditions
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:opacity-90" style={{ color: "#c9956b" }}>
                Privacy Policy
              </a>
            </span>
          </label>
          {touched.termsAccepted && errors.termsAccepted && (
            <p className="text-xs pl-8" style={{ color: "#ef4444" }}>
              {errors.termsAccepted}
            </p>
          )}
        </div>
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
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm transition-all"
          style={{
            background: loading ? "rgba(201,149,107,0.5)" : "linear-gradient(135deg, #c9956b, #e0b48a)",
            color: "#0a0f1c",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sending your quote...
            </>
          ) : (
            <>
              Get Your Quote
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}

function FormField({
  label,
  required,
  hint,
  type = "text",
  value,
  placeholder,
  error,
  onChange,
  onBlur,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  type?: string;
  value: string;
  placeholder?: string;
  error?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold" style={{ color: "#9ca3af" }}>
        {label}
        {required && <span style={{ color: "#c9956b" }}> *</span>}
        {hint && (
          <span className="font-normal text-xs ml-1" style={{ color: "rgba(156,163,175,0.6)" }}>
            {hint}
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "rgba(201,149,107,0.5)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,149,107,0.08)";
        }}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
          color: "#faf8f5",
        }}
      />
      {error && (
        <p className="text-xs" style={{ color: "#ef4444" }}>
          {error}
        </p>
      )}
    </div>
  );
}
