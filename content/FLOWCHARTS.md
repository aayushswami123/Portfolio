# Flowcharts — must be built

Every featured project gets a flowchart. Claude Code must render each one as a
clean SVG (not a screenshot, not a live Mermaid script in the browser).

| Project | Where the diagram lives | Shown on |
|---|---|---|
| Agentic trading (phase one + two) | `case-studies/agentic-trading.md` | home (small) + case study |
| CRDT editing engine | `case-studies/crdt-engine.md` | home (small) + case study |
| NestuLabs AI Visibility | `case-studies/nestulabs-ai-visibility.md` | home (small) + case study |
| Rolston Lab research | below | home (small) |
| Odyssey rover telemetry | below | experience row (expand) + more projects |

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
