import Header from '@/components/Header';
import Hero from '@/components/Hero';
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
