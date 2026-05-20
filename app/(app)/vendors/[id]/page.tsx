import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Edit3,
  Landmark,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Star,
  XCircle
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { vendors, products } from "@/lib/mock-data";
import { formatINR, formatNumber, timeAgo } from "@/lib/utils";

const statusTone: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  active: "success",
  pending_kyc: "warning",
  suspended: "danger",
  rejected: "neutral"
};

export function generateStaticParams() {
  return vendors.map((v) => ({ id: v.id }));
}

export default function VendorDetailPage({
  params
}: {
  params: { id: string };
}) {
  const vendor = vendors.find((v) => v.id === params.id);
  if (!vendor) notFound();

  // Synthesize a recent payout history
  const payouts = Array.from({ length: 6 }).map((_, i) => ({
    week: `Week ${20 - i}`,
    amount: Math.round(vendor.revenue * (0.07 + (i % 3) * 0.02)),
    status: i === 0 ? "scheduled" : i === 1 ? "processing" : "paid",
    at: new Date(Date.now() - i * 7 * 86_400_000).toISOString()
  }));

  // Sample of products from catalog as if owned by this vendor
  const vendorProducts = products.slice(0, 6);

  // Recent vendor activity
  const activity = [
    { title: "Bank verification completed", at: "2h ago", tone: "success" },
    { title: "12 new SKUs submitted for approval", at: "1d ago", tone: "info" },
    { title: "SLA breach on 3 orders to Tier-2 cities", at: "3d ago", tone: "warning" },
    { title: "Commission updated 12% → 14%", at: "5d ago", tone: "neutral" },
    { title: "Onboarded onto platform", at: timeAgo(vendor.onboarded), tone: "brand" }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={vendor.name}
        description={`${vendor.id} · ${vendor.category} · ${vendor.city}`}
        actions={
          <>
            <Link
              href="/vendors"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All vendors
            </Link>
            <Button variant="outline" size="sm">
              <Edit3 className="h-3.5 w-3.5" /> Edit profile
            </Button>
            {vendor.status === "suspended" ? (
              <Button size="sm">
                <CheckCircle2 className="h-3.5 w-3.5" /> Reactivate
              </Button>
            ) : (
              <Button variant="danger" size="sm">
                <Ban className="h-3.5 w-3.5" /> Suspend
              </Button>
            )}
          </>
        }
      />

      {/* Profile header card */}
      <Card>
        <CardBody className="grid grid-cols-1 gap-4 px-5 py-5 lg:grid-cols-[auto_1fr_auto]">
          <Avatar src={vendor.logo} alt={vendor.name} size={64} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight text-fg">
                {vendor.name}
              </h2>
              <Badge tone={statusTone[vendor.status]} dot>
                {vendor.status.replace("_", " ")}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-fg-muted">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {vendor.rating.toFixed(1)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-fg-muted">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3 w-3" /> {vendor.city}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> +91 98xxxxxx00
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> ops@{vendor.name.toLowerCase().replace(/[^a-z]/g, "")}.in
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 className="h-3 w-3" /> GSTIN · 27AABCS1234L1Z2
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <KycPill ok={vendor.kyc.gst} label="GST" />
            <KycPill ok={vendor.kyc.pan} label="PAN" />
            <KycPill ok={vendor.kyc.bank} label="Bank" />
            <KycPill ok={vendor.kyc.docs} label="Docs" />
          </div>
        </CardBody>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Revenue (30d)"
          value={formatINR(vendor.revenue, { compact: true })}
          delta={9.2}
          tone="brand"
        />
        <KpiCard
          label="Orders fulfilled"
          value={formatNumber(vendor.ordersFulfilled)}
          delta={4.4}
          tone="info"
        />
        <KpiCard
          label="Return rate"
          value={`${vendor.returnRate.toFixed(1)}%`}
          delta={-0.6}
          tone="warning"
        />
        <KpiCard
          label="Products live"
          value={formatNumber(vendor.products)}
          delta={2.1}
          icon={<Package />}
          tone="success"
        />
      </div>

      {/* Two-column: details + side */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader title="Business details" description="Legal entity, tax & bank" />
          <CardBody className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <DetailKv k="Legal name" v={`${vendor.name} Pvt Ltd`} />
            <DetailKv k="Category" v={vendor.category} />
            <DetailKv k="GSTIN" v="27AABCS1234L1Z2" mono />
            <DetailKv k="PAN" v="AABCS1234L" mono />
            <DetailKv k="CIN" v="U74999MH2022PTC123456" mono />
            <DetailKv k="Onboarded" v={new Date(vendor.onboarded).toDateString()} />
            <DetailKv k="Bank" v="HDFC Bank · ••••0001" />
            <DetailKv k="IFSC" v="HDFC0001234" mono />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Commission" description="Per-category cut" />
          <CardBody className="space-y-3">
            <div className="rounded-xl border border-border bg-bg-subtle/40 p-3">
              <div className="text-[11px] uppercase tracking-wider text-fg-subtle">Default rate</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-fg">14%</span>
                <span className="text-xs text-fg-muted">on net GMV</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Pill label="Apparel" value="14%" />
              <Pill label="Bulk" value="11%" />
              <Pill label="Closeout" value="8%" />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <Edit3 className="h-3.5 w-3.5" /> Update commission
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Payouts + Activity */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader
            title="Payout history"
            description="Last 6 weekly settlements"
            action={
              <Button variant="outline" size="sm">
                <CreditCard className="h-3.5 w-3.5" /> Process payout
              </Button>
            }
          />
          <CardBody className="px-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                    <th className="py-2.5 pl-5 text-left font-medium">Week</th>
                    <th className="py-2.5 text-left font-medium">Reference</th>
                    <th className="py-2.5 text-right font-medium">Amount</th>
                    <th className="py-2.5 text-left font-medium">Status</th>
                    <th className="py-2.5 pr-5 text-right font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payouts.map((p) => (
                    <tr key={p.week} className="hover:bg-bg-muted/50">
                      <td className="py-3 pl-5 font-medium text-fg">{p.week}</td>
                      <td className="py-3 font-mono text-xs text-fg-muted">
                        PYT-{vendor.id.replace("VEN-", "")}-{p.week.replace(/\D/g, "")}
                      </td>
                      <td className="py-3 text-right font-semibold tabular-nums">
                        {formatINR(p.amount, { compact: true })}
                      </td>
                      <td className="py-3">
                        <Badge
                          tone={
                            p.status === "paid"
                              ? "success"
                              : p.status === "processing"
                              ? "info"
                              : "warning"
                          }
                          dot
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="py-3 pr-5 text-right text-xs text-fg-muted">
                        {new Date(p.at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short"
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Activity" description="Recent events" />
          <CardBody>
            <ol className="space-y-3">
              {activity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <div className="relative mt-1">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        a.tone === "success"
                          ? "bg-emerald-500 ring-emerald-500/20"
                          : a.tone === "warning"
                          ? "bg-amber-500 ring-amber-500/20"
                          : a.tone === "info"
                          ? "bg-cyan-500 ring-cyan-500/20"
                          : a.tone === "brand"
                          ? "bg-brand-500 ring-brand-500/20"
                          : "bg-fg-subtle ring-bg-muted"
                      } ring-4`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium leading-tight text-fg">{a.title}</div>
                    <div className="mt-0.5 text-[11px] text-fg-subtle">{a.at}</div>
                  </div>
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      {/* Products */}
      <Card>
        <CardHeader
          title="Catalog"
          description={`${vendor.products} live products · top 6 shown`}
          action={
            <Button variant="outline" size="sm">
              View all products
            </Button>
          }
        />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {vendorProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-bg-subtle/40 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-12 w-12 rounded-lg bg-card object-cover ring-1 ring-border"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-fg">{p.name}</div>
                  <div className="text-[11px] text-fg-subtle">
                    {p.sku} · {formatINR(p.price)}
                  </div>
                </div>
                <Badge tone={p.status === "live" ? "success" : "warning"} dot>
                  {p.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function KycPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold ${
        ok
          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
          : "bg-rose-500/10 text-rose-600 dark:text-rose-300"
      }`}
    >
      {ok ? <Check className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
      {label}
    </span>
  );
}

function DetailKv({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-bg-subtle/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{k}</div>
      <div className={`mt-0.5 text-sm text-fg ${mono ? "font-mono" : "font-medium"}`}>{v}</div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-subtle/40 px-2 py-1.5">
      <div className="text-xs font-semibold tabular-nums text-fg">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
    </div>
  );
}
