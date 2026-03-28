import { Card } from "@/components/ui/card";
import type {
  InteractionRecord,
  InteractionResponse,
  Severity,
} from "@/types/interaction";

type InteractionNetworkProps = {
  result: InteractionResponse | null;
};

type ThemeKey =
  | "serotonin"
  | "bleeding"
  | "cardiac"
  | "electrolyte"
  | "metabolic"
  | "general";

type GraphNode = {
  id: string;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  radius: number;
  depth: number;
  severity: Severity;
};

type GraphEdge = {
  id: string;
  path: string;
  shadowPath: string;
  severity: Severity;
  strokeWidth: number;
};

const severityRank: Record<Severity, number> = {
  High: 3,
  Moderate: 2,
  Low: 1,
};

const nodeStyle = {
  High: {
    gradientId: "node-high",
    glow: "rgba(249, 115, 22, 0.30)",
  },
  Moderate: {
    gradientId: "node-moderate",
    glow: "rgba(245, 158, 11, 0.26)",
  },
  Low: {
    gradientId: "node-low",
    glow: "rgba(74, 91, 170, 0.24)",
  },
} satisfies Record<Severity, { gradientId: string; glow: string }>;

const themeStyle = {
  serotonin: {
    label: "Serotonin risk",
    accent: "#8b5cf6",
    edgeHigh: "#8b5cf6",
    edgeModerate: "#a78bfa",
    edgeLow: "#c4b5fd",
    surface: "rgba(139, 92, 246, 0.18)",
  },
  bleeding: {
    label: "Bleeding risk",
    accent: "#ef4444",
    edgeHigh: "#ef4444",
    edgeModerate: "#fb7185",
    edgeLow: "#fca5a5",
    surface: "rgba(239, 68, 68, 0.16)",
  },
  cardiac: {
    label: "Cardiac rhythm risk",
    accent: "#f97316",
    edgeHigh: "#f97316",
    edgeModerate: "#fb923c",
    edgeLow: "#fdba74",
    surface: "rgba(249, 115, 22, 0.16)",
  },
  electrolyte: {
    label: "Electrolyte risk",
    accent: "#14b8a6",
    edgeHigh: "#14b8a6",
    edgeModerate: "#2dd4bf",
    edgeLow: "#99f6e4",
    surface: "rgba(20, 184, 166, 0.16)",
  },
  metabolic: {
    label: "Metabolic risk",
    accent: "#2563eb",
    edgeHigh: "#2563eb",
    edgeModerate: "#60a5fa",
    edgeLow: "#93c5fd",
    surface: "rgba(37, 99, 235, 0.16)",
  },
  general: {
    label: "Interaction overview",
    accent: "#4a5baa",
    edgeHigh: "#4a5baa",
    edgeModerate: "#6d7de0",
    edgeLow: "#b3c0ff",
    surface: "rgba(74, 91, 170, 0.16)",
  },
} satisfies Record<
  ThemeKey,
  {
    label: string;
    accent: string;
    edgeHigh: string;
    edgeModerate: string;
    edgeLow: string;
    surface: string;
  }
>;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function getShortLabel(label: string) {
  const [firstWord] = label.split(" ");
  return firstWord.length > 10 ? `${firstWord.slice(0, 9)}.` : firstWord;
}

function getInteractionTheme(interaction: InteractionRecord): ThemeKey {
  const haystack = `${interaction.mechanism} ${interaction.recommendation}`.toLowerCase();

  if (/(serotonin|sedat|agitation|tremor|cns)/.test(haystack)) {
    return "serotonin";
  }

  if (/(bleed|anticoagul|antiplatelet|inr)/.test(haystack)) {
    return "bleeding";
  }

  if (/(qt|arrhythm|ecg|bradycard|conduction|digoxin)/.test(haystack)) {
    return "cardiac";
  }

  if (/(potassium|renal|hyperkalemia)/.test(haystack)) {
    return "electrolyte";
  }

  if (/(cyp|statin|muscle|glucose|glycemic|hypoglycemia|metabolic)/.test(haystack)) {
    return "metabolic";
  }

  return "general";
}

function getEdgeColor(severity: Severity, theme: ThemeKey) {
  const palette = themeStyle[theme];

  if (severity === "High") {
    return palette.edgeHigh;
  }

  if (severity === "Moderate") {
    return palette.edgeModerate;
  }

  return palette.edgeLow;
}

