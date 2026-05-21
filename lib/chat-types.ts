export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export interface PageContext {
  kind: string;
  summary: string;
  rows?: unknown;
}
