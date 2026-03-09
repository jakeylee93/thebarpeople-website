import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Our Bars",
  description: "Explore our range of modular bars — from the intimate 5ft Shimmer Bar to the statement 40ft Island Bar. Any colour, indoor or outdoor.",
  openGraph: {
    title: "Our Bars | The Bar People",
    description: "Explore our range of modular bars from intimate to showstopper.",
  },
};

export default function OurBarsPage() {
  return (
    <ComingSoonShell
      title="Our Bars"
      subtitle="From the intimate 5ft Shimmer to the statement 40ft Island Bar. Any colour, indoor or outdoor, fully modular."
      breadcrumb={[{ label: "Our Bars", href: "/our-bars" }]}
    />
  );
}
