import type { Metadata } from 'next';
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
      </body>
    </html>
  );
}
