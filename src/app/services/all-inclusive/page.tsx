import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "All Inclusive Bar Hire",
  description: "Everything included — drinks, staff, bar, and glassware. The ultimate hassle-free bar hire experience. From £29.90 per head.",
  openGraph: {
    title: "All Inclusive Bar Hire | The Bar People",
    description: "Everything included — drinks, staff, bar, and glassware. From £29.90 per head.",
  },
};

export default function AllInclusivePage() {
  return (
    <ComingSoonShell
      title="All Inclusive Hire"
      subtitle="Everything included. Drinks, staff, bar, glassware. The ultimate hassle-free experience from £29.90/head."
      breadcrumb={[
        { label: "Services", href: "/services" },
        { label: "All Inclusive Hire", href: "/services/all-inclusive" },
      ]}
    />
  );
}
