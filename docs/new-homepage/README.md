# New homepage and quote builder

**Status (10 Nov 2026):** working prototype at **`/new`**. It is not live: noindex, blocked in
`robots.txt` and not linked from the live site. **Nothing in it sends anything**: no enquiry, email,
WhatsApp, booking or payment. A quote here uses no production quote number.

| Page | What it is |
|---|---|
| `/new` | The homepage, one screen at a time. |
| `/new#build` | "Build your package": the quote builder, opened over the homepage. |
| `/new/quote` | The quote builder on its own (for testing). |
| `/new/bars` | Every bar drawing, plain and branded, on one sheet (for checking). |

The earlier look (ivory and brass, the scroll "film" on `/concepts`) is retired.

## The homepage, section by section

Each section is one screen. The page snaps from one to the next on phones and desktop (wheel,
swipe, keys, or the dots at the side on desktop).

| # | Section | What it does |
|---|---|---|
| 1 | Hero | The martini and pineapple photo, then a 19 second film, then four more photos. No arrows; a thin line shows the time left, with a pause button. Headline and **Build your package**. |
| 2 | Christmas | A full-screen advert with falling snow. "Christmas parties, sorted." and **Build your Christmas package**. |
| 3 | Corporate events | "A bar built around your brand." A real branded bar photo, the branded bar drawing, and the client logos. |
| 4 | Weddings | "The bar for your big day." |
| 5 | Birthdays and private parties | "Your party, our bar." |
| 6 | See us in action | A tall video card: five clips that fade into each other. |
| 7 | The marquee package | Marquee, bar, bartenders, drinks, glassware, ice and fridges in one quote. |
| 8 | Gallery | Real event photos. Tap one to open it. |
| 9 | Footer | Headline, **Build your package**, phone numbers and links. |

"How it works" (on Corporate, Weddings and Parties) opens one short pop-up: three steps and what
you can include. The words for every section are in `src/components/new-home/data.ts`.

## Jake's decisions

**8 Nov.** Start again, simple. Desktop look C (the martini and pineapple photo); the phone screens
"exactly how I would like it to look". Headline: "You bring the guests, we’ll bring the rest." No
left/right arrows on the header. One quote, "Build your package". Client logos as SVGs. A gallery
that opens in a pop-up.

**10 Nov.** His full brief is the source for everything below:

1. **Bars.** Drawn in the styles we really have (mirror, shimmer and so on), not glowing colours.
   All facing the same way, vector, central, consistent. The curved bar follows the Grumpy Joe's
   curved bars. Branding shows on every panel. Add an L-shape and a full island bar.
2. **Real prices**, so the builder makes an actual quote as you go (table below).
3. **All-inclusive first**, priced by the drinks, with a menu people can edit and search.
4. **Staff** are paid from 30 minutes before the bar opens to 30 minutes after it closes. Never
   fewer than two.
5. **Set-up** the day before or on the day; collection one to three days after.
6. **The quote** downloads as a PDF with our logo, after an email address. Leads go to AnyVendor
   later (Jake is connecting that).
7. **The site**: one section at a time with snapping, on phones too. Christmas as a classy advert
   with snow. Sections for corporate, weddings and birthdays. Video in the header. Not a long,
   confusing page. No emojis.
8. **Marquees**: a package section, and "add a marquee" in the quote. Furniture, crockery and the
   rest only with a marquee. Prices later.

## Prices and rules in the builder

Every price is plus VAT. The numbers live in one file, `src/lib/quote/prices.ts`, and the rules are
tested in `src/lib/quote/quote.test.ts` (run `pnpm test`).

