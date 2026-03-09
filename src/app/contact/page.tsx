import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with The Bar People. Call Jake for corporate events or Kim for private events. Or email hello@thebarpeople.co.uk.",
  openGraph: {
    title: "Contact | The Bar People",
    description: "Get in touch with The Bar People team.",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 mb-8 text-sm text-[#9ca3af]">
          <Link href="/" className="hover:text-[#c9956b] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#faf8f5]">Contact</span>
        </nav>

        <div className="mb-12">
          <p className="text-[#c9956b] text-sm font-semibold uppercase tracking-[0.15em] mb-3">Get In Touch</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl font-bold text-[#faf8f5] mb-4">
            Let&apos;s Talk About Your Event
          </h1>
          <p className="text-[#9ca3af] text-lg max-w-xl">
            Whether you know exactly what you want or just have a rough idea — reach out and we&apos;ll help make it happen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Jake */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-[#c9956b]/30 transition-all duration-300">
            <p className="text-[#c9956b] text-xs font-semibold uppercase tracking-wider mb-3">Corporate Events</p>
            <h2 className="text-[#faf8f5] text-xl font-bold mb-1">Jake Lee</h2>
            <p className="text-[#9ca3af] text-sm mb-4">Corporate Event Manager</p>
            <div className="space-y-2">
              <a href="tel:+447557402200" className="flex items-center gap-2 text-[#faf8f5]/70 hover:text-[#c9956b] transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                07557 402200
              </a>
              <a href="mailto:jake@thebarpeople.co.uk" className="flex items-center gap-2 text-[#faf8f5]/70 hover:text-[#c9956b] transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                jake@thebarpeople.co.uk
              </a>
            </div>
          </div>

          {/* Kim */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:border-[#c9956b]/30 transition-all duration-300">
            <p className="text-[#c9956b] text-xs font-semibold uppercase tracking-wider mb-3">Private Events</p>
            <h2 className="text-[#faf8f5] text-xl font-bold mb-1">Kim Knight</h2>
            <p className="text-[#9ca3af] text-sm mb-4">Private Event Manager</p>
            <div className="space-y-2">
              <a href="tel:+447724601256" className="flex items-center gap-2 text-[#faf8f5]/70 hover:text-[#c9956b] transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                07724 601256
              </a>
              <a href="mailto:kim@thebarpeople.co.uk" className="flex items-center gap-2 text-[#faf8f5]/70 hover:text-[#c9956b] transition-colors text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                kim@thebarpeople.co.uk
              </a>
            </div>
          </div>
        </div>

        {/* General */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 text-center">
          <p className="text-[#9ca3af] text-sm mb-2">General enquiries</p>
          <a href="mailto:hello@thebarpeople.co.uk" className="text-[#c9956b] text-lg font-medium hover:text-[#e0b48a] transition-colors">
            hello@thebarpeople.co.uk
          </a>
          <p className="text-[#9ca3af]/60 text-xs mt-2">Based in Leytonstone, London. Nationwide service.</p>
        </div>

        <div className="mt-8 text-center">
          <Link href="/quote" className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9956b] text-[#0a0f1c] font-semibold rounded-xl hover:bg-[#e0b48a] transition-colors">
            Or build your quote online
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
