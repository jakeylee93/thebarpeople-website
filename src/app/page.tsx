import { HeroSection } from "@/components/sections/HeroSection";
import { StatsBar } from "@/components/sections/StatsBar";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { BarsShowcase } from "@/components/sections/BarsShowcase";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { TrustedBySection } from "@/components/sections/TrustedBySection";
import { CtaSection } from "@/components/sections/CtaSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <BarsShowcase />
      <TestimonialsSection />
      <TrustedBySection />
      <CtaSection />
    </>
  );
}
