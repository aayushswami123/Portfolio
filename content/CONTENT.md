# Site content — aayushswami.com

Rules for using this file:
- This is the single source of truth for words on the site.
- `[ADD: ...]` = Aayush must supply this. `[CHECK: ...]` = confirm before launch.
- If a placeholder is still empty at launch, hide that line. Never ship brackets.

---

## Meta
- **Title:** Aayush Swami — Software Engineer, AI Systems
- **Description:** CS senior at Arizona State building AI systems people use — agents,
  retrieval, and the backend underneath. Founder of NestuLabs. Open to 2027 new-grad roles.
- **URL:** https://aayushswami.com

---

## Hero

**Name:** Aayush Swami

**Pitch (h1 subline):**
I build AI systems people actually use — agents, search, and the backend underneath.

**Status line (equal weight to all three sides):**
Engineer, researcher, and founder. Incoming Software Engineer Intern, AI Solutions at
Cloudwick. ML researcher at ASU's Rolston Lab. Founder of NestuLabs.
Open to 2027 new-grad roles.

**Education line:** Arizona State University — BS Computer Science 2027, MS 2028 · GPA 3.83

### Ask about me (hero box)
- **Label:** Ask about my work
- **Placeholder:** e.g. What did you build at Rolston Lab?
- **Button:** Ask
- **Suggested questions:**
  - What are you building at NestuLabs?
  - How does your collaborative editor work?
  - What's your research about?
  - What did you build at hackathons?
- **Small note under the box:** Answers come from an AI trained only on this site.
  For anything important, email me.
- **Fallback when AI is unavailable:** show the answers to the 4 suggested questions,
  plus "What roles are you looking for?" (written from the sections below), with the
  question just asked first, and an "Email me" button.

**Buttons:** Download resume · GitHub · Email me

### Recent — shipping log (below the logo strip, show the newest 3)
| Date | Entry | Link |
|---|---|---|
| Oct 2026 | Won Best Use of Snowflake at Hacktoberfest Hack Day x sunhacks | — |
| Oct 2026 | Built AeroTrace at Honeywell Aerospace Devils Invent | — |
| Oct 2026 | Heading to Cal Hacks 13.0 in San Francisco | — |
| Sep 2026 | Accepted an offer as Incoming Software Engineer Intern, AI Solutions at Cloudwick | — |
| Sep 2026 | Started the Qualcomm AI100 capstone: a prompt-to-plan travel planner | — |
| Aug 2026 | NestuLabs AI Visibility plugin approved on WordPress.org | [ADD: plugin URL] |
| Jul 2026 | Signed a development and referral partnership with SHOPLINE for NestuLabs | [ADD: LinkedIn post URL] |
| [ADD: date] | Launched NestU, a student housing platform | https://nestu.app |
| Spring 2025 | Presented battery-health ML research at FURI | [ADD: FURI page URL] |

> After Oct 26, change the Cal Hacks line to what you built there.

### Logo strip (replaces the proof row)
Cloudwick (incoming intern) · SHOPLINE (partner) · Arizona State University (Rolston Lab, Interplanetary Lab) · Capstone sponsored by Qualcomm

> [ADD: logo files in public/logos/ — cloudwick.svg, shopline.svg, asu.svg] Each logo
> shows only once its file exists. Qualcomm stays text only.

---

## Selected work (4 items — tag each with its side)

### 1. NestuLabs AI Visibility
**Tag:** Founder
**Problem:** Businesses don't know if ChatGPT, Gemini, or Perplexity recommend them —
and have no easy way to fix it.
**What I built:** A WordPress plugin that adds structured data (JSON-LD) and an llms.txt
file so AI assistants can read a site clearly, plus weekly tracking of whether the brand
shows up in AI answers. Now being integrated with SHOPLINE for their merchants.
**Metrics:** [ADD: active installs] · [ADD: sites tracked] · [ADD: pilot merchants]
**Stack:** PHP, WordPress, Next.js, Supabase, Claude API
**Links:** Read case study · Live plugin [ADD URL] · nestulabs.com
**Status dot:** Live

