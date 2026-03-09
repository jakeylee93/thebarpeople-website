"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Pencil,
  Send,
  Mail,
  Phone,
} from "lucide-react";
import type { QuoteState, GlassType } from "@/lib/quote-types";
import {
  calculatePricing,
  formatGBP,
  BAR_DETAILS,
  GLASS_DEFINITIONS,
  GLASS_TYPE_ORDER,
  EQUIPMENT_PRICES,
} from "@/lib/quote-pricing";

interface Step8Props {
  state: QuoteState;
  onBack: () => void;
  onGoToStep: (step: number) => void;
}

const SERVICE_LABELS: Record<string, string> = {
  all_inclusive: "All Inclusive Package",
  cash_bar: "Cash Bar Service",
  dry_hire: "Dry Hire",
  staff_only: "Staff Only",
};

function Row({
  item,
  description,
  qty,
  unitPrice,
  total,
  onEdit,
}: {
  item: string;
  description?: string;
  qty?: string;
  unitPrice?: string;
  total: string | React.ReactNode;
  onEdit?: () => void;
}) {
  return (
    <tr className="border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium" style={{ color: "#faf8f5" }}>{item}</p>
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-[11px] px-1.5 py-0.5 rounded-md"
              style={{ color: "#9ca3af", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              edit
            </button>
          )}
        </div>
        {description && <p className="text-xs" style={{ color: "#9ca3af" }}>{description}</p>}
      </td>
      <td className="py-3 pr-4 text-right text-xs" style={{ color: "#9ca3af" }}>{qty ?? "—"}</td>
      <td className="py-3 pr-4 text-right text-xs" style={{ color: "#9ca3af" }}>{unitPrice ?? "—"}</td>
      <td className="py-3 text-right text-sm font-semibold" style={{ color: "#e0b48a" }}>{total}</td>
    </tr>
  );
}

