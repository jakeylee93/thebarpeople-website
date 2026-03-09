import { Section } from "@/components/ui/Section";
import { LogoStrip } from "@/components/ui/LogoStrip";

const brands = [
  { name: "Porsche" },
  { name: "Bitcoin Conference" },
  { name: "Goldman Sachs" },
  { name: "HSBC" },
  { name: "Barclays" },
  { name: "Google" },
  { name: "Channel 4" },
  { name: "Burberry" },
  { name: "Amazon" },
  { name: "Virgin" },
  { name: "NHS" },
  { name: "The Shard" },
];

export function TrustedBySection() {
  return (
    <Section dark className="py-14">
      <p className="text-center text-[#faf8f5]/40 text-xs font-semibold uppercase tracking-[0.2em] mb-8">
        Trusted by leading brands & organisations
      </p>
      <LogoStrip logos={brands} />
    </Section>
  );
}
