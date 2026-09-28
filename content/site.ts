import type { LinkRef, LogEntry, SkillGroup, FallbackAnswer } from "./types";

export const site = {
  name: "Aayush Swami",
  url: "https://aayushswami.com",
  title: "Aayush Swami — Software Engineer, AI Systems",
  description:
    "CS senior at Arizona State building AI systems people use — agents, retrieval, and the backend underneath. Founder of NestuLabs. Open to 2027 new-grad roles.",
  location: "Tempe, Arizona",
  email: "aayushswami.dev@gmail.com",
} as const;

export const hero = {
  pitch:
    "I build AI systems people actually use — agents, search, and the backend underneath.",
  status:
    "Engineer, researcher, and founder. Incoming Software Engineer Intern, AI Solutions at Cloudwick. ML researcher at ASU's Rolston Lab. Founder of NestuLabs. CS senior at Arizona State (BS 2027, MS 2028) — open to 2027 new-grad roles.",
} as const;

export const ask = {
  placeholder: "Ask anything about my work — e.g. what did you build at Rolston Lab?",
  button: "Ask",
  suggestions: [
    "What are you building at NestuLabs?",
    "How does your collaborative editor work?",
    "What's your research about?",
    "What roles are you looking for?",
  ],
  note: "Answers come from an AI trained only on this site. For anything important, email me.",
  attribution: "Runs on Qualcomm Cloud AI 100.",
  maxLength: 300,
} as const;

/**
 * Shown when the model is down, rate-limited, or not configured yet.
 * Written from CONTENT.md, so they stay true even when the API is not.
 */
export const fallbackAnswers: FallbackAnswer[] = [
  {
    question: "What are you building at NestuLabs?",
    answer:
      "NestuLabs builds AI visibility for businesses. The WordPress plugin adds structured data (JSON-LD) and an llms.txt file so AI assistants can read a site clearly, and a weekly tracker checks whether the brand shows up in answers from ChatGPT, Gemini, and Perplexity. It is now being integrated with SHOPLINE for their merchants.",
    link: { label: "Read the case study", href: "/work/nestulabs-ai-visibility" },
  },
  {
    question: "How does your collaborative editor work?",
    answer:
      "It is a conflict-free (CRDT) text sync engine written from scratch in TypeScript, with no Yjs, Automerge, or other CRDT library. After the first load it sends only small changes, in a compact custom binary format over WebSockets, and it shows other people's cursors live. It plugs into TipTap and ProseMirror through an editor-agnostic API.",
    link: { label: "Read the case study", href: "/work/crdt-engine" },
  },
  {
    question: "What's your research about?",
    answer:
      "Two things. At ASU's Rolston Lab, Aayush builds BLIP-2 pipelines that pull structured data out of scientific figures, and a Gaussian Process model that predicts lithium-ion battery health from impedance (EIS) data — presented at FURI in Spring 2025. Separately, he runs an agentic trading study with a professor, where agents follow a fixed strategy on live gold prices and log the reason for every decision.",
    link: { label: "See selected work", href: "/#work" },
  },
];

export const proofRow = [
  "Cloudwick (incoming)",
  "SHOPLINE partnership",
  "Qualcomm (capstone sponsor)",
  "Rolston Lab, ASU",
  "Interplanetary Lab, ASU",
  "FURI",
] as const;

/**
 * Shipping log — newest first, five shown.
 * TODO(aayush): after Cal Hacks 13.0 (Oct 2026), change the first line to what
 * you actually built there.
 */
export const shippingLog: LogEntry[] = [
  { date: "Oct 2026", entry: "Building at Cal Hacks 13.0 in San Francisco", link: null },
  {
    date: "Sep 2026",
    entry:
      "Accepted an offer as Incoming Software Engineer Intern, AI Solutions at Cloudwick",
    link: null,
  },
  {
    date: "Sep 2026",
    entry: "Started the Qualcomm AI100 capstone: a prompt-to-plan travel planner",
    link: null,
  },
  {
    date: "Aug 2026",
    entry: "NestuLabs AI Visibility plugin approved on WordPress.org",
    // [ADD: plugin URL]
    link: null,
  },
  {
    date: "Jul 2026",
    entry: "Signed a development and referral partnership with SHOPLINE for NestuLabs",
    // [ADD: LinkedIn post URL]
    link: null,
  },
  {
    // [ADD: date]
    date: null,
    entry: "Launched NestU, a student housing platform",
    link: { label: "nestu.app", href: "https://nestu.app", external: true },
  },
  {
    date: "Spring 2025",
    entry: "Presented battery-health ML research at FURI",
    // [ADD: FURI page URL]
    link: null,
  },
];

