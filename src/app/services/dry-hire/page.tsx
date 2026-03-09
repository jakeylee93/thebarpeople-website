import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Dry Hire — Bar Equipment Rental",
  description: "Bar equipment rental. You bring the drinks, we provide the beautiful bar and glassware. From £295.",
  openGraph: {
    title: "Dry Hire | The Bar People",
    description: "Bar equipment rental. You bring the drinks, we provide the beautiful bar and glassware.",
  },
};

export default function DryHirePage() {
  return (
    <ComingSoonShell
      title="Dry Hire"
      subtitle="Bar equipment rental. You bring the drinks — we provide the beautiful bar, glassware, and ice."
      breadcrumb={[
        { label: "Services", href: "/services" },
        { label: "Dry Hire", href: "/services/dry-hire" },
      ]}
    />
  );
}
