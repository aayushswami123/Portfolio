import type { LinkRef, Maybe, Metric } from "./types";

export interface CaseSection {
  heading: string;
  /** Paragraphs of body copy. */
  body?: string[];
  /** Bullet list. Pending entries are dropped. */
  bullets?: Maybe<string>[];
  /** A diagram to place after the body, by filename in public/flowcharts. */
  diagram?: string;
  /** Caption shown under the diagram. */
  diagramCaption?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  status: string;
  tag: string;
  /** Rendered as the page's structured intro row. */
  stack: string[];
  links: Maybe<LinkRef>[];
  /** Targets vs measured, when the project has published targets. */
  table?: {
    caption: string;
    columns: string[];
    rows: { what: string; target: string; measured: Maybe<string> }[];
  };
  metrics: Maybe<Metric>[];
  sections: CaseSection[];
  /** One sentence, for the OG description and the diagram's screen-reader text. */
  description: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "nestulabs-ai-visibility",
    title: "NestuLabs AI Visibility",
    summary: "Helping businesses show up when people ask AI assistants for recommendations.",
    status: "Live",
    tag: "Founder",
    stack: ["PHP", "WordPress", "Next.js", "Supabase", "Claude API"],
    links: [
      { label: "nestulabs.com", href: "https://nestulabs.com", external: true },
      // [ADD: WordPress.org plugin URL]
      null,
    ],
    // [ADD: installs / sites / merchants]
    metrics: [null, null, null],
    description:
      "A WordPress plugin and weekly tracker that make a business readable to AI assistants and show whether those assistants recommend it.",
    sections: [
      {
        heading: "The problem",
        body: [
          "More people ask ChatGPT, Gemini, and Perplexity “what's the best X near me?” instead of searching Google. Most business websites aren't set up for AI assistants to read, and owners have no way to see whether they're being recommended.",
        ],
      },
      {
        heading: "What I built",
        bullets: [
          "A WordPress plugin, approved on WordPress.org, that adds clean structured data (JSON-LD) and an llms.txt file so AI assistants can understand the site.",
          "Weekly tracking that checks whether a brand shows up in answers from ChatGPT, Gemini, and Perplexity.",
          "A SHOPLINE partnership, signed July 2026, to bring this to SHOPLINE merchants.",
        ],
        diagram: "nestulabs-ai-visibility",
        diagramCaption:
          "The plugin writes structured data into the business site; the tracker asks the assistants test questions and reports back to the owner's dashboard.",
      },
      {
        heading: "Key decisions",
        // [ADD: why a plugin first instead of a standalone SaaS]
        // [ADD: how the tracker picks test questions]
        bullets: [null, null],
      },
      {
        heading: "Results",
        // [ADD: installs / sites / merchants] · [ADD: before-and-after example]
        bullets: [null, null],
      },
      {
        heading: "Also built for NestuLabs",
        body: [
          "nestulabs.com (Next.js, Tailwind, Supabase) with an SEO/AEO setup, a “Roast My Business” lead tool, and an outreach pipeline; plus a Next.js site for a dermatology clinic.",
        ],
      },
    ],
  },
  {
    slug: "crdt-engine",
    title: "Real-time collaborative editing engine",
    summary: "A Yjs-style sync engine built from scratch, with no existing CRDT library.",
    status: "In progress",
    tag: "Engineering",
    stack: ["TypeScript", "WebSockets", "Custom binary protocol"],
    // [ADD: GitHub URL]
    links: [null],
    metrics: [null, null, null],
    description:
      "A conflict-free text sync engine written from scratch in TypeScript, sending small binary updates over WebSockets to keep many editors in sync.",
    table: {
      caption: "Targets vs measured",
      columns: ["What", "Target", "Measured"],
      rows: [
        { what: "Local edit applied", target: "under 5 ms", measured: null },
        { what: "Remote edit shows up", target: "under 100 ms", measured: null },
        { what: "People editing at once", target: "100+", measured: null },
        { what: "Operations handled", target: "millions", measured: null },
      ],
    },
    sections: [
      {
        heading: "Why I built it",
        body: [
          "Google Docs-style editing feels like magic: many people type at once and nobody's work gets lost. Most apps get this from a library like Yjs. I wanted to understand how it actually works, so I built the sync engine myself.",
          "The rule I set: no Yjs, Automerge, ShareDB, Liveblocks, Replicache, or any other existing CRDT/OT library. Only standard networking and utility code.",
        ],
      },
      {
        heading: "What it does",
        bullets: [
          "Many people can edit the same text at the same time; edits always merge the same way on every device (a CRDT — conflict-free replicated data type).",
          "After the first load, only small changes are sent — never the whole document.",
          "Changes travel in a compact custom binary format over WebSockets.",
          "Shows other people's cursors and selections live.",
          "Works with TipTap / ProseMirror through an editor-agnostic TypeScript API.",
        ],
        diagram: "crdt-engine",
        diagramCaption:
          "Each editor talks to its own CRDT core through an adapter; the cores exchange binary updates through a WebSocket relay that also carries presence.",
      },
      {
        heading: "Key decisions",
        // [ADD: which CRDT approach for text and why]
        // [ADD: what the binary update format looks like, and typical edit size]
        // [ADD: how an offline user is handled on reconnect]
        bullets: [null, null, null],
      },
      {
        heading: "How I tested it",
        body: [
          "Unit tests, concurrency tests with many simulated users typing at once, stress tests, and performance benchmarks.",
        ],
        // [ADD: test count, and a link to the benchmark script]
        bullets: [null],
      },
      {
        heading: "What I'd do next",
        // [ADD]
        bullets: [null],
      },
    ],
  },
  {
    slug: "agentic-trading",
    title: "Agentic trading research",
    summary: "Can an AI agent follow a fixed trading strategy and explain every decision?",
    status: "Research, phase one (paper trading only)",
    tag: "Research + Engineering",
    stack: ["Python", "LangGraph", "OANDA practice API"],
    // [ADD: code URL, or "private — ask me"]
    links: [null],
    metrics: [null, null, null],
    description:
      "A research system where an agent checks live gold prices against fixed strategy rules, takes or skips a paper trade, and logs the reason for every decision.",
    sections: [
      {
        heading: "The question",
        body: [
          // [ADD: professor name, if they're OK being named] — omitted until confirmed.
          "Most “AI trading bots” chase profit and hide their reasoning. This research project, run with a professor, asks a simpler question first: can an agent follow a clear set of strategy rules on live market data — and tell us why it took or skipped each trade?",
          "Profit is not the goal of phase one. Understanding the agent's decisions is.",
        ],
      },
      {
        heading: "What I built (phase one)",
        bullets: [
          "A live feed of gold (XAU/USD) candles from the OANDA practice API.",
          "An agent that checks each new candle against my predefined strategy conditions and decides: take the trade, or skip it.",
          "A decision log: every choice is saved with the inputs the agent saw and its reason.",
          "A live paper-trading dashboard to watch it happen. No real money is used.",
        ],
        diagram: "agentic-trading",
        diagramCaption:
          "Live candles reach a decision agent that checks the strategy rules, then writes a reasoned take-or-skip entry to the log and a paper order to the broker; both feed the dashboard.",
      },
      {
        heading: "Phase two (planned)",
        body: [
          "Separate agents for market conditions and timing, risk, and trade placement — plus an ML model — so each part can be tested on its own.",
        ],
        diagram: "agentic-trading-phase-two",
        diagramCaption:
          "Market analysis, risk management, and an ML signal-quality model all report to an orchestrator, which is the only component that places trades.",
      },
      {
        heading: "Key decisions",
        bullets: [
          "Build my own system instead of using an open-source trading-agent framework. I studied those repos and papers, but I wanted full control over how decisions are made and logged.",
          "Start with one instrument (gold). High volume and one market keeps the first experiment clean. Other forex pairs come later.",
          "Paper trading first. Safe, and every decision can be replayed and checked.",
          // [ADD: which model/LLM runs the agent, and why]
          null,
        ],
      },
      {
        heading: "Results so far",
        // [ADD: decisions logged] · [ADD: hand-checked rule agreement] · [ADD: one surprise]
        bullets: [null, null, null],
      },
      {
        heading: "What I'd do next",
        bullets: [
          "Finish phase two's multi-agent split.",
          "Add a replay mode that runs the agents over past data for fast testing.",
          null,
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}
