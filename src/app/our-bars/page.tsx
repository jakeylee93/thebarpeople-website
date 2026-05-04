import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { bars } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Our Bars | The Bar People',
  description: 'Explore our range of modular pop-up bars — from intimate 5FT shimmer bars to 40FT island showstoppers.',
};

export default function OurBarsPage() {
  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our Collection</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal md:text-5xl">
              A Bar for Every Event
            </h1>
            <p className="mt-4 text-lg text-muted">
              Any colour. Indoor or outdoor. Fully modular. Choose your perfect setup.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {bars.map((bar) => (
              <div
                key={bar.name}
                className="relative overflow-hidden rounded-2xl border border-warm-border bg-white transition-all hover:shadow-lg"
              >
                <div className="flex h-52 items-center justify-center bg-gradient-to-br from-cream-dark to-cream">
                  <span className="font-heading text-6xl font-bold text-gold/20">{bar.size}</span>
                  {bar.tag && (
                    <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white">
                      {bar.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-2xl font-semibold text-charcoal">{bar.name}</h2>
                  <p className="mt-1 text-muted">{bar.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted">{bar.guests}</p>
                      <p className="text-lg font-bold text-gold">{bar.price}</p>
                    </div>
                    <Link
                      href="/quote"
                      className="rounded-full bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition-all hover:bg-gold hover:text-white"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-semibold text-white shadow-lg shadow-gold/20 transition-all hover:bg-gold-hover hover:shadow-xl"
            >
              Price My Event
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
