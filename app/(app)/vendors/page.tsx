"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
import { CheckOption, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";
import { vendors } from "@/lib/mock-data";
import {
  PRODUCT_SUPPLIER_LABELS,
  ProductSupplierType,
  VENDOR_TYPE_LABELS,
  Vendor,
  VendorStatus,
  VendorType
} from "@/lib/types";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";
import { usePageContext } from "@/lib/chat-context";
import {
  DateRangeFilter,
  DateRangeValue,
  dateRangeIsActive,
  defaultDateRange,
  describeDateRange,
  isInDateRange
} from "@/components/ui/DateRangeFilter";
import { DateRangeDropdown } from "@/components/ui/DateRangeDropdown";

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  pending_kyc: "warning",
  suspended: "danger",
  rejected: "neutral"
};

const ALL_STATUSES: VendorStatus[] = ["active", "pending_kyc", "suspended", "rejected"];
const ALL_TYPES: VendorType[] = [
  "product_supplier",
  "logistics_partner",
  "campaigner",
  "misc_supplier"
];
const ALL_SUPPLIER_TYPES: ProductSupplierType[] = ["dropshipping", "outright"];

interface VendorFilters {
  statuses: VendorStatus[];
  categories: string[];
  types: VendorType[];
  supplierTypes: ProductSupplierType[];
  kycOnly: boolean;
  minRating: number;
  dateRange: DateRangeValue;
}

const defaultVendorFilters: VendorFilters = {
  statuses: [],
  categories: [],
  types: [],
  supplierTypes: [],
  kycOnly: false,
  minRating: 0,
  dateRange: defaultDateRange
};

