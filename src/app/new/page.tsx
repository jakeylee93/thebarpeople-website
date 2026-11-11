import '@/components/new-home/home.css';
import SnapPage from '@/components/new-home/SnapPage';
import { HowItWorksProvider } from '@/components/new-home/HowItWorks';
import HeroSlider from '@/components/new-home/HeroSlider';
import Christmas from '@/components/new-home/sections/Christmas';
import Corporate from '@/components/new-home/sections/Corporate';
import Weddings from '@/components/new-home/sections/Weddings';
import Parties from '@/components/new-home/sections/Parties';
import Team from '@/components/new-home/sections/Team';
import MarqueePackage from '@/components/new-home/sections/MarqueePackage';
import GalleryCarousel from '@/components/new-home/GalleryCarousel';
import SiteFooter from '@/components/new-home/SiteFooter';
import PackageBuilder from '@/components/new-home/package/PackageBuilder';
import { HERO_SLIDES } from '@/components/new-home/data';

// /new — the new homepage Jake chose on 8 Nov 2026 (not live). One section per
// screen: SnapPage is the scrolling box, and holds the header and section dots.
// The order here must match SECTIONS in data.ts.
export default function NewHomePage() {
  return (
    <>
      <HowItWorksProvider>
        <SnapPage>
          <main>
            <HeroSlider slides={HERO_SLIDES} />
            <Christmas />
            <Corporate />
            <Weddings />
            <Parties />
            <Team />
            <MarqueePackage />
            <GalleryCarousel />
          </main>
          <SiteFooter />
        </SnapPage>
      </HowItWorksProvider>
      <PackageBuilder />
    </>
  );
}
