# STAGE 2B: Design Overhaul + Quote Builder V2

## You are Bish. Build on the existing codebase — do NOT start from scratch.

**Repo:** jakeylee93/thebarpeople-website (already has Stage 1 + Stage 2)
**Branch:** Work on `stage-2b/design-and-quote-v2`, merge to `main` when done.

---

## PART 1: DESIGN OVERHAUL

### Typography — Brand Refresh
- **REMOVE** Playfair Display + Inter everywhere
- **ADD** Young Serif (headings, display text) + DM Sans (body, UI, buttons) via `next/font/google`
- Apply consistently across ALL pages and components
- Young Serif for: h1, h2, h3, section headings, hero text, card titles
- DM Sans for: body, paragraphs, buttons, nav, form labels, small text

### Logo — Centred & Prominent
- Move logo to **centre of header**, significantly larger
- Use the **white version** of the logo (the `logo-header.png` but apply CSS `brightness(0) invert(1)` filter to make it white, OR use the white treatment already in the footer)
- Nav links split either side of logo, or stacked: logo on top, nav below
- Logo should blend seamlessly into the hero — no harsh horizontal line between nav and hero
- Make the transition between header and hero feel like one continuous section

### Hero — Image Crossfade Slider
- Replace static gradient with **crossfading background images**
- Use 4 high-quality Unsplash images: cocktail close-ups, bar setups, event crowds, bartender action
- Smooth CSS crossfade transitions (6 second intervals, 1.5s fade)
- Semi-transparent dark gradient overlay on images for text readability
- Keep the existing hero text and CTAs on top

