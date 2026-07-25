import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms that apply when you book The Bar People for your event.',
};

const sections: { title: string; body: string[] }[] = [
  {
    title: 'Quotes & bookings',
    body: [
      'Website prices and instant estimates are a guide, not a contract — every event is different, and your final quote is confirmed in writing before anything is booked. A booking is confirmed once you accept your quote and pay any agreed deposit.',
    ],
  },
  {
    title: 'Payments',
    body: [
      'Deposits secure your date. The balance is due before or on the event date as set out in your quote. Cash bar arrangements (where guests pay) are agreed in writing beforehand, including any minimum-spend terms.',
    ],
  },
  {
    title: 'Cancellations & changes',
    body: [
      'Plans change — tell us as early as you can. Cancellation terms (including whether your deposit is refundable) are set out in your quote. Where we can move your booking to a new date instead, we will always try to.',
    ],
  },
  {
    title: 'Alcohol & licensing',
    body: [
      'We serve responsibly. Our team are experienced and, where required, personal-licence holders. We will not serve anyone under 25 without valid ID, or anyone excessively intoxicated — this protects you, your guests and your venue.',
    ],
  },
  {
    title: 'On the day',
    body: [
      'We need reasonable access for setup and breakdown, and a safe, level spot for the bar (we will confirm space and power needs with you in advance). Our equipment remains our property; accidental damage caused by guests may be charged at cost.',
    ],
  },
  {
    title: 'The boring-but-important bit',
    body: [
      'The Bar People Ltd holds public liability insurance. Nothing in these terms affects your statutory rights. Any questions — jake@thebarpeople.co.uk and we will talk it through like humans.',
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Legal</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal">Terms of Service</h1>
            <p className="mt-4 text-muted">The short, honest version. Your written quote carries the specifics.</p>
          </div>
          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-heading text-xl font-semibold text-charcoal">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-2 text-sm leading-relaxed text-mid">{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
