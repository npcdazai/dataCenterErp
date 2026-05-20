import { Download, Filter, Plus, Search, Users } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { customers } from "@/lib/mock-data";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";

const segmentTone: Record<string, "brand" | "success" | "warning" | "danger" | "neutral" | "purple"> = {
  vip: "purple",
  loyal: "brand",
  new: "info" as never,
  at_risk: "warning",
  churned: "danger"
};

export default function CustomersPage() {
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
        <CardHeader
          title="All customers"
          description={`${customers.length} of 238,412 shown · synced 2 min ago`}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" />
                <input
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
                {customers.map((c) => (
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
