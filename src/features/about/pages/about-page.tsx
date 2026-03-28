import { Activity, BellElectric, Pill, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

const pillars = [
  {
    icon: Pill,
    title: "Medication validation",
    description:
      "Cross-check combinations, surface known risks, and give teams a faster first-pass view.",
  },
  {
    icon: Activity,
    title: "Clinical context",
    description:
      "Summaries, severity scoring, and reference notes help non-specialists understand what needs attention.",
  },
  {
    icon: BellElectric,
    title: "Operational awareness",
    description:
      "Saved searches and clear recommendations support consistent workflows across reviews.",
  },
  {
    icon: ShieldAlert,
    title: "Safety first",
    description:
      "The product is framed as decision support, not a substitute for clinicians or medical guidance.",
  },
];

export function AboutPage() {
  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        description="SafeRx is designed to help healthcare teams review medications more confidently with clearer interaction insights, structured workflows, and a modern dashboard experience."
        title="About SafeRx"
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden p-0">
          <div className="grid gap-0 md:grid-cols-2">
            <div className="bg-[linear-gradient(135deg,#4458a7_0%,#6980d7_100%)] p-5 text-white sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200 sm:text-sm sm:tracking-[0.24em]">
                Product Vision
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Reduce medication risk with clearer, faster interaction review.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/80">
                SafeRx brings medication review, interaction awareness, and
                safety-first decision support into one clean interface. The goal
                is to help teams move faster while keeping risk visibility high
                and workflows easy to follow.
              </p>
            </div>
            <div className="space-y-4 p-5 sm:p-8">
              <div>
                <h3 className="text-lg font-semibold">Why SafeRx exists</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  Medication reviews often involve scattered information,
                  repetitive checking, and unnecessary friction. SafeRx is built
                  to make that process more organized, understandable, and
                  efficient for the people using it every day.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900">
                <p className="text-sm font-medium">How it helps teams</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  From quick interaction checks to saved reviews and visual risk
                  summaries, SafeRx is meant to support faster decisions,
                  cleaner communication, and better medication safety awareness.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="panel-title">Drug categories we analyze</h3>
          <p className="muted mt-2">
            A visual snapshot of the medication categories and care settings
            that shape everyday interaction review.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "https://images.pexels.com/photos/3683078/pexels-photo-3683078.jpeg",
              "https://images.pexels.com/photos/360622/pexels-photo-360622.jpeg",
              "https://images.pexels.com/photos/4021772/pexels-photo-4021772.jpeg",
              "https://images.pexels.com/photos/3861439/pexels-photo-3861439.jpeg",
            ].map((image, index) => (
              <img
                alt={`Drug reference ${index + 1}`}
                className="aspect-[4/3] w-full rounded-3xl object-cover"
                key={image}
                src={image}
              />
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {pillars.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-200">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
