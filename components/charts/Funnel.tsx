"use client";

import { funnelData } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

export function Funnel() {
  const max = funnelData[0].value;
  return (
    <div className="space-y-3">
      {funnelData.map((step, i) => {
        const pct = (step.value / max) * 100;
        const conv = i === 0 ? 100 : (step.value / funnelData[i - 1].value) * 100;
        return (
          <div key={step.stage}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-fg">{step.stage}</span>
              <span className="tabular-nums text-fg-muted">
                {formatNumber(step.value, { compact: true })} · {conv.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1.5 h-7 overflow-hidden rounded-md bg-bg-muted">
              <div
                className="flex h-full items-center justify-end bg-gradient-to-r from-brand-500/80 via-brand-500 to-violet-500 pr-2 text-[10px] font-semibold text-white"
                style={{ width: `${pct}%` }}
              >
                {pct.toFixed(1)}%
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
