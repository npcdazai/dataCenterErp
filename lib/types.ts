export type Platform =
  | "shopify"
  | "amazon"
  | "flipkart"
  | "meta"
  | "facebook"
  | "instagram"
  | "website";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "returned"
  | "cancelled"
  | "refunded";

export type ShipmentStatus =
  | "label_created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned"
  | "rto_initiated";

export type VendorStatus = "active" | "pending_kyc" | "suspended" | "rejected";

export interface KpiDelta {
  value: number;
  label?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  city: string;
  state: string;
  platform: Platform;
  orders: number;
  spend: number;
  clv: number;
  lastSeen: string;
  segment: "vip" | "loyal" | "new" | "at_risk" | "churned";
  riskScore: number;
  loyaltyPoints: number;
}

export interface Vendor {
  id: string;
  name: string;
  logo: string;
  category: string;
  city: string;
  status: VendorStatus;
  rating: number;
  revenue: number;
  products: number;
  ordersFulfilled: number;
  returnRate: number;
  onboarded: string;
  kyc: { gst: boolean; pan: boolean; bank: boolean; docs: boolean };
}

export interface ProductPlatformSales {
  platform: Platform;
  sold: number;
  revenue: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  revenue: number;
  platforms: Platform[];
  /** Per-platform sales split — sums to `sold` / `revenue`. */
  salesByPlatform: ProductPlatformSales[];
  status: "live" | "draft" | "out_of_stock" | "pending_review";
  rating: number;
}

export interface Order {
  id: string;
  customer: string;
  customerAvatar: string;
  platform: Platform;
  items: number;
  total: number;
  payment: "prepaid" | "cod";
  status: OrderStatus;
  placedAt: string;
  city: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  awb: string;
  courier: "Delhivery" | "Bluedart" | "Ekart" | "Shiprocket";
  customer: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  eta: string;
  updatedAt: string;
  attempts: number;
  weightKg: number;
}

export interface Campaign {
  id: string;
  name: string;
  platform: "meta" | "facebook" | "instagram" | "google";
  status: "active" | "paused" | "ended";
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface ActivityItem {
  id: string;
  type: "order" | "customer" | "vendor" | "shipment" | "campaign" | "alert";
  title: string;
  meta?: string;
  at: string;
}

export interface NotificationItem {
  id: string;
  level: "info" | "success" | "warning" | "danger";
  title: string;
  body: string;
  at: string;
  read: boolean;
}
