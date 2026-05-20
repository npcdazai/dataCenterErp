"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { notifications } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const levelTone: Record<
  string,
  "danger" | "warning" | "success" | "info"
> = {
  danger: "danger",
  warning: "warning",
  success: "success",
  info: "info"
};

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((o) => !o)}
        className="text-fg-muted hover:text-fg"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="absolute right-0 top-full z-40 mt-2 w-[360px] overflow-hidden rounded-xl border border-border bg-card shadow-elevated"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <div className="text-sm font-semibold">Notifications</div>
                <button className="text-xs text-brand-600 hover:underline">
                  Mark all read
                </button>
              </div>
              <ul className="max-h-[420px] divide-y divide-border overflow-y-auto">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex gap-3 px-4 py-3 hover:bg-bg-muted/60"
                  >
                    <Badge tone={levelTone[n.level]} dot>
                      {n.level}
                    </Badge>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-sm font-medium text-fg">
                          {n.title}
                        </div>
                        {!n.read && (
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
                        )}
                      </div>
                      <div className="mt-0.5 text-xs text-fg-muted">{n.body}</div>
                      <div className="mt-1 text-[11px] text-fg-subtle">
                        {timeAgo(n.at)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="border-t border-border px-4 py-2.5 text-center">
                <button className="text-xs font-medium text-brand-600 hover:underline">
                  View all activity →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
