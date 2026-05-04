'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Building2, Cake, TreePine, Snowflake, Music, Sparkles,
  Home, Trees, Fence,
  Wine, CreditCard, Beer, Users,
  Minus, Plus, X, ChevronLeft, Send,
  Refrigerator, Snowflake as IceIcon, Glasses, Pipette, Lightbulb, Tag, Gauge,
  Clock, GlassWater, Check, ArrowDown,
} from 'lucide-react';
import {
  perHeadByHours, barPrices, equipmentOptions,
  glasswareTypes, glassPrice, serviceBasePrices,
} from '@/lib/constants';
import React from 'react';

type Svc = 'all-inclusive' | 'cash-bar' | 'dry-hire' | 'staff-only';
type BarId = '5ft' | '10ft' | '15ft' | '35ft' | '40ft';

interface Q {
  eventType: string; date: string; postcode: string; venueType: string;
  guests: number; service: Svc | ''; barSize: BarId | ''; hours: number;
  equipment: Record<string, number>; glassware: Record<string, number>;
  name: string; email: string; phone: string; notes: string;
}

const init: Q = {
  eventType: '', date: '', postcode: '', venueType: '',
  guests: 80, service: '', barSize: '', hours: 5,
  equipment: {}, glassware: {}, name: '', email: '', phone: '', notes: '',
};

const evts = [
  { id: 'wedding', label: 'Wedding', icon: Heart, color: 'bg-rose-50 text-rose-500 border-rose-200' },
  { id: 'corporate', label: 'Corporate', icon: Building2, color: 'bg-blue-50 text-blue-500 border-blue-200' },
  { id: 'birthday', label: 'Birthday', icon: Cake, color: 'bg-amber-50 text-amber-500 border-amber-200' },
  { id: 'garden', label: 'Garden Party', icon: TreePine, color: 'bg-green-50 text-green-500 border-green-200' },
  { id: 'christmas', label: 'Christmas', icon: Snowflake, color: 'bg-sky-50 text-sky-500 border-sky-200' },
  { id: 'festival', label: 'Festival', icon: Music, color: 'bg-purple-50 text-purple-500 border-purple-200' },
  { id: 'other', label: 'Other', icon: Sparkles, color: 'bg-gray-50 text-gray-500 border-gray-200' },
];

const vens = [
  { id: 'indoor', label: 'Indoor', sub: 'Venue, hall or marquee', icon: Home },
  { id: 'outdoor', label: 'Outdoor', sub: 'Garden, field or terrace', icon: Trees },
  { id: 'both', label: 'Both', sub: 'Indoor & outdoor areas', icon: Fence },
];

const svcs: { id: Svc; label: string; sub: string; icon: typeof Wine }[] = [
  { id: 'all-inclusive', label: 'All Inclusive', sub: 'We handle everything — drinks, staff, bar & glassware', icon: Wine },
  { id: 'cash-bar', label: 'Cash Bar', sub: 'Guests pay for drinks, you cover setup & staff', icon: CreditCard },
  { id: 'dry-hire', label: 'Dry Hire', sub: 'We supply the bar & equipment, you supply the drinks', icon: Beer },
  { id: 'staff-only', label: 'Staff Only', sub: 'Our professional bartenders for your own setup', icon: Users },
];

const bars: { id: BarId; name: string; size: string; guests: string; desc: string; recommended?: string }[] = [
  { id: '5ft', name: 'Shimmer Bar', size: '5FT', guests: 'Up to 50 guests', desc: 'Perfect for intimate events' },
  { id: '10ft', name: 'Classic Cocktail', size: '10FT', guests: 'Up to 100 guests', desc: 'Our most popular bar', recommended: '≤100' },
  { id: '15ft', name: 'Horseshoe Bar', size: '15FT', guests: 'Up to 150 guests', desc: 'Great for larger celebrations' },
  { id: '35ft', name: 'Large Horseshoe', size: '35FT', guests: 'Up to 250 guests', desc: 'Major events & galas', recommended: '100-250' },
  { id: '40ft', name: 'Island Bar', size: '40FT', guests: '250+ guests', desc: 'The ultimate showstopper', recommended: '250+' },
];

