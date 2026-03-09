import Link from "next/link";

interface ComingSoonShellProps {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href: string }[];
}

export function ComingSoonShell({ title, subtitle, breadcrumb }: ComingSoonShellProps) {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-2xl w-full text-center">
          {breadcrumb && (
            <nav className="flex items-center justify-center gap-2 mb-8 text-sm text-[#9ca3af]">
              <Link href="/" className="hover:text-[#c9956b] transition-colors">
                Home
              </Link>
              {breadcrumb.map((crumb, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span>/</span>
                  {i === breadcrumb.length - 1 ? (
                    <span className="text-[#faf8f5]">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-[#c9956b] transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}

          <div className="w-16 h-16 rounded-2xl bg-[#c9956b]/10 border border-[#c9956b]/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[#c9956b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>

          <h1 className="font-[family-name:var(--font-young-serif)] text-3xl sm:text-4xl font-bold text-[#faf8f5] mb-3">
            {title}
          </h1>

          {subtitle && (
            <p className="text-[#9ca3af] text-lg mb-8">{subtitle}</p>
          )}

          <div className="inline-flex items-center gap-2 bg-[#c9956b]/10 border border-[#c9956b]/20 rounded-full px-5 py-2.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#c9956b] animate-pulse" />
            <span className="text-[#c9956b] text-sm font-medium">Coming soon — Stage 2</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[#faf8f5] text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/quote"
              className="px-6 py-3 bg-[#c9956b] text-[#0a0f1c] rounded-xl text-sm font-semibold hover:bg-[#e0b48a] transition-colors"
            >
              Build Your Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
