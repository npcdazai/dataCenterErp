"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  Truck
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Drawer } from "@/components/ui/Drawer";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { ShipmentTrackingDetail } from "@/components/shipments/ShipmentTrackingDetail";
import { shipments } from "@/lib/mock-data";
import { formatNumber, timeAgo } from "@/lib/utils";
import { Shipment, ShipmentStatus } from "@/lib/types";
import { usePageContext } from "@/lib/chat-context";
import { useMemo } from "react";
import { DateRangeDropdown } from "@/components/ui/DateRangeDropdown";
import {
  DateRangeValue,
  defaultDateRange,
  isInDateRange
} from "@/components/ui/DateRangeFilter";

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

export default function ShipmentsPage() {
  const [selected, setSelected] = useState<Shipment | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValue>(defaultDateRange);
  const featured = shipments[2];

  const visibleShipments = useMemo(
    () => shipments.filter((s) => isInDateRange(s.updatedAt, dateRange)),
    [dateRange]
  );

  const chatContext = useMemo(() => {
    const byStatus = visibleShipments.reduce<Record<string, number>>((acc, s) => {
      acc[s.status] = (acc[s.status] ?? 0) + 1;
      return acc;
    }, {});
    const byCourier = visibleShipments.reduce<Record<string, number>>((acc, s) => {
      acc[s.courier] = (acc[s.courier] ?? 0) + 1;
      return acc;
    }, {});
    return {
      kind: "shipments",
      summary: `Shipments page. ${visibleShipments.length} shipments visible. By status: ${JSON.stringify(byStatus)}. By courier: ${JSON.stringify(byCourier)}.`,
      rows: visibleShipments.map((s) => ({
        id: s.id,
        orderId: s.orderId,
        awb: s.awb,
        courier: s.courier,
        customer: s.customer,
        origin: s.origin,
        destination: s.destination,
        status: s.status,
        eta: s.eta,
        attempts: s.attempts,
        weightKg: s.weightKg
      }))
    };
  }, [visibleShipments]);
  usePageContext(chatContext);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shipments & Logistics"
        description="Real-time tracking via Delhivery + multi-courier API."
        actions={
          <>
            <DateRangeDropdown value={dateRange} onChange={setDateRange} />
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
        <CardBody>
          <ShipmentTrackingDetail shipment={featured} compact />
        </CardBody>
      </Card>

      {/* Shipments table */}
      <Card>
        <CardHeader
          title="All shipments"
          description="Click any row to view live tracking detail"
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
                {visibleShipments.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-sm text-fg-muted">
                      No shipments updated in the selected range
                    </td>
                  </tr>
                )}
                {visibleShipments.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className="group cursor-pointer transition hover:bg-bg-muted/50"
                  >
                    <td className="py-3 pl-5 font-medium text-fg">
                      <div className="flex items-center gap-2">
                        <Package className="h-3.5 w-3.5 text-brand-500" />
                        <span className="group-hover:text-brand-600">{s.id}</span>
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
                    <td className="py-3 pr-5 text-right">
                      <div className="flex items-center justify-end gap-2 text-xs text-fg-muted">
                        {timeAgo(s.updatedAt)}
                        <ExternalLink className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>

      {/* Drill-down drawer */}
      <Drawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        widthClassName="w-full max-w-4xl"
        title={
          selected ? (
            <span className="inline-flex items-center gap-2">
              <Package className="h-4 w-4 text-brand-500" />
              {selected.id}
              <Badge tone={statusMeta[selected.status].tone} dot>
                {statusMeta[selected.status].label}
              </Badge>
            </span>
          ) : (
            "Shipment details"
          )
        }
        description={
          selected
            ? `${selected.courier} · AWB ${selected.awb} · ${selected.orderId}`
            : undefined
        }
      >
        {selected && <ShipmentTrackingDetail shipment={selected} compact />}
      </Drawer>
    </div>
  );
}
