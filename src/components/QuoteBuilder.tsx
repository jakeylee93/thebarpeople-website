'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Building2, Cake, TreePine, Snowflake, Music, Sparkles,
  Home, Trees, Fence,
  Wine, CreditCard, Beer, Users,
  Minus, Plus, X,
  Refrigerator, Snowflake as IceIcon, Glasses, Pipette, Lightbulb, Tag, Gauge,
  Clock, Send, ChevronLeft,
  GlassWater,
} from 'lucide-react';
import {
  perHeadByHours, barPrices, equipmentOptions,
  glasswareTypes, glassPrice, serviceBasePrices,
} from '@/lib/constants';
import React from 'react';

type Svc = 'all-inclusive' | 'cash-bar' | 'dry-hire' | 'staff-only';
type Bar = '5ft' | '10ft' | '15ft' | '35ft' | '40ft';

interface Q {
  eventType: string; date: string; postcode: string; venueType: string;
  guests: number; service: Svc | ''; barSize: Bar | ''; hours: number;
  equipment: Record<string, number>; glassware: Record<string, number>;
  name: string; email: string; phone: string; notes: string;
}

const init: Q = {
  eventType: '', date: '', postcode: '', venueType: '',
  guests: 80, service: '', barSize: '', hours: 5,
  equipment: {}, glassware: {}, name: '', email: '', phone: '', notes: '',
};

const evts = [
  { id: 'wedding', label: 'Wedding', icon: Heart },
  { id: 'corporate', label: 'Corporate', icon: Building2 },
  { id: 'birthday', label: 'Birthday', icon: Cake },
  { id: 'garden', label: 'Garden Party', icon: TreePine },
  { id: 'christmas', label: 'Christmas', icon: Snowflake },
  { id: 'festival', label: 'Festival', icon: Music },
  { id: 'other', label: 'Other', icon: Sparkles },
];

const vens = [
  { id: 'indoor', label: 'Indoor', icon: Home },
  { id: 'outdoor', label: 'Outdoor', icon: Trees },
  { id: 'both', label: 'Both', icon: Fence },
];

const svcs: { id: Svc; label: string; icon: typeof Wine }[] = [
  { id: 'all-inclusive', label: 'All Inclusive', icon: Wine },
  { id: 'cash-bar', label: 'Cash Bar', icon: CreditCard },
  { id: 'dry-hire', label: 'Dry Hire', icon: Beer },
  { id: 'staff-only', label: 'Staff Only', icon: Users },
];

const brs: { id: Bar; size: string; cap: string }[] = [
  { id: '5ft', size: '5FT', cap: '≤50' },
  { id: '10ft', size: '10FT', cap: '≤100' },
  { id: '15ft', size: '15FT', cap: '≤150' },
  { id: '35ft', size: '35FT', cap: '≤250' },
  { id: '40ft', size: '40FT', cap: '250+' },
];

const eqIcons: Record<string, typeof Refrigerator> = {
  'fridge-single': Refrigerator, 'fridge-double': Refrigerator,
  'ice-well': IceIcon, 'ice-delivery': IceIcon,
  'bottle-cooler': Glasses, 'speed-rail': Gauge,
  'cocktail-station': Pipette, 'beer-tap': Beer,
  'lighting': Lightbulb, 'branded-panels': Tag,
};

