"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Sparkles, Trash2, SendHorizonal, Loader2 } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useChat } from "@/lib/chat-context";

export function ChatDrawer() {
  const { open, setOpen, messages, send, sending, error, clear } = useChat();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input;
    setInput("");
    void send(text);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  }

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      widthClassName="w-full max-w-md"
      title={
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-500" />
          SML Assistant
        </span>
      }
      description="Internal helper — answers questions about the data you're viewing."
      action={
        messages.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            aria-label="Clear conversation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-rose-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null
      }
    >
      <div className="flex h-full flex-col">
        <div
          ref={scrollRef}
          className="flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {messages.length === 0 && (
            <div className="rounded-lg border border-dashed border-border bg-card/40 p-4 text-xs text-fg-muted">
              Ask about today's orders, leads stuck in a stage, top customers, or
              anything else visible on the current page.
            </div>
          )}
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-brand-600 text-white"
                    : "border border-border bg-card/60 text-fg"
                )}
              >
                {m.content || (sending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-fg-muted" />
                ) : null)}
              </div>
            </div>
          ))}
          {error && (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
              {error}
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-3 flex items-end gap-2 border-t border-border pt-3"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={2}
            placeholder="Ask the assistant…"
            className="flex-1 resize-none rounded-lg border border-border bg-card/60 px-3 py-2 text-sm text-fg placeholder:text-fg-subtle focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            disabled={sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || sending}
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizonal className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </Drawer>
  );
}
