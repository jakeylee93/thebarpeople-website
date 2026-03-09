import type { Metadata } from "next";
import { QuoteBuilder } from "@/components/quote/QuoteBuilder";

export const metadata: Metadata = {
  title: "Build Your Quote | The Bar People",
  description: "Get an instant personalised estimate for your mobile bar hire in under 60 seconds. Weddings, corporate events, parties & more.",
  openGraph: {
    title: "Build Your Quote | The Bar People",
    description: "Get an instant personalised estimate for your mobile bar hire in under 60 seconds.",
    type: "website",
  },
};

export default function QuotePage() {
  return <QuoteBuilder />;
}
