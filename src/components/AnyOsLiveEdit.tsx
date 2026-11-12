'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// anyOS live-edit: hydrates data-anyos text with saved content, and turns on
// click-to-edit when opened from the anyOS Website module. Unchanged on every
// current page, where anyOS owns its 17 keys.
//
// Not loaded on the commissioned homepage (/new…) or its draft page (/preview):
// AnyVendor owns that content, and a page has one editor. /preview's address
// also carries a draft token that no third-party script should be able to read.
const ANYVENDOR_PAGES = /^\/(new|preview)(\/|$)/;

export default function AnyOsLiveEdit() {
  const path = usePathname();
  if (path && ANYVENDOR_PAGES.test(path)) return null;
  return <Script src="https://platform.anyos.co.uk/edit.js" data-site="the-bar-people" strategy="afterInteractive" />;
}
