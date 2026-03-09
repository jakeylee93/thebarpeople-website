import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
  onLight?: boolean;
}

export function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  center = false,
  className,
  onLight = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12",
        center && "text-center",
        className
      )}
    >
      {eyebrow && (
        <p className="text-[#c9956b] text-sm font-semibold uppercase tracking-[0.15em] mb-3">
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-[family-name:var(--font-young-serif)] text-3xl sm:text-4xl lg:text-5xl leading-tight",
          onLight ? "text-[#0a0f1c]" : "text-[#faf8f5]",
          center && "mx-auto"
        )}
      >
        {heading}
      </h2>
      {subtitle && (
        <p className={cn(
          "mt-4 text-lg max-w-2xl leading-relaxed",
          onLight ? "text-[#4b5563]" : "text-[#9ca3af]",
          center && "mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
