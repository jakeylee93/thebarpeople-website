// Seed content for the AnyVendor workspace — a snapshot of the site TODAY.
//
// Copied exactly from the current code (tests keep it in step), so importing it
// into AnyVendor changes nothing anyone can see. Differences that are
// deliberate are marked SEED NOTE. Decisions still pending stay pending:
//   - prices are not content (they come from anyOS), so none are seeded;
//   - testimonials are seeded unchecked (verified: false) — they are stale;
//   - client logos are seeded "To confirm";
//   - the bars list is the five bars the live pages show (Jake's six layouts
//     belong to the quote builder catalogue, which stays in anyOS/code);
//   - the opening uses the silver PREVIEW of a real photo, labelled as such.
// The 17 anyOS live-edit strings are seeded with what anyOS serves today, so
// the first AnyVendor read shows exactly the current site (ANYOS_LIVE_EDIT_MAP).

import type { SiteContent } from './contract.ts';
import { homeSeed } from './new-home.ts';

export const TBP_DEFAULT_CONTENT: SiteContent = {
  business: {
    name: 'The Bar People',
    legal_name: 'The Bar People Ltd',
    company_number: '12161824',
    area: 'Leytonstone, London',
    founded: 2014,
    strapline: 'Premium mobile bar hire. Pop-up bars, professional bartenders, and unforgettable experiences since 2014.',
    general_email: { href: 'mailto:hello@thebarpeople.co.uk', label: 'hello@thebarpeople.co.uk' },
    contacts: [
      { team: 'Corporate Events', person: 'Jake Lee', email: { href: 'mailto:jake@thebarpeople.co.uk', label: 'jake@thebarpeople.co.uk' }, phone: { href: 'tel:+447557402200', label: '07557 402200' } },
      { team: 'Private Events', person: 'Kim', email: { href: 'mailto:kim@thebarpeople.co.uk', label: 'kim@thebarpeople.co.uk' }, phone: { href: 'tel:+447724601256', label: '07724 601256' } },
    ],
    // SEED NOTE: from the live WordPress site; the new site doesn't show them yet.
    socials: [
      { link: { href: 'https://www.instagram.com/thebarpeople/', label: 'Instagram' } },
      { link: { href: 'https://www.facebook.com/thebarpeople', label: 'Facebook' } },
    ],
  },
  seo: {
    default_title: 'The Bar People | Premium Mobile Bar Hire London & Nationwide',
    title_template: '%s | The Bar People',
    description: 'Premium mobile bar hire for weddings, corporate events, and private parties. Pop-up bars, professional bartenders, and unforgettable experiences since 2014.',
    keywords: 'mobile bar hire, pop-up bar, cocktail bar hire, wedding bar, corporate bar hire, London bar hire',
    share_title: 'The Bar People | Premium Mobile Bar Hire',
    share_description: 'Pop-up bars, professional bartenders and unforgettable events since 2014. 850+ events. UK-wide.',
    share_image: { src: '/images/events/bar-event.jpg', alt: 'The Bar People pouring cocktails at a packed launch party' },
  },
  navigation: {
    links: [
      {
        link: {
          href: "/services/all-inclusive",
          label: "Services"
        }
      },
      {
        link: {
          href: "/our-bars",
          label: "Our Bars"
        }
      },
      {
        link: {
          href: "/gallery",
          label: "Gallery"
        }
      },
      {
        link: {
          href: "/about",
          label: "About"
        }
      },
      {
        link: {
          href: "/contact",
          label: "Contact"
        }
      }
    ],
    cta: { href: '/quote', label: 'Price My Event' },
  },
  home_hero: {
    // Carried over exactly as anyOS live-edit serves it today (3 Nov 2026).
    // SEED NOTE: the saved subtitle is cut off mid-word in anyOS — flagged for Jake.
    eyebrow: 'Premium Mobile Bar Hire',
    title: 'Unforgettable events!',
    subtitle: 'We bring the bar, the staff, the drinks, and the vibe. You just bring the gue',
    primary_cta: { href: '/quote', label: 'Price My Event' },
    secondary_cta: { href: '/contact', label: 'Get In Touch' },
    stats: [
      { value: '10+', label: 'Years' },
      { value: '850+', label: 'Events' },
      { value: '5★', label: 'Rating' },
      { value: 'UK Wide', label: 'Coverage' },
    ],
    image: { src: '/images/events/bar-event.jpg', alt: 'The Bar People pouring cocktails at a packed launch party' },
  },
  opening: {
    eyebrow: 'Mobile bar hire · London & nationwide',
    headline: 'Unforgettable events, unmatched service',
    subheadline: 'You bring the guests, we’ll bring the rest.',
    cta_label: 'Build your party quote',
    header_cta_label: 'Get a quote',
    shirt_image: { src: '/images/film/shirt-pour-silver-preview.jpg', alt: 'The same real photo with only the roundel thread recoloured to silver, as a preview' },
    shirt_note: 'Real photo · roundel recoloured to silver by hand (preview)',
    shirt_focus_desktop: '78% 30%',
    shirt_focus_phone: '93% 38%',
    bar_image: { src: '/images/film/counter-copper.jpg', alt: 'A white bar counter at night with rows of flutes, a copper tray with rosemary and a mixing glass' },
    bar_note: 'Real photo · the bar',
    bar_focus_desktop: '50% 62%',
    bar_focus_phone: '58% 60%',
    scroll_cue: 'Build your party quote ↓',
  },
  quote_intro: {
    eyebrow: 'Instant · itemised · no obligation',
    title: 'Build your party quote',
    intro: 'Choose your bar, glasses, ice and team. Your quote builds line by line as you go — every price shows how it’s worked out.',
    empty_state: 'Your quote builds here as you choose.\nEvery line shows exactly how it’s worked out.',
    disclaimer: 'A quote, not a booking: your date isn’t held and nothing is charged. VAT is added on your final quote.',
    welcome_back: 'Welcome back — your choices are saved on this device.',
    request_button: 'Request my quote',
    save_button: 'Save on this device',
  },
  quote_steps: {
    party_question: 'When and where is the party?',
    party_hint: 'Finishing after midnight is fine — we’ll work out the next day for you.',
    bar_question: 'Choose your bar',
    bar_hint: 'Six layouts to start from. Tap one to see it larger.',
    glasses_question: 'Which glasses, and how many?',
    glasses_hint: 'Tap Add for one per guest as a starting point. We’ll help you balance the mix.',
    ice_question: 'Ice and keeping things cold',
    ice_hint: 'Count what you need, or let us advise.',
    staff_question: 'How many bartenders?',
    // SEED NOTE: the rate is filled in from the catalogue, never typed here.
    staff_hint: '{staff_rate} per bartender per hour, plus VAT, for the hours of your party.',
    drinks_question: 'Shall we supply the drinks?',
    drinks_hint: 'Optional. A package covers your guests for the hours you choose.',
    extras_question: 'Anything else for the party?',
    extras_hint: 'Optional — we’ll price these for you.',
    review_question: 'Check your quote',
    review_hint: 'Change anything you like, then save it or ask us to confirm it.',
  },
  services_intro: {
    eyebrow: 'What We Do',
    title: 'Tailored Bar Solutions for Every Event',
    subtitle: 'From intimate gatherings to 500-guest galas — we have a package that\'s right for you.',
  },
  services: {
    // SEED NOTE: the old "From £…" prices are stale and are not content; not seeded.
    items: [
      {
        slug: "all-inclusive",
        name: "All Inclusive Hire",
        tag: "Most Popular",
        summary: "Everything included. Drinks, staff, bar, glassware. The ultimate hassle-free experience.",
        features: "Full bar setup & breakdown\nProfessional bartenders\nPremium spirits, wines & beers\nSignature cocktail menu\nAll glassware included\nIce & garnishes\nBar equipment & fridges",
        image: {
          src: "/images/events/bar-event.jpg",
          alt: "All Inclusive Hire — a real Bar People event"
        },
        image_focus: ""
      },
      {
        slug: "cash-bar",
        name: "Cash Bar Hire",
        tag: "",
        summary: "Guests pay for their own drinks. You pay for the professional setup and staff.",
        features: "Full bar setup & breakdown\nProfessional bartenders\nCard payment terminals\nFull drinks menu\nAll glassware included\nIce & garnishes\nRevenue share options available",
        image: {
          src: "/images/events/salesforce-bar-2.jpg",
          alt: "Cash Bar Hire — a real Bar People event"
        },
        image_focus: ""
      },
      {
        slug: "dry-hire",
        name: "Dry Hire",
        tag: "",
        summary: "Bar equipment rental. You source the drinks, we provide the beautiful bar and glassware.",
        features: "Modular bar unit delivery & setup\nChoice of bar size & style\nGlassware hire available\nIce bins & coolers\nBar accessories\nDelivery & collection\nSetup guidance provided",
        image: {
          src: "/images/events/marquee-bar.jpg",
          alt: "Dry Hire — a real Bar People event"
        },
        image_focus: ""
      },
      {
        slug: "staff-hire",
        name: "Staff Hire",
        tag: "Flexible",
        summary: "Professional, certified bartenders for your own bar setup. Experienced, personable, impeccable.",
        features: "Experienced bartenders\nSIA-licensed security available\nAPLH/Personal licence holders\nProfessional uniforms\nFlexible shift lengths\nEvent managers available\nFull team coordination",
        image: {
          src: "/images/events/jake-corporate.jpg",
          alt: "Staff Hire — a real Bar People event"
        },
        image_focus: ""
      },
      {
        slug: "event-management",
        name: "Event Management",
        tag: "Premium",
        summary: "Full event coordination from concept to execution. We handle everything so you can enjoy the night.",
        features: "End-to-end planning\nVenue sourcing & liaison\nSupplier coordination\nTimeline & logistics management\nOn-the-day coordination\nBudget management\nPost-event wrap-up",
        image: {
          src: "/images/events/hp-bar.jpg",
          alt: "Event Management — a real Bar People event"
        },
        image_focus: ""
      }
    ],
    included_title: 'What\'s Included',
    card_link_label: 'Learn more →',
    button: { href: '/quote', label: 'Price My Event' },
  },
  bars_intro: {
    eyebrow: 'Our Bars',
    title: 'A Bar for Every Event',
    subtitle: 'Any colour. Indoor or outdoor. Fully modular.',
  },
  bars: {
    // SEED NOTE: the five bars the live homepage and /our-bars show today (prices
    // stay in code/anyOS). Jake's six layouts live in the quote builder catalogue.
    items: [
      {
        catalogue_id: "",
        name: "Shimmer Bar",
        size: "5FT",
        tag: "",
        summary: "Intimate events & private parties",
        guests_note: "Up to 50 guests",
        image: {
          src: "/images/events/mirror-bar.jpg",
          alt: "Shimmer Bar at a real event"
        },
        image_note: ""
      },
      {
        catalogue_id: "",
        name: "Classic Cocktail Bar",
        size: "10FT",
        tag: "Popular",
        summary: "Weddings, birthdays & corporate",
        guests_note: "Up to 100 guests",
        image: {
          src: "/images/events/garden-bar.jpg",
          alt: "Classic Cocktail Bar at a real event"
        },
        image_note: ""
      },
      {
        catalogue_id: "",
        name: "Horseshoe Bar",
        size: "15FT",
        tag: "",
        summary: "Larger events & festivals",
        guests_note: "Up to 150 guests",
        image: {
          src: "/images/events/hp-bar.jpg",
          alt: "Horseshoe Bar at a real event"
        },
        image_note: ""
      },
      {
        catalogue_id: "",
        name: "Large Horseshoe",
        size: "35FT",
        tag: "Recommended",
        summary: "Major corporate events & galas",
        guests_note: "Up to 250 guests",
        image: {
          src: "/images/events/salesforce-bar-2.jpg",
          alt: "Large Horseshoe at a real event"
        },
        image_note: ""
      },
      {
        catalogue_id: "",
        name: "Island Bar",
        size: "40FT",
        tag: "Statement",
        summary: "Showstopper statement events",
        guests_note: "250+ guests",
        image: {
          src: "/images/events/salesforce-bar.jpg",
          alt: "Island Bar at a real event"
        },
        image_note: ""
      }
    ],
  },
  testimonials_intro: {
    eyebrow: 'Testimonials',
    title: 'Trusted by Thousands',
  },
  testimonials: {
    // SEED NOTE: inherited from the earlier build and unchecked — hidden until verified.
    items: [
      {
        quote: "Jake and his team were incredible at our wedding. The cocktail bar was the highlight of the entire evening — guests are still talking about it months later.",
        name: "Sarah & Tom",
        event: "Wedding Reception",
        verified: false
      },
      {
        quote: "Professional, punctual, and the cocktails were outstanding. Our corporate event was elevated to another level entirely. We'll be booking again.",
        name: "David Chen",
        event: "Corporate Event",
        verified: false
      },
      {
        quote: "We've used The Bar People three years running for our Christmas party. Wouldn't go anywhere else — they know us, they know our guests, and they deliver every time.",
        name: "Rachel Moore",
        event: "Christmas Party",
        verified: false
      },
      {
        quote: "The team handled our 200-guest charity gala flawlessly. Vish and Monique were absolute stars. The signature cocktail they created for us was perfect.",
        name: "James Wright",
        event: "Charity Gala",
        verified: false
      },
      {
        quote: "From the initial quote to the event itself, everything was seamless. The Porsche team absolutely loved it — premium in every sense.",
        name: "Mark Stevens",
        event: "Corporate Launch",
        verified: false
      }
    ],
  },
  brands: {
    intro: 'Trusted by leading brands',
    also_named: "Porsche, Superdrug, Hewlett Packard Enterprise, CRATE Brewery",
    // SEED NOTE: permission to show each client logo hasn't been confirmed.
    logos: [
      {
        name: "O2",
        logo: {
          src: "/images/brands/o2.png",
          alt: "O2"
        },
        permission: "To confirm"
      },
      {
        name: "Sky",
        logo: {
          src: "/images/brands/sky.png",
          alt: "Sky"
        },
        permission: "To confirm"
      },
      {
        name: "Salesforce",
        logo: {
          src: "/images/brands/salesforce.png",
          alt: "Salesforce"
        },
        permission: "To confirm"
      },
      {
        name: "HPE",
        logo: {
          src: "/images/brands/hpe.png",
          alt: "HPE"
        },
        permission: "To confirm"
      },
      {
        name: "ITV2",
        logo: {
          src: "/images/brands/itv2.png",
          alt: "ITV2"
        },
        permission: "To confirm"
      },
      {
        name: "Boux Avenue",
        logo: {
          src: "/images/brands/boux-avenue.png",
          alt: "Boux Avenue"
        },
        permission: "To confirm"
      },
      {
        name: "Batiste",
        logo: {
          src: "/images/brands/batiste.png",
          alt: "Batiste"
        },
        permission: "To confirm"
      },
      {
        name: "Bulb",
        logo: {
          src: "/images/brands/bulb.png",
          alt: "Bulb"
        },
        permission: "To confirm"
      }
    ],
  },
  cta: {
    eyebrow: 'Get Started',
    title: 'Ready to Build Your Perfect Bar?',
    subtitle: 'Get an instant estimate — no commitment, no waiting.',
    button: { href: '/quote', label: 'Price My Event' },
  },
  event_types: {
    items: [
      {
        slug: "weddings",
        name: "Weddings",
        summary: "Make your big day unforgettable with a premium bar experience your guests will rave about.",
        image: {
          src: "/images/events/mirror-bar-outside.jpg",
          alt: "Weddings with The Bar People"
        }
      },
      {
        slug: "corporate",
        name: "Corporate Events",
        summary: "Impress clients and reward teams with polished, professional bar service.",
        image: {
          src: "/images/events/salesforce-bar.jpg",
          alt: "Corporate Events with The Bar People"
        }
      },
      {
        slug: "birthday-parties",
        name: "Birthday Parties",
        summary: "Celebrate in style with cocktails, mocktails, and a setup that wows.",
        image: {
          src: "/images/events/hip-hooray.jpg",
          alt: "Birthday Parties with The Bar People"
        }
      },
      {
        slug: "garden-parties",
        name: "Garden Parties",
        summary: "Al fresco drinks done right — beautiful bars for outdoor entertaining.",
        image: {
          src: "/images/events/garden-bar.jpg",
          alt: "Garden Parties with The Bar People"
        }
      },
      {
        slug: "festivals",
        name: "Festivals",
        summary: "High-volume, high-energy bar setups built for festival crowds.",
        image: {
          src: "/images/events/love-mirror.jpg",
          alt: "Festivals with The Bar People"
        }
      },
      {
        slug: "christmas",
        name: "Christmas Parties",
        summary: "Festive cocktails, winter warmers, and party vibes to see out the year.",
        image: {
          src: "/images/events/hp-bar.jpg",
          alt: "Christmas Parties with The Bar People"
        }
      }
    ],
    recommended_title: 'Recommended Services',
    button: { href: '/quote', label: 'Price My Event' },
  },
  gallery_page: {
    eyebrow: 'Our Work',
    title: 'Gallery',
    intro: 'Real bars, real parties — 850+ events and counting.',
  },
  gallery: {
    // SEED NOTE: captions are inherited from the earlier build; event names to be checked.
    items: [
      {
        image: {
          src: "/images/events/bar-event.jpg",
          alt: "Boux Avenue launch party"
        },
        caption: "Boux Avenue launch party",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/salesforce-bar.jpg",
          alt: "Salesforce island bar"
        },
        caption: "Salesforce island bar",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/salesforce-bar-2.jpg",
          alt: "Salesforce Tower bar"
        },
        caption: "Salesforce Tower bar",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/hp-bar.jpg",
          alt: "HPE winter party"
        },
        caption: "HPE winter party",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/hp-mini-island.jpg",
          alt: "HPE cocktail station"
        },
        caption: "HPE cocktail station",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/porsche.jpg",
          alt: "Porsche launch"
        },
        caption: "Porsche launch",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/porsche-custom.jpg",
          alt: "Porsche custom build"
        },
        caption: "Porsche custom build",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/porsche-staff.jpg",
          alt: "Porsche bar team"
        },
        caption: "Porsche bar team",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/superdrug.jpg",
          alt: "Superdrug event"
        },
        caption: "Superdrug event",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/boux-avenue.jpg",
          alt: "Boux Avenue bar"
        },
        caption: "Boux Avenue bar",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/jake-corporate.jpg",
          alt: "Flamed cocktails, live"
        },
        caption: "Flamed cocktails, live",
        category: "Corporate"
      },
      {
        image: {
          src: "/images/events/love-mirror.jpg",
          alt: "LOVE mirror bar"
        },
        caption: "LOVE mirror bar",
        category: "Weddings"
      },
      {
        image: {
          src: "/images/events/mirror-bar-outside.jpg",
          alt: "Mirror bar, al fresco"
        },
        caption: "Mirror bar, al fresco",
        category: "Weddings"
      },
      {
        image: {
          src: "/images/events/marquee-bar.jpg",
          alt: "Marquee lawn bar"
        },
        caption: "Marquee lawn bar",
        category: "Weddings"
      },
      {
        image: {
          src: "/images/events/hip-hooray.jpg",
          alt: "Hip hip hooray"
        },
        caption: "Hip hip hooray",
        category: "Private"
      },
      {
        image: {
          src: "/images/events/garden-bar.jpg",
          alt: "Garden party bar"
        },
        caption: "Garden party bar",
        category: "Private"
      },
      {
        image: {
          src: "/images/events/mirror-bar.jpg",
          alt: "Shimmer bar at home"
        },
        caption: "Shimmer bar at home",
        category: "Private"
      },
      {
        image: {
          src: "/images/events/outdoor-bar.jpg",
          alt: "Outdoor setup"
        },
        caption: "Outdoor setup",
        category: "Private"
      },
      {
        image: {
          src: "/images/events/special-occasions.jpg",
          alt: "Special occasions"
        },
        caption: "Special occasions",
        category: "Private"
      },
      {
        image: {
          src: "/images/events/cocktails.jpg",
          alt: "Signature serves"
        },
        caption: "Signature serves",
        category: "Cocktails"
      },
      {
        image: {
          src: "/images/events/martini-pour.jpg",
          alt: "Martini pour"
        },
        caption: "Martini pour",
        category: "Cocktails"
      },
      {
        image: {
          src: "/images/events/martini-daiquiri.jpg",
          alt: "Martinis & daiquiris"
        },
        caption: "Martinis & daiquiris",
        category: "Cocktails"
      },
      {
        image: {
          src: "/images/events/pina-colada.jpg",
          alt: "Piña coladas"
        },
        caption: "Piña coladas",
        category: "Cocktails"
      }
    ],
  },
  about_page: {
    eyebrow: 'Our Story',
    title: 'About The Bar People',
    body: [
      'Founded in 2014, The Bar People started with a simple idea: every event deserves a brilliant bar experience — without the hassle. What began as one person, one van, and a lot of determination has grown into London\'s go-to mobile bar hire company, delivering 850+ events and counting.',
      'We\'ve served cocktails at Porsche launches, poured pints at charity galas, and mixed margaritas at hundreds of weddings. From a 50-person birthday to a 500-guest corporate bash, we bring the same energy, professionalism, and love for what we do.',
      'Our modular bar systems are designed and built in-house — any size, any colour, indoor or outdoor. Our bartenders are experienced, friendly, and always professional. And our all-inclusive packages mean you don\'t have to think about anything except enjoying the night.',
    ].join('\n\n'),
    image: { src: '/images/events/jake-corporate.jpg', alt: 'Jake flaming a cocktail behind the bar at a corporate event' },
    image_caption: 'Live theatre, every pour.',
    values: [
      { icon: '🎯', title: 'Reliability', text: 'We show up on time, every time. Over 10 years of consistent delivery.' },
      { icon: '✨', title: 'Quality', text: 'Premium spirits, professional staff, beautiful bars — no corners cut.' },
      { icon: '🤝', title: 'Partnership', text: 'We work with you, not just for you. Your event is our event.' },
    ],
    team_title: 'Meet the Team',
    team_photos: [
      { image: { src: '/images/events/alex.jpg', alt: 'Alex behind the bar' } },
      { image: { src: '/images/events/glody.jpg', alt: 'Glody mixing drinks' } },
      { image: { src: '/images/events/staff-alex.jpg', alt: 'The team at work' } },
    ],
    team: [
      { name: 'Jake Lee', role: 'Founder & Director', text: 'Runs the show. Corporate events, logistics, and the big picture.' },
      { name: 'Kim', role: 'Events Manager', text: 'Private events specialist. Your go-to for weddings, parties, and everything personal.' },
    ],
    button: { href: '/quote', label: 'Price My Event' },
    seo_title: 'About Us | The Bar People',
    seo_description: 'Meet the team behind The Bar People — delivering unforgettable bar experiences since 2014.',
  },
  contact_page: {
    eyebrow: 'Get In Touch',
    title: 'Contact Us',
    intro: 'Have a question or ready to book? We\'d love to hear from you.',
    general_title: 'General',
    form_button: 'Send Message',
    success_title: 'Message Sent!',
    success_text: 'We\'ll get back to you as soon as possible.',
  },
  our_bars_page: {
    eyebrow: 'Our Collection',
    title: 'A Bar for Every Event',
    intro: 'Any colour. Indoor or outdoor. Fully modular. Choose your perfect setup.',
    button: { href: '/quote', label: 'Price My Event' },
    seo_title: 'Our Bars | The Bar People',
    seo_description: 'Explore our range of modular pop-up bars — from intimate 5FT shimmer bars to 40FT island showstoppers.',
  },
  privacy_page: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    intro: 'Plain English, no surprises. Last updated July 2026.',
    sections: [
      { heading: 'Who we are', body: 'The Bar People Ltd (company no. 12161824) provides mobile bar hire, bar staff and event services across the UK. This policy explains how we handle personal information you share with us through this website, by email or by phone.' },
      { heading: 'What we collect and why', body: 'When you send an enquiry or request a quote we collect your name, contact details (email and/or phone), your event date and details, and anything you choose to tell us in your message. We use this solely to respond to your enquiry, prepare your quote and deliver your event.\n\nWe do not sell or rent your information to anyone, and we do not use it for third-party advertising.' },
      { heading: 'Where it goes', body: 'Enquiries are stored securely in our booking system so the team can manage your event. Emails live in our business mailboxes. We use trusted service providers (website hosting and our booking platform) to process this data on our behalf.' },
      { heading: 'How long we keep it', body: 'We keep enquiry and booking records for as long as needed to run your event and meet our legal obligations (for example, accounting records). If you never book with us, you can ask us to delete your enquiry at any time.' },
      { heading: 'Your rights', body: 'You can ask us at any time what information we hold about you, ask us to correct it, or ask us to delete it. Email jake@thebarpeople.co.uk and we will sort it promptly.' },
      { heading: 'Cookies', body: 'This website does not use advertising or tracking cookies. Our hosting provider may collect basic, anonymous analytics (such as page views) to keep the site running well.' },
    ],
    seo_title: 'Privacy Policy',
    seo_description: 'How The Bar People collects, uses and protects your personal information.',
  },
  terms_page: {
    eyebrow: 'Legal',
    title: 'Terms of Service',
    intro: 'The short, honest version. Your written quote carries the specifics.',
    sections: [
      { heading: 'Quotes & bookings', body: 'Website prices and instant estimates are a guide, not a contract — every event is different, and your final quote is confirmed in writing before anything is booked. A booking is confirmed once you accept your quote and pay any agreed deposit.' },
      { heading: 'Payments', body: 'Deposits secure your date. The balance is due before or on the event date as set out in your quote. Cash bar arrangements (where guests pay) are agreed in writing beforehand, including any minimum-spend terms.' },
      { heading: 'Cancellations & changes', body: 'Plans change — tell us as early as you can. Cancellation terms (including whether your deposit is refundable) are set out in your quote. Where we can move your booking to a new date instead, we will always try to.' },
      { heading: 'Alcohol & licensing', body: 'We serve responsibly. Our team are experienced and, where required, personal-licence holders. We will not serve anyone under 25 without valid ID, or anyone excessively intoxicated — this protects you, your guests and your venue.' },
      { heading: 'On the day', body: 'We need reasonable access for setup and breakdown, and a safe, level spot for the bar (we will confirm space and power needs with you in advance). Our equipment remains our property; accidental damage caused by guests may be charged at cost.' },
      { heading: 'The boring-but-important bit', body: 'The Bar People Ltd holds public liability insurance. Nothing in these terms affects your statutory rights. Any questions — jake@thebarpeople.co.uk and we will talk it through like humans.' },
    ],
    seo_title: 'Terms of Service',
    seo_description: 'The terms that apply when you book The Bar People for your event.',
  },
  footer: {
    services_heading: 'Services',
    events_heading: 'Events',
    company_heading: 'Company',
    company_links: [
      { link: { href: '/about', label: 'About Us' } },
      { link: { href: '/our-bars', label: 'Our Bars' } },
      { link: { href: '/gallery', label: 'Gallery' } },
      { link: { href: '/contact', label: 'Contact' } },
      { link: { href: '/quote', label: 'Get a Quote' } },
    ],
    privacy_label: 'Privacy',
    terms_label: 'Terms',
  },
  // The commissioned homepage (/new), generated from the page's own bundled
  // content so the seed is exactly what the page shows (src/content/new-home.ts).
  ...homeSeed(),
};

