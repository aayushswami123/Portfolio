/**
 * Layered layout + SVG emitter for the parsed flowcharts.
 *
 * Styling is fixed by docs/DESIGN.md: Ink lines and text on Surface, Cobalt for
 * the main path, JetBrains Mono for labels, no shadows, no gradients.
 */

const COLOR = {
  surface: "#FFFFFF",
  ink: "#14171C",
  graphite: "#5A6170",
  rule: "#E2E5EA",
  cobalt: "#2344D0",
};

/** JetBrains Mono advance width as a fraction of font size. */
const MONO_ADVANCE = 0.6;

export const PRESETS = {
  full: { fontSize: 13, edgeFontSize: 11, padX: 14, padY: 11, gapX: 64, gapY: 26, lineHeight: 1.35 },
  /**
   * The home page shows each diagram inside a half-width card. A wide
   * left-to-right diagram scaled into that column drops its labels to about
   * 9px. Turning the preview top-to-bottom makes it narrow instead of wide, so
   * it fits the column at full size and stays readable at 360px too.
   */
  preview: {
    fontSize: 13,
    edgeFontSize: 11,
    padX: 13,
    padY: 10,
    gapX: 34,
    gapY: 18,
    lineHeight: 1.3,
    direction: "TD",
  },
};

function textWidth(text, fontSize) {
  return text.length * fontSize * MONO_ADVANCE;
}

/** Mark edges that close a cycle so layering can ignore them. */
function findBackEdges(nodeIds, edges) {
  const outgoing = new Map(nodeIds.map((id) => [id, []]));
  edges.forEach((edge, index) => outgoing.get(edge.from)?.push({ index, to: edge.to }));

  const state = new Map(nodeIds.map((id) => [id, "white"]));
  const back = new Set();

  const visit = (start) => {
    const stack = [{ id: start, next: 0 }];
    state.set(start, "grey");
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const children = outgoing.get(frame.id) ?? [];
      if (frame.next >= children.length) {
        state.set(frame.id, "black");
        stack.pop();
        continue;
      }
      const child = children[frame.next++];
      const childState = state.get(child.to);
      if (childState === "grey") {
        back.add(child.index);
      } else if (childState === "white") {
        state.set(child.to, "grey");
        stack.push({ id: child.to, next: 0 });
      }
    }
  };

  for (const id of nodeIds) if (state.get(id) === "white") visit(id);
  return back;
}

/**
 * Longest-path layering over the acyclic part of the graph, then a pull-right
 * pass: a node nothing points at is moved to sit directly before its earliest
 * target. Without it, a late input like the ask box's knowledge file lands in
 * layer 0 and drags a long wire across the whole diagram.
 */
function assignLayers(nodeIds, forwardEdges) {
  const layer = new Map(nodeIds.map((id) => [id, 0]));
  // Relax repeatedly; the graphs here are tiny so |V| passes is plenty.
  for (let pass = 0; pass < nodeIds.length; pass += 1) {
    let changed = false;
    for (const edge of forwardEdges) {
      const candidate = layer.get(edge.from) + 1;
      if (candidate > layer.get(edge.to)) {
        layer.set(edge.to, candidate);
        changed = true;
      }
    }
    if (!changed) break;
  }

  const hasParent = new Set(forwardEdges.map((edge) => edge.to));
  for (const id of nodeIds) {
    if (hasParent.has(id)) continue;
    const targets = forwardEdges.filter((edge) => edge.from === id);
    if (targets.length === 0) continue;
    const earliest = Math.min(...targets.map((edge) => layer.get(edge.to)));
    layer.set(id, Math.max(0, earliest - 1));
  }

  // Re-normalise so the first layer is 0 and there are no gaps.
  const used = [...new Set([...layer.values()])].sort((a, b) => a - b);
  const remap = new Map(used.map((value, index) => [value, index]));
  for (const [id, value] of layer) layer.set(id, remap.get(value));
  return layer;
}

/**
 * The "main path" is the longest chain of forward edges. DESIGN.md asks for it
 * in Cobalt so the eye has one route to follow through every diagram.
 */
