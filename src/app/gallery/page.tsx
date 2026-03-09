import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Browse our gallery of events — weddings, corporate events, festivals, and more. See our bars in action.",
  openGraph: {
    title: "Gallery | The Bar People",
    description: "Browse our gallery of events and see our bars in action.",
  },
};

export default function GalleryPage() {
  return (
    <ComingSoonShell
      title="Gallery"
      subtitle="850+ events and counting. Browse our portfolio of weddings, corporate events, festivals and more."
      breadcrumb={[{ label: "Gallery", href: "/gallery" }]}
    />
  );
}
