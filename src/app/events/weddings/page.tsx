import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Wedding Bar Hire",
  description: "Make your wedding bar unforgettable. Bespoke cocktail menus, stunning bar setups, and professional bartenders for your perfect day.",
  openGraph: {
    title: "Wedding Bar Hire | The Bar People",
    description: "Make your wedding bar unforgettable. Bespoke cocktail menus and stunning bar setups.",
  },
};

export default function WeddingsPage() {
  return (
    <ComingSoonShell
      title="Wedding Bar Hire"
      subtitle="Make your wedding bar as beautiful and unforgettable as your day. Bespoke cocktail menus, stunning setups."
      breadcrumb={[
        { label: "Events", href: "/events" },
        { label: "Weddings", href: "/events/weddings" },
      ]}
    />
  );
}
