import { Megaphone, MousePointerClick, Target, Zap } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { PlatformIcon } from "@/components/ui/PlatformIcon";
import { Funnel } from "@/components/charts/Funnel";
import { FunnelDetail } from "@/components/charts/ChartDetails";
import { ChartCard } from "@/components/ui/ChartCard";
import { campaigns } from "@/lib/mock-data";
import { formatINR, formatNumber } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "neutral"> = {
  active: "success",
  paused: "warning",
  ended: "neutral"
};

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Marketing"
        description="Meta Ads, Facebook, Instagram, Google — unified insights & ROAS."
        actions={
          <>
            <Button variant="outline" size="sm">Audience Builder</Button>
            <Button size="sm"><Zap className="h-3.5 w-3.5" /> Launch campaign</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Spend (30d)" value={formatINR(8_40_000, { compact: true })} delta={5.4} icon={<Megaphone />} tone="brand" />
        <KpiCard label="Revenue (30d)" value={formatINR(38_60_000, { compact: true })} delta={11.2} tone="success" />
        <KpiCard label="ROAS" value="4.6×" delta={0.4} icon={<Target />} tone="info" />
        <KpiCard label="CAC" value={formatINR(312)} delta={-3.1} icon={<MousePointerClick />} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Active campaigns" description="Performance, last 30 days" />
          <CardBody className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                    <th className="py-2.5 pl-5 text-left font-medium">Campaign</th>
                    <th className="py-2.5 text-left font-medium">Platform</th>
                    <th className="py-2.5 text-right font-medium">Spend</th>
                    <th className="py-2.5 text-right font-medium">Impr.</th>
                    <th className="py-2.5 text-right font-medium">Clicks</th>
                    <th className="py-2.5 text-right font-medium">Conv.</th>
                    <th className="py-2.5 text-right font-medium">ROAS</th>
                    <th className="py-2.5 pr-5 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {campaigns.map((c) => {
                    const roas = c.revenue / Math.max(c.spend, 1);
                    return (
                      <tr key={c.id} className="hover:bg-bg-muted/50">
                        <td className="py-3 pl-5">
                          <div className="font-medium text-fg">{c.name}</div>
                          <div className="text-[11px] text-fg-subtle">{c.id}</div>
                        </td>
                        <td className="py-3">
                          <PlatformIcon platform={c.platform as never} showLabel />
                        </td>
                        <td className="py-3 text-right tabular-nums">{formatINR(c.spend, { compact: true })}</td>
                        <td className="py-3 text-right tabular-nums">{formatNumber(c.impressions, { compact: true })}</td>
                        <td className="py-3 text-right tabular-nums">{formatNumber(c.clicks, { compact: true })}</td>
                        <td className="py-3 text-right tabular-nums">{formatNumber(c.conversions)}</td>
                        <td className="py-3 text-right">
                          <span
                            className={`tabular-nums font-semibold ${
                              roas >= 4
                                ? "text-emerald-500"
                                : roas >= 2
                                ? "text-amber-500"
                                : "text-rose-500"
                            }`}
                          >
                            {roas.toFixed(2)}×
                          </span>
                        </td>
                        <td className="py-3 pr-5">
                          <Badge tone={statusTone[c.status]} dot>
                            {c.status}
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

        <ChartCard
          title="Marketing funnel"
          description="Impressions → Purchase"
          preview={<Funnel />}
          detail={<FunnelDetail />}
          detailDescription="Stage-by-stage drop-off across paid funnel"
        />
      </div>
    </div>
  );
}
