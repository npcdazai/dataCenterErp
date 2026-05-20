"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("pratham@pratham.in");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.includes("@")) return setError("Enter a valid email address.");
    if (password.length < 4) return setError("Password must be at least 4 characters.");

    setLoading(true);
    // Simulate auth + OTP dispatch
    setTimeout(() => {
      const masked = email.replace(/(.{2}).+(@.+)/, "$1•••$2");
      router.push(`/login/verify?email=${encodeURIComponent(masked)}`);
    }, 700);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card/80 p-7 shadow-elevated backdrop-blur-xl"
    >
      <div className="space-y-1.5 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-fg">
          Sign in to your workspace
        </h1>
        <p className="text-xs text-fg-muted">
          Use your work email and password — we&apos;ll send a one-time code.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-fg">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="h-10 w-full rounded-lg border border-border bg-bg-subtle/60 pl-9 pr-3 text-sm text-fg placeholder:text-fg-subtle focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-xs font-medium text-fg">
              Password
            </label>
            <button
              type="button"
              className="text-[11px] font-medium text-brand-600 hover:underline"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-10 w-full rounded-lg border border-border bg-bg-subtle/60 pl-9 pr-10 text-sm text-fg placeholder:text-fg-subtle focus:border-brand-500/60 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-fg-subtle hover:bg-bg-muted hover:text-fg"
              aria-label={showPwd ? "Hide password" : "Show password"}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex select-none items-center gap-2 text-xs text-fg-muted">
          <input type="checkbox" className="h-3.5 w-3.5 rounded accent-brand-500" defaultChecked />
          Keep me signed in on this device
        </label>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending OTP…
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" /> Continue
            </>
          )}
        </Button>
      </form>

      <div className="mt-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[10px] uppercase tracking-wider text-fg-subtle">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="outline" size="md" className="w-full">
          Google
        </Button>
        <Button variant="outline" size="md" className="w-full">
          Microsoft
        </Button>
      </div>

      <p className="mt-6 text-center text-xs text-fg-muted">
        New to Omnistack?{" "}
        <Link href="#" className="font-medium text-brand-600 hover:underline">
          Request access
        </Link>
      </p>
    </motion.div>
  );
}
