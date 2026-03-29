import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { InteractionResponse } from "@/types/interaction";

type ResultsTableProps = {
  result: InteractionResponse | null;
};

export function ResultsTable({ result }: ResultsTableProps) {
  if (!result) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div>
        <h3 className="panel-title">Detailed interactions</h3>
        <p className="muted mt-1">
          Review each interaction with its severity, supporting rationale, and
          recommended action.
        </p>
      </div>

      <div className="mt-6 space-y-4 md:hidden">
        {result.interactions.map((interaction) => (
          <div
            className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800"
            key={interaction.id}
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={interaction.severity}>{interaction.severity}</Badge>
              <span className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {interaction.evidence} evidence
              </span>
            </div>
            <p className="mt-3 text-base font-semibold">
              {interaction.drugs.join(" + ")}
            </p>
            <div className="mt-4 space-y-3 text-sm text-[var(--text-muted)]">
              <div>
                <p className="font-medium text-[var(--text-main)]">Mechanism</p>
                <p className="mt-1 leading-6">{interaction.mechanism}</p>
              </div>
              <div>
                <p className="font-medium text-[var(--text-main)]">Recommendation</p>
                <p className="mt-1 leading-6">{interaction.recommendation}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 hidden overflow-x-auto md:block">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800">
              <th className="pb-3 pr-4 font-semibold">Drugs</th>
              <th className="pb-3 pr-4 font-semibold">Severity</th>
              <th className="pb-3 pr-4 font-semibold">Evidence</th>
              <th className="pb-3 pr-4 font-semibold">Mechanism</th>
              <th className="pb-3 font-semibold">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            {result.interactions.map((interaction) => (
              <tr
                className="border-b border-slate-100 align-top dark:border-slate-900"
                key={interaction.id}
              >
                <td className="py-4 pr-4 font-medium">
                  {interaction.drugs.join(" + ")}
                </td>
                <td className="py-4 pr-4">
                  <Badge tone={interaction.severity}>{interaction.severity}</Badge>
                </td>
                <td className="py-4 pr-4 text-[var(--text-muted)]">
                  {interaction.evidence}
                </td>
                <td className="py-4 pr-4 text-[var(--text-muted)]">
                  {interaction.mechanism}
                </td>
                <td className="py-4 text-[var(--text-muted)]">
                  {interaction.recommendation}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
