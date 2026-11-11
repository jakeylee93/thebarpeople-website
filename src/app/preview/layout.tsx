import type { Metadata } from 'next';
import NewHomeLayout from '../new/layout';

// The AnyVendor draft page. Its address carries a draft token, so: never
// indexed, never cached, no referrer, and no third-party script (the anyOS
// live-edit script is not loaded here; see AnyOsLiveEdit).
export const metadata: Metadata = {
  title: { absolute: 'Draft preview · The Bar People' },
  robots: { index: false, follow: false, nocache: true, noarchive: true, googleBot: { index: false, follow: false } },
  referrer: 'no-referrer',
};

export default NewHomeLayout;
