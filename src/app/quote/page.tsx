import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Build Your Quote",
  description: "Get an instant personalised quote for your mobile bar hire. Tell us about your event and get a price in 60 seconds.",
  openGraph: {
    title: "Build Your Quote | The Bar People",
    description: "Get an instant personalised quote in 60 seconds.",
  },
};

export default function QuotePage() {
  return (
    <ComingSoonShell
      title="Build Your Quote"
      subtitle="The instant quote builder is coming in Stage 2. In the meantime, get in touch and we'll quote you manually."
      breadcrumb={[{ label: "Quote", href: "/quote" }]}
    />
  );
}
