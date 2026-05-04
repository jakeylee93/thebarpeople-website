import { notFound } from 'next/navigation';
import Link from 'next/link';

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
            <h1 className="mt-4 font-heading text-4xl font-bold md:text-5xl">
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
                className="group border border-pale bg-white p-6 transition-all hover:border-black"
              >
                <h3 className="font-heading text-lg font-semibold">{s.name}</h3>
                <p className="mt-1 text-sm text-mid">{s.description}</p>
                <p className="mt-3 text-sm font-semibold">{s.price}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/quote"
              className="inline-block bg-black px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-dark"
            >
              Price My Event
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
