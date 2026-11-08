import SiteHeader from '@/components/new-home/SiteHeader';
import HeroSlider from '@/components/new-home/HeroSlider';
import ClientLogos from '@/components/new-home/ClientLogos';
import ChristmasPromo from '@/components/new-home/ChristmasPromo';
import GalleryCarousel from '@/components/new-home/GalleryCarousel';
import SiteFooter from '@/components/new-home/SiteFooter';
import PackageBuilder from '@/components/new-home/package/PackageBuilder';
import { HERO_SLIDES } from '@/components/new-home/data';

// /new — the new homepage Jake chose on 8 Nov 2026 (not live).
export default function NewHomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSlider slides={HERO_SLIDES} />
        <ClientLogos />
        <ChristmasPromo />
        <GalleryCarousel />
      </main>
      <SiteFooter />
      <PackageBuilder />
    </>
  );
}
