'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Users,
  Calendar,
  MapPin,
  Send,
} from 'lucide-react';
import { quoteConfig } from '@/lib/constants';

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
  extras: string[];
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
  extras: [],
  barSize: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

const steps = [
  { num: 1, label: 'Event' },
  { num: 2, label: 'Guests & Service' },
  { num: 3, label: 'Bar & Extras' },
  { num: 4, label: 'Contact' },
  { num: 5, label: 'Review' },
];

const eventOptions = [
  { id: 'wedding', label: 'Wedding', icon: '💍' },
  { id: 'corporate', label: 'Corporate', icon: '🏢' },
  { id: 'birthday', label: 'Birthday', icon: '🎂' },
  { id: 'garden-party', label: 'Garden Party', icon: '🌿' },
  { id: 'christmas', label: 'Christmas', icon: '🎄' },
  { id: 'festival', label: 'Festival', icon: '🎵' },
  { id: 'other', label: 'Other', icon: '✨' },
];

const venueOptions = [
  { id: 'indoor', label: 'Indoor', desc: 'Venue, hall, marquee', icon: '🏛️' },
  { id: 'outdoor', label: 'Outdoor', desc: 'Garden, field, terrace', icon: '🌳' },
  { id: 'both', label: 'Both', desc: 'Indoor & outdoor', icon: '🏡' },
];

const serviceOptions: { id: ServiceType; label: string; desc: string; icon: string }[] = [
  { id: 'all-inclusive', label: 'All Inclusive', desc: 'Everything included — drinks, staff, bar, glassware', icon: '🥂' },
  { id: 'cash-bar', label: 'Cash Bar', desc: 'Guests buy their own drinks, you cover setup', icon: '💳' },
  { id: 'dry-hire', label: 'Dry Hire', desc: 'We supply the bar, you supply the drinks', icon: '🍸' },
  { id: 'staff-only', label: 'Staff Only', desc: 'Professional bartenders for your own bar', icon: '👨‍🍳' },
];

const barOptions: { id: BarSize; label: string; size: string; guests: string }[] = [
  { id: '5ft', label: 'Shimmer Bar', size: '5FT', guests: 'Up to 50' },
  { id: '10ft', label: 'Classic Cocktail', size: '10FT', guests: 'Up to 100' },
  { id: '15ft', label: 'Horseshoe', size: '15FT', guests: 'Up to 150' },
  { id: '35ft', label: 'Large Horseshoe', size: '35FT', guests: 'Up to 250' },
  { id: '40ft', label: 'Island Bar', size: '40FT', guests: '250+' },
];

