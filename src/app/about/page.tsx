import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About Us | The Bar People',
  description: 'Meet the team behind The Bar People — delivering unforgettable bar experiences since 2014.',
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our Story</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal md:text-5xl">
              About The Bar People
            </h1>
          </div>

          <div className="prose prose-lg mx-auto space-y-6 text-charcoal-light">
            <p>
              Founded in 2014, The Bar People started with a simple idea: every event deserves a
              brilliant bar experience — without the hassle. What began as one person, one van, and a
              lot of determination has grown into London&apos;s go-to mobile bar hire company, delivering
              850+ events and counting.
            </p>
            <p>
              We&apos;ve served cocktails at Porsche launches, poured pints at charity galas, and mixed
              margaritas at hundreds of weddings. From a 50-person birthday to a 500-guest corporate
              bash, we bring the same energy, professionalism, and love for what we do.
            </p>
            <p>
              Our modular bar systems are designed and built in-house — any size, any colour, indoor or
              outdoor. Our bartenders are experienced, friendly, and always professional. And our
              all-inclusive packages mean you don&apos;t have to think about anything except enjoying the
              night.
            </p>
          </div>

          {/* Values */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: '🎯', title: 'Reliability', desc: 'We show up on time, every time. Over 10 years of consistent delivery.' },
              { icon: '✨', title: 'Quality', desc: 'Premium spirits, professional staff, beautiful bars — no corners cut.' },
              { icon: '🤝', title: 'Partnership', desc: 'We work with you, not just for you. Your event is our event.' },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-warm-border bg-white p-6 text-center">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-3 font-heading text-lg font-semibold text-charcoal">{v.title}</h3>
                <p className="mt-2 text-sm text-muted">{v.desc}</p>
              </div>
            ))}
          </div>

          {/* Team */}
          <div className="mt-16 text-center">
            <h2 className="font-heading text-2xl font-semibold text-charcoal">Meet the Team</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { name: 'Jake Lee', role: 'Founder & Director', desc: 'Runs the show. Corporate events, logistics, and the big picture.' },
                { name: 'Kim', role: 'Events Manager', desc: 'Private events specialist. Your go-to for weddings, parties, and everything personal.' },
              ].map((member) => (
                <div key={member.name} className="rounded-2xl border border-warm-border bg-cream p-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold text-xl font-bold text-white">
                    {member.name[0]}
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-charcoal">{member.name}</h3>
                  <p className="text-sm font-medium text-gold">{member.role}</p>
                  <p className="mt-2 text-sm text-muted">{member.desc}</p>
                </div>
              ))}
            </div>
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
