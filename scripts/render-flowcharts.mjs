#!/usr/bin/env node
/**
 * Renders every Mermaid block listed in content/FLOWCHARTS.md to a static SVG.
 *
 * Runs as part of `prebuild`, so the diagrams in the repo are always in sync
 * with the markdown they come from. No browser, no puppeteer — the layout is
 * computed here so the output matches docs/DESIGN.md exactly.
 *
 * Each diagram is emitted twice:
 *   <name>.svg          full size, for the case study pages
 *   <name>.preview.svg  larger type and tighter spacing, for the home page cards
 */

import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { extractMermaidBlocks, parseFlowchart } from "./mermaid-parse.mjs";
import { renderSvg } from "./mermaid-layout.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "flowcharts");
const metaDir = join(root, "content", "generated");

/**
 * The one-sentence descriptions are the accessible text for each diagram, read
 * by screen readers and by AI crawlers. Keep them factual.
 */
const MANIFEST = [
  {
    name: "agentic-trading",
    source: "content/case-studies/agentic-trading.md",
    block: 0,
    title: "Agentic trading, phase one",
    description:
      "Live gold candles from the OANDA practice API flow into a market data service, then a decision agent checks the strategy rules and writes a reasoned take-or-skip entry to a decision log and a paper order to a paper broker; both feed a live dashboard.",
  },
  {
    name: "agentic-trading-phase-two",
    source: "content/case-studies/agentic-trading.md",
    block: 1,
    title: "Agentic trading, phase two",
    description:
      "A market analysis agent, a risk management agent, and an ML signal-quality model all report to an orchestrator, which is the only component that calls the trade execution agent.",
  },
  {
    name: "crdt-engine",
    source: "content/case-studies/crdt-engine.md",
    block: 0,
    title: "Collaborative editing engine architecture",
    description:
      "A TipTap editor and a ProseMirror editor each talk to their own CRDT core through an adapter; the two cores exchange small binary updates in both directions through a WebSocket relay, which also carries presence data for cursors and selections.",
  },
  {
    name: "nestulabs-ai-visibility",
    source: "content/case-studies/nestulabs-ai-visibility.md",
    block: 0,
    title: "NestuLabs AI Visibility architecture",
    description:
      "A WordPress plugin writes JSON-LD and an llms.txt file into the business website so AI assistants can read it, while a weekly tracker asks those assistants test questions and reports the results to the owner's dashboard.",
  },
  {
    name: "rolston-lab-research",
    source: "content/FLOWCHARTS.md",
    block: 0,
    title: "Rolston Lab scientific data pipeline",
    description:
      "Microscopy images and plots run through a BLIP-2 pipeline on a GPU cluster to produce structured data, while battery impedance measurements run through Gaussian Process Regression to predict battery health; both results feed a 4D model of interface behaviour in energy materials.",
  },
  {
    name: "odyssey-rover-telemetry",
    source: "content/FLOWCHARTS.md",
    block: 1,
    title: "Odyssey rover telemetry",
    description:
      "Rover sensors stream live into a Socket.io server, which writes to an InfluxDB time-series store for Grafana panels and pushes updates to a Next.js dashboard; commands travel back from the dashboard through the server to the rover.",
  },
  {
    name: "ask-about-me",
    source: "docs/ASK-ABOUT-ME.md",
    block: 0,
    title: "How the ask box works",
    description:
      "A visitor's question is posted from the ask box to an edge function, which checks a rate limit and spend cap; over the limit it returns prewritten fallback answers, and under it calls the Qualcomm Cloud AI 100 API with a knowledge file built from the site content, streaming the text back to the box.",
  },
];

async function main() {
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await mkdir(metaDir, { recursive: true });

  const cache = new Map();
  const meta = {};

  for (const entry of MANIFEST) {
    if (!cache.has(entry.source)) {
      cache.set(entry.source, extractMermaidBlocks(await readFile(join(root, entry.source), "utf8")));
    }
    const blocks = cache.get(entry.source);
    const source = blocks[entry.block];
    if (!source) {
      throw new Error(
        `${entry.source} has no mermaid block at index ${entry.block} (found ${blocks.length}). ` +
          `Update MANIFEST in scripts/render-flowcharts.mjs.`,
      );
    }

    const graph = parseFlowchart(source);
    if (graph.nodes.length === 0 || graph.edges.length === 0) {
      throw new Error(`${entry.name}: parsed an empty graph. Check the mermaid block.`);
    }

    const full = renderSvg({ graph, preset: "full", title: entry.title, description: entry.description });
    const preview = renderSvg({
      graph,
      preset: "preview",
      title: entry.title,
      description: entry.description,
    });

    await writeFile(join(outDir, `${entry.name}.svg`), full.svg, "utf8");
    await writeFile(join(outDir, `${entry.name}.preview.svg`), preview.svg, "utf8");

    meta[entry.name] = {
      title: entry.title,
      description: entry.description,
      source: entry.source,
      nodes: graph.nodes.length,
      edges: graph.edges.length,
      full: { width: full.width, height: full.height },
      preview: { width: preview.width, height: preview.height },
    };

    console.log(
      `  ${entry.name.padEnd(28)} ${String(graph.nodes.length).padStart(2)} nodes ` +
        `${String(graph.edges.length).padStart(2)} edges  ${full.width}x${full.height}`,
    );
  }

  await writeFile(join(metaDir, "flowcharts.json"), `${JSON.stringify(meta, null, 2)}\n`, "utf8");
  console.log(`\n  ${MANIFEST.length} flowcharts rendered to public/flowcharts/`);
}

main().catch((error) => {
  console.error(`\nFlowchart render failed: ${error.message}\n`);
  process.exit(1);
});
