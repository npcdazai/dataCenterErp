import { Package, Plus, Upload } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { products } from "@/lib/mock-data";
import { formatINR, formatNumber } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral" | "brand"> = {
  live: "success",
  draft: "neutral",
  out_of_stock: "danger",
  pending_review: "warning"
};

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Multi-platform catalog & sync across Shopify, Amazon, Flipkart."
        actions={
          <>
            <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5" /> Bulk import</Button>
            <Button size="sm"><Plus className="h-3.5 w-3.5" /> Add product</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Live SKUs" value={formatNumber(3418)} delta={4.6} icon={<Package />} tone="brand" />
        <KpiCard label="Low Stock" value="12" delta={-2.4} tone="warning" />
        <KpiCard label="Out of Stock" value="3" delta={0} tone="danger" />
        <KpiCard label="Avg Conv. Rate" value="3.8%" delta={0.6} tone="success" />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {products.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <div className="flex items-center justify-center bg-gradient-to-br from-brand-500/10 to-cyan-500/10 p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.image}
                alt={p.name}
                className="h-24 w-24 rounded-xl bg-card object-cover ring-1 ring-border"
              />
            </div>
            <CardBody className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-fg">{p.name}</div>
                  <div className="text-[11px] text-fg-subtle">
                    {p.sku} · {p.category}
                  </div>
                </div>
                <Badge tone={statusTone[p.status]} dot>
                  {p.status.replace("_", " ")}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-base font-semibold text-fg">{formatINR(p.price)}</div>
                <div className="text-[11px] text-fg-muted">⭐ {p.rating.toFixed(1)}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <Stat label="Stock" value={p.stock.toString()} />
                <Stat label="Sold" value={formatNumber(p.sold)} />
                <Stat label="Revenue" value={formatINR(p.revenue, { compact: true })} />
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1">
                  {p.platforms.map((pl) => (
                    <PlatformIcon key={pl} platform={pl} />
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-brand-600">
                  Manage →
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-subtle/40 px-2 py-1.5">
      <div className="text-xs font-semibold tabular-nums text-fg">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
    </div>
  );
}
