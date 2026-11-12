# The Bar People × AnyVendor — current-site packet

For the AnyVendor owner. From the Bar People site owner, 11 November 2026, updated 12 November.
Site repository `jakeylee93/thebarpeople-website`, branch `claude/loving-mendel-to07v2`.

This packet covers the **commissioned homepage (`/new`)** and its draft page (`/preview`), on
the content contract `anyvendor.site/v1` and the editor bridge `anyvendor.bridge/v1`. It replaces the
earlier packet, which only covered `/concepts`.

**Nothing is activated.** No editor origin is switched on, no content origin is set, nothing was written
to AnyVendor or anyOS, and no credential was created. The live domain is unchanged.

## 1. What to install

| File | Use |
|---|---|
| [`the-bar-people.manifest.json`](the-bar-people.manifest.json) | The site manifest: 36 sections, 220 fields, about 56 KB. |
| [`the-bar-people.content.json`](the-bar-people.content.json) | Seed: draft v1, then publish v1. It is exactly what the pages show today. |

Both are generated from the code with `pnpm content:export`; a test fails if either drifts.

- Slug: `the-bar-people`. Kind: `bespoke`.
- Site address (testing): `https://thebarpeople-website-git-claude-loving-mendel-to07v2-anyos.vercel.app`
  (the branch preview; it answers without a Vercel login).
- Public page: `{site address}/new`
- **Bind this address:** `{site address}/new`. The editor appends `/preview`, so the draft frame is
  `{site address}/new/preview?token=<token>&av_edit=1`. `/preview?token=…` at the root is the same page
  and still works.
- Revalidate (optional): `{site address}/api/revalidate`, `POST`, `Authorization: Bearer <secret>`,
  body `{"slug":"the-bar-people","revision":"…"}`. It answers 404 until the secret is set here.

## 2. Settings on the site (none set; Jake or the platform owner sets them)

| Setting | Value | Effect |
|---|---|---|
| `ANYVENDOR_CONTENT_ORIGIN` | `https://anyvendor.co.uk` | The site reads published content and drafts. Unset: bundled content, and `/preview` is 404. (`ANYVENDOR_API_URL`, the earlier name, still works.) |
| `ANYVENDOR_SITE_SLUG` | `the-bar-people` | Required with the above. |
| `ANYVENDOR_EDITOR_ORIGINS` | `https://platform.anyvendor.co.uk` | **The activation switch for the editor link.** Listed origins may frame `/preview` and exchange bridge messages. Unset: nobody else can frame it and the bridge never starts. Needs a redeploy (the frame header is fixed at build). |
| `ANYVENDOR_REVALIDATE_SECRET` | shared out of band, 24+ characters | Optional instant refresh on publish. |

Only exact `https://host` origins are accepted (no port, path, wildcard); anything else is dropped.

## 3. The content model for `/new`

Twelve sections. Everything else in the manifest is the older live site and is unchanged.

| Section | What it holds |
|---|---|
| `page` | `chapters`: a list of `{ chapter (select), visible (boolean) }`, max 7, each chapter once. Same shape as `page.chapters` on your other bespoke sites. Chapters: `christmas`, `corporate`, `weddings`, `parties`, `team`, `marquees`, `gallery`. |
| `nh_menu` | The name of each section in the menu, footer and side dots. |
| `nh_hero` | Header: small heading, headline, line, button words, small print, phone panel headings, film and photos. |
| `nh_christmas` | Words, button words, background photo and framing, the two shuffling snapshot sets. |
| `nh_corporate` | Words, three steps, button words, phone label, four photos, client logos. |
| `nh_weddings` | Words, tick points, button words, main photo and framing, two prints. |
| `nh_parties` | Words, tick points, button words, sticker words, photo and framing. |
| `nh_team` | Words, button words, photo and clip cards. |
| `nh_marquee` | Words, the package list, button words, small print. |
| `nh_gallery` | Heading, Follow link, photo and clip cards. |
| `nh_how` | The "How it works" pop-up: steps, and the list for corporate, weddings and parties. |
| `nh_footer` | Column headings, contacts, social links. |

Rules the page applies, whatever is sent:

- The header film is always first and the footer always last. They are not chapters.
- A hidden row stays off the page. A chapter missing from the list is off the page. An **empty list
  shows the header and footer only**. An unknown or repeated chapter is ignored.
- A section the editor does not send at all keeps the bundled value. A required field left blank falls
  back. An unusable photo, film or link is skipped, never rendered.
