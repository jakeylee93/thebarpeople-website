# New homepage (8 Nov 2026)

**Status:** first working prototype at **`/new`**. It is not live: noindex, blocked in `robots.txt`
and not linked from the live site. Nothing in it sends anything.

The earlier look (ivory/brass, serif headings, the scroll "film" on `/concepts`) is retired. Its
pricing engine (`src/lib/visual-quote/`) is reused.

## Jake's decisions (8 Nov)

1. **Start again, simple.** The page opens on a full-screen slider with an instant quote.
2. **Chosen look.** Desktop is concept C (the martini and pineapple photo). Phone is the three screens
   below, "exactly how I would like it to look".
3. **Headline.** "You bring the guests, we’ll bring the rest."
4. **Hero photo.**
   - Use OpenArt instead of hunting for originals: upscale it, perfect the pineapple, fill the martinis.
   - Upscale the other slides from the photos we already have.
5. **Header.**
   - Videos later: Jake will send clips. Images for now.
   - No left/right arrows.
6. **Under the hero.**
   1. A carousel of client logos, as high-res SVGs.
   2. A Christmas parties section.
   3. A gallery carousel. Tapping a photo opens it in a modal.
7. **One quote, "Build your package".** No All-inclusive / Dry hire split.
   - **Order:**
     1. Guests first, with a recommended bar size.
     2. The bar, shown as clean white bars.
     3. A colour. The bar can glow in different colours.
     4. Optionally, custom branding: "Your artwork here" on the bar, with a "Free artwork service" tooltip.
   - **Glassware and staff for everyone.** People who want drinks also choose glassware and staff ("yes, absolutely").

## What's built

| Section | What it does |
|---|---|
| Header | The logo plus Our bars, Gallery, About, Contact and **Build your package**. It turns into a dark glass bar on scroll. Phone: a full-screen menu. |
| Hero | Five photos crossfade with a slow push-in. A thin line under each photo fills as its timer, and a pause button sits beside the lines; there are no arrows. Headline, line, **Build your package**. Phone: the photo is on top with a white "Get an instant quote" sheet below. Ready for video slides (see below). |
| Client logos | An endless, slow strip in solid black. It pauses on hover and is a still row for reduced motion. |
| Christmas parties | A festive bar image, copy and a **Build your Christmas package** button. |
| Gallery | A swipeable strip of 28 real event photos. Tapping one opens a full-screen viewer: swipe, arrows and keys move between photos, and Esc closes it. Links to `/gallery`. |
| Footer | The headline, contacts (Jake, Kim), Instagram, Facebook, Privacy, Terms. |
| Build your package | See below. Opens over the page from any **Build your package** button (`#build`). |

### Build your package

**The 9 steps:**
1. **Guests.** A big counter with quick picks. It suggests a bar and the number of bartenders.
2. **Bar.** Six clean white bar renders. The recommended bar is pre-selected and badged.
3. **Colour.**
   - **Bar colour:** Classic white, or an LED glow in pink, purple, blue, aqua, green, amber, red or a colour cycle.
   - **Custom branded:** "Your artwork here" is drawn onto the bar's front panel in perspective. A glowing **Free artwork service** chip sits above it.
4. **Glassware.** Six common glasses plus four more, each with a counter and "One per guest".
5. **Ice.** Bagged ice and Igloo cool boxes. Leave both at zero and "we'll advise".
6. **Fridges.** Bar fridges.
7. **Staff.** Bartenders, the suggestion pre-filled, plus the party date and the times the bar opens and closes. The price shows live: 2 × 5h × £28 = £280 + VAT.
8. **Drinks.** "We'll bring our own", or one of the three draft drinks packages. A package includes the bar, staff, glassware and ice, so nothing is charged twice.
9. **Your quote.** Name, email, phone and postcode, then **Request my quote**. Prototype: "Preview only: nothing has been sent."

**Layout:**
- **Phone:** full screen. The bottom bar shows the running quote (tap it for the full quote) and **Next**.
- **Desktop:** a large panel, with the quote beside it. The quote also shows the chosen bar in its chosen colour.

**Behaviour:**
- **Navigation:** every step is in the URL (`#build/bar`, …), so the phone's Back gesture goes back a step.
- **Saved choices:** kept in this browser only. Never contact details or the postcode.

**Logic** is in `src/lib/new-home/package.ts`, with 12 tests in `package.test.ts` and `perspective.test.ts`.

### Rules used (all to confirm)

| Rule | Source |
|---|---|
| Recommended bar: up to 50 guests → 1.5m, up to 100 → 3m, up to 150 → 4.5m, more → full horseshoe | "Up to N guests" on the current site's bar cards |
| Suggested bartenders: one per 50–75 guests | The current site's FAQ |
| Bartenders £28 per person per hour + VAT, on the hours the bar is open | The authorised staff rate |
| Bar, LED lighting, custom branding, glassware, ice, fridges, delivery, drinks: **"To confirm"**, never £0 | No confirmed prices yet |
| LED colours offered | **Placeholder.** Which colours do the bars actually come in? |

