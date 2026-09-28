/**
 * A small parser for the subset of Mermaid used in this repo's flowcharts:
 * `flowchart LR` / `flowchart TD`, rectangle / cylinder / diamond / round nodes,
 * `-->`, `<-->`, `---`, and `|edge labels|`.
 *
 * It is deliberately not a general Mermaid implementation. If a future diagram
 * needs syntax this does not cover, the render script fails loudly rather than
 * silently dropping part of the graph.
 */

const NODE_SHAPES = [
  { open: "[(", close: ")]", shape: "cylinder" },
  { open: "((", close: "))", shape: "circle" },
  { open: "([", close: "])", shape: "stadium" },
  { open: "{", close: "}", shape: "diamond" },
  { open: "[", close: "]", shape: "rect" },
  { open: "(", close: ")", shape: "round" },
];

const CONNECTORS = ["<-->", "-->", "<--", "---", "--"];

/** Split a node spec like `A[Some<br/>label]` into id, shape and label lines. */
function parseNodeSpec(spec) {
  const text = spec.trim();
  const idMatch = /^([A-Za-z_][A-Za-z0-9_]*)/.exec(text);
  if (!idMatch) throw new Error(`Cannot read node id from: ${spec}`);
  const id = idMatch[1];
  const rest = text.slice(id.length).trim();
  if (rest === "") return { id, shape: null, lines: null };

  for (const { open, close, shape } of NODE_SHAPES) {
    if (rest.startsWith(open) && rest.endsWith(close)) {
      const raw = rest.slice(open.length, rest.length - close.length);
      return { id, shape, lines: splitLabel(raw) };
    }
  }
  throw new Error(`Cannot read node shape from: ${spec}`);
}

function splitLabel(raw) {
  return raw
    .split(/<br\s*\/?>/i)
    .map((line) => line.trim().replace(/^["']|["']$/g, ""))
    .filter((line) => line.length > 0);
}

/** Find the first connector at the top level of a line. */
function findConnector(line, from) {
  let best = null;
  for (const token of CONNECTORS) {
    const index = line.indexOf(token, from);
    if (index === -1) continue;
    // Prefer the earliest match; on a tie prefer the longest token so that
    // `-->` is never read as `--` followed by `>`.
    if (
      best === null ||
      index < best.index ||
      (index === best.index && token.length > best.token.length)
    ) {
      best = { index, token };
    }
  }
  return best;
}

/**
 * Parse one mermaid flowchart block into { direction, nodes, edges }.
 * Chained edges (`A --> B --> C`) are expanded into separate edges.
 */
export function parseFlowchart(source) {
  const lines = source
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("%%"));

  const header = lines.shift();
  const headerMatch = /^(?:flowchart|graph)\s+(LR|RL|TD|TB|BT)$/i.exec(header ?? "");
  if (!headerMatch) throw new Error(`Unsupported flowchart header: ${header}`);
  const direction = headerMatch[1].toUpperCase();

  /** @type {Map<string, {id: string, shape: string, lines: string[]}>} */
  const nodes = new Map();
  const edges = [];

  const remember = (spec) => {
    const parsed = parseNodeSpec(spec);
    const existing = nodes.get(parsed.id);
    if (!existing) {
      nodes.set(parsed.id, {
        id: parsed.id,
        shape: parsed.shape ?? "rect",
        lines: parsed.lines ?? [parsed.id],
      });
    } else if (parsed.lines) {
      // A later mention carries the real label.
      existing.shape = parsed.shape ?? existing.shape;
      existing.lines = parsed.lines;
    }
    return parsed.id;
  };

  for (const line of lines) {
    let cursor = 0;
    let previous = null;

    while (cursor < line.length) {
      const connector = findConnector(line, cursor);
      if (!connector) {
        // Trailing node, or a standalone node declaration.
        const tail = line.slice(cursor).trim();
        if (tail) {
          const id = remember(tail);
          if (previous) edges.push({ ...previous, to: id });
        }
        break;
      }

      const leftSpec = line.slice(cursor, connector.index).trim();
      const fromId = leftSpec ? remember(leftSpec) : previous?.to;
      if (!fromId) throw new Error(`Edge with no source: ${line}`);
      if (previous && leftSpec) edges.push({ ...previous, to: fromId });

      cursor = connector.index + connector.token.length;

      // Optional |label| directly after the connector.
      let label = null;
      const labelMatch = /^\s*\|([^|]*)\|/.exec(line.slice(cursor));
      if (labelMatch) {
        label = labelMatch[1].trim();
        cursor += labelMatch[0].length;
      }

      previous = {
        from: fromId,
        label,
        bidirectional: connector.token === "<-->",
        arrow: connector.token !== "---" && connector.token !== "--",
        reverse: connector.token === "<--",
      };
    }
  }

  return { direction, nodes: [...nodes.values()], edges: dedupe(edges) };
}

function dedupe(edges) {
  const seen = new Set();
  const out = [];
  for (const edge of edges) {
    if (!edge.from || !edge.to) continue;
    const key = `${edge.from}->${edge.to}|${edge.label ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(edge.reverse ? { ...edge, from: edge.to, to: edge.from } : edge);
  }
  return out;
}

/** Pull every ```mermaid fenced block out of a markdown string. */
export function extractMermaidBlocks(markdown) {
  const blocks = [];
  const pattern = /```mermaid\s*\n([\s\S]*?)```/g;
  let match;
  while ((match = pattern.exec(markdown)) !== null) blocks.push(match[1].trim());
  return blocks;
}