export default function QuoteBuilder() {
  const [s, set] = useState<Q>(init);
  const [view, setView] = useState<'build' | 'quote' | 'sent'>('build');
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const up = useCallback((p: Partial<Q>) => set((v) => ({ ...v, ...p })), []);
  const go = useCallback((id: string) => {
    setTimeout(() => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }, []);

  // Glassware: suggest packs to cover guest count
  const gw = useMemo(() => {
    const r: Record<string, number> = {};
    glasswareTypes.forEach((g) => {
      if (s.glassware[g.id] !== undefined) { r[g.id] = s.glassware[g.id]; }
      else { r[g.id] = Math.ceil(s.guests / g.pack) * g.pack; }
    });
    return r;
  }, [s.guests, s.glassware]);

  const setGw = (id: string, n: number) => set((v) => ({ ...v, glassware: { ...v.glassware, [id]: Math.max(0, n) } }));
  const setEq = (id: string, n: number) => set((v) => ({ ...v, equipment: { ...v.equipment, [id]: Math.max(0, n) } }));

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
      lines.push({ label: svcs.find((x) => x.id === s.service)!.label, amount: base });
      total += base;
    }
    if (s.barSize) {
      const amt = barPrices[s.barSize];
      lines.push({ label: `${brs.find((b) => b.id === s.barSize)!.size} Bar`, amount: amt });
      total += amt;
    }
    equipmentOptions.forEach((eq) => {
      const qty = s.equipment[eq.id] || 0;
      if (qty > 0) { const a = eq.price * qty; lines.push({ label: `${eq.name}${qty > 1 ? ` ×${qty}` : ''}`, amount: a }); total += a; }
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
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...s, glassware: gw, estimate: pricing.total, breakdown: pricing.lines }),
      });
    } catch {}
    setView('sent');
  };

  // ─── SENT ───
  if (view === 'sent') return (
    <div className="mx-auto max-w-md px-4 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
        <Send size={20} className="text-green-600" />
      </div>
      <h2 className="font-heading text-2xl font-bold">Quote Sent</h2>
      <p className="mt-2 text-sm text-mid">We&apos;ll be in touch at <strong>{s.email}</strong></p>
      <p className="mt-4 font-heading text-3xl font-bold text-gold">£{pricing.total.toLocaleString()}</p>
    </div>
  );

  // ─── QUOTE PREVIEW ───
  if (view === 'quote') return (
    <div className="mx-auto max-w-lg px-4">
      <div className="overflow-hidden rounded-xl border border-pale shadow-sm">
        <div className="bg-charcoal px-6 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-heading text-lg font-bold">The Bar People</p>
              <p className="text-xs text-white/50">Premium Mobile Bar Hire</p>
            </div>
            <div className="text-right text-xs text-white/50">
              <p>Quote Estimate</p>
              <p>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {(s.name || s.email) && (
          <div className="border-b border-pale px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-light">Prepared for</p>
            <p className="text-sm font-medium">{s.name}</p>
            <p className="text-xs text-mid">{[s.email, s.phone].filter(Boolean).join(' · ')}</p>
          </div>
        )}

        <div className="border-b border-pale px-6 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-light">Event</p>
          <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
            {s.eventType && <><span className="text-mid">Type</span><span className="text-right font-medium">{evts.find(e=>e.id===s.eventType)?.label}</span></>}
            {s.venueType && <><span className="text-mid">Venue</span><span className="text-right font-medium capitalize">{s.venueType}</span></>}
            {s.date && <><span className="text-mid">Date</span><span className="text-right font-medium">{new Date(s.date).toLocaleDateString('en-GB')}</span></>}
            {s.postcode && <><span className="text-mid">Location</span><span className="text-right font-medium uppercase">{s.postcode}</span></>}
            <span className="text-mid">Guests</span><span className="text-right font-medium">{s.guests}</span>
            <span className="text-mid">Duration</span><span className="text-right font-medium">{s.hours}h</span>
          </div>
        </div>

        <div className="px-6 py-3">
          <div className="flex border-b border-pale pb-1 text-[10px] font-semibold uppercase tracking-wider text-light">
            <span className="flex-1">Item</span><span className="w-16 text-right">Amount</span>
          </div>
          {pricing.lines.map((l, i) => (
            <div key={i} className="flex border-b border-faint py-1.5 text-xs">
              <span className="flex-1 text-mid">{l.label}</span>
              <span className="w-16 text-right font-medium">£{l.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {glasswareTypes.some((g) => gw[g.id] > 0) && (
          <div className="border-t border-pale px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-light">Glassware Detail</p>
            <div className="mt-1 space-y-0.5 text-xs">
              {glasswareTypes.filter((g) => gw[g.id] > 0).map((g) => (
                <div key={g.id} className="flex justify-between">
                  <span className="text-mid">{g.name}</span>
                  <span>{gw[g.id]} pcs (packs of {g.pack})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-faint px-6 py-4">
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-light">Estimated Total</span>
            <span className="font-heading text-2xl font-bold">£{pricing.total.toLocaleString()}</span>
          </div>
          <p className="mt-0.5 text-right text-[10px] text-light">Final price confirmed by email</p>
        </div>

        {s.notes && (
          <div className="border-t border-pale px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-light">Notes</p>
            <p className="mt-1 text-xs text-mid">{s.notes}</p>
          </div>
        )}

        <div className="flex border-t border-pale">
          <button onClick={() => setView('build')}
            className="flex flex-1 items-center justify-center gap-1.5 border-r border-pale py-3 text-xs font-medium text-mid hover:bg-faint">
            <ChevronLeft size={14} /> Edit
          </button>
          <button onClick={handleSend} disabled={!canSend}
            className="flex-1 bg-gold py-3 text-xs font-semibold text-white transition-all hover:bg-gold-hover disabled:opacity-30">
            Send Quote Request
          </button>
        </div>
      </div>
      {!canSend && <p className="mt-3 text-center text-xs text-light">Add your name, email & phone to send</p>}
    </div>
  );

  // ─── BUILDER ───
  return (
    <div className="mx-auto max-w-lg px-4">
      <div className="mb-6 text-center">
        <h1 className="font-heading text-2xl font-bold md:text-3xl">Price Your Event</h1>
        <p className="mt-1 text-xs text-light">Pick your options — price builds live</p>
      </div>

      <div className="space-y-2">
        {/* EVENT */}
        <Sec ref={(el) => { refs.current['ev'] = el; }} label="Event type">
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-7">
            {evts.map((e) => {
              const Icon = e.icon;
              return (
                <button key={e.id} onClick={() => { up({ eventType: e.id }); go('venue'); }}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${s.eventType === e.id ? 'border-gold bg-gold/5 text-gold' : 'border-pale text-mid hover:border-gold/30'}`}>
                  <Icon size={16} />
                  <span className="text-[10px] font-medium">{e.label}</span>
                </button>
              );
            })}
          </div>
        </Sec>

        {/* VENUE */}
        <Sec ref={(el) => { refs.current['venue'] = el; }} label="Venue" dim={!s.eventType}>
          <div className="grid grid-cols-3 gap-1.5">
            {vens.map((v) => {
              const Icon = v.icon;
              return (
                <button key={v.id} onClick={() => { up({ venueType: v.id }); go('dt'); }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 transition-all ${s.venueType === v.id ? 'border-gold bg-gold/5 text-gold' : 'border-pale text-mid hover:border-gold/30'}`}>
                  <Icon size={14} />
                  <span className="text-xs font-medium">{v.label}</span>
                </button>
              );
            })}
          </div>
        </Sec>

        {/* DATE + POSTCODE */}
        <Sec ref={(el) => { refs.current['dt'] = el; }} label="Date & location" dim={!s.venueType}>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={s.date} onChange={(e) => up({ date: e.target.value })}
              className="rounded-lg border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-gold" />
            <input type="text" placeholder="Postcode" value={s.postcode} onChange={(e) => up({ postcode: e.target.value })}
              className="rounded-lg border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-gold" />
          </div>
        </Sec>

        {/* GUESTS */}
        <Sec label="Guests" dim={!s.venueType}>
          <div className="flex items-center gap-3">
            <Users size={14} className="text-light" />
            <input type="range" min={20} max={500} step={10} value={s.guests}
              onChange={(e) => up({ guests: Number(e.target.value) })}
              className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-pale" />
            <span className="w-10 rounded-md border border-pale bg-faint py-1 text-center text-xs font-bold">{s.guests}</span>
          </div>
        </Sec>

        {/* SERVICE */}
        <Sec label="Service" dim={!s.venueType}>
          <div className="grid grid-cols-2 gap-1.5">
            {svcs.map((o) => {
              const Icon = o.icon;
              return (
                <button key={o.id} onClick={() => { up({ service: o.id }); go('hrs'); }}
                  className={`flex items-center gap-2 rounded-lg border py-2 pl-3 pr-2 transition-all ${s.service === o.id ? 'border-gold bg-gold/5 text-gold' : 'border-pale text-mid hover:border-gold/30'}`}>
                  <Icon size={14} />
                  <span className="text-xs font-medium">{o.label}</span>
                </button>
              );
            })}
          </div>
        </Sec>

        {/* HOURS */}
        <Sec ref={(el) => { refs.current['hrs'] = el; }} label="Duration" dim={!s.service}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-light" />
              <span className="text-xs text-mid">Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Btn onClick={() => s.hours > 3 && up({ hours: s.hours - 1 })} disabled={s.hours <= 3}>−</Btn>
              <span className="w-6 text-center text-sm font-bold">{s.hours}</span>
              <Btn onClick={() => s.hours < 12 && up({ hours: s.hours + 1 })} disabled={s.hours >= 12}>+</Btn>
              {s.service === 'all-inclusive' && (
                <span className="ml-2 rounded bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                  £{perHeadByHours[s.hours] ?? 30}/head
                </span>
              )}
            </div>
          </div>
        </Sec>

        {/* BAR */}
        <Sec label="Bar" dim={!s.service}>
          <div className="grid grid-cols-5 gap-1.5">
            {brs.map((b) => (
              <button key={b.id} onClick={() => up({ barSize: s.barSize === b.id ? '' as Bar : b.id })}
                className={`rounded-lg border py-2 text-center transition-all ${s.barSize === b.id ? 'border-gold bg-gold/5' : 'border-pale hover:border-gold/30'}`}>
                <p className="text-xs font-bold">{b.size}</p>
                <p className="text-[9px] text-light">{b.cap}</p>
                <p className={`text-[10px] font-semibold ${s.barSize === b.id ? 'text-gold' : ''}`}>£{barPrices[b.id]}</p>
              </button>
            ))}
          </div>
        </Sec>

        {/* EQUIPMENT */}
        <Sec label="Equipment" dim={!s.service}>
          <div className="space-y-px">
            {equipmentOptions.map((eq) => {
              const qty = s.equipment[eq.id] || 0;
              const EqIcon = eqIcons[eq.id] || Sparkles;
              return (
                <div key={eq.id} className={`flex items-center gap-2 rounded px-2 py-1.5 ${qty > 0 ? 'bg-gold/5' : ''}`}>
                  <EqIcon size={12} className="flex-shrink-0 text-light" />
                  <span className="flex-1 text-[11px]">{eq.name} <span className="text-light">£{eq.price}</span></span>
                  <div className="flex items-center gap-1">
                    {qty > 0 && <span className="text-[10px] font-semibold text-gold">£{eq.price * qty}</span>}
                    <Btn onClick={() => setEq(eq.id, qty - 1)} disabled={qty === 0}>−</Btn>
                    <span className="w-4 text-center text-[10px] font-medium">{qty}</span>
                    <Btn onClick={() => setEq(eq.id, qty + 1)}>+</Btn>
                  </div>
                </div>
              );
            })}
          </div>
        </Sec>

        {/* GLASSWARE */}
        <Sec label={`Glassware · £${glassPrice.toFixed(2)} each`} dim={!s.service}>
          <p className="mb-2 text-[10px] text-light">
            Suggested to cover {s.guests} guests in pack sizes. Adjust or remove.
          </p>
          <div className="space-y-px">
            {glasswareTypes.map((g) => {
              const qty = gw[g.id] || 0;
              const off = qty === 0;
              return (
                <div key={g.id} className={`flex items-center gap-2 rounded px-2 py-1.5 ${off ? 'opacity-30' : qty > 0 ? 'bg-gold/5' : ''}`}>
                  <GlassWater size={12} className="flex-shrink-0 text-light" />
                  <span className={`flex-1 text-[11px] ${off ? 'line-through' : ''}`}>
                    {g.name} <span className="text-light">×{g.pack}</span>
                  </span>
                  {!off ? (
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-gold">£{(qty * glassPrice).toFixed(2)}</span>
                      <Btn onClick={() => setGw(g.id, qty - g.pack)}>−</Btn>
                      <input type="number" value={qty} onChange={(e) => setGw(g.id, Number(e.target.value))}
                        className="w-9 rounded border border-pale bg-faint px-0.5 text-center text-[10px] outline-none focus:border-gold" />
                      <Btn onClick={() => setGw(g.id, qty + g.pack)}>+</Btn>
                      <button onClick={() => setGw(g.id, 0)}
                        className="ml-0.5 rounded p-0.5 text-light hover:text-charcoal"><X size={10} /></button>
                    </div>
                  ) : (
                    <button onClick={() => setGw(g.id, Math.ceil(s.guests / g.pack) * g.pack)}
                      className="rounded border border-pale px-2 py-0.5 text-[10px] hover:border-gold">Add</button>
                  )}
                </div>
              );
            })}
          </div>
        </Sec>

        {/* CONTACT */}
        <Sec label="Your details" dim={!s.service}>
          <div className="space-y-1.5">
            <input type="text" placeholder="Name" value={s.name} onChange={(e) => up({ name: e.target.value })}
              className="w-full rounded-lg border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-gold" />
            <div className="grid grid-cols-2 gap-1.5">
              <input type="email" placeholder="Email" value={s.email} onChange={(e) => up({ email: e.target.value })}
                className="rounded-lg border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-gold" />
              <input type="tel" placeholder="Phone" value={s.phone} onChange={(e) => up({ phone: e.target.value })}
                className="rounded-lg border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-gold" />
            </div>
            <textarea rows={2} placeholder="Notes (optional)" value={s.notes} onChange={(e) => up({ notes: e.target.value })}
              className="w-full resize-none rounded-lg border border-pale bg-faint px-3 py-2 text-xs outline-none focus:border-gold" />
          </div>
        </Sec>

        {/* VIEW QUOTE */}
        {s.service && (
          <button onClick={() => setView('quote')}
            className="w-full rounded-lg bg-gold py-3 text-sm font-semibold text-white transition-all hover:bg-gold-hover">
            View Quote — £{pricing.total.toLocaleString()}
          </button>
        )}
      </div>

      {/* FLOATING PRICE */}
      {pricing.total > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-charcoal px-5 py-2 shadow-xl">
          <span className="text-[10px] text-white/50">Estimate </span>
          <span className="font-heading text-sm font-bold text-white">£{pricing.total.toLocaleString()}</span>
        </motion.div>
      )}
    </div>
  );
}

// ─── Tiny components ───
interface SecProps { label: string; dim?: boolean; children: React.ReactNode }
const Sec = React.forwardRef<HTMLDivElement, SecProps>(({ label, dim, children }, ref) => (
  <div ref={ref} className={`rounded-xl border border-pale bg-white px-4 py-3 transition-all ${dim ? 'opacity-30 pointer-events-none' : ''}`}>
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-light">{label}</p>
    {children}
  </div>
));
Sec.displayName = 'Sec';

function Btn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex h-5 w-5 items-center justify-center rounded border border-pale text-[10px] transition-all hover:border-gold disabled:opacity-20">
      {children}
    </button>
  );
}
