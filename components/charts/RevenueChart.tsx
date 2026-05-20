"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { revenueSeries } from "@/lib/mock-data";

export function RevenueChart() {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={revenueSeries} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="g-shopify" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-amazon" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-flipkart" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="g-meta" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            stroke="hsl(var(--fg-subtle))"
            fontSize={11}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            stroke="hsl(var(--fg-subtle))"
            fontSize={11}
            tickFormatter={(v) => `₹${v}K`}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 10,
              fontSize: 12
            }}
            labelStyle={{ color: "hsl(var(--fg))", fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="shopify"
            stroke="#6366f1"
            fill="url(#g-shopify)"
            strokeWidth={2}
            name="Shopify"
          />
          <Area
            type="monotone"
            dataKey="amazon"
            stroke="#f59e0b"
            fill="url(#g-amazon)"
            strokeWidth={2}
            name="Amazon"
          />
          <Area
            type="monotone"
            dataKey="flipkart"
            stroke="#06b6d4"
            fill="url(#g-flipkart)"
            strokeWidth={2}
            name="Flipkart"
          />
          <Area
            type="monotone"
            dataKey="meta"
            stroke="#ef4444"
            fill="url(#g-meta)"
            strokeWidth={2}
            name="Meta Ads"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
