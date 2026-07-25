// ─── Services ───
export const services = [
  {
    slug: 'all-inclusive',
    name: 'All Inclusive Hire',
    tag: 'Most Popular',
    description: 'Everything included. Drinks, staff, bar, glassware. The ultimate hassle-free experience.',
    price: 'From £29.90/head',
    features: [
      'Full bar setup & breakdown',
      'Professional bartenders',
      'Premium spirits, wines & beers',
      'Signature cocktail menu',
      'All glassware included',
      'Ice & garnishes',
      'Bar equipment & fridges',
    ],
  },
  {
    slug: 'cash-bar',
    name: 'Cash Bar Hire',
    tag: null,
    description: 'Guests pay for their own drinks. You pay for the professional setup and staff.',
    price: 'From £395',
    features: [
      'Full bar setup & breakdown',
      'Professional bartenders',
      'Card payment terminals',
      'Full drinks menu',
      'All glassware included',
      'Ice & garnishes',
      'Revenue share options available',
    ],
  },
  {
    slug: 'dry-hire',
    name: 'Dry Hire',
    tag: null,
    description: 'Bar equipment rental. You source the drinks, we provide the beautiful bar and glassware.',
    price: 'From £295',
    features: [
      'Modular bar unit delivery & setup',
      'Choice of bar size & style',
      'Glassware hire available',
      'Ice bins & coolers',
      'Bar accessories',
      'Delivery & collection',
      'Setup guidance provided',
    ],
  },
  {
    slug: 'staff-hire',
    name: 'Staff Hire',
    tag: 'Flexible',
    description: 'Professional, certified bartenders for your own bar setup. Experienced, personable, impeccable.',
    price: 'From £200',
    features: [
      'Experienced bartenders',
      'SIA-licensed security available',
      'APLH/Personal licence holders',
      'Professional uniforms',
      'Flexible shift lengths',
      'Event managers available',
      'Full team coordination',
    ],
  },
  {
    slug: 'event-management',
    name: 'Event Management',
    tag: 'Premium',
    description: 'Full event coordination from concept to execution. We handle everything so you can enjoy the night.',
    price: 'POA',
    features: [
      'End-to-end planning',
      'Venue sourcing & liaison',
      'Supplier coordination',
      'Timeline & logistics management',
      'On-the-day coordination',
      'Budget management',
      'Post-event wrap-up',
    ],
  },
];

// ─── Bars ───
// Real event photos represent each bar (the island/horseshoe/straight-bar
// renders in images/bars are sketches — kept for reference, not shown).
export const bars = [
  { name: 'Shimmer Bar', size: '5FT', tag: null, guests: 'Up to 50 guests', price: 'From £295', description: 'Intimate events & private parties', image: '/images/events/mirror-bar.jpg' },
  { name: 'Classic Cocktail Bar', size: '10FT', tag: 'Popular', guests: 'Up to 100 guests', price: 'From £395', description: 'Weddings, birthdays & corporate', image: '/images/events/garden-bar.jpg' },
  { name: 'Horseshoe Bar', size: '15FT', tag: null, guests: 'Up to 150 guests', price: 'From £595', description: 'Larger events & festivals', image: '/images/events/hp-bar.jpg' },
  { name: 'Large Horseshoe', size: '35FT', tag: 'Recommended', guests: 'Up to 250 guests', price: 'From £895', description: 'Major corporate events & galas', image: '/images/events/salesforce-bar-2.jpg' },
  { name: 'Island Bar', size: '40FT', tag: 'Statement', guests: '250+ guests', price: 'From £1,195', description: 'Showstopper statement events', image: '/images/events/salesforce-bar.jpg' },
];

