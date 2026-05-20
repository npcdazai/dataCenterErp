"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  widthClassName?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  action,
  children,
  widthClassName = "w-full max-w-3xl"
}: DrawerProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
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
          <motion.aside
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "fixed inset-y-0 right-0 z-50 flex flex-col border-l border-border bg-bg shadow-elevated",
              widthClassName
            )}
            role="dialog"
            aria-modal="true"
          >
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="space-y-1">
                <h2 className="text-base font-semibold tracking-tight text-fg">
                  {title}
                </h2>
                {description && (
                  <p className="text-xs text-fg-muted">{description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {action}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-fg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
