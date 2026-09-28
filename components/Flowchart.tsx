import { readFileSync } from "node:fs";
import { join } from "node:path";
import flowchartMeta from "@/content/generated/flowcharts.json";

type FlowchartName = keyof typeof flowchartMeta;

const cache = new Map<string, string>();

/** Home-page thumbnails are capped at this height; full size lives on the case study. */
const PREVIEW_MAX_HEIGHT = 180;

/**
 * Inlines a pre-rendered SVG. Inlining (rather than an <img>) is what lets the
 * diagram use the page's JetBrains Mono, and lets screen readers reach its
 * <title> and <desc>.
 *
 * The renderer writes `__UID__` wherever the SVG needs an id. Each instance
 * swaps in its own prefix, so the same diagram can appear twice on a page
 * without two elements sharing an id.
 */
function loadSvg(name: string, variant: "full" | "preview", uid: string): string {
  const file = variant === "preview" ? `${name}.preview.svg` : `${name}.svg`;
  const key = `${file}`;
  let svg = cache.get(key);
  if (!svg) {
    svg = readFileSync(join(process.cwd(), "public", "flowcharts", file), "utf8");
    cache.set(key, svg);
  }
  return svg.split("__UID__").join(uid);
}

export function isFlowchart(name: string): name is FlowchartName {
  return Object.prototype.hasOwnProperty.call(flowchartMeta, name);
}

export function flowchartDescription(name: FlowchartName): string {
  return flowchartMeta[name].description;
}

export function Flowchart({
  name,
  variant = "full",
  caption,
  className = "",
}: {
  name: FlowchartName;
  variant?: "full" | "preview";
  caption?: string;
  className?: string;
}) {
  const meta = flowchartMeta[name];
  const size = variant === "preview" ? meta.preview : meta.full;
  const uid = `fc-${name}-${variant}`;
  const svg = loadSvg(name, variant, uid);

  // A preview scales to fit its column and is capped at 180px tall. Capping
  // the width at the aspect-equivalent of 180px is what enforces the height
  // without breaking the aspect ratio.
  const previewMaxWidth = Math.round((size.width * PREVIEW_MAX_HEIGHT) / size.height);

  return (
    <figure className={`not-prose ${className}`}>
      {variant === "preview" ? (
        <div className="rounded border border-rule bg-surface p-3">
          <div
            className="mx-auto w-full"
            style={{ maxWidth: `${previewMaxWidth}px` }}
            // The SVG is generated at build time by scripts/render-flowcharts.mjs
            // from markdown in this repo. No user input reaches it.
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      ) : (
        <div className="diagram-scroll rounded border border-rule bg-surface p-4">
          <div
            className="mx-auto"
            // Full size is never scaled down — the box scrolls instead, so
            // labels stay readable at 360px wide.
            style={{ width: `${size.width}px` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      )}
      {caption ? (
        <figcaption className="mt-3 text-sm leading-relaxed text-graphite">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