function renderThemeDecoration(
  theme: ThemeKey,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  pairMode: boolean,
) {
  const stroke = themeStyle[theme].surface;

  switch (theme) {
    case "serotonin":
      return (
        <>
          <path
            d={`M ${centerX - 250} ${centerY - 18} C ${centerX - 170} ${centerY - 92} ${centerX - 60} ${centerY + 72} ${centerX + 12} ${centerY - 8} S ${centerX + 172} ${centerY - 94} ${centerX + 250} ${centerY - 16}`}
            fill="none"
            opacity="0.9"
            stroke={stroke}
            strokeLinecap="round"
            strokeWidth="16"
          />
          <path
            d={`M ${centerX - 230} ${centerY + 54} C ${centerX - 146} ${centerY + 128} ${centerX - 20} ${centerY - 36} ${centerX + 88} ${centerY + 52} S ${centerX + 198} ${centerY + 126} ${centerX + 246} ${centerY + 42}`}
            fill="none"
            opacity="0.65"
            stroke={stroke}
            strokeLinecap="round"
            strokeWidth="10"
          />
        </>
      );

    case "bleeding":
      return (
        <>
          <ellipse
            cx={centerX}
            cy={centerY + 68}
            fill="none"
            opacity="0.88"
            rx={pairMode ? 178 : 240}
            ry={pairMode ? 68 : 98}
            stroke={stroke}
            strokeWidth="16"
          />
          <ellipse
            cx={centerX}
            cy={centerY + 68}
            fill="none"
            opacity="0.52"
            rx={pairMode ? 132 : 192}
            ry={pairMode ? 42 : 72}
            stroke={stroke}
            strokeWidth="10"
          />
        </>
      );

    case "cardiac":
      return (
        <polyline
          fill="none"
          opacity="0.82"
          points={`${centerX - 250},${centerY + 24} ${centerX - 174},${centerY + 24} ${centerX - 132},${centerY + 8} ${centerX - 86},${centerY + 46} ${centerX - 20},${centerY - 108} ${centerX + 32},${centerY + 74} ${centerX + 88},${centerY - 10} ${centerX + 148},${centerY + 24} ${centerX + 250},${centerY + 24}`}
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="14"
        />
      );

    case "electrolyte":
      return (
        <>
          <path
            d={`M ${centerX} ${centerY - 150} L ${centerX + 168} ${centerY} L ${centerX} ${centerY + 150} L ${centerX - 168} ${centerY} Z`}
            fill="none"
            opacity="0.84"
            stroke={stroke}
            strokeWidth="14"
          />
          <path
            d={`M ${centerX} ${centerY - 102} L ${centerX + 112} ${centerY} L ${centerX} ${centerY + 102} L ${centerX - 112} ${centerY} Z`}
            fill="none"
            opacity="0.56"
            stroke={stroke}
            strokeWidth="10"
          />
        </>
      );

    case "metabolic":
      return (
        <>
          <ellipse
            cx={centerX}
            cy={centerY + 52}
            fill="none"
            opacity="0.84"
            rx={pairMode ? 188 : 244}
            ry={pairMode ? 82 : 118}
            stroke={stroke}
            strokeDasharray="18 16"
            strokeWidth="12"
          />
          <ellipse
            cx={centerX}
            cy={centerY + 52}
            fill="none"
            opacity="0.56"
            rx={pairMode ? 124 : 176}
            ry={pairMode ? 50 : 76}
            stroke={stroke}
            strokeDasharray="10 12"
            strokeWidth="8"
          />
        </>
      );

    default:
      return (
        <>
          <ellipse
            cx={centerX}
            cy={height / 2 + 82}
            fill="none"
            opacity="0.72"
            rx={pairMode ? 172 : 234}
            ry={pairMode ? 64 : 94}
            stroke={stroke}
            strokeDasharray="12 12"
            strokeWidth="10"
          />
          <ellipse
            cx={centerX}
            cy={height / 2 + 82}
            fill="none"
            opacity="0.42"
            rx={pairMode ? 128 : 186}
            ry={pairMode ? 42 : 70}
            stroke={stroke}
            strokeDasharray="8 10"
            strokeWidth="6"
          />
        </>
      );
  }
}

