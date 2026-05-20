"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Step {
  key: string;
  label: string;
  hint?: string;
}

export function Stepper({
  steps,
  current
}: {
  steps: Step[];
  current: number;
}) {
  return (
    <ol className="flex w-full items-center gap-2">
      {steps.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={s.key} className="relative flex flex-1 items-center gap-3">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition",
                  done
                    ? "border-brand-500 bg-brand-500 text-white"
                    : active
                    ? "border-brand-500 bg-brand-500/10 text-brand-600 ring-4 ring-brand-500/15"
                    : "border-border bg-bg-subtle text-fg-subtle"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
                {active && (
                  <motion.span
                    layoutId="stepper-glow"
                    className="absolute -inset-px rounded-full"
                    transition={{ duration: 0.25 }}
                  />
                )}
              </span>
              <div className="hidden sm:block">
                <div
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    active ? "text-fg" : done ? "text-fg" : "text-fg-muted"
                  )}
                >
                  {s.label}
                </div>
                {s.hint && (
                  <div className="text-[10px] text-fg-subtle">{s.hint}</div>
                )}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-2 h-px flex-1 rounded-full",
                  done ? "bg-brand-500" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
