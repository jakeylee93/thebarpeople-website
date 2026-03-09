# STAGE 2: Quote Builder + Logo Integration

## You are Bish. Continue building The Bar People website.

**Repo:** jakeylee93/thebarpeople-website (already scaffolded)
**Branch:** Work on `stage-2/quote-builder`, merge to `main` when done.

---

## TASK 1: Fix the Logo

Real logos are now in `/public/`:
- `logo-main.png` — Large circular badge (black circle, white retro lettering "the Bar People")
- `logo-header.png` — Horizontal header version

**What to do:**
- Replace the text-only "THE BAR PEOPLE" in the Header component with the real `logo-header.png` image
- Use `next/image` with proper sizing (height ~40px in nav, responsive)
- The logo has a black background circle — the site bg is dark navy (#0a0f1c). Add a subtle white/gold ring or glow around the circular part so it doesn't blend in, OR use CSS to make it work on dark bg
- Also use `logo-main.png` (the big circular one) in the footer, centred above the footer content
- Keep the logo accessible: `alt="The Bar People"`, link to homepage

---

## TASK 2: Build the Quote Builder

This is THE killer feature. The whole point of the website. It needs to feel like a premium product — buttery smooth, zero jank, instant feedback.

### Route: `/quote`

### UX Flow — 6 Steps

**Step 1: Event Basics**
- Event type dropdown: Wedding, Corporate, Birthday, Garden Party, Christmas, Festival, Other
- Event date picker (calendar UI, block past dates)
- Event location: UK postcode input (validate format, we'll use postcodes.io API later for distance calc — for now just collect it)
- Venue type: Indoor / Outdoor / Both

**Step 2: Guest Count & Duration**
- Guest count slider OR number input (range: 10–500, step 10)
- Event duration selector: 3h, 4h, 5h, 6h, 7h, 8h, 10h, 12h
- Visual indicator showing recommended bar size based on guests

**Step 3: Service Type**
- Cards (not a boring dropdown) for each service:
  - **All Inclusive** — "Everything included. Bar, staff, drinks, glassware. Our most popular." Tag: MOST POPULAR
  - **Cash Bar** — "Guests pay for their drinks. You provide the setup."
  - **Dry Hire** — "Bar equipment only. You supply the drinks and staff."
  - **Staff Only** — "Professional bartenders for your existing bar."
- Each card shows a starting price that updates based on guest count from Step 2
- Single selection, card highlights gold when selected

**Step 4: Bar Selection**
- Only show if service type includes a bar (not Staff Only)
- Visual cards for each bar with placeholder images:
  - Shimmer Bar (5FT) — up to 50 guests — from £295
  - Classic Cocktail Bar (10FT) — up to 100 guests — from £395
  - Horseshoe Bar (15FT) — up to 150 guests — from £595
  - Large Horseshoe (35FT) — up to 250 guests — from £895
  - Island Bar (40FT) — 250+ guests — from £1,195
- Auto-recommend based on guest count (highlight "Recommended for your event")
- Show a warning if they pick a bar too small for their guest count

**Step 5: Extras & Add-Ons**
- Toggle/checkbox cards for add-ons:
  - Cocktail Menu — £5/guest
  - Glassware Upgrade (Premium Crystal) — £150 flat
  - LED Bar Lighting — £200 flat
  - Bar Branding (Custom Panels) — £350 flat
  - Welcome Drinks — £4/guest
  - Late Night Extension — £150/hour (show +1h, +2h, +3h options)
  - Cocktail Masterclass (min 10 people) — £25/person
  - Mocktail Package — £3/guest
  - Extra Staff Member — £25/hour
- Each shows the calculated price based on their guest count/duration
- Running total visible at all times

**Step 6: Contact Details & Submit**
- Name, email, phone (all required)
- Company/organisation (optional)
- "Tell us about your event" textarea (optional)
- Terms checkbox
- Submit button

### Pricing Logic (ALL client-side for instant feedback)

**All Inclusive base pricing:**
| Guests | Base (4hrs) | Extra Hour |
|--------|------------|------------|
| 1-50 | £1,495 | £200 |
| 51-100 | £2,995 | £350 |
| 101-150 | £4,495 | £450 |
| 151-250 | £6,995 | £550 |

**Cash Bar base pricing:**
| Guests | Base (4hrs) | Extra Hour |
|--------|------------|------------|
| 1-50 | £695 | £100 |
| 51-100 | £1,295 | £175 |
| 101-150 | £1,995 | £250 |
| 151-250 | £3,495 | £350 |

**Dry Hire:** Bar cost only (from bar selection step)
**Staff Only:** £25/hr per bartender, recommended 1 per 60 guests

**Staff costs (included in All Inclusive, added separately for Cash Bar):**
- Mixologist: £30/hr (1 per 50 guests)
- Bartender: £25/hr (1 per 60 guests)
- Barback: £18/hr (1 per 100 guests)
- Event Manager: £35/hr (recommended for 100+ guests)

**Delivery zones (show as info, add to total):**
- 0-25 miles from London: Free
- 25-50 miles: £150
- 50-100 miles: £300
- 100+ miles: £500
(For now, don't calculate distance — just show "Delivery fee calculated based on location" and we'll add postcodes.io later)

**VAT:** Show prices ex-VAT with "plus VAT" note. Show VAT-inclusive total in summary.

### Quote Summary Panel

- Sticky sidebar on desktop, bottom sheet on mobile
- Shows live-updating breakdown:
  - Service type + base price
  - Bar selection + price
  - Staff breakdown
  - Each add-on selected + price
  - Subtotal
  - VAT (20%)
  - **Estimated Total**
- Animate price changes (count up/down)
- "This is an estimate. Final pricing confirmed after consultation."

### Technical Requirements

- **State management:** `useReducer` with a well-typed QuoteState
- **Validation:** Zod schemas for each step
- **Animations:** Framer Motion for step transitions (slide left/right), card selections, price updates
- **Progress bar:** Visual step indicator at top showing 1→6 progress
- **Navigation:** Back/Next buttons, can jump to completed steps via progress bar
- **Mobile:** Full-screen steps on mobile, swipe-friendly
- **Accessibility:** Keyboard navigable, focus management between steps, aria labels
- **No API calls yet:** All pricing is client-side. Quote submission just logs to console for now (we'll add Supabase + email in Stage 3)

### Design

- Same dark premium aesthetic as the rest of the site
- Gold (#c9956b) for selected states, CTAs, progress indicators
- Glass-morphism cards for options
- Subtle animations — nothing flashy, just polished
- The quote summary panel should feel like a receipt/invoice preview

---

## Git Workflow
- Branch: `stage-2/quote-builder`
- Conventional commits
- When complete: merge to `main` and push

## Quality
- TypeScript strict — every type defined, no shortcuts
- Lighthouse 90+
- Mobile-first
- Smooth 60fps animations
- The quote builder should feel like a premium SaaS product, not a web form
