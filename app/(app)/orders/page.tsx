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
import { orders as ordersSeed } from "@/lib/mock-data";
import { AGENTS, Agent, Order, OrderStatus, Platform } from "@/lib/types";
import { UpdateStatusModal } from "@/components/orders/UpdateStatusModal";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";
import { usePageContext } from "@/lib/chat-context";
import {
  DateRangeFilter,
  DateRangeValue,
  dateRangeIsActive,
  defaultDateRange,
  describeDateRange,
  isInDateRange
} from "@/components/ui/DateRangeFilter";
import { DateRangeDropdown } from "@/components/ui/DateRangeDropdown";

const statusTone: Record<OrderStatus, "success" | "warning" | "danger" | "info" | "neutral" | "brand" | "purple"> = {
  confirmed: "success",
  hold: "purple",
  cancelled: "danger"
};

const ALL_ORDER_STATUSES: OrderStatus[] = ["confirmed", "hold", "cancelled"];

const ORDER_CHANNELS: Platform[] = ["shopify", "amazon", "flipkart", "meta", "instagram"];

type QuickTab = "all" | "confirmed" | "hold" | "cancelled";
const QUICK_TABS: { key: QuickTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "hold", label: "Hold" },
  { key: "cancelled", label: "Cancelled" }
];

interface OrderFilters {
  statuses: OrderStatus[];
  channels: Platform[];
  payment: ("prepaid" | "cod")[];
  minTotal: number;
  agents: Agent[];
  dateRange: DateRangeValue;
}

