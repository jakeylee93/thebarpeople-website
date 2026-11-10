import QuoteBuilder from '@/components/new-home/builder/QuoteBuilder';

// /new/quote — the quote builder on its own, for testing and for direct links.
export default function QuotePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-nh-ink px-6 text-center text-white">
      <h1 className="text-[40px] font-extrabold tracking-tight">Build your package</h1>
      <p className="max-w-md text-white/75">Pick your bar, drinks, glassware and team, and watch your quote build as you go.</p>
      <a href="#build" className="rounded-full bg-white px-7 py-4 text-[16px] font-semibold text-nh-ink">Build your package</a>
      <QuoteBuilder />
    </main>
  );
}
