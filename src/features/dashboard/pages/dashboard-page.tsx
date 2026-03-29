import { BrainCircuit, ClipboardList, FileSearch, Stethoscope } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { drugCatalog, quickPresets } from "@/data/drug-catalog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { downloadFile } from "@/lib/utils";
import { ControlPanel } from "@/features/dashboard/components/control-panel";
import { InteractionNetwork } from "@/features/dashboard/components/interaction-network";
import { ResultsOverview } from "@/features/dashboard/components/results-overview";
import { ResultsTable } from "@/features/dashboard/components/results-table";
import { runInteractionCheck } from "@/features/dashboard/services/interaction-service";
import type {
  InteractionResponse,
  SavedCheck,
  SelectedDrug,
} from "@/types/interaction";

const SAVED_CHECKS_KEY = "saferx-saved-checks";

export function DashboardPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedDrugs, setSelectedDrugs] = useState<SelectedDrug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<InteractionResponse | null>(null);
  const [savedChecks, setSavedChecks] = useLocalStorage<SavedCheck[]>(
    SAVED_CHECKS_KEY,
    [],
  );

  const suggestions = drugCatalog.filter((item) => {
    if (!searchText.trim()) {
      return false;
    }

    const query = searchText.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.commonName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  async function handleRunCheck() {
    if (selectedDrugs.length < 2) {
      return;
    }

    setIsLoading(true);

    try {
      const nextResult = await runInteractionCheck(selectedDrugs);
      setResult(nextResult);
      setSavedChecks((currentChecks) => {
        const nextCheck = {
          id: `check-${Date.now()}`,
          query: nextResult.query,
          summary: nextResult.summary,
        };

        return [nextCheck, ...currentChecks].slice(0, 6);
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddDrug(drug: SelectedDrug) {
    setSelectedDrugs((currentDrugs) => {
      if (currentDrugs.some((item) => item.id === drug.id)) {
        return currentDrugs;
      }

      return [...currentDrugs, drug];
    });
  }

  function handleRemoveDrug(id: string) {
    setSelectedDrugs((currentDrugs) =>
      currentDrugs.filter((drug) => drug.id !== id),
    );
  }

  function handleApplyPreset(drugNames: string[]) {
    const nextDrugs = drugNames
      .map((name) =>
        drugCatalog.find((drug) => drug.name.toLowerCase() === name.toLowerCase()),
      )
      .filter((drug): drug is (typeof drugCatalog)[number] => Boolean(drug))
      .map((drug) => ({
        dosage: "",
        id: drug.id,
        name: drug.name,
      }));

    setSelectedDrugs(nextDrugs);
    setSearchText("");
  }

  function handleUseSavedCheck(check: SavedCheck) {
    setSelectedDrugs(check.query.drugs);
    setResult(null);
  }

  function handleExportCsv() {
    if (!result) {
      return;
    }

    const rows = [
      ["drugs", "severity", "evidence", "mechanism", "recommendation"].join(","),
      ...result.interactions.map((interaction) =>
        [
          `"${interaction.drugs.join(" + ")}"`,
          interaction.severity,
          interaction.evidence,
          `"${interaction.mechanism.replaceAll('"', '""')}"`,
          `"${interaction.recommendation.replaceAll('"', '""')}"`,
        ].join(","),
      ),
    ];

    downloadFile("saferx-interactions.csv", rows.join("\n"), "text/csv");
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        description="Review medication combinations, assess interaction severity, and capture safer prescribing decisions in one connected workspace."
        title="Drug Interaction Dashboard"
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(320px,360px)_minmax(0,1fr)]">
        <ControlPanel
          isLoading={isLoading}
          onAddDrug={handleAddDrug}
          onApplyPreset={handleApplyPreset}
          onRemoveDrug={handleRemoveDrug}
          onRunCheck={handleRunCheck}
          onSearchTextChange={setSearchText}
          onUseSavedCheck={handleUseSavedCheck}
          quickPresets={quickPresets}
          savedChecks={savedChecks}
          searchText={searchText}
          selectedDrugs={selectedDrugs}
          suggestions={suggestions.slice(0, 6)}
        />

        <div className="space-y-6">
          <ResultsOverview onExportCsv={handleExportCsv} result={result} />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: ClipboardList,
                title: "Structured review",
                description:
                  "Selected medicines, saved checks, and interaction findings stay organized in one workflow.",
              },
              {
                icon: BrainCircuit,
                title: "Guided decisions",
                description:
                  "Clear recommendations help teams move from detection to the next safe clinical step.",
              },
              {
                icon: Stethoscope,
                title: "Clinical context",
                description:
                  "Severity, evidence, and mechanism stay visible together during every interaction review.",
              },
              {
                icon: FileSearch,
                title: "Shared workflow",
                description:
                  "Saved reviews, exports, and a consistent layout make repeat checks easier across the team.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-950 dark:text-brand-200">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>

          <InteractionNetwork result={result} />
          <ResultsTable result={result} />
        </div>
      </div>
    </div>
  );
}
