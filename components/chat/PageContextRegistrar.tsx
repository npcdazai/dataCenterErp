"use client";

import { useMemo } from "react";
import type { PageContext } from "@/lib/chat-types";
import { usePageContext } from "@/lib/chat-context";

export function PageContextRegistrar({ context }: { context: PageContext }) {
  const memo = useMemo(() => context, [JSON.stringify(context)]);
  usePageContext(memo);
  return null;
}
