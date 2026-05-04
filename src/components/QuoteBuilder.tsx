'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  perHeadByHours,
  barPrices,
  equipmentOptions,
  glasswareTypes,
  glassPrice,
  serviceBasePrices,
} from '@/lib/constants';
import React from 'react';

type ServiceType = 'all-inclusive' | 'cash-bar' | 'dry-hire' | 'staff-only';
type BarSize = '5ft' | '10ft' | '15ft' | '35ft' | '40ft';

interface QuoteState {
  eventType: string;
  date: string;
  postcode: string;
  venueType: string;
  guests: number;
  service: ServiceType | '';
  barSize: BarSize | '';
  hours: number;
  equipment: Record<string, number>; // id → quantity
  glassware: Record<string, number>; // id → quantity (0 = removed)
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const initialState: QuoteState = {
  eventType: '',
  date: '',
  postcode: '',
  venueType: '',
  guests: 80,
  service: '',
  barSize: '',
  hours: 5,
  equipment: {},
  glassware: {},
  name: '',
  email: '',
  phone: '',
  notes: '',
};

const eventOptions = [
  'Wedding', 'Corporate', 'Birthday', 'Garden Party', 'Christmas', 'Festival', 'Other',
];

const venueOptions = [
  { id: 'indoor', label: 'Indoor', desc: 'Venue, hall, marquee' },
  { id: 'outdoor', label: 'Outdoor', desc: 'Garden, field, terrace' },
  { id: 'both', label: 'Both', desc: 'Indoor & outdoor areas' },
];

const serviceOptions: { id: ServiceType; label: string; desc: string }[] = [
  { id: 'all-inclusive', label: 'All Inclusive', desc: 'Drinks, staff, bar, glassware — the full package' },
  { id: 'cash-bar', label: 'Cash Bar', desc: 'Guests buy their own drinks, you cover setup & staff' },
  { id: 'dry-hire', label: 'Dry Hire', desc: 'We supply the bar & glassware, you supply the drinks' },
  { id: 'staff-only', label: 'Staff Only', desc: 'Professional bartenders for your own bar setup' },
];

const barOptions: { id: BarSize; label: string; size: string; guests: string }[] = [
  { id: '5ft', label: 'Shimmer Bar', size: '5FT', guests: 'Up to 50' },
  { id: '10ft', label: 'Classic Cocktail', size: '10FT', guests: 'Up to 100' },
  { id: '15ft', label: 'Horseshoe', size: '15FT', guests: 'Up to 150' },
  { id: '35ft', label: 'Large Horseshoe', size: '35FT', guests: 'Up to 250' },
  { id: '40ft', label: 'Island Bar', size: '40FT', guests: '250+' },
];

export default function QuoteBuilder() {
  const [state, setState] = useState<QuoteState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const update = useCallback((patch: Partial<QuoteState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const scrollTo = useCallback((id: string, delay = 350) => {
    setTimeout(() => {
      sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, delay);
  }, []);

  // Auto-suggest glassware when guests change (1 per person per type)
  // Only set defaults if user hasn't touched glassware yet
  const effectiveGlassware = useMemo(() => {
    const gw: Record<string, number> = {};
    glasswareTypes.forEach((g) => {
      gw[g.id] = state.glassware[g.id] ?? state.guests;
    });
    return gw;
  }, [state.guests, state.glassware]);

  const setGlassQty = (id: string, qty: number) => {
    setState((s) => ({
      ...s,
      glassware: { ...s.glassware, [id]: Math.max(0, qty) },
    }));
  };

  const removeGlass = (id: string) => {
    setState((s) => ({
      ...s,
      glassware: { ...s.glassware, [id]: 0 },
    }));
  };

  const setEquipQty = (id: string, qty: number) => {
    setState((s) => ({
      ...s,
      equipment: { ...s.equipment, [id]: Math.max(0, qty) },
    }));
  };

  // ─── Price calculation ───
  const pricing = useMemo(() => {
    const breakdown: { label: string; amount: number }[] = [];
    let total = 0;

    // Service
    if (state.service === 'all-inclusive') {
      const rate = perHeadByHours[state.hours] ?? 30;
      const amt = rate * state.guests;
      breakdown.push({ label: `${state.guests} guests × £${rate}/head (${state.hours}h)`, amount: amt });
      total += amt;
    } else if (state.service) {
      const base = serviceBasePrices[state.service] || 0;
      breakdown.push({ label: `${serviceOptions.find((s) => s.id === state.service)?.label} base`, amount: base });
      total += base;
    }

    // Bar
    if (state.barSize) {
      const amt = barPrices[state.barSize] || 0;
      const bar = barOptions.find((b) => b.id === state.barSize);
      breakdown.push({ label: `${bar?.label} (${bar?.size})`, amount: amt });
      total += amt;
    }

    // Equipment
    equipmentOptions.forEach((eq) => {
      const qty = state.equipment[eq.id] || 0;
      if (qty > 0) {
        const amt = eq.price * qty;
        breakdown.push({ label: `${eq.name}${qty > 1 ? ` ×${qty}` : ''}`, amount: amt });
        total += amt;
      }
    });

    // Glassware
    let glassTotal = 0;
    glasswareTypes.forEach((g) => {
      const qty = effectiveGlassware[g.id] || 0;
      glassTotal += qty * glassPrice;
    });
    if (glassTotal > 0) {
      breakdown.push({ label: 'Glassware', amount: Math.round(glassTotal * 100) / 100 });
      total += glassTotal;
    }

    return { breakdown, total: Math.round(total * 100) / 100 };
  }, [state, effectiveGlassware]);

  // ─── Submitted state ───
  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border border-pale bg-white p-12"
        >
          <h2 className="font-heading text-3xl font-bold">Quote Request Sent</h2>
          <p className="mt-4 text-mid">
            We&apos;ll get back to you within a few hours at <strong className="text-black">{state.email}</strong>
          </p>
          <p className="mt-6 font-heading text-4xl font-bold">£{pricing.total.toLocaleString()}</p>
          <p className="mt-1 text-sm text-light">Estimated — final price confirmed by email</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold md:text-5xl">Price Your Event</h1>
        <p className="mt-3 text-mid">Choose your options. Watch your price build.</p>
      </div>

      <div className="space-y-8">

        {/* ─── EVENT TYPE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['event'] = el; }}
          title="What type of event?"
          done={!!state.eventType}
        >
          <div className="flex flex-wrap gap-2">
            {eventOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => { update({ eventType: opt }); scrollTo('venue'); }}
                className={`border px-4 py-2 text-sm font-medium transition-all ${
                  state.eventType === opt
                    ? 'border-black bg-black text-white'
                    : 'border-pale bg-white text-dark hover:border-black'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </Section>

        {/* ─── VENUE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['venue'] = el; }}
          title="Indoor or outdoor?"
          done={!!state.venueType}
          dimmed={!state.eventType}
        >
          <div className="grid grid-cols-3 gap-3">
            {venueOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { update({ venueType: opt.id }); scrollTo('date'); }}
                className={`border p-4 text-center transition-all ${
                  state.venueType === opt.id
                    ? 'border-black bg-black text-white'
                    : 'border-pale hover:border-black'
                }`}
              >
                <p className="text-sm font-semibold">{opt.label}</p>
                <p className={`mt-1 text-xs ${state.venueType === opt.id ? 'text-white/70' : 'text-light'}`}>
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── DATE & POSTCODE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['date'] = el; }}
          title="When and where?"
          subtitle="Optional — helps us check availability"
          done={!!state.date || !!state.postcode}
          dimmed={!state.venueType}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-light">
                Event Date
              </label>
              <input
                type="date"
                value={state.date}
                onChange={(e) => update({ date: e.target.value })}
                className="w-full border border-pale bg-faint px-4 py-3 text-sm outline-none transition-all focus:border-black"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-light">
                Event Postcode
              </label>
              <input
                type="text"
                placeholder="e.g. E11 1AA"
                value={state.postcode}
                onChange={(e) => update({ postcode: e.target.value })}
                className="w-full border border-pale bg-faint px-4 py-3 text-sm outline-none transition-all focus:border-black"
              />
            </div>
          </div>
        </Section>

        {/* ─── GUESTS ─── */}
        <Section
          ref={(el) => { sectionRefs.current['guests'] = el; }}
          title="How many guests?"
          done={true}
          dimmed={!state.venueType}
        >
          <div className="flex items-center gap-6">
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={state.guests}
              onChange={(e) => update({ guests: Number(e.target.value) })}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-pale"
            />
            <div className="flex h-14 w-20 items-center justify-center border border-pale bg-faint font-heading text-2xl font-bold">
              {state.guests}
            </div>
          </div>
          <div className="mt-1 flex justify-between text-xs text-light">
            <span>20</span><span>250</span><span>500</span>
          </div>
        </Section>

        {/* ─── SERVICE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['service'] = el; }}
          title="What type of service?"
          done={!!state.service}
          dimmed={!state.venueType}
        >
          <div className="space-y-2">
            {serviceOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { update({ service: opt.id }); scrollTo('hours'); }}
                className={`flex w-full items-center justify-between border p-4 text-left transition-all ${
                  state.service === opt.id
                    ? 'border-black bg-black text-white'
                    : 'border-pale hover:border-black'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className={`mt-0.5 text-xs ${state.service === opt.id ? 'text-white/70' : 'text-light'}`}>
                    {opt.desc}
                  </p>
                </div>
                {state.service === opt.id && (
                  <span className="text-xs font-medium text-white/80">Selected</span>
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ─── HOURS ─── */}
        <Section
          ref={(el) => { sectionRefs.current['hours'] = el; }}
          title="How many hours?"
          done={true}
          dimmed={!state.service}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-5">
              <button
                onClick={() => state.hours > 3 && update({ hours: state.hours - 1 })}
                disabled={state.hours <= 3}
                className="flex h-10 w-10 items-center justify-center border border-pale text-lg font-medium transition-all hover:border-black disabled:opacity-20"
              >
                −
              </button>
              <div className="text-center">
                <span className="font-heading text-4xl font-bold">{state.hours}</span>
                <span className="ml-1 text-sm text-light">hours</span>
              </div>
              <button
                onClick={() => state.hours < 12 && update({ hours: state.hours + 1 })}
                disabled={state.hours >= 12}
                className="flex h-10 w-10 items-center justify-center border border-pale text-lg font-medium transition-all hover:border-black disabled:opacity-20"
              >
                +
              </button>
            </div>
            {state.service === 'all-inclusive' && (
              <p className="text-sm text-mid">
                £{perHeadByHours[state.hours] ?? 30} per head for {state.hours} hours
              </p>
            )}
          </div>
        </Section>

        {/* ─── BAR ─── */}
        <Section
          ref={(el) => { sectionRefs.current['bar'] = el; }}
          title="Choose your bar"
          subtitle="Optional — skip if you have your own"
          done={!!state.barSize}
          dimmed={!state.service}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {barOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { update({ barSize: state.barSize === opt.id ? '' as BarSize : opt.id }); if (state.barSize !== opt.id) scrollTo('equipment'); }}
                className={`border p-4 text-center transition-all ${
                  state.barSize === opt.id
                    ? 'border-black bg-black text-white'
                    : 'border-pale hover:border-black'
                }`}
              >
                <p className="font-heading text-lg font-bold">{opt.size}</p>
                <p className="text-xs font-medium">{opt.label}</p>
                <p className={`mt-1 text-xs ${state.barSize === opt.id ? 'text-white/60' : 'text-light'}`}>{opt.guests}</p>
                <p className={`mt-1 text-xs font-semibold ${state.barSize === opt.id ? 'text-white' : 'text-dark'}`}>
                  £{barPrices[opt.id].toLocaleString()}
                </p>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── EQUIPMENT ─── */}
        <Section
          ref={(el) => { sectionRefs.current['equipment'] = el; }}
          title="Equipment"
          subtitle="Add what you need — adjust quantities"
          done={Object.values(state.equipment).some((v) => v > 0)}
          dimmed={!state.service}
        >
          <div className="space-y-2">
            {equipmentOptions.map((eq) => {
              const qty = state.equipment[eq.id] || 0;
              return (
                <div
                  key={eq.id}
                  className={`flex items-center justify-between border p-3 transition-all ${
                    qty > 0 ? 'border-black' : 'border-pale'
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{eq.name}</p>
                    <p className="text-xs text-light">£{eq.price} {eq.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {qty > 0 && (
                      <span className="text-xs font-semibold">£{eq.price * qty}</span>
                    )}
                    <button
                      onClick={() => setEquipQty(eq.id, qty - 1)}
                      disabled={qty === 0}
                      className="flex h-7 w-7 items-center justify-center border border-pale text-xs transition-all hover:border-black disabled:opacity-20"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-medium">{qty}</span>
                    <button
                      onClick={() => setEquipQty(eq.id, qty + 1)}
                      className="flex h-7 w-7 items-center justify-center border border-pale text-xs transition-all hover:border-black"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* ─── GLASSWARE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['glassware'] = el; }}
          title="Glassware"
          subtitle={`We suggest 1 of each type per guest (${state.guests} guests) — adjust or remove as needed`}
          done={true}
          dimmed={!state.service}
        >
          <div className="space-y-2">
            {glasswareTypes.map((g) => {
              const qty = effectiveGlassware[g.id] || 0;
              const isRemoved = qty === 0;
              return (
                <div
                  key={g.id}
                  className={`flex items-center justify-between border p-3 transition-all ${
                    isRemoved ? 'border-pale opacity-40' : 'border-pale'
                  }`}
                >
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${isRemoved ? 'line-through' : ''}`}>{g.name}</p>
                    <p className="text-xs text-light">£{glassPrice} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!isRemoved && (
                      <span className="text-xs font-semibold">£{(qty * glassPrice).toFixed(2)}</span>
                    )}
                    {!isRemoved ? (
                      <>
                        <button
                          onClick={() => setGlassQty(g.id, qty - 10)}
                          className="flex h-7 w-7 items-center justify-center border border-pale text-xs transition-all hover:border-black"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={qty}
                          onChange={(e) => setGlassQty(g.id, Number(e.target.value))}
                          className="w-14 border border-pale bg-faint px-1 py-0.5 text-center text-sm outline-none focus:border-black"
                        />
                        <button
                          onClick={() => setGlassQty(g.id, qty + 10)}
                          className="flex h-7 w-7 items-center justify-center border border-pale text-xs transition-all hover:border-black"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeGlass(g.id)}
                          className="ml-1 flex h-7 w-7 items-center justify-center border border-pale text-xs text-light transition-all hover:border-black hover:text-black"
                          title="Remove"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setGlassQty(g.id, state.guests)}
                        className="border border-pale px-3 py-1 text-xs font-medium transition-all hover:border-black"
                      >
                        Add back
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-light">
            Total glassware: {glasswareTypes.reduce((sum, g) => sum + (effectiveGlassware[g.id] || 0), 0)} pieces
          </p>
        </Section>

        {/* ─── CONTACT ─── */}
        <Section
          ref={(el) => { sectionRefs.current['contact'] = el; }}
          title="Your details"
          done={!!state.name && !!state.email && !!state.phone}
          dimmed={!state.service}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-light">Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={state.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full border border-pale bg-faint px-4 py-3 text-sm outline-none transition-all focus:border-black"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-light">Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={state.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className="w-full border border-pale bg-faint px-4 py-3 text-sm outline-none transition-all focus:border-black"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-light">Phone</label>
                <input
                  type="tel"
                  placeholder="07xxx xxxxxx"
                  value={state.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  className="w-full border border-pale bg-faint px-4 py-3 text-sm outline-none transition-all focus:border-black"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-light">Notes <span className="normal-case">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="Anything else we should know..."
                value={state.notes}
                onChange={(e) => update({ notes: e.target.value })}
                className="w-full resize-none border border-pale bg-faint px-4 py-3 text-sm outline-none transition-all focus:border-black"
              />
            </div>
          </div>
        </Section>

        {/* ─── PRICE SUMMARY + SUBMIT ─── */}
        {state.service && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-black bg-white"
          >
            <div className="border-b border-pale p-6">
              <h2 className="font-heading text-xl font-bold">Your Quote</h2>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {pricing.breakdown.map((item, i) => (
                  <div key={i} className="flex items-start justify-between text-sm">
                    <span className="text-mid">{item.label}</span>
                    <span className="font-medium">£{item.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-end justify-between border-t border-pale pt-4">
                <span className="text-sm font-medium uppercase tracking-wider text-light">Estimated Total</span>
                <span className="font-heading text-3xl font-bold">£{pricing.total.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-right text-xs text-light">Final price confirmed by email</p>
            </div>

            <div className="border-t border-pale p-6">
              <button
                onClick={() => setSubmitted(true)}
                disabled={!state.name || !state.email || !state.phone}
                className="w-full bg-black py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-dark disabled:cursor-not-allowed disabled:opacity-30"
              >
                Send Quote Request
              </button>
              {(!state.name || !state.email || !state.phone) && (
                <p className="mt-3 text-center text-xs text-light">Fill in your name, email and phone to submit</p>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── FLOATING PRICE ─── */}
      {pricing.total > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-black bg-black px-6 py-3 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium uppercase tracking-wider text-white/60">Estimate</span>
            <span className="font-heading text-xl font-bold text-white">£{pricing.total.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Section wrapper ─── */
interface SectionProps {
  title: string;
  subtitle?: string;
  done: boolean;
  dimmed?: boolean;
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ title, subtitle, done, dimmed, children }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, margin: '-30px' }}
      className={`border bg-white p-6 transition-all md:p-8 ${
        dimmed ? 'border-pale/50 opacity-40 pointer-events-none' : 'border-pale'
      }`}
    >
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">{title}</h2>
          {done && !dimmed && (
            <span className="flex h-5 w-5 items-center justify-center bg-black text-xs text-white">✓</span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-light">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  ),
);

Section.displayName = 'Section';
