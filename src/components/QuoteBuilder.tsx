'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  equipment: Record<string, number>;
  glassware: Record<string, number>;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const initial: QuoteState = {
  eventType: '', date: '', postcode: '', venueType: '',
  guests: 80, service: '', barSize: '', hours: 5,
  equipment: {}, glassware: {}, name: '', email: '', phone: '', notes: '',
};

const events = ['Wedding', 'Corporate', 'Birthday', 'Garden Party', 'Christmas', 'Festival', 'Other'];
const venues = [
  { id: 'indoor', label: 'Indoor' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'both', label: 'Both' },
];
const svcOptions: { id: ServiceType; label: string }[] = [
  { id: 'all-inclusive', label: 'All Inclusive' },
  { id: 'cash-bar', label: 'Cash Bar' },
  { id: 'dry-hire', label: 'Dry Hire' },
  { id: 'staff-only', label: 'Staff Only' },
];
const barOpts: { id: BarSize; label: string; size: string; cap: string }[] = [
  { id: '5ft', label: 'Shimmer', size: '5FT', cap: '≤50' },
  { id: '10ft', label: 'Classic', size: '10FT', cap: '≤100' },
  { id: '15ft', label: 'Horseshoe', size: '15FT', cap: '≤150' },
  { id: '35ft', label: 'Large', size: '35FT', cap: '≤250' },
  { id: '40ft', label: 'Island', size: '40FT', cap: '250+' },
];

