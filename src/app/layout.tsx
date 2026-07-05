import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Bar People | Premium Mobile Bar Hire London & Nationwide',
  description:
    'Premium mobile bar hire for weddings, corporate events, and private parties. Pop-up bars, professional bartenders, and unforgettable experiences since 2014.',
  keywords: 'mobile bar hire, pop-up bar, cocktail bar hire, wedding bar, corporate bar hire, London bar hire',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {/* anyOS live-edit: hydrates data-anyos text with saved content, and turns
            on click-to-edit when opened from the anyOS Website module. */}
        <Script src="https://platform.anyos.co.uk/edit.js" data-site="the-bar-people" strategy="afterInteractive" />
      </body>
    </html>
  );
}
