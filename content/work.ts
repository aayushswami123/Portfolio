import type { WorkItem, ExperienceRow } from "./types";

/**
 * Featured work order is locked by docs/DESIGN.md:
 * NestuLabs (Founder), CRDT engine (Engineering), Rolston research (Research),
 * Agentic trading (Research + Engineering).
 */
export const featuredWork: WorkItem[] = [
  {
    slug: "nestulabs-ai-visibility",
    title: "NestuLabs AI Visibility",
    tag: "Founder",
    problem:
      "Businesses don't know if ChatGPT, Gemini, or Perplexity recommend them — and have no easy way to fix it.",
    built:
      "A WordPress plugin that adds structured data (JSON-LD) and an llms.txt file so AI assistants can read a site clearly, plus weekly tracking of whether the brand shows up in AI answers. Now being integrated with SHOPLINE for their merchants.",
    // [ADD: active installs] · [ADD: sites tracked] · [ADD: pilot merchants]
    metrics: [null, null, null],
    stack: ["PHP", "WordPress", "Next.js", "Supabase", "Claude API"],
    links: [
      { label: "Read case study", href: "/work/nestulabs-ai-visibility" },
      // [ADD: live plugin URL on WordPress.org]
      null,
      { label: "nestulabs.com", href: "https://nestulabs.com", external: true },
    ],
    live: true,
    diagram: "nestulabs-ai-visibility",
    caseStudy: true,
  },
  {
    slug: "crdt-engine",
    title: "Real-time collaborative editing engine",
    tag: "Engineering",
    problem:
      "Libraries like Yjs are a black box. I wanted to know how real-time collaboration actually works — so I built the sync engine myself.",
    built:
      "A conflict-free (CRDT) text sync engine in TypeScript, written from scratch with no existing CRDT library. It sends only small binary updates over WebSockets, shows live cursors, and plugs into TipTap/ProseMirror editors.",
    // [ADD: real benchmark numbers — these replace the targets below once measured]
    metrics: [null, null, null],
    targets: [
      { value: "< 5 ms", label: "Local edit applied (target)" },
      { value: "< 100 ms", label: "Remote sync (target)" },
      { value: "100+", label: "Concurrent editors (target)" },
    ],
    stack: ["TypeScript", "WebSockets", "Custom binary protocol"],
    links: [
      { label: "Read case study", href: "/work/crdt-engine" },
      // [ADD: GitHub URL]
      null,
    ],
    diagram: "crdt-engine",
    caseStudy: true,
  },
  {
    slug: "rolston-lab-research",
    title: "Machine learning research at Rolston Lab",
    tag: "Research",
    problem:
      "Scientific data — microscopy images, plots, battery measurements — is slow to process by hand.",
    built:
      "BLIP-2 pipelines that pull structured data out of scientific figures, and a Gaussian Process model that predicts lithium-ion battery health from impedance (EIS) data. Presented at FURI in Spring 2025. Now working on a 4D model of interface behavior in energy materials.",
    // [ADD: prediction error, e.g. RMSE] · [ADD: images processed] · [ADD: GPU speedup]
    metrics: [null, null, null],
    stack: ["Python", "PyTorch", "BLIP-2", "scikit-learn (GPR)", "ASU supercomputing cluster"],
    links: [
      // [ADD: FURI page URL]
      null,
      // [ADD: poster/paper, if any]
      null,
    ],
    diagram: "rolston-lab-research",
    caseStudy: false,
  },
  {
    slug: "agentic-trading",
    title: "Agentic trading research",
    tag: "Research + Engineering",
    problem:
      "Can an AI agent follow a fixed trading strategy and explain every decision it makes?",
    built:
      "A research system, run with a professor, where agents watch live gold (XAU/USD) prices, decide whether a trade meets the strategy's rules, and log the reason for each choice. Phase one is a live paper-trading dashboard — no real money. Phase two adds separate agents for market analysis, risk, and trade placement, plus an ML model.",
    // [ADD: decisions logged] · [ADD: signal latency] · [ADD: agreement with rules %]
    metrics: [null, null, null],
    stack: ["Python", "LangGraph", "OANDA practice API"],
    links: [
      { label: "Read case study", href: "/work/agentic-trading" },
      // [ADD: code URL, or "private — ask me"]
      null,
    ],
    diagram: "agentic-trading",
    caseStudy: true,
  },
];

/**
 * [CHECK] The old site listed "AI Backend Developer — Startup (Remote), May 2025 –
 * present". It is left off on purpose: an unnamed employer reads as weak to
 * recruiters. Name the company and add a row here, or leave it off for good.
 */
export const experience: ExperienceRow[] = [
  {
    company: "Cloudwick",
    role: "Incoming Software Engineer Intern, AI Solutions",
    dates: "Starting 2026",
    result:
      "Will build Python backend and APIs on AWS for AI products: chat assistants, document search, agentic workflows, and AI evaluation.",
  },
  {
    company: "Rolston Lab, Arizona State",
    role: "Undergraduate ML Researcher",
    dates: "Aug 2024 – present",
    result:
      "BLIP-2 data extraction and GPR battery-health models on GPU clusters, mentored by Prof. Nicholas Rolston.",
  },
  {
    company: "NestuLabs",
    role: "Founder",
    // [ADD: start date]
    dates: null,
    result:
      "AI visibility product for businesses; partnership with SHOPLINE; client builds in Next.js.",
  },
  {
    company: "Spectra Education",
    role: "Software Engineer Intern",
    // [ADD: dates]
    dates: null,
    // [ADD: one number, e.g. tickets handled]
    result: "Built an AI support chatbot, a MERN backend, and Docker CI/CD.",
  },
  {
    company: "Interplanetary Lab, ASU",
    role: "Rover Telemetry Engineer, Odyssey Rover",
    dates: "Jan 2025 – May 2025",
    result:
      "Built the real-time telemetry and command dashboard for the Odyssey rover with Socket.io, InfluxDB, and Grafana.",
    diagram: "odyssey-rover-telemetry",
  },
];
