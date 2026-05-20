"use client";

import Link from "next/link";
import { ChevronDown, Command, HelpCircle, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationCenter } from "./NotificationCenter";

export function Topbar({ onOpenSidebar }: { onOpenSidebar?: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-bg/80 px-4 backdrop-blur-xl">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-fg-muted"
        onClick={onOpenSidebar}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="relative hidden flex-1 max-w-xl md:flex">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
        <input
          type="text"
          placeholder="Search orders, customers, SKUs, AWBs…"
          className="h-9 w-full rounded-lg border border-border bg-card/60 pl-9 pr-16 text-sm text-fg placeholder:text-fg-subtle focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
        <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-border bg-bg-muted px-1.5 py-0.5 text-[10px] font-medium text-fg-muted md:flex">
          <Command className="h-3 w-3" />K
        </div>
      </div>

      <div className="ml-auto flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
        >
          Last 30 days
          <ChevronDown className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help" className="text-fg-muted hover:text-fg">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <NotificationCenter />
        <ThemeToggle />
        <div className="ml-2 flex items-center gap-2 rounded-lg border border-border bg-card/60 px-2 py-1">
          <Avatar
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=pratham"
            alt="Pratham"
            size={26}
          />
          <div className="hidden text-left leading-tight md:block">
            <div className="text-xs font-semibold text-fg">Pratham</div>
            <div className="text-[10px] text-fg-subtle">Admin · Pratham</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-fg-subtle" />
        </div>
        <Link
          href="/login"
          aria-label="Sign out"
          className="ml-1 inline-flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-rose-500"
        >
          <LogOut className="h-4 w-4" />
        </Link>
      </div>
    </header>
  );
}
