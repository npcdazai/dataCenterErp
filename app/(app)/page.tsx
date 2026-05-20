import {
  Boxes,
  Download,
  IndianRupee,
  Package,
  ShoppingCart,
  Truck,
  Users
} from "lucide-react";
import { DashboardFilters } from "@/components/layout/DashboardFilters";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { ChartCard } from "@/components/ui/ChartCard";
import { KpiCard } from "@/components/ui/KpiCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { ChannelMix } from "@/components/charts/ChannelMix";
import { Funnel } from "@/components/charts/Funnel";
import { GeoSplit } from "@/components/charts/GeoSplit";
import {
  ChannelMixDetail,
  FunnelDetail,
  GeoDetail,
  RevenueDetail
} from "@/components/charts/ChartDetails";
import { activity, orders, products } from "@/lib/mock-data";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "danger" | "info" | "neutral" | "brand"> = {
  delivered: "success",
  shipped: "info",
  out_for_delivery: "info",
  packed: "brand",
  confirmed: "brand",
  pending: "warning",
  returned: "danger",
  cancelled: "neutral"
};

export default function HomePage() {
  const topProducts = [...products].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const recentOrders = orders.slice(0, 6);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Good evening, Pratham"
        description="Here's what's happening across all your channels today."
        actions={
          <>
            <DashboardFilters />
            <Button size="sm">
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </>
        }
      />

      {/* KPI grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Total Revenue"
          value={formatINR(48_27_500, { compact: true })}
          delta={12.4}
          deltaLabel="vs last 30 days"
          icon={<IndianRupee />}
          tone="brand"
          spark={[12, 14, 13, 18, 17, 22, 25, 28, 30, 34, 38, 42]}
        />
        <KpiCard
          label="Orders Today"
          value="1,284"
          delta={6.8}
          deltaLabel="vs yesterday"
          icon={<ShoppingCart />}
          tone="info"
          spark={[8, 10, 12, 11, 14, 13, 16, 18, 20, 22, 24, 28]}
        />
        <KpiCard
          label="Active Customers"
          value="38,412"
          delta={4.2}
          deltaLabel="last 7 days"
          icon={<Users />}
          tone="success"
          spark={[20, 22, 21, 23, 25, 27, 26, 29, 31, 30, 33, 36]}
        />
        <KpiCard
          label="Shipments In-Transit"
          value="2,431"
          delta={-2.1}
          deltaLabel="vs last week"
          icon={<Truck />}
          tone="warning"
          spark={[30, 28, 32, 31, 29, 30, 28, 27, 29, 30, 28, 26]}
        />
      </div>

      {/* Revenue + Channel mix */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Revenue across channels"
          description="Monthly performance · all platforms"
          headerAction={
            <div className="hidden items-center gap-1.5 md:flex">
              <Badge tone="brand" dot>Shopify</Badge>
              <Badge tone="warning" dot>Amazon</Badge>
              <Badge tone="info" dot>Flipkart</Badge>
              <Badge tone="danger" dot>Meta</Badge>
            </div>
          }
          preview={<RevenueChart />}
          detail={<RevenueDetail />}
          detailDescription="Drill-down of monthly revenue by channel, last 12 months"
          drawerWidth="w-full max-w-4xl"
        />

        <ChartCard
          title="Channel mix"
          description="Revenue share, last 30 days"
          preview={<ChannelMix />}
          detail={<ChannelMixDetail />}
          detailDescription="Per-channel revenue, orders, AOV and conversion rate"
        />
      </div>

      {/* Funnel + Geo + Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Conversion funnel"
          description="Visit → Purchase, last 30 days"
          headerAction={<Badge tone="success" dot>4.6% conv</Badge>}
          preview={<Funnel />}
          detail={<FunnelDetail />}
          detailDescription="Stage-by-stage drop-off analysis"
        />

        <ChartCard
          title="Geography"
          description="Top states by orders"
          preview={<GeoSplit />}
          detail={<GeoDetail />}
          detailDescription="State-wise revenue, orders and AOV"
        />

        <Card>
          <CardHeader
            title="Live activity"
            description="Real-time across channels"
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-500">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulseSoft rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live
              </span>
            }
          />
          <CardBody>
            <ol className="space-y-3">
              {activity.map((a) => (
                <li key={a.id} className="flex gap-3">
                  <div className="relative mt-1">
                    <div className="h-2 w-2 rounded-full bg-brand-500 ring-4 ring-brand-500/20" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-tight text-fg">
                      {a.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-fg-muted">
                      <span>{a.meta}</span>
                      <span className="text-fg-subtle">·</span>
                      <span>{timeAgo(a.at)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      {/* Recent orders + Top products */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Recent orders"
            description="Latest orders across all platforms"
            action={
              <Button variant="ghost" size="sm" className="text-fg-muted">
                View all
              </Button>
            }
          />
          <CardBody className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                    <th className="py-2.5 pl-5 text-left font-medium">Order</th>
                    <th className="py-2.5 text-left font-medium">Customer</th>
                    <th className="py-2.5 text-left font-medium">Channel</th>
                    <th className="py-2.5 text-right font-medium">Total</th>
                    <th className="py-2.5 text-left font-medium">Status</th>
                    <th className="py-2.5 pr-5 text-right font-medium">Placed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-bg-muted/50">
                      <td className="py-3 pl-5 font-medium text-fg">{o.id}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar src={o.customerAvatar} alt={o.customer} size={26} />
                          <div className="leading-tight">
                            <div className="text-sm font-medium text-fg">{o.customer}</div>
                            <div className="text-[11px] text-fg-subtle">{o.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <PlatformIcon platform={o.platform} showLabel />
                      </td>
                      <td className="py-3 text-right font-medium tabular-nums text-fg">
                        {formatINR(o.total)}
                      </td>
                      <td className="py-3">
                        <Badge tone={statusTone[o.status] ?? "neutral"} dot>
                          {o.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 pr-5 text-right text-xs text-fg-muted">
                        {timeAgo(o.placedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Top products"
            description="By revenue, last 30 days"
            action={
              <Badge tone="brand" dot>
                <Package className="h-3 w-3" /> SKUs
              </Badge>
            }
          />
          <CardBody className="space-y-3">
            {topProducts.map((p, i) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-bg-subtle/50 px-3 py-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  #{i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-fg">
                    {p.name}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-fg-muted">
                    <span>{p.category}</span>
                    <span className="text-fg-subtle">·</span>
                    <span>{formatNumber(p.sold)} sold</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums text-fg">
                    {formatINR(p.revenue, { compact: true })}
                  </div>
                  <div className="text-[10px] text-emerald-500">+ {(8 + i * 2).toFixed(1)}%</div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      {/* Inventory + Vendor + Marketing strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader title="Inventory health" description="Stock & alerts" />
          <CardBody>
            <div className="grid grid-cols-2 gap-3">
              <Tile
                icon={Boxes}
                label="SKUs tracked"
                value="3,418"
                tone="brand"
              />
              <Tile
                icon={Package}
                label="Low stock"
                value="12"
                tone="warning"
              />
              <Tile
                icon={Package}
                label="Out of stock"
                value="3"
                tone="danger"
              />
              <Tile
                icon={ShoppingCart}
                label="Auto-restock"
                value="9"
                tone="success"
              />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Vendor performance" description="Top 4 vendors" />
          <CardBody className="space-y-2.5">
            {[
              ["Lumen & Co.", "98.4% SLA", 96],
              ["Nimbus Tech", "97.2% SLA", 91],
              ["Atlas Tools", "94.0% SLA", 84],
              ["Mira Organics", "92.1% SLA", 79]
            ].map(([name, sla, score]) => (
              <div key={name as string}>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-fg">{name}</span>
                  <span className="text-fg-muted">{sla}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Marketing ROI" description="Last 30 days" />
          <CardBody className="space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  Blended ROAS
                </div>
                <div className="text-3xl font-semibold tracking-tight text-fg">
                  4.6×
                </div>
              </div>
              <Badge tone="success" dot>
                +0.4× WoW
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat label="Spend" value="₹8.4L" />
              <Stat label="Revenue" value="₹38.6L" />
              <Stat label="CAC" value="₹312" />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Tile({
  icon: Icon,
  label,
  value,
  tone
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  tone: "brand" | "warning" | "danger" | "success";
}) {
  const toneClass = {
    brand: "text-brand-500 bg-brand-500/10",
    warning: "text-amber-500 bg-amber-500/10",
    danger: "text-rose-500 bg-rose-500/10",
    success: "text-emerald-500 bg-emerald-500/10"
  }[tone];
  return (
    <div className="rounded-xl border border-border bg-bg-subtle/40 p-3">
      <div className={`mb-2 inline-flex h-7 w-7 items-center justify-center rounded-lg ${toneClass}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="text-lg font-semibold text-fg">{value}</div>
      <div className="text-[11px] text-fg-muted">{label}</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-subtle/40 px-2 py-2">
      <div className="text-sm font-semibold text-fg">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">
        {label}
      </div>
    </div>
  );
}
