import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Services",
  description: "Explore our range of mobile bar hire services — all inclusive, cash bar, dry hire, staff hire, and event management.",
  openGraph: {
    title: "Services | The Bar People",
    description: "Explore our range of mobile bar hire services.",
  },
};

export default function ServicesPage() {
  return (
    <ComingSoonShell
      title="Our Services"
      subtitle="From all-inclusive packages to staff-only hire — we have a solution for every event."
      breadcrumb={[{ label: "Services", href: "/services" }]}
    />
  );
}
