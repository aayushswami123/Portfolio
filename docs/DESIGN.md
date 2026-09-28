# Design brief — "Engineer who ships" (light theme)

## The idea
Aayush is three things at once: an engineer at a company, a researcher, and a founder
with a signed partnership. The site should feel like **a clean engineering spec sheet** —
precise, calm, confident. Not a template. Not a résumé pasted onto a web page.

## Aayush's choices (locked)
- **Feel:** calm and precise, like a clean spec sheet.
- **Balance:** engineer, researcher, and founder get equal weight. No side dominates.
- **Standout element:** an "Ask about me" AI box in the hero.

## The one bold element: the "Ask about me" box
All the boldness goes here. Everything else stays quiet.
- Sits in the hero, right under the pitch, full width of the text column.
- Looks like a precise input field, not a chat bubble app: 1px Ink border, Surface
  background, 6px radius, generous height (56px), placeholder
  "Ask anything about my work — e.g. what did you build at Rolston Lab?"
- Under it, 3–4 suggested questions as plain text buttons (Rule border, no fill).
  Clicking one asks it right away.
- The answer appears **inline below the box**, streaming, in normal body text —
  like a spec-sheet note. No floating chat widget, no avatars, no typing dots.
- Every answer ends with 1–2 small links to the matching section or case study,
  so the box sends people deeper into the site.
- One subtle moment: a thin Cobalt line grows under the box while the answer streams.
  That is the only motion on the page.
- Keyboard: `/` focuses the box. Enter sends. Esc clears.
- If the AI is down or rate-limited, show 3 ready-made answers and an "Email me" button.
  The hero must never look broken.

## Shipping log (secondary now)
Keep the dated milestone list, but move it below the proof row as a quiet
"Recent" list. No animation. Newest 5 entries.

## Equal three sides
- Status line names all three roles in one sentence.
- Each featured project has a small plain-text tag: Engineering, Research, or Founder.
  This is real information, so it's allowed. Sentence case, Graphite, no pill shapes.
- Featured work order: NestuLabs (Founder), CRDT engine (Engineering),
  Rolston research (Research), Agentic trading (Research + Engineering).

## Color
| Name     | Hex       | Use |
|----------|-----------|-----|
| Paper    | `#F7F8FA` | page background (cool white, not cream) |
| Surface  | `#FFFFFF` | case study panels, diagrams |
| Ink      | `#14171C` | headings and body text |
| Graphite | `#5A6170` | secondary text, dates |
| Rule     | `#E2E5EA` | borders, dividers |
| Cobalt   | `#2344D0` | links, primary button, focus ring — the only accent |
| Live     | `#1C7C54` | small "live" dot next to shipped products only |

Check contrast: Graphite on Paper must pass AA for body size.

## Type
- **Schibsted Grotesk** (Google Fonts) for everything: headings 600–700, body 400.
  Tight tracking on big headings (-0.02em), normal on body.
- **JetBrains Mono** only inside code blocks and diagram labels. Not for small UI labels.
- Scale (rem): 0.875 / 1 / 1.25 / 1.563 / 1.953 / 2.441 / 3.815 (hero name).
- Body line length 60–75 characters. Line height 1.6 body, 1.1 headings.
- Sentence case everywhere. No all-caps labels.

## Layout
Left-aligned, single strong column with a right-hand column used only when it earns it.

```
Desktop page
+-----------------------------------------------------------+
| Aayush Swami                                              |
| I build AI systems people actually use —                  |
| agents, search, and the backend underneath.               |
| Engineer · Researcher · Founder status line               |
| +-------------------------------------------------------+ |
| | Ask anything about my work...                  [Ask] | |
| +-------------------------------------------------------+ |
| What did you build at Rolston Lab?   What is NestuLabs?   |
| (streamed answer appears here, with links)                |
| [Download resume] [GitHub] [Email me]                     |
+-----------------------------------------------------------+
| Proof row: Cloudwick, SHOPLINE, Qualcomm capstone,         |
| Rolston Lab, FURI  (plain text or single-color logos)      |
+-----------------------------------------------------------+
| Recent (shipping log, 5 quiet dated lines)                |
+-----------------------------------------------------------+
| Selected work  (2x2 on desktop, stacked on mobile)        |
|  each item: title, one-line problem, what I built,        |
|  1–3 numbers, stack, [Case study] [Live] [Code]           |
+-----------------------------------------------------------+
| Experience (rows: company | role | dates | one result)    |
| More projects (compact list, one line each)               |
| Leadership & community (one line each)                    |
| Contact                                                   |
+-----------------------------------------------------------+
```

Max content width ~1120px. Generous vertical space between sections (96–128px desktop).

## Avoid (these make a site look generated)
- Numbered section markers ("01 — About"). The old site had these; remove them.
- A tiny all-caps label above every heading.
- Italic or colored single word inside headlines ("Things I've *built*"). Remove.
- Identical rounded cards with soft grey shadows everywhere. Use borders (Rule) and
  spacing instead; radius 6px on buttons and images only.
- Fade-up animation on every section. Hover lift on every card.
- Gradient blobs, glassmorphism, cursor followers, particle backgrounds.
- "→" glued to every link.

## Components
- **Buttons:** primary = Cobalt fill, white text. Secondary = Ink text, Rule border.
  Labels say what happens: "Download resume", "Email me", "Read case study".
- **Project item:** title (h3), one-line problem, 2–3 line "what I built", a row of
  up to 3 metrics (number + short plain label), stack as plain comma text, links.
- **Diagrams:** render the Mermaid diagrams from the case studies as clean SVGs
  (Ink lines on Surface, Cobalt for the key path). Pre-render at build time.
- **Case study page:** narrow reading column (~680px), diagram full width of column,
  sections: Problem → What I built → Key decisions → Results → What I'd do next.

## Other directions (if Aayush wants to switch later)
- **Lab notebook:** off-white paper, faint grid, blue-ink accent; projects as research entries.
- **Calm product site:** soft grey-white, big type, one large screenshot per project.
