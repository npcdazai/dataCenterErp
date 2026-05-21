"use client";

import { Sparkles } from "lucide-react";
import { useChat } from "@/lib/chat-context";

export function ChatButton() {
  const { setOpen } = useChat();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Open AI assistant"
      className="group relative inline-flex h-9 items-center gap-1.5 overflow-hidden rounded-lg bg-gradient-to-r from-brand-600 via-fuchsia-500 to-brand-600 bg-[length:200%_100%] px-3 text-xs font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_24px_-12px_rgba(99,102,241,0.6)] transition hover:bg-[position:100%_0] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_10px_28px_-10px_rgba(217,70,239,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      <Sparkles className="h-3.5 w-3.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" />
      <span className="hidden sm:inline">Ask AI</span>
    </button>
  );
}
