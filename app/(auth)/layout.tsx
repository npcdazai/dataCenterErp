import { Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-4 py-10">
      {/* Background gradient mesh */}
      <div className="pointer-events-none absolute inset-0 gradient-mesh" />
      <div className="pointer-events-none absolute -left-32 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-1/3 h-[360px] w-[360px] rounded-full bg-violet-500/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg shadow-brand-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold tracking-tight text-fg">
              Omnistack
            </div>
            <div className="text-[11px] text-fg-subtle">Commerce Intelligence</div>
          </div>
        </div>

        {children}

        <p className="mt-6 text-center text-xs text-fg-subtle">
          By signing in you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
