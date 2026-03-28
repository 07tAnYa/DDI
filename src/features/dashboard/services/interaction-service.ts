import { drugCatalog } from "@/data/drug-catalog";
import type {
  InteractionRecord,
  InteractionResponse,
  SelectedDrug,
  Severity,
} from "@/types/interaction";

type InteractionTemplate = {
  pair: [string, string];
  severity: Severity;
  severityScore: number;
  mechanism: string;
  evidence: "High" | "Medium" | "Low";
  recommendation: string;
};

function createPairKey(a: string, b: string) {
  return [a, b].sort().join("::");
}

const knownInteractions: InteractionTemplate[] = [
  {
    pair: ["paroxetine", "tramadol"],
    severity: "High",
    severityScore: 9,
    mechanism:
      "Both agents increase serotonin signaling and can elevate the risk of serotonin syndrome.",
    evidence: "High",
    recommendation:
      "Avoid the combination when possible or use a different analgesic with close clinical follow-up.",
  },
  {
    pair: ["sertraline", "tramadol"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Concurrent serotonergic activity increases the chance of serotonin toxicity and central nervous system effects.",
    evidence: "High",
    recommendation:
      "Use an alternative analgesic strategy or monitor carefully for agitation, tremor, or autonomic changes.",
  },
  {
    pair: ["duloxetine", "tramadol"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "The SNRI and opioid combination can amplify serotonergic and sedative adverse effects.",
    evidence: "High",
    recommendation:
      "Consider a non-serotonergic pain option and review the patient closely if co-administration is necessary.",
  },
  {
    pair: ["ibuprofen", "aspirin"],
    severity: "Moderate",
    severityScore: 5,
    mechanism:
      "Additive antiplatelet and gastrointestinal effects can increase bleeding concerns.",
    evidence: "Medium",
    recommendation:
      "Use with caution and monitor bleeding risk, especially around procedures or in high-risk patients.",
  },
  {
    pair: ["naproxen", "aspirin"],
    severity: "Moderate",
    severityScore: 5,
    mechanism:
      "Combined NSAID and antiplatelet exposure increases gastrointestinal and bleeding risk.",
    evidence: "Medium",
    recommendation:
      "Avoid prolonged overlap when possible and review gastroprotection needs for vulnerable patients.",
  },
  {
    pair: ["warfarin", "aspirin"],
    severity: "High",
    severityScore: 9,
    mechanism:
      "Dual anticoagulant and antiplatelet activity sharply raises bleeding risk.",
    evidence: "High",
    recommendation:
      "Avoid routine co-administration unless clinically justified and supported by close monitoring.",
  },
  {
    pair: ["warfarin", "ibuprofen"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "NSAID exposure increases bleeding risk and can destabilize anticoagulation in a patient taking warfarin.",
    evidence: "High",
    recommendation:
      "Prefer alternative pain control and monitor coagulation status if the pair cannot be avoided.",
  },
  {
    pair: ["warfarin", "amoxicillin"],
    severity: "Moderate",
    severityScore: 6,
    mechanism:
      "Antibiotic therapy may alter gut flora and increase the anticoagulant response to warfarin.",
    evidence: "Medium",
    recommendation:
      "Review INR trends and counsel the patient on bleeding symptoms during and after treatment.",
  },
  {
    pair: ["apixaban", "aspirin"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Combined anticoagulant and antiplatelet action substantially increases bleeding liability.",
    evidence: "High",
    recommendation:
      "Reserve the combination for clear clinical indications and reinforce bleeding precautions.",
  },
  {
    pair: ["apixaban", "ibuprofen"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "NSAID-associated bleeding risk compounds the anticoagulant effect of apixaban.",
    evidence: "High",
    recommendation:
      "Use a safer analgesic where possible and escalate monitoring if short-term overlap is required.",
  },
  {
    pair: ["clopidogrel", "omeprazole"],
    severity: "Moderate",
    severityScore: 5,
    mechanism:
      "Omeprazole may reduce the metabolic activation of clopidogrel and weaken antiplatelet effect.",
    evidence: "Medium",
    recommendation:
      "Consider an alternative acid-suppression strategy if antiplatelet response is critical.",
  },
  {
    pair: ["simvastatin", "ciprofloxacin"],
    severity: "Moderate",
    severityScore: 5,
    mechanism:
      "Antibiotic exposure may increase statin levels and the risk of muscle toxicity.",
    evidence: "Medium",
    recommendation:
      "Monitor for muscle pain or weakness and consider a temporary statin review if symptoms appear.",
  },
  {
    pair: ["simvastatin", "clarithromycin"],
    severity: "High",
    severityScore: 9,
    mechanism:
      "Strong CYP inhibition can sharply increase simvastatin exposure and elevate rhabdomyolysis risk.",
    evidence: "High",
    recommendation:
      "Avoid the combination or hold simvastatin while clarithromycin therapy is active when appropriate.",
  },
  {
    pair: ["fluconazole", "simvastatin"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Antifungal-driven CYP inhibition can raise simvastatin levels and increase muscle toxicity.",
    evidence: "High",
    recommendation:
      "Pause or substitute the statin if clinically feasible and review for myopathy symptoms.",
  },
  {
    pair: ["fluconazole", "warfarin"],
    severity: "High",
    severityScore: 9,
    mechanism:
      "Fluconazole can potentiate warfarin activity and significantly increase INR and bleeding risk.",
    evidence: "High",
    recommendation:
      "Tighten INR monitoring and consider dose adjustment or an alternative antifungal when possible.",
  },
  {
    pair: ["amiodarone", "warfarin"],
    severity: "High",
    severityScore: 9,
    mechanism:
      "Amiodarone can increase warfarin exposure and raise the risk of excessive anticoagulation.",
    evidence: "High",
    recommendation:
      "Initiate enhanced INR monitoring and anticipate the need for a warfarin dose review.",
  },
  {
    pair: ["amiodarone", "digoxin"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Amiodarone can increase digoxin exposure, heightening bradycardia and digoxin toxicity risk.",
    evidence: "High",
    recommendation:
      "Review digoxin dosing and monitor for conduction changes or toxicity symptoms.",
  },
  {
    pair: ["metoprolol", "amiodarone"],
    severity: "Moderate",
    severityScore: 6,
    mechanism:
      "Additive AV-node suppression can promote bradycardia, hypotension, or conduction delay.",
    evidence: "Medium",
    recommendation:
      "Monitor pulse, blood pressure, and ECG findings when the combination is clinically required.",
  },
  {
    pair: ["clarithromycin", "digoxin"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Macrolide exposure can increase digoxin concentrations and trigger toxicity or rhythm disturbance.",
    evidence: "High",
    recommendation:
      "Watch for digoxin toxicity and consider an alternative antibiotic when possible.",
  },
  {
    pair: ["ciprofloxacin", "ondansetron"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Both agents can prolong QT interval and increase the risk of ventricular arrhythmia.",
    evidence: "High",
    recommendation:
      "Avoid in high-risk patients or monitor ECG and electrolyte status if combined.",
  },
  {
    pair: ["escitalopram", "ondansetron"],
    severity: "High",
    severityScore: 8,
    mechanism:
      "Combined QT-prolonging potential may raise arrhythmia risk, especially with other predisposing factors.",
    evidence: "High",
    recommendation:
      "Review ECG risk, correct electrolytes, and consider a non-QT-prolonging alternative if appropriate.",
  },
  {
    pair: ["clarithromycin", "amiodarone"],
    severity: "High",
    severityScore: 9,
    mechanism:
      "Two QT-prolonging agents together can significantly increase the risk of dangerous rhythm abnormalities.",
    evidence: "High",
    recommendation:
      "Avoid the combination when possible and escalate cardiac monitoring if unavoidable.",
  },
  {
    pair: ["lisinopril", "spironolactone"],
    severity: "High",
    severityScore: 7,
    mechanism:
      "Concurrent potassium-retaining effects can precipitate hyperkalemia and worsen renal function.",
    evidence: "High",
    recommendation:
      "Check potassium and renal function promptly and review whether dual RAAS impact is necessary.",
  },
  {
    pair: ["losartan", "potassium-chloride"],
    severity: "High",
    severityScore: 7,
    mechanism:
      "Potassium supplementation alongside RAAS blockade increases the risk of clinically important hyperkalemia.",
    evidence: "High",
    recommendation:
      "Avoid routine overlap unless potassium replacement is clearly needed and laboratory monitoring is in place.",
  },
  {
    pair: ["glipizide", "ciprofloxacin"],
    severity: "Moderate",
    severityScore: 6,
    mechanism:
      "Fluoroquinolones can destabilize glucose control and increase the risk of sulfonylurea-related hypoglycemia.",
    evidence: "Medium",
    recommendation:
      "Increase glucose monitoring and counsel the patient on early hypoglycemia symptoms.",
  },
];

const knownInteractionMap = new Map(
  knownInteractions.map((interaction) => [
    createPairKey(interaction.pair[0], interaction.pair[1]),
    interaction,
  ]),
);

function getCatalogDrug(id: string) {
  return drugCatalog.find((drug) => drug.id === id);
}

function inferInteraction(a: SelectedDrug, b: SelectedDrug): InteractionRecord {
  const known = knownInteractionMap.get(createPairKey(a.id, b.id));

  if (known) {
    return {
      id: `${a.id}-${b.id}`,
      drugs: [a.name, b.name],
      severity: known.severity,
      severityScore: known.severityScore,
      mechanism: known.mechanism,
      evidence: known.evidence,
      recommendation: known.recommendation,
    };
  }

  const catalogA = getCatalogDrug(a.id);
  const catalogB = getCatalogDrug(b.id);
  const sharedFactors = (catalogA?.riskFactors ?? []).filter((factor) =>
    catalogB?.riskFactors.includes(factor),
  );

  if (sharedFactors.length) {
    return {
      id: `${a.id}-${b.id}`,
      drugs: [a.name, b.name],
      severity: "Moderate",
      severityScore: 4,
      mechanism: `Shared risk factors detected: ${sharedFactors.join(", ")}.`,
      evidence: "Low",
      recommendation:
        "Review overlapping risk factors and monitor the patient with extra caution.",
    };
  }

  return {
    id: `${a.id}-${b.id}`,
    drugs: [a.name, b.name],
    severity: "Low",
    severityScore: 2,
    mechanism:
      "No high-confidence issue was detected in the current interaction library for this pair.",
    evidence: "Low",
    recommendation: "Proceed with standard monitoring and confirm with a clinician.",
  };
}

export async function runInteractionCheck(
  selectedDrugs: SelectedDrug[],
): Promise<InteractionResponse> {
  const interactions: InteractionRecord[] = [];

  for (let firstIndex = 0; firstIndex < selectedDrugs.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < selectedDrugs.length;
      secondIndex += 1
    ) {
      interactions.push(
        inferInteraction(selectedDrugs[firstIndex], selectedDrugs[secondIndex]),
      );
    }
  }

  const bySeverity = {
    High: interactions.filter((item) => item.severity === "High").length,
    Moderate: interactions.filter((item) => item.severity === "Moderate").length,
    Low: interactions.filter((item) => item.severity === "Low").length,
  };

  const riskLevel: Severity =
    bySeverity.High > 0 ? "High" : bySeverity.Moderate > 0 ? "Moderate" : "Low";
  const weightedScore =
    bySeverity.High * 9 + bySeverity.Moderate * 5 + bySeverity.Low * 2;

  await new Promise((resolve) => window.setTimeout(resolve, 700));

  return {
    query: {
      drugs: selectedDrugs,
      timestamp: new Date().toISOString(),
    },
    summary: {
      riskLevel,
      riskScore: Number(
        (weightedScore / Math.max(1, selectedDrugs.length)).toFixed(1),
      ),
      summaryText:
        riskLevel === "High"
          ? "High-priority combinations were detected. Review the recommendations before proceeding."
          : riskLevel === "Moderate"
            ? "Some combinations warrant monitoring and clinician review."
            : "No major interactions were flagged in the current review.",
    },
    interactions,
    statistics: {
      bySeverity,
      history: [
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21)
            .toISOString()
            .slice(0, 10),
          riskScore: 4.2,
        },
        {
          date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10)
            .toISOString()
            .slice(0, 10),
          riskScore: 5.1,
        },
        {
          date: new Date().toISOString().slice(0, 10),
          riskScore: Number(
            (weightedScore / Math.max(1, selectedDrugs.length)).toFixed(1),
          ),
        },
      ],
    },
  };
}
