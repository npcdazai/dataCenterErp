"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  FileText,
  Landmark,
  Loader2,
  MapPin,
  ShieldCheck,
  Upload,
  X
} from "lucide-react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { Stepper, Step } from "@/components/ui/Stepper";

const steps: Step[] = [
  { key: "business", label: "Business", hint: "Legal & tax" },
  { key: "contact", label: "Contact", hint: "Address & POC" },
  { key: "bank", label: "Bank", hint: "Payouts" },
  { key: "documents", label: "Documents", hint: "Uploads" },
  { key: "review", label: "Review", hint: "Submit" }
];

interface FormState {
  legalName: string;
  brandName: string;
  category: string;
  gstin: string;
  pan: string;
  cin: string;

  contactName: string;
  contactPhone: string;
  contactEmail: string;
  address: string;
  city: string;
  state: string;
  pincode: string;

  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;

  documents: { name: string; size: string }[];
  agree: boolean;
}

const initial: FormState = {
  legalName: "",
  brandName: "",
  category: "Apparel",
  gstin: "",
  pan: "",
  cin: "",
  contactName: "",
  contactPhone: "",
  contactEmail: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  bankName: "",
  accountNumber: "",
  ifsc: "",
  accountHolder: "",
  documents: [],
  agree: false
};

