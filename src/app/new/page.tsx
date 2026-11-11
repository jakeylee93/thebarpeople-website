import { redirect } from 'next/navigation';
import '@/components/new-home/home.css';
import HomeDocument from '@/components/new-home/HomeDocument';
import { getSiteContent } from '@/content';
import { isPreviewToken } from '@/content/anyvendor';

// /new — the commissioned homepage (not live). One section per screen.
//
// Its words, pictures and the order of its sections come from the site content:
// the bundled seed today, AnyVendor's published content once connected. Drafts
// are shown on /preview only (a narrow, no-store, never-indexed page), so an
// older ?preview=<token> link is sent there.
export default async function NewHomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { preview } = await searchParams;
  if (isPreviewToken(preview)) redirect(`/preview?token=${preview}`);
  return <HomeDocument loaded={await getSiteContent()} />;
}
