import {
  ActivityItem,
  Campaign,
  Customer,
  NotificationItem,
  Order,
  Product,
  Shipment,
  Vendor
} from "./types";

const av = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
const logo = (seed: string) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
const prodImg = (seed: string) =>
  `https://api.dicebear.com/7.x/icons/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

export const revenueSeries = [
  { month: "Jan", shopify: 420, amazon: 380, flipkart: 220, meta: 140 },
  { month: "Feb", shopify: 460, amazon: 410, flipkart: 250, meta: 165 },
  { month: "Mar", shopify: 510, amazon: 470, flipkart: 290, meta: 190 },
  { month: "Apr", shopify: 560, amazon: 520, flipkart: 310, meta: 215 },
  { month: "May", shopify: 605, amazon: 555, flipkart: 340, meta: 245 },
  { month: "Jun", shopify: 680, amazon: 610, flipkart: 380, meta: 270 },
  { month: "Jul", shopify: 720, amazon: 660, flipkart: 410, meta: 305 },
  { month: "Aug", shopify: 790, amazon: 720, flipkart: 445, meta: 335 },
  { month: "Sep", shopify: 845, amazon: 780, flipkart: 480, meta: 360 },
  { month: "Oct", shopify: 920, amazon: 855, flipkart: 520, meta: 390 },
  { month: "Nov", shopify: 1010, amazon: 940, flipkart: 580, meta: 430 },
  { month: "Dec", shopify: 1180, amazon: 1075, flipkart: 660, meta: 495 }
];

export const ordersSeries = Array.from({ length: 30 }).map((_, i) => ({
  day: `${i + 1}`,
  // Deterministic pseudo-noise — keeps SSR and client identical
  orders:
    120 +
    Math.round(Math.sin(i / 3) * 30 + ((i * 47) % 40) + i * 2),
  refunds: Math.round(4 + ((i * 23) % 8))
}));

export const channelMix = [
  { name: "Shopify", value: 38, color: "#6366f1" },
  { name: "Amazon", value: 27, color: "#f59e0b" },
  { name: "Flipkart", value: 18, color: "#06b6d4" },
  { name: "Meta Ads", value: 11, color: "#ef4444" },
  { name: "Direct", value: 6, color: "#10b981" }
];

export const funnelData = [
  { stage: "Impressions", value: 1_240_000 },
  { stage: "Visits", value: 320_400 },
  { stage: "Add to cart", value: 68_200 },
  { stage: "Checkout", value: 21_800 },
  { stage: "Purchase", value: 14_650 }
];

export const geoSplit = [
  { state: "Maharashtra", orders: 4820, revenue: 1.42 },
  { state: "Karnataka", orders: 3915, revenue: 1.18 },
  { state: "Delhi NCR", orders: 3620, revenue: 1.05 },
  { state: "Tamil Nadu", orders: 3110, revenue: 0.95 },
  { state: "Gujarat", orders: 2540, revenue: 0.78 },
  { state: "Telangana", orders: 2180, revenue: 0.66 },
  { state: "West Bengal", orders: 1875, revenue: 0.56 },
  { state: "Rajasthan", orders: 1420, revenue: 0.42 }
];

/**
 * Fixed reference epoch. All mock timestamps are derived from this so SSR
 * and client renders produce the exact same strings (no hydration drift).
 * Tuned to look "recent" but not actually move with the wall clock.
 */
const BASE_TIME = new Date("2026-05-21T20:30:00+05:30").getTime();

export const customers: Customer[] = [
  ["Aarav Mehta", "aarav@hey.in", "Mumbai", "Maharashtra", "shopify", "vip"],
  ["Diya Sharma", "diya.s@kart.io", "Bengaluru", "Karnataka", "amazon", "loyal"],
  ["Kabir Singh", "kabir.s@hey.in", "Pune", "Maharashtra", "flipkart", "loyal"],
  ["Ananya Iyer", "ananya@hey.in", "Chennai", "Tamil Nadu", "meta", "new"],
  ["Vihaan Kapoor", "vihaan@hey.in", "Delhi", "Delhi", "shopify", "vip"],
  ["Ishita Verma", "ishi@hey.in", "Gurugram", "Haryana", "amazon", "at_risk"],
  ["Aditya Rao", "adi@hey.in", "Hyderabad", "Telangana", "instagram", "loyal"],
  ["Saanvi Nair", "saanvi@hey.in", "Kochi", "Kerala", "shopify", "new"],
  ["Reyansh Joshi", "rey@hey.in", "Ahmedabad", "Gujarat", "flipkart", "churned"],
  ["Aanya Patel", "aanya@hey.in", "Surat", "Gujarat", "amazon", "loyal"],
  ["Arjun Khanna", "arjun@hey.in", "Jaipur", "Rajasthan", "meta", "new"],
  ["Myra Bose", "myra@hey.in", "Kolkata", "West Bengal", "shopify", "vip"]
].map(([name, email, city, state, platform, segment], i) => ({
  id: `CUS-${1000 + i}`,
  name: name as string,
  email: email as string,
  phone: `+91 9${(820000000 + i * 137).toString().slice(0, 9)}`,
  avatar: av(name as string),
  city: city as string,
  state: state as string,
  platform: platform as Customer["platform"],
  orders: 2 + ((i * 7) % 28),
  spend: 4200 + ((i * 9311) % 220000),
  clv: 9800 + ((i * 7311) % 480000),
  lastSeen: new Date(BASE_TIME - i * 3.6e6 * (i + 2)).toISOString(),
  segment: segment as Customer["segment"],
  riskScore: 5 + ((i * 11) % 80),
  loyaltyPoints: 120 + ((i * 91) % 4800)
}));

export const vendors: Vendor[] = [
  ["Lumen & Co.", "Apparel", "Mumbai", "active"],
  ["Forest Hills", "Home & Living", "Bengaluru", "active"],
  ["Bright Bazaar", "Beauty", "Delhi", "pending_kyc"],
  ["Atlas Tools", "Hardware", "Pune", "active"],
  ["Mira Organics", "Grocery", "Chennai", "active"],
  ["Nimbus Tech", "Electronics", "Hyderabad", "active"],
  ["Urban Threads", "Apparel", "Surat", "suspended"],
  ["Kava Cosmetics", "Beauty", "Gurugram", "pending_kyc"],
  ["Otto Pet Co.", "Pet Supplies", "Kolkata", "active"]
].map(([name, category, city, status], i) => ({
  id: `VEN-${500 + i}`,
  name: name as string,
  logo: logo(name as string),
  category: category as string,
  city: city as string,
  status: status as Vendor["status"],
  rating: 3.6 + ((i * 13) % 14) / 10,
  revenue: 480_000 + ((i * 391_111) % 9_800_000),
  products: 24 + ((i * 19) % 280),
  ordersFulfilled: 320 + ((i * 411) % 4800),
  returnRate: 1.2 + ((i * 17) % 70) / 10,
  onboarded: new Date(BASE_TIME - (60 + i * 31) * 86_400_000).toISOString(),
  kyc: {
    gst: status !== "pending_kyc",
    pan: true,
    bank: status === "active",
    docs: status !== "rejected"
  }
}));

export const products: Product[] = [
  ["Aurora Linen Shirt", "Apparel", 1499, "live"],
  ["Helios Smart Lamp", "Home & Living", 2299, "live"],
  ["Petal Glow Serum", "Beauty", 899, "live"],
  ["Atlas 18V Drill", "Hardware", 4599, "live"],
  ["Mira Cold-Press Oil", "Grocery", 549, "out_of_stock"],
  ["Nimbus Buds Pro", "Electronics", 3499, "live"],
  ["Urban Denim Slim", "Apparel", 1899, "pending_review"],
  ["Kava Matte Lipstick", "Beauty", 449, "live"],
  ["Otto Plush Bed L", "Pet Supplies", 2199, "draft"],
  ["Pixel Mech Keyboard", "Electronics", 6499, "live"],
  ["Verde Ceramic Mug", "Home & Living", 399, "live"],
  ["Solis Yoga Mat", "Fitness", 1299, "live"]
].map(([name, category, price, status], i) => {
  const sold = 80 + ((i * 211) % 4200);
  const platforms = ["shopify", "amazon", "flipkart"].slice(
    0,
    (i % 3) + 1
  ) as Product["platforms"];

  // Deterministic split: weights per platform position
  const weights = platforms.map((_, idx) => {
    // Lead platform sells ~55%, second ~30%, third ~15% (with per-product jitter)
    const base = [0.55, 0.3, 0.15][idx] ?? 0.1;
    const jitter = ((i * (idx + 1) * 17) % 20) / 100 - 0.1;
    return Math.max(0.05, base + jitter);
  });
  const sum = weights.reduce((s, w) => s + w, 0);
  const normalized = weights.map((w) => w / sum);

  const salesByPlatform = platforms.map((platform, idx) => {
    const platformSold =
      idx === platforms.length - 1
        ? sold -
          platforms
            .slice(0, idx)
            .reduce(
              (acc, _p, j) => acc + Math.round(sold * normalized[j]),
              0
            )
        : Math.round(sold * normalized[idx]);
    return {
      platform,
      sold: Math.max(0, platformSold),
      revenue: (price as number) * Math.max(0, platformSold)
    };
  });

  return {
    id: `PRD-${2000 + i}`,
    name: name as string,
    sku: `SKU-${String(2000 + i).padStart(5, "0")}`,
    image: prodImg(name as string),
    category: category as string,
    price: price as number,
    stock: status === "out_of_stock" ? 0 : 20 + ((i * 17) % 480),
    sold,
    revenue: (price as number) * sold,
    platforms,
    salesByPlatform,
    status: status as Product["status"],
    rating: 3.8 + ((i * 7) % 12) / 10
  };
});

const cityList = [
  "Mumbai",
  "Bengaluru",
  "Delhi",
  "Pune",
  "Chennai",
  "Hyderabad",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Kochi"
];

export const orders: Order[] = Array.from({ length: 24 }).map((_, i) => {
  const c = customers[i % customers.length];
  const platforms: Order["platform"][] = [
    "shopify",
    "amazon",
    "flipkart",
    "meta",
    "instagram"
  ];
  const statuses: Order["status"][] = [
    "pending",
    "confirmed",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "returned",
    "cancelled"
  ];
  return {
    id: `#ORD-${100340 + i}`,
    customer: c.name,
    customerAvatar: c.avatar,
    platform: platforms[i % platforms.length],
    items: 1 + (i % 5),
    total: 590 + ((i * 1733) % 48_000),
    payment: i % 4 === 0 ? "cod" : "prepaid",
    status: statuses[i % statuses.length],
    placedAt: new Date(BASE_TIME - i * 5.4e6).toISOString(),
    city: cityList[i % cityList.length]
  };
});

