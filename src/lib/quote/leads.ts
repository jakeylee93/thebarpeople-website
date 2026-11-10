// Where quote requests go. NOT CONNECTED YET.
//
// Jake, 10 Nov 2026: leads will go into the AnyVendor backend, which he is
// connecting later. Until then nothing leaves the browser: this records
// nothing and sends nothing, and the page says so.

import type { Pence } from '../visual-quote/money.ts';
import type { QuoteState } from './quote.ts';

export interface Lead {
  name: string;
  email: string;
  phone: string;
  /** What the guest asked for. */
  wants: 'pdf' | 'email';
  state: QuoteState;
  subtotal: Pence;
  total: Pence;
}

export type LeadResult = { status: 'not-connected' } | { status: 'sent' } | { status: 'failed'; reason: string };

export const LEADS_CONNECTED = false;

/** The single place to connect AnyVendor: POST the lead and return 'sent'. */
export async function submitLead(lead: Lead): Promise<LeadResult> {
  void lead;
  return { status: 'not-connected' };
}

/** A light check that this could be an email address. */
export const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