export function Step8ReviewConfirm({ state, onBack, onGoToStep }: Step8Props) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const pricing = calculatePricing(state);
  const isCorporate = state.eventType === "corporate";
  const contactPerson = isCorporate ? "Jake Lee" : "Kim Knight";
  const contactEmail = isCorporate ? "jake@thebarpeople.co.uk" : "kim@thebarpeople.co.uk";
  const contactPhone = isCorporate ? "07557 402200" : "07724 601256";

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Quote submitted:", state, pricing);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-12 space-y-6 pb-20">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{ background: "rgba(201,149,107,0.12)", border: "2px solid #c9956b" }}
          >
            <CheckCircle2 className="w-12 h-12" style={{ color: "#c9956b" }} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-3xl font-[family-name:var(--font-young-serif)]" style={{ color: "#faf8f5" }}>
            Your quote has been sent! ✉️
          </h2>
          <p className="text-base max-w-md" style={{ color: "#9ca3af" }}>
            We&apos;ll be in touch within 24 hours. A copy has been sent to{" "}
            <span style={{ color: "#e0b48a" }}>{state.contactEmail}</span>.
          </p>
        </motion.div>

        {/* Contact card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl p-5 w-full max-w-sm space-y-4"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#c9956b" }}>
            Questions? Call us
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(201,149,107,0.15)" }}>
              <span className="font-bold" style={{ color: "#c9956b" }}>{contactPerson[0]}</span>
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "#faf8f5" }}>{contactPerson}</p>
              <p className="text-xs" style={{ color: "#9ca3af" }}>{isCorporate ? "Corporate Events" : "Private Events"}</p>
            </div>
          </div>
          <div className="space-y-2">
            <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 text-sm hover:underline" style={{ color: "#e0b48a" }}>
              <Phone className="w-4 h-4" style={{ color: "#c9956b" }} />
              {contactPhone}
            </a>
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-2.5 text-sm hover:underline" style={{ color: "#e0b48a" }}>
              <Mail className="w-4 h-4" style={{ color: "#c9956b" }} />
              {contactEmail}
            </a>
          </div>
        </motion.div>

        {/* Download PDF stub */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onClick={() => console.log("Download PDF — coming soon")}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#9ca3af",
          }}
        >
          <Download className="w-4 h-4" />
          Download PDF (coming soon)
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Heading */}
      <div>
        <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-young-serif)] mb-2" style={{ color: "#faf8f5" }}>
          Review & Confirm
        </h2>
        <p className="text-base" style={{ color: "#9ca3af" }}>
          Check your quote below before submitting.
        </p>
      </div>

      {/* Invoice table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Invoice header */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(201,149,107,0.05)" }}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: "#c9956b" }}>
              Quote Estimate
            </p>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              {state.contactName || "Your Name"} · {state.eventDate || "TBC"} · {state.postcode || ""}
            </p>
          </div>
          <p className="text-xl font-bold font-[family-name:var(--font-young-serif)]" style={{ color: "#c9956b" }}>
            {formatGBP(pricing.total)}
          </p>
        </div>

        <div className="px-6 overflow-x-auto">
          <table className="w-full min-w-[480px]">
            {/* Column headers */}
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <th className="py-3 pr-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Item</th>
                <th className="py-3 pr-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Qty</th>
                <th className="py-3 pr-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Unit</th>
                <th className="py-3 text-right text-xs font-bold uppercase tracking-wider" style={{ color: "#9ca3af" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {/* Service */}
              {state.serviceType && (
                <Row
                  item={SERVICE_LABELS[state.serviceType]}
                  description={`${state.guestCount} guests · ${state.duration}hrs`}
                  qty="1"
                  unitPrice={pricing.serviceBase > 0 ? formatGBP(pricing.serviceBase) : "POA"}
                  total={pricing.serviceBase > 0 ? formatGBP(pricing.serviceBase) : "POA"}
                  onEdit={() => onGoToStep(3)}
                />
              )}

              {/* Bar */}
              {state.barSelection && pricing.barCost > 0 && (
                <Row
                  item={BAR_DETAILS[state.barSelection].name}
                  description={BAR_DETAILS[state.barSelection].size}
                  qty="1"
                  unitPrice={formatGBP(pricing.barCost)}
                  total={formatGBP(pricing.barCost)}
                  onEdit={() => onGoToStep(4)}
                />
              )}

              {/* Staff */}
              {pricing.staffBreakdown.map((line) => (
                <Row
                  key={line.label}
                  item={`${line.qty} × ${line.label} (${line.hours}hrs) = ${formatGBP(line.amount)}`}
                  description={`${formatGBP(line.rate)}/hr each`}
                  qty="—"
                  unitPrice="—"
                  total={formatGBP(line.amount)}
                  onEdit={() => onGoToStep(2)}
                />
              ))}

              {/* Drinks package */}
              {state.serviceType && (
                <Row
                  item={`Standard Package — ${state.serviceType === "all_inclusive" ? "Included" : "Consultation"}`}
                  description={state.serviceType === "all_inclusive" ? "Included in All Inclusive base price" : "Available on consultation"}
                  qty="—"
                  unitPrice="Included"
                  total={state.serviceType === "all_inclusive" ? "Included" : "Consultation"}
                  onEdit={() => onGoToStep(3)}
                />
              )}
              {pricing.drinks.map((drink) => (
                <Row key={drink.label} item={drink.label} total={formatGBP(drink.amount)} onEdit={() => onGoToStep(6)} />
              ))}

              {/* Glassware */}
              {GLASS_TYPE_ORDER.filter((gt) => ((state.glassware[gt] as number) ?? 0) > 0).map((gt) => {
                const crates = state.glassware[gt] as number;
                const def = GLASS_DEFINITIONS[gt as GlassType];
                const cost = Math.round(crates * def.crateSize * def.pricePerGlass * 100) / 100;
                return (
                  <Row
                    key={gt}
                    item={def.name}
                    description={`${crates} crate${crates > 1 ? "s" : ""} × ${def.crateSize} glasses`}
                    qty={`${crates * def.crateSize}`}
                    unitPrice={formatGBP(def.pricePerGlass)}
                    total={formatGBP(cost)}
                    onEdit={() => onGoToStep(5)}
                  />
                );
              })}

              {/* Equipment */}
              {state.equipment.backBarFridge > 0 && (
                <Row
                  item="Double Back Bar Fridge"
                  qty={`${state.equipment.backBarFridge}`}
                  unitPrice={formatGBP(EQUIPMENT_PRICES.backBarFridge)}
                  total={formatGBP(state.equipment.backBarFridge * EQUIPMENT_PRICES.backBarFridge)}
                  onEdit={() => onGoToStep(6)}
                />
              )}
              {state.equipment.tallWineFridge > 0 && (
                <Row
                  item="Tall Wine Fridge"
                  qty={`${state.equipment.tallWineFridge}`}
                  unitPrice={formatGBP(EQUIPMENT_PRICES.tallWineFridge)}
                  total={formatGBP(state.equipment.tallWineFridge * EQUIPMENT_PRICES.tallWineFridge)}
                  onEdit={() => onGoToStep(6)}
                />
              )}
              {state.equipment.circularLedFull && (
                <Row item="Circular LED Bar (Full Circle)" qty="1" unitPrice={formatGBP(EQUIPMENT_PRICES.circularLedFull)} total={formatGBP(EQUIPMENT_PRICES.circularLedFull)} onEdit={() => onGoToStep(6)} />
              )}
              {state.equipment.circularLedHalf && (
                <Row item="Circular LED Bar (Half Circle)" qty="1" unitPrice={formatGBP(EQUIPMENT_PRICES.circularLedHalf)} total={formatGBP(EQUIPMENT_PRICES.circularLedHalf)} onEdit={() => onGoToStep(6)} />
              )}

              {/* Extras */}
              {pricing.extras.map((extra, i) => (
                <Row key={i} item={extra.label} total={formatGBP(extra.amount)} onEdit={() => onGoToStep(6)} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div
          className="px-6 py-5 space-y-2.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(0,0,0,0.15)" }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#9ca3af" }}>Subtotal</span>
            <span className="text-sm font-medium" style={{ color: "#faf8f5" }}>{formatGBP(pricing.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ color: "#9ca3af" }}>VAT (20%)</span>
            <span className="text-sm font-medium" style={{ color: "#faf8f5" }}>{formatGBP(pricing.vat)}</span>
          </div>
          <div
            className="flex justify-between items-center rounded-xl px-4 py-3 mt-2"
            style={{ background: "rgba(201,149,107,0.12)", border: "1px solid rgba(201,149,107,0.25)" }}
          >
            <span className="font-bold" style={{ color: "#faf8f5" }}>Estimated Total</span>
            <span className="text-xl font-bold font-[family-name:var(--font-young-serif)]" style={{ color: "#c9956b" }}>
              {formatGBP(pricing.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Edit links */}
      <div
        className="rounded-xl px-5 py-4"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#9ca3af" }}>
          Need to change something?
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Event Details", step: 1 },
            { label: "Guests & Duration", step: 2 },
            { label: "Service Type", step: 3 },
            { label: "Bar Selection", step: 4 },
            { label: "Glassware", step: 5 },
            { label: "Equipment & Extras", step: 6 },
            { label: "Contact Details", step: 7 },
          ].map(({ label, step }) => (
            <button
              key={step}
              onClick={() => onGoToStep(step)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#9ca3af",
              }}
            >
              <Pencil className="w-3 h-3" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs leading-relaxed" style={{ color: "#9ca3af" }}>
        This is an estimate only. All prices are exclusive of delivery charges. Final pricing will be confirmed after your consultation with our team. VAT included in total.
      </p>

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
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm"
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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-4 h-4 border-2 border-[#0a0f1c]/30 border-t-[#0a0f1c] rounded-full"
              />
              Sending your quote...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Confirm & Send Quote
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