- Select options are plain strings.

## 4. Editable now, and what stays out

**Editable from AnyVendor (draft, publish, preview):** all text above, every photo, the film and clip
files, logos, contacts and social links, and section add, hide, remove and reorder.

**Live in the editor frame before saving (bridge):** 104 marked fields. All headings, body text,
button words, tick points, steps, menu names, footer headings and contact names, and these pictures:
Christmas, weddings, parties, the four corporate photos, the client logos, the wedding prints, and the
photo cards in Team and Gallery. Plus chapters.

**Editable, but shown after Save draft and reload (not live):**

- Films and clips (`<video>`), the film still, the Christmas snapshot sets, photo framing fields.
- Link fields (Follow, emails, phones, socials) and the logo width number. The bridge sends no live
  value for `link`, `number`, `boolean` or `select` fields.
- The "How it works" pop-up is marked, but it is built when opened, so an unsaved edit made while it
  is closed shows after a save.
- A list where the page skipped a row (an empty step, a card with no photo) loses its marks for that
  page load, so a live edit can never land on the wrong row.

**Not content, by design. Stays in code and in anyOS:**

- **Every price and the VAT rule.** The party sticker's amount comes from the quote builder's price
  list; only its words are a field.
- The quote builder: bars, styles, drinks, cocktails, glassware, marquee range, staff rules, the PDF.
- Where buttons go (`#build…`), the WhatsApp link, the designs, motion and layout.
- Availability, enquiries, quotes, catalogue ids, party numbers: the existing anyOS contracts,
  untouched. This work sends nothing to them.

## 5. One content owner (agreed 12 November 2026)

| Surface | Owner | Editor |
|---|---|---|
| `/new` and `/preview` (the commissioned homepage) | **AnyVendor** | AnyVendor editor, sections in part 3 |
| The current live pages (`/`, `/services`, `/about`, …) | **anyOS live-edit**, its 17 keys only | `edit.js`, `data-anyos` hooks |

No field has two writers, and this is enforced in code:

- `/new` and `/preview` carry no `data-anyos` hooks and **do not load the anyOS script**. Every current
  page loads it exactly as before.
- The current pages carry no `data-av-field` hooks and never load the bridge.
- The older manifest sections (`home_hero`, `services_intro`, `cta`, …) mirror the 17 anyOS strings so
  nothing is lost, but **the current pages do not read AnyVendor**. Editing them in AnyVendor changes
  nothing on the site. Suggest the editor hides or labels them until a separate, agreed switchover.

This is the editor for the commissioned site. It is not a cutover: the customer domain still serves
the current pages, and replacing `/` with `/new` is a separate decision with its own scope.

Known duplicates, harmless today, retired at cutover: `business.contacts` (still lists Kim, current
pages) against `nh_footer.contacts` (Jake only, `/new`); `gallery` and `brands` against `nh_gallery` and
`nh_corporate.logos`.

## 6. The editor bridge on this site

- `public/anyvendor-bridge.js` is your file, **unchanged** (a test pins its SHA-256,
  `0a4f3433…dd1f43df`). It is loaded only by `/preview`, only with `av_edit=1`, only when an editor
  origin is switched on, and it starts only inside a frame.
- Started with `capabilities: { text: true, image: true, chapters: true }` and `onChapters`.
  Chapter order and visibility are applied through React state, so the menu, footer and side dots
  follow. No `keepVisible`.
- In edit mode the server renders all seven chapters, hidden ones included, so a hidden or removed
  chapter can be shown again without a reload. `ready.chapters` therefore always lists all seven.
- The bridge starts after hydration. Unsaved text survives a change of chapter order.
- There are no timed re-applies on this page.
- Forms: the capture-phase submit cancel is enough. The quote builder makes no network request
  (the PDF is built in the browser), so no enquiry can leave an editing session.

The draft page (`/new/preview` and `/preview`: one page module at two addresses, identical handling):

- A missing, malformed or wrong token is a **404**. It never falls back to published or bundled
  content. A malformed token is not sent to AnyVendor.
- Headers: `Content-Security-Policy: frame-ancestors 'self' <editor origins>`,
  `Cache-Control: private, no-store, max-age=0`, `Referrer-Policy: no-referrer`,
  `X-Robots-Tag: noindex, nofollow, noarchive`; also `noindex` and `no-referrer` in the page, and
  both addresses are disallowed in `robots.txt`. No other page's headers changed.
