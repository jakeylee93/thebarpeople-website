import type { Metadata } from 'next';

// Same rules as /preview: never indexed, never cached, no referrer. (The /new
// layout above this already supplies the page's fonts and frame.)
export const metadata: Metadata = {
  title: { absolute: 'Draft preview · The Bar People' },
  robots: { index: false, follow: false, nocache: true, noarchive: true, googleBot: { index: false, follow: false } },
  referrer: 'no-referrer',
};

export default function NewPreviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
