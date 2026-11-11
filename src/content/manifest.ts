// The Bar People website — editable content manifest for AnyVendor.
//
// Declares every section and field Jake can edit in the AnyVendor backend.
// The bespoke layout, motion and hero choreography stay in code; only the
// words, links and pictures they carry live here.
//
// OUT OF SCOPE on purpose (owned by anyOS, referenced by id only, never copied
// into AnyVendor): prices and the VAT rule, the bar/glass/ice catalogue and
// stock, availability, enquiry and quote submission, party numbers, and the
// WhatsApp contact. See docs/anyvendor/README.md.
//
// Bump MANIFEST_REVISION whenever a section or field changes, so the backend
// can tell which shape a saved draft was made against.

import type { Field, Manifest } from './contract.ts';
import { NEW_HOME_SECTIONS } from './new-home.ts';

export const MANIFEST_REVISION = '2026-11-11.2';
export const SITE_KEY_IN_ANYOS_LIVE_EDIT = 'the-bar-people';

// ─── Field helpers ──────────────────────────────────────────────────────────

const text = (key: string, label: string, max = 120, extra: Partial<Field> = {}): Field => ({ key, label, type: 'text', max, ...extra });
const area = (key: string, label: string, max = 600, extra: Partial<Field> = {}): Field => ({ key, label, type: 'textarea', max, ...extra });
const rich = (key: string, label: string, max = 4000, extra: Partial<Field> = {}): Field => ({ key, label, type: 'richtext', max, ...extra });
const image = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: 'image', ...extra });
const link = (key: string, label: string, extra: Partial<Field> = {}): Field => ({ key, label, type: 'link', ...extra });
const list = (key: string, label: string, max: number, fields: Field[], extra: Partial<Field> = {}): Field => ({ key, label, type: 'list', max, fields, ...extra });
const focus = (key: string, label: string): Field =>
  text(key, label, 20, { help: 'Which part of the photo to keep in frame, e.g. "50% 30%" (across, down). Leave blank for the centre.' });
const note = (key: string): Field =>
  text(key, 'Label on the photo', 120, { help: 'Shown on the image so nobody mistakes what it is, e.g. "Real photo" or "Layout sketch · not to scale".' });
const intro = (prefix = ''): Field[] => [
  text(`${prefix}eyebrow`, 'Small heading', 60),
  text(`${prefix}title`, 'Heading', 120, { required: true }),
];
const seo = (): Field[] => [
  text('seo_title', 'Search title', 70, { help: 'Leave blank to use the page heading.' }),
  area('seo_description', 'Search description', 200),
];
const quoteButton = link('button', 'Button', { help: 'Usually "Price My Event" → /quote.' });

const STEP_IDS = ['party', 'bar', 'glasses', 'ice', 'staff', 'drinks', 'extras', 'review'] as const;

// ─── Manifest ───────────────────────────────────────────────────────────────