export default function VendorsPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const [draft, setDraft] = useState<VendorFilters>(defaultVendorFilters);
  const [filters, setFilters] = useState<VendorFilters>(defaultVendorFilters);

  const categoryOptions = useMemo(
    () => Array.from(new Set(vendors.map((v) => v.category))).sort(),
    []
  );

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      if (filters.statuses.length && !filters.statuses.includes(v.status)) return false;
      if (filters.categories.length && !filters.categories.includes(v.category)) return false;
      if (filters.types.length && !filters.types.includes(v.type)) return false;
      if (
        filters.supplierTypes.length &&
        (!v.supplierType || !filters.supplierTypes.includes(v.supplierType))
      )
        return false;
      if (filters.kycOnly && !(v.kyc.gst && v.kyc.pan && v.kyc.bank && v.kyc.docs)) return false;
      if (v.rating < filters.minRating) return false;
      if (!isInDateRange(v.onboarded, filters.dateRange)) return false;
      return true;
    });
  }, [filters]);

  const activeFilterCount =
    filters.statuses.length +
    filters.categories.length +
    filters.types.length +
    filters.supplierTypes.length +
    (filters.kycOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (dateRangeIsActive(filters.dateRange) ? 1 : 0);

  const chatContext = useMemo(() => {
    const totalRevenue = filteredVendors.reduce((s, v) => s + v.revenue, 0);
    const totalOrders = filteredVendors.reduce((s, v) => s + v.ordersFulfilled, 0);
    const byStatus = filteredVendors.reduce<Record<string, number>>((acc, v) => {
      acc[v.status] = (acc[v.status] ?? 0) + 1;
      return acc;
    }, {});
    return {
      kind: "vendors",
      summary: `Vendors page. ${filteredVendors.length} of ${vendors.length} vendors shown. Total revenue ${formatINR(totalRevenue)}. Total orders fulfilled ${formatNumber(totalOrders)}. By status: ${JSON.stringify(byStatus)}.`,
      rows: filteredVendors.slice(0, 50).map((v) => ({
        id: v.id,
        name: v.name,
        category: v.category,
        city: v.city,
        status: v.status,
        type: VENDOR_TYPE_LABELS[v.type],
        supplierType: v.supplierType ? PRODUCT_SUPPLIER_LABELS[v.supplierType] : undefined,
        rating: v.rating,
        revenue: v.revenue,
        products: v.products,
        ordersFulfilled: v.ordersFulfilled,
        returnRate: v.returnRate,
        onboarded: v.onboarded,
        kyc: v.kyc
      }))
    };
  }, [filteredVendors]);
  usePageContext(chatContext);

  function openFilters() {
    setDraft(filters);
    setFilterOpen(true);
  }
  function applyFilters() {
    setFilters(draft);
  }
  function resetFilters() {
    setDraft(defaultVendorFilters);
    setFilters(defaultVendorFilters);
  }
  function toggleStatus(s: VendorStatus) {
    setDraft((d) => ({
      ...d,
      statuses: d.statuses.includes(s) ? d.statuses.filter((x) => x !== s) : [...d.statuses, s]
    }));
  }
  function toggleCategory(c: string) {
    setDraft((d) => ({
      ...d,
      categories: d.categories.includes(c) ? d.categories.filter((x) => x !== c) : [...d.categories, c]
    }));
  }
  function toggleType(t: VendorType) {
    setDraft((d) => ({
      ...d,
      types: d.types.includes(t) ? d.types.filter((x) => x !== t) : [...d.types, t]
    }));
  }
  function toggleSupplierType(t: ProductSupplierType) {
    setDraft((d) => ({
      ...d,
      supplierTypes: d.supplierTypes.includes(t)
        ? d.supplierTypes.filter((x) => x !== t)
        : [...d.supplierTypes, t]
    }));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Vendors"
        description="Onboarding, KYC, payouts and performance — all in one place."
        actions={
          <>
            <DateRangeDropdown
              value={filters.dateRange}
              onChange={(next) => {
                setFilters((f) => ({ ...f, dateRange: next }));
                setDraft((d) => ({ ...d, dateRange: next }));
              }}
            />
            <Button variant="outline" size="sm" onClick={openFilters}>
              <Filter className="h-3.5 w-3.5" /> Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
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
        <CardHeader
          title="All vendors"
          description={`${filteredVendors.length} of ${vendors.length} vendors`}
        />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="whitespace-nowrap py-2.5 pl-5 pr-4 text-left font-medium">Vendor</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-medium">Type</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-medium">Category</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-medium">KYC</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right font-medium">Products</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right font-medium">Orders</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right font-medium">Return %</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right font-medium">Revenue</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-medium">Rating</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-right font-medium">Onboarded</th>
                  <th className="py-2.5 pr-5 text-right font-medium" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredVendors.length === 0 && (
                  <tr>
                    <td colSpan={12} className="py-10 text-center text-sm text-fg-muted">
                      No vendors match the current filters
                    </td>
                  </tr>
                )}
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="group hover:bg-bg-muted/50">
                    <td className="py-3 pl-5 pr-4">
                      <Link href={`/vendors/${v.id}`} className="flex items-center gap-3">
                        <Avatar src={v.logo} alt={v.name} size={32} />
                        <div className="leading-tight">
                          <div className="whitespace-nowrap text-sm font-medium text-fg group-hover:text-brand-600">{v.name}</div>
                          <div className="whitespace-nowrap text-[11px] text-fg-subtle">{v.id} · {v.city}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="whitespace-nowrap text-xs font-medium text-fg">
                          {VENDOR_TYPE_LABELS[v.type]}
                        </span>
                        {v.supplierType && (
                          <span className="whitespace-nowrap text-[10px] text-fg-subtle">
                            {PRODUCT_SUPPLIER_LABELS[v.supplierType]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-fg-muted">{v.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <KycDot ok={v.kyc.gst} label="GST" />
                        <KycDot ok={v.kyc.pan} label="PAN" />
                        <KycDot ok={v.kyc.bank} label="Bank" />
                        <KycDot ok={v.kyc.docs} label="Docs" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{v.products}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatNumber(v.ordersFulfilled)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{v.returnRate.toFixed(1)}%</td>
                    <td className="px-4 py-3 text-right font-semibold tabular-nums">{formatINR(v.revenue, { compact: true })}</td>
                    <td className="px-4 py-3">
                      <div className="inline-flex items-center gap-1 text-sm">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-medium tabular-nums">{v.rating.toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusTone[v.status]} dot className="whitespace-nowrap">
                        {v.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-fg-muted">{timeAgo(v.onboarded)}</td>
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

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={applyFilters}
        onReset={resetFilters}
        activeCount={activeFilterCount}
      >
        <FilterGroup label="Vendor type">
          <div className="grid grid-cols-1 gap-1.5">
            {ALL_TYPES.map((t) => (
              <CheckOption
                key={t}
                checked={draft.types.includes(t)}
                onChange={() => toggleType(t)}
                label={VENDOR_TYPE_LABELS[t]}
                count={vendors.filter((v) => v.type === t).length}
              />
            ))}
          </div>
        </FilterGroup>

        {(draft.types.length === 0 || draft.types.includes("product_supplier")) && (
          <FilterGroup label="Product supplier sub-type">
            <div className="grid grid-cols-1 gap-1.5">
              {ALL_SUPPLIER_TYPES.map((t) => (
                <CheckOption
                  key={t}
                  checked={draft.supplierTypes.includes(t)}
                  onChange={() => toggleSupplierType(t)}
                  label={PRODUCT_SUPPLIER_LABELS[t]}
                  count={vendors.filter((v) => v.supplierType === t).length}
                />
              ))}
            </div>
          </FilterGroup>
        )}

        <FilterGroup label="Status">
          <div className="grid grid-cols-1 gap-1.5">
            {ALL_STATUSES.map((s) => (
              <CheckOption
                key={s}
                checked={draft.statuses.includes(s)}
                onChange={() => toggleStatus(s)}
                label={s.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                count={vendors.filter((v) => v.status === s).length}
                tone={statusTone[s]}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Category" hint={`${categoryOptions.length} options`}>
          <div className="grid max-h-44 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
            {categoryOptions.map((c) => (
              <CheckOption
                key={c}
                checked={draft.categories.includes(c)}
                onChange={() => toggleCategory(c)}
                label={c}
                count={vendors.filter((v) => v.category === c).length}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="KYC">
          <CheckOption
            checked={draft.kycOnly}
            onChange={(v) => setDraft((d) => ({ ...d, kycOnly: v }))}
            label="Only fully-verified vendors"
            tone="success"
          />
        </FilterGroup>

        <FilterGroup label="Minimum rating" hint={`${draft.minRating.toFixed(1)} ★`}>
          <input
            type="range"
            min={0}
            max={5}
            step={0.1}
            value={draft.minRating}
            onChange={(e) =>
              setDraft((d) => ({ ...d, minRating: Number(e.target.value) }))
            }
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-fg-subtle">
            <span>0★</span>
            <span>5★</span>
          </div>
        </FilterGroup>

        <FilterGroup label="Onboarded" hint={describeDateRange(draft.dateRange)}>
          <DateRangeFilter
            value={draft.dateRange}
            onChange={(next) => setDraft((d) => ({ ...d, dateRange: next }))}
            label=""
          />
        </FilterGroup>
      </FilterDrawer>
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
