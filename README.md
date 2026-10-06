# aayushswami.com

Portfolio for Aayush Swami. Next.js (App Router) + TypeScript + Tailwind, light theme only,
static pages plus one serverless endpoint for the "Ask about me" box.

The brief is `CLAUDE.md`. Design tokens and rules are `docs/DESIGN.md`. Every word on the
site comes from `content/CONTENT.md`.

## Run it

```bash
npm install
cp .env.example .env.local   # optional; without it the ask box shows its fallback
npm run dev                  # http://localhost:3000
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Build content, then start the dev server |
| `npm run build` | `prebuild` regenerates content, then `next build` |
| `npm run build-content` | Rebuild the ask-box knowledge file |
| `npm run demos:check` | Warn about demo videos over 6 MB or 40 s, or missing posters |
| `npm run check-links` | Fetch every external link and resolve every internal one (`-- --local` skips the network) |
| `npm run todos` | List every `[ADD]` / `[CHECK]` still outstanding, and missing files |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |

## How content works

Copy lives in typed data files — `content/site.ts`, `content/work.ts`,
`content/hackathons.ts`, `content/logos.ts`, `content/case-studies.ts` — so text changes
never touch a component.

A placeholder from `CONTENT.md` is modelled as `null`, not as a string. Components drop
`null` values before rendering, so a missing value renders as nothing and brackets can
never ship. `npm run todos` is the punch list of what is still `null`.

## Diagrams

Diagrams are hand-authored in `content/diagrams.ts`: every box and line has explicit
coordinates, with straight lines and right angles only and no crossings. There is no
layout engine or edge router. `components/Diagram.tsx` renders them as inline static SVG
in the page HTML, each with a `<title>` and `<desc>` for screen readers and AI crawlers,
and refuses a diagonal segment in development.

To add a diagram, add an entry to `content/diagrams.ts` with its one-sentence description
and caption. The Mermaid blocks in the markdown files are kept as the readable source of
what each diagram shows.

## Media

Project panels show, in order: a demo (`public/demos/<slug>.mp4` +
`<slug>-poster.webp`), else a screenshot (`public/work/<slug>.webp`), else the diagram.
Logos render once their file is in `public/logos/` (filenames in `content/logos.ts`).

## "Ask about me"

Spec: `docs/ASK-ABOUT-ME.md`. Prompt: `content/ask-system-prompt.md`.

`app/api/ask/route.ts` calls any OpenAI-compatible chat API with plain `fetch` — no SDK, no
LangChain. The provider is three environment variables:

```
AI_BASE_URL=   # e.g. the Qualcomm Cloud AI 100 endpoint, without /chat/completions
AI_API_KEY=
AI_MODEL=
```

Switching providers is a config change. With any of the three unset, the endpoint returns
`{ fallback: true }` and the box shows five prewritten answers (the one just asked first) plus an "Email me" button —
the hero never looks broken.

Rate limits (10/IP/hour, 40/IP/day, 1,000/day globally) use Upstash Redis when
`UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, and per-instance memory
otherwise. `SITE_ORIGIN` overrides the allowed Origin.

The knowledge file is rebuilt on every deploy from `CONTENT.md` and the case studies, with
every `[ADD]` / `[CHECK]` line stripped, so the model cannot read a placeholder back to a
visitor.

## Deploying

Vercel. Set `AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL` (and the Upstash pair) as project
environment variables. Put `Aayush_Swami_Resume_2026.pdf` in `public/` — until it is there,
`/resume` redirects to `/#contact` rather than 404ing.
