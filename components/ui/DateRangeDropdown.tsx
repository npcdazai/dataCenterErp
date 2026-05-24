"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarRange, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  DateRangePreset,
  DateRangeValue,
  describeDateRange
} from "./DateRangeFilter";

const PRESETS: { key: DateRangePreset; label: string }[] = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "last_7", label: "Last 7 days" },
  { key: "last_30", label: "Last 30 days" }
];

interface Props {
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  className?: string;
}

export function DateRangeDropdown({ value, onChange, className }: Props) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label = describeDateRange(value);

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card/60 px-3 text-xs font-medium text-fg hover:bg-bg-muted"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <CalendarRange className="h-3.5 w-3.5 text-fg-muted" />
        <span className="whitespace-nowrap">{label}</span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-fg-subtle transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 z-30 mt-1.5 w-64 overflow-hidden rounded-lg border border-border bg-bg shadow-elevated"
            role="listbox"
          >
            <ul className="py-1">
              {PRESETS.map((p) => {
                const active = value.preset === p.key;
                return (
                  <li key={p.key}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange({ preset: p.key });
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-bg-muted",
                        active ? "text-brand-300" : "text-fg"
                      )}
                    >
                      {p.label}
                      {active && <Check className="h-3.5 w-3.5" />}
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border bg-bg-subtle/40 px-3 py-2">
              <div className="mb-1.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                Custom range
              </div>
              <div className="grid grid-cols-2 gap-2">
                <label className="space-y-1 text-[10px] text-fg-subtle">
                  From
                  <input
                    type="date"
                    value={value.preset === "custom" ? value.from ?? "" : ""}
                    max={value.preset === "custom" ? value.to : undefined}
                    onChange={(e) =>
                      onChange({
                        preset: "custom",
                        from: e.target.value,
                        to: value.preset === "custom" ? value.to : undefined
                      })
                    }
                    className="block h-7 w-full rounded-md border border-border bg-card/60 px-2 text-[11px] text-fg focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </label>
                <label className="space-y-1 text-[10px] text-fg-subtle">
                  To
                  <input
                    type="date"
                    value={value.preset === "custom" ? value.to ?? "" : ""}
                    min={value.preset === "custom" ? value.from : undefined}
                    onChange={(e) =>
                      onChange({
                        preset: "custom",
                        from: value.preset === "custom" ? value.from : undefined,
                        to: e.target.value
                      })
                    }
                    className="block h-7 w-full rounded-md border border-border bg-card/60 px-2 text-[11px] text-fg focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