### Brighter Design — Alternating Sections
- **White/cream (#faf8f5) background sections** alternating with dark navy sections
- Suggested layout:
  - Hero → DARK (navy + image slider)
  - Stats Bar → DARK (navy, gold numbers)
  - Services → BRIGHT (white/cream bg, dark text, dark cards with gold accents)
  - Our Bars → DARK (navy, glass-morphism cards)
  - Testimonials → BRIGHT (white/cream bg)
  - Trusted By / Brand Strip → DARK
  - CTA → DARK (navy + gold)
  - Footer → DARK
- Ensure text colours flip appropriately (dark text on light bg, light text on dark bg)
- Gold accent (#c9956b) stays consistent throughout both light and dark sections

---

## PART 2: QUOTE BUILDER V2

### Updated Step Flow (8 steps, was 6)

**Step 1: Event Basics** (existing — keep, just restyle with new fonts)
- Event type, date picker, postcode, venue type

**Step 2: Guests & Duration** (existing — keep, restyle)
- Guest count slider, duration selector, bar recommendation

**Step 3: Service Type** (existing — keep, restyle)
- All Inclusive / Cash Bar / Dry Hire / Staff Only cards with live pricing

**Step 4: Bar Selection** (existing — keep, restyle)
- Bar cards with recommendations. Skip for Staff Only.

**Step 5: Glassware Selection** ← NEW STEP
- Grid of glass type cards, each with:
  - Glass name
  - Unit price
  - Crate size info
  - Quantity stepper that works in CRATE multiples
  - Live calculation: "3 crates × 8 = 24 glasses — £20.40"

Glass types and pricing:
```
Martini Glass      | £0.85/glass | Crate of 8
Whisky Tumbler     | £0.60/glass | Crate of 24
Champagne Flute    | £0.60/glass | Crate of 35
Premium Flute      | £0.80/glass | Crate of 35
Wine Glass         | £0.60/glass | Crate of 24
Large Wine Glass   | £0.70/glass | Crate of 20
Margarita Glass    | £0.85/glass | Crate of 8
Gin Bowl           | £0.85/glass | Crate of 8
Shot Glasses       | £0.30/glass | Crate of 25
```

- Stepper increments by 1 crate at a time
- Display: "2 crates (16 glasses) — £13.60"
- Auto-recommend quantities based on guest count, e.g.:
  - 100 guests → suggest 4 crates wine (96), 2 crates flute (70), 2 crates tumbler (48)
- "Recommended for your event" suggestions shown but user can override

**Step 6: Equipment & Extras** ← MERGED step (was just Extras)
- **Equipment section** at top:
  - Double Back Bar Fridge — £125 each (quantity stepper)
  - Tall Wine Fridge — £240 each (quantity stepper)
  - Circular LED Bar (Full Circle) — £900 (toggle)
  - Circular LED Bar (Half Circle) — £500 (toggle)

- **Add-ons section** below (existing add-ons, keep them):
  - Cocktail Menu — £5/guest
  - Glassware Upgrade (Premium Crystal) — £150 flat
  - LED Bar Lighting — £200 flat
  - Bar Branding (Custom Panels) — £350 flat
  - Welcome Drinks — £4/guest
  - Late Night Extension — £150/hour
  - Cocktail Masterclass (min 10) — £25/person
  - Mocktail Package — £3/guest
  - Extra Staff Member — £25/hour

**Step 7: Contact Details** (existing — keep, restyle)
- Name, email, phone, company, notes, terms checkbox

**Step 8: Review & Confirm** ← NEW STEP
- Full **invoice-style breakdown** table:
  - Headers: ITEM | DESCRIPTION | QTY | UNIT PRICE | TOTAL
  - Every line item listed:
    - Service type + base price
    - Bar selection
    - Staff (show: "4 × Bartender @ £25/hr × 5hrs")
    - Each glassware type ordered (show crate qty + total glasses)
    - Each equipment item
    - Each add-on
  - Subtotal
  - VAT (20%)
  - **ESTIMATED TOTAL**
- **Editable quantities** — user can tap any quantity in the review and adjust it, total recalculates live
- "Edit" links next to each section that jump back to that step
- **"Confirm & Send Quote"** gold button at bottom
- On submit: show animated success screen:
  - "Your quote has been sent! ✉️"
  - "We'll be in touch within 24 hours."
  - "A copy has been sent to [their email]"
  - Show Jake's contact: "Questions? Call Jake on 07557 402200"
  - "Download PDF" button (stub for now — just console.log)
- Quote data logged to console (Supabase + email integration comes later)

### "View Quote" Button
- Replace the current collapsible summary panel
- Show a **sticky bottom bar on mobile** with: "View Your Quote — £X,XXX" (gold button)
- Tapping opens a **slide-up modal/sheet** with the full itemised breakdown
- On desktop: keep as a sticky sidebar but make it more prominent with a clear "Your Quote" heading and better styling
- Price in the button animates when total changes

### Fix Progress Bar
- Update to show 8 steps (currently broken showing "Step 7 of 6")
- Gold filled dots for completed, current step highlighted, grey for upcoming

---

## PART 3: GENERAL FIXES

- Ensure ALL pages (service pages, event pages, etc.) use the new fonts
- Update the `ComingSoonShell` component with new fonts
- Footer: keep the large circular logo (logo-main.png) centred above footer content
- Make sure mobile nav uses new fonts
- Test that all 25 routes still build cleanly

---

## Technical Notes
- Update `tailwind.config` or `globals.css` with new font families
- Add Young Serif + DM Sans via `next/font/google` in layout.tsx
- Quote builder state: extend the existing `useReducer` state with glassware + equipment types
- Extend Zod validation schemas for new steps
- Keep all Framer Motion animations, just apply to new steps too
- All prices hardcoded for now (will move to Supabase/CMS later)

## Git Workflow
- Branch: `stage-2b/design-and-quote-v2`
- Conventional commits
- When complete: merge to `main` and push

## Quality
- TypeScript strict — NO `any`, NO `@ts-ignore`
- Build must be clean (no errors, no warnings)
- Lighthouse 90+
- Mobile-first, thumb-friendly
- 60fps animations