### 2. Agentic trading research
**Tag:** Research + Engineering
**Problem:** Can an AI agent follow a fixed trading strategy and explain every decision
it makes?
**What I built:** A research system, run with a professor, where agents watch live gold
(XAU/USD) prices, decide whether a trade meets the strategy's rules, and log the reason
for each choice. Phase one is a live paper-trading dashboard — no real money. Phase two
adds separate agents for market analysis, risk, and trade placement, plus an ML model.
**Metrics:** [ADD: decisions logged] · [ADD: signal latency] · [ADD: agreement with rules %]
**Stack:** Python, LangGraph, OANDA practice API, [ADD: dashboard stack]
**Links:** Read case study · Code [ADD or "private — ask me"]

### 3. Real-time collaborative editing engine
**Tag:** Engineering
**Problem:** Libraries like Yjs are a black box. I wanted to know how real-time
collaboration actually works — so I built the sync engine myself.
**What I built:** A conflict-free (CRDT) text sync engine in TypeScript, written from
scratch with no existing CRDT library. It sends only small binary updates over
WebSockets, shows live cursors, and plugs into TipTap/ProseMirror editors.
**Targets:** local edit under 5 ms · remote sync under 100 ms · 100+ people editing at once
**Measured:** [ADD: real benchmark numbers — show these instead of targets once you have them]
**Stack:** TypeScript, WebSockets, custom binary protocol
**Links:** Read case study · Code [ADD: GitHub URL]

### 4. Machine learning research at Rolston Lab
**Tag:** Research
**Problem:** Scientific data — microscopy images, plots, battery measurements — is slow
to process by hand.
**What I built:** BLIP-2 pipelines that pull structured data out of scientific figures,
and a Gaussian Process model that predicts lithium-ion battery health from impedance
(EIS) data. Presented at FURI in Spring 2025. Now working on a 4D model of interface
behavior in energy materials.
**Metrics:** [ADD: prediction error, e.g. RMSE] · [ADD: images processed] · [ADD: GPU speedup]
**Stack:** Python, PyTorch, BLIP-2, scikit-learn (GPR), ASU supercomputing cluster
**Links:** FURI page [ADD URL] · Poster/paper [ADD if any]

---

## Hackathons (directly after Selected work)

### PR Lifeguard
**Event:** MLH Hacktoberfest Hack Day Tempe x sunhacks, Arizona State University — Oct 2026
**Award:** Winner · Best Use of Snowflake
**Problem:** Open-source maintainers have too many pull requests and no quick way to see
which ones are small and which need real review time.
**What we built:** An AI tool that sorts open GitHub pull requests by how much effort each
one needs, so maintainers can clear the easy ones first. Built in one day.
**Team:** [ADD: teammate name — ask them first]
**Stack:** Snowflake · [ADD: rest of stack]
**Code:** https://github.com/makhijaaryan/hactober-asu-hackathon
**Demo:** [ADD: video]
**Devpost:** [ADD]
**Tag:** Engineering

### AeroTrace (Team Avio)
**Event:** Honeywell Aerospace Devils Invent, Arizona State University — Future-Ready Avionics — Oct 2026
**Award:** [ADD: placement/award if any, else no badge]
**Problem:** Avionics software runs on decades-old C, C++, and Ada code. Engineers spend
weeks just figuring out what calls what.
**What we built:** An agent that reads a legacy codebase and builds call trees showing how
functions and data depend on each other. Built for C, C++, and Ada.
**How:** libclang parses C and C++; Tree-sitter parses Ada. The parsers build a dependency
graph of functions and data, and the agent turns it into a call tree view.
**Stack:** Python, libclang, Tree-sitter · [ADD: LLM/agent stack]
**Code:** Private (not open source).
**Demo:** [ADD: video]
**Tag:** Engineering

---

## Experience

| Company | Role | Dates | One line |
|---|---|---|---|
| Cloudwick | Incoming Software Engineer Intern, AI Solutions | Starting 2026 | Will build Python backend and APIs on AWS for AI products: chat assistants, document search, agentic workflows, and AI evaluation. |
| Rolston Lab, Arizona State | Undergraduate ML Researcher | Aug 2024 – present | BLIP-2 data extraction and GPR battery-health models on GPU clusters, mentored by Prof. Nicholas Rolston. |
| NestuLabs | Founder | [ADD: start date] – present | AI visibility product for businesses; partnership with SHOPLINE; client builds in Next.js. |
| Spectra Education | Software Engineer Intern | [ADD: dates] | Built an AI support chatbot, a MERN backend, and Docker CI/CD. [ADD: one number, e.g. tickets handled] |
| Interplanetary Lab, ASU | Rover Telemetry Engineer, Odyssey Rover | Jan 2025 – May 2025 | Built the real-time telemetry and command dashboard for the Odyssey rover with Socket.io, InfluxDB, and Grafana. |