// ─── Testimonials ───
export const testimonials = [
  { name: 'Sarah & Tom', event: 'Wedding Reception', initial: 'S', quote: 'Jake and his team were incredible at our wedding. The cocktail bar was the highlight of the entire evening — guests are still talking about it months later.' },
  { name: 'David Chen', event: 'Corporate Event', initial: 'D', quote: 'Professional, punctual, and the cocktails were outstanding. Our corporate event was elevated to another level entirely. We\'ll be booking again.' },
  { name: 'Rachel Moore', event: 'Christmas Party', initial: 'R', quote: 'We\'ve used The Bar People three years running for our Christmas party. Wouldn\'t go anywhere else — they know us, they know our guests, and they deliver every time.' },
  { name: 'James Wright', event: 'Charity Gala', initial: 'J', quote: 'The team handled our 200-guest charity gala flawlessly. Vish and Monique were absolute stars. The signature cocktail they created for us was perfect.' },
  { name: 'Mark Stevens', event: 'Corporate Launch', initial: 'M', quote: 'From the initial quote to the event itself, everything was seamless. The Porsche team absolutely loved it — premium in every sense.' },
];

// ─── Brands ───
// Real client logos (public/images/brands). Names without a logo file ride
// along as text so the strip stays full.
export const brandLogos = [
  { name: 'O2', src: '/images/brands/o2.png' },
  { name: 'Sky', src: '/images/brands/sky.png' },
  { name: 'Salesforce', src: '/images/brands/salesforce.png' },
  { name: 'HPE', src: '/images/brands/hpe.png' },
  { name: 'ITV2', src: '/images/brands/itv2.png' },
  { name: 'Boux Avenue', src: '/images/brands/boux-avenue.png' },
  { name: 'Batiste', src: '/images/brands/batiste.png' },
  { name: 'Bulb', src: '/images/brands/bulb.png' },
];
export const brands = ['Porsche', 'Superdrug', 'Hewlett Packard Enterprise', 'CRATE Brewery'];

// ─── Gallery (real event photos) ───
export const galleryImages = [
  { src: '/images/events/bar-event.jpg', label: 'Boux Avenue launch party', category: 'Corporate' },
  { src: '/images/events/salesforce-bar.jpg', label: 'Salesforce island bar', category: 'Corporate' },
  { src: '/images/events/salesforce-bar-2.jpg', label: 'Salesforce Tower bar', category: 'Corporate' },
  { src: '/images/events/hp-bar.jpg', label: 'HPE winter party', category: 'Corporate' },
  { src: '/images/events/hp-mini-island.jpg', label: 'HPE cocktail station', category: 'Corporate' },
  { src: '/images/events/porsche.jpg', label: 'Porsche launch', category: 'Corporate' },
  { src: '/images/events/porsche-custom.jpg', label: 'Porsche custom build', category: 'Corporate' },
  { src: '/images/events/porsche-staff.jpg', label: 'Porsche bar team', category: 'Corporate' },
  { src: '/images/events/superdrug.jpg', label: 'Superdrug event', category: 'Corporate' },
  { src: '/images/events/boux-avenue.jpg', label: 'Boux Avenue bar', category: 'Corporate' },
  { src: '/images/events/jake-corporate.jpg', label: 'Flamed cocktails, live', category: 'Corporate' },
  { src: '/images/events/love-mirror.jpg', label: 'LOVE mirror bar', category: 'Weddings' },
  { src: '/images/events/mirror-bar-outside.jpg', label: 'Mirror bar, al fresco', category: 'Weddings' },
  { src: '/images/events/marquee-bar.jpg', label: 'Marquee lawn bar', category: 'Weddings' },
  { src: '/images/events/hip-hooray.jpg', label: 'Hip hip hooray', category: 'Private' },
  { src: '/images/events/garden-bar.jpg', label: 'Garden party bar', category: 'Private' },
  { src: '/images/events/mirror-bar.jpg', label: 'Shimmer bar at home', category: 'Private' },
  { src: '/images/events/outdoor-bar.jpg', label: 'Outdoor setup', category: 'Private' },
  { src: '/images/events/special-occasions.jpg', label: 'Special occasions', category: 'Private' },
  { src: '/images/events/cocktails.jpg', label: 'Signature serves', category: 'Cocktails' },
  { src: '/images/events/martini-pour.jpg', label: 'Martini pour', category: 'Cocktails' },
  { src: '/images/events/martini-daiquiri.jpg', label: 'Martinis & daiquiris', category: 'Cocktails' },
  { src: '/images/events/pina-colada.jpg', label: 'Piña coladas', category: 'Cocktails' },
];
export const teamPhotos = [
  { src: '/images/events/alex.jpg', name: 'Alex' },
  { src: '/images/events/glody.jpg', name: 'Glody' },
  { src: '/images/events/staff-alex.jpg', name: 'Behind the bar' },
];

