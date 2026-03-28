import { ChevronDown, Plus, Search, Sparkles, X } from "lucide-react";
import {
  type KeyboardEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DrugCatalogItem, SavedCheck, SelectedDrug } from "@/types/interaction";

type ControlPanelProps = {
  selectedDrugs: SelectedDrug[];
  searchText: string;
  suggestions: DrugCatalogItem[];
  savedChecks: SavedCheck[];
  onSearchTextChange: (value: string) => void;
  onAddDrug: (drug: SelectedDrug) => void;
  onRemoveDrug: (id: string) => void;
  onApplyPreset: (drugNames: string[]) => void;
  onRunCheck: () => void;
  onUseSavedCheck: (check: SavedCheck) => void;
  isLoading: boolean;
  quickPresets: string[][];
};

export function ControlPanel({
  selectedDrugs,
  searchText,
  suggestions,
  savedChecks,
  onSearchTextChange,
  onAddDrug,
  onRemoveDrug,
  onApplyPreset,
  onRunCheck,
  onUseSavedCheck,
  isLoading,
  quickPresets,
}: ControlPanelProps) {
  const [manualName, setManualName] = useState("");
  const [manualDosage, setManualDosage] = useState("");
  const [presetOpen, setPresetOpen] = useState(false);
  const [presetQuery, setPresetQuery] = useState("");
  const presetRef = useRef<HTMLDivElement | null>(null);
  const presetSearchId = useId();

  const featuredPresets = quickPresets.slice(0, 3);
  const filteredPresets = quickPresets.filter((preset) =>
    preset.join(" ").toLowerCase().includes(presetQuery.trim().toLowerCase()),
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!presetRef.current?.contains(event.target as Node)) {
        setPresetOpen(false);
      }
    }

    if (!presetOpen) {
      return undefined;
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [presetOpen]);

  function handleManualAdd() {
    const nextName = manualName.trim();
    const nextDosage = manualDosage.trim();

    if (!nextName) {
      return;
    }

    onAddDrug({
      dosage: nextDosage,
      id: `manual-${nextName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: nextName,
    });

    setManualName("");
    setManualDosage("");
  }

  function handleManualKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleManualAdd();
    }
  }

  function handlePresetSelect(preset: string[]) {
    onApplyPreset(preset);
    setPresetOpen(false);
    setPresetQuery("");
  }

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 sm:text-sm sm:tracking-[0.22em]">
              Check interactions
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
              Build a medication set
            </h2>
          </div>
          <div className="rounded-2xl bg-brand-50 p-2 text-brand-600 dark:bg-brand-950 dark:text-brand-200">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Search the catalog
            </span>
            <div className="group rounded-2xl border border-slate-200 bg-white px-3 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:bg-[var(--secondary)] focus-within:shadow-[0_0_0_3px_rgba(74,91,170,0.12)] dark:border-slate-700 dark:bg-slate-900">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-[var(--text-muted)] transition-colors duration-200 group-focus-within:text-[var(--primary)]" />
                <input
                  className="w-full bg-transparent py-3 text-sm focus-visible:shadow-none"
                  onChange={(event) => onSearchTextChange(event.target.value)}
                  placeholder="Type a drug name, e.g. Warfarin"
                  value={searchText}
                />
              </div>
            </div>
          </label>

          {searchText && suggestions.length ? (
            <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
              {suggestions.map((item) => (
                <button
                  className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left transition hover:bg-brand-50 dark:hover:bg-slate-800"
                  key={item.id}
                  onClick={() => {
                    onAddDrug({ dosage: "", id: item.id, name: item.name });
                    onSearchTextChange("");
                  }}
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      {item.category}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-brand-500" />
                </button>
              ))}
            </div>
          ) : null}

          <div>
            <span className="mb-2 block text-sm font-medium">Selected drugs</span>
            <div className="flex min-h-20 flex-wrap gap-2 rounded-3xl border border-dashed border-slate-300 p-3 dark:border-slate-700">
              {selectedDrugs.length ? (
                selectedDrugs.map((drug) => (
                  <div
                    className="inline-flex max-w-full items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm dark:bg-slate-900"
                    key={drug.id}
                  >
                    <div className="min-w-0">
                      <span className="block truncate font-medium">{drug.name}</span>
                      {drug.dosage ? (
                        <span className="block text-xs text-[var(--text-muted)]">
                          {drug.dosage}
                        </span>
                      ) : null}
                    </div>
                    <button
                      aria-label={`Remove ${drug.name}`}
                      onClick={() => onRemoveDrug(drug.id)}
                      title={`Remove ${drug.name}`}
                      type="button"
                    >
                      <X className="h-4 w-4 text-[var(--text-muted)]" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  Add at least two medicines before running a check.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_140px]">
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setManualName(event.target.value)}
              onKeyDown={handleManualKeyDown}
              placeholder="Manual drug entry"
              value={manualName}
            />
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              onChange={(event) => setManualDosage(event.target.value)}
              onKeyDown={handleManualKeyDown}
              placeholder="Dosage"
              value={manualDosage}
            />
          </div>

          <Button
            className="w-full justify-center"
            disabled={!manualName.trim()}
            onClick={handleManualAdd}
            variant="secondary"
          >
            <Plus className="h-4 w-4" />
            Add manual entry
          </Button>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="block text-sm font-medium">Preset combinations</span>
              <span
                className="rounded-full border px-2.5 py-1 text-xs font-semibold"
                style={{
                  backgroundColor: "var(--secondary)",
                  color: "var(--primary)",
                  borderColor: "var(--border)",
                }}
              >
                {quickPresets.length} pairs
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {featuredPresets.map((preset) => (
                <button
                  className="max-w-full rounded-full border px-3 py-2 text-left text-sm font-semibold transition hover:opacity-90"
                  key={`featured-${preset.join("-")}`}
                  onClick={() => handlePresetSelect(preset)}
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--primary)",
                    borderColor: "var(--border)",
                  }}
                  type="button"
                >
                  {preset.join(" + ")}
                </button>
              ))}
            </div>
            <div className="relative mt-3" ref={presetRef}>
              <button
                aria-controls={presetSearchId}
                aria-expanded={presetOpen}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm transition hover:border-[var(--primary)] dark:border-slate-700 dark:bg-slate-900"
                onClick={() => setPresetOpen((currentValue) => !currentValue)}
                type="button"
              >
                <div>
                  <span className="block font-medium text-[var(--text-main)]">
                    Browse all preset pairs
                  </span>
                  <span className="mt-1 block text-xs text-[var(--text-muted)]">
                    Search and select from all {quickPresets.length} curated combinations
                  </span>
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-[var(--text-muted)] transition-transform duration-200",
                    presetOpen && "rotate-180",
                  )}
                />
              </button>

              {presetOpen ? (
                <div
                  className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-20 rounded-3xl border border-slate-200 bg-white p-3 shadow-[0_24px_50px_rgba(15,23,42,0.12)] dark:border-slate-700 dark:bg-slate-950"
                  id={presetSearchId}
                >
                  <div className="group rounded-2xl border border-slate-200 bg-white px-3 transition-all duration-200 focus-within:border-[var(--primary)] focus-within:bg-[var(--secondary)] focus-within:shadow-[0_0_0_3px_rgba(74,91,170,0.12)] dark:border-slate-700 dark:bg-slate-900">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-[var(--text-muted)] transition-colors duration-200 group-focus-within:text-[var(--primary)]" />
                      <input
                        className="w-full bg-transparent py-3 text-sm focus-visible:shadow-none"
                        onChange={(event) => setPresetQuery(event.target.value)}
                        placeholder="Search preset pairs"
                        value={presetQuery}
                      />
                    </div>
                  </div>

                  <div className="mt-3 max-h-72 space-y-1 overflow-y-auto pr-1">
                    {filteredPresets.length ? (
                      filteredPresets.map((preset) => (
                        <button
                          className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-brand-50 dark:hover:bg-slate-900"
                          key={`preset-${preset.join("-")}`}
                          onClick={() => handlePresetSelect(preset)}
                          type="button"
                        >
                          <div>
                            <p className="text-sm font-medium text-[var(--text-main)]">
                              {preset.join(" + ")}
                            </p>
                            <p className="mt-1 text-xs text-[var(--text-muted)]">
                              Curated interaction scenario
                            </p>
                          </div>
                          <Plus className="h-4 w-4 text-brand-500" />
                        </button>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center dark:border-slate-700">
                        <p className="text-sm font-medium text-[var(--text-main)]">
                          No preset matches
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          Try another drug name or interaction type.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
              Use the quick picks for common checks, or open the searchable
              dropdown to browse the full preset library.
            </p>
          </div>

          <Button
            className="w-full justify-center"
            disabled={selectedDrugs.length < 2 || isLoading}
            onClick={onRunCheck}
          >
            {isLoading ? "Running check..." : "Run interaction check"}
          </Button>
        </div>
      </Card>

      <Card>
        <h3 className="panel-title">Saved checks</h3>
        <p className="muted mt-2">
          Recently saved combinations stay in local storage for quick reruns.
        </p>
        <div className="mt-4 space-y-3">
          {savedChecks.length ? (
            savedChecks.map((check) => (
              <button
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-left transition hover:border-brand-300 hover:bg-brand-50 dark:border-slate-700 dark:hover:bg-slate-900"
                key={check.id}
                onClick={() => onUseSavedCheck(check)}
              >
                <p className="text-sm font-medium break-words">
                  {check.query.drugs.map((drug) => drug.name).join(", ")}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Risk: {check.summary.riskLevel}
                </p>
              </button>
            ))
          ) : (
            <p className="text-sm text-[var(--text-muted)]">
              No saved checks yet. Run a few combinations and they will appear
              here.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
