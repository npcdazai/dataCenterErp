"use client";

import { useState } from "react";
import { DateRangeDropdown } from "./DateRangeDropdown";
import { DateRangeValue, defaultDateRange } from "./DateRangeFilter";

/**
 * Self-contained client-side date range control for server-rendered pages.
 * State lives locally — pages that don't actually filter data still get
 * a visible, working dropdown.
 */
export function HeaderDateRange() {
  const [value, setValue] = useState<DateRangeValue>(defaultDateRange);
  return <DateRangeDropdown value={value} onChange={setValue} />;
}
