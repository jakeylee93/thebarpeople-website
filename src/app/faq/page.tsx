import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about mobile bar hire — pricing, what's included, setup times, licensing, and more.",
  openGraph: {
    title: "FAQ | The Bar People",
    description: "Frequently asked questions about mobile bar hire.",
  },
};

export default function FaqPage() {
  return (
    <ComingSoonShell
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about hiring a mobile bar from The Bar People."
      breadcrumb={[{ label: "FAQ", href: "/faq" }]}
    />
  );
}
