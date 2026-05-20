import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Truck
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { shipments } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/utils";
import { ShipmentStatus } from "@/lib/types";

const statusMeta: Record<
  ShipmentStatus,
  { label: string; tone: "success" | "warning" | "danger" | "info" | "brand" | "neutral" }
> = {
  label_created: { label: "Label created", tone: "neutral" },
  picked_up: { label: "Picked up", tone: "brand" },
  in_transit: { label: "In transit", tone: "info" },
  out_for_delivery: { label: "Out for delivery", tone: "info" },
  delivered: { label: "Delivered", tone: "success" },
  failed: { label: "Failed delivery", tone: "danger" },
  returned: { label: "Returned", tone: "danger" },
  rto_initiated: { label: "RTO initiated", tone: "warning" }
};

const timelineSteps: { key: ShipmentStatus; label: string }[] = [
  { key: "label_created", label: "Label" },
  { key: "picked_up", label: "Picked up" },
  { key: "in_transit", label: "In transit" },
  { key: "out_for_delivery", label: "OFD" },
  { key: "delivered", label: "Delivered" }
];

export default function ShipmentsPage() {
  const featured = shipments[2];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipments & Logistics"
        description="Real-time tracking via Delhivery + multi-courier API."
        actions={
          <>
            <Button variant="outline" size="sm">NDR queue</Button>
            <Button size="sm"><Truck className="h-3.5 w-3.5" /> Create shipment</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="In Transit" value={formatNumber(2431)} icon={<Truck />} delta={-2.1} tone="info" />
        <KpiCard label="Delivered (24h)" value={formatNumber(1862)} icon={<CheckCircle2 />} delta={4.6} tone="success" />
        <KpiCard label="Failed / NDR" value="34" icon={<AlertTriangle />} delta={-12} tone="danger" />
        <KpiCard label="SLA Breach Risk" value="11" icon={<Clock />} delta={3.4} tone="warning" />
      </div>

      {/* Featured live tracking */}
      <Card>
        <CardHeader
          title="Live shipment tracking"
          description="Featured order · Delhivery API webhook"
          action={
            <Badge tone={statusMeta[featured.status].tone} dot>
              {statusMeta[featured.status].label}
            </Badge>
          }
        />
        <CardBody className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Map placeholder */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-cyan-500/10 via-brand-500/10 to-violet-500/10 lg:col-span-2 min-h-[260px]">
            <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(hsl(var(--border))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border))_1px,transparent_1px)] [background-size:24px_24px]" />
            <div className="absolute left-[12%] top-[68%] flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-brand-500 ring-4 ring-brand-500/30" />
              <span className="rounded-md bg-card/90 px-2 py-0.5 text-[11px] font-medium shadow-card">
                Bhiwandi WH
              </span>
            </div>
            <div className="absolute right-[18%] top-[28%] flex items-center gap-1.5">
              <div className="relative h-3 w-3">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="absolute inset-0 rounded-full bg-emerald-500" />
              </div>
              <span className="rounded-md bg-card/90 px-2 py-0.5 text-[11px] font-medium shadow-card">
                {featured.destination}
              </span>
            </div>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 600 300" fill="none">
              <path
                d="M75 220 C 200 180, 280 180, 350 130 C 410 95, 470 88, 500 90"
                stroke="url(#gline)"
                strokeWidth="3"
                strokeDasharray="6 8"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gline">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                AWB Number
              </div>
              <div className="font-mono text-lg font-semibold text-fg">
                {featured.awb}
              </div>
              <div className="text-xs text-fg-muted">{featured.courier} · {featured.orderId}</div>
            </div>
            <div className="rounded-xl border border-border bg-bg-subtle/40 p-3">
              <div className="flex items-center gap-2 text-xs text-fg-muted">
                <MapPin className="h-3.5 w-3.5" /> Route
              </div>
              <div className="mt-1.5 text-sm">
                <span className="font-medium text-fg">{featured.origin}</span>
                <span className="mx-2 text-fg-subtle">→</span>
                <span className="font-medium text-fg">{featured.destination}</span>
              </div>
              <div className="mt-2 text-[11px] text-fg-subtle">
                ETA · {new Date(featured.eta).toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short"
                })}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] uppercase tracking-wider text-fg-subtle">
                Timeline
              </div>
              <ol className="space-y-2">
                {timelineSteps.map((step, i) => {
                  const stepIndex = timelineSteps.findIndex(
                    (s) => s.key === featured.status
                  );
                  const reached = i <= stepIndex;
                  return (
                    <li key={step.key} className="flex items-center gap-3">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold ring-2 ${
                          reached
                            ? "bg-brand-500 text-white ring-brand-500/30"
                            : "bg-bg-muted text-fg-subtle ring-border"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`text-sm ${
                          reached ? "font-medium text-fg" : "text-fg-muted"
                        }`}
                      >
                        {step.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Shipments table */}
      <Card>
        <CardHeader
          title="All shipments"
          description="Multi-courier · live status from carrier APIs"
          action={
            <div className="flex items-center gap-2">
              <Badge tone="success" dot>Delhivery: live</Badge>
              <Badge tone="success" dot>Bluedart: live</Badge>
              <Badge tone="warning" dot>Ekart: degraded</Badge>
            </div>
          }
        />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="py-2.5 pl-5 text-left font-medium">Shipment</th>
                  <th className="py-2.5 text-left font-medium">AWB</th>
                  <th className="py-2.5 text-left font-medium">Courier</th>
                  <th className="py-2.5 text-left font-medium">Customer</th>
                  <th className="py-2.5 text-left font-medium">Destination</th>
                  <th className="py-2.5 text-right font-medium">Weight</th>
                  <th className="py-2.5 text-left font-medium">Status</th>
                  <th className="py-2.5 text-left font-medium">Attempts</th>
                  <th className="py-2.5 pr-5 text-right font-medium">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-bg-muted/50">
                    <td className="py-3 pl-5 font-medium text-fg">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-brand-500" />
                        {s.id}
                      </div>
                      <div className="text-[11px] text-fg-subtle">{s.orderId}</div>
                    </td>
                    <td className="py-3 font-mono text-xs text-fg-muted">{s.awb}</td>
                    <td className="py-3 text-sm">{s.courier}</td>
                    <td className="py-3 text-sm">{s.customer}</td>
                    <td className="py-3 text-sm text-fg-muted">{s.destination}</td>
                    <td className="py-3 text-right tabular-nums">{s.weightKg.toFixed(1)} kg</td>
                    <td className="py-3">
                      <Badge tone={statusMeta[s.status].tone} dot>
                        {statusMeta[s.status].label}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-semibold ${
                          s.attempts > 1
                            ? "bg-rose-500/10 text-rose-500"
                            : s.attempts === 1
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {s.attempts}
                      </span>
                    </td>
                    <td className="py-3 pr-5 text-right text-xs text-fg-muted">{timeAgo(s.updatedAt)}</td>
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
