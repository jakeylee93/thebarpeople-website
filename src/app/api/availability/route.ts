import { NextRequest, NextResponse } from 'next/server';

// Availability proxy — the browser never sees the platform credentials.
// GET /api/availability?month=YYYY-MM → { dates: [{date, busy}], t }
//   dates: the anyOS platform's real booking calendar for The Bar People
//   t:     the platform's anti-spam form token, required by the enquiry POST
// Env (Vercel): ANYOS_API_URL, ANYOS_CLIENT_ID, ANYOS_BOOKING_K (the k from
// the platform's public booking-page link). Without them we return
// { configured: false } and the UI degrades to a plain date picker.

export async function GET(req: NextRequest) {
  const base = process.env.ANYOS_API_URL;
  const clientId = process.env.ANYOS_CLIENT_ID;
  const k = process.env.ANYOS_BOOKING_K;
  if (!base || !clientId || !k) return NextResponse.json({ configured: false });

  const month = req.nextUrl.searchParams.get('month') || '';
  if (!/^\d{4}-\d{2}$/.test(month)) return NextResponse.json({ error: 'Invalid month' }, { status: 400 });

  try {
    const res = await fetch(
      `${base}/api/public-booking?clientId=${encodeURIComponent(clientId)}&k=${encodeURIComponent(k)}&month=${month}`,
      { next: { revalidate: 60 } },
    );
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return NextResponse.json({ configured: true, error: 'Availability unavailable right now' }, { status: 502 });
    return NextResponse.json({ configured: true, dates: body.dates || [], t: body.t || null });
  } catch {
    return NextResponse.json({ configured: true, error: 'Availability unavailable right now' }, { status: 502 });
  }
}
