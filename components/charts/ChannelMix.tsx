"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { channelMix as defaultMix } from "@/lib/mock-data";

interface ChannelMixDatum {
  name: string;
  value: number;
  color: string;
}

export function ChannelMix({ data }: { data?: ChannelMixDatum[] } = {}) {
  const channelMix = data && data.length > 0 ? data : defaultMix;
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={channelMix}
              dataKey="value"
              nameKey="name"
              innerRadius={56}
              outerRadius={84}
              strokeWidth={2}
              stroke="hsl(var(--card))"
              paddingAngle={2}
            >
              {channelMix.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: 10,
                fontSize: 12
              }}
              formatter={(v) => `${v}%`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
            Channels
          </div>
          <div className="text-xl font-semibold text-fg">{channelMix.length}</div>
        </div>
      </div>

      <ul className="space-y-2">
        {channelMix.map((c) => (
          <li
            key={c.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="inline-flex items-center gap-2 text-fg-muted">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: c.color }}
              />
              {c.name}
            </span>
            <span className="tabular-nums font-medium text-fg">{c.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
