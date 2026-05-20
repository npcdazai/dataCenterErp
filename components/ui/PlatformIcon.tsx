import { cn } from "@/lib/utils";
import { Platform } from "@/lib/types";

const styles: Record<string, { bg: string; label: string; initials: string }> = {
  shopify: { bg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300", label: "Shopify", initials: "Sh" },
  amazon: { bg: "bg-amber-500/15 text-amber-600 dark:text-amber-300", label: "Amazon", initials: "Az" },
  flipkart: { bg: "bg-blue-500/15 text-blue-600 dark:text-blue-300", label: "Flipkart", initials: "Fk" },
  meta: { bg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300", label: "Meta Ads", initials: "Mt" },
  facebook: { bg: "bg-sky-500/15 text-sky-600 dark:text-sky-300", label: "Facebook", initials: "Fb" },
  instagram: { bg: "bg-pink-500/15 text-pink-600 dark:text-pink-300", label: "Instagram", initials: "Ig" },
  website: { bg: "bg-slate-500/15 text-slate-600 dark:text-slate-300", label: "Website", initials: "We" },
  google: { bg: "bg-rose-500/15 text-rose-600 dark:text-rose-300", label: "Google", initials: "Go" }
};

export function PlatformIcon({
  platform,
  size = "sm",
  showLabel = false,
  className
}: {
  platform: Platform | "google";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}) {
  const s = styles[platform] ?? styles.website;
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md font-semibold",
          s.bg,
          size === "sm" ? "h-5 w-5 text-[9px]" : "h-7 w-7 text-[11px]"
        )}
      >
        {s.initials}
      </span>
      {showLabel && (
        <span className="text-xs font-medium text-fg">{s.label}</span>
      )}
    </span>
  );
}
