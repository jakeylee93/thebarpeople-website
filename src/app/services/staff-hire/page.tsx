import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Bartender & Staff Hire",
  description: "Professional, certified bartenders for your own bar setup. Experienced, personable, impeccably presented.",
  openGraph: {
    title: "Staff Hire | The Bar People",
    description: "Professional, certified bartenders for your own bar setup.",
  },
};

export default function StaffHirePage() {
  return (
    <ComingSoonShell
      title="Staff Hire"
      subtitle="Professional bartenders for your own bar setup. Experienced, certified, and impeccably presented."
      breadcrumb={[
        { label: "Services", href: "/services" },
        { label: "Staff Hire", href: "/services/staff-hire" },
      ]}
    />
  );
}
