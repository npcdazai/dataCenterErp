"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ordersSeries } from "@/lib/mock-data";

export function OrdersChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={ordersSeries} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="day" stroke="hsl(var(--fg-subtle))" fontSize={10} axisLine={false} tickLine={false} />
          <YAxis stroke="hsl(var(--fg-subtle))" fontSize={10} axisLine={false} tickLine={false} />
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
          <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} name="Orders" />
          <Bar dataKey="refunds" fill="#ef4444" radius={[4, 4, 0, 0]} name="Refunds" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
