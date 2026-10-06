# Design brief — light, modern, one strong accent

## The idea
Aayush is three things at once: an engineer at a company, a researcher, and a founder
with a signed partnership. The site sits in the same family as nestulabs.com: clean,
light, modern UI, one strong accent, and smooth motion that has a reason to exist.
Not a static document. Not a generic template.

## Aayush's choices (locked)
- **Feel:** clean, light, modern. Precise, but alive.
- **Balance:** engineer, researcher, and founder get equal weight. No side dominates.
- **Standout element:** an "Ask about me" AI box in the hero.
- **Signature detail:** the scroll spine in the left gutter (see Layout).

## Color
| Token       | Hex       | Use |
|-------------|-----------|-----|
| Surface     | `#F8F8F6` | page background |
| Card        | `#FFFFFF` | panels |
| Inset       | `#F1F3F6` | areas inside a panel (diagram and media wells). Background only, never a border |
| Ink         | `#0F0F0F` | headings, body |
| Graphite    | `#5E6168` | secondary text, dates |
| Rule        | `#E6E6E2` | borders, dividers, the unfilled spine |
| Accent      | `#6C47FF` | buttons, links, focus, active states — the only accent |
| Accent-soft | `#F1EDFF` | badge and hover backgrounds |
| Live        | `#1C7C54` | the small "live" dot, nothing else |

Contrast (WCAG 2.1, all pass AA for body text):

| Pair | Ratio |
|---|---|
| Accent text on Surface | 4.96 |
| Accent text on Card | 5.27 |
| Accent text on Accent-soft (badge) | 4.59 |
| Accent text on Inset | 4.74 |
| White on Accent (primary button) | 5.27 |
| Graphite on Surface | 5.83 |
| Graphite on Inset | 5.58 |

## Type
- **Schibsted Grotesk** for everything. Swap for the nestulabs.com face once its name
  is confirmed.
- **JetBrains Mono** only for diagram labels and code. Never for UI labels.
- Name: 72px desktop / 44px mobile, 700, -0.03em. The name never animates.
- Section headings: "Selected work" 40px; other sections 28px; small sections
  (Recent, Skills, More projects) 20px. Mobile steps each down one size.
- Body: 17px desktop / 16px mobile, line height 1.6, max 68ch.
- Sentence case everywhere. No all-caps labels.

## Layout
- Max content width 1120px. At >=1280px a 136px left gutter is added beside it.
- **Hero, >=1024px:** two columns. Left 7/12: name, pitch, bio, education line, buttons.
  Right 5/12: the Ask panel. Buttons stay above the fold at 1280x800.
- **Logo strip** under the hero: grayscale logos, 24px tall, a label under each, each a
  link. Only logos whose file exists in `public/logos/` render. Qualcomm is text only.
- **Margin index (>=1280px):** each section after the hero shows its name in the gutter,
  sticky while the section is on screen. Graphite by default; the current one turns Ink.
- **Scroll spine (signature):** a 1px Rule line runs down the gutter beside the margin
  index. An Accent line fills it as you scroll, and each label's dot fills once the
  Accent line reaches it. Same idea as the "How we build" spine on nestulabs.com, quieter.
- **Project panels, >=1024px:** text left (5/12), media right (7/12). The description is
  two lines at most on desktop.
- **Hackathon panels:** two side by side at >=1024px, stacked below that.
- **Closing section** merges about, leadership, and contact.

## Components
- **Panels:** 1px Rule border, 12px radius, Card background, no shadow.
  Hover: border turns Accent at 40% opacity. No hover lift, no scale.
- **No nested borders.** Anything inside a panel uses an Inset background with no
  border. The one exception is a form input, which keeps its 1px Rule border.
- **Buttons:** primary = Accent fill, white text, 10px radius. Secondary = Card fill,
  Rule border. Press state scales to 0.98, nothing else.
- **Award badge:** Accent-soft background, Accent text, 13px, 6px radius.
- **Links:** Accent, 1px underline offset 3px; the underline thickens on hover.
- **Figures:** every screenshot, demo, and diagram has a numbered caption, in page order:
  "Fig. 3 — PR Lifeguard sorting open pull requests."
- **Project media fallback:** demo video, then screenshot (`public/work/<slug>.webp`),
  then diagram. The diagram is always still on the case study page.
- **Demos:** `public/demos/<slug>.mp4` + `<slug>-poster.webp`. Poster with a small
  "Play demo · 0:30" button; click plays inline, muted, controls on, `preload="none"`,
  never autoplay. Max 40 s, 1280px wide, H.264, under 6 MB (`npm run demos:check`).
- **Diagrams:** hand-authored SVG in `content/diagrams.ts`. Straight lines and right
  angles only, no crossings. Ink lines and text, Card nodes, transparent background so
  they sit on Inset. Every diagram has a `<title>` and a one-sentence `<desc>`.
- **Ask panel:** one Card panel. The input has a 1px Rule border only. The Ask button is
  always Accent and dims only while an answer is loading.

## Motion — exactly these, nothing else
1. **Hero pitch:** reveals word by word once on load (~700ms total, 40ms stagger, slight
   upward move). The name does not animate.
2. **Ask panel:** an Accent line grows under the input while an answer streams; the
   answer text streams in.
3. **Scroll spine** (Layout), driven by Framer Motion `useScroll`, correct on first load.
4. **Diagrams:** the main path draws itself (stroke-dashoffset, ~800ms) the first time
   the diagram is 50% on screen. On hover, the main path turns Accent.
5. **Project media:** demo posters scale from 0.96 to 1 on first view (once, 400ms).
   Videos never autoplay.

Under `prefers-reduced-motion` all of it is off. CLS stays at 0 and Lighthouse
performance stays at 95 or above.

## Avoid
- Fade-up on every section, parallax, cursor effects, gradient blobs, looping animation.
- Numbered section markers ("01 — About") and tiny all-caps labels above headings.
- Italic or colored single words inside headlines.
- Shadows on cards, hover lift, nested borders.
- "→" glued to every link.
