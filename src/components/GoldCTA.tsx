import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface GoldCTAProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg";
}

const GoldCTA = forwardRef<HTMLButtonElement, GoldCTAProps>(
  ({ className, size = "default", children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold transition-all hover:brightness-110 animate-gold-pulse",
        size === "lg" ? "px-10 py-4 text-lg" : "px-6 py-3 text-base",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
GoldCTA.displayName = "GoldCTA";
export default GoldCTA;
