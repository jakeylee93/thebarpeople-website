# STAGE 1: The Bar People — Project Setup + Homepage

## You are Bish. Build this.

**Repo:** jakeylee93/thebarpeople-website  
**Deploy:** Vercel (auto-deploy from main)  
**Work on branch:** `stage-1/setup-and-homepage` → merge to `main` when done

---

## Business Context

The Bar People are Jake's London-based mobile bar hire company (est. 2014, Company No. 12161824). Pop-up bars, professional bartenders, glassware, drinks packages for weddings, corporate events, parties, festivals. HQ in Leytonstone, London. Nationwide service.

**Team:**
- Jake Lee — Corporate Event Manager | +44 7557 402200 | jake@thebarpeople.co.uk
- Kim Knight — Private Event Manager | +44 7724 601256 | kim@thebarpeople.co.uk
- General: hello@thebarpeople.co.uk

**Current site:** thebarpeople.co.uk (WordPress, slow, dated, booking redirects to external 17hats.com form)

**Vision:** Transform into a smart event planning platform. Core message: **"Build your perfect bar in 60 seconds."** The quote builder is the centrepiece — but that's Stage 2. This stage is about getting the foundation and homepage looking incredible.

---

## Tech Stack (FINAL — no Sanity, no Shopify)

```
Framework:      Next.js 14+ (App Router, server components)
Language:       TypeScript (strict mode, no `any`, no `@ts-ignore`)
Package Mgr:    pnpm
Hosting:        Vercel
Styling:        Tailwind CSS v4
Animations:     Framer Motion
Database:       Supabase (pricing config, quotes, availability, content)
Email:          Resend (later — not this stage)
Forms:          React Hook Form + Zod validation
Fonts:          Inter (body) + Playfair Display (headings)
```

**We do NOT use:** Sanity, Shopify, Hotjar, or any other external CMS. Supabase is the single backend.

---

## Design Direction

**Dark, luxurious — speakeasy meets modern tech.** Think walking into a premium cocktail bar, not a bright corporate brochure.

### Colour Palette
- **Background:** Deep navy `#0a0f1c` / Charcoal `#1a1a2e`
- **Accent:** Gold/Copper `#c9956b`
- **Text:** Warm white `#faf8f5` / Crisp white `#ffffff`
- **Subtle borders/cards:** `rgba(255,255,255,0.05)` to `rgba(255,255,255,0.1)`

### Typography
- **Headings:** Playfair Display (serif, elegant)
- **Body:** Inter (clean, modern)
- **Style:** Confident, generous spacing, premium feel

### Photography Style
Use high-quality Unsplash images for now (real photos come later):
- Amber-lit cocktail close-ups
- Stylish bar setups
- Happy crowds at events
- Professional bartenders in action

---

## What to Build