- No third-party script and no request to any other host (the anyOS script is not loaded on `/new` or `/preview`). The token is in the address only: it is
  never put in a message, a prop or a link. `/new/preview` is served directly, not by a redirect.

## 7. What was checked (cloud, 11 November 2026)

- `pnpm test`: 111 pass. Includes your script run against a stand-in page (origin, source, slug,
  schema and nonce rejection; text never HTML; picture addresses re-checked; cleaned chapter list;
  no token in any message), every page mark checked against the manifest, the strict draft read, the
  origin allow-list and the `/preview` headers.
- TypeScript and ESLint clean on the changed files. Production build passes.
- Browser round trip, with a stand-in editor served at `https://platform.anyvendor.co.uk` by the test
  rig (your real platform was not contacted) and a stand-in content endpoint: 34 checks pass.
  Handshake, `ready` (104 fields, 7 chapters, all in the manifest), select, highlight, live text and
  picture, refused `javascript:` picture, reorder, hide, remove and bring back, `reload`, an unlisted
  origin refused by the frame header, no third-party request, at desktop, 375, 390 and tablet.
- `/new` is visually unchanged at six screen sizes; the quote builder regression suite passes.

**Not yet run:** the real round trip against `platform.anyvendor.co.uk` and `anyvendor.co.uk`. It needs
the binding and the settings in part 2.

## 8. Outstanding limits on the site side (precise)

None of these blocks editing, saving, publishing or the preview. Each is a place where a change shows
after Save draft and reload instead of while typing, or a rule the editor should know.

| # | Limit | Cause | Effect |
|---|---|---|---|
| 1 | Films and clips are not live | Bridge `set` carries text or `{src, alt}` for an `<img>` only; these are `<video>` and their fields are `text` paths | `nh_hero.slides.*.video_file`, `phone_video_file`, `nh_team.cards.*.video_file`, `nh_gallery.cards.*.video_file` show after save |
| 2 | `link`, `number`, `select`, `boolean` fields are not live | Protocol sends no live value for them | Follow link, emails, phones, socials, logo ratio, film seconds, photo or video kind show after save |
| 3 | Photo framing is not live | The `focus_*` fields set a CSS position, not text on the page | Shows after save |
| 4 | Christmas snapshot sets are not marked | The prints shuffle under React state; a live swap would be overwritten | `nh_christmas.prints_left/right` show after save |
| 5 | The header still (film poster) is not marked | The header is a `<video>` while a film is the slide | `nh_hero.slides.*.picture` is live only for photo slides |
| 6 | "How it works" pop-up | Its content is built when opened | An unsaved edit made while it is closed shows after save; edits made while open are live |
| 7 | New list rows are not live | A row added in the editor has no element until the server renders it | Added steps, points, cards and logos show after save; existing rows are live |
| 8 | A list with a skipped row loses its marks for that page load | The page skips unusable rows (empty step, card with no photo), which would shift row numbers | That list shows after save until the row is fixed |
| 9 | **Pictures must be site files or in the `website-media` bucket** (`rsqgsnfyusqhtgcwbddc.supabase.co/storage/v1/object/public/website-media/`) | The image optimiser only fetches that bucket | A picture saved from any other host is treated as missing (falls back or is skipped). **Please confirm this is the bucket the editor uploads to**; if not, tell me the host and I will add it |
| 10 | Published changes can take up to about 2 minutes | 60 s cache here plus your `stale-while-revalidate` | Instant once the revalidate secret and URL are set |
| 11 | The frame header is fixed at build | `frame-ancestors` is written when the site is built | Setting `ANYVENDOR_EDITOR_ORIGINS` needs a redeploy |
| 12 | `ready.chapters` lists all seven chapters | Hidden and removed chapters are rendered (hidden) in edit mode so they can return live | Tell me if the editor needs only the listed ones |

Confirmed by the platform owner against the real parent, 12 November 2026: `page.chapters` matches the
editor's chapter shape; all seven chapters in `ready` (hidden included) are accepted; the 104 marked
fields are valid; uploads go to the `website-media` bucket in limit 9. Limits 9 and 12 need no change.

## 9. What is left

1. Bind `the-bar-people` (`bespoke`) to `{site address}/new` with the manifest and seed in part 1.
2. Set the three settings in part 2 on the Vercel project and redeploy (the configured-origin action).
3. Run the real round trip (your acceptance checklist) against the bound site.

Recorded, not started here: newer Instagram posts and films for the gallery and header, staff photos,
drink brand logos, real Christmas party photos, marquee prices from Tom.
