import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How The Bar People collects, uses and protects your personal information.',
};

const sections: { title: string; body: string[] }[] = [
  {
    title: 'Who we are',
    body: [
      'The Bar People Ltd (company no. 12161824) provides mobile bar hire, bar staff and event services across the UK. This policy explains how we handle personal information you share with us through this website, by email or by phone.',
    ],
  },
  {
    title: 'What we collect and why',
    body: [
      'When you send an enquiry or request a quote we collect your name, contact details (email and/or phone), your event date and details, and anything you choose to tell us in your message. We use this solely to respond to your enquiry, prepare your quote and deliver your event.',
      'We do not sell or rent your information to anyone, and we do not use it for third-party advertising.',
    ],
  },
  {
    title: 'Where it goes',
    body: [
      'Enquiries are stored securely in our booking system so the team can manage your event. Emails live in our business mailboxes. We use trusted service providers (website hosting and our booking platform) to process this data on our behalf.',
    ],
  },
  {
    title: 'How long we keep it',
    body: [
      'We keep enquiry and booking records for as long as needed to run your event and meet our legal obligations (for example, accounting records). If you never book with us, you can ask us to delete your enquiry at any time.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'You can ask us at any time what information we hold about you, ask us to correct it, or ask us to delete it. Email jake@thebarpeople.co.uk and we will sort it promptly.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'This website does not use advertising or tracking cookies. Our hosting provider may collect basic, anonymous analytics (such as page views) to keep the site running well.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Legal</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal">Privacy Policy</h1>
            <p className="mt-4 text-muted">Plain English, no surprises. Last updated July 2026.</p>
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
