import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Garden Party Bar Hire",
  description: "Outdoor bars for garden parties. Fully weather-proofed, beautifully styled, with everything you need for the perfect alfresco event.",
  openGraph: {
    title: "Garden Party Bar Hire | The Bar People",
    description: "Outdoor bars for garden parties. Fully weather-proofed and beautifully styled.",
  },
};

export default function GardenPartiesPage() {
  return (
    <ComingSoonShell
      title="Garden Party Bar Hire"
      subtitle="Beautiful outdoor bars for garden parties. Fully weatherproofed and perfectly styled."
      breadcrumb={[
        { label: "Events", href: "/events" },
        { label: "Garden Parties", href: "/events/garden-parties" },
      ]}
    />
  );
}