// ─── Event Types ───
export const eventTypes = [
  { slug: 'weddings', name: 'Weddings', description: 'Make your big day unforgettable with a premium bar experience your guests will rave about.' },
  { slug: 'corporate', name: 'Corporate Events', description: 'Impress clients and reward teams with polished, professional bar service.' },
  { slug: 'birthday-parties', name: 'Birthday Parties', description: 'Celebrate in style with cocktails, mocktails, and a setup that wows.' },
  { slug: 'garden-parties', name: 'Garden Parties', description: 'Al fresco drinks done right — beautiful bars for outdoor entertaining.' },
  { slug: 'festivals', name: 'Festivals', description: 'High-volume, high-energy bar setups built for festival crowds.' },
  { slug: 'christmas', name: 'Christmas Parties', description: 'Festive cocktails, winter warmers, and party vibes to see out the year.' },
];

// ─── Navigation ───
export const navLinks = [
  { href: '/services/all-inclusive', label: 'Services' },
  { href: '/our-bars', label: 'Our Bars' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

// ─── Quote Builder ───

// Per-head pricing by hours (all-inclusive)
// 5h = £30, 6h = £35, 7h = £40, 8h = £45, etc.
export const perHeadByHours: Record<number, number> = {
  3: 20,
  4: 25,
  5: 30,
  6: 35,
  7: 40,
  8: 45,
  9: 50,
  10: 55,
  11: 60,
  12: 65,
};

export const barPrices: Record<string, number> = {
  '5ft': 295,
  '10ft': 395,
  '15ft': 595,
  '35ft': 895,
  '40ft': 1195,
};

// Equipment options with prices
export const equipmentOptions = [
  { id: 'fridge-single', name: 'Single door fridge', price: 75, unit: 'each' },
  { id: 'fridge-double', name: 'Double door fridge', price: 120, unit: 'each' },
  { id: 'ice-well', name: 'Ice well (50kg)', price: 45, unit: 'each' },
  { id: 'ice-delivery', name: 'Ice delivery (per 10kg bag)', price: 15, unit: 'per bag' },
  { id: 'bottle-cooler', name: 'Bottle cooler bin', price: 25, unit: 'each' },
  { id: 'speed-rail', name: 'Speed rail', price: 20, unit: 'each' },
  { id: 'cocktail-station', name: 'Cocktail prep station', price: 85, unit: 'each' },
  { id: 'beer-tap', name: 'Beer tap system (2 lines)', price: 150, unit: 'each' },
  { id: 'lighting', name: 'Bar LED lighting package', price: 95, unit: 'flat' },
  { id: 'branded-panels', name: 'Branded bar panels', price: 350, unit: 'flat' },
];

// Glassware types — pack quantities
export const glasswareTypes = [
  { id: 'wine', name: 'Wine glass', pack: 24 },
  { id: 'whisky', name: 'Whisky tumbler', pack: 24 },
  { id: 'champagne', name: 'Champagne flute', pack: 35 },
  { id: 'premium-champagne', name: 'Premium champagne flute', pack: 20 },
  { id: 'premium-wine', name: 'Premium wine glass', pack: 20 },
  { id: 'martini', name: 'Martini glass', pack: 8 },
  { id: 'margarita', name: 'Margarita glass', pack: 8 },
  { id: 'highball', name: '12oz highball', pack: 35 },
];

export const glassPrice = 0.60; // per glass

// Service base prices (non all-inclusive)
export const serviceBasePrices: Record<string, number> = {
  'cash-bar': 395,
  'dry-hire': 295,
  'staff-only': 200,
};
