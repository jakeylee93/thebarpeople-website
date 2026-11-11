'use client';

// The finished quote: every line, VAT and total, then three ways to keep it.
// Downloading the PDF or emailing it asks for an email address first.

import { useEffect, useRef, useState } from 'react';
import { Check, Download, Link2, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, formatDuration, formatTime } from '@/lib/visual-quote/time';
import { looksLikeEmail, submitLead } from '@/lib/quote/leads';
import { usableDate } from '@/lib/quote/schedule';
import BarDiagram from '../package/BarDiagram';
import MenuCard from './MenuCard';
import { QuoteLines, QuoteTotals } from './QuotePanel';
import { goToStep, shareLink } from './route';
import { useToday, type StepProps } from './steps';
import { Note, field, ring } from './ui';

type Want = 'pdf' | 'email';
type Outcome = null | { kind: 'pdf' } | { kind: 'email-not-connected' } | { kind: 'email-sent' } | { kind: 'error'; message: string };

const BAD_EMAIL = 'That email address doesn’t look complete. Please check it.';

export default function QuoteStep({ state, quote, ledColour }: StepProps) {
  const today = useToday();
  const [want, setWant] = useState<Want | null>(null);
  const [busy, setBusy] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>(null);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState({ name: '', email: '', phone: '' });
  const [emailProblem, setEmailProblem] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const s = quote.schedule;
  const empty = quote.lines.length === 0;
  // The same check the schedule uses, so the date still shows when the bar times need fixing.
  const date = usableDate(state.date);

  // The form opens below the buttons: bring it into view and put the cursor in it.
  useEffect(() => {
    if (!want) return;
    formRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    emailRef.current?.focus({ preventScroll: true });
  }, [want]);

  const facts: [string, string][] = [['Guests', String(state.guests)], ['Date', date ? formatDate(date) : 'Not set yet']];
  if (s) {
    facts.push(['Bar open', `${formatTime(s.timing.startMinutes)} to ${formatTime(s.timing.endMinutes)} · ${formatDuration(s.barMinutes)}`]);
    if (quote.lines.some((l) => l.id === 'staff')) facts.push(['Team on site', `${formatTime(s.staffArrive)} to ${formatTime(s.staffFinish)}`]);
    if (quote.lines.some((l) => l.id === 'delivery')) {
      facts.push(['Set-up', s.setupDay === 'on-the-day'
        ? `On the day${s.setupOnTheDayBy !== null ? `, by ${formatTime(s.setupOnTheDayBy)}` : ''}`
        : s.setupDate ? `The day before · ${formatDate(s.setupDate, true)}` : 'The day before']);
      facts.push(['Collection', s.collectionDate ? formatDate(s.collectionDate, true) : `${state.collectionDays === 1 ? 'The day' : `${state.collectionDays} days`} after`]);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!want || busy) return;
    if (!looksLikeEmail(contact.email)) {
      // The browser's own check lets "name@gmail" through, so say what's wrong ourselves.
      setEmailProblem(true);
      setOutcome(null);
      emailRef.current?.focus();
      return;
    }
    setEmailProblem(false);
    setBusy(true);
    setOutcome(null);
    try {
      const lead = await submitLead({ ...contact, wants: want, state, subtotal: quote.subtotal, total: quote.total });
      if (want === 'pdf') {
        const [{ buildQuotePdf }, logo] = await Promise.all([
          import('@/lib/quote/pdf'),
          fetch('/images/logos/bar-people-logo-360.png').then((r) => (r.ok ? r.arrayBuffer() : null)).catch(() => null),
        ]);
        const bytes = await buildQuotePdf({
          state, quote, logoPng: logo ? new Uint8Array(logo) : null,
          preparedOn: today ?? new Date().toISOString().slice(0, 10), customerName: contact.name,
        });
        const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'the-bar-people-quote.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
        setOutcome({ kind: 'pdf' });
      } else {
        setOutcome(lead.status === 'sent' ? { kind: 'email-sent' } : lead.status === 'failed' ? { kind: 'error', message: lead.reason } : { kind: 'email-not-connected' });
      }
    } catch {
      setOutcome({ kind: 'error', message: 'Something went wrong making your quote. Please try again.' });
    } finally {
      setBusy(false);
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareLink(state));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }

  if (empty) {
    return (
      <div>
        <Note>Nothing in your quote yet. Start with your event and we’ll build it as you go.</Note>
        <button type="button" onClick={() => goToStep('event')} className={cn('mt-5 rounded-full bg-nh-ink px-6 py-3.5 text-[16px] font-semibold text-white', ring)}>
          Start my quote
        </button>
      </div>
    );
  }

  return (
    <div>
      <Note>Here’s your package, priced. Download it, email it to yourself or share the link.</Note>
      {quote.scheduleIssue && (
        <p role="alert" className="mt-3 rounded-[14px] bg-[#fbeeee] px-4 py-3 text-[14px] font-semibold leading-relaxed text-[#8f2424]">
          {quote.scheduleIssue}.{' '}
          <button type="button" onClick={() => goToStep('event')} className={cn('min-h-10 rounded underline underline-offset-4', ring)}>Change your bar times</button>{' '}
          and we’ll price your drinks and bartenders.
        </p>
      )}

      {state.bar && (
        <div className="mt-5 rounded-[24px] bg-[radial-gradient(ellipse_at_50%_35%,#ffffff,#eceae5)] px-4 py-2">
          <BarDiagram bar={state.bar} ledColour={ledColour} className="mx-auto max-w-[460px]" />
        </div>
      )}

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 rounded-[20px] bg-nh-mist p-5 sm:grid-cols-3">
        {facts.map(([label, value]) => (
          <div key={label}>
            <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-nh-ash">{label}</dt>
            <dd className="text-[15px] font-semibold leading-snug">{value}</dd>
          </div>
        ))}
      </dl>
      {!date && (
        <p className="mt-2 text-[14px] text-nh-ash">
          <button type="button" onClick={() => goToStep('event')} className={cn('min-h-10 rounded font-semibold text-nh-ink underline underline-offset-4', ring)}>Add your event date</button>{' '}
          so we can check it’s free.
        </p>
      )}

      <div className="mt-6"><QuoteLines quote={quote} /></div>
      <div className="mt-5"><QuoteTotals quote={quote} tone="light" /></div>
      <MenuCard quote={quote} className="mt-5" />

      {quote.notes.length > 0 && (
        <ul className="mt-4 space-y-1.5 text-[13.5px] leading-relaxed text-nh-ash">
          {quote.notes.map((n) => <li key={n}>{n}</li>)}
        </ul>
      )}

      <div className="mt-7 grid gap-2 sm:grid-cols-3">
        <button type="button" onClick={() => { setWant('pdf'); setOutcome(null); }} aria-pressed={want === 'pdf'}
          className={cn('inline-flex h-14 items-center justify-center gap-2 rounded-full bg-nh-ink px-5 text-[16px] font-semibold text-white hover:bg-black', ring)}>
          <Download className="h-5 w-5" aria-hidden /> Download PDF
        </button>
        <button type="button" onClick={() => { setWant('email'); setOutcome(null); }} aria-pressed={want === 'email'}
          className={cn('inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-nh-ink px-5 text-[16px] font-semibold hover:bg-nh-mist', ring)}>
          <Mail className="h-5 w-5" aria-hidden /> Email it to me
        </button>
        <button type="button" onClick={copyLink}
          className={cn('inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-nh-line px-5 text-[16px] font-semibold hover:border-nh-ink', ring)}>
          {copied ? <Check className="h-5 w-5" aria-hidden /> : <Link2 className="h-5 w-5" aria-hidden />}
          <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
        </button>
      </div>

      {want && (
        <form ref={formRef} onSubmit={submit} noValidate className="nh-pop mt-4 scroll-mb-40 rounded-[20px] border-2 border-nh-ink p-5" aria-labelledby="lead-title">
          <h3 id="lead-title" className="text-[20px] font-extrabold tracking-tight">
            {want === 'pdf' ? 'Where shall we send a copy?' : 'Email my quote'}
          </h3>
          <p className="mt-1 text-[14px] text-nh-ash">
            {want === 'pdf' ? 'Pop in your email and your PDF downloads straight away.' : 'We’ll email your quote and one of us will be in touch.'}
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {/* The message sits outside the label, so the field is still just called "Email". */}
            <div>
              <label htmlFor="lead-email" className="block text-[14px] font-semibold">Email</label>
              <input ref={emailRef} id="lead-email" type="email" name="email" autoComplete="email" required value={contact.email}
                aria-invalid={emailProblem ? true : undefined} aria-describedby={emailProblem ? 'lead-email-problem' : undefined}
                onChange={(e) => { setContact({ ...contact, email: e.currentTarget.value }); if (emailProblem) setEmailProblem(false); }} className={field} />
              {emailProblem && <p id="lead-email-problem" role="alert" className="mt-1.5 text-[13px] font-semibold text-[#a12b2b]">{BAD_EMAIL}</p>}
            </div>
            <label className="block text-[14px] font-semibold">Name <span className="font-normal text-nh-ash">(optional)</span>
              <input name="name" autoComplete="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.currentTarget.value })} className={field} />
            </label>
            <label className="block text-[14px] font-semibold">Phone <span className="font-normal text-nh-ash">(optional)</span>
              <input type="tel" name="phone" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.currentTarget.value })} className={field} />
            </label>
          </div>
          <button type="submit" disabled={busy}
            className={cn('mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-nh-ink px-6 text-[15px] font-semibold text-white disabled:opacity-60', ring)}>
            {want === 'pdf' ? <Download className="h-4 w-4" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
            {busy ? 'One moment…' : want === 'pdf' ? 'Download my quote' : 'Email my quote'}
          </button>
          <div role="status" className="mt-3 text-[14px]">
            {outcome?.kind === 'pdf' && (
              <p><strong>Your quote has downloaded.</strong> <span className="text-nh-ash">Preview site: your details haven’t been sent anywhere yet.</span></p>
            )}
            {outcome?.kind === 'email-not-connected' && (
              <p><strong>Preview site: nothing has been sent.</strong> <span className="text-nh-ash">Emailing switches on when the site goes live. You can download the PDF now.</span></p>
            )}
            {outcome?.kind === 'email-sent' && <p><strong>Sent.</strong> <span className="text-nh-ash">Check your inbox for your quote.</span></p>}
            {outcome?.kind === 'error' && <p className="font-semibold text-[#a12b2b]">{outcome.message}</p>}
          </div>
        </form>
      )}
    </div>
  );
}
