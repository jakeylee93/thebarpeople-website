import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  subtitle,
  center = false,
  className,
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
          "font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#faf8f5] leading-tight",
          center && "mx-auto"
        )}
      >
        {heading}
      </h2>
      {subtitle && (
        <p className={cn("mt-4 text-[#9ca3af] text-lg max-w-2xl leading-relaxed", center && "mx-auto")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
