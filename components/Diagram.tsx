import { DrawOnView } from "@/components/DrawOnView";
import {
  diagrams,
  type DiagramDef,
  type DiagramEdge,
  type DiagramName,
  type Point,
} from "@/content/diagrams";

const INK = "#0F0F0F";
const GRAPHITE = "#5E6168";
const CARD = "#FFFFFF";
const LINE_HEIGHT = 16;
const HEAD_LENGTH = 7;
const HEAD_HALF_WIDTH = 4;

/** Smallest scale a diagram may shrink to before its box scrolls instead. */
const MIN_SCALE = 0.8;

function assertOrthogonal(name: string, points: Point[]) {
  if (process.env.NODE_ENV === "production") return;
  for (let i = 1; i < points.length; i += 1) {
    const [ax, ay] = points[i - 1]!;
    const [bx, by] = points[i]!;
    if (ax !== bx && ay !== by) {
      throw new Error(
        `Diagram "${name}": segment (${ax},${ay}) -> (${bx},${by}) is diagonal. ` +
          "Straight lines and right angles only.",
      );
    }
  }
}

/** A filled arrowhead whose tip sits on `tip`, pointing away from `from`. */
function arrowhead(from: Point, tip: Point): string {
  const dx = Math.sign(tip[0] - from[0]);
  const dy = Math.sign(tip[1] - from[1]);
  const baseX = tip[0] - dx * HEAD_LENGTH;
  const baseY = tip[1] - dy * HEAD_LENGTH;
  // Perpendicular to the segment: swap the axes.
  const px = dy * HEAD_HALF_WIDTH;
  const py = dx * HEAD_HALF_WIDTH;
  return `${tip[0]},${tip[1]} ${baseX + px},${baseY + py} ${baseX - px},${baseY - py}`;
}

function heads(edge: DiagramEdge): string[] {
  const { points, arrow = "end" } = edge;
  if (arrow === "none") return [];
  const end = arrowhead(points[points.length - 2]!, points[points.length - 1]!);
  if (arrow === "end") return [end];
  return [end, arrowhead(points[1]!, points[0]!)];
}

/**
 * A hand-authored diagram from content/diagrams.ts, inlined as static SVG.
 * Inlining is what lets it use the page's JetBrains Mono, expose its <title>
 * and <desc> to screen readers, and animate its main path.
 *
 * `uid` must be unique on the page; it prefixes the <title>/<desc> ids.
 */
export function Diagram({ name, uid }: { name: DiagramName; uid: string }) {
  const def: DiagramDef = diagrams[name];
  const titleId = `${uid}-title`;
  const descId = `${uid}-desc`;

  return (
    <DrawOnView className="dg diagram-scroll">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${def.width} ${def.height}`}
        role="img"
        aria-labelledby={titleId}
        aria-describedby={descId}
        fontFamily="var(--font-mono), ui-monospace, SFMono-Regular, monospace"
        className="mx-auto block h-auto w-full"
        style={{ maxWidth: def.width, minWidth: Math.round(def.width * MIN_SCALE) }}
      >
        <title id={titleId}>{def.title}</title>
        <desc id={descId}>{def.description}</desc>

        {def.edges.map((edge, index) => {
          assertOrthogonal(name, edge.points);
          const d = edge.points
            .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`)
            .join(" ");
          return (
            <g key={`edge-${index}`}>
              <path
                d={d}
                fill="none"
                stroke={INK}
                strokeWidth={edge.main ? 1.5 : 1}
                strokeLinejoin="miter"
                className={edge.main ? "dg-main" : undefined}
                pathLength={edge.main ? 1 : undefined}
              />
              {heads(edge).map((pointsAttr) => (
                <polygon
                  key={pointsAttr}
                  points={pointsAttr}
                  fill={INK}
                  className={edge.main ? "dg-head" : undefined}
                />
              ))}
              {edge.label ? (
                <text
                  x={edge.label.x}
                  y={edge.label.y}
                  textAnchor={edge.label.anchor ?? "middle"}
                  fill={GRAPHITE}
                  fontSize={11}
                >
                  {edge.label.text}
                </text>
              ) : null}
            </g>
          );
        })}

        {def.nodes.map((node) => {
          const cx = node.x + node.w / 2;
          const cy = node.y + node.h / 2;
          const top = cy - ((node.lines.length - 1) * LINE_HEIGHT) / 2;
          return (
            <g key={`${node.x}-${node.y}`}>
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx={6}
                fill={CARD}
                stroke={INK}
                strokeWidth={1}
              />
              {node.lines.map((line, i) => (
                <text
                  key={line}
                  x={cx}
                  y={top + i * LINE_HEIGHT}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={INK}
                  fontSize={12}
                >
                  {line}
                </text>
              ))}
            </g>
          );
        })}
      </svg>
    </DrawOnView>
  );
}
