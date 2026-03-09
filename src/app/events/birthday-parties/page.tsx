import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Birthday Party Bar Hire",
  description: "Make your birthday one to remember. Professional bar hire for birthday parties of any size, anywhere in the UK.",
  openGraph: {
    title: "Birthday Party Bar Hire | The Bar People",
    description: "Make your birthday one to remember with a professional bar hire.",
  },
};

export default function BirthdayPartiesPage() {
  return (
    <ComingSoonShell
      title="Birthday Party Bar Hire"
      subtitle="Make your birthday one to remember. Professional bars for any size celebration."
      breadcrumb={[
        { label: "Events", href: "/events" },
        { label: "Birthday Parties", href: "/events/birthday-parties" },
      ]}
    />
  );
}
