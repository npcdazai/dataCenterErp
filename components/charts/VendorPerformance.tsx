"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
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
import { Vendor } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const lineColors = ["#6366f1", "#10b981", "#f59e0b", "#06b6d4", "#ef4444"];

/** Horizontal bar leaderboard of top vendors by revenue */
export function VendorLeaderboard({ vendors }: { vendors: Vendor[] }) {
  const data = [...vendors]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)
    .map((v) => ({
      name: v.name,
      revenue: Math.round(v.revenue / 100_000),
      rating: v.rating
    }));

  const max = data[0]?.revenue ?? 1;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
          <XAxis
            type="number"
            stroke="hsl(var(--fg-subtle))"
            fontSize={11}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}L`}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="hsl(var(--fg-muted))"
            fontSize={11}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--bg-muted) / 0.6)" }}
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 10,
              fontSize: 12
            }}
            formatter={(v: number) => [formatINR(v * 100_000, { compact: true }), "Revenue"]}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => {
              const t = i / Math.max(data.length - 1, 1);
              const intensity = 1 - t * 0.55;
              return (
                <Cell
                  key={i}
                  fill={`hsl(244 75% ${50 + (1 - intensity) * 15}%)`}
                  opacity={intensity}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Multi-line weekly revenue trend for top vendors */
export function VendorTrend({ vendors }: { vendors: Vendor[] }) {
  const top = [...vendors].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const weeks = 12;

  // Synthesize a stable per-vendor weekly series from id hash + revenue
  const data = Array.from({ length: weeks }).map((_, w) => {
    const point: Record<string, number | string> = { week: `W${w + 1}` };
    top.forEach((v, idx) => {
      const seed = v.id.charCodeAt(v.id.length - 1) + idx * 7;
      const base = v.revenue / 12 / 100_000; // ₹L per week
      const wave = Math.sin((w + seed) / 1.8) * (base * 0.18);
      const drift = w * (idx === 0 ? 0.6 : idx === 1 ? 0.35 : 0.15);
      point[v.name] = Math.max(1, Math.round(base + wave + drift));
    });
    return point;
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="week" stroke="hsl(var(--fg-subtle))" fontSize={11} axisLine={false} tickLine={false} />
          <YAxis
            stroke="hsl(var(--fg-subtle))"
            fontSize={11}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}L`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 10,
              fontSize: 12
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "hsl(var(--fg-muted))" }}
          />
          {top.map((v, i) => (
            <Line
              key={v.id}
              type="monotone"
              dataKey={v.name}
              stroke={lineColors[i]}
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Radar chart comparing top 3 vendors across 5 metrics (normalised 0–100) */
export function VendorRadar({ vendors }: { vendors: Vendor[] }) {
  const top = [...vendors].sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  const maxRevenue = Math.max(...vendors.map((v) => v.revenue));
  const maxOrders = Math.max(...vendors.map((v) => v.ordersFulfilled));

  // Higher is better — invert return rate.
  const norm = (v: Vendor) => ({
    Revenue: Math.round((v.revenue / maxRevenue) * 100),
    Volume: Math.round((v.ordersFulfilled / maxOrders) * 100),
    Rating: Math.round((v.rating / 5) * 100),
    "On-time": Math.round(80 + ((v.ordersFulfilled / maxOrders) * 20)),
    Quality: Math.round(100 - v.returnRate * 8)
  });

  const metrics = ["Revenue", "Volume", "Rating", "On-time", "Quality"];
  const data = metrics.map((metric) => {
    const row: Record<string, number | string> = { metric };
    top.forEach((v) => {
      row[v.name] = norm(v)[metric as keyof ReturnType<typeof norm>];
    });
    return row;
  });

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "hsl(var(--fg-muted))" }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
            stroke="hsl(var(--border))"
          />
          {top.map((v, i) => (
            <Radar
              key={v.id}
              name={v.name}
              dataKey={v.name}
              stroke={lineColors[i]}
              fill={lineColors[i]}
              fillOpacity={0.18}
              strokeWidth={2}
            />
          ))}
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, color: "hsl(var(--fg-muted))" }}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 10,
              fontSize: 12
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Composite performance score ranking (no recharts — just a styled list) */
export function VendorScoreboard({ vendors }: { vendors: Vendor[] }) {
  const scored = vendors
    .map((v) => {
      const maxRev = Math.max(...vendors.map((x) => x.revenue));
      const maxOrd = Math.max(...vendors.map((x) => x.ordersFulfilled));
      const revenueScore = (v.revenue / maxRev) * 35;
      const volumeScore = (v.ordersFulfilled / maxOrd) * 25;
      const ratingScore = (v.rating / 5) * 20;
      const qualityScore = Math.max(0, (10 - v.returnRate) / 10) * 20;
      const total = Math.round(revenueScore + volumeScore + ratingScore + qualityScore);
      return { ...v, score: total };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return (
    <ul className="space-y-2.5">
      {scored.map((v, i) => (
        <li
          key={v.id}
          className="flex items-center gap-3 rounded-xl border border-border bg-bg-subtle/40 px-3 py-2.5"
        >
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold ${
              i === 0
                ? "bg-amber-400/15 text-amber-500"
                : i === 1
                ? "bg-slate-400/15 text-slate-400"
                : i === 2
                ? "bg-orange-400/15 text-orange-500"
                : "bg-brand-500/10 text-brand-500"
            }`}
          >
            #{i + 1}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-fg">{v.name}</div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500"
                style={{ width: `${v.score}%` }}
              />
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold tabular-nums text-fg">{v.score}</div>
            <div className="text-[10px] uppercase tracking-wider text-fg-subtle">score</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
