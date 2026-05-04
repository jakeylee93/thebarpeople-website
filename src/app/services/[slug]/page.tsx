import { notFound } from 'next/navigation';
import Link from 'next/link';
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
    return { title: `${service.name} | The Bar People`, description: service.description };
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
          <div className="mb-12 text-center">
            {service.tag && (
              <span className="mx-auto mb-4 block w-fit bg-black px-3 py-1 text-xs font-medium text-white">
                {service.tag}
              </span>
            )}
            <h1 className="font-heading text-4xl font-bold md:text-5xl">{service.name}</h1>
            <p className="mt-4 text-lg text-mid">{service.description}</p>
            <p className="mt-2 font-heading text-2xl font-bold">{service.price}</p>
          </div>

          <div className="border border-pale bg-white p-8 md:p-12">
            <h2 className="mb-6 font-heading text-2xl font-semibold">What&apos;s Included</h2>
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {service.features.map((f) => (
                <li key={f} className="flex items-center gap-3 border border-pale p-3">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center bg-black text-xs text-white">✓</span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
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
