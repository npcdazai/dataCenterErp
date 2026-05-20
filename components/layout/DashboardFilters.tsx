"use client";

import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CheckOption, FilterDrawer, FilterGroup } from "@/components/ui/FilterDrawer";

export const RANGES = [
  "Today",
  "Last 7 days",
  "Last 30 days",
  "Last 90 days",
  "Year to date"
] as const;

export const CHANNEL_OPTIONS = [
  "Shopify",
  "Amazon",
  "Flipkart",
  "Meta Ads",
  "Instagram",
  "Facebook"
] as const;

export const REGION_OPTIONS = [
  "Maharashtra",
  "Karnataka",
  "Delhi",
  "Tamil Nadu",
  "Gujarat",
  "Telangana",
  "West Bengal",
  "Rajasthan"
] as const;

export type Range = (typeof RANGES)[number];

export interface DashboardFilterState {
  range: Range;
  channels: string[];
  regions: string[];
  minRevenue: number;
}

export const dashboardFilterDefaults: DashboardFilterState = {
  range: "Last 30 days",
  channels: [],
  regions: [],
  minRevenue: 0
};

export function countActive(f: DashboardFilterState) {
  return (
    (f.range !== dashboardFilterDefaults.range ? 1 : 0) +
    f.channels.length +
    f.regions.length +
    (f.minRevenue > 0 ? 1 : 0)
  );
}

interface Props {
  applied: DashboardFilterState;
  onApply: (f: DashboardFilterState) => void;
  onReset: () => void;
}

export function DashboardFilters({ applied, onApply, onReset }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DashboardFilterState>(applied);

  const activeCount = countActive(applied);

  function openFilters() {
    setDraft(applied);
    setOpen(true);
  }
  function toggle<K extends "channels" | "regions">(key: K, value: string) {
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(value)
        ? d[key].filter((x) => x !== value)
        : [...d[key], value]
    }));
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={openFilters}>
        <Filter className="h-3.5 w-3.5" /> Filters
        {activeCount > 0 && (
          <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </Button>

      <FilterDrawer
        open={open}
        onClose={() => setOpen(false)}
        onApply={() => onApply(draft)}
        onReset={() => {
          setDraft(dashboardFilterDefaults);
          onReset();
        }}
        activeCount={activeCount}
      >
        <FilterGroup label="Date range">
          <div className="grid grid-cols-1 gap-1.5">
            {RANGES.map((r) => (
              <label
                key={r}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-bg-subtle/40 px-3 py-2 hover:border-brand-500/40"
              >
                <input
                  type="radio"
                  name="range"
                  checked={draft.range === r}
                  onChange={() => setDraft((d) => ({ ...d, range: r }))}
                  className="h-4 w-4 accent-brand-500"
                />
                <span className="text-sm text-fg">{r}</span>
              </label>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Channels">
          <div className="grid grid-cols-1 gap-1.5">
            {CHANNEL_OPTIONS.map((c) => (
              <CheckOption
                key={c}
                checked={draft.channels.includes(c)}
                onChange={() => toggle("channels", c)}
                label={c}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Regions" hint={`${REGION_OPTIONS.length} options`}>
          <div className="grid max-h-44 grid-cols-1 gap-1.5 overflow-y-auto pr-1">
            {REGION_OPTIONS.map((r) => (
              <CheckOption
                key={r}
                checked={draft.regions.includes(r)}
                onChange={() => toggle("regions", r)}
                label={r}
              />
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Minimum revenue" hint={`₹${draft.minRevenue.toLocaleString("en-IN")}`}>
          <input
            type="range"
            min={0}
            max={10_00_000}
            step={25_000}
            value={draft.minRevenue}
            onChange={(e) =>
              setDraft((d) => ({ ...d, minRevenue: Number(e.target.value) }))
            }
            className="w-full accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-fg-subtle">
            <span>₹0</span>
            <span>₹10L</span>
          </div>
        </FilterGroup>
      </FilterDrawer>
    </>
  );
}
