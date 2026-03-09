import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bar hire tips, cocktail inspiration, event planning guides, and stories from The Bar People team.",
  openGraph: {
    title: "Blog | The Bar People",
    description: "Bar hire tips, cocktail inspiration, and event planning guides.",
  },
};

export default function BlogPage() {
  return (
    <ComingSoonShell
      title="The Bar People Blog"
      subtitle="Event planning tips, cocktail inspiration, and stories from 10 years of delivering unforgettable bars."
      breadcrumb={[{ label: "Blog", href: "/blog" }]}
    />
  );
}