function findMainPath(nodeIds, forwardEdges) {
  const outgoing = new Map(nodeIds.map((id) => [id, []]));
  for (const edge of forwardEdges) outgoing.get(edge.from).push(edge);

  const best = new Map();
  const order = [...nodeIds].sort(
    (a, b) => (outgoing.get(b)?.length ?? 0) - (outgoing.get(a)?.length ?? 0),
  );

  const walk = (id, seen) => {
    if (best.has(id)) return best.get(id);
    let longest = { length: 0, edges: [] };
    for (const edge of outgoing.get(id) ?? []) {
      if (seen.has(edge.to)) continue;
      seen.add(edge.to);
      const tail = walk(edge.to, seen);
      seen.delete(edge.to);
      if (tail.length + 1 > longest.length) {
        longest = { length: tail.length + 1, edges: [edge, ...tail.edges] };
      }
    }
    best.set(id, longest);
    return longest;
  };

  let winner = { length: 0, edges: [] };
  for (const id of order) {
    const result = walk(id, new Set([id]));
    if (result.length > winner.length) winner = result;
  }
  return new Set(winner.edges);
}

function escapeXml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Build the SVG. `direction` LR/TD only affects which axis layers advance on.
 */
export function renderSvg({ graph, preset, title, description }) {
  const style = PRESETS[preset];
  const { nodes, edges } = graph;
  const direction = style.direction ?? graph.direction;
  const vertical = direction === "TD" || direction === "TB";

  const nodeIds = nodes.map((node) => node.id);
  const backEdges = findBackEdges(nodeIds, edges);
  const forwardEdges = edges.filter((_, index) => !backEdges.has(index));
  const layerOf = assignLayers(nodeIds, forwardEdges);
  const mainPath = findMainPath(nodeIds, forwardEdges);

  // Size every node from its label.
  const box = new Map();
  for (const node of nodes) {
    const widest = Math.max(...node.lines.map((line) => textWidth(line, style.fontSize)));
    const isDiamond = node.shape === "diamond";
    const isRound = node.shape === "circle" || node.shape === "stadium" || node.shape === "round";
    const isCylinder = node.shape === "cylinder";
    const padX = isDiamond ? style.padX * 2.1 : isRound ? style.padX * 1.5 : style.padX;
    // A cylinder loses its top to the cap ellipse, so it needs the height back.
    const padY = isDiamond ? style.padY * 1.7 : isCylinder ? style.padY * 1.9 : style.padY;
    box.set(node.id, {
      ...node,
      width: Math.max(Math.round(widest + padX * 2), 84),
      height: Math.round(node.lines.length * style.fontSize * style.lineHeight + padY * 2),
    });
  }

  // Group by layer, then order within a layer by the average position of
  // whatever already points at it. Two passes settles these small graphs.
  const layers = [];
  for (const node of nodes) {
    const index = layerOf.get(node.id);
    (layers[index] ??= []).push(node.id);
  }
  for (let pass = 0; pass < 3; pass += 1) {
    for (let index = 1; index < layers.length; index += 1) {
      const previousLayer = layers[index - 1];
      const rank = (id) => {
        const parents = forwardEdges
          .filter((edge) => edge.to === id && previousLayer.includes(edge.from))
          .map((edge) => previousLayer.indexOf(edge.from));
        if (parents.length === 0) return Number.MAX_SAFE_INTEGER;
        return parents.reduce((sum, value) => sum + value, 0) / parents.length;
      };
      layers[index] = [...layers[index]]
        .map((id, order) => ({ id, order, rank: rank(id) }))
        .sort((a, b) => a.rank - b.rank || a.order - b.order)
        .map((entry) => entry.id);
    }
  }

  // Place nodes. `across` is the axis layers advance on; `along` is within-layer.
  const layerExtent = layers.map((ids) =>
    Math.max(...ids.map((id) => (vertical ? box.get(id).height : box.get(id).width))),
  );

  const labelHeight = style.edgeFontSize + 6;
  const labelWidthOf = (edge) => textWidth(edge.label, style.edgeFontSize) + 10;

  /**
   * An edge label belongs in the first gap after its source, even when the
   * edge spans several layers — put it at the geometric midpoint instead and a
   * long edge drops its label on top of whatever node it happens to fly over.
   */
  const labelledEdges = forwardEdges.filter((edge) => edge.label);
  const gapOf = (edge) => layerOf.get(edge.from);

  const alongSpan = layers.map((ids) =>
    ids.reduce(
      (total, id) => total + (vertical ? box.get(id).width : box.get(id).height) + style.gapY,
      -style.gapY,
    ),
  );
  const alongTotal = Math.max(...alongSpan);

  /** Lay out layers with the given gaps and write x/y onto every node. */
  function place(gapAfter) {
    const layerStart = [];
    let cursor = 0;
    for (let index = 0; index < layers.length; index += 1) {
      layerStart[index] = cursor;
      cursor += layerExtent[index] + gapAfter[index];
    }

    for (let index = 0; index < layers.length; index += 1) {
      let along = (alongTotal - alongSpan[index]) / 2;
      for (const id of layers[index]) {
        const node = box.get(id);
        if (vertical) {
          node.x = along;
          node.y = layerStart[index] + (layerExtent[index] - node.height) / 2;
          along += node.width + style.gapY;
        } else {
          node.x = layerStart[index] + (layerExtent[index] - node.width) / 2;
          node.y = along;
          along += node.height + style.gapY;
        }
      }
    }

    return { layerStart, acrossTotal: cursor - gapAfter[layers.length - 1] };
  }

  /**
   * Gap sizing differs by direction. Left-to-right, a label sits along the gap
   * and needs its width. Top-to-bottom, a label sits across the gap and needs
   * only its height — but two labels in the same gap can collide sideways, so
   * they stack into rows and the gap grows by however many rows are needed.
   */
  function gapsFor() {
    const base = layers.map(() => style.gapX);
    if (!vertical) {
      for (const edge of labelledEdges) {
        const index = gapOf(edge);
        base[index] = Math.max(base[index], labelWidthOf(edge) + 26);
      }
      return { gaps: base, rows: new Map() };
    }

    // Pack labels into rows so that no two in the same row overlap on x.
    const rows = new Map();
    const perGap = new Map();
    for (const edge of labelledEdges) {
      const index = gapOf(edge);
      if (!perGap.has(index)) perGap.set(index, []);
      perGap.get(index).push(edge);
    }

    for (const [index, group] of perGap) {
      const occupied = [];
      const ordered = [...group].sort((a, b) => labelCentre(a) - labelCentre(b));
      for (const edge of ordered) {
        const half = labelWidthOf(edge) / 2 + 4;
        const centre = labelCentre(edge);
        let row = 0;
        while (
          occupied[row]?.some((span) => centre - half < span.end && centre + half > span.start)
        ) {
          row += 1;
        }
        (occupied[row] ??= []).push({ start: centre - half, end: centre + half });
        rows.set(edge, row);
      }
      base[index] = Math.max(base[index], occupied.length * (labelHeight + 4) + 10);
    }

    return { gaps: base, rows };
  }

  const labelCentre = (edge) => {
    const from = box.get(edge.from);
    const to = box.get(edge.to);
    return vertical
      ? (from.x + from.width / 2 + to.x + to.width / 2) / 2
      : (from.y + from.height / 2 + to.y + to.height / 2) / 2;
  };

  // Two passes: the first gives label positions something to measure against,
  // the second lays the diagram out with gaps that actually fit them.
  let placement = place(layers.map(() => style.gapX));
  const { gaps, rows: labelRows } = gapsFor();
  placement = place(gaps);
  const { layerStart, acrossTotal } = placement;

  /** Centre of the gap that follows a layer, on the across axis. */
  const gapCentre = (index) =>
    layerStart[index] + layerExtent[index] + gaps[index] / 2;
  const gapTop = (index) => layerStart[index] + layerExtent[index];

  // Return edges get their own lane: below a left-to-right diagram, to the
  // right of a top-to-bottom one.
  const backEdgeCount = edges.filter((_, index) => backEdges.has(index)).length;
  const backLane = backEdgeCount > 0 ? 18 + backEdgeCount * 12 : 0;
  const margin = 14;
  const width = Math.round(
    (vertical ? alongTotal : acrossTotal) + margin * 2 + (vertical ? backLane : 0),
  );
  const height = Math.round(
    (vertical ? acrossTotal : alongTotal) + margin * 2 + (vertical ? 0 : backLane),
  );

  const shift = (node) => ({ x: node.x + margin, y: node.y + margin });

  // ---- shapes ----
  const shapeFor = (node) => {
    const { x, y } = shift(node);
    const { width: w, height: h } = node;
    if (node.shape === "diamond") {
      const points = [
        `${x + w / 2},${y}`,
        `${x + w},${y + h / 2}`,
        `${x + w / 2},${y + h}`,
        `${x},${y + h / 2}`,
      ].join(" ");
      return `<polygon points="${points}" fill="${COLOR.surface}" stroke="${COLOR.ink}" stroke-width="1"/>`;
    }
    if (node.shape === "cylinder") {
      const ry = Math.min(9, h / 5);
      const d = [
        `M ${x} ${y + ry}`,
        `A ${w / 2} ${ry} 0 0 1 ${x + w} ${y + ry}`,
        `L ${x + w} ${y + h - ry}`,
        `A ${w / 2} ${ry} 0 0 1 ${x} ${y + h - ry}`,
        "Z",
      ].join(" ");
      return (
        `<path d="${d}" fill="${COLOR.surface}" stroke="${COLOR.ink}" stroke-width="1"/>` +
        `<path d="M ${x} ${y + ry} A ${w / 2} ${ry} 0 0 0 ${x + w} ${y + ry}" fill="none" stroke="${COLOR.ink}" stroke-width="1"/>`
      );
    }
    if (node.shape === "circle" || node.shape === "stadium" || node.shape === "round") {
      const r = node.shape === "round" ? 6 : h / 2;
      return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" ry="${r}" fill="${COLOR.surface}" stroke="${COLOR.ink}" stroke-width="1"/>`;
    }
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" ry="4" fill="${COLOR.surface}" stroke="${COLOR.ink}" stroke-width="1"/>`;
  };

  const labelFor = (node) => {
    const { x, y } = shift(node);
    const lineStep = style.fontSize * style.lineHeight;
    const first = y + node.height / 2 - ((node.lines.length - 1) * lineStep) / 2;
    return node.lines
      .map(
        (line, index) =>
          `<text x="${Math.round(x + node.width / 2)}" y="${Math.round(first + index * lineStep)}" text-anchor="middle" dominant-baseline="central" fill="${COLOR.ink}" font-size="${style.fontSize}">${escapeXml(line)}</text>`,
      )
      .join("");
  };

  // ---- edges ----
  const anchor = (node, side) => {
    const { x, y } = shift(node);
    const w = node.width;
    const h = node.height;
    if (vertical) {
      if (side === "out") return { x: x + w / 2, y: y + h };
      if (side === "in") return { x: x + w / 2, y };
    } else {
      if (side === "out") return { x: x + w, y: y + h / 2 };
      if (side === "in") return { x, y: y + h / 2 };
    }
    return { x: x + w / 2, y: y + h };
  };

  let backIndex = 0;
  const edgeMarkup = edges.map((edge, index) => {
    const from = box.get(edge.from);
    const to = box.get(edge.to);
    const isMain = mainPath.has(edge);
    const stroke = isMain ? COLOR.cobalt : COLOR.ink;
    const strokeWidth = isMain ? 1.6 : 1;
    const arrowId = `url(#__UID__-arrow-${isMain ? "cobalt" : "ink"})`;
    const markerEnd = edge.arrow ? ` marker-end="${arrowId}"` : "";
    const markerStart = edge.bidirectional ? ` marker-start="${arrowId}"` : "";

    let path;
    let labelAt;

    if (backEdges.has(index)) {
      // Route return edges through a lane under (or beside) the diagram.
      backIndex += 1;
      const a = shift(from);
      const b = shift(to);
      if (vertical) {
        const lane = width - margin - backLane + backIndex * 12;
        const ay = a.y + from.height / 2;
        const by = b.y + to.height / 2;
        const ax = a.x + from.width;
        const bx = b.x + to.width;
        path = `M ${ax} ${ay} L ${lane} ${ay} L ${lane} ${by} L ${bx} ${by}`;
        labelAt = { x: lane - labelHeight, y: (ay + by) / 2 };
      } else {
        const lane = height - margin - backLane + backIndex * 12;
        const ax = a.x + from.width / 2;
        const ay = a.y + from.height;
        const bx = b.x + to.width / 2;
        const by = b.y + to.height;
        path = `M ${ax} ${ay} L ${ax} ${lane} L ${bx} ${lane} L ${bx} ${by}`;
        labelAt = { x: (ax + bx) / 2, y: lane - labelHeight };
      }
    } else {
      const start = anchor(from, "out");
      const end = anchor(to, "in");
      if (Math.abs(start.y - end.y) < 1.5 || Math.abs(start.x - end.x) < 1.5) {
        path = `M ${round(start.x)} ${round(start.y)} L ${round(end.x)} ${round(end.y)}`;
      } else if (vertical) {
        const dy = (end.y - start.y) * 0.5;
        path = `M ${round(start.x)} ${round(start.y)} C ${round(start.x)} ${round(start.y + dy)}, ${round(end.x)} ${round(end.y - dy)}, ${round(end.x)} ${round(end.y)}`;
      } else {
        const dx = (end.x - start.x) * 0.5;
        path = `M ${round(start.x)} ${round(start.y)} C ${round(start.x + dx)} ${round(start.y)}, ${round(end.x - dx)} ${round(end.y)}, ${round(end.x)} ${round(end.y)}`;
      }
      // Labels live in the first gap after the source, never on top of a node.
      const gapIndex = layerOf.get(edge.from);
      if (vertical) {
        const row = labelRows.get(edge) ?? 0;
        labelAt = {
          x: (start.x + end.x) / 2,
          y: gapTop(gapIndex) + margin + 9 + row * (labelHeight + 4) + labelHeight / 2,
        };
      } else {
        labelAt = { x: gapCentre(gapIndex) + margin, y: (start.y + end.y) / 2 - 9 };
      }
    }

    const line = `<path d="${path}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}"${markerStart}${markerEnd}/>`;
    if (!edge.label) return { line, label: "" };

    // `labelAt` is the centre of the label box.
    const labelWidth = labelWidthOf(edge);
    const plate = `<rect x="${round(labelAt.x - labelWidth / 2)}" y="${round(labelAt.y - labelHeight / 2)}" width="${round(labelWidth)}" height="${labelHeight}" rx="2" fill="${COLOR.surface}"/>`;
    const text = `<text x="${round(labelAt.x)}" y="${round(labelAt.y)}" text-anchor="middle" dominant-baseline="central" fill="${COLOR.graphite}" font-size="${style.edgeFontSize}">${escapeXml(edge.label)}</text>`;
    return { line, label: plate + text };
  });

  // One marker per colour. `auto-start-reverse` makes it point the right way
  // whether it is used as marker-start or marker-end.
  const marker = (id, color) =>
    `<marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 9 5 L 0 10 z" fill="${color}"/></marker>`;

  const defs = [marker("__UID__-arrow-ink", COLOR.ink), marker("__UID__-arrow-cobalt", COLOR.cobalt)].join("");

  return {
    width,
    height,
    svg: [
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img"`,
      ` aria-labelledby="__UID__-title" aria-describedby="__UID__-desc"`,
      ` font-family="var(--font-mono), ui-monospace, SFMono-Regular, monospace"`,
      ` style="display:block;width:100%;height:auto">`,
      `<title id="__UID__-title">${escapeXml(title)}</title>`,
      `<desc id="__UID__-desc">${escapeXml(description)}</desc>`,
      `<defs>${defs}</defs>`,
      `<rect width="${width}" height="${height}" fill="${COLOR.surface}"/>`,
      edgeMarkup.map((edge) => edge.line).join(""),
      nodes.map((node) => shapeFor(box.get(node.id)) + labelFor(box.get(node.id))).join(""),
      edgeMarkup.map((edge) => edge.label).join(""),
      `</svg>`,
    ].join(""),
  };
}

function round(value) {
  return Math.round(value * 10) / 10;
}

export { COLOR };
