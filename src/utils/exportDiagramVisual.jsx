import {
  NODE_WIDTH,
  NODE_HEIGHT,
  getOrthogonalPath,
  processEdges,
  linkStyleFor,
} from "../components/GraphCanvas";
const MAX_CANVAS_Y = 960;
const nodeWidth = (node) => node.width || NODE_WIDTH;
const nodeHeight = (node) => node.height || NODE_HEIGHT;

// Canvas does not wrap text automatically.  Exported cards use this helper so
// their labels honour the same visual boundary as the on-screen node cards.
function wrapCanvasText(ctx, value, maxWidth) {
  const words = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return [];

  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function drawWrappedCanvasText(
  ctx,
  value,
  x,
  y,
  maxWidth,
  lineHeight,
  maxLines,
) {
  const lines = wrapCanvasText(ctx, value, maxWidth).slice(0, maxLines);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return lines.length;
}

// Color themes for SVG / Canvas node rendering
const THEMES = {
  person: {
    border: "#fbcfe8",
    bg: "#ffffff",
    iconBg: "#fdf2f8",
    iconColor: "#ec4899",
    symbol: "👤",
  },
  org: {
    border: "#a5f3fc",
    bg: "#ffffff",
    iconBg: "#ecfeff",
    iconColor: "#0891b2",
    symbol: "🏛️",
  },
  assessment: {
    border: "#bbf7d0",
    bg: "#ffffff",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    symbol: "📋",
  },
  system: {
    border: "#99f6e4",
    bg: "#ffffff",
    iconBg: "#f0fdfa",
    iconColor: "#0d9488",
    symbol: "⚙️",
  },
  resource: {
    border: "#cbd5e1",
    bg: "#ffffff",
    iconBg: "#f1f5f9",
    iconColor: "#1e293b",
    symbol: "📄",
  },
  action: {
    border: "#bfdbfe",
    bg: "#ffffff",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    symbol: "⚡",
  },
  alert: {
    border: "#fde68a",
    bg: "#fffdf5",
    iconBg: "#fefce8",
    iconColor: "#d97706",
    symbol: "⚠️",
  },
  governance: {
    border: "#fed7aa",
    bg: "#ffffff",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    symbol: "⚖️",
  },
  "agent-run": {
    border: "#e9d5ff",
    bg: "#ffffff",
    iconBg: "#faf5ff",
    iconColor: "#9333ea",
    symbol: "🤖",
  },
  model: {
    border: "#ddd6fe",
    bg: "#ffffff",
    iconBg: "#f5f3ff",
    iconColor: "#8b5cf6",
    symbol: "🧠",
  },
  workflow: {
    border: "#d9f99d",
    bg: "#ffffff",
    iconBg: "#f7fee7",
    iconColor: "#65a30d",
    symbol: "🔄",
  },
};

export function getCurvedPathStatic(from, to, offset = 0) {
  // 1. score → santos: SHORT direct vertical — Santos directly above Score in Col 4
  if (from.id === "score" && to.id === "santos") {
    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y;
    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y + NODE_HEIGHT + 4;
    const dy = Math.max(startY - endY, 20);
    const cx1 = startX;
    const cy1 = startY - dy * 0.5;
    const cx2 = endX;
    const cy2 = endY + dy * 0.5;
    const d = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
    const midX = 0.125 * startX + 0.375 * cx1 + 0.375 * cx2 + 0.125 * endX;
    const midY = 0.125 * startY + 0.375 * cy1 + 0.375 * cy2 + 0.125 * endY;
    return { d, startX, startY, endX, endY, cx1, cy1, cx2, cy2, midX, midY };
  }

  // 2. santos → jackson-ms: orthogonal route through the open lane between rows.
  if (from.id === "santos" && to.id === "jackson-ms") {
    const startX = from.x;
    const startY = from.y + NODE_HEIGHT;
    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y - 6;
    const routeX = from.x - 50;
    const laneY = 170 + (from.y - 0);
    const d = `M ${startX} ${startY} H ${routeX} V ${laneY} H ${endX} V ${endY}`;
    return {
      d,
      startX,
      startY,
      endX,
      endY,
      midX: (routeX + endX) / 2,
      midY: laneY,
      kind: "orthogonal",
      points: [
        [routeX, startY],
        [routeX, laneY],
        [endX, laneY],
        [endX, endY],
      ],
    };
  }

  // 3. hft → hisd: curve RIGHT then UP, skirting around jackson-ms right border cleanly
  if (from.id === "hft" && to.id === "hisd") {
    const startX = from.x + NODE_WIDTH;
    const startY = from.y + NODE_HEIGHT / 2;
    const endX = to.x;
    const endY = to.y + NODE_HEIGHT / 2;
    const cx1 = startX + 160;
    const cy1 = startY + 60;
    const cx2 = endX - 60;
    const cy2 = endY + 80;
    const d = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
    const midX = 0.125 * startX + 0.375 * cx1 + 0.375 * cx2 + 0.125 * endX;
    const midY = 0.125 * startY + 0.375 * cy1 + 0.375 * cy2 + 0.125 * endY;
    return { d, startX, startY, endX, endY, cx1, cy1, cx2, cy2, midX, midY };
  }

  // 4. hft → disclosure: orthogonal footer route.
  if (from.id === "hft" && to.id === "disclosure") {
    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y + NODE_HEIGHT;
    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y + NODE_HEIGHT;
    const footerY = MAX_CANVAS_Y - 20 + (from.y - 350);
    const d = `M ${startX} ${startY} V ${footerY} H ${endX} V ${endY}`;
    return {
      d,
      startX,
      startY,
      endX,
      endY,
      midX: (startX + endX) / 2,
      midY: footerY,
      kind: "orthogonal",
      points: [
        [startX, footerY],
        [endX, footerY],
        [endX, endY],
      ],
    };
  }

  const isLtoR = to.x >= from.x + 80;
  const isRtoL = to.x < from.x - 80;

  let startX, startY, endX, endY, cx1, cy1, cx2, cy2;

  if (isLtoR) {
    startX = from.x + NODE_WIDTH;
    startY = from.y + NODE_HEIGHT / 2 + offset;
    endX = to.x - 6;
    endY = to.y + NODE_HEIGHT / 2 + offset;
    const dx = Math.max(endX - startX, 45);
    cx1 = startX + dx * 0.45;
    cy1 = startY;
    cx2 = endX - dx * 0.45;
    cy2 = endY;
  } else if (isRtoL) {
    startX = from.x;
    startY = from.y + NODE_HEIGHT / 2 + offset;
    endX = to.x + NODE_WIDTH + 6;
    endY = to.y + NODE_HEIGHT / 2 + offset;
    const dx = Math.max(startX - endX, 45);
    cx1 = startX - dx * 0.45;
    cy1 = startY;
    cx2 = endX + dx * 0.45;
    cy2 = endY;
  } else {
    if (to.y >= from.y) {
      startX = from.x + NODE_WIDTH / 2;
      startY = from.y + NODE_HEIGHT;
      endX = to.x + NODE_WIDTH / 2;
      endY = to.y - 6;
      const dy = Math.max(endY - startY, 35);
      cx1 = startX;
      cy1 = startY + dy * 0.45;
      cx2 = endX;
      cy2 = endY - dy * 0.45;
    } else {
      startX = from.x + NODE_WIDTH / 2;
      startY = from.y;
      endX = to.x + NODE_WIDTH / 2;
      endY = to.y + NODE_HEIGHT + 6;
      const dy = Math.max(startY - endY, 35);
      cx1 = startX;
      cy1 = startY - dy * 0.45;
      cx2 = endX;
      cy2 = endY + dy * 0.45;
    }
  }

  const d = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
  const midX = 0.125 * startX + 0.375 * cx1 + 0.375 * cx2 + 0.125 * endX;
  const midY = 0.125 * startY + 0.375 * cy1 + 0.375 * cy2 + 0.125 * endY;

  return { d, startX, startY, endX, endY, cx1, cy1, cx2, cy2, midX, midY };
}

export const exportDiagramVisualPdf = ({ matter, nodes }) => {
  const printWindow = window.open("", "_blank", "width=1380,height=980");
  if (!printWindow) {
    alert("Please allow popups to open the Visual Diagram snapshot.");
    return;
  }

  const visibleLinks = (matter.links || []).filter((link) => !link.chipOnly);

  let minX = 99999,
    minY = 99999,
    maxX = -99999,
    maxY = -99999;
  nodes.forEach((n) => {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + nodeWidth(n) > maxX) maxX = n.x + nodeWidth(n);
    if (n.y + nodeHeight(n) > maxY) maxY = n.y + nodeHeight(n);
  });

  if (matter.domains) {
    matter.domains.forEach((d) => {
      if (d.x < minX) minX = d.x;
      if (d.y < minY) minY = d.y;
      if (d.x + d.w > maxX) maxX = d.x + d.w;
      if (d.y + d.h > maxY) maxY = d.y + d.h;
    });
  }

  const pad = 48;
  const viewWidth = Math.max(maxX - minX + pad * 2, 1200);
  const viewHeight = Math.max(maxY - minY + pad * 2, 720);
  const offsetX = pad - minX;
  const offsetY = pad - minY;

  const exportDate = new Date().toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const domainsSvg = (matter.domains || [])
    .map(
      (d) => `
    <g class="domain-svg">
      <rect
        x="${d.x + offsetX}"
        y="${d.y + offsetY}"
        width="${d.w}"
        height="${d.h}"
        rx="16"
        fill="rgba(245, 243, 255, 0.35)"
        stroke="${d.borderColor}"
        stroke-width="1.8"
        stroke-dasharray="6 4"
      />
      <rect
        x="${d.x + offsetX + d.w / 2 - 58}"
        y="${d.y + offsetY - 13}"
        width="116"
        height="26"
        rx="6"
        fill="${d.badgeBg}"
      />
      <text
        x="${d.x + offsetX + d.w / 2}"
        y="${d.y + offsetY + 5}"
        text-anchor="middle"
        fill="#ffffff"
        font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
        font-size="11.5"
        font-weight="800"
        letter-spacing="0.4px"
      >${d.name}</text>
    </g>
  `,
    )
    .join("");

  const shiftedNodes = nodes.map((node) => ({
    ...node,
    x: node.x + offsetX,
    y: node.y + offsetY,
  }));
  const getNodeShifted = (id) => shiftedNodes.find((n) => n.id === id);
  const processedLinks = processEdges(visibleLinks, getNodeShifted);
  const edgesSvg = processedLinks
    .map((link) => {
      const fromNode = getNodeShifted(link.from);
      const toNode = getNodeShifted(link.to);
      if (!fromNode || !toNode) return "";

      const p = getOrthogonalPath(
        fromNode,
        toNode,
        link,
        processedLinks,
        shiftedNodes,
      );
      const { markerId, markerStartId } = linkStyleFor(link);

      const category = link.category || "structural";
      const isAlert = category === "alert";
      const isPipeline = category === "pipeline";

      const strokeColor =
        link.kind === "condition"
          ? "#E0507A"
          : link.kind === "gap"
            ? "#D9531E"
            : link.kind === "trace"
              ? "#7C4FE0"
              : link.kind === "unresolved"
                ? "#64748B"
                : isAlert
                  ? "#ea580c"
                  : isPipeline
                    ? "#0284c7"
                    : "#475569";
      const markerUrl = `url(#${markerId})`;
      const markerStartUrl = link.isBidirectional
        ? `url(#${markerStartId})`
        : "";
      const dashArray =
        ["condition", "alert"].includes(link.kind) || isAlert
          ? "5 4"
          : link.kind === "gap"
            ? "6 4"
            : link.kind === "trace"
              ? "4 4"
              : link.kind === "unresolved"
                ? "3 4"
                : "none";

      const badgeFill = "#ffffff";
      const badgeStroke = "#cbd5e1";
      const textColor = isAlert
        ? "#c2410c"
        : isPipeline
          ? "#0369a1"
          : "#334155";

      return `
      <g class="edge-group">
        <path
          d="${p.d}"
          fill="none"
          stroke="${strokeColor}"
          stroke-width="1.8"
          stroke-dasharray="${dashArray}"
          marker-end="${markerUrl}"
          ${markerStartUrl ? `marker-start="${markerStartUrl}"` : ""}
        />
        ${
          link.label
            ? (() => {
                const displayLabel = String(link.label).replaceAll("_", " ");
                return `
          <g transform="translate(${p.midX}, ${p.midY})">
            <rect
              x="${-(displayLabel.length * 3.4 + 10)}"
              y="-9"
              width="${displayLabel.length * 6.8 + 20}"
              height="18"
              rx="4"
              fill="${badgeFill}"
              stroke="${badgeStroke}"
              stroke-width="1.2"
            />
            <text
              x="0"
              y="4"
              text-anchor="middle"
              fill="${textColor}"
              font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
              font-size="10"
              font-weight="700"
            >${displayLabel}</text>
          </g>
        `;
              })()
            : ""
        }
      </g>
    `;
    })
    .join("");

  const nodesHtml = nodes
    .map((n) => {
      const theme = THEMES[n.kind] || THEMES.resource;
      return `
      <div style="
        position: absolute;
        left: ${n.x + offsetX}px;
        top: ${n.y + offsetY}px;
        width: ${nodeWidth(n)}px;
        min-height: ${nodeHeight(n)}px;
        background: #ffffff;
        border: 1.5px solid ${theme.border};
        border-radius: 10px;
        padding: 9px 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.06);
        box-sizing: border-box;
        overflow: hidden;
      ">
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: ${theme.iconBg};
          color: ${theme.iconColor};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-weight: 800;
          font-size: 14px;
        ">${theme.symbol || "✦"}</div>
        <div style="min-width: 0; flex: 1; max-width: calc(100% - 42px); display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
          <b style="
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            line-height: 1.3;
            overflow-wrap: anywhere;
            word-break: break-word;
            max-width: 100%;
          ">${n.label}</b>
          <span style="
            display: block;
            font-size: 10px;
            color: #64748b;
            line-height: 1.25;
            margin-top: 2px;
            overflow-wrap: anywhere;
            word-break: break-word;
            max-width: 100%;
          ">${n.sub}</span>
        </div>
      </div>
    `;
    })
    .join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Visual Diagram Snapshot — ${matter.title}</title>
        <style>
          @page {
            size: landscape;
            margin: 8mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            margin: 0;
            padding: 16px;
            background: #ffffff;
            color: #0f172a;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header-banner {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid #4f35b8;
            padding-bottom: 10px;
            margin-bottom: 16px;
          }
          .title-area h1 {
            font-size: 21px;
            font-weight: 800;
            margin: 0 0 3px;
            color: #091224;
          }
          .title-area p {
            margin: 0;
            font-size: 12px;
            color: #475569;
          }
          .meta-area {
            text-align: right;
            font-size: 10.5px;
            color: #64748b;
          }
          .diagram-canvas-box {
            position: relative;
            width: ${viewWidth}px;
            height: ${viewHeight}px;
            margin: 0 auto;
            background-color: #fafbfe;
            background-image: radial-gradient(#cbd5e1 1.2px, transparent 1.2px);
            background-size: 20px 20px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 3px 12px rgba(0,0,0,0.05);
          }
          .svg-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .btn-print {
            position: fixed;
            top: 16px;
            right: 16px;
            padding: 9px 18px;
            background: #4f35b8;
            color: #fff;
            border: none;
            border-radius: 7px;
            font-weight: 700;
            font-size: 12px;
            cursor: pointer;
            box-shadow: 0 3px 10px rgba(0,0,0,0.2);
            z-index: 1000;
          }
          @media print {
            .btn-print { display: none; }
            body { padding: 0; }
            .diagram-canvas-box { border: none; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Save as PDF</button>

        <div class="header-banner">
          <div class="title-area">
            <h1>${matter.title}</h1>
            <p>EBRR TRACE™ Visual Diagram Snapshot · 4-Column Strict Layout (Zero Truncation)</p>
          </div>
          <div class="meta-area">
            <div>Captured: <b>${exportDate}</b></div>
            <div>Layout State: <b>4-Column Left-to-Right Architecture</b></div>
            <div>Total Nodes: <b>${nodes.length}</b> | Relationships: <b>${(matter.links || []).length}</b></div>
          </div>
        </div>

        <div class="diagram-canvas-box">
          <svg class="svg-layer">
            <defs>
              <marker id="arrow-structural" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#475569" />
              </marker>
              <marker id="arrow-pipeline" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0284c7" />
              </marker>
              <marker id="arrow-alert" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#ea580c" />
              </marker>
              <marker id="arrow-governance" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#334155" /></marker>
              <marker id="arrow-input" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#2563EB" /></marker>
              <marker id="arrow-processing" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0891B2" /></marker>
              <marker id="arrow-legal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#EA580C" /></marker>
              <marker id="arrow-condition" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#E0507A" /></marker>
              <marker id="arrow-gap" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#D9531E" /></marker>
              <marker id="arrow-trace" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#7C4FE0" /></marker>
              <marker id="arrow-unresolved" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#64748B" /></marker>

              {/* Start markers for bidirectional edges */}
              <marker id="arrow-structural-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#475569" /></marker>
              <marker id="arrow-pipeline-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#0284c7" /></marker>
              <marker id="arrow-alert-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#ea580c" /></marker>
              <marker id="arrow-governance-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#334155" /></marker>
              <marker id="arrow-input-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#2563EB" /></marker>
              <marker id="arrow-processing-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#0891B2" /></marker>
              <marker id="arrow-legal-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#EA580C" /></marker>
              <marker id="arrow-condition-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#E0507A" /></marker>
              <marker id="arrow-gap-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#D9531E" /></marker>
              <marker id="arrow-trace-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#7C4FE0" /></marker>
              <marker id="arrow-unresolved-start" viewBox="0 0 10 10" refX="1.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto"><path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#64748B" /></marker>
            </defs>

            ${domainsSvg}
            ${edgesSvg}
          </svg>
          ${nodesHtml}
        </div>

        <script>
          setTimeout(() => {
            window.print();
          }, 450);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};

export const exportDiagramPng = ({ matter, nodes }) => {
  const visibleLinks = (matter.links || []).filter((link) => !link.chipOnly);
  let minX = 99999,
    minY = 99999,
    maxX = -99999,
    maxY = -99999;
  nodes.forEach((n) => {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + nodeWidth(n) > maxX) maxX = n.x + nodeWidth(n);
    if (n.y + nodeHeight(n) > maxY) maxY = n.y + nodeHeight(n);
  });

  if (matter.domains) {
    matter.domains.forEach((d) => {
      if (d.x < minX) minX = d.x;
      if (d.y < minY) minY = d.y;
      if (d.x + d.w > maxX) maxX = d.x + d.w;
      if (d.y + d.h > maxY) maxY = d.y + d.h;
    });
  }

  const pad = 50;
  const w = Math.max(maxX - minX + pad * 2, 1200);
  const h = Math.max(maxY - minY + pad * 2, 720);
  const ox = pad - minX;
  const oy = pad - minY;

  const canvas = document.createElement("canvas");
  const dpr = 2;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#fafbfe";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#cbd5e1";
  for (let x = 10; x < w; x += 20) {
    for (let y = 10; y < h; y += 20) {
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (matter.domains) {
    matter.domains.forEach((d) => {
      ctx.save();
      ctx.strokeStyle = d.borderColor || "#9382e2";
      ctx.lineWidth = 1.8;
      ctx.setLineDash([6, 4]);
      ctx.fillStyle = "rgba(245, 243, 255, 0.35)";
      const dx = d.x + ox;
      const dy = d.y + oy;
      roundRect(ctx, dx, dy, d.w, d.h, 16);
      ctx.fill();
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.fillStyle = d.badgeBg || "#4f35b8";
      roundRect(ctx, dx + d.w / 2 - 58, dy - 13, 116, 26, 6);
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(d.name, dx + d.w / 2, dy + 4);
      ctx.restore();
    });
  }

  const shiftedNodes = nodes.map((node) => ({
    ...node,
    x: node.x + ox,
    y: node.y + oy,
  }));
  const getNodeShifted = (id) => shiftedNodes.find((n) => n.id === id);
  const processedLinks = processEdges(visibleLinks, getNodeShifted);
  processedLinks.forEach((l) => {
    const fromNode = getNodeShifted(l.from);
    const toNode = getNodeShifted(l.to);
    if (!fromNode || !toNode) return;

    const p = getOrthogonalPath(
      fromNode,
      toNode,
      l,
      processedLinks,
      shiftedNodes,
    );

    const category =
      l.category || (l.type === "dashed-alert" ? "alert" : "structural");
    const isAlert = category === "alert";
    const isPipeline = category === "pipeline";

    const strokeColor =
      l.kind === "condition"
        ? "#E0507A"
        : l.kind === "gap"
          ? "#D9531E"
          : l.kind === "trace"
            ? "#7C4FE0"
            : l.kind === "unresolved"
              ? "#64748B"
              : isAlert
                ? "#ea580c"
                : isPipeline
                  ? "#0284c7"
                  : "#475569";
    const badgeFill = "#ffffff";
    const badgeStroke = "#cbd5e1";
    const textColor = isAlert ? "#c2410c" : isPipeline ? "#0369a1" : "#334155";

    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1.8;
    if (["condition", "alert"].includes(l.kind) || isAlert)
      ctx.setLineDash([5, 4]);
    else if (l.kind === "gap") ctx.setLineDash([6, 4]);
    else if (l.kind === "trace") ctx.setLineDash([4, 4]);
    else if (l.kind === "unresolved") ctx.setLineDash([3, 4]);
    else ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(p.points[0].x, p.points[0].y);
    p.points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
    ctx.stroke();

    // End Arrowhead
    const priorPoint = p.points[p.points.length - 2];
    const endPoint = p.points[p.points.length - 1];
    const angle = Math.atan2(
      endPoint.y - priorPoint.y,
      endPoint.x - priorPoint.x,
    );
    ctx.setLineDash([]);
    ctx.fillStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(
      endPoint.x - 9 * Math.cos(angle - Math.PI / 6),
      endPoint.y - 9 * Math.sin(angle - Math.PI / 6),
    );
    ctx.lineTo(
      endPoint.x - 9 * Math.cos(angle + Math.PI / 6),
      endPoint.y - 9 * Math.sin(angle + Math.PI / 6),
    );
    ctx.closePath();
    ctx.fill();

    // Start Arrowhead for Bidirectional Edges
    if (l.isBidirectional && p.points.length >= 2) {
      const startPoint = p.points[0];
      const nextPoint = p.points[1];
      const startAngle = Math.atan2(
        startPoint.y - nextPoint.y,
        startPoint.x - nextPoint.x,
      );
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      ctx.lineTo(
        startPoint.x - 9 * Math.cos(startAngle - Math.PI / 6),
        startPoint.y - 9 * Math.sin(startAngle - Math.PI / 6),
      );
      ctx.lineTo(
        startPoint.x - 9 * Math.cos(startAngle + Math.PI / 6),
        startPoint.y - 9 * Math.sin(startAngle + Math.PI / 6),
      );
      ctx.closePath();
      ctx.fill();
    }

    if (l.label) {
      const displayLabel = String(l.label).replaceAll("_", " ");
      const textWidth = displayLabel.length * 6.6;
      const bw = textWidth + 16;
      const bh = 18;

      ctx.fillStyle = badgeFill;
      ctx.strokeStyle = badgeStroke;
      ctx.lineWidth = 1.2;
      roundRect(ctx, p.midX - bw / 2, p.midY - bh / 2, bw, bh, 4);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "bold 9.5px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(displayLabel, p.midX, p.midY);
    }
    ctx.restore();
  });

  nodes.forEach((n) => {
    const theme = THEMES[n.kind] || THEMES.resource;
    const nx = n.x + ox;
    const ny = n.y + oy;

    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = theme.border;
    ctx.lineWidth = 1.5;
    roundRect(ctx, nx, ny, nodeWidth(n), nodeHeight(n), 10);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.iconBg;
    roundRect(ctx, nx + 10, ny + 12, 32, 32, 8);
    ctx.fill();

    ctx.fillStyle = theme.iconColor;
    ctx.font = "bold 13px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦", nx + 26, ny + 28);

    const textX = nx + 50;
    const textWidth = Math.max(nodeWidth(n) - 62, 40);
    const titleLineHeight = 12;
    const subtitleLineHeight = 10;

    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 10.8px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    const titleLines = drawWrappedCanvasText(
      ctx,
      n.label,
      textX,
      ny + 23,
      textWidth,
      titleLineHeight,
      2,
    );

    ctx.fillStyle = "#64748b";
    ctx.font = "9px sans-serif";
    drawWrappedCanvasText(
      ctx,
      n.sub,
      textX,
      ny + 25 + titleLines * titleLineHeight,
      textWidth,
      subtitleLineHeight,
      2,
    );
    ctx.restore();
  });

  const link = document.createElement("a");
  link.download = `${matter.id}_Visual_Diagram.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
};

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
