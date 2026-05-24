import { Boxes, Filter, RefreshCw, Upload } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { products } from "@/lib/mock-data";
import { formatINR, formatNumber } from "@/lib/utils";
import { HeaderDateRange } from "@/components/ui/HeaderDateRange";

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Live stock across warehouses, with smart restock signals."
        actions={
          <>
            <HeaderDateRange />
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Warehouses</Button>
            <Button variant="outline" size="sm"><Upload className="h-3.5 w-3.5" /> Import stock</Button>
            <Button size="sm"><RefreshCw className="h-3.5 w-3.5" /> Sync now</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total SKUs" value={formatNumber(3418)} icon={<Boxes />} delta={4.6} tone="brand" />
        <KpiCard label="Avg Stock Days" value="42" delta={-3.1} tone="info" />
        <KpiCard label="Aging > 90d" value="186" delta={2.8} tone="warning" />
        <KpiCard label="Inventory Value" value={formatINR(2_18_00_000, { compact: true })} delta={6.4} tone="success" />
      </div>

      <Card>
        <CardHeader title="Stock by SKU" description="Live levels across all warehouses" />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="py-2.5 pl-5 text-left font-medium">Product</th>
                  <th className="py-2.5 text-left font-medium">SKU</th>
                  <th className="py-2.5 text-right font-medium">Stock</th>
                  <th className="py-2.5 text-right font-medium">Sold (30d)</th>
                  <th className="py-2.5 text-right font-medium">Days left</th>
                  <th className="py-2.5 pr-5 text-left font-medium">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => {
                  const daysLeft = p.sold > 0 ? Math.round((p.stock / (p.sold / 30)) || 0) : 0;
                  const tone = p.stock === 0 ? "danger" : daysLeft < 7 ? "warning" : "success";
                  return (
                    <tr key={p.id} className="hover:bg-bg-muted/50">
                      <td className="py-3 pl-5 font-medium text-fg">{p.name}</td>
                      <td className="py-3 font-mono text-xs text-fg-muted">{p.sku}</td>
                      <td className="py-3 text-right tabular-nums">{p.stock}</td>
                      <td className="py-3 text-right tabular-nums">{formatNumber(p.sold)}</td>
                      <td className="py-3 text-right tabular-nums">{daysLeft}d</td>
                      <td className="py-3 pr-5">
                        <Badge tone={tone as never} dot>
                          {p.stock === 0 ? "Out of stock" : daysLeft < 7 ? "Reorder soon" : "Healthy"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
