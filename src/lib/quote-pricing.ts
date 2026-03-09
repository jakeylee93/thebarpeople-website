import type { QuoteState, BarType, ServiceType, GlassType } from "./quote-types";

export interface PricingBreakdown {
  serviceBase: number;
  barCost: number;
  staffCost: number;
  glasswareCost: number;
  equipmentCost: number;
  extras: { label: string; amount: number }[];
  subtotal: number;
  vat: number;
  total: number;
}

// Bar prices (base cost for hire)
export const BAR_PRICES: Record<BarType, number> = {
  shimmer_5ft: 295,
  classic_10ft: 395,
  horseshoe_15ft: 595,
  large_horseshoe_35ft: 895,
  island_40ft: 1195,
};

export const BAR_DETAILS: Record<BarType, { name: string; capacity: number; size: string }> = {
  shimmer_5ft: { name: "Shimmer Bar", capacity: 50, size: "5FT" },
  classic_10ft: { name: "Classic Cocktail Bar", capacity: 100, size: "10FT" },
  horseshoe_15ft: { name: "Horseshoe Bar", capacity: 150, size: "15FT" },
  large_horseshoe_35ft: { name: "Large Horseshoe", capacity: 250, size: "35FT" },
  island_40ft: { name: "Island Bar", capacity: 999, size: "40FT" },
};

// Glassware definitions
export interface GlassDefinition {
  name: string;
  pricePerGlass: number;
  crateSize: number;
}

export const GLASS_DEFINITIONS: Record<GlassType, GlassDefinition> = {
  martini: { name: "Martini Glass", pricePerGlass: 0.85, crateSize: 8 },
  whisky_tumbler: { name: "Whisky Tumbler", pricePerGlass: 0.60, crateSize: 24 },
  champagne_flute: { name: "Champagne Flute", pricePerGlass: 0.60, crateSize: 35 },
  premium_flute: { name: "Premium Flute", pricePerGlass: 0.80, crateSize: 35 },
  wine_glass: { name: "Wine Glass", pricePerGlass: 0.60, crateSize: 24 },
  large_wine_glass: { name: "Large Wine Glass", pricePerGlass: 0.70, crateSize: 20 },
  margarita: { name: "Margarita Glass", pricePerGlass: 0.85, crateSize: 8 },
  gin_bowl: { name: "Gin Bowl", pricePerGlass: 0.85, crateSize: 8 },
  shot_glass: { name: "Shot Glasses", pricePerGlass: 0.30, crateSize: 25 },
};

export const GLASS_TYPE_ORDER: GlassType[] = [
  "martini",
  "whisky_tumbler",
  "champagne_flute",
  "premium_flute",
  "wine_glass",
  "large_wine_glass",
  "margarita",
  "gin_bowl",
  "shot_glass",
];

export function getGlassCrateCost(glassType: GlassType, crates: number): number {
  const def = GLASS_DEFINITIONS[glassType];
  return Math.round(crates * def.crateSize * def.pricePerGlass * 100) / 100;
}

export function getRecommendedGlassCrates(guestCount: number): Partial<Record<GlassType, number>> {
  const wineGlassCrates = Math.ceil(guestCount / 24) + 1;
  const fluteCrates = Math.ceil(guestCount / 35) + 1;
  const tumblerCrates = Math.ceil(guestCount / 24) + 1;
  return {
    wine_glass: wineGlassCrates,
    champagne_flute: fluteCrates,
    whisky_tumbler: tumblerCrates,
  };
}

// Equipment pricing
export const EQUIPMENT_PRICES = {
  backBarFridge: 125,      // per unit
  tallWineFridge: 240,     // per unit
  circularLedFull: 900,    // flat
  circularLedHalf: 500,    // flat
};

// Get guest tier (0-indexed)
function getGuestTier(guestCount: number): 0 | 1 | 2 | 3 {
  if (guestCount <= 50) return 0;
  if (guestCount <= 100) return 1;
  if (guestCount <= 150) return 2;
  return 3;
}

// All inclusive pricing
const ALL_INCLUSIVE_BASE = [1495, 2995, 4495, 6995]; // per tier at 4 hrs
const ALL_INCLUSIVE_EXTRA_HOUR = [200, 350, 450, 550]; // per tier per extra hour

// Cash bar pricing
const CASH_BAR_BASE = [695, 1295, 1995, 3495];
const CASH_BAR_EXTRA_HOUR = [100, 175, 250, 350];

export function getServiceBasePrice(serviceType: ServiceType, guestCount: number, duration: number): number {
  const tier = getGuestTier(guestCount);
  const extraHours = Math.max(0, duration - 4);

  switch (serviceType) {
    case "all_inclusive": {
      return ALL_INCLUSIVE_BASE[tier] + extraHours * ALL_INCLUSIVE_EXTRA_HOUR[tier];
    }
    case "cash_bar": {
      return CASH_BAR_BASE[tier] + extraHours * CASH_BAR_EXTRA_HOUR[tier];
    }
    case "dry_hire":
    case "staff_only":
      return 0;
  }
}

