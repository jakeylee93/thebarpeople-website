import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import QuoteBuilder from '@/components/QuoteBuilder';

export const metadata: Metadata = {
  title: 'Price My Event | The Bar People',
  description: 'Get an instant bar hire estimate in under 60 seconds. Choose your event type, guests, service, and bar — see live pricing instantly.',
};

export default function QuotePage() {
  return (
    <>
      <Header />
      <main className="pb-20 pt-24 md:pt-28">
        <QuoteBuilder />
      </main>
      <Footer />
    </>
  );
}
