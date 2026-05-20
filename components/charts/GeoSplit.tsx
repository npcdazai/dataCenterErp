"use client";

import { geoSplit } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function GeoSplit() {
  const max = Math.max(...geoSplit.map((g) => g.orders));
  return (
    <ul className="divide-y divide-border">
      {geoSplit.map((g) => (
        <li key={g.state} className="flex items-center gap-4 py-2.5">
          <div className="w-32 shrink-0 text-sm font-medium text-fg">
            {g.state}
          </div>
          <div className="flex-1">
            <div className="h-1.5 overflow-hidden rounded-full bg-bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-cyan-500"
                style={{ width: `${(g.orders / max) * 100}%` }}
              />
            </div>
          </div>
          <div className="w-24 shrink-0 text-right">
            <div className="text-sm font-semibold tabular-nums text-fg">
              {formatNumber(g.orders)}
            </div>
            <div className="text-[10px] text-fg-subtle">₹{g.revenue}Cr</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
