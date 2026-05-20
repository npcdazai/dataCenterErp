import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { RevenueChart } from "@/components/charts/RevenueChart";
import { OrdersChart } from "@/components/charts/OrdersChart";
import { ChannelMix } from "@/components/charts/ChannelMix";
import { GeoSplit } from "@/components/charts/GeoSplit";
import { Funnel } from "@/components/charts/Funnel";
import { formatINR } from "@/lib/utils";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Deep-dive across sales, customers, channels, and operations."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="GMV (30d)" value={formatINR(4_82_75_000, { compact: true })} delta={12.4} tone="brand" />
        <KpiCard label="Repeat Rate" value="34.2%" delta={2.1} tone="success" />
        <KpiCard label="Refund Rate" value="3.1%" delta={-0.4} tone="warning" />
        <KpiCard label="NPS" value="62" delta={4} tone="info" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue trend" description="Monthly across all channels" />
          <CardBody><RevenueChart /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Channel mix" description="Share of revenue" />
          <CardBody><ChannelMix /></CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Orders & refunds" description="Daily, last 30 days" />
          <CardBody><OrdersChart /></CardBody>
        </Card>
        <Card>
          <CardHeader title="Funnel" description="Visit → Purchase" />
          <CardBody><Funnel /></CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Geography" description="State-wise performance" />
        <CardBody><GeoSplit /></CardBody>
      </Card>
    </div>
  );
}
