import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Events We Cater For",
  description: "Mobile bar hire for weddings, corporate events, birthday parties, garden parties, festivals and Christmas parties.",
  openGraph: {
    title: "Events | The Bar People",
    description: "Mobile bar hire for every type of event.",
  },
};

export default function EventsPage() {
  return (
    <ComingSoonShell
      title="Events We Love"
      subtitle="From intimate weddings to major festivals — we bring the bar to you."
      breadcrumb={[{ label: "Events", href: "/events" }]}
    />
  );
}