export const shipments: Shipment[] = Array.from({ length: 18 }).map((_, i) => {
  const c = customers[i % customers.length];
  const statuses: Shipment["status"][] = [
    "label_created",
    "picked_up",
    "in_transit",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed",
    "rto_initiated",
    "returned"
  ];
  return {
    id: `SHP-${70010 + i}`,
    orderId: `#ORD-${100340 + i}`,
    awb: `DLV${1000_0000 + i * 73_113}`,
    courier: (["Delhivery", "Bluedart", "Ekart", "Shiprocket"] as const)[i % 4],
    customer: c.name,
    origin: "Warehouse · Bhiwandi",
    destination: `${c.city}, ${c.state}`,
    status: statuses[i % statuses.length],
    eta: new Date(BASE_TIME + (1 + (i % 5)) * 86_400_000).toISOString(),
    updatedAt: new Date(BASE_TIME - i * 2.1e6).toISOString(),
    attempts: i % 3,
    weightKg: 0.5 + (i % 8) * 0.4
  };
});

export const campaigns: Campaign[] = [
  ["Diwali Mega - Apparel", "meta", "active"],
  ["Always-On Retargeting", "facebook", "active"],
  ["Lookalike · Hi-LTV", "meta", "active"],
  ["IG Reels Test - Beauty", "instagram", "paused"],
  ["Search · Brand Defense", "google", "active"],
  ["YT Discovery - Electronics", "google", "ended"]
].map(([name, platform, status], i) => {
  const spend = 80_000 + ((i * 91_111) % 480_000);
  const impressions = 240_000 + ((i * 311_111) % 2_800_000);
  const clicks = Math.round(impressions * (0.012 + (i % 5) * 0.003));
  const conversions = Math.round(clicks * (0.022 + (i % 4) * 0.005));
  const revenue = conversions * (1200 + (i % 3) * 400);
  return {
    id: `CMP-${800 + i}`,
    name: name as string,
    platform: platform as Campaign["platform"],
    status: status as Campaign["status"],
    spend,
    impressions,
    clicks,
    conversions,
    revenue
  };
});

