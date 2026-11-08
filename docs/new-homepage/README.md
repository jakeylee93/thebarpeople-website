# New homepage: chosen direction (8 Nov 2026)

Jake's call: start again with a **simple homepage**. It opens on a full-screen photo slider with an
**instant quote** that starts with **All-inclusive** or **Dry hire**, then branches into a short
step-by-step form.

This replaces the earlier look (ivory/brass, serif headings, the scroll "film" on `/concepts`). The
pricing engine and quote logic from that prototype (`src/lib/visual-quote/`) can still be reused.

**Nothing is built yet.** These are mockups only.

## Chosen screens

| Screen | Mockup | Jake's notes |
|---|---|---|
| Desktop home | [desktop-home.jpg](mockups/desktop-home.jpg) | Keep the look and the martini/pineapple photo. **Change the headline** ("Your bar, priced in a minute." is not liked). |
| Phone home | [phone-home.jpg](mockups/phone-home.jpg) | "Exactly how I would like it to look." |
| Phone, Dry hire, step 1 | [phone-dry-hire-choose-bar.jpg](mockups/phone-dry-hire-choose-bar.jpg) | Loves the horseshoe bar card. Steps: Bar → Glassware → Ice → Fridges → Staff. |
| Phone, All-inclusive, step 1 | [phone-all-inclusive-event.jpg](mockups/phone-all-inclusive-event.jpg) | Date, guests, hours, postcode. Steps (draft): Event → Bar → Drinks → Details. |

Not chosen: concept A (slider with a floating quote card) and concept B (split screen). They are in
OpenArt only.

## The look

- **Black and white only**, taken from the logo and the white bars. The photos carry the colour.
  - Near-black `#111111`, white, light grey `#F2F1EE` for surfaces, `#6B6B6B` for secondary text.
- **Type:** one modern grotesk sans-serif (Inter-like), with bold, tight headlines.
- **Shapes:** pill buttons, 16px corners, 1px hairlines and simple line icons.
- **Not used:** gold/brass and serif fonts.
- **Phone:** the photo sits on top, with the questions in a white sheet below. Every step has a back
  arrow and a segmented progress bar labelled by step. A sticky bottom bar shows the quote and the
  next step.

## Still open

1. **Desktop headline.** It replaces "Your bar, priced in a minute."
2. **Steps for each route.** Does All-inclusive also let people choose glassware and staff, or is
   that always included?
3. **Original photo files.** Full-screen needs about 2,500px or more.
   - Martini/pineapple: `public/images/events/cocktails.jpg`, 1024px.
   - Horseshoe/lawn bar: `public/images/film/wedding-lawn-bar.jpg`, 800px, from `weddingchigwell.jpg`.
4. **Prices.** Only the staff rate is confirmed (£28 per bartender per hour + VAT). The bar names and
   sizes on the cards are placeholders from the earlier brief.
5. **Copy to confirm:** "Takes about a minute · No obligation".
6. **AnyVendor field map.** The `opening` and `quote_intro` sections were written for the old look.
   Refresh them once the new hero is built.

## The mockups are not photos

They are GPT Image 2.6 Sunburst renders made on OpenArt (image-to-image), guided by The Bar People's
real logo and photos. They are a layout and style guide only. The build uses the real photo files,
the real logo file and real HTML text.

## OpenArt record

The project is "The Bar People — new homepage & instant quote concepts", capped at 500 credits. It
holds six jobs at 2K, high quality. Over these jobs the account balance fell by 231 credits
(62,994 → 62,763).

| Mockup | History id |
|---|---|
| A: desktop, slider + quote card | `qbknaCEvnZqUysmheuos` |
| B: desktop, split screen | `rhASTTjJU58Q00rO23r8` |
| **C: desktop, evening (chosen)** | `zwFiUiLLwUbBtkViozpb` |
| **D: phone home (chosen)** | `jAceSQ0gaGqRAoFD62P6` |
| **E: phone, Dry hire, choose bar (chosen)** | `ZEDHROR0YcvcwmsDkRYL` |
| **F: phone, All-inclusive, event (chosen)** | `sniAvkCVw6rZBJ8v8Ra1` |

References uploaded to that project: the logo roundel plus six real photos (`wedding-lawn-bar`,
`counter-copper`, `cocktails`, `marquee-bar`, `mirror-bar`, `garden-bar`).
