"use client";

import { ReactNode } from "react";
import { Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";

export function FilterDrawer({
  open,
  onClose,
  onApply,
  onReset,
  activeCount,
  children
}: {
  open: boolean;
  onClose: () => void;
  onApply?: () => void;
  onReset?: () => void;
  activeCount?: number;
  children: ReactNode;
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      widthClassName="w-full max-w-md"
      title={
        <span className="inline-flex items-center gap-2">
          <Filter className="h-4 w-4 text-brand-500" /> Filters
          {activeCount ? (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500/15 px-1.5 text-[11px] font-semibold text-brand-600">
              {activeCount}
            </span>
          ) : null}
        </span>
      }
      description="Refine the data shown in the table below"
    >
      <div className="space-y-5">{children}</div>

      <div className="sticky bottom-0 mt-6 flex items-center justify-between gap-2 border-t border-border bg-bg pt-4">
        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onApply?.();
              onClose();
            }}
          >
            Apply filters
          </Button>
        </div>
      </div>
    </Drawer>
  );
}

export function FilterGroup({
  label,
  children,
  hint
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <div className="text-xs font-semibold text-fg">{label}</div>
        {hint && <div className="text-[10px] text-fg-subtle">{hint}</div>}
      </div>
      {children}
    </div>
  );
}

export function CheckOption({
  checked,
  onChange,
  label,
  count,
  tone
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  count?: number;
  tone?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border bg-bg-subtle/40 px-3 py-2 hover:border-brand-500/40">
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded accent-brand-500"
        />
        <span className="text-sm text-fg">{label}</span>
        {tone && (
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              tone === "success"
                ? "bg-emerald-500"
                : tone === "warning"
                ? "bg-amber-500"
                : tone === "danger"
                ? "bg-rose-500"
                : tone === "info"
                ? "bg-cyan-500"
                : "bg-brand-500"
            }`}
          />
        )}
      </div>
      {typeof count === "number" && (
        <span className="rounded-md bg-bg-muted px-1.5 text-[11px] font-medium tabular-nums text-fg-muted">
          {count}
        </span>
      )}
    </label>
  );
}
