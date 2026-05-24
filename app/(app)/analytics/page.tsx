import { ChartCard } from "@/components/ui/ChartCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { OrdersChart } from "@/components/charts/OrdersChart";
import { ChannelMix } from "@/components/charts/ChannelMix";
import { GeoSplit } from "@/components/charts/GeoSplit";
import { Funnel } from "@/components/charts/Funnel";
import {
  ChannelMixDetail,
  FunnelDetail,
  GeoDetail,
  OrdersDetail,
  RevenueDetail
} from "@/components/charts/ChartDetails";
import { formatINR } from "@/lib/utils";
import { HeaderDateRange } from "@/components/ui/HeaderDateRange";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Deep-dive across sales, customers, channels, and operations."
        actions={<HeaderDateRange />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="GMV (30d)" value={formatINR(4_82_75_000, { compact: true })} delta={12.4} tone="brand" />
        <KpiCard label="Repeat Rate" value="34.2%" delta={2.1} tone="success" />
        <KpiCard label="Refund Rate" value="3.1%" delta={-0.4} tone="warning" />
        <KpiCard label="NPS" value="62" delta={4} tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Revenue trend"
          description="Monthly across all channels"
          preview={<RevenueChart />}
          detail={<RevenueDetail />}
          drawerWidth="w-full max-w-4xl"
        />
        <ChartCard
          title="Channel mix"
          description="Share of revenue"
          preview={<ChannelMix />}
          detail={<ChannelMixDetail />}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          className="lg:col-span-2"
          title="Orders & refunds"
          description="Daily, last 30 days"
          preview={<OrdersChart />}
          detail={<OrdersDetail />}
          drawerWidth="w-full max-w-4xl"
        />
        <ChartCard
          title="Funnel"
          description="Visit → Purchase"
          preview={<Funnel />}
          detail={<FunnelDetail />}
        />
      </div>

      <ChartCard
        title="Geography"
        description="State-wise performance"
        preview={<GeoSplit />}
        detail={<GeoDetail />}
        drawerWidth="w-full max-w-3xl"
      />
    </div>
  );
}
