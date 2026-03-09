import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the team behind The Bar People. London-based mobile bar hire specialists since 2014, led by Jake Lee and Kim Knight.",
  openGraph: {
    title: "About | The Bar People",
    description: "Meet the team behind The Bar People. Mobile bar hire specialists since 2014.",
  },
};

export default function AboutPage() {
  return (
    <ComingSoonShell
      title="About The Bar People"
      subtitle="London-based mobile bar hire specialists since 2014. Meet Jake, Kim, and the team."
      breadcrumb={[{ label: "About", href: "/about" }]}
    />
  );
}
