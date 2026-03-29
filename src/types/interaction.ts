export type EvidenceLevel = "High" | "Medium" | "Low";
export type Severity = "High" | "Moderate" | "Low";

export type DrugCatalogItem = {
  id: string;
  name: string;
  commonName: string;
  category: string;
  riskFactors: string[];
};

export type SelectedDrug = {
  id: string;
  name: string;   
  dosage: string;
};

export type ReferenceLink = {
  title: string;
  url: string;
  doi?: string;
};

export type InteractionRecord = {
  id: string;
  drugs: string[];
  severity: Severity;
  severityScore: number;
  mechanism: string;
  evidence: EvidenceLevel;
  recommendation: string;
  references?: ReferenceLink[];
};

export type InteractionSummary = {
  riskLevel: Severity;
  riskScore: number;
  summaryText: string;
};

export type InteractionStatistics = {
  bySeverity: Record<Severity, number>;
  history: Array<{
    date: string;
    riskScore: number;
  }>;
};

export type InteractionResponse = {
  query: {
    drugs: SelectedDrug[];
    timestamp: string;
  };
  summary: InteractionSummary;
  interactions: InteractionRecord[];
  statistics: InteractionStatistics;
};

export type SavedCheck = {
  id: string;
  query: InteractionResponse["query"];
  summary: InteractionResponse["summary"];
};
