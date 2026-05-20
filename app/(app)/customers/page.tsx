"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Filter, Plus, Search, Users } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { customers } from "@/lib/mock-data";
import { Platform } from "@/lib/types";
import { cn, formatINR, formatNumber, timeAgo } from "@/lib/utils";

const segmentTone: Record<string, "brand" | "success" | "warning" | "danger" | "neutral" | "purple"> = {
  vip: "purple",
  loyal: "brand",
  new: "info" as never,
  at_risk: "warning",
  churned: "danger"
};

type ChannelTab = "all" | Platform;

const channelTabs: { key: ChannelTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "shopify", label: "Shopify" },
  { key: "amazon", label: "Amazon" },
  { key: "flipkart", label: "Flipkart" },
  { key: "meta", label: "Meta Ads" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "website", label: "Website" }
];

export default function CustomersPage() {
  const [active, setActive] = useState<ChannelTab>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const map = new Map<ChannelTab, number>();
    map.set("all", customers.length);
    for (const c of customers) {
      map.set(c.platform, (map.get(c.platform) ?? 0) + 1);
    }
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => {
      if (active !== "all" && c.platform !== active) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
      );
    });
  }, [active, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Unified profiles across Shopify, Amazon, Flipkart, Meta and more."
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="h-3.5 w-3.5" /> Segment
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm">
              <Plus className="h-3.5 w-3.5" /> Add customer
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Customers" value={formatNumber(238_412)} delta={6.2} icon={<Users />} tone="brand" />
        <KpiCard label="VIP Segment" value="4,128" delta={11.4} tone="purple" />
        <KpiCard label="Retention 90d" value="68.4%" delta={2.1} tone="success" />
        <KpiCard label="Avg CLV" value={formatINR(18_400, { compact: true })} delta={4.8} tone="info" />
      </div>

      <Card>
        {/* Channel tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b border-border px-3 pt-3">
          {channelTabs.map((t) => {
            const isActive = active === t.key;
            const count = counts.get(t.key) ?? 0;
            return (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={cn(
                  "relative inline-flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition",
                  isActive ? "text-fg" : "text-fg-muted hover:text-fg"
                )}
              >
                {t.key !== "all" && (
                  <PlatformIcon platform={t.key as Platform} />
                )}
                <span>{t.label}</span>
                <span
                  className={cn(
                    "inline-flex h-4 min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-semibold tabular-nums",
                    isActive
                      ? "bg-brand-500/15 text-brand-600 dark:text-brand-300"
                      : "bg-bg-muted text-fg-subtle"
                  )}
                >
                  {count}
                </span>
                {isActive && (
                  <motion.span
                    layoutId="customers-tab-underline"
                    className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-brand-500"
                  />
                )}
              </button>
            );
          })}
        </div>

        <CardHeader
          title={
            active === "all"
              ? "All customers"
              : `${channelTabs.find((t) => t.key === active)?.label} customers`
          }
          description={`${filtered.length} of ${counts.get(active) ?? 0} shown · synced 2 min ago`}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search name, email, phone…"
                  className="h-8 w-56 rounded-lg border border-border bg-card pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-3.5 w-3.5" /> Filters
              </Button>
            </div>
          }
        />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="py-2.5 pl-5 text-left font-medium">Customer</th>
                  <th className="py-2.5 text-left font-medium">Channel</th>
                  <th className="py-2.5 text-left font-medium">Location</th>
                  <th className="py-2.5 text-right font-medium">Orders</th>
                  <th className="py-2.5 text-right font-medium">Spend</th>
                  <th className="py-2.5 text-right font-medium">CLV</th>
                  <th className="py-2.5 text-left font-medium">Segment</th>
                  <th className="py-2.5 text-right font-medium">Risk</th>
                  <th className="py-2.5 pr-5 text-right font-medium">Last seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-sm text-fg-muted">
                      No customers in this channel
                    </td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-muted/50">
                    <td className="py-3 pl-5">
                      <div className="flex items-center gap-3">
                        <Avatar src={c.avatar} alt={c.name} size={32} />
                        <div className="leading-tight">
                          <div className="text-sm font-medium text-fg">{c.name}</div>
                          <div className="text-[11px] text-fg-subtle">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <PlatformIcon platform={c.platform} showLabel />
                    </td>
                    <td className="py-3 text-sm text-fg-muted">
                      {c.city}, {c.state}
                    </td>
                    <td className="py-3 text-right font-medium tabular-nums">{c.orders}</td>
                    <td className="py-3 text-right tabular-nums">{formatINR(c.spend, { compact: true })}</td>
                    <td className="py-3 text-right font-semibold tabular-nums text-fg">
                      {formatINR(c.clv, { compact: true })}
                    </td>
                    <td className="py-3">
                      <Badge tone={segmentTone[c.segment]} dot>
                        {c.segment.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-right">
                      <div className="ml-auto flex items-center justify-end gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-muted">
                          <div
                            className={`h-full rounded-full ${
                              c.riskScore > 60
                                ? "bg-rose-500"
                                : c.riskScore > 30
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${c.riskScore}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-xs tabular-nums text-fg-muted">
                          {c.riskScore}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-5 text-right text-xs text-fg-muted">
                      {timeAgo(c.lastSeen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
