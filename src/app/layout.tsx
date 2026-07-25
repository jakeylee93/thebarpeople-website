import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const SITE_URL = 'https://thebarpeople-website.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'The Bar People | Premium Mobile Bar Hire London & Nationwide',
    template: '%s | The Bar People',
  },
  description:
    'Premium mobile bar hire for weddings, corporate events, and private parties. Pop-up bars, professional bartenders, and unforgettable experiences since 2014.',
  keywords: 'mobile bar hire, pop-up bar, cocktail bar hire, wedding bar, corporate bar hire, London bar hire',
  openGraph: {
    type: 'website',
    siteName: 'The Bar People',
    title: 'The Bar People | Premium Mobile Bar Hire',
    description: 'Pop-up bars, professional bartenders and unforgettable events since 2014. 850+ events. UK-wide.',
    images: [{ url: '/images/events/bar-event.jpg', width: 900, height: 636, alt: 'The Bar People pouring cocktails at a packed launch party' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Bar People | Premium Mobile Bar Hire',
    description: 'Pop-up bars, professional bartenders and unforgettable events since 2014.',
    images: ['/images/events/bar-event.jpg'],
  },
};

// LocalBusiness structured data — helps Google show the business properly
// (hours/contact/area) in search. Plain facts only, matching the footer.
const BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'The Bar People',
  description: 'Premium mobile bar hire — pop-up bars, professional bartenders and full drinks service for weddings, corporate and private events.',
  url: SITE_URL,
  logo: `${SITE_URL}/images/logos/bar-people-logo.png`,
  image: `${SITE_URL}/images/events/bar-event.jpg`,
  email: 'jake@thebarpeople.co.uk',
  telephone: '+447557402200',
  address: { '@type': 'PostalAddress', addressLocality: 'Leytonstone, London', addressCountry: 'GB' },
  areaServed: 'GB',
  foundingDate: '2014',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_JSON_LD) }}
        />
        {children}
        {/* anyOS live-edit: hydrates data-anyos text with saved content, and turns
            on click-to-edit when opened from the anyOS Website module. */}
        <Script src="https://platform.anyos.co.uk/edit.js" data-site="the-bar-people" strategy="afterInteractive" />
      </body>
    </html>
  );
}