export const TBP_MANIFEST: Manifest = {
  version: 1,
  name: `The Bar People website · manifest ${MANIFEST_REVISION}`,
  sections: [
    {
      key: 'business',
      label: 'Business details',
      help: 'Used in the footer, contact page and search results.',
      fields: [
        text('name', 'Business name', 80, { required: true }),
        text('legal_name', 'Registered name', 120, { required: true }),
        text('company_number', 'Company number', 20),
        text('area', 'Where you’re based', 120),
        { key: 'founded', label: 'Year founded', type: 'number' },
        area('strapline', 'Short description', 300, { required: true }),
        link('general_email', 'General email', { help: 'mailto: link, e.g. mailto:hello@thebarpeople.co.uk' }),
        list('contacts', 'Who to contact', 6, [
          text('team', 'For', 60),
          text('person', 'Name', 80),
          link('email', 'Email (mailto:)'),
          link('phone', 'Phone (tel:)'),
        ]),
        list('socials', 'Social links', 6, [link('link', 'Link')]),
      ],
    },
    {
      key: 'seo',
      label: 'Search & sharing',
      fields: [
        text('default_title', 'Site title', 90, { required: true }),
        text('title_template', 'Page title pattern', 60, { help: '%s is replaced by the page title.' }),
        area('description', 'Site description', 200, { required: true }),
        text('keywords', 'Keywords', 200),
        text('share_title', 'Title when shared', 90),
        area('share_description', 'Description when shared', 200),
        image('share_image', 'Image when shared'),
      ],
    },
    {
      key: 'navigation',
      label: 'Menu',
      fields: [
        list('links', 'Menu links', 8, [link('link', 'Link')]),
        link('cta', 'Menu button', { required: true }),
      ],
    },
    {
      key: 'home_hero',
      label: 'Homepage hero (current site)',
      help: 'The hero on the current homepage. Its three lines were edited in anyOS live-edit and are carried over as they are.',
      fields: [
        text('eyebrow', 'Small heading', 60),
        text('title', 'Headline', 90, { required: true }),
        area('subtitle', 'Line under the headline', 200),
        link('primary_cta', 'Main button', { required: true }),
        link('secondary_cta', 'Second button'),
        list('stats', 'Numbers under the buttons', 6, [text('value', 'Number', 20), text('label', 'Label', 30)]),
        image('image', 'Background photo', { required: true }),
      ],
    },
    {
      key: 'opening',
      label: 'New homepage opening (scene 1 → 2, prototype)',
      help: 'The opening film: the shirt, then the white bar. The motion is fixed; the words and photos are yours.',
      fields: [
        text('eyebrow', 'Small heading', 60),
        text('headline', 'Headline', 90, { required: true }),
        area('subheadline', 'Line under the headline', 160, { required: true }),
        text('cta_label', 'Main button', 40, { required: true, help: 'Always scrolls to the quote builder.' }),
        text('header_cta_label', 'Top-right button', 30),
        image('shirt_image', 'Scene 1 photo (the shirt)', { required: true }),
        note('shirt_note'),
        focus('shirt_focus_desktop', 'Scene 1 framing on computers'),
        focus('shirt_focus_phone', 'Scene 1 framing on phones'),
        image('bar_image', 'Scene 2 photo (the bar)', { required: true }),
        note('bar_note'),
        focus('bar_focus_desktop', 'Scene 2 framing on computers'),
        focus('bar_focus_phone', 'Scene 2 framing on phones'),
        text('scroll_cue', 'Hint as the bar settles', 60),
      ],
    },
    {
      key: 'quote_intro',
      label: 'Quote builder — wording',
      help: 'Words only. Prices, items and the VAT rule come from your booking system.',
      fields: [
        text('eyebrow', 'Small heading', 60),
        text('title', 'Heading', 80, { required: true }),
        area('intro', 'Introduction', 300),
        area('empty_state', 'Before anything is chosen', 200),
        area('disclaimer', 'Small print under the total', 300, { required: true }),
        text('welcome_back', 'Message for returning visitors', 120),
        text('request_button', '“Request” button', 40, { required: true }),
        text('save_button', '“Save” button', 40, { required: true }),
      ],
    },
    {
      key: 'quote_steps',
      label: 'Quote builder — questions',
      help: 'Write {staff_rate} where the staff rate should appear; it is filled in from your booking system.',
      fields: STEP_IDS.flatMap((id) => [
        text(`${id}_question`, `${id[0].toUpperCase()}${id.slice(1)}: question`, 80, { required: true }),
        area(`${id}_hint`, `${id[0].toUpperCase()}${id.slice(1)}: hint`, 200),
      ]),
    },
    {
      key: 'services_intro',
      label: 'Services — introduction',
      fields: [...intro(), area('subtitle', 'Line under the heading', 200)],
    },
    {
      key: 'services',
      label: 'Services',
      help: 'Prices are not set here.',
      fields: [
        list('items', 'Services', 12, [
          text('slug', 'Web address name', 40, { help: 'Part of the page address — change only with a redirect.' }),
          text('name', 'Name', 60),
          text('tag', 'Badge', 30),
          area('summary', 'Summary', 300),
          area('features', 'What’s included (one per line)', 1200),
          image('image', 'Photo'),
          focus('image_focus', 'Photo framing'),
        ]),
        text('included_title', '“What’s included” heading', 60),
        text('card_link_label', 'Card link text', 30),
        quoteButton,
      ],
    },
    {
      key: 'bars_intro',
      label: 'Bars — introduction',
      fields: [...intro(), area('subtitle', 'Line under the heading', 200)],
    },
    {
      key: 'bars',
      label: 'Bars — how each one is shown',
      help: 'Words and pictures for each bar card. Prices, stock and the quote builder’s bar list stay in your booking system.',
      fields: [
        list('items', 'Bars', 16, [
          text('catalogue_id', 'Catalogue id', 40, { help: 'Links this card to the bar in your booking catalogue once matched. Do not change.' }),
          text('name', 'Name', 60),
          text('size', 'Size', 40),
          text('tag', 'Badge', 30),
          area('summary', 'Summary', 300),
          text('guests_note', 'Guest guide', 60),
          image('image', 'Picture'),
          note('image_note'),
        ]),
      ],
    },
    {
      key: 'testimonials_intro',
      label: 'Testimonials — introduction',
      fields: intro(),
    },
    {
      key: 'testimonials',
      label: 'Testimonials',
      help: 'Tick once a quote is confirmed with the customer.',
      fields: [
        list('items', 'Testimonials', 24, [
          area('quote', 'Quote', 600),
          text('name', 'Name', 80),
          text('event', 'Event', 80),
          { key: 'verified', label: 'Checked with the customer', type: 'boolean' },
        ]),
      ],
    },
    {
      key: 'brands',
      label: 'Brands you’ve worked with',
      help: 'Set a logo to Hidden to take it off the site.',
      fields: [
        text('intro', 'Line above the logos', 120),
        text('also_named', 'Names listed without a logo', 200),
        list('logos', 'Logos', 24, [
          text('name', 'Brand', 60),
          image('logo', 'Logo'),
          { key: 'permission', label: 'Permission to show', type: 'select', options: ['To confirm', 'Approved', 'Hidden'] },
        ]),
      ],
    },
    {
      key: 'cta',
      label: 'Call to action band',
      fields: [...intro(), area('subtitle', 'Line under the heading', 200), quoteButton],
    },
    {
      key: 'event_types',
      label: 'Event types',
      fields: [
        list('items', 'Event types', 12, [
          text('slug', 'Web address name', 40, { help: 'Part of the page address — change only with a redirect.' }),
          text('name', 'Name', 60),
          area('summary', 'Summary', 300),
          image('image', 'Photo'),
        ]),
        text('recommended_title', '“Recommended services” heading', 60),
        quoteButton,
      ],
    },
    {
      key: 'gallery_page',
      label: 'Gallery page',
      fields: [...intro(), area('intro', 'Introduction', 200)],
    },
    {
      key: 'gallery',
      label: 'Gallery photos',
      fields: [
        list('items', 'Photos', 60, [
          image('image', 'Photo'),
          text('caption', 'Caption', 80),
          { key: 'category', label: 'Category', type: 'select', options: ['Corporate', 'Weddings', 'Private', 'Cocktails'] },
        ]),
      ],
    },
    {
      key: 'about_page',
      label: 'About page',
      fields: [
        ...intro(),
        rich('body', 'Story (blank line between paragraphs)', 4000),
        image('image', 'Main photo'),
        text('image_caption', 'Photo caption', 80),
        list('values', 'What you stand for', 6, [text('icon', 'Icon (emoji)', 4), text('title', 'Title', 40), area('text', 'Text', 200)]),
        text('team_title', 'Team heading', 60),
        list('team_photos', 'Team photos', 6, [image('image', 'Photo')]),
        list('team', 'Team', 12, [text('name', 'Name', 60), text('role', 'Role', 60), area('text', 'About them', 300)]),
        quoteButton,
        ...seo(),
      ],
    },
    {
      key: 'contact_page',
      label: 'Contact page',
      help: 'Who to contact comes from Business details. The form itself sends to your booking system.',
      fields: [
        ...intro(),
        area('intro', 'Introduction', 200),
        text('general_title', '“General” box heading', 40),
        text('form_button', 'Form button', 40),
        text('success_title', 'After sending: heading', 60),
        area('success_text', 'After sending: message', 200),
      ],
    },
    {
      key: 'our_bars_page',
      label: 'Our bars page',
      fields: [...intro(), area('intro', 'Introduction', 200), quoteButton, ...seo()],
    },
    {
      key: 'privacy_page',
      label: 'Privacy policy',
      fields: [
        ...intro(),
        area('intro', 'Introduction', 200),
        list('sections', 'Sections', 20, [text('heading', 'Heading', 80), area('body', 'Text (blank line between paragraphs)', 2000)]),
        ...seo(),
      ],
    },
    {
      key: 'terms_page',
      label: 'Terms of service',
      fields: [
        ...intro(),
        area('intro', 'Introduction', 200),
        list('sections', 'Sections', 20, [text('heading', 'Heading', 80), area('body', 'Text (blank line between paragraphs)', 2000)]),
        ...seo(),
      ],
    },
    {
      key: 'footer',
      label: 'Footer',
      fields: [
        text('services_heading', 'Services column heading', 30),
        text('events_heading', 'Events column heading', 30),
        text('company_heading', 'Company column heading', 30),
        list('company_links', 'Company links', 8, [link('link', 'Link')]),
        text('privacy_label', 'Privacy link text', 30),
        text('terms_label', 'Terms link text', 30),
      ],
    },
    // The commissioned homepage (/new): its own sections, defined beside the
    // code that turns them into the page (src/content/new-home.ts).
    ...NEW_HOME_SECTIONS,
  ],
};

/** Every quote-builder step id, in order (structure lives in code). */
export const QUOTE_STEP_IDS = STEP_IDS;