| Item | Price | From |
|---|---|---|
| Bartender | £28 an hour | Jake |
| 1.5m (5ft) bar | £215 | Jake |
| 3m bar | £325 | Jake |
| Each further 1.5m section | + £100 (£425, £525, £625, £725) | Jake |
| Corner piece | £100 | Jake |
| Horseshoe bar (six sections, two corners) | £925 | Jake's rule: £725 + £200 |
| Full round bar, mirror or LED | £1,200 | Jake |
| L-shape bar | sections + one £100 corner | worked out from Jake's rule |
| Island bar (eight sections, four corners) | £1,325 | worked out from Jake's rule |
| Curved (half-circle) bar | To confirm | no price given |
| Custom branding | To confirm | no price given |
| Glassware | 80p a glass | Jake |
| Igloo of ice | £75 | Jake |
| Single bar fridge | £60 | Jake |
| Double back-bar fridge | £140 | Jake |
| Delivery, set-up and collection | £95, once | Jake |
| VAT | 20% on every line | assumed |

### All-inclusive drinks (per guest)

| Bar open for | Per guest |
|---|---|
| Under 5 hours | £7.50 an hour (4 hours £30; 4½ hours £33.75) |
| 5 hours | £35 |
| Each extra hour | + £5 (6 hours £40, 7 hours £45, 8 hours £50) |

The standard menu comes ticked. Unticking a drink never changes the price.

| Drink | Terms |
|---|---|
| Peroni, Corona | Standard |
| Desperados | + £3 a guest |
| Estrella Galicia | + £3 a guest |
| Alhambra Reserva | + £5 a guest |
| Villa Vito Pinot Grigio | Standard white |
| House red, house rosé | Standard. **Labels not chosen yet** (Majestic has no Villa Vito red or rosé). |
| Aqualta Prosecco | Standard |
| Absolut | Standard |
| Absolut Vanilia | Free to add |
| Grey Goose | + £3 a guest |
| Bombay Sapphire | Standard |
| Hendrick's | + £3 a guest |
| Bacardí | Standard |
| Sailor Jerry | Free to add |
| Kraken | Price to confirm ("more money", amount not given) |
| Kentucky bourbon | Standard |
| Jack Daniel's | Free to add |
| Soft drinks and mixers | Standard |
| Any drink a guest types that isn't listed | Added as a request, price to confirm |

**Champagne is by the bottle:** Majestic's single-bottle price plus 25%, to the nearest pound.

| Champagne | Majestic, 10 Nov 2026 | Our price a bottle |
|---|---|---|
| Veuve Clicquot Yellow Label | £56 | £70 |
| Moët & Chandon Impérial | £49 | £61 |
| Dom Pérignon (2017) | £215 | £269 |

Majestic's own site blocks automated reading, so the prices were read from a price-comparison
listing of Majestic and checked against Majestic's pages in a search index. Majestic's "Mix Six"
prices are lower (£46, £40, £210) but move with promotions, so the steadier single-bottle price is
used. To change a price, edit the Majestic figure in `src/lib/quote/drinks.ts`.

### Staff

- Recommended: one, plus one for every 25 guests. 50 guests is 3, 100 is 5, 150 is 7, 200 is 9.
- Never fewer than two. The guest can choose more or fewer (down to two).
- Paid from arrival to finish: at least 30 minutes before the bar opens (the guest can pick 60, 90
  or 120) until 30 minutes after it closes. A bar open 6pm to midnight is 7 hours each.
- Any quote with a bar or drinks has bartenders in it, however the guest gets to the end. Until
  they choose a number, the recommended team is quoted.
- Once a guest chooses their own bar size or number of bartenders, changing the guest count leaves
  it alone. Choosing our recommendation again lets it follow the guest count.

### Bars

- Recommended size: one 1.5m section for every 25 guests (50 guests is a 3m bar). From about 150
  guests the horseshoe is suggested; above 200, the island. The guest can pick anything.
- Finishes, from our own photos: white gloss with black edging, mirror, shimmer (sequin wall), the
  LOVE bar (3m only) and LED (curved and round bars only).

### Set-up and collection

