"use client";

export function NewsletterForm() {
  return (
    <form
      className="flex gap-2 w-full sm:w-auto"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 sm:w-64 px-4 py-2.5 bg-white/5 border border-white/[0.08] rounded-xl text-[#faf8f5] text-sm placeholder:text-white/30 focus:outline-none focus:border-[#c9956b]/50 transition-colors"
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-[#c9956b] text-[#0a0f1c] font-semibold text-sm rounded-xl hover:bg-[#e0b48a] transition-colors flex-shrink-0"
      >
        Subscribe
      </button>
    </form>
  );
}
