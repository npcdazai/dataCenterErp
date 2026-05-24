"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, X } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Order, OrderStatus } from "@/lib/types";

const ALL_STATUSES: OrderStatus[] = ["confirmed", "hold", "cancelled"];

const STATUS_TONE: Record<
  OrderStatus,
  "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "purple"
> = {
  confirmed: "success",
  hold: "purple",
  cancelled: "danger"
};

function prettyStatus(s: OrderStatus): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

interface Props {
  order: Order | null;
  onClose: () => void;
  onSubmit: (next: { status: OrderStatus; note: string }) => void;
}

export function UpdateStatusModal({ order, onClose, onSubmit }: Props) {
  const [status, setStatus] = useState<OrderStatus>("confirmed");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setNote("");
      setTouched(false);
      setSaving(false);
    }
  }, [order]);

  useEffect(() => {
    if (!order) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [order, onClose]);

  const trimmedNote = note.trim();
  const noteMissing = trimmedNote.length === 0;
  const noChange = order ? status === order.status && noteMissing : true;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (noteMissing) return;
    setSaving(true);
    onSubmit({ status, note: trimmedNote });
  }

  return (
    <AnimatePresence>
      {order && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-40 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
          />
          <div
            key="modal-wrap"
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
          >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="pointer-events-auto flex max-h-[min(90vh,640px)] w-[min(92vw,520px)] flex-col overflow-hidden rounded-2xl border border-border bg-bg shadow-elevated"
            role="dialog"
            aria-modal="true"
          >
            <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
              <header className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold tracking-tight text-fg">
                    Update order status
                  </h2>
                  <p className="text-xs text-fg-muted">
                    {order.id} · {order.customer}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-fg"
                >
                  <X className="h-4 w-4" />
                </button>
              </header>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
                <div className="flex items-center gap-2 text-xs text-fg-muted">
                  <span>Current:</span>
                  <Badge tone={STATUS_TONE[order.status]} dot>
                    {prettyStatus(order.status)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-fg">
                    New status
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                    {ALL_STATUSES.map((s) => {
                      const active = status === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(s)}
                          className={cn(
                            "rounded-md border px-2.5 py-1.5 text-xs font-medium transition",
                            active
                              ? "border-brand-500/60 bg-brand-500/15 text-brand-200"
                              : "border-border bg-card/40 text-fg-muted hover:bg-bg-muted hover:text-fg"
                          )}
                        >
                          {prettyStatus(s)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="status-note"
                    className="flex items-center gap-1.5 text-xs font-medium text-fg"
                  >
                    Description
                    <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    id="status-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onBlur={() => setTouched(true)}
                    rows={3}
                    placeholder="Reason for the status change (required)…"
                    aria-invalid={touched && noteMissing}
                    className={cn(
                      "block w-full resize-none rounded-lg border bg-card/60 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2",
                      touched && noteMissing
                        ? "border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-border focus:border-brand-500/60 focus:ring-brand-500/20"
                    )}
                  />
                  {touched && noteMissing && (
                    <p className="flex items-center gap-1.5 text-[11px] text-rose-400">
                      <AlertCircle className="h-3 w-3" />
                      Description is required to update the status.
                    </p>
                  )}
                </div>
              </div>

              <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-bg px-5 py-3">
                <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={noteMissing || noChange || saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Updating…
                    </>
                  ) : (
                    "Update status"
                  )}
                </Button>
              </footer>
            </form>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
