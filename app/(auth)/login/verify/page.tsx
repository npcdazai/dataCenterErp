"use client";

import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  Suspense,
  useEffect,
  useRef,
  useState
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const OTP_LENGTH = 4;
const RESEND_SECONDS = 30;

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyForm />
    </Suspense>
  );
}

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const maskedEmail = params.get("email") ?? "your email";

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setInterval(() => setResendIn((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [resendIn]);

  const code = digits.join("");
  const complete = code.length === OTP_LENGTH;

  function setDigitAt(i: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < OTP_LENGTH - 1) inputs.current[i + 1]?.focus();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, i: number) {
    setError(null);
    setDigitAt(i, e.target.value);
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>, i: number) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
      inputs.current[i + 1]?.focus();
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    inputs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!complete) return setError("Please enter the 4-digit code.");
    setError(null);
    setLoading(true);
    // Simulate verification — accepts any 4 digits in demo
    setTimeout(() => router.push("/"), 600);
  }

  function handleResend() {
    if (resendIn > 0) return;
    setDigits(Array(OTP_LENGTH).fill(""));
    setResendIn(RESEND_SECONDS);
    inputs.current[0]?.focus();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border bg-card/80 p-7 shadow-elevated backdrop-blur-xl"
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-500">
          <MailCheck className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-fg">
          Two-factor verification
        </h1>
        <p className="mt-1.5 max-w-xs text-xs text-fg-muted">
          Enter the 4-digit OTP sent to email address{" "}
          <span className="font-medium text-fg">{maskedEmail}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div
          className="flex items-center justify-center gap-3"
          onPaste={handlePaste}
        >
          {Array.from({ length: OTP_LENGTH }).map((_, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              autoComplete="one-time-code"
              value={digits[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKey(e, i)}
              className={cn(
                "h-14 w-12 rounded-xl border-2 bg-bg-subtle/60 text-center text-2xl font-semibold tabular-nums text-fg",
                "transition focus:outline-none",
                digits[i]
                  ? "border-brand-500/70 text-brand-600 dark:text-brand-300"
                  : "border-border focus:border-brand-500/70 focus:ring-4 focus:ring-brand-500/15"
              )}
            />
          ))}
        </div>

        {error && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-center text-xs text-rose-500">
            {error}
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={!complete || loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4" /> Verify & continue
            </>
          )}
        </Button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-fg-muted">
          Didn&apos;t receive it?{" "}
          {resendIn > 0 ? (
            <span className="font-medium text-fg-subtle">
              Resend in {resendIn}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-medium text-brand-600 hover:underline"
            >
              Resend code
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 border-t border-border pt-4">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs text-fg-muted hover:text-fg"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to login
        </Link>
      </div>
    </motion.div>
  );
}
