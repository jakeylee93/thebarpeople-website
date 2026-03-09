# STAGE 2C: Quote Builder Fixes

## Work on the existing codebase at /tmp/thebarpeople-website
## Branch: `stage-2c/quote-fixes`, merge to `main` when done, push to origin.

---

## FIX 1: Guest Count Editable Throughout

- Add a **persistent guest count display** at the top of every quote step (below the progress bar)
- Shows: "👥 100 guests" with a tap/click to edit (inline number input or modal)
- When guest count changes, ALL pricing recalculates instantly:
  - Service type base prices
  - Staff recommendations
  - Bar recommendations
  - Glassware recommendations
  - Per-guest add-on costs
  - Running total in summary panel
- Guest count should be prominent — it's the most important variable

## FIX 2: Move LED Circular Bars

**Remove from bar selection step (Step 4).** The LED Circular Bars are NOT bar types — they're equipment.

**Bar selection should ONLY contain:**
- Shimmer Bar (5FT) — up to 50 guests — from £295
- Classic Cocktail Bar (10FT) — up to 100 guests — from £395
- Horseshoe Bar (15FT) — up to 150 guests — from £595
- Large Horseshoe (35FT) — up to 250 guests — from £895
- Island Bar (40FT) — 250+ guests — from £1,195

**Move LED bars to Equipment & Extras step (Step 6):**
- Circular LED Bar (Full Circle) — £900
- Circular LED Bar (Half Circle) — £500

## FIX 3: Standard Drinks Menu

Add a **drinks menu section** to the quote builder. After service type selection, show what's included:

**Standard Package (included in All Inclusive base price):**
- House spirits (vodka, gin, rum, whisky)
- Standard mixers & soft drinks
- Beer & cider selection
- House wine (red, white, rosé)

Display this clearly as "What's Included" so customers know the value.

**Premium Upgrades (add-on pricing, selectable):**
- Champagne Service — £8/guest
- Premium Spirits Upgrade — £4/guest (Grey Goose, Hendricks, etc.)
- Craft Beer Selection — £3/guest
- Premium Wine Upgrade — £5/guest
- Signature Cocktail Menu — £5/guest (already exists as add-on, keep it)

These should appear as toggle cards in the Extras step with per-guest pricing that multiplies by guest count.

## FIX 4: Quote Summary Improvements

- Show staff breakdown clearly: "2 × Bartender (5hrs) = £250"
- Show drinks package: "Standard Package — Included" or "Premium Spirits Upgrade (100 guests) — £400"
- Every line item editable from the review step

---

## Technical Notes
- Update the QuoteState type to include drinks selections
- Update pricing engine in quote-pricing.ts
- Keep all existing functionality — just fix and extend
- pnpm for package management
- TypeScript strict throughout

## When Done
- Merge to main
- Push to origin (Vercel auto-deploys)
- Message Jake on Discord to let him know it's done
