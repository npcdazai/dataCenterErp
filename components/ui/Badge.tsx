import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone =
  | "neutral"
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

const tones: Record<Tone, string> = {
  neutral:
    "bg-bg-muted text-fg-muted border-border",
  brand:
    "bg-brand-500/10 text-brand-600 dark:text-brand-300 border-brand-500/20",
  success:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/20",
  warning:
    "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/20",
  danger:
    "bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/20",
  info: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border-cyan-500/20",
  purple:
    "bg-violet-500/10 text-violet-600 dark:text-violet-300 border-violet-500/20"
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({
  className,
  tone = "neutral",
  dot,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-tight",
        tones[tone],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-emerald-500",
            tone === "danger" && "bg-rose-500",
            tone === "warning" && "bg-amber-500",
            tone === "info" && "bg-cyan-500",
            tone === "brand" && "bg-brand-500",
            tone === "purple" && "bg-violet-500",
            tone === "neutral" && "bg-fg-subtle"
          )}
        />
      )}
      {children}
    </span>
  );
}
