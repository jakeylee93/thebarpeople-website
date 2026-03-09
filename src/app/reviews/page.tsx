import type { Metadata } from "next";
import { ComingSoonShell } from "@/components/ui/ComingSoonShell";

export const metadata: Metadata = {
  title: "Reviews",
  description: "Read what our clients say about The Bar People. 5-star reviews from weddings, corporate events, and private parties.",
  openGraph: {
    title: "Reviews | The Bar People",
    description: "5-star reviews from weddings, corporate events, and private parties.",
  },
};

export default function ReviewsPage() {
  return (
    <ComingSoonShell
      title="Client Reviews"
      subtitle="Over 850 events delivered. Thousands of happy clients. Read what they say."
      breadcrumb={[{ label: "Reviews", href: "/reviews" }]}
    />
  );
}
