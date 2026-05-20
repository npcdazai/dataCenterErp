import {
  Activity,
  KeyRound,
  ShieldCheck,
  UserCog,
  Users
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PageHeader } from "@/components/ui/PageHeader";
import { KpiCard } from "@/components/ui/KpiCard";
import { Avatar } from "@/components/ui/Avatar";

const roles = [
  { name: "Super Admin", users: 2, perms: 84, tone: "danger" },
  { name: "Operations", users: 18, perms: 42, tone: "brand" },
  { name: "Vendor Manager", users: 9, perms: 28, tone: "purple" },
  { name: "Support", users: 24, perms: 14, tone: "info" },
  { name: "Vendor", users: 184, perms: 12, tone: "neutral" }
];

const auditLog = [
  { who: "pratham@pratham.in", action: "Updated commission for Lumen & Co. from 12% → 14%", at: "2m ago", tone: "warning" },
  { who: "ops_meera@sml.in", action: "Approved 4 new product listings (Nimbus Tech)", at: "18m ago", tone: "success" },
  { who: "api://shopify-sync", action: "Imported 124 orders from Shopify", at: "32m ago", tone: "info" },
  { who: "support_aman@sml.in", action: "Issued refund of ₹4,299 for #ORD-100328", at: "1h ago", tone: "warning" },
  { who: "admin@sml.in", action: "Rotated production API key for Meta Marketing", at: "3h ago", tone: "danger" }
];

const toneTextMap: Record<string, string> = {
  danger: "bg-rose-500/15 text-rose-500",
  warning: "bg-amber-500/15 text-amber-500",
  success: "bg-emerald-500/15 text-emerald-500",
  info: "bg-cyan-500/15 text-cyan-500"
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin"
        description="Users, roles, permissions, API keys and audit log."
        actions={
          <>
            <Button variant="outline" size="sm"><KeyRound className="h-3.5 w-3.5" /> API keys</Button>
            <Button size="sm"><UserCog className="h-3.5 w-3.5" /> Invite user</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Total Users" value="237" icon={<Users />} delta={4.1} tone="brand" />
        <KpiCard label="2FA Enabled" value="86%" delta={5.2} icon={<ShieldCheck />} tone="success" />
        <KpiCard label="API Calls (24h)" value="1.2M" delta={9.8} icon={<Activity />} tone="info" />
        <KpiCard label="Failed Logins (24h)" value="14" delta={-2.4} tone="warning" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Audit log" description="System & user actions (last 24h)" />
          <CardBody className="px-0">
            <ul className="divide-y divide-border">
              {auditLog.map((a) => (
                <li key={a.action} className="flex items-center gap-3 px-5 py-3">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${toneTextMap[a.tone]}`}>
                    <Activity className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm text-fg">{a.action}</div>
                    <div className="mt-0.5 text-[11px] text-fg-subtle">
                      {a.who} · {a.at}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Roles & permissions" description="RBAC summary" />
          <CardBody className="space-y-2.5">
            {roles.map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-xl border border-border bg-bg-subtle/40 px-3 py-2.5">
                <div>
                  <div className="text-sm font-medium text-fg">{r.name}</div>
                  <div className="text-[11px] text-fg-subtle">{r.users} users · {r.perms} permissions</div>
                </div>
                <Badge tone={r.tone as never} dot>active</Badge>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Active sessions" description="Current logged-in users" />
        <CardBody className="px-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-y border-border bg-bg-subtle/60 text-[11px] uppercase tracking-wider text-fg-subtle">
                  <th className="py-2.5 pl-5 text-left font-medium">User</th>
                  <th className="py-2.5 text-left font-medium">Role</th>
                  <th className="py-2.5 text-left font-medium">IP</th>
                  <th className="py-2.5 text-left font-medium">Device</th>
                  <th className="py-2.5 text-left font-medium">2FA</th>
                  <th className="py-2.5 pr-5 text-right font-medium">Last activity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["Pratham", "Super Admin", "103.21.45.118", "MacBook · Chrome", true, "Just now"],
                  ["Meera Joshi", "Operations", "49.207.4.21", "Windows · Edge", true, "6m ago"],
                  ["Aman Verma", "Support", "182.74.221.10", "iPhone · Safari", true, "12m ago"],
                  ["Vendor: Lumen & Co.", "Vendor", "27.59.190.42", "Android · Chrome", false, "1h ago"]
                ].map(([name, role, ip, device, twofa, last]) => (
                  <tr key={name as string} className="hover:bg-bg-muted/50">
                    <td className="py-3 pl-5">
                      <div className="flex items-center gap-2">
                        <Avatar src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name as string} size={26} />
                        <span className="font-medium">{name}</span>
                      </div>
                    </td>
                    <td className="py-3">{role}</td>
                    <td className="py-3 font-mono text-xs text-fg-muted">{ip}</td>
                    <td className="py-3 text-fg-muted">{device}</td>
                    <td className="py-3">
                      <Badge tone={twofa ? "success" : "warning"} dot>{twofa ? "Enabled" : "Off"}</Badge>
                    </td>
                    <td className="py-3 pr-5 text-right text-xs text-fg-muted">{last as string}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
