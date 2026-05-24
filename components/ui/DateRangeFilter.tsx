"use client";

import { cn } from "@/lib/utils";

export type DateRangePreset =
  | "all"
  | "today"
  | "yesterday"
  | "last_7"
  | "last_30"
  | "custom";

export interface DateRangeValue {
  preset: DateRangePreset;
  /** ISO date (yyyy-mm-dd). Used only when preset === "custom". */
  from?: string;
  to?: string;
}

export const defaultDateRange: DateRangeValue = { preset: "all" };

const PRESET_LABELS: { key: DateRangePreset; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_7", label: "7 days" },
  { key: "last_30", label: "30 days" },
  { key: "custom", label: "Custom" }
];

interface Props {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  label?: string;
}

export function DateRangeFilter({ value, onChange, label = "Date range" }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-fg-subtle">
        <span>{label}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESET_LABELS.map(({ key, label }) => {
          const active = value.preset === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ ...value, preset: key })}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition",
                active
                  ? "border-brand-500/60 bg-brand-500/15 text-brand-300"
                  : "border-border bg-card/40 text-fg-muted hover:bg-bg-muted hover:text-fg"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
      {value.preset === "custom" && (
        <div className="grid grid-cols-2 gap-2 pt-1">
          <label className="space-y-1 text-[11px] text-fg-subtle">
            From
            <input
              type="date"
              value={value.from ?? ""}
              max={value.to}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
              className="block h-8 w-full rounded-md border border-border bg-card/60 px-2 text-xs text-fg focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
          <label className="space-y-1 text-[11px] text-fg-subtle">
            To
            <input
              type="date"
              value={value.to ?? ""}
              min={value.from}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
              className="block h-8 w-full rounded-md border border-border bg-card/60 px-2 text-xs text-fg focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </label>
        </div>
      )}
    </div>
  );
}

/** Returns true if `iso` falls inside the configured range. */
export function isInDateRange(iso: string, range: DateRangeValue): boolean {
  if (!range || range.preset === "all") return true;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return true;

  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const day = 86_400_000;

  switch (range.preset) {
    case "today":
      return t >= startOfToday && t < startOfToday + day;
    case "yesterday":
      return t >= startOfToday - day && t < startOfToday;
    case "last_7":
      return t >= startOfToday - 7 * day;
    case "last_30":
      return t >= startOfToday - 30 * day;
    case "custom": {
      const fromOk = range.from ? t >= new Date(range.from).getTime() : true;
      const toOk = range.to ? t < new Date(range.to).getTime() + day : true;
      return fromOk && toOk;
    }
    default:
      return true;
  }
}

export function dateRangeIsActive(range: DateRangeValue): boolean {
  if (!range || range.preset === "all") return false;
  if (range.preset === "custom" && !range.from && !range.to) return false;
  return true;
}

export function describeDateRange(range: DateRangeValue): string {
  switch (range.preset) {
    case "today":
      return "Today";
    case "yesterday":
      return "Yesterday";
    case "last_7":
      return "Last 7 days";
    case "last_30":
      return "Last 30 days";
    case "custom":
      if (range.from && range.to) return `${range.from} → ${range.to}`;
      if (range.from) return `From ${range.from}`;
      if (range.to) return `Until ${range.to}`;
      return "Custom";
    default:
      return "All time";
  }
}
