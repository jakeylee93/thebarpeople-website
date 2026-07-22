import { NextRequest, NextResponse } from 'next/server';

// Quote-builder + contact submissions → a REAL enquiry in the anyOS platform
// (a bookings row, status "enquiry", visible in The Bar People's Bookings with
// a notification) via the platform's public-booking endpoint. The submission
// carries the anti-spam token `t` the availability proxy fetched at render.
//
// Env (Vercel): ANYOS_API_URL, ANYOS_CLIENT_ID, ANYOS_BOOKING_K.
// Without them (or on failure) the lead is logged server-side so nothing is
// silently lost, and the caller is told honestly.

// Website event ids → platform enquiry types (party/wedding/corporate/other).
const EVENT_TYPE_MAP: Record<string, string> = {
  wedding: 'wedding',
  corporate: 'corporate',
  birthday: 'party',
  garden: 'party',
  christmas: 'party',
  festival: 'other',
  other: 'other',
  contact: 'other',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const isContact = body.mode === 'contact';
    const summaryBits = isContact
      ? [body.notes || body.message]
      : [
          body.service ? `Service: ${body.service}` : null,
          body.hours ? `Hours: ${body.hours}` : null,
          body.barSize ? `Bar: ${body.barSize}` : null,
          Array.isArray(body.equipment) && body.equipment.length ? `Equipment: ${body.equipment.join(', ')}` : null,
          body.glassware ? `Glassware: ${typeof body.glassware === 'object' ? JSON.stringify(body.glassware) : body.glassware}` : null,
          body.estimate ? `Website estimate: £${body.estimate}` : null,
          Array.isArray(body.breakdown) && body.breakdown.length
            ? `Breakdown: ${body.breakdown.map((l: { label?: string; amount?: number }) => `${l.label ?? ''} £${l.amount ?? ''}`).join('; ')}`
            : null,
          body.notes ? `Notes: ${body.notes}` : null,
        ];
    const message = summaryBits.filter(Boolean).join(' | ').slice(0, 1900);

    const base = process.env.ANYOS_API_URL;
    const clientId = process.env.ANYOS_CLIENT_ID;
    const k = process.env.ANYOS_BOOKING_K;

    if (base && clientId && k && body.t) {
      const res = await fetch(`${base}/api/public-booking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          k,
          t: body.t,
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          date: body.date,
          eventType: EVENT_TYPE_MAP[String(body.eventType || '')] || 'other',
          guests: body.guests,
          venue: [body.venueType, body.postcode].filter(Boolean).join(', ').slice(0, 180),
          message: (isContact ? `Contact-form message — ${message}` : `Website quote request — ${message}`),
        }),
      });
      const out = await res.json().catch(() => ({}));
      if (res.ok) return NextResponse.json({ ok: true, platform: true });
      // Platform rejected (validation, expired token…) — log and tell the truth.
      console.error('[QUOTE LEAD] platform rejected:', res.status, out?.error, JSON.stringify({ name: body.name, email: body.email, date: body.date }));
      return NextResponse.json({ ok: false, error: typeof out?.error === 'string' ? out.error : 'Could not send just now — please try again.' }, { status: 502 });
    }

    // Not configured — keep the lead in the server logs so it isn't lost.
    console.log('[QUOTE LEAD] (platform not configured)', JSON.stringify({ ...body, t: undefined }));
    return NextResponse.json({ ok: true, platform: false });
  } catch (err) {
    console.error('[QUOTE ERROR]', err);
    return NextResponse.json({ ok: false, error: 'Something went wrong — please try again.' }, { status: 500 });
  }
}
