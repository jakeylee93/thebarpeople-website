import { cn } from "@/lib/utils";

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
  light?: boolean;
  bright?: boolean;
  narrow?: boolean;
}

export function Section({
  children,
  className,
  id,
  dark = false,
  light = false,
  bright = false,
  narrow = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-20 px-4 sm:px-6 lg:px-8",
        dark && "bg-[#1a1a2e]",
        light && "bg-[#16213e]",
        bright && "bg-[#faf8f5]",
        className
      )}
    >
      <div className={cn("mx-auto w-full", narrow ? "max-w-4xl" : "max-w-7xl")}>
        {children}
      </div>
    </section>
  );
}