### 1. Project Scaffolding
- Next.js 14+ with App Router, TypeScript strict, pnpm
- Tailwind CSS v4 configured with custom colour palette above
- ESLint + Prettier
- Framer Motion installed + provider
- Font loading (Inter + Playfair Display via next/font)
- Global styles with the dark theme
- Utility functions: `cn()` (clsx+twMerge), `formatCurrency()`, `formatDate()`
- `.env.local.example` with placeholder vars:
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  RESEND_API_KEY=
  ```

### 2. Reusable Components
Build these as a component library:
- `<Section />` — consistent section wrapper (max-w, padding, optional dark/light bg)
- `<SectionHeading />` — eyebrow text + heading + optional subtitle
- `<Button />` — primary (gold), secondary (outline), ghost variants, with hover animations
- `<Card />` — glass-morphism dark card with subtle border
- `<Badge />` — for "Popular", "Recommended", "New" labels
- `<TestimonialCard />` — quote, name, event type, star rating
- `<AnimatedCounter />` — number count-up animation (for stats)
- `<LogoStrip />` — scrolling brand logos (reuse the pattern from TL Executive)

### 3. Layout
- `<Header />` — Logo (text "THE BAR PEOPLE" for now, real logo later), nav links, **"Build Your Quote" CTA button** (gold accent, prominent), mobile hamburger menu
- `<Footer />` — Contact details (Jake, Kim, hello@), phone numbers (clickable), social links, service links, event type links, company info (est. 2014), newsletter signup field
- `<MobileNav />` — slide-out mobile navigation, smooth animation

### 4. Homepage Sections (in order)

**Hero**
- Full-viewport dark section
- Background: Unsplash cocktail/bar image with dark overlay (or CSS gradient for now, video later)
- Headline: **"Build Your Perfect Bar in 60 Seconds"** (Playfair Display, large)
- Subtitle: "Pop-up bars, professional bartenders, and unforgettable experiences for any event. Get an instant quote."
- Two CTAs: "Build Your Quote" (gold, primary) + "View Our Work" (outline, secondary)
- Subtle scroll indicator animation at bottom

**Stats Bar**
- Horizontal strip with animated counters:
  - "10+" Years of Events
  - "850+" Events Delivered
  - "5★" Average Rating
  - "Nationwide" Coverage
- Numbers animate counting up when scrolled into view

**Services Overview**
- Section heading: "What We Do"
- 5 cards (glass-morphism dark cards with icons and hover effects):
  1. All Inclusive Hire — "Everything included. Drinks, staff, bar, glassware. From £29.90/head"
  2. Cash Bar Hire — "Guests pay for drinks, you pay for the setup"
  3. Dry Hire — "Bar equipment rental. You bring the drinks"
  4. Staff Hire — "Professional bartenders for your own bar"
  5. Event Management — "Full event coordination from start to finish"
- Each card links to `/services/[slug]` (page shells, no content yet)

**Our Bars Showcase**
- Section heading: "Our Bars"
- Horizontal scrolling carousel showing bar types:
  - Shimmer Bar (5FT) — "Intimate events, up to 50 guests — from £295"
  - Classic Cocktail Bar (10FT) — "Medium events, up to 100 guests — from £395"
  - Horseshoe Bar (15FT) — "Larger events, up to 150 guests — from £595"
  - Large Horseshoe (35FT) — "Major events, up to 250 guests — from £895"
  - Island Bar (40FT) — "Showstopper events, 250+ guests — from £1,195"
- Each with an Unsplash placeholder image, smooth scroll, peek at next card
- "Any colour. Indoor or outdoor. Fully modular."

**Testimonials**
- Section heading: "What Our Clients Say"
- Auto-scrolling carousel of testimonial cards:
  1. "Jake and his team were incredible at our wedding. The cocktail bar was the highlight of the evening!" — Sarah & Tom, Wedding, ★★★★★
  2. "Professional, punctual, and the cocktails were outstanding. Our corporate event was elevated to another level." — David Chen, Corporate Event, ★★★★★
  3. "We've used The Bar People three years running for our Christmas party. Wouldn't go anywhere else." — Rachel Moore, Christmas Party, ★★★★★
  4. "The team handled our 200-guest charity gala flawlessly. Vish and Monique were stars." — James Wright, Charity Gala, ★★★★★
  5. "From the initial quote to the event itself, everything was seamless. The Porsche team loved it." — Mark Stevens, Corporate Launch, ★★★★★

**Trusted By / Brand Strip**
- "As Seen At" or "Trusted By" heading
- Scrolling logo strip (use text-based logos for now, same pattern as TL Executive Cars)
- Companies: Porsche, Bitcoin Conference, various corporate clients

**CTA Section**
- Full-width dark section with gold accent
- "Ready to Build Your Perfect Bar?"
- "Get a quote in 60 seconds. No commitment, no hassle."
- Big gold "Start Your Quote" button
- Or: "Prefer to chat? Call Jake on 07557 402200"

### 5. Page Shells
Create route files with basic metadata for all pages (no content yet, just proper layout + "Coming Soon" or similar):
- `/services` + `/services/all-inclusive`, `/services/cash-bar`, `/services/dry-hire`, `/services/staff-hire`, `/services/event-management`
- `/events` + `/events/weddings`, `/events/corporate`, `/events/birthday-parties`, `/events/garden-parties`, `/events/festivals`, `/events/christmas`
- `/our-bars`
- `/gallery`
- `/about`
- `/reviews`
- `/blog`
- `/quote` (will hold standalone quote builder later)
- `/contact`
- `/faq`

Each page: proper `<title>`, meta description, OG tags.

### 6. Responsive Design
Test at these breakpoints:
- 375px (iPhone SE)
- 390px (iPhone 14)
- 428px (iPhone 14 Plus)
- 768px (iPad)
- 1024px (iPad landscape)
- 1440px (Desktop)

Mobile-first. Thumb-friendly. No tiny tap targets. The majority of event-planning traffic is mobile.

---

## Git Workflow
- Branch: `stage-1/setup-and-homepage`
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- When complete: merge to `main` and push

## Quality
- Lighthouse 90+ ready (no bloat, optimised images, proper fonts)
- TypeScript strict throughout
- Accessible (WCAG 2.1 AA, keyboard navigable, proper contrast)
- Production-grade — this is a real business website

## Deliverable
Premium-looking homepage deployed to Vercel. Dark cocktail-bar aesthetic. All sections above built and responsive. Navigation working. All page routes created. Ready for the quote builder in Stage 2.
