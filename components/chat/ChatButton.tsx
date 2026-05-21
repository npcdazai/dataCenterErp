"use client";

import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useChat } from "@/lib/chat-context";

export function ChatButton() {
  const { setOpen } = useChat();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Open AI assistant"
      className="text-fg-muted hover:text-fg"
      onClick={() => setOpen(true)}
    >
      <Sparkles className="h-4 w-4" />
    </Button>
  );
}
