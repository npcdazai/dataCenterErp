"use client";

import { ThemeProvider } from "next-themes";
import { ChatProvider } from "@/lib/chat-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ChatProvider>{children}</ChatProvider>
    </ThemeProvider>
  );
}
