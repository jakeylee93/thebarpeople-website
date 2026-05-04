import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Send to AnyOS as a lead
    const anyosPayload = {
      source: 'thebarpeople-website',
      type: 'quote_request',
      contact: {
        name: body.name,
        email: body.email,
        phone: body.phone,
      },
      event: {
        type: body.eventType,
        venue: body.venueType,
        date: body.date,
        postcode: body.postcode,
        guests: body.guests,
        hours: body.hours,
        service: body.service,
        bar: body.barSize,
      },
      equipment: body.equipment,
      glassware: body.glassware,
      notes: body.notes,
      estimate: body.estimate,
      breakdown: body.breakdown,
      createdAt: new Date().toISOString(),
    };

    // POST to AnyOS backend — update URL when AnyOS API is ready
    const ANYOS_API = process.env.ANYOS_API_URL;
    if (ANYOS_API) {
      await fetch(`${ANYOS_API}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(process.env.ANYOS_API_KEY ? { Authorization: `Bearer ${process.env.ANYOS_API_KEY}` } : {}),
        },
        body: JSON.stringify(anyosPayload),
      });
    }

    // Also log for now so no leads are lost
    console.log('[QUOTE LEAD]', JSON.stringify(anyosPayload));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[QUOTE ERROR]', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
