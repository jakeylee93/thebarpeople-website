import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

// The new homepage, chosen by Jake on 8 Nov 2026. A prototype: never indexed,
// not linked from the live site.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { absolute: 'New homepage (preview) · The Bar People' },
  description: 'Preview of the new Bar People homepage and the Build your package quote. Not live.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function NewHomeLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${jakarta.variable} nh min-h-screen bg-white font-body text-nh-ink`}>{children}</div>;
}