const defaultOrderFilters: OrderFilters = {
  statuses: [],
  channels: [],
  payment: [],
  minTotal: 0,
  agents: [],
  dateRange: defaultDateRange
};

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<OrderFilters>(defaultOrderFilters);
  const [filters, setFilters] = useState<OrderFilters>(defaultOrderFilters);
  const [quickTab, setQuickTab] = useState<QuickTab>("all");
  const [orders, setOrders] = useState<Order[]>(ordersSeed);
  const [editing, setEditing] = useState<Order | null>(null);

  const updateStatus = (
    id: string,
    next: { status: OrderStatus; note: string }
  ) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const entry = { status: next.status, note: next.note, at: now, by: o.agent };
        return {
          ...o,
          status: next.status,
          statusNote: next.note,
          statusUpdatedAt: now,
          holdReason: next.status === "hold" ? next.note : undefined,
          statusHistory: [...(o.statusHistory ?? []), entry]
        };
      })
    );
    setEditing(null);
  };

  const filteredOrders = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o: Order) => {
      if (quickTab !== "all" && o.status !== quickTab) return false;
      if (filters.statuses.length && !filters.statuses.includes(o.status)) return false;
      if (filters.channels.length && !filters.channels.includes(o.platform)) return false;
      if (filters.payment.length && !filters.payment.includes(o.payment)) return false;
      if (filters.agents.length && !filters.agents.includes(o.agent)) return false;
      if (!isInDateRange(o.placedAt, filters.dateRange)) return false;
      if (o.total < filters.minTotal) return false;
      if (!q) return true;
      return (
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.city.toLowerCase().includes(q) ||
        o.agent.toLowerCase().includes(q)
      );
    });
  }, [filters, query, quickTab]);

  const chatContext = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
    const byStatus = filteredOrders.reduce<Record<string, number>>((acc, o) => {
      acc[o.status] = (acc[o.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      kind: "orders",
      summary: `Orders page. ${filteredOrders.length} orders currently visible (after filters/search). Total revenue ${formatINR(totalRevenue)}. By status: ${JSON.stringify(byStatus)}.`,
      rows: filteredOrders.slice(0, 50).map((o) => ({
        id: o.id,
        customer: o.customer,
        city: o.city,
        platform: o.platform,
        status: o.status,
        payment: o.payment,
        total: o.total,
        agent: o.agent,
        placedAt: o.placedAt,
        holdReason: o.holdReason,
        statusNote: o.statusNote,
        statusUpdatedAt: o.statusUpdatedAt
      }))
    };
  }, [filteredOrders]);
  usePageContext(chatContext);

  const activeFilterCount =
    filters.statuses.length +
    filters.channels.length +
    filters.payment.length +
    filters.agents.length +
    (filters.minTotal > 0 ? 1 : 0) +
    (dateRangeIsActive(filters.dateRange) ? 1 : 0);

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
  function toggleAgent(a: Agent) {
    setDraft((d) => ({
      ...d,
      agents: d.agents.includes(a) ? d.agents.filter((x) => x !== a) : [...d.agents, a]
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Real-time order sync across Shopify, Amazon, Flipkart, Meta & Instagram shops."
        actions={
          <>
            <DateRangeDropdown
              value={filters.dateRange}
              onChange={(next) => {
                setFilters((f) => ({ ...f, dateRange: next }));
                setDraft((d) => ({ ...d, dateRange: next }));
              }}
            />
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

      <div className="flex flex-wrap items-center gap-1.5">
        {QUICK_TABS.map((t) => {
          const count =
            t.key === "all"
              ? orders.length
              : orders.filter((o) => o.status === t.key).length;
          const active = quickTab === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setQuickTab(t.key)}
              className={
                "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition " +
                (active
                  ? "border-brand-500/60 bg-brand-500/15 text-brand-300"
                  : "border-border bg-card/40 text-fg-muted hover:bg-bg-muted hover:text-fg")
              }
            >
              {t.label}
              <span
                className={
                  "rounded-md px-1.5 py-0.5 text-[10px] font-semibold " +
                  (active ? "bg-brand-500/30 text-brand-100" : "bg-bg-muted text-fg-subtle")
                }
              >
                {count}
              </span>
            </button>
          );
        })}
        {dateRangeIsActive(filters.dateRange) && (
          <span className="ml-2 rounded-md border border-border bg-card/60 px-2 py-1 text-[10px] text-fg-muted">
            {describeDateRange(filters.dateRange)}
          </span>
        )}
      </div>

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
                  <th className="py-2.5 pl-5 pr-3 text-left font-medium">
                    <input type="checkbox" className="accent-brand-500" />
                  </th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-left font-medium">Order</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-left font-medium">Customer</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-left font-medium">Channel</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">Items</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">Total</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-left font-medium">Payment</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-left font-medium">Status</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-left font-medium">Agent</th>
                  <th className="whitespace-nowrap px-3 py-2.5 text-right font-medium">Placed</th>
                  <th className="py-2.5 pr-5 text-right font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={11} className="py-10 text-center text-sm text-fg-muted">
                      No orders match the current filters
                    </td>
                  </tr>
                )}
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-bg-muted/50">
                    <td className="py-3 pl-5 pr-3">
                      <input type="checkbox" className="accent-brand-500" />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 font-medium text-fg">{o.id}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar src={o.customerAvatar} alt={o.customer} size={26} />
                        <div className="leading-tight">
                          <div className="whitespace-nowrap text-sm font-medium text-fg">{o.customer}</div>
                          <div className="whitespace-nowrap text-[11px] text-fg-subtle">{o.city}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3"><PlatformIcon platform={o.platform} showLabel /></td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums">{o.items}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right font-semibold tabular-nums">{formatINR(o.total)}</td>
                    <td className="px-3 py-3">
                      <Badge tone={o.payment === "prepaid" ? "success" : "warning"} className="whitespace-nowrap">
                        {o.payment.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-0.5">
                        <Badge tone={statusTone[o.status] ?? "neutral"} dot className="whitespace-nowrap">
                          {o.status.replace(/_/g, " ")}
                        </Badge>
                        {o.status === "hold" && o.holdReason && (
                          <span className="max-w-[180px] truncate text-[10px] italic text-fg-subtle" title={o.holdReason}>
                            {o.holdReason}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-fg-muted">{o.agent}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right text-xs text-fg-muted">
                      <div className="flex flex-col items-end">
                        <span>{timeAgo(o.placedAt)}</span>
                        {o.statusNote && (
                          <span className="max-w-[160px] truncate text-[10px] italic text-fg-subtle" title={o.statusNote}>
                            “{o.statusNote}”
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(o)}
                      >
                        Update
                      </Button>
                    </td>
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

        <FilterGroup label="Agent">
          <div className="grid grid-cols-1 gap-1.5">
            {AGENTS.map((a) => (
              <CheckOption
                key={a}
                checked={draft.agents.includes(a)}
                onChange={() => toggleAgent(a)}
                label={a}
                count={orders.filter((o) => o.agent === a).length}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Date placed" hint={describeDateRange(draft.dateRange)}>
          <DateRangeFilter
            value={draft.dateRange}
            onChange={(next) => setDraft((d) => ({ ...d, dateRange: next }))}
            label=""
          />
        </FilterGroup>
      </FilterDrawer>

      <UpdateStatusModal
        order={editing}
        onClose={() => setEditing(null)}
        onSubmit={(next) => editing && updateStatus(editing.id, next)}
      />
    </div>
  );
}
