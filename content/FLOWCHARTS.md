# Flowcharts — must be built

Every featured project gets a diagram. They are **hand-authored SVG** in
`content/diagrams.ts` — explicit coordinates, straight lines and right angles only, no
crossings, no layout engine. The Mermaid blocks below and in `case-studies/` describe
what each diagram shows; `content/diagrams.ts` is what renders.

| Diagram | Key in `content/diagrams.ts` | Shown on |
|---|---|---|
| NestuLabs AI Visibility | `nestulabs-ai-visibility` | home (project panel, links to case study) + case study |
| CRDT editing engine | `crdt-engine` | home + case study |
| Agentic trading (phase one) | `agentic-trading` | home + case study |
| Agentic trading (phase two) | `agentic-trading-phase-two` | case study |
| Rolston Lab research | `rolston-lab-research` | home |
| Odyssey rover telemetry | `odyssey-rover-telemetry` | experience row (expand) |
| AeroTrace | `aerotrace` | hackathons panel |

On the home page a diagram is the panel's media only when the project has no demo video
and no screenshot. It is always on the case study page.

## NestuLabs AI Visibility — layout

Row 1: WordPress plugin → Business website (JSON-LD + llms.txt) → AI assistants.
Row 2: Weekly tracker → AI assistants ("asks test questions"); Weekly tracker → Dashboard
for the owner.

## Rolston Lab research — scientific data pipeline

```mermaid
flowchart LR
  A[Microscopy images<br/>and plots] --> B[BLIP-2 pipeline<br/>GPU cluster]
  B --> C[Structured data]
  D[Battery EIS<br/>measurements] --> E[Gaussian Process<br/>Regression]
  E --> F[Battery health<br/>prediction]
  C --> G[4D interface model<br/>energy materials]
  F --> G
```

## Odyssey rover telemetry — Interplanetary Lab, ASU

```mermaid
flowchart LR
  R[Odyssey rover<br/>sensors] -->|live stream| S[Socket.io server]
  S --> I[(InfluxDB<br/>time-series)]
  I --> G[Grafana panels]
  S --> D[Next.js dashboard]
  D -->|commands| S
  S -->|commands| R
```

## AeroTrace — Honeywell Aerospace Devils Invent

```mermaid
flowchart LR
  A[Legacy repo<br/>C, C++, Ada] --> P[Parsers<br/>libclang, Tree-sitter]
  P --> G[Dependency graph<br/>functions + data]
  G --> AG[Agent]
  AG --> V[Call tree view]
```
