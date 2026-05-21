"use client";

import dynamic from "next/dynamic";
import {
  MapPin,
  Package,
  Phone,
  Truck,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Shipment, ShipmentStatus } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

// Map component depends on `window` — must render only on the client.
const ShipmentMap = dynamic(
  () => import("./ShipmentMap").then((m) => m.ShipmentMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-xs text-fg-muted">
        Loading map…
      </div>
    )
  }
);

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

const timelineSteps: { key: ShipmentStatus; label: string; description: string }[] = [
  { key: "label_created", label: "Label created", description: "Shipping label generated" },
  { key: "picked_up", label: "Picked up", description: "Collected from origin warehouse" },
  { key: "in_transit", label: "In transit", description: "Moving through carrier network" },
  { key: "out_for_delivery", label: "Out for delivery", description: "On the last-mile vehicle" },
  { key: "delivered", label: "Delivered", description: "Handed over to recipient" }
];

interface Props {
  shipment: Shipment;
  /** When true, hides the header (used inside a Drawer that already has one). */
  compact?: boolean;
}

export function ShipmentTrackingDetail({ shipment, compact }: Props) {
  const status = statusMeta[shipment.status];
  const stepIndex = timelineSteps.findIndex((s) => s.key === shipment.status);
  // For terminal failure states (failed / returned / rto_initiated), highlight up to in_transit
  const reachedThrough =
    stepIndex >= 0 ? stepIndex : timelineSteps.findIndex((s) => s.key === "in_transit");

  return (
    <div className="space-y-5">
      {!compact && (
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-base font-semibold text-fg">{shipment.id}</div>
            <div className="text-xs text-fg-muted">
              {shipment.courier} · {shipment.orderId}
            </div>
          </div>
          <Badge tone={status.tone} dot>{status.label}</Badge>
        </div>
      )}

      {/* Map + meta */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-xl border border-border bg-bg-subtle/40 lg:col-span-2 min-h-[280px]">
          <ShipmentMap
            origin={shipment.origin}
            destination={shipment.destination}
            delivered={shipment.status === "delivered"}
          />
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
              AWB Number
            </div>
            <div className="font-mono text-lg font-semibold text-fg">{shipment.awb}</div>
            <div className="text-xs text-fg-muted">
              {shipment.courier} · {shipment.orderId}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-bg-subtle/40 p-3">
            <div className="flex items-center gap-2 text-xs text-fg-muted">
              <MapPin className="h-3.5 w-3.5" /> Route
            </div>
            <div className="mt-1.5 text-sm">
              <span className="font-medium text-fg">{shipment.origin}</span>
              <span className="mx-2 text-fg-subtle">→</span>
              <span className="font-medium text-fg">{shipment.destination}</span>
            </div>
            <div className="mt-2 text-[11px] text-fg-subtle">
              ETA ·{" "}
              {new Date(shipment.eta).toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Meta label="Weight" value={`${shipment.weightKg.toFixed(1)} kg`} />
            <Meta label="Attempts" value={`${shipment.attempts}`} />
            <Meta label="Courier" value={shipment.courier} />
            <Meta label="Updated" value={timeAgo(shipment.updatedAt)} />
          </div>
        </div>
      </div>

      {/* Recipient */}
      <div className="rounded-xl border border-border bg-bg-subtle/40 p-4">
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Recipient
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Field
            icon={<User className="h-3.5 w-3.5" />}
            label="Customer"
            value={shipment.customer}
          />
          <Field
            icon={<Phone className="h-3.5 w-3.5" />}
            label="Phone"
            value="+91 98•••••00"
          />
          <Field
            icon={<MapPin className="h-3.5 w-3.5" />}
            label="Delivery address"
            value={shipment.destination}
          />
        </div>
      </div>

      {/* Detailed timeline with events */}
      <div>
        <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          Tracking timeline
        </div>
        <ol className="relative space-y-4 border-l border-border pl-5">
          {timelineSteps.map((step, i) => {
            const reached = i <= reachedThrough;
            const current = i === stepIndex;
            const eventTime = new Date(
              new Date(shipment.updatedAt).getTime() -
                (reachedThrough - i) * 6 * 3600_000
            );
            return (
              <li key={step.key} className="relative">
                <span
                  className={`absolute -left-[27px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ring-4 ${
                    reached
                      ? "bg-brand-500 text-white ring-brand-500/25"
                      : "bg-bg-muted text-fg-subtle ring-bg"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${
                        reached ? "text-fg" : "text-fg-muted"
                      }`}
                    >
                      {step.label}
                    </span>
                    {current && (
                      <Badge tone={status.tone} dot>
                        Now
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-fg-muted">{step.description}</div>
                  {reached && (
                    <div className="text-[11px] text-fg-subtle">
                      {eventTime.toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}{" "}
                      · {shipment.courier} hub
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
        <Button variant="outline" size="sm">
          <Phone className="h-3.5 w-3.5" /> Call customer
        </Button>
        <Button variant="outline" size="sm">
          <Package className="h-3.5 w-3.5" /> Reschedule
        </Button>
        <Button size="sm">
          <Truck className="h-3.5 w-3.5" /> Track on courier portal
        </Button>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card/60 px-2.5 py-1.5">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="text-xs font-medium text-fg">{value}</div>
    </div>
  );
}

function Field({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-fg-subtle">
        <span className="text-brand-500">{icon}</span> {label}
      </div>
      <div className="mt-0.5 truncate text-sm font-medium text-fg">{value}</div>
    </div>
  );
}
