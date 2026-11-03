# The Bar People × AnyVendor — website content handoff

Contract: **AnyVendor site content contract v1** (`anyvendor.site/v1`), as written in the AnyVendor
owner workspace on 3 Nov 2026 (`docs/backend/SITE-CONTENT-CONTRACT-v1.md`). That contract is
**source-only, not deployed**; slug `the-bar-people` is planned, pending the backend's tenancy migration.

Branch `claude/loving-mendel-to07v2`. Nothing here is live, and nothing in AnyVendor or anyOS has
been written to.

## The two files AnyVendor asks for

| File | What staff do with it |
|---|---|
| [`the-bar-people.manifest.json`](the-bar-people.manifest.json) | Load with `set_site_manifest`. 24 sections, 134 fields, about 32 KB (limit 200 KB). |
| [`the-bar-people.content.json`](the-bar-people.content.json) | Seed as draft v1, then publish v1. It is **exactly what the site shows today**, including the 15 strings anyOS live-edit currently serves. |

Both are generated from the code (`src/content/`) with `pnpm content:export`. The tests fail if either drifts from the code, or if the seed stops matching the pages.

## What Jake can edit (sections)

| Section key | Drives | Live today? |
|---|---|---|
| `business` | Name, registered name, company no., area, strapline, emails, phones, socials (footer, contact page, search) | Yes |
| `seo` | Site title, description, sharing title/text/image | Yes |
| `navigation` | Menu links and menu button | Yes |
| `home_hero` | Current homepage hero: three anyOS-edited lines, buttons, numbers, background photo | Yes |
| `opening` | New homepage opening (scene 1 → 2): words, both photos, their labels and framing | Prototype (`/concepts`) |
| `quote_intro`, `quote_steps` | Quote builder wording: heading, intro, small print, buttons, 8 questions and hints | Prototype (`/concepts`) |
| `services_intro`, `services` | Services intro and the five service cards/pages (no prices) | Yes |
| `bars_intro`, `bars` | Bars intro and the bar cards (no prices) | Yes |
| `testimonials_intro`, `testimonials` | Testimonials (with a "checked with the customer" tick) | Yes |
| `brands` | Client logos with a permission setting | Yes |
| `cta` | "Ready to build your perfect bar?" band | Yes |
| `event_types` | Six event pages | Yes |
| `gallery_page`, `gallery` | Gallery intro and photos with captions and categories | Yes |
| `about_page`, `contact_page`, `our_bars_page` | Those pages' words, photos, team and values | Yes |
| `privacy_page`, `terms_page` | Legal pages, section by section | Yes |
| `footer` | Column headings and company links | Yes |

Images are `{ src, alt }`. Framing and honesty labels are separate small fields next to the image
(`*_focus_desktop`, `*_focus_phone`, `*_note`), because v1 images carry only `src` and `alt`.

## Kept out of AnyVendor on purpose (anyOS / code)

- **Prices and the VAT rule**: service and bar card prices, the staff rate (£28/person/hour + VAT), package prices. The staff hint is written with a `{staff_rate}` placeholder, which the site fills from the catalogue.
- **The catalogue**: bar layouts, glasses, ice, stock, catalogue ids. These are reconciled read-only with anyOS later.
- **Availability, enquiries and quotes**: `/api/availability` and `/api/quote` → anyOS public-booking, plus the old quote builder and availability card.
- **Party numbers** (3033 sequence design, not built).
- **The WhatsApp contact.**
- **anyOS live-edit itself** (`edit.js`) stays loaded and untouched until the switchover below.

## The 17 anyOS live-edit keys

Mapped in `ANYOS_LIVE_EDIT_MAP` (`src/content/defaults.ts`). Each seed value is what anyOS serves today (read-only check, 3 Nov 2026).