## Images (all in `public/images/new-home/`)

| File | What it is |
|---|---|
| `hero-cocktails.jpg` | OpenArt 4K clean-up of the real martini/pineapple photo: fuller martinis, neater pineapple. |
| `hero-lawn.jpg`, `hero-balloons.jpg` | OpenArt 4K clean-ups of the real lawn and balloon bar photos, extended to 16:9. |
| `bars/*.webp` | OpenArt studio renders of each bar in the live site's sketches, with the real white-and-black finish. Cut out locally (ISNet and OpenCV). The front-panel corners are in `BAR_ART`. |
| `christmas.jpg` | An OpenArt festive scene built around the real white bar. A promo image, not a real event. |

Hero slides 3 and 5 are real photos used as they are (`film/shirt-pour.jpg`, `film/counter-copper.jpg`).

### Client logos (`public/images/clients/*.svg`)

Every logo is a real vector; none are traced. They were sanitised: no scripts, links, embedded images
or fixed sizes. The page shows them solid black.

| Logo | Source |
|---|---|
| O2, Sky | Simple Icons. Sky is the current rounded wordmark, newer than the PNG on the old site. |
| Salesforce, HPE | Wikimedia Commons. Salesforce's lettering is cut out of the cloud so it reads in one colour. |
| Boux Avenue | Wikipedia (non-free logo file) |
| Batiste | Batiste's own site, strapline removed |
| Bulb | bulb.co.uk header (via the Web Archive) |
| ITV2 | picons (TV logo collection) |
| Superdrug | seeklogo vector (third party) |

Not included:
- **Porsche:** only the crest was available, which is unreadable at strip size.
- **CRATE Brewery:** the site blocked downloads.

## Header video: ready for Jake's clips

Add a slide as `{ kind: 'video', src, poster, alt, focus }` in `src/components/new-home/data.ts`.
- **Clips:** short loops (about 8–12 s), MP4 (H.264), 1920×1080 or larger, no sound needed (they play muted).
- **Poster:** a still from the clip, shown while it loads.
- **Behaviour:** it plays only while showing, and stays still for reduced motion.

## Still open

1. **Client logos.** SVGs replace the PNGs as they arrive. Check each client is happy to be shown.
2. **Bars.** Names, sizes, guest numbers and colours for real, plus whether every bar can be branded or lit.
3. **Prices.** Bars, LED lighting, branding, glassware, ice, fridges, delivery and drinks packages.
4. **Free artwork service.** What's included, to word the tooltip and step note.
5. **Christmas copy and dates**, and whether to show the section only in season.
6. **Request my quote.** Where it should go on the live site (anyOS enquiry, email). Nothing is sent today.
7. **Header videos** from Jake.
8. **Switching `/new` to the homepage.** Removing anyOS live-edit (`edit.js`) for the homepage text, and the AnyVendor field map (`opening` / `quote_intro` were written for the old look).

## Mockups (round 1)

| Screen | Mockup | Jake's notes |
|---|---|---|
| Desktop home | [desktop-home.jpg](mockups/desktop-home.jpg) | Keep the look and the photo; new headline. |
| Phone home | [phone-home.jpg](mockups/phone-home.jpg) | "Exactly how I would like it to look." |
| Phone, choose bar | [phone-dry-hire-choose-bar.jpg](mockups/phone-dry-hire-choose-bar.jpg) | Loves the horseshoe bar card. |
| Phone, event | [phone-all-inclusive-event.jpg](mockups/phone-all-inclusive-event.jpg) | |

## OpenArt record

All of this is in the project "The Bar People — new homepage & instant quote concepts". The model is
GPT Image 2.6 Sunburst, image-to-image.

| Round | Jobs | Credits (list price) |
|---|---|---|
| 1 · mockups | A–F at 2K high: `qbknaCEvnZqUysmheuos`, `rhASTTjJU58Q00rO23r8`, `zwFiUiLLwUbBtkViozpb` (C), `jAceSQ0gaGqRAoFD62P6` (D), `ZEDHROR0YcvcwmsDkRYL` (E), `sniAvkCVw6rZBJ8v8Ra1` (F) | 231 (balance drop) |
| 2 · assets | Hero 4K high × 3 (62 each): `iBD1I1eLSQuKGPMkk8FW`, `QgKKZ1gONFvQkO60nJ5J`, `lMPI8eWU5eAl1N6l1WJk`. Bars 2K high × 6 (35 each): `fF6O20XzeL8LR9RIazbm`, `KXInyGP5cj4AzS4giXtN`, `eJdo0s27Yv0CYLz0yfVs`, `UzWa8u5Kio2wEuqWNG8a`, `Nn2M1vISVMv1qO8zoFaH`, `pMoBobGH57WxKNDVkVkb`. Christmas 2K high (35): `WhwO8mPpVENbIIfaEckJ` | 431 |

The total is about 662 credits. That's over the 500-credit cap set for round 1, and round 2 was
Jake's direct request. Set a new cap before any further rounds.

References uploaded to the project:
- the logo roundel;
- seven real photos;
- the five bar sketches from the live site.
