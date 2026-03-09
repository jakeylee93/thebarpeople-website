import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Corporate Bar Hire",
  description: "Elevate your corporate event with a premium bar experience. Product launches, client entertainment, team events, and conferences.",
  openGraph: {
    title: "Corporate Bar Hire | The Bar People",
    description: "Elevate your corporate event with a premium bar experience.",
  },
};

export default function CorporatePage() {
  return (
    <ComingSoonShell
      title="Corporate Bar Hire"
      subtitle="Elevate your corporate event. Product launches, client entertainment, team socials and conferences."
      breadcrumb={[
        { label: "Events", href: "/events" },
        { label: "Corporate", href: "/events/corporate" },
      ]}
    />
  );
}
