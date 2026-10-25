# Pricing rules, catalogue and party numbers

Code: `src/lib/visual-quote/` (engine, timing, money, seed catalogue) · tests: `pnpm test` (19 passing).

## Rules the engine follows

- **Money is whole pence.** Nothing is ever rounded. If a sum would leave part of a penny, the engine
  stops rather than guess a rounding rule. Times are chosen in 15-minute steps, so £28/hour always
  lands on whole pence (£7 per quarter hour).
- **Only authorised prices are charged.** Today that is **staff: £28 per person per hour plus VAT**
  (Jake, 25 Oct 2026). Example: 6 hours × 2 staff × £28 = **£336.00 + VAT** (tested).
- **Staff are priced on party start → finish only.** The page suggests the team arrives an hour
  earlier to set up and says timings will be confirmed. That hour is **not billed and not promised
  free**. It's flagged for Jake to decide.
- **After midnight:** a finish time at or before the start means the next day (e.g. 8pm–2am = 6h).
- **Clock-change nights:** priced on real elapsed time and flagged. Sat 24 Oct 2026, 8pm–2am is 7
  real hours; Sat 28 Mar 2026 is 5. Times inside the changing hour are flagged too.
- **Unknown prices are "to confirm", never £0.** Any line still waiting makes the quote a
  **provisional estimate** ("Priced so far £336.00 + VAT · 3 items to confirm"). Extras show "On
  request". A quote becomes an **itemised quote** only when every line is priced.
- **No double charges.** A drinks package that covers the bar, staff, glassware and ice marks those
  lines "Included" and doesn't add the £28/hour on top. Cool boxes and fridges are not covered.
- **VAT:** amounts are shown "+ VAT", as on thebarpeople.co.uk ("£…/ex VAT"). The engine only
  calculates VAT once a verified rate and rounding method are supplied (supported and tested, but
  switched off).
- **Not a booking:** every quote says the date isn't held and nothing is charged.

## Assumptions Jake needs to confirm

1. Prep hour: bill it, include it, or quote it separately?
2. Clock-change nights: bill real time or clock-face time?
3. VAT: 20% standard rate? Rounding at invoice level? Show VAT-inclusive totals to private customers?
4. Drinks packages: real menus, prices (per guest, per hour?) and exactly what each includes.
5. Delivery and set-up: free within what radius, priced how outside it?
6. Minimum hours or spend: none applied (none confirmed).

## Seed catalogue — to reconcile read-only with anyOS before real quotes

Every item has `platformId: null` until it is matched to the existing anyOS catalogue (not touched
in this delivery). Old prices from thebarpeople.co.uk (2024) are kept as reference only and never charged.

| Seed id | Name | Image | Price now | Old public price (2024, stale) |
|---|---|---|---|---|
| `bar-1-5m` | 1.5m bar | sketch `compact-5ft.png` | to confirm | pop-up bars "from £295" (size not stated) |
| `bar-3m` | 3m bar | sketch `straight-10ft.png` | to confirm | — |
| `bar-4-5m` | 4.5m bar | sketch `open-island-15ft.png` | to confirm | — |
| `bar-horseshoe` | Horseshoe | sketch `horseshoe-small.png` | to confirm | — |
| `bar-full-horseshoe` | Full horseshoe | sketch `horseshoe-large.png` | to confirm | "35FT" listed |
| `bar-curved-mirror` | Curved mirror | line illustration (no photo yet) | to confirm | — |
| `glass-*` | 12oz highball, wine, flute, martini, whisky, gin bowl, margarita, pint, half pint, shot | line drawings | to confirm | £0.50–£0.80 per glass |
| `ice-bag`, `igloo-box`, `bar-fridge` | Bagged ice, Igloo cool box, bar fridge | line drawings | to confirm | — |
| `staff-bartender` | Bartenders | real photo | **£28.00/person/hour + VAT (authorised)** | — |
| `drinks-*` | All-inclusive, + cocktails, alcohol-free (draft menus) | real photos | to confirm | packages "£1,495–£6,995 ex VAT" |
| `extra-*` | Marquee, furniture, party help | — | on request | — |
| `delivery` | Delivery, set-up & collection | — | to confirm | "included within a radius" |

Notes: the live dry-hire page contradicts itself (10ft vs 15ft, 20ft vs 30ft), so none of its
packages were imported. The 40ft island (`island.png`) exists on the old site but isn't one of the
six seeds. Sizes for the horseshoe, full horseshoe and curved mirror are unconfirmed. Staff
guidance ("one bartender per 50–75 guests") is from the site's FAQ and is only a suggestion.

## Party numbers from 3033 — design (not built, not applied)

- A **new, separate** sequence for website quotes, starting at **3033**. Existing anyOS quote and
  booking IDs are never reset or reused.
- A number is issued **only when a real quote is created**. Drafts, prototype saves and page
  views use none. The prototype shows "Party no. 3033" with an **Example** label only.
- **Safe retries:** every draft carries a random request key. A real request sends it once. If the
  same key arrives again (double tap, retry after a timeout), the server returns the **same** quote
  and number instead of creating another.
- **Safe under load:** numbers come from one database sequence inside the same transaction that
  creates the quote, so two people can never get the same number. A failed transaction can leave a
  gap; if Jake needs gap-free numbering, use a single counter row locked per insert instead.

Sketch for review only — **not run anywhere**:

```sql
-- PROPOSAL ONLY. Do not apply without review of the real anyOS schema.
create sequence website_party_no_seq start with 3033 minvalue 3033;

create table website_quotes (
  id            uuid primary key default gen_random_uuid(),
  party_no      bigint not null unique default nextval('website_party_no_seq'),
  request_key   text   not null unique,          -- idempotency key from the browser draft
  tenant_id     text   not null,                 -- The Bar People's anyOS client id
  status        text   not null default 'requested',
  quote_json    jsonb  not null,                 -- itemised lines, pence, pending items
  created_at    timestamptz not null default now()
);

-- Create-or-return in one statement: a retried request gets the original row back.
insert into website_quotes (request_key, tenant_id, quote_json)
values ($1, $2, $3)
on conflict (request_key) do update set request_key = excluded.request_key
returning id, party_no, (xmax = 0) as created_now;
```
