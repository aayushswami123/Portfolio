# CLAUDE.md — aayushswami.com rebuild

You are rebuilding Aayush Swami's portfolio at aayushswami.com. This file is the brief.
Read it fully, then read `content/CONTENT.md`, `content/FLOWCHARTS.md`, `content/case-studies/*`, and `docs/DESIGN.md`
before writing any code.

## Step 0 — Look before you touch anything
1. Inspect the existing repo: framework, build tool, hosting config, where assets live.
2. Keep the existing hosting/deploy setup unless it blocks the plan. Do not change the domain setup.
3. **Start fresh.** Create a new Next.js (App Router) + TypeScript + Tailwind project.
   Do not patch the old site. From the old repo, copy over only images, the resume PDF,
   and hosting/domain config.
   Pages are static. The only server code is the "Ask about me" endpoint (see below).
   Check where the site is hosted and pick the matching option:
   Vercel → Next.js route handler. Cloudflare → a Worker. GitHub Pages or other static host
   → a separate Cloudflare Worker at `ask.aayushswami.com`. Ask Aayush if unclear.
4. Make a new branch: `redesign-2026`. Never push to main without asking.
5. Tell Aayush your plan in 5–10 lines and wait for "go" before big changes.

## Goal (one sentence)
A recruiter should understand in 10 seconds: who Aayush is, what he has shipped,
and how to contact him — and should be able to click something real within 30 seconds.

## Audience
- Recruiters (scan fast, often on a phone)
- Hiring managers / engineers (open case studies, check GitHub)
- Startup founders and partners (NestuLabs side)

## Hard rules
- **Light theme only.** No dark mode toggle for v1.
- **Content comes from `content/CONTENT.md`.** Do not invent facts, metrics, dates, or links.
  Anything marked `[ADD: ...]` or `[CHECK: ...]` must be shown to Aayush as a TODO list at
  the end, not filled with made-up values. If a placeholder is still empty at build time,
  hide that line — never ship brackets to production.
- **No animated number counters.** The old site showed "GPA 0" to crawlers. All numbers
  must be real text in the HTML.
- **Work first.** Projects and experience come before any long "about" text.
- Keep all content in typed data files (`/content/*.ts` or `.json`), not hard-coded in JSX,
  so Aayush can update text without touching components.
- Every external link must work. Write a tiny script (`npm run check-links`) that checks them.
- Never put visa, work-authorization, date of birth, or home address on the site.

## Pages
- `/` — home (all main sections, see CONTENT.md)
- `/work/agentic-trading` — case study
- `/work/crdt-engine` — case study
- `/work/nestulabs-ai-visibility` — case study (add once Aayush supplies numbers; stub is OK)
- `/resume` — redirects to the current resume PDF
- 404 page in the same style

## "Ask about me" AI box (the hero's standout feature)
Read the spec in `docs/ASK-ABOUT-ME.md` and the prompt in `content/ask-system-prompt.md`.
It runs on **Qualcomm Cloud AI 100** through an OpenAI-compatible API.
Write the endpoint from scratch, no LangChain. It must feel fast and polished. A slow or broken box is worse than no box — so the
fallback state is required, not optional.

## Flowcharts (required — do not skip)
- Build every diagram listed in `content/FLOWCHARTS.md`. Sources are Mermaid blocks in
  that file and in `content/case-studies/`.
- Render them to static SVG at build time (e.g. `@mermaid-js/mermaid-cli` in a prebuild
  script) and style them to match `docs/DESIGN.md`: Ink lines and text on Surface,
  Cobalt for the main path, JetBrains Mono for node labels, no drop shadows, no gradients.
- On the home page, each featured project shows a small version of its flowchart.
  Clicking it opens the full-size version on the case study page.
- Every SVG needs a text description (`<title>` + `aria-describedby`) that explains the
  flow in one sentence, so screen readers and AI crawlers can read it.
- Diagrams must stay readable at 360px wide (scroll inside their own box if needed).

## SEO / AI visibility (this matters — Aayush sells this service)
- Copy `public/llms.txt` to the site root.
- Add the JSON-LD from `public/person-jsonld.json` in the `<head>` of every page.
- Proper `<title>`, meta description, canonical URL, Open Graph + Twitter image
  (generate a clean OG image: name + one-line pitch, light theme).
- `sitemap.xml` and `robots.txt` (allow all, including AI crawlers).
- Semantic HTML: one `<h1>` per page, real `<section>`s, alt text on every image.

## Quality bar
- Lighthouse 95+ on Performance, Accessibility, Best Practices, SEO (mobile).
- Works at 360px wide. Test 360, 768, 1280, 1600.
- Visible keyboard focus. `prefers-reduced-motion` respected.
- Images: WebP/AVIF, lazy-loaded, sized. Total home page under ~500 KB before images.
- No layout shift from fonts (use `next/font`).

## Done checklist (show this to Aayush at the end)
- [ ] All placeholders listed as a TODO for Aayush
- [ ] Links checked
- [ ] Lighthouse scores pasted
- [ ] Screenshots at mobile + desktop
- [ ] Ask box: streaming works, rate limit works, fallback works with API key removed
- [ ] All flowcharts from FLOWCHARTS.md rendered as SVG
- [ ] llms.txt, JSON-LD, sitemap, OG image live
- [ ] Old resume link replaced
