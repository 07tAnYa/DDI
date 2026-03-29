import {
  AlertTriangle,
  Download,
  HeartPulse,
  Network,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";
import type { InteractionResponse } from "@/types/interaction";

type ResultsOverviewProps = {
  result: InteractionResponse | null;
  onExportCsv: () => void;
};

export function ResultsOverview({
  result,
  onExportCsv,
}: ResultsOverviewProps) {
  if (!result) {
    return (
      <Card className="flex min-h-52 items-center justify-center text-center">
        <div className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-500">
            Start a review
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Choose at least two medicines to generate an interaction report.
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            SafeRx will summarize the review, highlight severity levels, and
            present the recommended next steps once the check is complete.
          </p>
        </div>
      </Card>
    );
  }

  const severityEntries = [
    {
      icon: AlertTriangle,
      label: "High",
      value: result.statistics.bySeverity.High,
    },
    {
      icon: HeartPulse,
      label: "Moderate",
      value: result.statistics.bySeverity.Moderate,
    },
    {
      icon: ShieldCheck,
      label: "Low",
      value: result.statistics.bySeverity.Low,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="grid gap-5 lg:gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={result.summary.riskLevel}>
                {result.summary.riskLevel} risk
              </Badge>
              <span className="text-sm text-[var(--text-muted)]">
                Generated {formatTimestamp(result.query.timestamp)}
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              {result.summary.summaryText}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              Review set:{" "}
              {result.query.drugs
                .map((drug) =>
                  drug.dosage ? `${drug.name} (${drug.dosage})` : drug.name,
                )
                .join(", ")}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="w-full sm:w-auto" onClick={onExportCsv} variant="secondary">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>

          <div
            className="rounded-[28px] p-5 text-slate-50 sm:p-6"
            style={{
              background:
                "linear-gradient(135deg, var(--primary) 0%, color-mix(in srgb, var(--primary) 72%, white) 100%)",
            }}
          >
            <p className="text-sm uppercase tracking-[0.24em] text-brand-200">
              Risk score
            </p>
            <p className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              {result.summary.riskScore}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Weighted by severity across the selected medication set.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-brand-500" />
            <h3 className="panel-title">Severity distribution</h3>
          </div>
          <div className="mt-6 space-y-4">
            {severityEntries.map(({ icon: Icon, label, value }) => {
              const total = Math.max(1, result.interactions.length);
              const percentage = (value / total) * 100;

              return (
                <div key={label}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-[var(--text-muted)]" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <span className="text-sm text-[var(--text-muted)]">
                      {value}
                    </span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                    <div
                      className={
                        label === "High"
                          ? "h-full rounded-full bg-rose-500"
                          : label === "Moderate"
                            ? "h-full rounded-full bg-amber-500"
                            : "h-full rounded-full bg-emerald-500"
                      }
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="panel-title">Risk timeline</h3>
          <p className="muted mt-2">
            Recent review scores help teams spot shifts in interaction risk over time.
          </p>
          <div className="mt-6 space-y-4">
            {result.statistics.history.map((point, index) => (
              <div className="grid gap-2 sm:grid-cols-[96px_minmax(0,1fr)_48px_30px] sm:items-end sm:gap-4" key={point.date}>
                <div className="text-sm text-[var(--text-muted)]">
                  {point.date}
                </div>
                <div className="relative h-16 flex-1 rounded-t-[24px] bg-slate-100 dark:bg-slate-900">
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-[24px] bg-gradient-to-t from-brand-500 to-brand-300"
                    style={{
                      height: `${Math.min(100, point.riskScore * 10)}%`,
                    }}
                  />
                </div>
                <div className="text-sm font-semibold sm:text-right">
                  {point.riskScore}
                </div>
                <div className="text-xs text-[var(--text-muted)] sm:text-right">
                  {index === result.statistics.history.length - 1 ? "Now" : ""}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