const eqIcons: Record<string, typeof Refrigerator> = {
  'fridge-single': Refrigerator, 'fridge-double': Refrigerator,
  'ice-well': IceIcon, 'ice-delivery': IceIcon,
  'bottle-cooler': Glasses, 'speed-rail': Gauge,
  'cocktail-station': Pipette, 'beer-tap': Beer,
  'lighting': Lightbulb, 'branded-panels': Tag,
};

// Which bar to recommend based on guest count
function recommendedBar(guests: number): BarId {
  if (guests <= 50) return '5ft';
  if (guests <= 100) return '10ft';
  if (guests <= 150) return '15ft';
  if (guests <= 250) return '35ft';
  return '40ft';
}

export default function QuoteBuilder() {
  const [s, set] = useState<Q>(init);
  const [view, setView] = useState<'build' | 'quote' | 'sent'>('build');
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const up = useCallback((p: Partial<Q>) => set((v) => ({ ...v, ...p })), []);
  const go = useCallback((id: string) => {
    setTimeout(() => refs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
  }, []);

  // Glassware: suggest packs to cover guest count
  const gw = useMemo(() => {
    const r: Record<string, number> = {};
    glasswareTypes.forEach((g) => {
      r[g.id] = s.glassware[g.id] ?? Math.ceil(s.guests / g.pack) * g.pack;
    });
    return r;
  }, [s.guests, s.glassware]);

  const setGw = (id: string, n: number) => set((v) => ({ ...v, glassware: { ...v.glassware, [id]: Math.max(0, n) } }));
  const setEq = (id: string, n: number) => set((v) => ({ ...v, equipment: { ...v.equipment, [id]: Math.max(0, n) } }));

  const totalGlasses = useMemo(() => glasswareTypes.reduce((sum, g) => sum + (gw[g.id] || 0), 0), [gw]);

  // Pricing
  const pricing = useMemo(() => {
    const lines: { label: string; amount: number }[] = [];
    let total = 0;
    if (s.service === 'all-inclusive') {
      const rate = perHeadByHours[s.hours] ?? 30;
      const amt = rate * s.guests;
      lines.push({ label: `All Inclusive · ${s.guests} guests × £${rate}/head (${s.hours}hrs)`, amount: amt });
      total += amt;
    } else if (s.service) {
      const base = serviceBasePrices[s.service] || 0;
      lines.push({ label: svcs.find((x) => x.id === s.service)!.label + ' service', amount: base });
      total += base;
    }
    if (s.barSize) {
      const b = bars.find((b) => b.id === s.barSize)!;
      lines.push({ label: `${b.name} (${b.size})`, amount: barPrices[s.barSize] });
      total += barPrices[s.barSize];
    }
    equipmentOptions.forEach((eq) => {
      const qty = s.equipment[eq.id] || 0;
      if (qty > 0) { const a = eq.price * qty; lines.push({ label: `${eq.name}${qty > 1 ? ` ×${qty}` : ''}`, amount: a }); total += a; }
    });
    let gt = 0;
    glasswareTypes.forEach((g) => { gt += (gw[g.id] || 0) * glassPrice; });
    if (gt > 0) { lines.push({ label: `Glassware (${totalGlasses} pieces)`, amount: Math.round(gt * 100) / 100 }); total += gt; }
    return { lines, total: Math.round(total * 100) / 100 };
  }, [s, gw, totalGlasses]);

  const canSend = !!s.name && !!s.email && !!s.phone && !!s.service;
  const recBar = recommendedBar(s.guests);

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
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check size={28} className="text-green-600" />
        </div>
        <h2 className="font-heading text-3xl font-bold">You&apos;re all set!</h2>
        <p className="mt-3 text-mid">We&apos;ll send a detailed quote to <strong className="text-charcoal">{s.email}</strong> within a few hours.</p>
        <div className="mt-6 rounded-xl bg-faint p-6">
          <p className="text-xs text-light">Your estimated total</p>
          <p className="font-heading text-4xl font-bold text-gold">£{pricing.total.toLocaleString()}</p>
        </div>
      </motion.div>
    </div>
  );

  // ─── QUOTE PREVIEW ───
  if (view === 'quote') return (
    <div className="mx-auto max-w-lg px-4">
      <div className="overflow-hidden rounded-2xl border border-pale shadow-lg">
        <div className="bg-charcoal px-6 py-6 text-white">
          <div className="flex items-start justify-between">
            <div><p className="font-heading text-xl font-bold">The Bar People</p><p className="mt-0.5 text-xs text-white/40">Premium Mobile Bar Hire</p></div>
            <div className="text-right"><p className="text-[10px] uppercase tracking-wider text-white/40">Quote Estimate</p><p className="text-xs text-white/60">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
          </div>
        </div>

        {s.name && <div className="border-b border-pale px-6 py-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-light">Prepared for</p><p className="mt-0.5 text-sm font-medium">{s.name}</p><p className="text-xs text-mid">{[s.email, s.phone].filter(Boolean).join(' · ')}</p></div>}

        <div className="border-b border-pale px-6 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-light">Event Details</p>
          <div className="mt-1.5 grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
            {s.eventType && <><span className="text-mid">Type</span><span className="text-right font-medium">{evts.find(e => e.id === s.eventType)?.label}</span></>}
            {s.venueType && <><span className="text-mid">Venue</span><span className="text-right font-medium capitalize">{s.venueType}</span></>}
            {s.date && <><span className="text-mid">Date</span><span className="text-right font-medium">{new Date(s.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></>}
            {s.postcode && <><span className="text-mid">Location</span><span className="text-right font-medium uppercase">{s.postcode}</span></>}
            <span className="text-mid">Guests</span><span className="text-right font-medium">{s.guests}</span>
            <span className="text-mid">Duration</span><span className="text-right font-medium">{s.hours} hours</span>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="mb-2 flex text-[10px] font-semibold uppercase tracking-wider text-light"><span className="flex-1">Item</span><span className="w-20 text-right">Amount</span></div>
          {pricing.lines.map((l, i) => (
            <div key={i} className="flex border-t border-faint py-2 text-xs"><span className="flex-1 text-mid">{l.label}</span><span className="w-20 text-right font-medium">£{l.amount.toLocaleString()}</span></div>
          ))}
        </div>

        {glasswareTypes.some((g) => gw[g.id] > 0) && (
          <div className="border-t border-pale px-6 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-light">Glassware · {totalGlasses} pieces total</p>
            <div className="mt-1.5 space-y-0.5">{glasswareTypes.filter((g) => gw[g.id] > 0).map((g) => (
              <div key={g.id} className="flex justify-between text-xs"><span className="text-mid">{g.name}</span><span>{gw[g.id]} pcs <span className="text-light">(×{g.pack} packs)</span></span></div>
            ))}</div>
          </div>
        )}

        <div className="border-t-2 border-charcoal bg-faint px-6 py-5">
          <div className="flex items-end justify-between"><span className="text-xs font-medium uppercase tracking-wider text-light">Estimated Total</span><span className="font-heading text-3xl font-bold">£{pricing.total.toLocaleString()}</span></div>
          <p className="mt-0.5 text-right text-[10px] text-light">Subject to final confirmation</p>
        </div>

        {s.notes && <div className="border-t border-pale px-6 py-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-light">Notes</p><p className="mt-1 text-xs text-mid">{s.notes}</p></div>}

        <div className="flex border-t border-pale">
          <button onClick={() => setView('build')} className="flex flex-1 items-center justify-center gap-1.5 py-3.5 text-xs font-medium text-mid hover:bg-faint"><ChevronLeft size={14} /> Edit quote</button>
          <button onClick={handleSend} disabled={!canSend} className="flex-1 bg-gold py-3.5 text-xs font-semibold text-white hover:bg-gold-hover disabled:opacity-30">Send Quote Request</button>
        </div>
      </div>
      {!canSend && <p className="mt-3 text-center text-xs text-light">Fill in your details above to send</p>}
    </div>
  );

  // ─── BUILDER ───
  return (
    <div className="mx-auto max-w-lg px-4">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-bold md:text-4xl">Let&apos;s build your bar</h1>
        <p className="mt-2 text-sm text-mid">Answer a few questions and we&apos;ll put together a quote for you</p>
      </div>

      <div className="space-y-4">

        {/* ─── EVENT TYPE ─── */}
        <Q_Section ref={(el) => { refs.current['ev'] = el; }}>
          <Q_Question>What&apos;s the occasion?</Q_Question>
          <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
            {evts.map((e) => {
              const Icon = e.icon;
              const active = s.eventType === e.id;
              return (
                <button key={e.id} onClick={() => { up({ eventType: e.id }); go('venue'); }}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all ${active ? e.color + ' border-current' : 'border-pale text-mid hover:border-gold/30 hover:bg-faint'}`}>
                  <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
                  <span className="text-[10px] font-medium leading-tight">{e.label}</span>
                </button>
              );
            })}
          </div>
        </Q_Section>

        {/* ─── VENUE ─── */}
        <FadeIn show={!!s.eventType}>
          <Q_Section ref={(el) => { refs.current['venue'] = el; }}>
            <Q_Question>Where&apos;s it happening?</Q_Question>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {vens.map((v) => {
                const Icon = v.icon;
                const active = s.venueType === v.id;
                return (
                  <button key={v.id} onClick={() => { up({ venueType: v.id }); go('guests'); }}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-4 transition-all ${active ? 'border-gold bg-gold/5 text-gold' : 'border-pale text-mid hover:border-gold/30'}`}>
                    <Icon size={20} strokeWidth={active ? 2 : 1.5} />
                    <span className="text-xs font-semibold">{v.label}</span>
                    <span className={`text-[10px] ${active ? 'text-gold/70' : 'text-light'}`}>{v.sub}</span>
                  </button>
                );
              })}
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── DATE & LOCATION ─── */}
        <FadeIn show={!!s.venueType}>
          <Q_Section>
            <Q_Question>Do you have a date and location in mind?</Q_Question>
            <Q_Sub>No worries if not — you can always add these later</Q_Sub>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <input type="date" value={s.date} onChange={(e) => up({ date: e.target.value })}
                className="rounded-xl border border-pale bg-faint px-3 py-2.5 text-xs outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10" />
              <input type="text" placeholder="Postcode e.g. E11 1AA" value={s.postcode} onChange={(e) => up({ postcode: e.target.value })}
                className="rounded-xl border border-pale bg-faint px-3 py-2.5 text-xs outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10" />
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── GUESTS ─── */}
        <FadeIn show={!!s.venueType}>
          <Q_Section ref={(el) => { refs.current['guests'] = el; }}>
            <Q_Question>How many guests are you expecting?</Q_Question>
            <div className="mt-3">
              <div className="flex items-center gap-4">
                <input type="range" min={20} max={500} step={10} value={s.guests}
                  onChange={(e) => up({ guests: Number(e.target.value) })}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-pale" />
                <div className="flex items-center rounded-xl border border-pale bg-faint">
                  <button onClick={() => s.guests > 20 && up({ guests: s.guests - 10 })}
                    className="px-2.5 py-2 text-light hover:text-charcoal"><Minus size={14} /></button>
                  <span className="w-10 text-center font-heading text-lg font-bold">{s.guests}</span>
                  <button onClick={() => s.guests < 500 && up({ guests: s.guests + 10 })}
                    className="px-2.5 py-2 text-light hover:text-charcoal"><Plus size={14} /></button>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-light">
                For {s.guests} guests, we&apos;d recommend our <strong className="text-charcoal">{bars.find(b => b.id === recBar)?.name}</strong> bar
              </p>
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── SERVICE ─── */}
        <FadeIn show={!!s.venueType}>
          <Q_Section>
            <Q_Question>What level of service do you need?</Q_Question>
            <Q_Sub>Not sure? All Inclusive is our most popular — we handle everything</Q_Sub>
            <div className="mt-3 space-y-2">
              {svcs.map((o) => {
                const Icon = o.icon;
                const active = s.service === o.id;
                return (
                  <button key={o.id} onClick={() => { up({ service: o.id }); go('hours'); }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${active ? 'border-gold bg-gold/5' : 'border-pale hover:border-gold/30'}`}>
                    <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${active ? 'bg-gold text-white' : 'bg-faint text-mid'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-semibold ${active ? 'text-gold' : ''}`}>{o.label}</p>
                      <p className="text-[11px] text-light">{o.sub}</p>
                    </div>
                    {active && <Check size={18} className="text-gold" />}
                  </button>
                );
              })}
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── HOURS ─── */}
        <FadeIn show={!!s.service}>
          <Q_Section ref={(el) => { refs.current['hours'] = el; }}>
            <Q_Question>How long do you need us for?</Q_Question>
            {s.service === 'all-inclusive' && (
              <Q_Sub>Price per head adjusts with duration — longer events get more value</Q_Sub>
            )}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-faint p-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-light" />
                <span className="text-sm text-mid">Duration</span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => s.hours > 3 && up({ hours: s.hours - 1 })} disabled={s.hours <= 3}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-pale bg-white text-sm hover:border-gold disabled:opacity-20"><Minus size={14} /></button>
                <div className="text-center">
                  <span className="font-heading text-2xl font-bold">{s.hours}</span>
                  <span className="ml-1 text-xs text-light">hrs</span>
                </div>
                <button onClick={() => s.hours < 12 && up({ hours: s.hours + 1 })} disabled={s.hours >= 12}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-pale bg-white text-sm hover:border-gold disabled:opacity-20"><Plus size={14} /></button>
              </div>
            </div>
            {s.service === 'all-inclusive' && (
              <div className="mt-2 flex items-center justify-between rounded-lg bg-gold/5 px-4 py-2">
                <span className="text-xs text-mid">{s.hours} hours service</span>
                <span className="text-sm font-bold text-gold">£{perHeadByHours[s.hours] ?? 30} per head</span>
              </div>
            )}
          </Q_Section>
        </FadeIn>

        {/* ─── BAR ─── */}
        <FadeIn show={!!s.service}>
          <Q_Section>
            <Q_Question>Which bar suits your event?</Q_Question>
            <Q_Sub>Based on {s.guests} guests, we&apos;d suggest the <strong>{bars.find(b => b.id === recBar)?.name}</strong></Q_Sub>
            <div className="mt-3 space-y-2">
              {bars.map((b) => {
                const active = s.barSize === b.id;
                const rec = b.id === recBar;
                return (
                  <button key={b.id} onClick={() => up({ barSize: active ? '' as BarId : b.id })}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${active ? 'border-gold bg-gold/5' : rec ? 'border-gold/30 bg-gold/5' : 'border-pale hover:border-gold/30'}`}>
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg font-heading text-sm font-bold ${active ? 'bg-gold text-white' : 'bg-faint text-charcoal'}`}>
                      {b.size}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${active ? 'text-gold' : ''}`}>{b.name}</p>
                        {rec && <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[9px] font-semibold text-gold">Recommended</span>}
                      </div>
                      <p className="text-[11px] text-light">{b.guests} · {b.desc}</p>
                    </div>
                    <span className={`text-sm font-bold ${active ? 'text-gold' : 'text-charcoal'}`}>£{barPrices[b.id].toLocaleString()}</span>
                  </button>
                );
              })}
              {s.barSize && (
                <button onClick={() => up({ barSize: '' as BarId })} className="w-full text-center text-xs text-light hover:text-mid">
                  Skip — I have my own bar setup
                </button>
              )}
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── EQUIPMENT ─── */}
        <FadeIn show={!!s.service}>
          <Q_Section>
            <Q_Question>Need any equipment?</Q_Question>
            <Q_Sub>Fridges, ice, lighting — add what you need</Q_Sub>
            <div className="mt-3 space-y-1">
              {equipmentOptions.map((eq) => {
                const qty = s.equipment[eq.id] || 0;
                const EqIcon = eqIcons[eq.id] || Sparkles;
                return (
                  <div key={eq.id} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all ${qty > 0 ? 'bg-gold/5' : 'hover:bg-faint'}`}>
                    <EqIcon size={14} className={qty > 0 ? 'text-gold' : 'text-light'} />
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium">{eq.name}</span>
                      <span className="ml-1 text-[10px] text-light">£{eq.price}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {qty > 0 && <span className="text-[11px] font-semibold text-gold">£{eq.price * qty}</span>}
                      <MiniBtn onClick={() => setEq(eq.id, qty - 1)} disabled={qty === 0}><Minus size={10} /></MiniBtn>
                      <span className="w-4 text-center text-xs font-medium">{qty}</span>
                      <MiniBtn onClick={() => setEq(eq.id, qty + 1)}><Plus size={10} /></MiniBtn>
                    </div>
                  </div>
                );
              })}
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── GLASSWARE ─── */}
        <FadeIn show={!!s.service}>
          <Q_Section>
            <Q_Question>How about glassware?</Q_Question>
            <Q_Sub>We&apos;ve suggested enough to cover {s.guests} guests — {totalGlasses} glasses total at £{glassPrice.toFixed(2)} each. Adjust or remove any you don&apos;t need.</Q_Sub>
            <div className="mt-3 space-y-1">
              {glasswareTypes.map((g) => {
                const qty = gw[g.id] || 0;
                const off = qty === 0;
                return (
                  <div key={g.id} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 transition-all ${off ? 'opacity-35' : 'bg-gold/5'}`}>
                    <GlassWater size={14} className={off ? 'text-light' : 'text-gold'} />
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-medium ${off ? 'line-through' : ''}`}>{g.name}</span>
                      <span className="ml-1 text-[10px] text-light">packs of {g.pack}</span>
                    </div>
                    {!off ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-semibold text-gold">
                          {qty} <span className="font-normal text-light">= £{(qty * glassPrice).toFixed(2)}</span>
                        </span>
                        <MiniBtn onClick={() => setGw(g.id, qty - g.pack)}><Minus size={10} /></MiniBtn>
                        <input type="number" value={qty} onChange={(e) => setGw(g.id, Number(e.target.value))}
                          className="w-10 rounded-md border border-pale bg-white px-1 py-0.5 text-center text-[11px] outline-none focus:border-gold" />
                        <MiniBtn onClick={() => setGw(g.id, qty + g.pack)}><Plus size={10} /></MiniBtn>
                        <button onClick={() => setGw(g.id, 0)} className="rounded p-0.5 text-light hover:text-charcoal"><X size={12} /></button>
                      </div>
                    ) : (
                      <button onClick={() => setGw(g.id, Math.ceil(s.guests / g.pack) * g.pack)}
                        className="rounded-md border border-pale px-2.5 py-1 text-[10px] font-medium hover:border-gold hover:text-gold">
                        Add
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-faint px-3 py-2">
              <span className="text-xs text-mid">Total glassware</span>
              <span className="text-xs font-semibold">{totalGlasses} pieces · £{(totalGlasses * glassPrice).toFixed(2)}</span>
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── CONTACT ─── */}
        <FadeIn show={!!s.service}>
          <Q_Section>
            <Q_Question>Last step — where should we send your quote?</Q_Question>
            <div className="mt-3 space-y-2">
              <input type="text" placeholder="Your name" value={s.name} onChange={(e) => up({ name: e.target.value })}
                className="w-full rounded-xl border border-pale bg-faint px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10" />
              <div className="grid grid-cols-2 gap-2">
                <input type="email" placeholder="Email address" value={s.email} onChange={(e) => up({ email: e.target.value })}
                  className="rounded-xl border border-pale bg-faint px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10" />
                <input type="tel" placeholder="Phone number" value={s.phone} onChange={(e) => up({ phone: e.target.value })}
                  className="rounded-xl border border-pale bg-faint px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10" />
              </div>
              <textarea rows={2} placeholder="Anything else we should know? (optional)" value={s.notes} onChange={(e) => up({ notes: e.target.value })}
                className="w-full resize-none rounded-xl border border-pale bg-faint px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10" />
            </div>
          </Q_Section>
        </FadeIn>

        {/* ─── VIEW QUOTE ─── */}
        {s.service && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
            <button onClick={() => setView('quote')}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-4 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-hover hover:shadow-xl">
              View Your Quote — £{pricing.total.toLocaleString()}
            </button>
            <div className="text-center text-[11px] text-light">
              {pricing.lines.length} items · Review before sending
            </div>
          </motion.div>
        )}
      </div>

      {/* ─── FLOATING PRICE ─── */}
      {pricing.total > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-charcoal/95 px-5 py-2.5 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40">Estimate</span>
            <span className="font-heading text-sm font-bold text-white">£{pricing.total.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ─── Components ───
function Q_Question({ children }: { children: React.ReactNode }) {
  return <h3 className="font-heading text-lg font-semibold">{children}</h3>;
}
function Q_Sub({ children }: { children: React.ReactNode }) {
  return <p className="mt-1 text-xs text-light">{children}</p>;
}

interface SecProps { children: React.ReactNode }
const Q_Section = React.forwardRef<HTMLDivElement, SecProps>(({ children }, ref) => (
  <motion.div ref={ref}
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    viewport={{ once: true, margin: '-20px' }}
    className="rounded-2xl border border-pale bg-white p-5">
    {children}
  </motion.div>
));
Q_Section.displayName = 'Q_Section';

function FadeIn({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MiniBtn({ onClick, disabled, children }: { onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="flex h-6 w-6 items-center justify-center rounded-md border border-pale bg-white transition-all hover:border-gold disabled:opacity-20">
      {children}
    </button>
  );
}
