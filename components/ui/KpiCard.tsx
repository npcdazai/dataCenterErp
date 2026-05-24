"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { ResponsiveContainer, Area, AreaChart } from "recharts";
import { cn, formatPercent } from "@/lib/utils";
import { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon?: ReactNode;
  spark?: number[];
  tone?: "brand" | "success" | "warning" | "danger" | "info" | "purple";
}

type Tone = NonNullable<KpiCardProps["tone"]>;

const toneStyles: Record<
  Tone,
  {
    text: string;
    bar: string;
    iconBg: string;
    iconRing: string;
    glow: string;
    gradient: string;
    blob: string;
  }
> = {
  brand: {
    text: "text-brand-400",
    bar: "bg-brand-500",
    iconBg: "bg-brand-500/15",
    iconRing: "ring-brand-500/30",
    glow: "shadow-[0_0_40px_-12px_rgba(99,102,241,0.45)]",
    gradient: "from-brand-500/15 via-brand-500/0 to-transparent",
    blob: "bg-brand-500/20"
  },
  success: {
    text: "text-emerald-400",
    bar: "bg-emerald-500",
    iconBg: "bg-emerald-500/15",
    iconRing: "ring-emerald-500/30",
    glow: "shadow-[0_0_40px_-12px_rgba(16,185,129,0.45)]",
    gradient: "from-emerald-500/15 via-emerald-500/0 to-transparent",
    blob: "bg-emerald-500/20"
  },
  warning: {
    text: "text-amber-400",
    bar: "bg-amber-500",
    iconBg: "bg-amber-500/15",
    iconRing: "ring-amber-500/30",
    glow: "shadow-[0_0_40px_-12px_rgba(245,158,11,0.45)]",
    gradient: "from-amber-500/15 via-amber-500/0 to-transparent",
    blob: "bg-amber-500/20"
  },
  danger: {
    text: "text-rose-400",
    bar: "bg-rose-500",
    iconBg: "bg-rose-500/15",
    iconRing: "ring-rose-500/30",
    glow: "shadow-[0_0_40px_-12px_rgba(244,63,94,0.45)]",
    gradient: "from-rose-500/15 via-rose-500/0 to-transparent",
    blob: "bg-rose-500/20"
  },
  info: {
    text: "text-cyan-400",
    bar: "bg-cyan-500",
    iconBg: "bg-cyan-500/15",
    iconRing: "ring-cyan-500/30",
    glow: "shadow-[0_0_40px_-12px_rgba(6,182,212,0.45)]",
    gradient: "from-cyan-500/15 via-cyan-500/0 to-transparent",
    blob: "bg-cyan-500/20"
  },
  purple: {
    text: "text-violet-400",
    bar: "bg-violet-500",
    iconBg: "bg-violet-500/15",
    iconRing: "ring-violet-500/30",
    glow: "shadow-[0_0_40px_-12px_rgba(139,92,246,0.45)]",
    gradient: "from-violet-500/15 via-violet-500/0 to-transparent",
    blob: "bg-violet-500/20"
  }
};

export function KpiCard({
  label,
  value,
  delta,
  deltaLabel,
  icon,
  spark,
  tone = "brand"
}: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;
  const styles = toneStyles[tone];
  const sparkData = (spark ?? [3, 5, 4, 6, 8, 7, 9, 11, 10, 13, 12, 15]).map(
    (v, i) => ({ i, v })
  );
  const sparkId = `kpi-${label.replace(/\s+/g, "-")}-${tone}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.35 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:border-border-strong",
        `hover:${styles.glow}`
      )}
    >
      {/* tone-tinted gradient wash */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-80",
          styles.gradient
        )}
      />
      {/* soft blob in the top-right */}
      <div
        className={cn(
          "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl opacity-60",
          styles.blob
        )}
      />
      {/* left accent bar */}
      <div
        className={cn(
          "pointer-events-none absolute inset-y-4 left-0 w-[3px] rounded-r-full",
          styles.bar
        )}
      />

      <div className="relative px-5 pt-5">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-muted">
            {label}
          </span>
          {icon && (
            <span
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-xl ring-1 backdrop-blur-sm [&>svg]:h-4 [&>svg]:w-4",
                styles.iconBg,
                styles.iconRing,
                styles.text
              )}
            >
              {icon}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-end gap-2">
          <div className="text-[28px] font-semibold leading-none tracking-tight text-fg">
            {value}
          </div>
          {typeof delta === "number" && (
            <div
              className={cn(
                "mb-1 inline-flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] font-semibold",
                positive
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                  : "border-rose-500/30 bg-rose-500/10 text-rose-400"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-2.5 w-2.5" />
              ) : (
                <ArrowDownRight className="h-2.5 w-2.5" />
              )}
              {formatPercent(delta, 1)}
            </div>
          )}
        </div>
        {deltaLabel && (
          <div className="mt-1 text-[11px] text-fg-subtle">{deltaLabel}</div>
        )}
      </div>

      {/* sparkline pinned to bottom edge */}
      <div className={cn("relative mt-3 h-14", styles.text)}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparkData} margin={{ top: 4, bottom: 0, left: 0, right: 0 }}>
            <defs>
              <linearGradient id={sparkId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.45} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="currentColor"
              strokeWidth={2}
              fill={`url(#${sparkId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