export const shippingLogCount = 5;

export const skills: SkillGroup[] = [
  { label: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "C/C++", "SQL"] },
  {
    label: "AI / ML",
    items: [
      "PyTorch",
      "LangChain",
      "LangGraph",
      "Retrieval-augmented generation (RAG)",
      "FAISS",
      "pgvector",
      "BLIP-2",
      "Hugging Face",
    ],
  },
  {
    label: "Backend & cloud",
    items: [
      "FastAPI",
      "Node.js",
      "AWS",
      "Cloudflare Workers",
      "PostgreSQL",
      "Supabase",
      "Docker",
      "CI/CD",
    ],
  },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind"] },
];

export const moreProjects = [
  {
    name: "NestU",
    text: "Student housing platform with verified listings, AI roommate matching, and a sublease marketplace.",
    link: { label: "nestu.app", href: "https://nestu.app", external: true } as LinkRef | null,
  },
  {
    name: "Qualcomm AI100 travel planner",
    text: "Capstone, in progress — turns a plain-language prompt into a visual trip plan. Team of five.",
    link: null,
  },
  {
    name: "Multimodal financial RAG",
    text: "Search over financial text and charts using BLIP-2 and LLaVA embeddings.",
    link: null,
  },
  {
    name: "Voice assistant on Cloudflare Workers AI",
    text: "Llama 3.3 with Durable Objects for fast, stateful replies.",
    link: null,
  },
  {
    name: "KV cache for GPT-2",
    text: "Added key-value caching to speed up text generation (UIUC+ research task).",
    link: null,
  },
  {
    name: "Workday auto-apply extension",
    text: "Chrome extension that fills Workday job forms.",
    link: null,
  },
  {
    name: "Odyssey rover telemetry dashboard",
    text: "Interplanetary Lab, ASU — live sensor streams and commands for the Odyssey rover.",
    link: null,
    diagram: "odyssey-rover-telemetry",
  },
];

export const leadership = [
  "Secretary, Google Developer Group at ASU",
  "Undergraduate Learning Assistant, FSE 100 (Fall 2026)",
  "Adobe Student Ambassador",
  "Venture Scout, LvlUp Ventures",
  "Accelerators: LvlUp Labs, Momentum by DevLabs",
  "Hackathons: Cal Hacks 13.0 (2026), VillageHacks",
];

export const about = {
  paragraphs: [
    "I'm a computer science senior at Arizona State, in the accelerated BS/MS program. I like the part of AI work where a demo has to become something people rely on — clean APIs, good tests, and knowing why the system made a choice.",
    "Outside class I do ML research at Rolston Lab and run NestuLabs, where I build tools that help businesses show up in AI search. I'm based in Tempe, Arizona.",
  ],
  // [CHECK: must match the resume exactly]
  gpa: "3.83",
} as const;

export const contact: {
  heading: string;
  line: string;
  links: LinkRef[];
  footer: string;
} = {
  heading: "Let's talk",
  line: "I'm looking for 2027 new-grad roles in software, ML, and forward-deployed engineering. I also like hearing about hard problems at early-stage startups.",
  links: [
    { label: "aayushswami.dev@gmail.com", href: "mailto:aayushswami.dev@gmail.com" },
    { label: "github.com/aayushswami123", href: "https://github.com/aayushswami123", external: true },
    {
      label: "linkedin.com/in/aayush-swami",
      href: "https://www.linkedin.com/in/aayush-swami",
      external: true,
    },
    {
      label: "leetcode.com/u/aayushswami8",
      href: "https://leetcode.com/u/aayushswami8",
      external: true,
    },
    { label: "Resume", href: "/resume" },
  ],
  footer: "© 2026 Aayush Swami. Built in Tempe, Arizona.",
};

/** The file /resume redirects to. Drop the PDF in public/ with this exact name. */
export const resumeFile = "/Aayush_Swami_Resume_2026.pdf";