function buildPairGraph(
  result: InteractionResponse,
  dominantInteraction: InteractionRecord,
  centerX: number,
  centerY: number,
) {
  const theme = getInteractionTheme(dominantInteraction);
  const seed = hashString(
    `${dominantInteraction.id}:${dominantInteraction.mechanism}:${dominantInteraction.severity}`,
  );
  const palette = themeStyle[theme];
  const spread = 238 + (seed % 44);
  const jitter = ((seed >> 3) % 36) - 18;
  const arch = 102 + ((seed >> 5) % 54);
  const echoDepth = 62 + ((seed >> 7) % 46);

  const themeOffsets: Record<
    ThemeKey,
    { leftY: number; rightY: number; lift: number; sweep: number }
  > = {
    serotonin: { leftY: 34, rightY: -30, lift: 18, sweep: 54 },
    bleeding: { leftY: 8, rightY: -8, lift: 42, sweep: 16 },
    cardiac: { leftY: 42, rightY: -44, lift: 8, sweep: 72 },
    electrolyte: { leftY: 20, rightY: 20, lift: 20, sweep: 24 },
    metabolic: { leftY: -12, rightY: 28, lift: 28, sweep: 36 },
    general: { leftY: 16, rightY: -10, lift: 22, sweep: 28 },
  };

  const offsets = themeOffsets[theme];
  const leftX = centerX - spread / 2;
  const rightX = centerX + spread / 2;
  const leftY = centerY + offsets.leftY + jitter;
  const rightY = centerY + offsets.rightY - jitter * 0.6;
  const controlTopX = centerX + offsets.sweep;
  const controlTopY = centerY - arch - offsets.lift;
  const controlBottomX = centerX - offsets.sweep * 0.7;
  const controlBottomY = centerY + echoDepth + offsets.lift;

  const nodeStats = new Map<string, Severity>();
  result.query.drugs.forEach((drug) => nodeStats.set(drug.name, "Low"));
  dominantInteraction.drugs.forEach((drugName) =>
    nodeStats.set(drugName, dominantInteraction.severity),
  );

  const nodes: GraphNode[] = result.query.drugs.map((drug, index) => {
    const severity = nodeStats.get(drug.name) ?? "Low";

    return {
      id: drug.id,
      label: drug.name,
      shortLabel: getShortLabel(drug.name),
      x: index === 0 ? leftX : rightX,
      y: index === 0 ? leftY : rightY,
      radius: 34 + severityRank[severity] * 5 + (index === 0 ? 2 : 0),
      depth: index === 0 ? 0.4 : 0.8,
      severity,
    };
  });

  const primaryColor = getEdgeColor(dominantInteraction.severity, theme);
  const edges: GraphEdge[] = [
    {
      id: `${dominantInteraction.id}-primary`,
      path: `M ${leftX} ${leftY} C ${centerX - 44} ${controlTopY} ${controlTopX} ${controlTopY} ${rightX} ${rightY}`,
      shadowPath: `M ${leftX} ${leftY + 7} C ${centerX - 38} ${controlTopY + 12} ${controlTopX} ${controlTopY + 14} ${rightX} ${rightY + 7}`,
      severity: dominantInteraction.severity,
      strokeWidth:
        dominantInteraction.severity === "High"
          ? 9
          : dominantInteraction.severity === "Moderate"
            ? 7
            : 6,
    },
    {
      id: `${dominantInteraction.id}-echo`,
      path: `M ${leftX} ${leftY} C ${centerX - 24} ${controlBottomY} ${controlBottomX} ${controlBottomY} ${rightX} ${rightY}`,
      shadowPath: `M ${leftX} ${leftY + 4} C ${centerX - 12} ${controlBottomY + 8} ${controlBottomX} ${controlBottomY + 8} ${rightX} ${rightY + 4}`,
      severity: dominantInteraction.severity,
      strokeWidth:
        dominantInteraction.severity === "High"
          ? 6
          : dominantInteraction.severity === "Moderate"
            ? 5
            : 4,
    },
  ];

  return {
    theme,
    edges: edges.map((edge) => ({
      ...edge,
      path: edge.path,
      shadowPath: edge.shadowPath,
      severity: edge.severity,
      strokeWidth: edge.strokeWidth,
      color: primaryColor,
    })),
    nodes,
    themeLabel: palette.label,
  };
}