- Set-up time needed before the bar opens: 2 hours up to 50 guests, 4 hours up to 100, 6 hours above.
- The guest picks set-up the day before or on the day. On the day is not offered if it would mean
  starting before 7am (our assumption).
- Collection: the day after, or two or three days after.
- The date must be from tomorrow onwards. Sooner than that, the page asks them to call.
- On the two nights a year the clocks change, drinks and staff are charged on the real hours (a
  7pm to 2am bar is 8 hours in October and 6 in March), and the quote says so in words.

## Assumptions for Jake to confirm

1. **What £35 a head covers.** The builder adds the bar, staff, glassware, ice and delivery on top
   of the drinks price. The old site's all-in packages included those.
2. Under 5 hours is charged pro rata in half hours.
3. Staff above 100 guests follow the same pattern (150 is 7, 200 is 9, 250 is 11).
4. Which bar is recommended for each guest number.
5. L-shape and island prices, worked out from the section and corner prices.
6. The curved half-circle bar and custom branding have no price yet.
7. Mirror and shimmer are offered on every straight, L, horseshoe and island bar. We only have
   photos of them on a single 1.5m bar.
8. Kraken's extra, the house red and rosé labels, and which bourbon is the house Kentucky.
9. VAT at 20% on everything.
10. On-the-day set-up not offered before 7am.
11. Champagne from Majestic's single-bottle price, with VAT then added on top like every other line.
12. There is no shortest or longest hire. A one-hour bar is £7.50 a guest.
13. Clock-change nights are charged on real hours, not clock hours.
14. Upgrades add up: Desperados, Estrella Galicia and Alhambra together add £11 a guest.
15. Delivery is £95 wherever the event is. The postcode is asked for but doesn't change the price.
16. Bringing your own drinks has no corkage or service charge.
17. VAT rounds to the nearest penny (only matters once a price isn't a multiple of 5p).

## The quote builder

Ten short steps: event, bar, style, drinks, glassware, ice and fridges, bartenders, delivery,
marquee, your quote. The quote builds down the side (desktop) or in the bar at the bottom (phone).

- **Download PDF** asks for an email first, then makes the PDF in the browser (`src/lib/quote/pdf.ts`,
  with the logo).
- **Email it to me** and the email given for the PDF are **not sent anywhere yet**. The one place to
  connect AnyVendor is `src/lib/quote/leads.ts` (`LEADS_CONNECTED`). Until then the screen says so.
- **Copy link** makes a link that reopens the same quote. The postcode is never put in a link.
- Choices are saved in the browser so a guest can come back. No account, no server.
- Opening someone's shared link replaces the quote saved in that browser.
- A saved or shared quote that no longer fits (an old link, a date that has passed, a drink we no
  longer list) loses only that one answer, never the whole quote.

### Marquee

"Add a marquee" opens the marquee partner's range in 14 groups (109 items): marquees (clear span,
Chinese hat, catering), walls and doors, linings and ceilings (including the starlit ceiling),
flooring, dance floors, lighting, heating and power, chairs, tables and sofas, linen, crockery,
cutlery, tableware, catering equipment and staging.

- The homepage's marquee button starts the quote at step 1 with the marquee switched on, so the
  package has the bar, team and drinks in it too. A marquee is never added by itself.
- Everything except the marquee itself is locked until a marquee is chosen.
- **Every marquee price reads "To confirm".** Nothing is shown as £0. The partner's name is not shown.
- The range was read from the partner's website on 10 Nov 2026. Their site does not publish marquee
  sizes or prices. To add prices, fill `price` in `src/lib/quote/marquee.ts`.
- Marquee pictures are our own line drawings. The partner's product photos are not used (no
  permission on file).

## Bar drawings

`src/components/new-home/package/BarDiagram.tsx` draws every bar from its real measurements
(`src/lib/quote/diagram.ts`): 1.5m sections, 0.6m deep, 1.1m high, the same camera for every bar.
Branded bars show the artwork placeholder on every panel that faces you, corners included. The
words "Your artwork" appear only when they are big enough to read; otherwise the picture icon
stands alone. Every bar is drawn from the same camera, so the far side of an island or horseshoe
bar is not seen.

