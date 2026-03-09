import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Event Management",
  description: "Full event coordination from concept to execution. We handle everything so you can enjoy the night.",
  openGraph: {
    title: "Event Management | The Bar People",
    description: "Full event coordination from concept to execution.",
  },
};

export default function EventManagementPage() {
  return (
    <ComingSoonShell
      title="Event Management"
      subtitle="Full event coordination from start to finish. You relax — we handle everything."
      breadcrumb={[
        { label: "Services", href: "/services" },
        { label: "Event Management", href: "/services/event-management" },
      ]}
    />
  );
}
