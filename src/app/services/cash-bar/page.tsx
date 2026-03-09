import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Cash Bar Hire",
  description: "Guests pay for their own drinks. You pay for the professional setup and staff. Ideal for large events.",
  openGraph: {
    title: "Cash Bar Hire | The Bar People",
    description: "Guests pay for their own drinks. You pay for the professional setup and staff.",
  },
};

export default function CashBarPage() {
  return (
    <ComingSoonShell
      title="Cash Bar Hire"
      subtitle="Guests pay for drinks, you pay for the setup. Perfect for large events where costs need managing."
      breadcrumb={[
        { label: "Services", href: "/services" },
        { label: "Cash Bar Hire", href: "/services/cash-bar" },
      ]}
    />
  );
}
