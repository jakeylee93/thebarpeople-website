import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "The Bar People | Mobile Bar Hire London & Nationwide",
    template: "%s | The Bar People",
  },
  description:
    "Premium mobile bar hire for weddings, corporate events, parties & festivals. Professional bartenders, pop-up bars, glassware & drinks packages. Build your perfect bar in 60 seconds.",
  keywords: [
    "mobile bar hire",
    "pop-up bar",
    "cocktail bar hire",
    "wedding bar",
    "corporate bar",
    "London bar hire",
    "bartender hire",
    "event bar",
    "The Bar People",
  ],
  authors: [{ name: "The Bar People" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://thebarpeople.co.uk",
    siteName: "The Bar People",
    title: "The Bar People | Mobile Bar Hire London & Nationwide",
    description:
      "Premium mobile bar hire for weddings, corporate events, parties & festivals. Build your perfect bar in 60 seconds.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&h=630&fit=crop",
        width: 1200,
        height: 630,
        alt: "The Bar People - Premium Mobile Bar Hire",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Bar People | Mobile Bar Hire London & Nationwide",
    description:
      "Premium mobile bar hire for weddings, corporate events, parties & festivals.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