export default function VendorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function submit() {
    setSubmitting(true);
    setTimeout(() => router.push("/vendors"), 800);
  }

  // Basic validation per-step
  const canNext = (() => {
    switch (step) {
      case 0:
        return !!(form.legalName && form.gstin.length === 15 && form.pan.length === 10);
      case 1:
        return !!(
          form.contactName &&
          form.contactPhone.length >= 10 &&
          form.contactEmail.includes("@") &&
          form.city &&
          form.state &&
          form.pincode.length === 6
        );
      case 2:
        return !!(
          form.bankName &&
          form.accountNumber.length >= 8 &&
          form.ifsc.length === 11 &&
          form.accountHolder
        );
      case 3:
        return form.documents.length >= 2;
      case 4:
        return form.agree;
      default:
        return false;
    }
  })();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Onboard a new vendor"
        description="5-step KYC flow with auto-verification for GST, PAN and bank details."
        actions={
          <Link
            href="/vendors"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-fg-muted hover:text-fg"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to vendors
          </Link>
        }
      />

      <Card>
        <CardBody className="px-5 py-5">
          <Stepper steps={steps} current={step} />
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader
            title={steps[step].label}
            description={
              step === 0
                ? "Tell us about the business entity"
                : step === 1
                ? "Primary point of contact and registered address"
                : step === 2
                ? "Bank account used for vendor payouts"
                : step === 3
                ? "Upload supporting documents (PDF / image, max 5 MB each)"
                : "Confirm the details and submit for approval"
            }
          />
          <CardBody>
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[step].key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {step === 0 && <BusinessStep form={form} update={update} />}
                {step === 1 && <ContactStep form={form} update={update} />}
                {step === 2 && <BankStep form={form} update={update} />}
                {step === 3 && <DocumentsStep form={form} update={update} />}
                {step === 4 && <ReviewStep form={form} update={update} />}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <Button variant="outline" size="md" onClick={back} disabled={step === 0}>
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              {step < steps.length - 1 ? (
                <Button size="md" onClick={next} disabled={!canNext}>
                  Continue <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button size="md" onClick={submit} disabled={!canNext || submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" /> Submit for approval
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Side: verification status & checklist */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Verification status" description="Auto-checks against APIs" />
            <CardBody className="space-y-2.5">
              <CheckRow
                ok={form.gstin.length === 15}
                label="GSTIN"
                hint={form.gstin.length === 15 ? "Format valid" : "Enter 15-char GSTIN"}
              />
              <CheckRow
                ok={form.pan.length === 10}
                label="PAN"
                hint={form.pan.length === 10 ? "Format valid" : "10-char PAN"}
              />
              <CheckRow
                ok={form.ifsc.length === 11}
                label="Bank · IFSC"
                hint={form.ifsc.length === 11 ? "Format valid" : "11-char IFSC"}
              />
              <CheckRow
                ok={form.documents.length >= 2}
                label="Documents"
                hint={`${form.documents.length} uploaded`}
              />
            </CardBody>
          </Card>

          <Card className="border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-violet-500/5">
            <CardBody className="space-y-2 px-5 py-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-fg">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Approval SLA · 24 hours
              </div>
              <p className="text-[11px] leading-relaxed text-fg-muted">
                Once submitted, the operations team reviews KYC + documents and you&apos;ll
                get an email when the vendor goes live.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ----------------- field helpers ----------------- */

function Field({
  label,
  children,
  required,
  hint
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-xs font-medium text-fg">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <div className="text-[10px] text-fg-subtle">{hint}</div>}
    </div>
  );
}

function CheckRow({ ok, label, hint }: { ok: boolean; label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-bg-subtle/40 px-3 py-2">
      <div>
        <div className="text-xs font-medium text-fg">{label}</div>
        <div className="text-[10px] text-fg-subtle">{hint}</div>
      </div>
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full ${
          ok ? "bg-emerald-500/15 text-emerald-500" : "bg-bg-muted text-fg-subtle"
        }`}
      >
        {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
      </span>
    </div>
  );
}

/* ----------------- steps ----------------- */

function BusinessStep({
  form,
  update
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Legal business name" required>
        <Input
          value={form.legalName}
          onChange={(e) => update("legalName", e.target.value)}
          placeholder="Lumen & Co. Pvt Ltd"
        />
      </Field>
      <Field label="Brand / Display name">
        <Input
          value={form.brandName}
          onChange={(e) => update("brandName", e.target.value)}
          placeholder="Lumen"
        />
      </Field>
      <Field label="Category" required>
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          {["Apparel", "Beauty", "Electronics", "Home & Living", "Grocery", "Hardware", "Fitness", "Pet Supplies"].map(
            (c) => (
              <option key={c}>{c}</option>
            )
          )}
        </select>
      </Field>
      <Field label="CIN (Corporate)" hint="Optional for proprietorships">
        <Input
          value={form.cin}
          onChange={(e) => update("cin", e.target.value.toUpperCase())}
          placeholder="U74999MH2022PTC123456"
        />
      </Field>
      <Field label="GSTIN" required hint="15 characters">
        <Input
          value={form.gstin}
          maxLength={15}
          onChange={(e) => update("gstin", e.target.value.toUpperCase())}
          placeholder="27AABCS1234L1Z2"
        />
      </Field>
      <Field label="PAN" required hint="10 characters">
        <Input
          value={form.pan}
          maxLength={10}
          onChange={(e) => update("pan", e.target.value.toUpperCase())}
          placeholder="AABCS1234L"
        />
      </Field>
    </div>
  );
}

function ContactStep({
  form,
  update
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Contact person" required>
        <Input
          value={form.contactName}
          onChange={(e) => update("contactName", e.target.value)}
          placeholder="Riya Mehta"
        />
      </Field>
      <Field label="Phone" required>
        <Input
          value={form.contactPhone}
          onChange={(e) => update("contactPhone", e.target.value.replace(/\D/g, ""))}
          placeholder="+91 98xxxxxx00"
          maxLength={12}
        />
      </Field>
      <Field label="Email" required>
        <Input
          type="email"
          value={form.contactEmail}
          onChange={(e) => update("contactEmail", e.target.value)}
          placeholder="ops@lumen.in"
        />
      </Field>
      <Field label="Pincode" required>
        <Input
          value={form.pincode}
          onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder="400001"
        />
      </Field>
      <Field label="Registered address" required>
        <Input
          value={form.address}
          onChange={(e) => update("address", e.target.value)}
          placeholder="Plot 24, MIDC Bhiwandi"
        />
      </Field>
      <Field label="City" required>
        <Input
          value={form.city}
          onChange={(e) => update("city", e.target.value)}
          placeholder="Mumbai"
        />
      </Field>
      <Field label="State" required>
        <select
          value={form.state}
          onChange={(e) => update("state", e.target.value)}
          className="h-9 w-full rounded-lg border border-border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        >
          <option value="">Select…</option>
          {[
            "Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat",
            "Telangana", "West Bengal", "Rajasthan", "Kerala", "Punjab"
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </Field>
    </div>
  );
}

function BankStep({
  form,
  update
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Field label="Bank name" required>
        <Input
          value={form.bankName}
          onChange={(e) => update("bankName", e.target.value)}
          placeholder="HDFC Bank"
        />
      </Field>
      <Field label="Account holder name" required>
        <Input
          value={form.accountHolder}
          onChange={(e) => update("accountHolder", e.target.value)}
          placeholder="Lumen & Co. Pvt Ltd"
        />
      </Field>
      <Field label="Account number" required>
        <Input
          value={form.accountNumber}
          onChange={(e) => update("accountNumber", e.target.value.replace(/\D/g, ""))}
          placeholder="50100xxxxx0001"
          maxLength={20}
        />
      </Field>
      <Field label="IFSC code" required hint="11-char IFSC">
        <Input
          value={form.ifsc}
          maxLength={11}
          onChange={(e) => update("ifsc", e.target.value.toUpperCase())}
          placeholder="HDFC0001234"
        />
      </Field>
      <div className="md:col-span-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] text-emerald-600 dark:text-emerald-300">
        We&apos;ll send ₹1 to verify the account. The penny-drop verification is
        reversed instantly.
      </div>
    </div>
  );
}

function DocumentsStep({
  form,
  update
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const required = [
    "GST certificate",
    "PAN card",
    "Cancelled cheque / bank proof",
    "Vendor agreement (signed)"
  ];

  function fakeUpload(name: string) {
    const sizes = ["218 KB", "412 KB", "1.2 MB", "682 KB"];
    update("documents", [
      ...form.documents,
      { name, size: sizes[Math.floor(Math.random() * sizes.length)] }
    ]);
  }

  function remove(name: string) {
    update(
      "documents",
      form.documents.filter((d) => d.name !== name)
    );
  }

  return (
    <div className="space-y-3">
      {required.map((name) => {
        const uploaded = form.documents.find((d) => d.name === name);
        return (
          <div
            key={name}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg-subtle/40 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  uploaded ? "bg-emerald-500/15 text-emerald-500" : "bg-brand-500/10 text-brand-500"
                }`}
              >
                <FileText className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-medium text-fg">{name}</div>
                <div className="text-[11px] text-fg-subtle">
                  {uploaded ? `Uploaded · ${uploaded.size}` : "PDF or image · up to 5 MB"}
                </div>
              </div>
            </div>
            {uploaded ? (
              <Button variant="outline" size="sm" onClick={() => remove(name)}>
                <X className="h-3.5 w-3.5" /> Remove
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => fakeUpload(name)}>
                <Upload className="h-3.5 w-3.5" /> Upload
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ReviewStep({
  form,
  update
}: {
  form: FormState;
  update: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Block icon={<Building2 className="h-3.5 w-3.5" />} title="Business">
          <RowKv k="Legal name" v={form.legalName || "—"} />
          <RowKv k="Brand" v={form.brandName || "—"} />
          <RowKv k="Category" v={form.category} />
          <RowKv k="GSTIN" v={form.gstin || "—"} mono />
          <RowKv k="PAN" v={form.pan || "—"} mono />
        </Block>
        <Block icon={<MapPin className="h-3.5 w-3.5" />} title="Contact">
          <RowKv k="POC" v={form.contactName || "—"} />
          <RowKv k="Phone" v={form.contactPhone || "—"} />
          <RowKv k="Email" v={form.contactEmail || "—"} />
          <RowKv k="City" v={form.city ? `${form.city}, ${form.state}` : "—"} />
          <RowKv k="Pincode" v={form.pincode || "—"} />
        </Block>
        <Block icon={<Landmark className="h-3.5 w-3.5" />} title="Bank">
          <RowKv k="Bank" v={form.bankName || "—"} />
          <RowKv k="Holder" v={form.accountHolder || "—"} />
          <RowKv k="Account" v={form.accountNumber ? `••••${form.accountNumber.slice(-4)}` : "—"} mono />
          <RowKv k="IFSC" v={form.ifsc || "—"} mono />
        </Block>
      </div>

      <div className="rounded-xl border border-border bg-bg-subtle/40 p-4">
        <div className="mb-2 text-xs font-medium text-fg">Uploaded documents</div>
        <div className="flex flex-wrap gap-2">
          {form.documents.length === 0 ? (
            <div className="text-[11px] text-fg-subtle">No documents uploaded</div>
          ) : (
            form.documents.map((d) => (
              <Badge key={d.name} tone="success" dot>
                <CheckCircle2 className="h-3 w-3" /> {d.name}
              </Badge>
            ))
          )}
        </div>
      </div>

      <label className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-3 py-3 text-xs">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => update("agree", e.target.checked)}
          className="mt-0.5 h-3.5 w-3.5 rounded accent-brand-500"
        />
        <span className="text-fg-muted">
          I confirm the details above are accurate and authorize Omnistack to verify
          KYC documents with regulatory authorities. I accept the{" "}
          <span className="font-medium text-brand-600">Vendor Agreement</span>.
        </span>
      </label>
    </div>
  );
}

function Block({
  icon,
  title,
  children
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-bg-subtle/40 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
        <span className="text-brand-500">{icon}</span> {title}
      </div>
      <dl className="space-y-1">{children}</dl>
    </div>
  );
}

function RowKv({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-[11px]">
      <dt className="text-fg-subtle">{k}</dt>
      <dd className={`max-w-[60%] truncate text-right text-fg ${mono ? "font-mono" : "font-medium"}`}>
        {v}
      </dd>
    </div>
  );
}
