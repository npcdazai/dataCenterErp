import {
  BarChart3,
  Boxes,
  Building2,
  LayoutDashboard,
  Megaphone,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Users,
  Zap
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

export const navGroups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/analytics", label: "Analytics", icon: BarChart3 }
    ]
  },
  {
    label: "Commerce",
    items: [
      { href: "/orders", label: "Orders", icon: ShoppingCart, badge: "24" },
      { href: "/products", label: "Products", icon: Package },
      { href: "/customers", label: "Customers", icon: Users },
      { href: "/vendors", label: "Vendors", icon: Building2 }
    ]
  },
  {
    label: "Operations",
    items: [
      { href: "/shipments", label: "Shipments", icon: Truck },
      { href: "/inventory", label: "Inventory", icon: Boxes },
      { href: "/marketing", label: "Marketing", icon: Megaphone }
    ]
  },
  {
    label: "Platform",
    items: [
      { href: "/integrations", label: "Integrations", icon: Zap },
      { href: "/admin", label: "Admin", icon: ShieldCheck },
      { href: "/settings", label: "Settings", icon: Settings }
    ]
  }
];
