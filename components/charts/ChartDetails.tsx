"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  channelMix,
  funnelData,
  geoSplit,
  ordersSeries,
  revenueSeries
} from "@/lib/mock-data";
import { Vendor } from "@/lib/types";
import { formatINR, formatNumber } from "@/lib/utils";

/* =========================================================
 * Revenue across channels
 * ========================================================= */
export function RevenueDetail() {
  const totals = revenueSeries.map((r) => ({
    ...r,
    total: r.shopify + r.amazon + r.flipkart + r.meta
  }));
  const yoy = totals[totals.length - 1].total / totals[0].total - 1;
  const grandTotal = totals.reduce((s, r) => s + r.total, 0) * 1000;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="GMV (12 mo)" value={formatINR(grandTotal, { compact: true })} delta={+22.4} />
        <MiniStat label="Best month" value={`Dec · ${formatINR(totals[totals.length - 1].total * 1000, { compact: true })}`} />
        <MiniStat label="YoY growth" value={`${(yoy * 100).toFixed(1)}%`} delta={yoy * 100} />
        <MiniStat label="Top channel" value="Shopify · 38%" />
      </div>

      <div className="h-[320px] rounded-xl border border-border bg-bg-subtle/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={totals} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="d-shopify" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="d-amazon" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="d-flipkart" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="d-meta" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="month" stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}K`} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "hsl(var(--fg-muted))" }} />
            <Area type="monotone" dataKey="shopify" name="Shopify" stroke="#6366f1" fill="url(#d-shopify)" strokeWidth={2} />
            <Area type="monotone" dataKey="amazon" name="Amazon" stroke="#f59e0b" fill="url(#d-amazon)" strokeWidth={2} />
            <Area type="monotone" dataKey="flipkart" name="Flipkart" stroke="#06b6d4" fill="url(#d-flipkart)" strokeWidth={2} />
            <Area type="monotone" dataKey="meta" name="Meta" stroke="#ef4444" fill="url(#d-meta)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <DetailTable
        title="Monthly breakdown"
        head={["Month", "Shopify", "Amazon", "Flipkart", "Meta Ads", "Total", "vs prev"]}
        rows={totals.map((r, i) => {
          const prev = i > 0 ? totals[i - 1].total : r.total;
          const change = ((r.total - prev) / Math.max(prev, 1)) * 100;
          return [
            r.month,
            formatINR(r.shopify * 1000, { compact: true }),
            formatINR(r.amazon * 1000, { compact: true }),
            formatINR(r.flipkart * 1000, { compact: true }),
            formatINR(r.meta * 1000, { compact: true }),
            <strong key={r.month} className="text-fg">
              {formatINR(r.total * 1000, { compact: true })}
            </strong>,
            <span key={`d-${r.month}`} className={change >= 0 ? "text-emerald-500" : "text-rose-500"}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
          ];
        })}
      />
    </div>
  );
}

/* =========================================================
 * Channel mix
 * ========================================================= */
