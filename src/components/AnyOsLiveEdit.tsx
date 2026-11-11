'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// anyOS live-edit: hydrates data-anyos text with saved content, and turns on
// click-to-edit when opened from the anyOS Website module. Unchanged on every
// page it served before.
//
// Not loaded on /preview: that page is AnyVendor's draft of the new homepage
// (one editor per page), and its address carries a draft token that no
// third-party script should be able to read.
export default function AnyOsLiveEdit() {
  const path = usePathname();
  if (path === '/preview' || path?.startsWith('/preview/')) return null;
  return <Script src="https://platform.anyos.co.uk/edit.js" data-site="the-bar-people" strategy="afterInteractive" />;
}
