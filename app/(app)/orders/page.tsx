"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Filter,
  Printer,
  Search,
  ShoppingCart,
  TruckIcon
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { OrdersChart } from "@/components/charts/OrdersChart";
import { OrdersDetail } from "@/components/charts/ChartDetails";
import { ChartCard } from "@/components/ui/ChartCard";
import { CheckOption, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { orders } from "@/lib/mock-data";
import { OrderStatus, Platform } from "@/lib/types";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "danger" | "info" | "neutral" | "brand"> = {
  delivered: "success",
  shipped: "info",
  out_for_delivery: "info",
  packed: "brand",
  confirmed: "brand",
  pending: "warning",
  returned: "danger",
  cancelled: "neutral",
  refunded: "neutral"
};

const ALL_ORDER_STATUSES: OrderStatus[] = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "returned",
  "cancelled",
  "refunded"
];

const ORDER_CHANNELS: Platform[] = ["shopify", "amazon", "flipkart", "meta", "instagram"];

interface OrderFilters {
  statuses: OrderStatus[];
  channels: Platform[];
  payment: ("prepaid" | "cod")[];
  minTotal: number;
}

const defaultOrderFilters: OrderFilters = {
  statuses: [],
  channels: [],
  payment: [],
  minTotal: 0
};

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<OrderFilters>(defaultOrderFilters);
  const [filters, setFilters] = useState<OrderFilters>(defaultOrderFilters);

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filters.statuses.length && !filters.statuses.includes(o.status)) return false;
      if (filters.channels.length && !filters.channels.includes(o.platform)) return false;
      if (filters.payment.length && !filters.payment.includes(o.payment)) return false;
      if (o.total < filters.minTotal) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q)
      );
    });
  }, [filters, query]);

  const activeFilterCount =
    filters.statuses.length +
    filters.channels.length +
    filters.payment.length +
    (filters.minTotal > 0 ? 1 : 0);

  function openFilters() {
    setDraft(filters);
    setFilterOpen(true);
  }
  function applyFilters() {
    setFilters(draft);
  }
  function resetFilters() {
    setDraft(defaultOrderFilters);
    setFilters(defaultOrderFilters);
  }
  function toggleStatus(s: OrderStatus) {
    setDraft((d) => ({
      ...d,
      statuses: d.statuses.includes(s) ? d.statuses.filter((x) => x !== s) : [...d.statuses, s]
    }));
  }
  function toggleChannel(c: Platform) {
    setDraft((d) => ({
      ...d,
      channels: d.channels.includes(c) ? d.channels.filter((x) => x !== c) : [...d.channels, c]
    }));
  }
  function togglePayment(p: "prepaid" | "cod") {
    setDraft((d) => ({
      ...d,
      payment: d.payment.includes(p) ? d.payment.filter((x) => x !== p) : [...d.payment, p]
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Real-time order sync across Shopify, Amazon, Flipkart, Meta & Instagram shops."
        actions={
          <>
            <Button variant="outline" size="sm"><Printer className="h-3.5 w-3.5" /> Print labels</Button>
            <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" /> Export</Button>
            <Button size="sm"><TruckIcon className="h-3.5 w-3.5" /> Bulk ship</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Orders Today" value={formatNumber(1284)} delta={6.8} icon={<ShoppingCart />} tone="brand" />
        <KpiCard label="AOV" value={formatINR(1840)} delta={2.3} tone="success" />
        <KpiCard label="COD Share" value="38%" delta={-1.4} tone="warning" />
        <KpiCard label="Cancellation" value="2.1%" delta={-0.3} tone="info" />
      </div>

      <ChartCard
        title="Orders & refunds"
        description="Last 30 days"
        preview={<OrdersChart />}
        detail={<OrdersDetail />}
        drawerWidth="w-full max-w-4xl"
      />

      <Card>
        <CardHeader
          title="All orders"
          description={`${filteredOrders.length} of ${orders.length} shown`}
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search order #, customer, city…"
                  className="h-8 w-64 rounded-lg border border-border bg-card pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <Button variant="outline" size="sm" onClick={openFilters}>
                <Filter className="h-3.5 w-3.5" /> Filters
                {activeFilterCount > 0 && (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          }
        />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="py-2.5 pl-5 text-left font-medium">
                    <input type="checkbox" className="accent-brand-500" />
                  </th>
                  <th className="py-2.5 text-left font-medium">Order</th>
                  <th className="py-2.5 text-left font-medium">Customer</th>
                  <th className="py-2.5 text-left font-medium">Channel</th>
                  <th className="py-2.5 text-right font-medium">Items</th>
                  <th className="py-2.5 text-right font-medium">Total</th>
                  <th className="py-2.5 text-left font-medium">Payment</th>
                  <th className="py-2.5 text-left font-medium">Status</th>
                  <th className="py-2.5 pr-5 text-right font-medium">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-sm text-fg-muted">
                      No orders match the current filters
                    </td>
                  </tr>
                )}
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-bg-muted/50">
                    <td className="py-3 pl-5">
                      <input type="checkbox" className="accent-brand-500" />
                    </td>
                    <td className="py-3 font-medium text-fg">{o.id}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={o.customerAvatar} alt={o.customer} size={26} />
                        <div className="leading-tight">
                          <div className="text-sm font-medium text-fg">{o.customer}</div>
                          <div className="text-[11px] text-fg-subtle">{o.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><PlatformIcon platform={o.platform} showLabel /></td>
                    <td className="py-3 text-right tabular-nums">{o.items}</td>
                    <td className="py-3 text-right font-semibold tabular-nums">{formatINR(o.total)}</td>
                    <td className="py-3">
                      <Badge tone={o.payment === "prepaid" ? "success" : "warning"}>
                        {o.payment.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge tone={statusTone[o.status] ?? "neutral"} dot>
                        {o.status.replace(/_/g, " ")}
                      </Badge>
                    </td>
                    <td className="py-3 pr-5 text-right text-xs text-fg-muted">{timeAgo(o.placedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        activeCount={activeFilterCount}
      >
        <FilterGroup label="Status">
          <div className="grid grid-cols-1 gap-1.5">
            {ALL_ORDER_STATUSES.map((s) => (
              <CheckOption
                key={s}
                checked={draft.statuses.includes(s)}
                onChange={() => toggleStatus(s)}
                label={s.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                count={orders.filter((o) => o.status === s).length}
                tone={statusTone[s]}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Channel">
          <div className="grid grid-cols-1 gap-1.5">
            {ORDER_CHANNELS.map((c) => (
              <CheckOption
                key={c}
                checked={draft.channels.includes(c)}
                onChange={() => toggleChannel(c)}
                label={c.replace(/\b\w/g, (l) => l.toUpperCase())}
                count={orders.filter((o) => o.platform === c).length}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Payment">
          <div className="grid grid-cols-2 gap-1.5">
            <CheckOption
              checked={draft.payment.includes("prepaid")}
              onChange={() => togglePayment("prepaid")}
              label="Prepaid"
              count={orders.filter((o) => o.payment === "prepaid").length}
              tone="success"
            />
            <CheckOption
              checked={draft.payment.includes("cod")}
              onChange={() => togglePayment("cod")}
              label="COD"
              count={orders.filter((o) => o.payment === "cod").length}
              tone="warning"
            />
          </div>
        </FilterGroup>

        <FilterGroup label="Minimum order value" hint={formatINR(draft.minTotal)}>
          <input
            type="range"
            min={0}
            max={50000}
            step={500}
            value={draft.minTotal}
            onChange={(e) =>
              setDraft((d) => ({ ...d, minTotal: Number(e.target.value) }))
            }
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-fg-subtle">
            <span>₹0</span>
            <span>₹50K</span>
          </div>
        </FilterGroup>
      </FilterDrawer>
    </div>
  );
}