- Curved and round bars follow the Grumpy Joe's sectional system: eight 45° curved sections make a
  4m circle. LED is an opal lit panel on a black plinth with black posts.
- Every bar has the white gloss top with the black edge (Jake, 10 Nov: no black tops).
- Corner pieces are drawn 0.9m across, from the business's own sketches and the 35ft horseshoe
  (Jake asked for bigger corners). One photo of the real bar suggests nearer 0.5m; it is one
  number in `src/lib/quote/diagram.ts` (`BAR_DIMS.corner`). L-shapes go from 2 to 10 sections,
  split evenly either side of the corner.
- The camera is turned 26° so side runs and corners show clearly.
- Mirror shows a reflection of a garden (made from the business's own lawn photo,
  `public/images/new-home/mirror-surroundings.jpg`), shifted by the way each panel faces, so it
  jumps at every joint like a real mirror. The LOVE letters use the same reflection.
- Shimmer is a sequin wall: round silver discs about 3.75cm apart on black, each catching the
  light differently (`src/components/new-home/package/finishes.tsx`).
- The Style step shows the customer's own bar in each finish, drawn the same way. The earlier
  OpenArt finish photos are no longer used.

## Video

Instagram and Facebook need a login, so the clips come from The Bar People's own promo films in the
current website's media library (1920×818 and 1920×1080). Eight shots were chosen, slowed slightly
and joined with soft fades.

| File (`public/videos/new-home/`) | Use |
|---|---|
| `hero-reel.mp4` (1600 wide, 19s), `hero-reel.jpg` | Header film on desktop. Opens on the bartender raising two cocktails. |
| `hero-reel-phone.mp4` (upright 4:5) | Header film on phones, each shot cropped around its subject. |
| `card-*.mp4` (720×1280) | "See us in action" card: five upright clips that fade into each other. |

No sound. The films play only while on screen, can be paused, and stay still for reduced motion.
Better originals from Jake's phone or Instagram can replace any file one for one.

## Images

| File | What it is |
|---|---|
| `new-home/hero-cocktails.jpg` | OpenArt 4K clean-up of the real martini and pineapple photo. |
| `new-home/hero-lawn.jpg`, `hero-balloons.jpg` | OpenArt 4K clean-ups of real bar photos. |
| `new-home/christmas.jpg` | An OpenArt festive scene built around the real white bar. A promo image, not a real event. |
| `new-home/mirror-surroundings.jpg` | What the mirror bars reflect: the lawn photo, cropped and repeated. |
| `film/*`, `events/*`, `gallery/*` | Real photos from the current site. |

### Client logos (`public/images/clients/*.svg`)

Real vectors, none traced, sanitised (no scripts, links or embedded images).

| Logo | Source |
|---|---|
| O2, Sky | Simple Icons |
| Salesforce, HPE | Wikimedia Commons |
| Boux Avenue | Wikipedia (non-free logo file) |
| Batiste | Batiste's own site |
| Bulb | bulb.co.uk header (via the Web Archive) |
| ITV2 | picons (TV logo collection) |
| Superdrug | seeklogo vector (third party) |

Not included: Porsche (only the crest was available) and CRATE Brewery (downloads blocked). Check
each client is happy to be shown.

## OpenArt record

Project "The Bar People — new homepage & instant quote concepts". Model: GPT Image 2.6 Sunburst,
image-to-image, from our own photos.

