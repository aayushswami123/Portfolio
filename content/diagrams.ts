/**
 * Hand-authored diagrams. Every coordinate is placed by hand — there is no
 * layout engine and no edge router. The rules, from docs/DESIGN.md:
 *
 *   - straight lines and right angles only (components/Diagram.tsx refuses a
 *     diagonal segment in development)
 *   - no crossings
 *   - `main: true` marks the path that draws itself and turns Accent on hover
 *
 * Units are SVG pixels at 1x. Labels are JetBrains Mono 12px (about 7.2px a
 * character), so a box is `characters * 7.2 + 24` wide. One-line boxes are 36
 * tall, two-line boxes 52.
 */

export type Point = [number, number];

export interface DiagramNode {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
}

export interface DiagramEdge {
  points: Point[];
  main?: boolean;
  /** Arrowheads: at the end (default), at both ends, or none (a plain link). */
  arrow?: "end" | "both" | "none";
  label?: { text: string; x: number; y: number; anchor?: "start" | "middle" | "end" };
}

export interface DiagramDef {
  title: string;
  /** One sentence for screen readers and crawlers (the SVG's <desc>). */
  description: string;
  /** Figure caption, without the "Fig. N — " prefix. */
  caption: string;
  width: number;
  height: number;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export const diagrams = {
  "nestulabs-ai-visibility": {
    title: "NestuLabs AI Visibility architecture",
    description:
      "A WordPress plugin writes JSON-LD and an llms.txt file into the business website so AI assistants can read it, while a weekly tracker asks those assistants test questions and reports to a dashboard for the owner.",
    caption: "How the NestuLabs plugin and weekly tracker fit together.",
    width: 596,
    height: 184,
    nodes: [
      { x: 16, y: 22, w: 144, h: 36, lines: ["WordPress plugin"] },
      { x: 216, y: 14, w: 168, h: 52, lines: ["Business website", "JSON-LD + llms.txt"] },
      { x: 440, y: 22, w: 140, h: 36, lines: ["AI assistants"] },
      { x: 16, y: 132, w: 144, h: 36, lines: ["Weekly tracker"] },
      { x: 216, y: 132, w: 190, h: 36, lines: ["Dashboard for the owner"] },
    ],
    edges: [
      { points: [[160, 40], [216, 40]], main: true },
      { points: [[384, 40], [440, 40]], main: true },
      {
        points: [[88, 132], [88, 100], [510, 100], [510, 58]],
        label: { text: "asks test questions", x: 299, y: 92 },
      },
      { points: [[160, 150], [216, 150]] },
    ],
  },

  "crdt-engine": {
    title: "Collaborative editing engine architecture",
    description:
      "A TipTap editor and a ProseMirror editor each talk to their own CRDT core through an adapter; the two cores exchange small binary updates in both directions through a WebSocket relay, which also carries presence data for cursors and selections.",
    caption: "Each editor syncs through its own CRDT core and a shared WebSocket relay.",
    width: 620,
    height: 324,
    nodes: [
      { x: 16, y: 16, w: 120, h: 52, lines: ["Editor A", "TipTap"] },
      { x: 28, y: 104, w: 96, h: 36, lines: ["Adapter"] },
      { x: 24, y: 176, w: 104, h: 36, lines: ["CRDT core"] },
      { x: 484, y: 16, w: 120, h: 52, lines: ["Editor B", "ProseMirror"] },
      { x: 496, y: 104, w: 96, h: 36, lines: ["Adapter"] },
      { x: 492, y: 176, w: 104, h: 36, lines: ["CRDT core"] },
      { x: 240, y: 176, w: 140, h: 36, lines: ["WebSocket relay"] },
      { x: 218, y: 256, w: 184, h: 52, lines: ["Presence", "cursors and selections"] },
    ],
    edges: [
      { points: [[76, 68], [76, 104]], main: true },
      { points: [[76, 140], [76, 176]], main: true },
      {
        points: [[128, 194], [240, 194]],
        main: true,
        arrow: "both",
        label: { text: "binary updates", x: 184, y: 186 },
      },
      {
        points: [[380, 194], [492, 194]],
        main: true,
        arrow: "both",
        label: { text: "binary updates", x: 436, y: 186 },
      },
      { points: [[544, 68], [544, 104]] },
      { points: [[544, 140], [544, 176]] },
      { points: [[310, 212], [310, 256]], arrow: "none" },
    ],
  },

  "agentic-trading": {
    title: "Agentic trading, phase one",
    description:
      "Live gold candles from the OANDA practice API flow into a market data service, then a decision agent checks the strategy rules and writes a reasoned take-or-skip entry to a decision log and a paper order to a paper broker; both feed a live dashboard.",
    caption: "Phase one: live candles to a reasoned take-or-skip decision.",
    width: 688,
    height: 284,
    nodes: [
      { x: 16, y: 16, w: 168, h: 52, lines: ["OANDA practice API", "live XAU/USD candles"] },
      { x: 232, y: 24, w: 164, h: 36, lines: ["Market data service"] },
      { x: 448, y: 16, w: 192, h: 52, lines: ["Decision agent", "checks strategy rules"] },
      { x: 416, y: 132, w: 112, h: 36, lines: ["Decision log"] },
      { x: 560, y: 132, w: 112, h: 36, lines: ["Paper broker"] },
      { x: 416, y: 232, w: 256, h: 36, lines: ["Live dashboard"] },
    ],
    edges: [
      { points: [[184, 42], [232, 42]], main: true },
      { points: [[396, 42], [448, 42]], main: true },
      {
        points: [[472, 68], [472, 132]],
        main: true,
        label: { text: "take / skip + reason", x: 464, y: 104, anchor: "end" },
      },
      {
        points: [[616, 68], [616, 132]],
        label: { text: "paper order", x: 608, y: 104, anchor: "end" },
      },
      { points: [[472, 168], [472, 232]], main: true },
      { points: [[616, 168], [616, 232]] },
    ],
  },

  "agentic-trading-phase-two": {
    title: "Agentic trading, phase two",
    description:
      "A market analysis agent, a risk management agent, and an ML signal-quality model all report to an orchestrator, which is the only component that calls the trade execution agent.",
    caption: "Phase two: separate agents report to one orchestrator.",
    width: 656,
    height: 208,
    nodes: [
      { x: 16, y: 16, w: 184, h: 36, lines: ["Market analysis agent"] },
      { x: 16, y: 76, w: 184, h: 36, lines: ["Risk management agent"] },
      { x: 16, y: 140, w: 184, h: 52, lines: ["ML model", "signal quality"] },
      { x: 264, y: 76, w: 128, h: 36, lines: ["Orchestrator"] },
      { x: 456, y: 76, w: 184, h: 36, lines: ["Trade execution agent"] },
    ],
    edges: [
      { points: [[200, 34], [328, 34], [328, 76]] },
      { points: [[200, 94], [264, 94]], main: true },
      { points: [[200, 166], [328, 166], [328, 112]] },
      { points: [[392, 94], [456, 94]], main: true },
    ],
  },

  "rolston-lab-research": {
    title: "Rolston Lab scientific data pipeline",
    description:
      "Microscopy images and plots run through a BLIP-2 pipeline on a GPU cluster to produce structured data, while battery impedance measurements run through Gaussian Process Regression to predict battery health; both results feed a 4D model of interface behaviour in energy materials.",
    caption: "Two research pipelines feeding one interface model.",
    width: 696,
    height: 192,
    nodes: [
      { x: 16, y: 16, w: 142, h: 52, lines: ["Microscopy images", "and plots"] },
      { x: 194, y: 16, w: 136, h: 52, lines: ["BLIP-2 pipeline", "GPU cluster"] },
      { x: 366, y: 24, w: 128, h: 36, lines: ["Structured data"] },
      { x: 16, y: 124, w: 142, h: 52, lines: ["Battery EIS", "measurements"] },
      { x: 194, y: 124, w: 136, h: 52, lines: ["Gaussian Process", "Regression"] },
      { x: 366, y: 124, w: 128, h: 52, lines: ["Battery health", "prediction"] },
      { x: 530, y: 70, w: 150, h: 52, lines: ["4D interface model", "energy materials"] },
    ],
    edges: [
      { points: [[158, 42], [194, 42]], main: true },
      { points: [[330, 42], [366, 42]], main: true },
      { points: [[494, 42], [605, 42], [605, 70]], main: true },
      { points: [[158, 150], [194, 150]] },
      { points: [[330, 150], [366, 150]] },
      { points: [[494, 150], [605, 150], [605, 122]] },
    ],
  },

  "odyssey-rover-telemetry": {
    title: "Odyssey rover telemetry",
    description:
      "Rover sensors stream live into a Socket.io server, which writes to an InfluxDB time-series store for Grafana panels and pushes updates to a Next.js dashboard; commands travel back from the dashboard through the server to the rover.",
    caption: "Odyssey rover telemetry out, commands back.",
    width: 712,
    height: 184,
    nodes: [
      { x: 16, y: 24, w: 112, h: 52, lines: ["Odyssey rover", "sensors"] },
      { x: 224, y: 32, w: 140, h: 36, lines: ["Socket.io server"] },
      { x: 412, y: 24, w: 112, h: 52, lines: ["InfluxDB", "time-series"] },
      { x: 572, y: 32, w: 124, h: 36, lines: ["Grafana panels"] },
      { x: 220, y: 132, w: 148, h: 36, lines: ["Next.js dashboard"] },
    ],
    edges: [
      {
        points: [[128, 42], [224, 42]],
        main: true,
        label: { text: "live stream", x: 176, y: 35 },
      },
      { points: [[224, 58], [128, 58]], label: { text: "commands", x: 176, y: 74 } },
      { points: [[364, 50], [412, 50]], main: true },
      { points: [[524, 50], [572, 50]], main: true },
      { points: [[278, 68], [278, 132]] },
      {
        points: [[310, 132], [310, 68]],
        label: { text: "commands", x: 318, y: 104, anchor: "start" },
      },
    ],
  },

  aerotrace: {
    title: "AeroTrace pipeline",
    description:
      "A legacy C, C++, and Ada repository is parsed by libclang and Tree-sitter into a dependency graph of functions and data, which an agent turns into a call tree view.",
    caption: "AeroTrace turning a legacy repo into a call tree.",
    width: 368,
    height: 244,
    nodes: [
      { x: 16, y: 16, w: 112, h: 52, lines: ["Legacy repo", "C, C++, Ada"] },
      { x: 176, y: 16, w: 176, h: 52, lines: ["Parsers", "libclang, Tree-sitter"] },
      { x: 194, y: 104, w: 140, h: 52, lines: ["Dependency graph", "functions + data"] },
      { x: 56, y: 112, w: 80, h: 36, lines: ["Agent"] },
      { x: 26, y: 192, w: 140, h: 36, lines: ["Call tree view"] },
    ],
    edges: [
      { points: [[128, 42], [176, 42]], main: true },
      { points: [[264, 68], [264, 104]], main: true },
      { points: [[194, 130], [136, 130]], main: true },
      { points: [[96, 148], [96, 192]], main: true },
    ],
  },
} satisfies Record<string, DiagramDef>;

export type DiagramName = keyof typeof diagrams;

export function isDiagram(name: string): name is DiagramName {
  return Object.prototype.hasOwnProperty.call(diagrams, name);
}
