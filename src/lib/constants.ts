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
export const bars = [
  { name: 'Shimmer Bar', size: '5FT', tag: null, guests: 'Up to 50 guests', price: 'From £295', description: 'Intimate events & private parties' },
  { name: 'Classic Cocktail Bar', size: '10FT', tag: 'Popular', guests: 'Up to 100 guests', price: 'From £395', description: 'Weddings, birthdays & corporate' },
  { name: 'Horseshoe Bar', size: '15FT', tag: null, guests: 'Up to 150 guests', price: 'From £595', description: 'Larger events & festivals' },
  { name: 'Large Horseshoe', size: '35FT', tag: 'Recommended', guests: 'Up to 250 guests', price: 'From £895', description: 'Major corporate events & galas' },
  { name: 'Island Bar', size: '40FT', tag: 'Statement', guests: '250+ guests', price: 'From £1,195', description: 'Showstopper statement events' },
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
export const brands = [
  'Porsche', 'Bitcoin Conference', 'Goldman Sachs', 'HSBC',
  'Barclays', 'Google', 'Channel 4', 'Burberry',
  'Amazon', 'Virgin', 'NHS', 'The Shard',
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

// Glassware types — 1 per person default
export const glasswareTypes = [
  { id: 'wine', name: 'Wine glass' },
  { id: 'martini', name: 'Martini glass' },
  { id: 'whisky', name: 'Whisky tumbler' },
  { id: 'champagne', name: 'Champagne flute' },
  { id: 'highball', name: '12oz highball' },
  { id: 'margarita', name: 'Margarita glass' },
];

export const glassPrice = 0.75; // per glass

// Service base prices (non all-inclusive)
export const serviceBasePrices: Record<string, number> = {
  'cash-bar': 395,
  'dry-hire': 295,
  'staff-only': 200,
};
