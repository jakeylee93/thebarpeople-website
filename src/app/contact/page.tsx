'use client';

import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', message: '' });
  // Platform anti-spam token — fetched at render, sent with the message so the
  // enquiry lands as a real record in the anyOS platform (not a dead inbox).
  const [formToken, setFormToken] = useState('');

  useEffect(() => {
    const month = new Date().toISOString().slice(0, 7);
    fetch(`/api/availability?month=${month}`)
      .then((r) => r.json())
      .then((b) => { if (b?.t) setFormToken(b.t); })
      .catch(() => { /* token stays empty — the API logs the lead instead */ });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'contact', eventType: 'contact', ...form, notes: form.message, t: formToken }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body.ok === false) {
        setError(typeof body.error === 'string' && body.error ? body.error : 'Could not send just now — please try again.');
        return;
      }
      setSent(true);
    } catch {
      setError('Could not send just now — please check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Get In Touch</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal md:text-5xl" data-anyos="contact.title">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-muted">
              Have a question or ready to book? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-warm-border bg-white p-6">
                <h3 className="mb-4 font-heading text-lg font-semibold text-charcoal">Corporate Events</h3>
                <div className="space-y-3 text-sm">
                  <a href="mailto:jake@thebarpeople.co.uk" className="flex items-center gap-3 text-muted transition-colors hover:text-gold">
                    <Mail size={16} className="text-gold" /> jake@thebarpeople.co.uk
                  </a>
                  <a href="tel:+447557402200" className="flex items-center gap-3 text-muted transition-colors hover:text-gold">
                    <Phone size={16} className="text-gold" /> 07557 402200
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-warm-border bg-white p-6">
                <h3 className="mb-4 font-heading text-lg font-semibold text-charcoal">Private Events</h3>
                <div className="space-y-3 text-sm">
                  <a href="mailto:kim@thebarpeople.co.uk" className="flex items-center gap-3 text-muted transition-colors hover:text-gold">
                    <Mail size={16} className="text-gold" /> kim@thebarpeople.co.uk
                  </a>
                  <a href="tel:+447724601256" className="flex items-center gap-3 text-muted transition-colors hover:text-gold">
                    <Phone size={16} className="text-gold" /> 07724 601256
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-warm-border bg-white p-6">
                <h3 className="mb-4 font-heading text-lg font-semibold text-charcoal">General</h3>
                <div className="space-y-3 text-sm">
                  <a href="mailto:hello@thebarpeople.co.uk" className="flex items-center gap-3 text-muted transition-colors hover:text-gold">
                    <Mail size={16} className="text-gold" /> hello@thebarpeople.co.uk
                  </a>
                  <div className="flex items-center gap-3 text-muted">
                    <MapPin size={16} className="text-gold" /> Leytonstone, London
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-warm-border bg-white p-12 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Check className="text-green-600" size={32} />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-charcoal">Message Sent!</h2>
                  <p className="mt-2 text-muted">We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form
                  onSubmit={submit}
                  className="space-y-5 rounded-2xl border border-warm-border bg-white p-8"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal">Phone</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal">Event date <span className="font-normal text-muted">(rough is fine)</span></label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().slice(0, 10)}
                        value={form.date}
                        onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                        className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">Message</label>
                    <textarea
                      rows={5}
                      required
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      className="w-full resize-none rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-gold-hover disabled:opacity-50"
                  >
                    <Send size={16} /> {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
