'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Users,
  Calendar,
  MapPin,
  Send,
  Clock,
  Plus,
  Minus,
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
  hours: number;
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
  barSize: '',
  hours: 5,
  extras: [],
  name: '',
  email: '',
  phone: '',
  notes: '',
};

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

const serviceOptions: { id: ServiceType; label: string; desc: string; price: string; icon: string }[] = [
  { id: 'all-inclusive', label: 'All Inclusive', desc: 'Drinks, staff, bar, glassware — everything', price: 'From £29.90/head', icon: '🥂' },
  { id: 'cash-bar', label: 'Cash Bar', desc: 'Guests buy drinks, you cover setup', price: 'From £395', icon: '💳' },
  { id: 'dry-hire', label: 'Dry Hire', desc: 'We supply the bar, you supply the drinks', price: 'From £295', icon: '🍸' },
  { id: 'staff-only', label: 'Staff Only', desc: 'Our bartenders for your bar', price: 'From £200', icon: '👨‍🍳' },
];

const barOptions: { id: BarSize; label: string; size: string; guests: string }[] = [
  { id: '5ft', label: 'Shimmer Bar', size: '5FT', guests: 'Up to 50' },
  { id: '10ft', label: 'Classic Cocktail', size: '10FT', guests: 'Up to 100' },
  { id: '15ft', label: 'Horseshoe', size: '15FT', guests: 'Up to 150' },
  { id: '35ft', label: 'Large Horseshoe', size: '35FT', guests: 'Up to 250' },
  { id: '40ft', label: 'Island Bar', size: '40FT', guests: '250+' },
];

const HOUR_RATE = 50; // £50 per extra hour beyond base 5

// Section refs for auto-scroll
const sectionIds = ['event-type', 'venue', 'date-location', 'guests', 'service', 'bar', 'hours', 'extras', 'contact'] as const;