/**
 * The 17 strings anyOS live-edit (Website 2.0) can override on the current pages,
 * mapped to where they live in this manifest. `savedInAnyos` is what anyOS was
 * serving on 3 Nov 2026 (read-only GET); undefined means nothing saved there.
 */
export const ANYOS_LIVE_EDIT_MAP: Record<string, { section: string; field: string; savedInAnyos?: string }> = {
  'hero.eyebrow': { section: 'home_hero', field: 'eyebrow', savedInAnyos: 'Premium Mobile Bar Hire' },
  'hero.title': { section: 'home_hero', field: 'title', savedInAnyos: 'Unforgettable events!' },
  'hero.subtitle': { section: 'home_hero', field: 'subtitle', savedInAnyos: 'We bring the bar, the staff, the drinks, and the vibe. You just bring the gue' },
  'services.eyebrow': { section: 'services_intro', field: 'eyebrow', savedInAnyos: 'What We Do' },
  'services.title': { section: 'services_intro', field: 'title', savedInAnyos: 'Tailored Bar Solutions for Every Event' },
  'services.subtitle': { section: 'services_intro', field: 'subtitle', savedInAnyos: "From intimate gatherings to 500-guest galas — we have a package that's right for you." },
  'bars.eyebrow': { section: 'bars_intro', field: 'eyebrow', savedInAnyos: 'Our Bars' },
  'bars.title': { section: 'bars_intro', field: 'title', savedInAnyos: 'A Bar for Every Event' },
  'bars.subtitle': { section: 'bars_intro', field: 'subtitle', savedInAnyos: 'Any colour. Indoor or outdoor. Fully modular.' },
  'testimonials.eyebrow': { section: 'testimonials_intro', field: 'eyebrow', savedInAnyos: 'Testimonials' },
  'testimonials.title': { section: 'testimonials_intro', field: 'title', savedInAnyos: 'Trusted by Thousands' },
  'cta.eyebrow': { section: 'cta', field: 'eyebrow', savedInAnyos: 'Get Started' },
  'cta.title': { section: 'cta', field: 'title', savedInAnyos: 'Ready to Build Your Perfect Bar?' },
  'cta.subtitle': { section: 'cta', field: 'subtitle', savedInAnyos: 'Get an instant estimate — no commitment, no waiting.' },
  'footer.strapline': { section: 'business', field: 'strapline', savedInAnyos: 'Premium mobile bar hire. Pop-up bars, professional bartenders, and unforgettable experiences since 2014.' },
  'about.title': { section: 'about_page', field: 'title' },
  'contact.title': { section: 'contact_page', field: 'title' },
};