export default function QuoteBuilder() {
  const [s, setS] = useState<QuoteState>(initial);
  const [showQuote, setShowQuote] = useState(false);
  const [sent, setSent] = useState(false);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  const up = useCallback((p: Partial<QuoteState>) => setS((v) => ({ ...v, ...p })), []);
  const scrollTo = useCallback((id: string) => {
    setTimeout(() => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, []);

  const gw = useMemo(() => {
    const r: Record<string, number> = {};
    glasswareTypes.forEach((g) => { r[g.id] = s.glassware[g.id] ?? s.guests; });
    return r;
  }, [s.guests, s.glassware]);

  const setGw = (id: string, n: number) => setS((v) => ({ ...v, glassware: { ...v.glassware, [id]: Math.max(0, n) } }));
  const setEq = (id: string, n: number) => setS((v) => ({ ...v, equipment: { ...v.equipment, [id]: Math.max(0, n) } }));

  // Pricing
  const pricing = useMemo(() => {
    const lines: { label: string; amount: number }[] = [];
    let total = 0;
    if (s.service === 'all-inclusive') {
      const rate = perHeadByHours[s.hours] ?? 30;
      const amt = rate * s.guests;
      lines.push({ label: `${s.guests} guests × £${rate}/hd (${s.hours}h)`, amount: amt });
      total += amt;
    } else if (s.service) {
      const base = serviceBasePrices[s.service] || 0;
      lines.push({ label: svcOptions.find((x) => x.id === s.service)!.label, amount: base });
      total += base;
    }
    if (s.barSize) {
      const amt = barPrices[s.barSize];
      lines.push({ label: `${barOpts.find((b) => b.id === s.barSize)!.size} Bar`, amount: amt });
      total += amt;
    }
    equipmentOptions.forEach((eq) => {
      const qty = s.equipment[eq.id] || 0;
      if (qty > 0) {
        const amt = eq.price * qty;
        lines.push({ label: `${eq.name}${qty > 1 ? ` ×${qty}` : ''}`, amount: amt });
        total += amt;
      }
    });
    let gt = 0;
    glasswareTypes.forEach((g) => { gt += (gw[g.id] || 0) * glassPrice; });
    if (gt > 0) { lines.push({ label: 'Glassware', amount: Math.round(gt * 100) / 100 }); total += gt; }
    return { lines, total: Math.round(total * 100) / 100 };
  }, [s, gw]);

  const canSend = !!s.name && !!s.email && !!s.phone && !!s.service;

  const handleSend = async () => {
    try {
      await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, glassware: gw, estimate: pricing.total, breakdown: pricing.lines }),
      });
    } catch {}
    setSent(true);
  };

  // ─── SENT ───
  if (sent) {
    return (
      <div className="mx-auto max-w-md px-4 py-12 text-center">
        <h2 className="font-heading text-2xl font-bold">Quote Sent</h2>
        <p className="mt-3 text-sm text-mid">We&apos;ll be in touch at <strong>{s.email}</strong></p>
        <p className="mt-4 font-heading text-3xl font-bold">£{pricing.total.toLocaleString()}</p>
      </div>
    );
  }

  // ─── QUOTE PREVIEW OVERLAY ───
  if (showQuote) {
    return (
      <div className="mx-auto max-w-xl px-4">
        <div className="border border-black">
          {/* Quote Header */}
          <div className="border-b border-pale bg-faint px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading text-lg font-bold">The Bar People</p>
                <p className="text-xs text-light">Premium Mobile Bar Hire</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-wider text-light">Quote</p>
                <p className="text-xs text-light">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          {/* Client Details */}
          {(s.name || s.email) && (
            <div className="border-b border-pale px-6 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-light">Prepared for</p>
              <p className="mt-1 text-sm font-medium">{s.name}</p>
              {s.email && <p className="text-xs text-mid">{s.email}</p>}
              {s.phone && <p className="text-xs text-mid">{s.phone}</p>}
            </div>
          )}

          {/* Event Details */}
          <div className="border-b border-pale px-6 py-3">
            <p className="text-xs font-medium uppercase tracking-wider text-light">Event Details</p>
            <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {s.eventType && <><span className="text-mid">Type</span><span className="text-right font-medium">{s.eventType}</span></>}
              {s.venueType && <><span className="text-mid">Venue</span><span className="text-right font-medium capitalize">{s.venueType}</span></>}
              {s.date && <><span className="text-mid">Date</span><span className="text-right font-medium">{new Date(s.date).toLocaleDateString('en-GB')}</span></>}
              {s.postcode && <><span className="text-mid">Location</span><span className="text-right font-medium uppercase">{s.postcode}</span></>}
              <span className="text-mid">Guests</span><span className="text-right font-medium">{s.guests}</span>
              <span className="text-mid">Duration</span><span className="text-right font-medium">{s.hours} hours</span>
            </div>
          </div>

          {/* Line Items */}
          <div className="px-6 py-3">
            <div className="flex border-b border-pale pb-1 text-xs font-medium uppercase tracking-wider text-light">
              <span className="flex-1">Item</span>
              <span className="w-20 text-right">Amount</span>
            </div>
            <div className="divide-y divide-faint">
              {pricing.lines.map((line, i) => (
                <div key={i} className="flex py-1.5 text-xs">
                  <span className="flex-1 text-mid">{line.label}</span>
                  <span className="w-20 text-right font-medium">£{line.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Glassware breakdown */}
          {glasswareTypes.some((g) => gw[g.id] > 0) && (
            <div className="border-t border-pale px-6 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-light">Glassware Breakdown</p>
              <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                {glasswareTypes.filter((g) => gw[g.id] > 0).map((g) => (
                  <React.Fragment key={g.id}>
                    <span className="text-mid">{g.name}</span>
                    <span className="text-right">{gw[g.id]} × £{glassPrice.toFixed(2)}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t border-black bg-faint px-6 py-4">
            <div className="flex items-end justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-light">Estimated Total</span>
              <span className="font-heading text-2xl font-bold">£{pricing.total.toLocaleString()}</span>
            </div>
            <p className="mt-0.5 text-right text-[10px] text-light">Final price confirmed by email</p>
          </div>

          {/* Notes */}
          {s.notes && (
            <div className="border-t border-pale px-6 py-3">
              <p className="text-xs font-medium uppercase tracking-wider text-light">Notes</p>
              <p className="mt-1 text-xs text-mid">{s.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex border-t border-pale">
            <button
              onClick={() => setShowQuote(false)}
              className="flex-1 border-r border-pale py-3 text-xs font-medium text-mid transition-colors hover:bg-faint hover:text-black"
            >
              ← Edit
            </button>
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="flex-1 bg-black py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-dark disabled:opacity-30"
            >
              Send Quote Request
            </button>
          </div>
        </div>

        {!canSend && (
          <p className="mt-3 text-center text-xs text-light">Add your name, email and phone to send</p>
        )}
      </div>
    );
  }

  // ─── BUILDER ───
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold">Price Your Event</h1>
        <p className="mt-1 text-xs text-light">Choose options — price builds live</p>
      </div>

      <div className="space-y-3">

        {/* EVENT TYPE */}
        <Sec ref={(el) => { refs.current['ev'] = el; }} label="Event">
          <div className="flex flex-wrap gap-1.5">
            {events.map((e) => (
              <Chip key={e} active={s.eventType === e} onClick={() => { up({ eventType: e }); scrollTo('venue'); }}>{e}</Chip>
            ))}
          </div>
        </Sec>

        {/* VENUE */}
        <Sec ref={(el) => { refs.current['venue'] = el; }} label="Venue" dim={!s.eventType}>
          <div className="flex gap-1.5">
            {venues.map((v) => (
              <Chip key={v.id} active={s.venueType === v.id} onClick={() => { up({ venueType: v.id }); scrollTo('guests'); }} className="flex-1 text-center">{v.label}</Chip>
            ))}
          </div>
        </Sec>

        {/* DATE / POSTCODE */}
        <Sec label="Date & Location" dim={!s.venueType}>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={s.date} onChange={(e) => up({ date: e.target.value })}
              className="border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-black" />
            <input type="text" placeholder="Postcode" value={s.postcode} onChange={(e) => up({ postcode: e.target.value })}
              className="border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-black" />
          </div>
        </Sec>

        {/* GUESTS */}
        <Sec ref={(el) => { refs.current['guests'] = el; }} label="Guests" dim={!s.venueType}>
          <div className="flex items-center gap-3">
            <input type="range" min={20} max={500} step={10} value={s.guests}
              onChange={(e) => up({ guests: Number(e.target.value) })}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-pale" />
            <span className="w-12 border border-pale bg-faint py-1 text-center text-sm font-bold">{s.guests}</span>
          </div>
        </Sec>

        {/* SERVICE */}
        <Sec label="Service" dim={!s.venueType}>
          <div className="grid grid-cols-2 gap-1.5">
            {svcOptions.map((o) => (
              <Chip key={o.id} active={s.service === o.id} onClick={() => { up({ service: o.id }); scrollTo('hours'); }} className="text-center">{o.label}</Chip>
            ))}
          </div>
        </Sec>

        {/* HOURS */}
        <Sec ref={(el) => { refs.current['hours'] = el; }} label="Hours" dim={!s.service}>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => s.hours > 3 && up({ hours: s.hours - 1 })} disabled={s.hours <= 3}
              className="h-8 w-8 border border-pale text-sm hover:border-black disabled:opacity-20">−</button>
            <div className="text-center">
              <span className="font-heading text-2xl font-bold">{s.hours}</span>
              <span className="ml-1 text-xs text-light">hrs</span>
            </div>
            <button onClick={() => s.hours < 12 && up({ hours: s.hours + 1 })} disabled={s.hours >= 12}
              className="h-8 w-8 border border-pale text-sm hover:border-black disabled:opacity-20">+</button>
          </div>
          {s.service === 'all-inclusive' && (
            <p className="mt-1 text-center text-xs text-mid">£{perHeadByHours[s.hours] ?? 30}/head</p>
          )}
        </Sec>

        {/* BAR */}
        <Sec label="Bar" dim={!s.service}>
          <div className="grid grid-cols-5 gap-1.5">
            {barOpts.map((b) => (
              <button key={b.id}
                onClick={() => up({ barSize: s.barSize === b.id ? '' as BarSize : b.id })}
                className={`border p-2 text-center transition-all ${s.barSize === b.id ? 'border-black bg-black text-white' : 'border-pale hover:border-black'}`}>
                <p className="text-xs font-bold">{b.size}</p>
                <p className="text-[10px] text-inherit opacity-60">{b.cap}</p>
                <p className="text-[10px] font-medium">£{barPrices[b.id]}</p>
              </button>
            ))}
          </div>
        </Sec>

        {/* EQUIPMENT */}
        <Sec label="Equipment" dim={!s.service}>
          <div className="space-y-0.5">
            {equipmentOptions.map((eq) => {
              const qty = s.equipment[eq.id] || 0;
              return (
                <div key={eq.id} className={`flex items-center justify-between px-2 py-1.5 text-xs ${qty > 0 ? 'bg-faint' : ''}`}>
                  <span className="flex-1">{eq.name} <span className="text-light">£{eq.price}</span></span>
                  <div className="flex items-center gap-1">
                    {qty > 0 && <span className="mr-1 text-[10px] font-medium">£{eq.price * qty}</span>}
                    <button onClick={() => setEq(eq.id, qty - 1)} disabled={qty === 0}
                      className="h-5 w-5 border border-pale text-[10px] hover:border-black disabled:opacity-20">−</button>
                    <span className="w-4 text-center text-[10px]">{qty}</span>
                    <button onClick={() => setEq(eq.id, qty + 1)}
                      className="h-5 w-5 border border-pale text-[10px] hover:border-black">+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </Sec>

        {/* GLASSWARE */}
        <Sec label={`Glassware — ${s.guests}/guest suggested`} dim={!s.service}>
          <div className="space-y-0.5">
            {glasswareTypes.map((g) => {
              const qty = gw[g.id] || 0;
              const removed = qty === 0;
              return (
                <div key={g.id} className={`flex items-center justify-between px-2 py-1.5 text-xs ${removed ? 'opacity-30' : ''}`}>
                  <span className={`flex-1 ${removed ? 'line-through' : ''}`}>{g.name} <span className="text-light">£{glassPrice.toFixed(2)}</span></span>
                  <div className="flex items-center gap-1">
                    {!removed ? (
                      <>
                        <span className="mr-1 text-[10px] font-medium">£{(qty * glassPrice).toFixed(2)}</span>
                        <button onClick={() => setGw(g.id, qty - 10)} className="h-5 w-5 border border-pale text-[10px] hover:border-black">−</button>
                        <input type="number" value={qty} onChange={(e) => setGw(g.id, Number(e.target.value))}
                          className="w-10 border border-pale bg-faint px-0.5 text-center text-[10px] outline-none focus:border-black" />
                        <button onClick={() => setGw(g.id, qty + 10)} className="h-5 w-5 border border-pale text-[10px] hover:border-black">+</button>
                        <button onClick={() => setGw(g.id, 0)} className="ml-0.5 h-5 w-5 border border-pale text-[10px] text-light hover:border-black hover:text-black">✕</button>
                      </>
                    ) : (
                      <button onClick={() => setGw(g.id, s.guests)} className="border border-pale px-2 py-0.5 text-[10px] hover:border-black">Add</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Sec>

        {/* CONTACT */}
        <Sec label="Your Details" dim={!s.service}>
          <div className="space-y-2">
            <input type="text" placeholder="Name" value={s.name} onChange={(e) => up({ name: e.target.value })}
              className="w-full border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-black" />
            <div className="grid grid-cols-2 gap-2">
              <input type="email" placeholder="Email" value={s.email} onChange={(e) => up({ email: e.target.value })}
                className="border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-black" />
              <input type="tel" placeholder="Phone" value={s.phone} onChange={(e) => up({ phone: e.target.value })}
                className="border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-black" />
            </div>
            <textarea rows={2} placeholder="Notes (optional)" value={s.notes} onChange={(e) => up({ notes: e.target.value })}
              className="w-full resize-none border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-black" />
          </div>
        </Sec>

        {/* VIEW QUOTE BUTTON */}
        {s.service && (
          <button
            onClick={() => setShowQuote(true)}
            className="w-full border border-black bg-black py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-dark"
          >
            View Quote — £{pricing.total.toLocaleString()}
          </button>
        )}
      </div>

      {/* FLOATING PRICE */}
      {pricing.total > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 border border-black bg-black px-5 py-2 shadow-xl">
          <span className="text-xs text-white/50">Estimate </span>
          <span className="font-heading text-base font-bold text-white">£{pricing.total.toLocaleString()}</span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Tiny Section ───
interface SecProps { label: string; dim?: boolean; children: React.ReactNode }
const Sec = React.forwardRef<HTMLDivElement, SecProps>(({ label, dim, children }, ref) => (
  <div ref={ref} className={`border border-pale px-4 py-3 transition-all ${dim ? 'opacity-30 pointer-events-none' : ''}`}>
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-light">{label}</p>
    {children}
  </div>
));
Sec.displayName = 'Sec';

// ─── Chip ───
function Chip({ active, onClick, children, className = '' }: { active: boolean; onClick: () => void; children: React.ReactNode; className?: string }) {
  return (
    <button onClick={onClick}
      className={`border px-3 py-1.5 text-xs font-medium transition-all ${active ? 'border-black bg-black text-white' : 'border-pale hover:border-black'} ${className}`}>
      {children}
    </button>
  );
}
