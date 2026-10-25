import type { Metadata } from 'next';

// Prototype area — never indexed, not linked from the live navigation.
export const metadata: Metadata = {
  title: { absolute: 'Prototype · Website & Visual Quotes · The Bar People' },
  description: 'Internal prototype of the new homepage header and visual quote builder. Not live.',
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function ConceptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
