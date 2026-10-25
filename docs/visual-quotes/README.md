# The Bar People — Website & Visual Quotes (prototype)

Branch: `claude/loving-mendel-to07v2` · first delivery, 25 Oct 2026 · **not live**

A homepage prototype in two parts, built only from The Bar People's own photos and logo:

1. **The opening film** — opens on the staff shirt with the real roundel (silver preview),
   then the first scroll sweeps across like the bartender's white sleeve and settles on the
   genuine white bar with the copper tray.
2. **Section Two: Build your party quote** — a visual, step-by-step quote builder with a
   branded, itemised quote that builds line by line.

Scenes 3–5 (services, real events, last drink & contact) are on a storyboard for review first.

## How to look at it

```bash
pnpm install
pnpm dev            # then open:
#   http://localhost:3000/concepts             the opening film + quote builder, as the homepage would flow
#   http://localhost:3000/concepts?shirt=real  same, with the roundel as stitched today
#   http://localhost:3000/concepts/storyboard  real photo → frame → new-still plan, scenes 1–5
pnpm test           # pricing engine tests (Node's built-in runner)
```

Screens for review are in [`review/`](review/).

`/concepts` is noindex, disallowed in `robots.txt`, not in the sitemap and not linked from the
live navigation.

## Safety: what this prototype does not do

- **No network sends.** The builder makes no requests at all. It never calls `/api/quote`, which
  creates real enquiries in anyOS. "Request my quote" only shows what would happen next.
- **No reference numbers allocated.** "Party no. 3033" is a labelled example. Nothing is reserved.
- **No WhatsApp sent.** The WhatsApp button only appears after an extra is chosen, and only opens
  WhatsApp when tapped. Nothing is sent until the guest presses send.
- **No payments, bookings, availability holds, platform reads or writes, image or video jobs,
  domain or deployment changes.**
- Choices are saved in the guest's own browser only. Contact details are never saved.

## Achieved

| Area | State |
|---|---|
| Live-site research | Logos confirmed byte-identical to the live site; live pages, prices and FAQs read; media library searched for originals. |
| Opening (scenes 1→2) | Built with real photos. Silver roundel shown as a **hand recolour of a real photo** (no AI), clearly labelled. Native scroll, plays backwards, still frames with reduced motion. |
| Storyboard | Scenes 1–5, each with real source photos, desktop and phone frames, new-still plan, status and transition. |
| Quote builder | 8 steps: party (date, postcode, guests, start/finish incl. after midnight) → bar (6 seeded layouts) → glasses → ice & storage → staff → drinks packages (optional) → extras → review & save/request. |
| Layout | Desktop: image and choices left, itemised quote right. Phone: image and question on top, total pinned below, full quote in a pull-up sheet. Checked at 375, 390, 430 and 1440px with no sideways scrolling. |
| Motion | Chosen bar/package image grows out of the tapped tile; new quote lines slide in with a brief brass wash. All reduced for reduced motion. |
| Access | Real form controls, keyboard and screen-reader friendly, focus moves to each new question, quote changes announced, browser Back/Forward move between steps, AA contrast. |
| Pricing engine | Whole pence only, 19 passing tests. Staff £28/person/hour + VAT on party time only. See [pricing-and-numbers.md](pricing-and-numbers.md). |
| Existing bugs fixed | Stylesheet import order made the dev server return 500 on every page. The brand fonts never loaded in production builds (the live preview fell back to a default serif); now self-hosted with `next/font`. |

## Pending — needs Jake

1. **Scene 1 photo.** Is the close-up shirt shot (two pornstar martinis, `cupplapornstarsmate.jpg`) the right opening? Its original file is needed; online it's 800px.
2. **Silver.** Is silver a new thread, or do some shirts already have it? One real photo shows light grey thread.
3. **New stills.** Only if scene 1 can't come straight from an original photo. OpenArt plan and live price in [opening-stills-plan.md](opening-stills-plan.md). No Bar People budget exists in OpenArt yet, so nothing has been spent.
4. **Originals.** Most photos online are 800–1024px. Full-size files make full-screen scenes sharp.
5. **Client brands** visible in some event photos: which can be featured?
6. **Real catalogue and prices.** Only the staff rate is authorised. Everything else shows "to confirm" until checked read-only against the live anyOS catalogue.
7. **Rules to confirm:** prep hour (suggested arrival is shown, not billed), clock-change nights, VAT rate and rounding, what each drinks package includes, and whether delivery is charged.
8. **WhatsApp:** the button uses the site's published link, which opens WhatsApp Business "The Bar People". Confirm it reaches Jake, or supply his direct WhatsApp.
9. **Party numbers from 3033:** design ready, not built. See [pricing-and-numbers.md](pricing-and-numbers.md).

## Files

| Path | What |
|---|---|
| `src/app/concepts/page.tsx` | `/concepts` page |
| `src/app/concepts/storyboard/page.tsx` | `/concepts/storyboard` page |
| `src/components/film/*` | Opening film, storyboard, frames, scene data |
| `src/components/visual-quote/*` | Quote builder UI |
| `src/lib/visual-quote/*` | Pricing engine, timing, seed catalogue, saved state, tests |
| `public/images/film/*` | Real photos from the live media library (see [photo-sources.md](photo-sources.md)) |
| `public/images/visual-quote/curved-mirror-sketch.svg` | Line illustration (no curved mirror photo exists yet) |
