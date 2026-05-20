import Link from "next/link";
import { Building2, CheckCircle2, ChevronRight, Filter, Plus, Star, Trophy, XCircle } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Avatar } from "@/components/ui/Avatar";
import {
  VendorLeaderboard,
  VendorRadar,
  VendorScoreboard,
  VendorTrend
} from "@/components/charts/VendorPerformance";
import {
  VendorLeaderboardDetail,
  VendorRadarDetail,
  VendorTrendDetail
} from "@/components/charts/ChartDetails";
import { ChartCard } from "@/components/ui/ChartCard";
import { vendors } from "@/lib/mock-data";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  pending_kyc: "warning",
  suspended: "danger",
  rejected: "neutral"
};

export default function VendorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Onboarding, KYC, payouts and performance — all in one place."
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="h-3.5 w-3.5" /> Filters</Button>
            <Link href="/vendors/new">
              <Button size="sm"><Plus className="h-3.5 w-3.5" /> Onboard vendor</Button>
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Active Vendors" value={formatNumber(184)} delta={3.1} icon={<Building2 />} tone="brand" />
        <KpiCard label="Pending KYC" value="12" delta={-1.2} tone="warning" />
        <KpiCard label="GMV (30d)" value={formatINR(3_82_00_000, { compact: true })} delta={9.4} tone="success" />
        <KpiCard label="Avg SLA" value="96.2%" delta={0.8} tone="info" />
      </div>

      {/* Onboarding pipeline */}
      <Card>
        <CardHeader title="Onboarding pipeline" description="Visual workflow of vendor approvals" />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
            {[
              ["Application", 24, "brand"],
              ["GST verified", 18, "info"],
              ["PAN + Bank", 14, "purple"],
              ["KYC review", 9, "warning"],
              ["Live on platform", 184, "success"]
            ].map(([label, count, tone]) => (
              <div
                key={label as string}
                className="rounded-xl border border-border bg-bg-subtle/40 p-4"
              >
                <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
                  {label}
                </div>
                <div className="mt-2 text-2xl font-semibold text-fg">{count}</div>
                <div className={`mt-2 h-1 w-full rounded-full bg-bg-muted`}>
                  <div className={`h-full rounded-full bg-brand-500`} style={{ width: `${30 + (count as number) * 0.4}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Performance grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          className="xl:col-span-2"
          title="Top performers · Revenue"
          description="Last 30 days · sorted by GMV"
          headerAction={
            <Badge tone="brand" dot>
              <Trophy className="h-3 w-3" /> Leaderboard
            </Badge>
          }
          preview={<VendorLeaderboard vendors={vendors} />}
          detail={<VendorLeaderboardDetail vendors={vendors} />}
          detailDescription="Full ranked list with per-vendor metrics"
          drawerWidth="w-full max-w-4xl"
        />

        <ChartCard
          title="Performance score"
          description="Composite ranking (revenue × volume × quality)"
          preview={<VendorScoreboard vendors={vendors} />}
          detail={<VendorLeaderboardDetail vendors={vendors} />}
          detailDescription="Sorted by composite performance score"
          drawerWidth="w-full max-w-4xl"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Weekly revenue trend"
          description="Top 5 vendors · 12 weeks"
          preview={<VendorTrend vendors={vendors} />}
          detail={<VendorTrendDetail vendors={vendors} />}
          detailDescription="Extended to 24 weeks · trend summary"
          drawerWidth="w-full max-w-4xl"
        />

        <ChartCard
          title="Multi-metric comparison"
          description="Top 3 vendors across 5 dimensions (0–100)"
          preview={<VendorRadar vendors={vendors} />}
          detail={<VendorRadarDetail vendors={vendors} />}
          detailDescription="Detailed metric comparison table"
          drawerWidth="w-full max-w-3xl"
        />
      </div>

      <Card>
        <CardHeader title="All vendors" description={`${vendors.length} vendors`} />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="py-2.5 pl-5 text-left font-medium">Vendor</th>
                  <th className="py-2.5 text-left font-medium">Category</th>
                  <th className="py-2.5 text-left font-medium">KYC</th>
                  <th className="py-2.5 text-right font-medium">Products</th>
                  <th className="py-2.5 text-right font-medium">Orders</th>
                  <th className="py-2.5 text-right font-medium">Return %</th>
                  <th className="py-2.5 text-right font-medium">Revenue</th>
                  <th className="py-2.5 text-left font-medium">Rating</th>
                  <th className="py-2.5 text-left font-medium">Status</th>
                  <th className="py-2.5 text-right font-medium">Onboarded</th>
                  <th className="py-2.5 pr-5 text-right font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {vendors.map((v) => (
                  <tr key={v.id} className="group hover:bg-bg-muted/50">
                    <td className="py-3 pl-5">
                      <Link href={`/vendors/${v.id}`} className="flex items-center gap-3">
                        <Avatar src={v.logo} alt={v.name} size={32} />
                        <div className="leading-tight">
                          <div className="text-sm font-medium text-fg group-hover:text-brand-600">{v.name}</div>
                          <div className="text-[11px] text-fg-subtle">{v.id} · {v.city}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3 text-fg-muted">{v.category}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-1.5">
                        <KycDot ok={v.kyc.gst} label="GST" />
                        <KycDot ok={v.kyc.pan} label="PAN" />
                        <KycDot ok={v.kyc.bank} label="Bank" />
                        <KycDot ok={v.kyc.docs} label="Docs" />
                      </div>
                    </td>
                    <td className="py-3 text-right tabular-nums">{v.products}</td>
                    <td className="py-3 text-right tabular-nums">{formatNumber(v.ordersFulfilled)}</td>
                    <td className="py-3 text-right tabular-nums">{v.returnRate.toFixed(1)}%</td>
                    <td className="py-3 text-right font-semibold tabular-nums">{formatINR(v.revenue, { compact: true })}</td>
                    <td className="py-3">
                      <div className="inline-flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium tabular-nums">{v.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <Badge tone={statusTone[v.status]} dot>
                        {v.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-right text-xs text-fg-muted">{timeAgo(v.onboarded)}</td>
                    <td className="py-3 pr-5 text-right">
                      <Link
                        href={`/vendors/${v.id}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-brand-600 opacity-0 transition group-hover:opacity-100 hover:bg-brand-500/10"
                      >
                        Manage <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
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

function KycDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      title={`${label} ${ok ? "verified" : "missing"}`}
      className={`inline-flex h-5 items-center gap-1 rounded-md px-1.5 text-[10px] font-semibold ${
        ok
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
      }`}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {label}
    </span>
  );
}