export function ChannelMixDetail() {
  const stats = channelMix.map((c, i) => ({
    ...c,
    revenue: Math.round((c.value / 100) * 4_82_75_000),
    orders: Math.round((c.value / 100) * 38412 * 0.6),
    aov: Math.round(800 + ((i * 311) % 1800)),
    conv: (1.2 + ((i * 7) % 4)).toFixed(2)
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[260px] rounded-xl border border-border bg-bg-subtle/40 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={channelMix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2} stroke="hsl(var(--card))">
                {channelMix.map((e) => (
                  <Cell key={e.name} fill={e.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[260px] rounded-xl border border-border bg-bg-subtle/40 p-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} />
              <YAxis stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v / 100_000}L`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => formatINR(v)} />
              <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                {stats.map((s) => (
                  <Cell key={s.name} fill={s.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <DetailTable
        head={["Channel", "Share", "Revenue", "Orders", "AOV", "Conv. rate"]}
        rows={stats.map((s) => [
          <span key={s.name} className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
            <span className="font-medium text-fg">{s.name}</span>
          </span>,
          `${s.value}%`,
          formatINR(s.revenue, { compact: true }),
          formatNumber(s.orders),
          formatINR(s.aov),
          `${s.conv}%`
        ])}
      />
    </div>
  );
}

/* =========================================================
 * Orders / refunds
 * ========================================================= */
export function OrdersDetail() {
  const total = ordersSeries.reduce((s, r) => s + r.orders, 0);
  const refunds = ordersSeries.reduce((s, r) => s + r.refunds, 0);
  const refundPct = (refunds / total) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Orders (30d)" value={formatNumber(total)} delta={6.8} />
        <MiniStat label="Refunds" value={formatNumber(refunds)} delta={-1.4} />
        <MiniStat label="Refund rate" value={`${refundPct.toFixed(1)}%`} delta={-0.3} />
        <MiniStat label="Peak day" value={`Day ${ordersSeries.indexOf(ordersSeries.reduce((a, b) => (a.orders > b.orders ? a : b))) + 1}`} />
      </div>

      <div className="h-[300px] rounded-xl border border-border bg-bg-subtle/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ordersSeries} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="day" stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "hsl(var(--fg-muted))" }} />
            <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="refunds" name="Refunds" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <DetailTable
        head={["Day", "Orders", "Refunds", "Refund %"]}
        rows={ordersSeries.map((r) => [
          `Day ${r.day}`,
          formatNumber(r.orders),
          formatNumber(r.refunds),
          `${((r.refunds / Math.max(r.orders, 1)) * 100).toFixed(1)}%`
        ])}
      />
    </div>
  );
}

/* =========================================================
 * Funnel
 * ========================================================= */
export function FunnelDetail() {
  const data = funnelData.map((d, i) => {
    const prev = i > 0 ? funnelData[i - 1].value : d.value;
    const drop = prev - d.value;
    const dropPct = (drop / Math.max(prev, 1)) * 100;
    const convPct = (d.value / funnelData[0].value) * 100;
    return { ...d, drop, dropPct, convPct };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Top of funnel" value={formatNumber(funnelData[0].value, { compact: true })} />
        <MiniStat label="Purchases" value={formatNumber(funnelData[funnelData.length - 1].value, { compact: true })} />
        <MiniStat label="Overall conv." value={`${((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(2)}%`} delta={0.4} />
        <MiniStat label="Biggest drop" value={data.slice(1).reduce((a, b) => (a.drop > b.drop ? a : b)).stage} />
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-bg-subtle/40 p-4">
        {data.map((d, i) => (
          <div key={d.stage}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-fg">{d.stage}</span>
              <span className="tabular-nums text-fg-muted">
                {formatNumber(d.value, { compact: true })} · {d.convPct.toFixed(2)}%
              </span>
            </div>
            <div className="mt-1.5 h-8 overflow-hidden rounded-md bg-bg-muted">
              <div
                className="flex h-full items-center justify-end bg-gradient-to-r from-brand-500/80 via-brand-500 to-violet-500 pr-2 text-[10px] font-semibold text-white"
                style={{ width: `${d.convPct}%` }}
              >
                {d.convPct.toFixed(1)}%
              </div>
            </div>
            {i > 0 && (
              <div className="mt-1 text-[10px] text-rose-500">
                Dropped {formatNumber(d.drop, { compact: true })} ({d.dropPct.toFixed(1)}%) from {data[i - 1].stage}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
 * Geo
 * ========================================================= */
export function GeoDetail() {
  const total = geoSplit.reduce((s, g) => s + g.orders, 0);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="States covered" value={`${geoSplit.length}`} />
        <MiniStat label="Total orders" value={formatNumber(total)} />
        <MiniStat label="Top state" value={geoSplit[0].state} />
        <MiniStat label="Top revenue" value={`₹${geoSplit[0].revenue}Cr`} />
      </div>

      <DetailTable
        head={["State", "Orders", "Share %", "Revenue (₹Cr)", "Avg order ₹"]}
        rows={geoSplit.map((g) => [
          <span key={g.state} className="font-medium text-fg">{g.state}</span>,
          formatNumber(g.orders),
          `${((g.orders / total) * 100).toFixed(1)}%`,
          `₹${g.revenue}`,
          formatINR(Math.round((g.revenue * 1_00_00_000) / g.orders))
        ])}
      />
    </div>
  );
}

/* =========================================================
 * Vendor leaderboard
 * ========================================================= */
export function VendorLeaderboardDetail({ vendors }: { vendors: Vendor[] }) {
  const ranked = [...vendors].sort((a, b) => b.revenue - a.revenue);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <MiniStat label="Vendors" value={`${vendors.length}`} />
        <MiniStat label="Total GMV" value={formatINR(ranked.reduce((s, v) => s + v.revenue, 0), { compact: true })} />
        <MiniStat label="Best vendor" value={ranked[0].name} />
        <MiniStat label="Avg rating" value={(vendors.reduce((s, v) => s + v.rating, 0) / vendors.length).toFixed(2)} />
      </div>

      <DetailTable
        head={["#", "Vendor", "Category", "Revenue", "Orders", "Return %", "Rating"]}
        rows={ranked.map((v, i) => [
          <span key={v.id} className="font-mono text-fg-subtle">#{i + 1}</span>,
          <span key={`n-${v.id}`} className="font-medium text-fg">{v.name}</span>,
          v.category,
          <strong key={`r-${v.id}`} className="text-fg">{formatINR(v.revenue, { compact: true })}</strong>,
          formatNumber(v.ordersFulfilled),
          `${v.returnRate.toFixed(1)}%`,
          v.rating.toFixed(1)
        ])}
      />
    </div>
  );
}

/* =========================================================
 * Vendor trend
 * ========================================================= */
export function VendorTrendDetail({ vendors }: { vendors: Vendor[] }) {
  const top = [...vendors].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const weeks = 24;
  const data = Array.from({ length: weeks }).map((_, w) => {
    const point: Record<string, number | string> = { week: `W${w + 1}` };
    top.forEach((v, idx) => {
      const seed = v.id.charCodeAt(v.id.length - 1) + idx * 7;
      const base = v.revenue / 24 / 100_000;
      const wave = Math.sin((w + seed) / 1.8) * (base * 0.18);
      const drift = w * (idx === 0 ? 0.4 : idx === 1 ? 0.25 : 0.1);
      point[v.name] = Math.max(1, Math.round(base + wave + drift));
    });
    return point;
  });
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#06b6d4", "#ef4444"];

  return (
    <div className="space-y-6">
      <div className="h-[340px] rounded-xl border border-border bg-bg-subtle/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="week" stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} />
            <YAxis stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}L`} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "hsl(var(--fg-muted))" }} />
            {top.map((v, i) => (
              <Line key={v.id} type="monotone" dataKey={v.name} stroke={colors[i]} strokeWidth={2.2} dot={false} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <DetailTable
        head={["Vendor", "Latest week", "Avg weekly", "Trend"]}
        rows={top.map((v) => {
          const series = data.map((d) => d[v.name] as number);
          const latest = series[series.length - 1];
          const first = series[0];
          const avg = Math.round(series.reduce((s, x) => s + x, 0) / series.length);
          const delta = ((latest - first) / Math.max(first, 1)) * 100;
          return [
            <span key={v.id} className="font-medium text-fg">{v.name}</span>,
            `₹${latest}L`,
            `₹${avg}L`,
            <span key={`d-${v.id}`} className={delta >= 0 ? "text-emerald-500" : "text-rose-500"}>
              {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
            </span>
          ];
        })}
      />
    </div>
  );
}

/* =========================================================
 * Vendor radar
 * ========================================================= */
export function VendorRadarDetail({ vendors }: { vendors: Vendor[] }) {
  const top = [...vendors].sort((a, b) => b.revenue - a.revenue).slice(0, 3);
  const maxRevenue = Math.max(...vendors.map((v) => v.revenue));
  const maxOrders = Math.max(...vendors.map((v) => v.ordersFulfilled));
  const norm = (v: Vendor) => ({
    Revenue: Math.round((v.revenue / maxRevenue) * 100),
    Volume: Math.round((v.ordersFulfilled / maxOrders) * 100),
    Rating: Math.round((v.rating / 5) * 100),
    "On-time": Math.round(80 + ((v.ordersFulfilled / maxOrders) * 20)),
    Quality: Math.round(100 - v.returnRate * 8)
  });
  const metrics = ["Revenue", "Volume", "Rating", "On-time", "Quality"];
  const data = metrics.map((m) => {
    const row: Record<string, number | string> = { metric: m };
    top.forEach((v) => {
      row[v.name] = norm(v)[m as keyof ReturnType<typeof norm>];
    });
    return row;
  });
  const colors = ["#6366f1", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-6">
      <div className="h-[340px] rounded-xl border border-border bg-bg-subtle/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--fg-muted))" }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} stroke="hsl(var(--border))" />
            {top.map((v, i) => (
              <Radar key={v.id} name={v.name} dataKey={v.name} stroke={colors[i]} fill={colors[i]} fillOpacity={0.2} strokeWidth={2} />
            ))}
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: "hsl(var(--fg-muted))" }} />
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <DetailTable
        head={["Metric", ...top.map((v) => v.name)]}
        rows={data.map((row) => [
          <span key={String(row.metric)} className="font-medium text-fg">{row.metric}</span>,
          ...top.map((v) => `${row[v.name]}/100`)
        ])}
      />
    </div>
  );
}

/* =========================================================
 * Helpers
 * ========================================================= */
function MiniStat({
  label,
  value,
  delta
}: {
  label: string;
  value: string;
  delta?: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-subtle/40 px-3 py-3">
      <div className="text-[10px] uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-base font-semibold text-fg">{value}</div>
        {typeof delta === "number" && (
          <span
            className={`text-[10px] font-medium ${
              delta >= 0 ? "text-emerald-500" : "text-rose-500"
            }`}
          >
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

function DetailTable({
  title,
  head,
  rows
}: {
  title?: string;
  head: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      {title && (
        <div className="border-b border-border bg-bg-subtle/60 px-4 py-2 text-xs font-semibold text-fg">
          {title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
              {head.map((h) => (
                <th key={h} className="px-4 py-2 text-left font-medium first:pl-5 last:pr-5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-bg-muted/40">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2 text-fg-muted first:pl-5 last:pr-5">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