function buildMultiGraph(
  result: InteractionResponse,
  centerX: number,
  centerY: number,
) {
  const dominantInteraction = [...result.interactions].sort(
    (first, second) => second.severityScore - first.severityScore,
  )[0];
  const theme = dominantInteraction
    ? getInteractionTheme(dominantInteraction)
    : "general";
  const seed = hashString(
    result.query.drugs.map((drug) => drug.id).join("::") +
      result.interactions.map((interaction) => interaction.id).join("::"),
  );
  const startAngle = -Math.PI / 2 + (((seed % 140) - 70) * Math.PI) / 720;
  const orbitX = 188 + result.query.drugs.length * 10 + ((seed >> 4) % 26);
  const orbitY = 96 + result.query.drugs.length * 5 + ((seed >> 7) % 18);
  const nodeStats = new Map<string, { degree: number; severity: Severity }>();

  result.query.drugs.forEach((drug) => {
    nodeStats.set(drug.name, { degree: 0, severity: "Low" });
  });

  result.interactions.forEach((interaction) => {
    interaction.drugs.forEach((drugName) => {
      const current = nodeStats.get(drugName);

      if (!current) {
        return;
      }

      nodeStats.set(drugName, {
        degree: current.degree + 1,
        severity:
          severityRank[interaction.severity] > severityRank[current.severity]
            ? interaction.severity
            : current.severity,
      });
    });
  });

  const nodes: GraphNode[] = result.query.drugs.map((drug, index, items) => {
    const localSeed = hashString(drug.id);
    const angleJitter = ((((localSeed % 28) - 14) * Math.PI) / 180) * 0.45;
    const angle = startAngle + (Math.PI * 2 * index) / items.length + angleJitter;
    const depth = (Math.sin(angle) + 1) / 2;
    const stats = nodeStats.get(drug.name) ?? { degree: 0, severity: "Low" as Severity };

    return {
      id: drug.id,
      label: drug.name,
      shortLabel: getShortLabel(drug.name),
      x: centerX + Math.cos(angle) * orbitX,
      y: centerY + Math.sin(angle) * orbitY,
      radius: 28 + stats.degree * 5 + depth * 5,
      depth,
      severity: stats.severity,
    };
  });

  const nodeLookup = new Map(nodes.map((node) => [node.label, node]));
  const edges: GraphEdge[] = result.interactions.flatMap((interaction) => {
    const from = nodeLookup.get(interaction.drugs[0]);
    const to = nodeLookup.get(interaction.drugs[1]);

    if (!from || !to) {
      return [];
    }

    const localSeed = hashString(interaction.id);
    const distance = Math.hypot(from.x - to.x, from.y - to.y);
    const controlX = (from.x + to.x) / 2 + (((localSeed % 120) - 60) * 0.45);
    const controlY =
      Math.min(from.y, to.y) -
      Math.max(56, 142 - distance / 2.6) -
      ((localSeed >> 5) % 28);

    return [
      {
        id: interaction.id,
        path: `M ${from.x} ${from.y} Q ${controlX} ${controlY} ${to.x} ${to.y}`,
        shadowPath: `M ${from.x} ${from.y + 6} Q ${controlX} ${controlY + 10} ${to.x} ${to.y + 6}`,
        severity: interaction.severity,
        strokeWidth:
          interaction.severity === "High"
            ? 8
            : interaction.severity === "Moderate"
              ? 6.5
              : 5.5,
      },
    ];
  });

  return {
    theme,
    edges,
    nodes: [...nodes].sort((firstNode, secondNode) => firstNode.depth - secondNode.depth),
    themeLabel: dominantInteraction
      ? themeStyle[theme].label
      : themeStyle.general.label,
  };
}

