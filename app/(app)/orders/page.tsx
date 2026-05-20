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
import { orders } from "@/lib/mock-data";
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

export default function OrdersPage() {
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
          description="Sortable, filterable view of every order"
          action={
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-fg-subtle" />
                <input
                  placeholder="Search order #, customer, AWB…"
                  className="h-8 w-64 rounded-lg border border-border bg-card pl-8 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
              <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Filters</Button>
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
                {orders.map((o) => (
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
    </div>
  );
}