// Service starting prices (at 4hrs, for display on Step 3 cards)
export function getServiceStartingPrice(serviceType: ServiceType, guestCount: number): number {
  return getServiceBasePrice(serviceType, guestCount, 4);
}

export function getStaffCost(serviceType: ServiceType, guestCount: number, duration: number): number {
  // All inclusive already includes staff. Staff only and cash bar add staff separately.
  if (serviceType === "all_inclusive") return 0;
  if (serviceType === "dry_hire") return 0;

  const mixologists = Math.ceil(guestCount / 50);
  const bartenders = Math.ceil(guestCount / 60);
  const barbacks = Math.ceil(guestCount / 100);
  const eventManager = guestCount >= 100 ? 1 : 0;

  const staffCost =
    mixologists * 30 * duration +
    bartenders * 25 * duration +
    barbacks * 18 * duration +
    eventManager * 35 * duration;

  return staffCost;
}

export function getRecommendedBar(guestCount: number): BarType {
  if (guestCount <= 50) return "shimmer_5ft";
  if (guestCount <= 100) return "classic_10ft";
  if (guestCount <= 150) return "horseshoe_15ft";
  if (guestCount <= 250) return "large_horseshoe_35ft";
  return "island_40ft";
}

export function calculateGlasswareCost(glassware: Record<string, number>): number {
  return Object.entries(glassware).reduce((sum, [glassType, crates]) => {
    if (crates <= 0) return sum;
    const def = GLASS_DEFINITIONS[glassType as GlassType];
    if (!def) return sum;
    return sum + Math.round(crates * def.crateSize * def.pricePerGlass * 100) / 100;
  }, 0);
}

export function calculateEquipmentCost(equipment: QuoteState["equipment"]): number {
  return (
    equipment.backBarFridge * EQUIPMENT_PRICES.backBarFridge +
    equipment.tallWineFridge * EQUIPMENT_PRICES.tallWineFridge +
    (equipment.circularLedFull ? EQUIPMENT_PRICES.circularLedFull : 0) +
    (equipment.circularLedHalf ? EQUIPMENT_PRICES.circularLedHalf : 0)
  );
}

export function calculatePricing(state: QuoteState): PricingBreakdown {
  const { serviceType, barSelection, guestCount, duration, extras, glassware, equipment } = state;

  if (!serviceType) {
    return { serviceBase: 0, barCost: 0, staffCost: 0, glasswareCost: 0, equipmentCost: 0, extras: [], subtotal: 0, vat: 0, total: 0 };
  }

  const serviceBase = getServiceBasePrice(serviceType, guestCount, duration);
  const barCost = barSelection && serviceType !== "staff_only" ? BAR_PRICES[barSelection] : 0;
  const staffCost = getStaffCost(serviceType, guestCount, duration);
  const glasswareCost = calculateGlasswareCost(glassware);
  const equipmentCost = calculateEquipmentCost(equipment);

  const extrasBreakdown: { label: string; amount: number }[] = [];

  if (extras.cocktailMenu) extrasBreakdown.push({ label: "Cocktail Menu", amount: 5 * guestCount });
  if (extras.glasswareUpgrade) extrasBreakdown.push({ label: "Glassware Upgrade (Premium Crystal)", amount: 150 });
  if (extras.ledLighting) extrasBreakdown.push({ label: "LED Bar Lighting", amount: 200 });
  if (extras.barBranding) extrasBreakdown.push({ label: "Bar Branding (Custom Panels)", amount: 350 });
  if (extras.welcomeDrinks) extrasBreakdown.push({ label: "Welcome Drinks", amount: 4 * guestCount });
  if (extras.lateNightExtension > 0)
    extrasBreakdown.push({ label: `Late Night Extension (+${extras.lateNightExtension}h)`, amount: 150 * extras.lateNightExtension });
  if (extras.cocktailMasterclass) extrasBreakdown.push({ label: "Cocktail Masterclass", amount: 25 * guestCount });
  if (extras.mocktailPackage) extrasBreakdown.push({ label: "Mocktail Package", amount: 3 * guestCount });
  if (extras.extraStaff > 0)
    extrasBreakdown.push({ label: `Extra Staff (${extras.extraStaff}x)`, amount: 25 * duration * extras.extraStaff });

  const extrasTotal = extrasBreakdown.reduce((sum, e) => sum + e.amount, 0);
  const subtotal = serviceBase + barCost + staffCost + glasswareCost + equipmentCost + extrasTotal;
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  return { serviceBase, barCost, staffCost, glasswareCost, equipmentCost, extras: extrasBreakdown, subtotal, vat, total };
}

export function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(amount);
}
