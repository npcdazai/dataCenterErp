import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-9 w-full rounded-lg border border-border bg-card px-3 text-sm text-fg placeholder:text-fg-subtle",
      "focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/60",
      "transition",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