> [ADD: Cloudwick start month] — the date becomes "Starting <month> 2026".
> [ADD: Rolston Lab site URL] · [ADD: Interplanetary Lab site URL] — company names link once set.

> [CHECK: The old site lists "AI Backend Developer — Startup (Remote), May 2025 – present".
> Either name the company or remove it. Unnamed roles look weak to recruiters.]

---

## More projects (one line each)
- **NestU** — student housing platform with verified listings, AI roommate matching, and a sublease marketplace. Live at nestu.app.
- **Qualcomm AI100 travel planner** (capstone, in progress) — turns a plain-language prompt into a visual trip plan. Team of five.
- **Multimodal financial RAG** — search over financial text and charts using BLIP-2 and LLaVA embeddings.
- **Voice assistant on Cloudflare Workers AI** — Llama 3.3 with Durable Objects for fast, stateful replies.
- **KV cache for GPT-2** — added key-value caching to speed up text generation (UIUC+ research task).
- **Workday auto-apply extension** — Chrome extension that fills Workday job forms.
- **Odyssey rover telemetry dashboard** (Interplanetary Lab, ASU) — live sensor streams and commands for the Odyssey rover.

Remove from old site: Weather & Cafe Finder (weakest project). Merge "Elite Confluence
Trading Bot" into the Agentic trading research item.

---

## Skills (short — the projects already prove them)
- **Languages:** Python, TypeScript, JavaScript, Java, C/C++, SQL
- **AI / ML:** PyTorch, LangChain, LangGraph, RAG, FAISS, pgvector, BLIP-2, Hugging Face
- **Backend & cloud:** FastAPI, Node.js, AWS, Cloudflare Workers, PostgreSQL, Supabase, Docker, CI/CD
- **Frontend:** React, Next.js, Tailwind

> Only list what you'd be happy to be quizzed on in an interview.

---

## Leadership & community
- Secretary, Google Developer Group at ASU
- Undergraduate Learning Assistant, FSE 100 (Fall 2026)
- Adobe Student Ambassador
- Venture Scout, LvlUp Ventures
- Accelerators: LvlUp Labs, Momentum by DevLabs
- Hackathons: Cal Hacks 13.0 (2026), Honeywell Devils Invent (2026), Hacktoberfest Hack Day x sunhacks — Best Use of Snowflake (2026), VillageHacks

---

## About (short, near the bottom)
I'm a computer science senior at Arizona State, in the accelerated BS/MS program.
I like the part of AI work where a demo has to become something people rely on —
clean APIs, good tests, and knowing why the system made a choice.

Outside class I do ML research at Rolston Lab and run NestuLabs, where I build tools
that help businesses show up in AI search. I'm based in Tempe, Arizona.

> GPA now lives in the hero education line. [CHECK: GPA 3.83 must match the resume exactly]

---

## Contact
**Heading:** Let's talk
**Line:** I'm looking for 2027 new-grad roles in software, ML, and forward-deployed
engineering. I also like hearing about hard problems at early-stage startups.
- Email: aayushswami.dev@gmail.com
- GitHub: github.com/aayushswami123
- LinkedIn: linkedin.com/in/aayush-swami
- LeetCode: leetcode.com/u/aayushswami8
- Resume: /resume  [ADD: new PDF named Aayush_Swami_Resume_2026.pdf]

**Footer:** © 2026 Aayush Swami. Built in Tempe, Arizona.

> Media still to supply (notes, never shown to the Ask box):
> [ADD: demo videos — public/demos/<slug>.mp4 + <slug>-poster.webp, max 40 s, 1280px, H.264, under 6 MB]
> Slugs: nestulabs-ai-visibility, crdt-engine, rolston-research, agentic-trading,
> pr-lifeguard, aerotrace. Run npm run demos:check.
> [ADD: screenshots in public/work/<slug>.webp — used when a project has no demo]
> [ADD: nestulabs.com font name — the site keeps Schibsted Grotesk until then]
