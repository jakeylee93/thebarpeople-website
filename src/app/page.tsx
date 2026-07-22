import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AvailabilityChecker from '@/components/AvailabilityChecker';
import ServicesSection from '@/components/ServicesSection';
import BarsSection from '@/components/BarsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import BrandMarquee from '@/components/BrandMarquee';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* Phones get the availability/pricing card right under the hero (it
            sits inside the hero on desktop). */}
        <section className="flex justify-center bg-faint px-4 py-10 lg:hidden">
          <AvailabilityChecker />
        </section>
        <ServicesSection />
        <BarsSection />
        <TestimonialsSection />
        <BrandMarquee />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