| Round | Jobs | Credits |
|---|---|---|
| 1 · mockups (8 Nov) | `qbknaCEvnZqUysmheuos`, `rhASTTjJU58Q00rO23r8`, `zwFiUiLLwUbBtkViozpb`, `jAceSQ0gaGqRAoFD62P6`, `ZEDHROR0YcvcwmsDkRYL`, `sniAvkCVw6rZBJ8v8Ra1` | 231 |
| 2 · hero, bars, Christmas (8 Nov) | `iBD1I1eLSQuKGPMkk8FW`, `QgKKZ1gONFvQkO60nJ5J`, `lMPI8eWU5eAl1N6l1WJk`, `fF6O20XzeL8LR9RIazbm`, `KXInyGP5cj4AzS4giXtN`, `eJdo0s27Yv0CYLz0yfVs`, `UzWa8u5Kio2wEuqWNG8a`, `Nn2M1vISVMv1qO8zoFaH`, `pMoBobGH57WxKNDVkVkb`, `WhwO8mPpVENbIIfaEckJ` | 431 |
| 3 · bar finishes (10 Nov) | white `E6RhKN3tIWmVW9b9VQjR`, mirror `eyuFHjfNT6K6NFYTaXKH`, shimmer `YjE3rQyQib25tFnCOQP9`, LOVE `kJQNgsWuA446vaMATaKg`, LED `EQQM3lDgRBuZCLFDVMvh` | 175 |

About 837 credits in total. No credits were bought or borrowed. The six round-2 bar renders are no
longer used (replaced by the vector drawings).

## Checked

- 52 automated checks on the prices and rules (`pnpm test` runs these with the older ones).
- An independent review in five parts (prices against Jake's brief, dates and times, saved quotes
  and the PDF, every screen, the bar drawings). It found real faults, now fixed: typing a guest
  number gave the wrong number; typing a date could break the Delivery step; a marquee could add
  itself on reload; the email step ignored an incomplete address without saying so; the builder
  could slide off screen at the end of a list; curved bar edges were drawn in the wrong order.
  A second reviewer re-tested the prices and the dates. The other three re-tests did not run (a
  usage limit), so those fixes were re-tested with the browser checks below instead.
- Browser checks at 375, 390, 768, 820, 1024 and 1440 wide: every step, keyboard and Escape, the
  PDF download, and every button at least 40px tall on phones.
- Only Chromium was available. Not yet tried on a real iPhone, Safari or Firefox.

## Still open

1. Jake's answers to the assumptions above.
2. Marquee prices and sizes, from the marquee partner.
3. Connecting leads and a live quote link to AnyVendor (`src/lib/quote/leads.ts`).
4. Header clips from Jake's own Instagram or phone, if he wants to swap any.
5. Christmas copy and dates, and whether to show that section only in season.
6. Switching `/new` to be the homepage: not done, and not to be done without Jake's say-so.
7. "See the full gallery", Privacy and Terms still go to the old-design pages.
8. Some photos (Corporate, Parties, gallery) are only about 1000px wide, so they look slightly
   soft on sharp screens. Higher-resolution originals would fix that.
9. Client logos: Bulb no longer trades under that name. EE and Crisis are on the old site's strip
   but not here (no clean vector found).
10. Christmas wording is new (the old site has no Christmas offer), so it needs Jake's eye.

## Where things are

| What | Where |
|---|---|
| Prices | `src/lib/quote/prices.ts` |
| Bars, sizes, finishes, recommendations | `src/lib/quote/bars.ts` |
| Drinks prices and menu | `src/lib/quote/drinks.ts` |
| Staff hours, set-up and collection | `src/lib/quote/schedule.ts` |
| Marquee range | `src/lib/quote/marquee.ts` |
| The quote itself (lines, VAT, totals, share link) | `src/lib/quote/quote.ts` |
| PDF | `src/lib/quote/pdf.ts` |
| Leads (not connected) | `src/lib/quote/leads.ts` |
| Builder screens | `src/components/new-home/builder/` |
| Homepage sections and words | `src/components/new-home/sections/`, `src/components/new-home/data.ts` |

Earlier mockups are in `docs/new-homepage/mockups/`.
