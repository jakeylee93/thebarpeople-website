'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { galleryImages } from '@/lib/constants';

const categories = ['All', 'Corporate', 'Weddings', 'Private', 'Cocktails'];

export default function GalleryPage() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? galleryImages : galleryImages.filter((img) => img.category === filter);

  return (
    <>
      <Header />
      <main className="pb-20 pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Our Work</p>
            <h1 className="mt-3 font-heading text-4xl font-bold text-charcoal md:text-5xl">
              Gallery
            </h1>
            <p className="mt-4 text-muted">Real bars, real parties — 850+ events and counting.</p>
          </div>

          {/* Filters */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-gold text-white'
                    : 'bg-cream-dark text-muted hover:bg-gold/10 hover:text-gold'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((img) => (
              <div
                key={img.src}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-cream-dark"
              >
                <Image
                  src={img.src}
                  alt={img.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-sm font-medium text-white">{img.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
