import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { services } from '@/lib/constants';

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return params.then(({ slug }) => {
    const service = services.find((s) => s.slug === slug);
    if (!service) return {};
    return {
      title: `${service.name} | The Bar People`,
      description: service.description,
    };
  });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-12 text-center">
            <span className="text-5xl">{service.icon}</span>
            {service.tag && (
              <span className="mx-auto mt-4 block w-fit rounded-full bg-gold/10 px-4 py-1 text-sm font-semibold text-gold">
                {service.tag}
              </span>
            )}
            <h1 className="mt-4 font-heading text-4xl font-bold text-charcoal md:text-5xl">
              {service.name}
            </h1>
            <p className="mt-4 text-lg text-muted">{service.description}</p>
            <p className="mt-2 font-heading text-2xl font-bold text-gold">{service.price}</p>
          </div>

          {/* Features */}
          <div className="rounded-2xl border border-warm-border bg-white p-8 md:p-12">
            <h2 className="mb-6 font-heading text-2xl font-semibold text-charcoal">What&apos;s Included</h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-3 rounded-lg bg-cream p-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">✓</span>
                  <span className="text-sm text-charcoal">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
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
