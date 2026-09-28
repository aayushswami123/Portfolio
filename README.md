# Portfolio rebuild kit — aayushswami.com

## What's inside
- `CLAUDE.md` — the brief Claude Code reads automatically
- `docs/DESIGN.md` — colors, fonts, layout, what to avoid
- `docs/ASK-ABOUT-ME.md` — spec for the AI box in the hero
- `docs/ASSETS-TODO.md` — what you need to gather
- `content/CONTENT.md` — every word on the site
- `content/case-studies/` — three case study pages
- `content/FLOWCHARTS.md` — every flowchart that must be built
- `content/ask-system-prompt.md` — the AI box's instructions
- `public/llms.txt`, `public/person-jsonld.json` — AI visibility files

## How to use it
1. Copy everything in this folder into the root of your portfolio repo.
   (If your repo already has a CLAUDE.md, merge them.)
2. In your terminal, from the repo root:
   ```
   git checkout -b redesign-2026
   claude
   ```
3. Paste this as your first message:

   > Read CLAUDE.md, docs/DESIGN.md, docs/ASK-ABOUT-ME.md, content/ask-system-prompt.md, content/CONTENT.md, content/FLOWCHARTS.md, and all files in
   > content/case-studies. Then inspect this repo and tell me your plan in under
   > 10 lines. Don't write code until I say go.

4. After it builds, ask: "Run Lighthouse on mobile, check all links, and list every
   [ADD] and [CHECK] still left."
5. Fill in the placeholders from `docs/ASSETS-TODO.md`, then merge to main.
