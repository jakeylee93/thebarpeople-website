import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { eventTypes, services } from '@/lib/constants';

export function generateStaticParams() {
  return eventTypes.map((e) => ({ slug: e.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const event = eventTypes.find((e) => e.slug === slug);
    if (!event) return {};
    return {
      title: `${event.name} Bar Hire | The Bar People`,
      description: event.description,
    };
  });
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = eventTypes.find((e) => e.slug === slug);
  if (!event) notFound();

  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="text-5xl">{event.icon}</span>
            <h1 className="mt-4 font-heading text-4xl font-bold text-charcoal md:text-5xl">
              {event.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{event.description}</p>
          </div>

          {/* Recommended services */}
          <h2 className="mb-6 text-center font-heading text-2xl font-semibold text-charcoal">
            Recommended Services
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 3).map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group rounded-2xl border border-warm-border bg-white p-6 transition-all hover:border-gold/30 hover:shadow-lg"
              >
                <span className="text-3xl">{s.icon}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-charcoal">{s.name}</h3>
                <p className="mt-1 text-sm text-muted">{s.description}</p>
                <p className="mt-3 text-sm font-semibold text-gold">{s.price}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
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
