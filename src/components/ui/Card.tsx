import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6",
        "backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:bg-white/[0.06] hover:border-[#c9956b]/30 hover:shadow-lg hover:shadow-[#c9956b]/5 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}
