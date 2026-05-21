import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(value: number, opts?: { compact?: boolean }) {
  if (opts?.compact) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number, opts?: { compact?: boolean }) {
  return new Intl.NumberFormat("en-IN", {
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number, fractionDigits = 1) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(fractionDigits)}%`;
}

/**
 * Reference epoch used for relative-time labels. Kept stable across SSR/client
 * so output strings stay deterministic and don't cause hydration mismatches.
 * Matches BASE_TIME used to generate mock data.
 */
const REFERENCE_NOW = new Date("2026-05-21T20:30:00+05:30").getTime();

export function timeAgo(iso: string) {
  const diff = REFERENCE_NOW - new Date(iso).getTime();
  const sec = Math.max(0, Math.floor(diff / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  return `${mo}mo ago`;
}
