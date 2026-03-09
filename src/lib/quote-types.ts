import { z } from "zod";

export type EventType = "wedding" | "corporate" | "birthday" | "garden_party" | "christmas" | "festival" | "other";
export type VenueType = "indoor" | "outdoor" | "both";
export type ServiceType = "all_inclusive" | "cash_bar" | "dry_hire" | "staff_only";
export type BarType = "shimmer_5ft" | "classic_10ft" | "horseshoe_15ft" | "large_horseshoe_35ft" | "island_40ft";

export const DURATION_OPTIONS = [3, 4, 5, 6, 7, 8, 10, 12] as const;
export type Duration = (typeof DURATION_OPTIONS)[number];

export type GlassType =
  | "martini"
  | "whisky_tumbler"
  | "champagne_flute"
  | "premium_flute"
  | "wine_glass"
  | "large_wine_glass"
  | "margarita"
  | "gin_bowl"
  | "shot_glass";

export interface GlasswareSelection {
  [key: string]: number; // key = GlassType, value = crate count
}

export interface EquipmentItem {
  backBarFridge: number;   // quantity
  tallWineFridge: number;  // quantity
  circularLedFull: boolean;
  circularLedHalf: boolean;
}

export interface ExtraItem {
  cocktailMenu: boolean;
  glasswareUpgrade: boolean;
  ledLighting: boolean;
  barBranding: boolean;
  welcomeDrinks: boolean;
  lateNightExtension: 0 | 1 | 2 | 3;
  cocktailMasterclass: boolean;
  mocktailPackage: boolean;
  extraStaff: number;
}

export interface QuoteState {
  currentStep: number;
  completedSteps: Set<number>;
  // Step 1
  eventType: EventType | null;
  eventDate: string;
  postcode: string;
  venueType: VenueType | null;
  // Step 2
  guestCount: number;
  duration: Duration;
  // Step 3
  serviceType: ServiceType | null;
  // Step 4
  barSelection: BarType | null;
  // Step 5
  glassware: GlasswareSelection;
  // Step 6
  equipment: EquipmentItem;
  extras: ExtraItem;
  // Step 7
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactCompany: string;
  eventNotes: string;
  termsAccepted: boolean;
}

export type QuoteAction =
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_EVENT_TYPE"; value: EventType }
  | { type: "SET_EVENT_DATE"; value: string }
  | { type: "SET_POSTCODE"; value: string }
  | { type: "SET_VENUE_TYPE"; value: VenueType }
  | { type: "SET_GUEST_COUNT"; value: number }
  | { type: "SET_DURATION"; value: Duration }
  | { type: "SET_SERVICE_TYPE"; value: ServiceType }
  | { type: "SET_BAR_SELECTION"; value: BarType | null }
  | { type: "SET_GLASSWARE"; glassType: GlassType; crates: number }
  | { type: "SET_EQUIPMENT"; key: keyof EquipmentItem; value: boolean | number }
  | { type: "SET_EXTRA"; key: keyof ExtraItem; value: boolean | number }
  | { type: "SET_CONTACT"; key: keyof Pick<QuoteState, "contactName" | "contactEmail" | "contactPhone" | "contactCompany" | "eventNotes">; value: string }
  | { type: "SET_TERMS"; value: boolean };

// Zod schemas for validation
export const step1Schema = z.object({
  eventType: z.enum(["wedding", "corporate", "birthday", "garden_party", "christmas", "festival", "other"]),
  eventDate: z.string().min(1, "Please select a date"),
  postcode: z.string().regex(/^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, "Please enter a valid UK postcode"),
  venueType: z.enum(["indoor", "outdoor", "both"]),
});

export const step2Schema = z.object({
  guestCount: z.number().min(10).max(500),
  duration: z.number().min(3).max(12),
});

export const step3Schema = z.object({
  serviceType: z.enum(["all_inclusive", "cash_bar", "dry_hire", "staff_only"]),
});

export const step4Schema = z.object({
  barSelection: z.enum(["shimmer_5ft", "classic_10ft", "horseshoe_15ft", "large_horseshoe_35ft", "island_40ft"]).nullable(),
});

export const step7Schema = z.object({
  contactName: z.string().min(2, "Please enter your name"),
  contactEmail: z.string().email("Please enter a valid email"),
  contactPhone: z.string().min(10, "Please enter a valid phone number"),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: "Please accept the terms" }) }),
});

// Keep step6Schema as alias for backward compat
export const step6Schema = step7Schema;
