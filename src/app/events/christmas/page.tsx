import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Christmas Party Bar Hire",
  description: "Make this Christmas unforgettable. Festive cocktail menus, mulled wine stations, and premium bar hire for Christmas parties.",
  openGraph: {
    title: "Christmas Party Bar Hire | The Bar People",
    description: "Make this Christmas unforgettable with a premium bar hire.",
  },
};

export default function ChristmasPage() {
  return (
    <ComingSoonShell
      title="Christmas Party Bar Hire"
      subtitle="Festive cocktails, mulled wine stations, and premium bars for unforgettable Christmas parties."
      breadcrumb={[
        { label: "Events", href: "/events" },
        { label: "Christmas", href: "/events/christmas" },
      ]}
    />
  );
}