export const activity: ActivityItem[] = [
  {
    id: "a1",
    type: "order",
    title: "New order #ORD-100376 from Aarav Mehta",
    meta: "Shopify · ₹4,299 · Mumbai",
    at: new Date(BASE_TIME - 60_000).toISOString()
  },
  {
    id: "a2",
    type: "shipment",
    title: "Shipment SHP-70014 out for delivery",
    meta: "Delhivery · AWB DLV1000292",
    at: new Date(BASE_TIME - 4 * 60_000).toISOString()
  },
  {
    id: "a3",
    type: "vendor",
    title: "Lumen & Co. submitted 12 new SKUs",
    meta: "Pending review",
    at: new Date(BASE_TIME - 18 * 60_000).toISOString()
  },
  {
    id: "a4",
    type: "campaign",
    title: "Diwali Mega — ROAS hit 4.6x",
    meta: "Meta Ads · last 24h",
    at: new Date(BASE_TIME - 42 * 60_000).toISOString()
  },
  {
    id: "a5",
    type: "alert",
    title: "Low stock: Helios Smart Lamp (12 left)",
    meta: "Auto-restock recommended",
    at: new Date(BASE_TIME - 110 * 60_000).toISOString()
  },
  {
    id: "a6",
    type: "customer",
    title: "Diya Sharma upgraded to VIP segment",
    meta: "Lifetime value ₹2.4L",
    at: new Date(BASE_TIME - 5 * 3600_000).toISOString()
  }
];

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    level: "danger",
    title: "3 SLA breaches today",
    body: "Delhivery shipments to Tier-2 cities exceeded promised ETA.",
    at: new Date(BASE_TIME - 22 * 60_000).toISOString(),
    read: false
  },
  {
    id: "n2",
    level: "warning",
    title: "Inventory dipping",
    body: "12 SKUs below safety stock threshold across 3 warehouses.",
    at: new Date(BASE_TIME - 90 * 60_000).toISOString(),
    read: false
  },
  {
    id: "n3",
    level: "success",
    title: "Payout processed",
    body: "₹4.82L disbursed to Lumen & Co. for week 19.",
    at: new Date(BASE_TIME - 6 * 3600_000).toISOString(),
    read: true
  },
  {
    id: "n4",
    level: "info",
    title: "New integration available",
    body: "Connect Razorpay to enable instant settlements.",
    at: new Date(BASE_TIME - 26 * 3600_000).toISOString(),
    read: true
  }
];
