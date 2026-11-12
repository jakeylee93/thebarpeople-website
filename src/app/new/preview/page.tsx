// /new/preview?token=<draft token> — the same draft page as /preview, at the
// address AnyVendor's editor builds when the bound site address ends in /new
// ({site address}/preview). One implementation, so the token handling cannot
// differ: a missing, malformed or wrong token is a 404 here too. Served
// directly (no redirect), so the token is never passed on.
export const dynamic = 'force-dynamic';
export { default } from '../../preview/page';
