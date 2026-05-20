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

const toneAccent: Record<NonNullable<KpiCardProps["tone"]>, string> = {
  brand: "from-brand-500/20 to-brand-500/0 text-brand-500",
  success: "from-emerald-500/20 to-emerald-500/0 text-emerald-500",
  warning: "from-amber-500/20 to-amber-500/0 text-amber-500",
  danger: "from-rose-500/20 to-rose-500/0 text-rose-500",
  info: "from-cyan-500/20 to-cyan-500/0 text-cyan-500",
  purple: "from-violet-500/20 to-violet-500/0 text-violet-500"
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
  const sparkData = (spark ?? [3, 5, 4, 6, 8, 7, 9, 11, 10, 13, 12, 15]).map(
    (v, i) => ({ i, v })
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60",
          toneAccent[tone]
        )}
      />
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-fg-muted">
            {label}
          </span>
          {icon && (
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg bg-card border border-border [&>svg]:h-4 [&>svg]:w-4",
                toneAccent[tone].split(" ").pop()
              )}
            >
              {icon}
            </span>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <div className="text-2xl font-semibold tracking-tight text-fg">
            {value}
          </div>
          {typeof delta === "number" && (
            <div
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                positive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
              )}
            >
              {positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {formatPercent(delta, 1)}
            </div>
          )}
        </div>
        {deltaLabel && (
          <div className="mt-1 text-[11px] text-fg-subtle">{deltaLabel}</div>
        )}
        <div className="mt-4 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={`kpi-${label}`} x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity={0.4} />
                  <stop
                    offset="100%"
                    stopColor="currentColor"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke="currentColor"
                strokeWidth={2}
                fill={`url(#kpi-${label})`}
                className={toneAccent[tone].split(" ").pop()}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
