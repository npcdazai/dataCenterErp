import { Activity, Plus, Zap } from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";

const integrations: {
  name: string;
  category: string;
  status: "connected" | "available" | "syncing";
  description: string;
  initials: string;
  bg: string;
}[] = [
  { name: "Shopify", category: "Commerce", status: "connected", description: "Orders, products, customers, inventory sync.", initials: "Sh", bg: "bg-emerald-500/15 text-emerald-500" },
  { name: "Amazon Seller", category: "Marketplace", status: "connected", description: "Listings, orders, MFN/FBA fulfillment.", initials: "Az", bg: "bg-amber-500/15 text-amber-500" },
  { name: "Flipkart Seller", category: "Marketplace", status: "connected", description: "Catalog, orders, returns, payments.", initials: "Fk", bg: "bg-blue-500/15 text-blue-500" },
  { name: "Meta Ads", category: "Marketing", status: "connected", description: "Campaigns, audiences, conversions API.", initials: "Mt", bg: "bg-indigo-500/15 text-indigo-500" },
  { name: "Facebook Commerce", category: "Marketing", status: "connected", description: "Catalog, shops, messages, leads.", initials: "Fb", bg: "bg-sky-500/15 text-sky-500" },
  { name: "Delhivery", category: "Logistics", status: "syncing", description: "Shipments, AWB, tracking, NDR.", initials: "Dl", bg: "bg-rose-500/15 text-rose-500" },
  { name: "Meesho", category: "Marketplace", status: "available", description: "Suppliers, orders, returns.", initials: "Me", bg: "bg-pink-500/15 text-pink-500" },
  { name: "WooCommerce", category: "Commerce", status: "available", description: "Self-hosted store integration.", initials: "Wo", bg: "bg-violet-500/15 text-violet-500" },
  { name: "Magento", category: "Commerce", status: "available", description: "Enterprise commerce platform.", initials: "Mg", bg: "bg-orange-500/15 text-orange-500" },
  { name: "Razorpay", category: "Payments", status: "available", description: "Payment gateway & settlements.", initials: "Rz", bg: "bg-cyan-500/15 text-cyan-500" },
  { name: "Google Analytics", category: "Analytics", status: "available", description: "Web analytics & attribution.", initials: "Ga", bg: "bg-yellow-500/15 text-yellow-500" },
  { name: "Shiprocket", category: "Logistics", status: "available", description: "Multi-courier aggregation.", initials: "Sr", bg: "bg-fuchsia-500/15 text-fuchsia-500" }
];

const statusTone: Record<string, "success" | "warning" | "neutral"> = {
  connected: "success",
  syncing: "warning",
  available: "neutral"
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Integrations"
        description="Connect platforms, sync data in real-time, validate webhooks."
        actions={
          <Button size="sm"><Plus className="h-3.5 w-3.5" /> Custom webhook</Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {integrations.map((i) => (
          <Card key={i.name} className="hover:shadow-elevated transition">
            <CardBody className="space-y-3">
              <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${i.bg}`}>
                  {i.initials}
                </div>
                <Badge tone={statusTone[i.status]} dot>{i.status}</Badge>
              </div>
              <div>
                <div className="text-sm font-semibold text-fg">{i.name}</div>
                <div className="text-[11px] text-fg-subtle">{i.category}</div>
                <p className="mt-2 text-xs text-fg-muted">{i.description}</p>
              </div>
              <div className="flex items-center gap-2 border-t border-border pt-3">
                {i.status === "connected" ? (
                  <>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500">
                      <Activity className="h-3 w-3" /> Live
                    </span>
                    <Button variant="outline" size="sm" className="ml-auto">Configure</Button>
                  </>
                ) : i.status === "syncing" ? (
                  <Button variant="outline" size="sm" className="ml-auto">View status</Button>
                ) : (
                  <Button size="sm" className="ml-auto">
                    <Zap className="h-3.5 w-3.5" /> Connect
                  </Button>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="API health" description="Real-time status of integration endpoints" />
        <CardBody>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              ["Shopify Admin API", 99.98, "success"],
              ["Amazon SP-API", 99.92, "success"],
              ["Delhivery Tracking", 96.4, "warning"],
              ["Meta Marketing API", 99.81, "success"],
              ["Flipkart Seller API", 98.6, "success"],
              ["Razorpay Webhook", 100, "success"]
            ].map(([name, uptime, tone]) => (
              <div key={name as string} className="rounded-xl border border-border bg-bg-subtle/40 p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-fg">{name}</span>
                  <Badge tone={tone as never} dot>{(uptime as number).toFixed(2)}%</Badge>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-muted">
                  <div
                    className={`h-full rounded-full ${
                      (uptime as number) >= 99 ? "bg-emerald-500" : "bg-amber-500"
                    }`}
                    style={{ width: `${uptime}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
