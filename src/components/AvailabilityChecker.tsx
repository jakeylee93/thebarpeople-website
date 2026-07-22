'use client';

// Hero availability + instant pricing card — the site's main event.
// Pick a date → LIVE check against The Bar People's real booking calendar in
// anyOS (via /api/availability) → guests + service → honest from-price from
// the same constants the quote builder charges → one tap into /quote with
// everything prefilled. Degrades gracefully to a plain picker when the
// platform link isn't configured.

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, Loader2, Users, X } from 'lucide-react';
import { perHeadByHours, serviceBasePrices } from '@/lib/constants';

type DayInfo = { date: string; busy: boolean };

const SERVICES = [
  { id: 'all-inclusive', label: 'All-Inclusive' },
  { id: 'cash-bar', label: 'Cash Bar' },
  { id: 'dry-hire', label: 'Dry Hire' },
] as const;

function fromPrice(service: string, guests: number): number {
  if (service === 'all-inclusive') {
    const perHead = perHeadByHours[4] ?? 25; // from the 4-hour rate
    return Math.round(guests * perHead);
  }
  return serviceBasePrices[service] ?? 295;
}

export default function AvailabilityChecker() {
  const todayIso = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(80);
  const [service, setService] = useState<string>('all-inclusive');
  const [days, setDays] = useState<Map<string, boolean>>(new Map());
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(false);

  // Load the picked month's real calendar (and re-load when the month changes).
  const month = (date || todayIso).slice(0, 7);
  useEffect(() => {
    let on = true;
    setLoading(true);
    fetch(`/api/availability?month=${month}`)
      .then((r) => r.json())
      .then((body) => {
        if (!on) return;
        if (body.configured === false) { setConfigured(false); return; }
        const map = new Map<string, boolean>();
        for (const d of (body.dates || []) as DayInfo[]) map.set(d.date, d.busy);
        setDays(map);
      })
      .catch(() => { /* keep last state */ })
      .finally(() => { if (on) setLoading(false); });
    return () => { on = false; };
  }, [month]);

  const status = useMemo(() => {
    if (!date) return null;
    if (date < todayIso) return { ok: false, label: 'That date has passed' };
    if (!configured || !days.has(date)) return { ok: true, label: 'Enquire for this date' };
    return days.get(date)
      ? { ok: false, label: 'Booked up — enquire anyway, we sometimes have crew spare' }
      : { ok: true, label: 'Available — lock it in' };
  }, [date, days, configured, todayIso]);

  const price = fromPrice(service, guests);
  const quoteHref = `/quote?date=${encodeURIComponent(date)}&guests=${guests}&service=${encodeURIComponent(service)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.5 }}
      className="w-full max-w-md bg-white/95 backdrop-blur border border-pale p-6 sm:p-7 shadow-2xl"
    >
      <p className="text-xs uppercase tracking-[0.2em] text-gold mb-1 flex items-center gap-2">
        <CalendarCheck size={14} /> Check your date
      </p>
      <h3 className="font-heading text-2xl text-charcoal mb-5">Availability &amp; instant pricing</h3>

      <label className="block text-xs font-semibold text-mid mb-1">Event date</label>
      <div className="relative">
        <input
          type="date"
          min={todayIso}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-pale bg-white px-3 py-3 text-sm text-charcoal outline-none focus:border-gold"
        />
        {loading && <Loader2 size={14} className="absolute right-3 top-3.5 animate-spin text-light" />}
      </div>
      {status && (
        <p className={`mt-2 flex items-center gap-1.5 text-xs font-semibold ${status.ok ? 'text-green-700' : 'text-amber-700'}`}>
          {status.ok ? <Check size={13} /> : <X size={13} />} {status.label}
        </p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2">
        {SERVICES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setService(s.id)}
            className={`border px-2 py-2.5 text-xs font-semibold transition ${service === s.id ? 'border-gold bg-gold text-white' : 'border-pale bg-white text-charcoal hover:border-gold'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label className="mt-4 mb-1 flex items-center justify-between text-xs font-semibold text-mid">
        <span className="flex items-center gap-1.5"><Users size={13} /> Guests</span>
        <span className="text-charcoal">{guests}</span>
      </label>
      <input
        type="range"
        min={20}
        max={500}
        step={10}
        value={guests}
        onChange={(e) => setGuests(Number(e.target.value))}
        className="w-full"
      />

      <div className="mt-5 flex items-end justify-between border-t border-pale pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-light">From</p>
          <p className="font-heading text-3xl text-charcoal">£{price.toLocaleString('en-GB')}</p>
          <p className="text-[11px] text-light">{service === 'all-inclusive' ? 'all-inclusive · 4 hrs' : 'base price'} · final quote in 60s</p>
        </div>
        <Link
          href={quoteHref}
          className={`bg-gold px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-gold-hover ${!date ? 'pointer-events-none opacity-50' : ''}`}
          aria-disabled={!date}
        >
          Build my quote
        </Link>
      </div>
    </motion.div>
  );
}
