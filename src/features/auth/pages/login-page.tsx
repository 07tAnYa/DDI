import { ArrowRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(75,92,170,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(129,146,228,0.16),transparent_22%),linear-gradient(135deg,#ffffff_0%,#f7f9fd_44%,#eef3ff_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(75,92,170,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(129,146,228,0.2),transparent_18%),linear-gradient(135deg,#0f172b_0%,#172033_44%,#101827_100%)]" />
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col gap-8 px-4 py-6 sm:gap-10 sm:py-8 lg:flex-row lg:items-center lg:px-8">
        <section className="order-2 flex-1 lg:order-1">
          <Logo />
          <div className="mt-8 max-w-2xl sm:mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-500 sm:text-sm sm:tracking-[0.3em]">
              Medication safety workspace
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl dark:text-white">
              Review drug interactions with clarity, speed, and confidence.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 sm:mt-6 sm:text-lg sm:leading-8 dark:text-slate-300">
              SafeRx helps care teams assess medication combinations, surface
              clinically relevant risks, and move from review to action in one
              connected interface.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 xl:grid-cols-3">
            <FeatureCard
              description="Search medications, build review sets, and run interaction checks without losing context."
              icon={ShieldCheck}
              title="Faster review"
            />
            <FeatureCard
              description="See severity, evidence, and next-step recommendations in a clear decision-ready workspace."
              icon={Sparkles}
              title="Actionable insight"
            />
            <FeatureCard
              description="Structured to support secure sign-in, shared records, and traceable review activity as the platform grows."
              icon={LockKeyhole}
              title="Built to scale"
            />
          </div>
        </section>

        <Card className="order-1 w-full max-w-md border-brand-100 bg-white p-5 sm:p-6 lg:order-2 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 sm:text-sm sm:tracking-[0.2em]">
            Secure access
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Access your workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            Sign in to continue to SafeRx, or open the sample workspace to
            explore the medication safety workflow instantly.
          </p>

          <div className="mt-6 space-y-4 sm:mt-8">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Email</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="clinician@saferx.ai"
                type="email"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Password</span>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
                placeholder="Enter your secure password"
                type="password"
              />
            </label>
          </div>

          <div className="mt-6 space-y-3">
            <Button className="w-full justify-center" onClick={() => navigate("/app/dashboard")}>
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              className="w-full justify-center"
              onClick={() => navigate("/app/dashboard")}
              variant="secondary"
            >
              Open sample workspace
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}

type FeatureCardProps = {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
};

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="border-white/60 bg-white/80 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-200">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
        {description}
      </p>
    </Card>
  );
}
