'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Get In Touch</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal md:text-5xl">
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
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                  className="space-y-5 rounded-2xl border border-warm-border bg-white p-8"
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal">Name</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-charcoal">Email</label>
                      <input
                        type="email"
                        required
                        className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">Phone</label>
                    <input
                      type="tel"
                      className="w-full rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-charcoal">Message</label>
                    <textarea
                      rows={5}
                      required
                      className="w-full resize-none rounded-xl border border-warm-border bg-cream px-4 py-3 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/10"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-sm font-semibold text-white transition-all hover:bg-gold-hover"
                  >
                    <Send size={16} /> Send Message
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