| anyOS key | AnyVendor field | Seeded value | Note |
|---|---|---|---|
| `hero.eyebrow` | `home_hero.eyebrow` | Premium Mobile Bar Hire | same as code |
| `hero.title` | `home_hero.title` | **Unforgettable events!** | anyOS edit; code says "Unforgettable Events Since 2014" |
| `hero.subtitle` | `home_hero.subtitle` | **We bring the bar, the staff, the drinks, and the vibe. You just bring the gue** | ⚠ cut off mid-word in anyOS; code ends "…You just bring the guests." |
| `services.eyebrow` / `.title` / `.subtitle` | `services_intro.*` | as code | |
| `bars.eyebrow` / `.title` / `.subtitle` | `bars_intro.*` | as code | |
| `testimonials.eyebrow` / `.title` | `testimonials_intro.*` | as code | |
| `cta.eyebrow` / `.title` / `.subtitle` | `cta.*` | as code | |
| `footer.strapline` | `business.strapline` | as code | |
| `about.title` | `about_page.title` | About The Bar People | nothing saved in anyOS |
| `contact.title` | `contact_page.title` | Contact Us | nothing saved in anyOS |

## How the site reads AnyVendor (ready, switched off)

- `src/content/anyvendor.ts` — server-only, read-only.
  - **Published content:** `GET {ANYVENDOR_API_URL}/api/sites/{slug}/content`, cached 60s under the tag `anyvendor`.
  - **Drafts:** `?preview=<uuid>`, never cached.
  - **Checks:** schema, slug and mode, with a 4-second timeout.
  - **Fallback:** a 404, an error or an unexpected shape returns the bundled content, so the site never goes blank.
  - **No protection-bypass support, by design.**
- `src/content/index.ts` — `getSiteContent({ preview })` cleans what AnyVendor sends against this site's manifest. A field AnyVendor doesn't send keeps the bundled value. A required field left blank falls back.
- `src/app/api/revalidate/route.ts` — the optional publish webhook. It answers 404 until a per-site secret is set, then expires the `anyvendor` tag immediately.
- `next.config.ts` — allows images from AnyVendor's `website-media` bucket only.
- **Wired now:** `/concepts` (opening and quote builder) and the storyboard. Text and screenshots before and after are identical; the one exception is a storyboard frame that now shows the real intro instead of a paraphrase.
- **Not wired yet:** the current public pages still render from code. The seed is tested against them line by line, so they can't drift. They switch to AnyVendor together with removing `edit.js` (see questions).

## Access actually needed (none requested or set)

1. **A read host that doesn't need Vercel's protection bypass.** It must serve `GET /api/sites/the-bar-people/content` and `/manifest`. Published content is public by design, so this is AnyVendor's production or public API host. AnyVendor's testing origin stays protected, and its project-wide bypass secret is not wanted here.
2. **Server-only environment variables on the Bar People Vercel project:** `ANYVENDOR_API_URL` (that host) and `ANYVENDOR_SITE_SLUG=the-bar-people`.
3. **Optional, for instant refresh on publish:** a per-site `ANYVENDOR_REVALIDATE_SECRET` (at least 24 characters, shared out of band). AnyVendor staff then store the site URL and `/api/revalidate` URL with `set_site_kind`.
4. **The URL the dashboard's "Preview draft" button should open.** Today that would be this branch's `/concepts` preview, which itself requires a Vercel login.

## Questions that block the switchover (not the seed)

1. **Who owns the 17 strings after the switchover: AnyVendor or anyOS live-edit?** If AnyVendor, the site removes `edit.js` at the same moment the pages start reading AnyVendor, so two editors never fight.
2. **Seed the truncated hero subtitle exactly as anyOS serves it (current file), or the full sentence?**

## Small things noticed (not changed)

- About, Our Bars and the old Quote page titles render "… | The Bar People | The Bar People". Each page title includes the suffix and the layout template adds it again.
- Copy inherited from the earlier build makes claims Jake should check: "850+ events", "Trusted by Thousands", the five testimonials, gallery event names, "SIA-licensed security available", "APLH/Personal licence holders" and "Up to N guests". They're seeded as they are so nothing changes; AnyVendor is the place to correct them.
