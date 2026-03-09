# STAGE 1: Project Scaffolding & Infrastructure

## You are Bish. You're building The Bar People website.

**Repo:** jakeylee93/thebarpeople-website
**Branch:** Work on `stage-1/project-setup`, merge to `main` when done.

## Business Context
The Bar People are a London-based mobile bar hire company (est. 2014). They provide pop-up bars, bartenders, glassware, drinks packages for weddings, corporate events, parties, festivals. HQ in Leytonstone, London. Company Number: 12161824.

**Team:**
- Jake Lee — Corporate Event Manager | jake@thebarpeople.co.uk
- Kim Knight — Private Event Manager | kim@thebarpeople.co.uk  
- General: hello@thebarpeople.co.uk

## What to Build in Stage 1

### 1. Next.js Project Setup
- Next.js 14+ with App Router
- TypeScript strict mode (no `any`, no `@ts-ignore`)
- pnpm as package manager
- Tailwind CSS v4
- ESLint + Prettier configured
- Framer Motion installed

### 2. Sanity v3 CMS (Embedded Studio)
Set up Sanity v3 with embedded studio at `/studio`. Create ALL these schema document types:

**Content schemas:**
- `bar` — name, slug, images[], description, dimensions, capacity, basePrice, features[]
- `staffRole` — name, slug, description, hourlyRate, icon, recommendedRatio
- `glasswareType` — name, slug, image, description, pricePerUnit, category
- `drinkCategory` — name, slug (e.g. "included", "premium")
- `drink` — name, slug, category→ref, description, image, bottlePrice, isIncluded
- `addOn` — name, slug, description, pricingType (flat|per_guest|per_hour|per_unit), price, minQuantity
- `deliveryZone` — label, maxMiles, fee
- `pricingConfig` — singleton: base fees per service type/guest tier, VAT rate, travel zones, hourly uplift rates
- `availabilityDate` — date, status (available|limited|busy), note
- `servicePage` — title, slug, heroImage, heroVideo, description, features[], packages[]
- `eventTypePage` — title, slug, heroImage, description, features[], gallery[], relatedTestimonials[]
- `testimonial` — name, eventType, quote, rating, date, image, featured
- `teamMember` — name, role, bio, image, phone, email
- `galleryImage` — image, caption, eventType, date, featured
- `blogPost` — title, slug, author→ref, date, heroImage, body (portable text), categories[]
- `faqItem` — question, answer, category, sortOrder
- `siteSettings` — singleton: company info, social links, contact details, SEO defaults
- `submittedQuote` — all quote fields (see pricing section below)

### 3. Seed Data
Populate Sanity with realistic initial data:

**Bars:**
| Bar | Capacity | Base Price |
|-----|----------|-----------|
| Shimmer Bar (5FT) | Up to 50 guests | £295 |
| Classic Cocktail Bar (10FT) | Up to 100 guests | £395 |
| Horseshoe Bar (15FT) | Up to 150 guests | £595 |
| Large Horseshoe (35FT) | Up to 250 guests | £895 |
| Island Bar (40FT) | 250+ guests | £1,195 |

**Staff Roles:**
| Role | Rate | Ratio |
|------|------|-------|
| Mixologist | £30/hr | 1 per 50 guests |
| Bartender | £25/hr | 1 per 60 guests |
| Barback | £18/hr | 1 per 100 guests |
| Event Manager | £35/hr | 1 per event (recommended 100+) |

**Pricing Config (All Inclusive):**
- 1-50 guests: base £1,495 (4 hrs) + £200/extra hr
- 51-100 guests: base £2,995 (4 hrs) + £350/extra hr
- 101-150 guests: base £4,495 (4 hrs) + £450/extra hr
- 151-250 guests: base £6,995 (5 hrs) + £550/extra hr

**Delivery Zones:**
- 0-25 miles from London: Free
- 25-50 miles: £150
- 50-100 miles: £300
- 100+ miles: £500

**Add-Ons:**
- Cocktail Menu: per_guest, £5/guest
- Glassware Upgrade: flat, £150
- LED Bar Lighting: flat, £200
- Bar Branding: flat, £350
- Welcome Drinks: per_guest, £4/guest
- Late Night Extension: per_hour, £150/hr
- Cocktail Masterclass: per_guest (min 10), £25/person
- Mocktail Package: per_guest, £3/guest
- Extra Staff: per_hour, £25/hr

**Sample testimonials, FAQ items, and availability dates too.**

### 4. Environment & Config
- Configure `next.config.js` (images, redirects, headers)
- Set up env vars structure (.env.local.example):
  - NEXT_PUBLIC_SANITY_PROJECT_ID
  - NEXT_PUBLIC_SANITY_DATASET
  - SANITY_API_TOKEN
  - RESEND_API_KEY (placeholder for now)
  - ANTHROPIC_API_KEY (placeholder for now)
- Base global styles + font loading (Inter for body, plus a premium display font)
- Utility functions: `cn()` helper, `formatCurrency()`, `formatDate()`
- Framer Motion provider setup

### 5. Design Tokens
- **Colour palette:** Deep navy (#0a0f1c), Charcoal (#1a1a2e), Gold/Copper (#c9956b), Warm white (#faf8f5), Crisp white (#ffffff)
- **Typography:** Inter for body, plus Playfair Display or similar serif for headings
- **Dark theme primary** — this site should feel like walking into a premium cocktail bar

### 6. Git & Deploy
- Work on branch `stage-1/project-setup`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- When done, merge to `main`
- Push everything to GitHub

## Quality Bar
- Lighthouse 90+ ready (no bloat)
- TypeScript strict — proper typing throughout
- Mobile-first mindset from the start
- Production-grade, not a prototype

## Deliverable
Empty Next.js app that deploys cleanly. Sanity Studio accessible at `/studio` with all schemas defined and seed data populated. No visual pages yet — that's Stage 2.
