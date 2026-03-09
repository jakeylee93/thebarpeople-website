import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Festival Bar Hire",
  description: "Mobile bars for festivals and large outdoor events. High-volume, high-quality bar service for thousands of guests.",
  openGraph: {
    title: "Festival Bar Hire | The Bar People",
    description: "Mobile bars for festivals and large outdoor events.",
  },
};

export default function FestivalsPage() {
  return (
    <ComingSoonShell
      title="Festival Bar Hire"
      subtitle="High-volume, high-quality bar service for festivals and large outdoor events."
      breadcrumb={[
        { label: "Events", href: "/events" },
        { label: "Festivals", href: "/events/festivals" },
      ]}
    />
  );
}
