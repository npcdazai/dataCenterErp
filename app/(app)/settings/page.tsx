import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Organization, branding, and security." />

      <Card>
        <CardHeader title="Organization" description="Public business profile" />
        <CardBody className="space-y-4">
          <Field label="Workspace name" defaultValue="Pratham Commerce" />
          <Field label="Primary domain" defaultValue="https://pratham.in" />
          <Field label="Support email" defaultValue="support@pratham.in" />
          <Field label="GSTIN" defaultValue="27AABCS1234L1Z2" />
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="outline" size="sm">Cancel</Button>
            <Button size="sm">Save changes</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Security" description="Authentication & access controls" />
        <CardBody className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Toggle label="Two-factor authentication" enabled />
          <Toggle label="SSO / SAML" enabled={false} />
          <Toggle label="IP whitelisting" enabled />
          <Toggle label="Session timeout (15 min)" enabled />
          <Toggle label="Webhook signature verification" enabled />
          <Toggle label="Audit log streaming" enabled={false} />
        </CardBody>
      </Card>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-[200px_1fr]">
      <label className="text-sm font-medium text-fg">{label}</label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

function Toggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-bg-subtle/40 px-4 py-3">
      <span className="text-sm text-fg">{label}</span>
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
          enabled ? "bg-brand-500" : "bg-bg-muted"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
            enabled ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
    </div>
  );
}