export default function QuoteBuilder() {
  const [state, setState] = useState<QuoteState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const update = useCallback((patch: Partial<QuoteState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const toggleExtra = (id: string) => {
    setState((s) => ({
      ...s,
      extras: s.extras.includes(id) ? s.extras.filter((e) => e !== id) : [...s.extras, id],
    }));
  };

  // Auto-scroll to next section
  const scrollTo = useCallback((sectionId: string, delay = 400) => {
    setTimeout(() => {
      const el = sectionRefs.current[sectionId];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, delay);
  }, []);

  // Auto-advance on single-choice selections
  const selectEventType = useCallback((id: string) => {
    update({ eventType: id });
    scrollTo('venue');
  }, [update, scrollTo]);

  const selectVenue = useCallback((id: string) => {
    update({ venueType: id });
    scrollTo('date-location');
  }, [update, scrollTo]);

  const selectService = useCallback((id: ServiceType) => {
    update({ service: id });
    scrollTo('bar');
  }, [update, scrollTo]);

  const selectBar = useCallback((id: BarSize) => {
    update({ barSize: state.barSize === id ? '' : id });
    if (state.barSize !== id) scrollTo('hours');
  }, [update, scrollTo, state.barSize]);

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
    // Extra hours beyond base 5
    if (state.hours > 5) {
      total += (state.hours - 5) * HOUR_RATE;
    }
    state.extras.forEach((ext) => {
      const extra = quoteConfig.extras.find((e) => e.id === ext);
      if (extra) total += extra.price;
    });
    return total;
  }, [state]);

  // Track which sections are "complete" for visual feedback
  const sectionComplete = useMemo(() => ({
    'event-type': !!state.eventType,
    venue: !!state.venueType,
    'date-location': !!state.date || !!state.postcode,
    guests: true, // always has a default
    service: !!state.service,
    bar: !!state.barSize,
    hours: true,
    extras: true, // optional
    contact: !!state.name && !!state.email && !!state.phone,
  }), [state]);

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
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
    <div className="mx-auto max-w-2xl px-4 sm:px-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Instant Estimate</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-charcoal md:text-4xl">
          Build Your Perfect Bar
        </h1>
        <p className="mt-2 text-muted">Pick your options — watch your price build live</p>
      </div>

      {/* All sections stacked */}
      <div className="space-y-6">

        {/* ─── EVENT TYPE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['event-type'] = el; }}
          title="What's the occasion?"
          num={1}
          done={sectionComplete['event-type']}
        >
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
            {eventOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectEventType(opt.id)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 transition-all ${
                  state.eventType === opt.id
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-warm-border hover:border-gold/30'
                }`}
              >
                <span className="text-xl">{opt.icon}</span>
                <span className="text-xs font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── VENUE TYPE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['venue'] = el; }}
          title="Indoor or outdoor?"
          num={2}
          done={sectionComplete.venue}
          dimmed={!state.eventType}
        >
          <div className="grid grid-cols-3 gap-3">
            {venueOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectVenue(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                  state.venueType === opt.id
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-warm-border hover:border-gold/30'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="text-sm font-medium">{opt.label}</span>
                <span className="text-xs text-muted">{opt.desc}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── DATE & LOCATION ─── */}
        <Section
          ref={(el) => { sectionRefs.current['date-location'] = el; }}
          title="When and where?"
          num={3}
          done={sectionComplete['date-location']}
          dimmed={!state.venueType}
          optional
        >
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
        </Section>

        {/* ─── GUESTS ─── */}
        <Section
          ref={(el) => { sectionRefs.current['guests'] = el; }}
          title="How many guests?"
          num={4}
          done={sectionComplete.guests}
          dimmed={!state.venueType}
        >
          <div>
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
              <span className="flex h-12 w-16 items-center justify-center rounded-xl border border-warm-border bg-cream text-center font-heading text-lg font-bold text-charcoal">
                {state.guests}
              </span>
            </div>
            <div className="mt-1 flex justify-between text-xs text-muted">
              <span>20</span><span>250</span><span>500</span>
            </div>
          </div>
        </Section>

        {/* ─── SERVICE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['service'] = el; }}
          title="What type of service?"
          num={5}
          done={sectionComplete.service}
          dimmed={!state.venueType}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {serviceOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectService(opt.id)}
                className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
                  state.service === opt.id
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-warm-border hover:border-gold/30'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-charcoal">{opt.label}</p>
                  <p className="mt-0.5 text-xs text-muted">{opt.desc}</p>
                  <p className="mt-1 text-xs font-semibold text-gold">{opt.price}</p>
                </div>
                {state.service === opt.id && (
                  <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold">
                    <Check size={12} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ─── BAR SIZE ─── */}
        <Section
          ref={(el) => { sectionRefs.current['bar'] = el; }}
          title="Choose your bar"
          num={6}
          done={sectionComplete.bar}
          dimmed={!state.service}
          optional
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {barOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => selectBar(opt.id)}
                className={`flex flex-col items-center gap-1 rounded-xl border-2 p-4 transition-all ${
                  state.barSize === opt.id
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-warm-border hover:border-gold/30'
                }`}
              >
                <span className="font-heading text-lg font-bold text-gold">{opt.size}</span>
                <span className="text-xs font-medium text-charcoal">{opt.label}</span>
                <span className="text-xs text-muted">{opt.guests}</span>
                <span className="mt-1 text-xs font-semibold text-gold">
                  £{quoteConfig.barPrices[opt.id].toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── HOURS ─── */}
        <Section
          ref={(el) => { sectionRefs.current['hours'] = el; }}
          title="How many hours?"
          num={7}
          done={sectionComplete.hours}
          dimmed={!state.service}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => state.hours > 3 && update({ hours: state.hours - 1 })}
                disabled={state.hours <= 3}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-warm-border transition-all hover:border-gold hover:text-gold disabled:opacity-30"
              >
                <Minus size={18} />
              </button>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-charcoal">{state.hours}</span>
                <span className="text-sm text-muted">hours</span>
              </div>
              <button
                onClick={() => state.hours < 12 && update({ hours: state.hours + 1 })}
                disabled={state.hours >= 12}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-warm-border transition-all hover:border-gold hover:text-gold disabled:opacity-30"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock size={12} className="text-gold" />
              {state.hours <= 5
                ? 'Base rate — included in service price'
                : `+£${(state.hours - 5) * HOUR_RATE} for ${state.hours - 5} extra hour${state.hours - 5 > 1 ? 's' : ''} (£${HOUR_RATE}/hr)`}
            </div>
          </div>
        </Section>

        {/* ─── EXTRAS ─── */}
        <Section
          ref={(el) => { sectionRefs.current['extras'] = el; }}
          title="Any extras?"
          num={8}
          done={state.extras.length > 0}
          dimmed={!state.service}
          optional
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quoteConfig.extras.map((ext) => (
              <button
                key={ext.id}
                onClick={() => toggleExtra(ext.id)}
                className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all ${
                  state.extras.includes(ext.id)
                    ? 'border-gold bg-gold/5 shadow-sm'
                    : 'border-warm-border hover:border-gold/30'
                }`}
              >
                <div className="text-left">
                  <p className="text-sm font-medium text-charcoal">{ext.name}</p>
                  <p className="text-xs text-gold">+£{ext.price}</p>
                </div>
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-all ${
                    state.extras.includes(ext.id) ? 'border-gold bg-gold' : 'border-warm-border'
                  }`}
                >
                  {state.extras.includes(ext.id) && <Check size={12} className="text-white" />}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* ─── CONTACT ─── */}
        <Section
          ref={(el) => { sectionRefs.current['contact'] = el; }}
          title="Your details"
          num={9}
          done={sectionComplete.contact}
          dimmed={!state.service}
        >
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal">Full Name</label>
              <input
                type="text"
                placeholder="Your name"
                value={state.name}
                onChange={(e) => update({ name: e.target.value })}
                className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal">Notes <span className="text-muted">(optional)</span></label>
              <textarea
                rows={3}
                placeholder="Anything else we should know..."
                value={state.notes}
                onChange={(e) => update({ notes: e.target.value })}
                className="w-full resize-none rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
              />
            </div>
          </div>
        </Section>

        {/* ─── SUBMIT ─── */}
        {state.service && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-warm-border bg-white p-8 text-center shadow-sm"
          >
            <div className="mb-6 rounded-xl bg-gold/5 p-6">
              <p className="text-sm text-muted">Your Estimated Total</p>
              <p className="font-heading text-4xl font-bold text-gold">
                £{estimate.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-muted">Final price confirmed by email</p>
            </div>

            {/* Summary */}
            <div className="mb-6 space-y-2 text-left">
              {state.eventType && (
                <SummaryLine label="Event" value={eventOptions.find((e) => e.id === state.eventType)?.label || ''} />
              )}
              {state.venueType && (
                <SummaryLine label="Venue" value={venueOptions.find((v) => v.id === state.venueType)?.label || ''} />
              )}
              <SummaryLine label="Guests" value={`${state.guests} people`} />
              {state.service && (
                <SummaryLine label="Service" value={serviceOptions.find((s) => s.id === state.service)?.label || ''} />
              )}
              {state.barSize && (
                <SummaryLine label="Bar" value={barOptions.find((b) => b.id === state.barSize)?.label || ''} />
              )}
              <SummaryLine label="Hours" value={`${state.hours}h${state.hours > 5 ? ` (+£${(state.hours - 5) * HOUR_RATE})` : ''}`} />
              {state.extras.length > 0 && (
                <SummaryLine
                  label="Extras"
                  value={state.extras.map((e) => quoteConfig.extras.find((x) => x.id === e)?.name).join(', ')}
                />
              )}
            </div>

            <button
              onClick={() => setSubmitted(true)}
              disabled={!state.name || !state.email || !state.phone}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} /> Send My Quote Request
            </button>
            {(!state.name || !state.email || !state.phone) && (
              <p className="mt-3 text-xs text-muted">Fill in your name, email and phone above to submit</p>
            )}
          </motion.div>
        )}
      </div>

      {/* ─── FLOATING PRICE BAR ─── */}
      {estimate > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-warm-border bg-white/95 px-6 py-3 shadow-xl backdrop-blur-sm"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Estimate:</span>
            <span className="font-heading text-xl font-bold text-gold">£{estimate.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Reusable Section wrapper ─── */
import React from 'react';

interface SectionProps {
  title: string;
  num: number;
  done: boolean;
  dimmed?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLDivElement, SectionProps>(
  ({ title, num, done, dimmed, optional, children }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true, margin: '-30px' }}
      className={`rounded-2xl border bg-white p-6 shadow-sm transition-all md:p-8 ${
        dimmed ? 'border-warm-border/50 opacity-50 pointer-events-none' : 'border-warm-border'
      }`}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
            done ? 'bg-gold text-white' : 'bg-cream-dark text-muted'
          }`}
        >
          {done ? <Check size={14} /> : num}
        </div>
        <h2 className="font-heading text-lg font-semibold text-charcoal">{title}</h2>
        {optional && <span className="text-xs text-muted">(optional)</span>}
      </div>
      {children}
    </motion.div>
  ),
);

Section.displayName = 'Section';

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-cream px-4 py-2.5 text-sm">
      <span className="font-medium text-muted">{label}</span>
      <span className="text-right font-medium text-charcoal">{value}</span>
    </div>
  );
}