export function InteractionNetwork({ result }: InteractionNetworkProps) {
  if (!result) {
    return null;
  }

  const width = 720;
  const height = 420;
  const centerX = width / 2;
  const centerY = height / 2 + 6;
  const pairMode = result.query.drugs.length === 2 && result.interactions.length === 1;
  const dominantInteraction = [...result.interactions].sort(
    (first, second) => second.severityScore - first.severityScore,
  )[0];

  const graph = pairMode && dominantInteraction
    ? buildPairGraph(result, dominantInteraction, centerX, centerY)
    : buildMultiGraph(result, centerX, centerY);

  return (
    <Card>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="panel-title">Interaction network</h3>
          <p className="muted mt-2">
            Visual map of the selected medicines and their key interaction pathways.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Primary concern
          </p>
          <p
            className="mt-2 text-xs font-semibold uppercase tracking-[0.18em]"
            style={{ color: themeStyle[graph.theme].accent }}
          >
            {graph.themeLabel}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.96),rgba(243,246,255,0.92)_58%,rgba(233,239,255,0.94)_100%)] p-3 sm:p-4 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top,rgba(37,48,74,0.98),rgba(20,29,45,0.98)_58%,rgba(12,18,31,1)_100%)]">
        <svg
          className="mx-auto h-[290px] w-full sm:h-[360px] lg:h-[420px]"
          viewBox={`0 0 ${width} ${height}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="node-shadow" x="-40%" y="-40%" width="180%" height="200%">
              <feDropShadow
                dx="0"
                dy="18"
                floodColor="rgba(17, 24, 39, 0.18)"
                stdDeviation="10"
              />
            </filter>
            <filter id="edge-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur result="blur" stdDeviation="6" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="network-floor" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor={themeStyle[graph.theme].surface} />
              <stop offset="65%" stopColor="rgba(124, 142, 224, 0.06)" />
              <stop offset="100%" stopColor="rgba(124, 142, 224, 0.02)" />
            </radialGradient>
            <radialGradient id="node-high" cx="32%" cy="28%" r="74%">
              <stop offset="0%" stopColor="#ffd5c1" />
              <stop offset="48%" stopColor="#ff9754" />
              <stop offset="100%" stopColor="#f97316" />
            </radialGradient>
            <radialGradient id="node-moderate" cx="32%" cy="28%" r="74%">
              <stop offset="0%" stopColor="#ffe7b8" />
              <stop offset="52%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>
            <radialGradient id="node-low" cx="32%" cy="28%" r="74%">
              <stop offset="0%" stopColor="#d7deff" />
              <stop offset="54%" stopColor="#7f93ee" />
              <stop offset="100%" stopColor="#4a5baa" />
            </radialGradient>
          </defs>

          <rect
            fill="rgba(255,255,255,0.18)"
            height={height - 24}
            rx="30"
            stroke="rgba(148,163,184,0.16)"
            width={width - 24}
            x="12"
            y="12"
          />

          <ellipse
            cx={centerX}
            cy={centerY + 84}
            fill="url(#network-floor)"
            rx={pairMode ? 220 : 292}
            ry={pairMode ? 98 : 138}
          />

          {renderThemeDecoration(graph.theme, centerX, centerY, width, height, pairMode)}

          {graph.edges.map((edge) => (
            <path
              d={edge.shadowPath}
              fill="none"
              filter="url(#edge-glow)"
              key={`${edge.id}-shadow`}
              opacity="0.28"
              stroke="rgba(15, 23, 42, 0.22)"
              strokeLinecap="round"
              strokeWidth={edge.strokeWidth + 8}
            />
          ))}

          {graph.edges.map((edge) => (
            <g key={edge.id}>
              <path
                d={edge.path}
                fill="none"
                opacity="0.92"
                stroke={getEdgeColor(edge.severity, graph.theme)}
                strokeLinecap="round"
                strokeWidth={edge.strokeWidth}
              />
              <path
                d={edge.path}
                fill="none"
                opacity="0.55"
                stroke="rgba(255,255,255,0.66)"
                strokeLinecap="round"
                strokeWidth={Math.max(1.4, edge.strokeWidth / 3)}
              />
            </g>
          ))}

          {graph.nodes.map((node) => {
            const labelWidth = Math.max(88, node.label.length * 7 + 24);
            const labelX = clamp(node.x - labelWidth / 2, 18, width - labelWidth - 18);
            const labelY =
              node.y > centerY + 12
                ? node.y - node.radius - 40
                : node.y + node.radius + 12;
            const style = nodeStyle[node.severity];

            return (
              <g key={node.id}>
                <ellipse
                  cx={node.x}
                  cy={node.y + node.radius * 0.94}
                  fill="rgba(15, 23, 42, 0.14)"
                  rx={node.radius * 0.94}
                  ry={node.radius * 0.3}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  fill={style.glow}
                  opacity="0.92"
                  r={node.radius + 10}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  fill={`url(#${style.gradientId})`}
                  filter="url(#node-shadow)"
                  r={node.radius}
                  stroke="rgba(255,255,255,0.76)"
                  strokeWidth="3"
                />
                <circle
                  cx={node.x - node.radius * 0.26}
                  cy={node.y - node.radius * 0.28}
                  fill="rgba(255,255,255,0.34)"
                  r={Math.max(7, node.radius * 0.24)}
                />
                <text
                  fill="white"
                  fontSize={Math.max(
                    11,
                    14 - Math.max(0, node.shortLabel.length - 7) * 0.55,
                  )}
                  fontWeight="700"
                  textAnchor="middle"
                  x={node.x}
                  y={node.y + 5}
                >
                  {node.shortLabel}
                </text>

                <g transform={`translate(${labelX}, ${labelY})`}>
                  <rect
                    fill="rgba(255,255,255,0.92)"
                    height="28"
                    rx="14"
                    stroke="rgba(148,163,184,0.28)"
                    width={labelWidth}
                  />
                  <text
                    fill="#24334d"
                    fontSize="13"
                    fontWeight="600"
                    textAnchor="middle"
                    x={labelWidth / 2}
                    y="18"
                  >
                    {node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
