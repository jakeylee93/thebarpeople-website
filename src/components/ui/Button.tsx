"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#c9956b] text-[#0a0f1c] font-semibold hover:bg-[#e0b48a] active:bg-[#a97a52] shadow-lg shadow-[#c9956b]/20 hover:shadow-[#c9956b]/30",
  secondary:
    "border border-[#c9956b] text-[#c9956b] hover:bg-[#c9956b]/10 active:bg-[#c9956b]/20",
  ghost:
    "text-[#faf8f5]/70 hover:text-[#faf8f5] hover:bg-white/5 active:bg-white/10",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-xl",
  lg: "px-8 py-4 text-lg rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2",
          "font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9956b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1c]",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