export default function QuoteBuilder() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuoteState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<QuoteState>) => setState((s) => ({ ...s, ...patch }));

  const toggleExtra = (id: string) => {
    setState((s) => ({
      ...s,
      extras: s.extras.includes(id) ? s.extras.filter((e) => e !== id) : [...s.extras, id],
    }));
  };

  // Calculate estimated price
  const estimate = useMemo(() => {
    let total = 0;
    if (state.service) {
      const svc = quoteConfig.serviceMultipliers[state.service];
      total += svc.base + svc.perHead * state.guests;
    }
    if (state.barSize) {
      total += quoteConfig.barPrices[state.barSize];
    }
    state.extras.forEach((ext) => {
      const extra = quoteConfig.extras.find((e) => e.id === ext);
      if (extra) total += extra.price;
    });
    return total;
  }, [state]);

  const canProceed = (s: number): boolean => {
    switch (s) {
      case 1: return !!state.eventType && !!state.venueType;
      case 2: return !!state.service;
      case 3: return true;
      case 4: return !!state.name && !!state.email && !!state.phone;
      default: return true;
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-warm-border bg-white p-12"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="text-green-600" size={32} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-charcoal">Quote Request Sent!</h2>
          <p className="mt-3 text-muted">
            We&apos;ll get back to you within a few hours with a detailed quote. Check your email at{' '}
            <strong>{state.email}</strong>.
          </p>
          <p className="mt-2 text-sm text-muted">
            Your estimated total: <span className="font-semibold text-gold">£{estimate.toLocaleString()}</span>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Instant Estimate</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-charcoal md:text-4xl">
          Build Your Perfect Bar
        </h1>
        <p className="mt-2 text-muted">Get an instant estimate in under 60 seconds</p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-1 sm:gap-2">
        {steps.map((s) => (
          <button
            key={s.num}
            onClick={() => s.num < step && setStep(s.num)}
            disabled={s.num > step}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-4 sm:py-2 sm:text-sm ${
              s.num === step
                ? 'bg-gold text-white'
                : s.num < step
                  ? 'bg-gold/10 text-gold cursor-pointer hover:bg-gold/20'
                  : 'bg-cream-dark text-muted'
            }`}
          >
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs sm:h-6 sm:w-6 ${
              s.num < step ? 'bg-gold text-white' : s.num === step ? 'bg-white/30 text-white' : 'bg-warm-border text-muted'
            }`}>
              {s.num < step ? <Check size={12} /> : s.num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
          </button>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-3xl border border-warm-border bg-white p-6 shadow-sm md:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Step 1: Event Details */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-charcoal">Tell us about your event</h2>
                  <p className="mt-1 text-sm text-muted">Let&apos;s start with the basics</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-charcoal">Event Type</label>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
                    {eventOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => update({ eventType: opt.id })}
                        className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-all ${
                          state.eventType === opt.id
                            ? 'border-gold bg-gold/5'
                            : 'border-warm-border hover:border-gold/30'
                        }`}
                      >
                        <span className="text-xl">{opt.icon}</span>
                        <span className="text-xs font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-charcoal">
                      <Calendar size={14} className="text-gold" /> Event Date
                    </label>
                    <input
                      type="date"
                      value={state.date}
                      onChange={(e) => update({ date: e.target.value })}
                      className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-charcoal">
                      <MapPin size={14} className="text-gold" /> Event Postcode
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. E11 1AA"
                      value={state.postcode}
                      onChange={(e) => update({ postcode: e.target.value })}
                      className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-charcoal">Venue Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {venueOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => update({ venueType: opt.id })}
                        className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                          state.venueType === opt.id
                            ? 'border-gold bg-gold/5'
                            : 'border-warm-border hover:border-gold/30'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <span className="text-sm font-medium">{opt.label}</span>
                        <span className="text-xs text-muted">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Guests & Service */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-charcoal">Guests &amp; Service</h2>
                  <p className="mt-1 text-sm text-muted">How many people, and what do you need?</p>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-sm font-medium text-charcoal">
                    <Users size={14} className="text-gold" /> Number of Guests
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={20}
                      max={500}
                      step={10}
                      value={state.guests}
                      onChange={(e) => update({ guests: Number(e.target.value) })}
                      className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-cream-dark accent-gold"
                    />
                    <span className="w-16 rounded-xl border border-warm-border bg-cream px-3 py-2 text-center text-sm font-semibold text-charcoal">
                      {state.guests}
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-muted">
                    <span>20</span><span>500</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-charcoal">Service Type</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {serviceOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => update({ service: opt.id })}
                        className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                          state.service === opt.id
                            ? 'border-gold bg-gold/5'
                            : 'border-warm-border hover:border-gold/30'
                        }`}
                      >
                        <span className="text-2xl">{opt.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                          <p className="mt-0.5 text-xs text-muted">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bar & Extras */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-charcoal">Bar &amp; Extras</h2>
                  <p className="mt-1 text-sm text-muted">Pick a bar and any extras (all optional)</p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-charcoal">Bar Size</label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {barOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => update({ barSize: state.barSize === opt.id ? '' : opt.id })}
                        className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                          state.barSize === opt.id
                            ? 'border-gold bg-gold/5'
                            : 'border-warm-border hover:border-gold/30'
                        }`}
                      >
                        <span className="font-heading text-lg font-bold text-gold">{opt.size}</span>
                        <span className="text-xs font-medium text-charcoal">{opt.label}</span>
                        <span className="text-xs text-muted">{opt.guests}</span>
                        <span className="text-xs font-semibold text-gold">
                          £{quoteConfig.barPrices[opt.id].toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-charcoal">Optional Extras</label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {quoteConfig.extras.map((ext) => (
                      <button
                        key={ext.id}
                        onClick={() => toggleExtra(ext.id)}
                        className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${
                          state.extras.includes(ext.id)
                            ? 'border-gold bg-gold/5'
                            : 'border-warm-border hover:border-gold/30'
                        }`}
                      >
                        <div className="text-left">
                          <p className="text-sm font-medium text-charcoal">{ext.name}</p>
                          <p className="text-xs text-gold">+£{ext.price}</p>
                        </div>
                        <div className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                          state.extras.includes(ext.id) ? 'border-gold bg-gold' : 'border-warm-border'
                        }`}>
                          {state.extras.includes(ext.id) && <Check size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-charcoal">Your Details</h2>
                  <p className="mt-1 text-sm text-muted">So we can send you a detailed quote</p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-charcoal">Full Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={state.name}
                      onChange={(e) => update({ name: e.target.value })}
                      className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">Email</label>
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={state.email}
                      onChange={(e) => update({ email: e.target.value })}
                      className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">Phone</label>
                    <input
                      type="tel"
                      placeholder="07xxx xxxxxx"
                      value={state.phone}
                      onChange={(e) => update({ phone: e.target.value })}
                      className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-charcoal">Notes (optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Any extra details about your event..."
                      value={state.notes}
                      onChange={(e) => update({ notes: e.target.value })}
                      className="w-full resize-none rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading text-xl font-semibold text-charcoal">Review Your Quote</h2>
                  <p className="mt-1 text-sm text-muted">Check everything looks good</p>
                </div>

                <div className="space-y-3">
                  <ReviewRow label="Event" value={`${eventOptions.find((e) => e.id === state.eventType)?.label || '—'} · ${venueOptions.find((v) => v.id === state.venueType)?.label || '—'}`} />
                  {state.date && <ReviewRow label="Date" value={new Date(state.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} />}
                  {state.postcode && <ReviewRow label="Postcode" value={state.postcode.toUpperCase()} />}
                  <ReviewRow label="Guests" value={`${state.guests} people`} />
                  <ReviewRow label="Service" value={serviceOptions.find((s) => s.id === state.service)?.label || '—'} />
                  {state.barSize && <ReviewRow label="Bar" value={barOptions.find((b) => b.id === state.barSize)?.label || '—'} />}
                  {state.extras.length > 0 && (
                    <ReviewRow label="Extras" value={state.extras.map((e) => quoteConfig.extras.find((x) => x.id === e)?.name).join(', ')} />
                  )}
                  <ReviewRow label="Name" value={state.name} />
                  <ReviewRow label="Email" value={state.email} />
                  <ReviewRow label="Phone" value={state.phone} />
                  {state.notes && <ReviewRow label="Notes" value={state.notes} />}
                </div>

                <div className="rounded-xl bg-gold/5 p-6 text-center">
                  <p className="text-sm text-muted">Estimated Total</p>
                  <p className="font-heading text-4xl font-bold text-gold">
                    £{estimate.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-muted">Final price may vary — we&apos;ll confirm by email</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-2 rounded-full border border-warm-border px-5 py-2.5 text-sm font-medium text-charcoal transition-all hover:border-gold hover:text-gold"
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              onClick={() => canProceed(step) && setStep((s) => s + 1)}
              disabled={!canProceed(step)}
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              Continue <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-hover"
            >
              <Send size={16} /> Submit Quote Request
            </button>
          )}
        </div>
      </div>

      {/* Floating Price */}
      {estimate > 0 && step < 5 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-warm-border bg-white px-6 py-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Estimated:</span>
            <span className="font-heading text-xl font-bold text-gold">£{estimate.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-warm-border bg-cream px-4 py-3">
      <span className="text-sm font-medium text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-charcoal">{value}</span>
    </div>
  );
}
