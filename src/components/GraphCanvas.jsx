import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Icon } from "./Icons";

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 72;
const PATH_SEPARATION = 24;
const nodeWidth = (node) => node.width || NODE_WIDTH;
const nodeHeight = (node) => node.height || NODE_HEIGHT;
const DOMAIN_NODE_IDS = {
  "hisd-domain": ["hisd", "jackson-ms", "hft", "assessment", "student-data"],
  "sas-domain": ["sas", "evaas"],
  "gaps-domain": ["gap", "disclosure"],
};

export const linkStyleFor = (link) => {
  const kind = link.kind || "";
  if (kind === "condition")
    return {
      lineClass: "edge-condition",
      markerId: "arrow-condition",
      markerStartId: "arrow-condition-start",
      color: "#E0507A",
    };
  if (kind === "gap")
    return {
      lineClass: "edge-gap",
      markerId: "arrow-gap",
      markerStartId: "arrow-gap-start",
      color: "#D9531E",
    };
  if (kind === "trace")
    return {
      lineClass: "edge-trace",
      markerId: "arrow-trace",
      markerStartId: "arrow-trace-start",
      color: "#7C4FE0",
    };
  if (kind === "unresolved")
    return {
      lineClass: "edge-unresolved",
      markerId: "arrow-unresolved",
      markerStartId: "arrow-unresolved-start",
      color: "#64748B",
    };
  if (["PART OF", "CONTRACTED WITH"].includes(link.label))
    return {
      lineClass: "edge-governance",
      markerId: "arrow-governance",
      markerStartId: "arrow-governance-start",
      color: "#334155",
    };
  if (["USED ASSESSMENT", "PROVIDED DATA", "INPUTS"].includes(link.label))
    return {
      lineClass: "edge-input",
      markerId: "arrow-input",
      markerStartId: "arrow-input-start",
      color: "#2563EB",
    };
  if (["USED SYSTEM", "GENERATED"].includes(link.label))
    return {
      lineClass: "edge-processing",
      markerId: "arrow-processing",
      markerStartId: "arrow-processing-start",
      color: "#0891B2",
    };
  if (
    ["REQUESTED FROM", "SOUGHT RECORDS", "FORMAL ISSUER?"].includes(link.label)
  )
    return {
      lineClass: "edge-legal",
      markerId: "arrow-legal",
      markerStartId: "arrow-legal-start",
      color: "#EA580C",
    };
  const category = link.category || "structural";
  return {
    lineClass:
      category === "alert"
        ? "edge-alert"
        : category === "pipeline"
          ? "edge-pipeline"
          : "edge-structural",
    markerId:
      category === "alert"
        ? "arrow-alert"
        : category === "pipeline"
          ? "arrow-pipeline"
          : "arrow-structural",
    markerStartId:
      category === "alert"
        ? "arrow-alert-start"
        : category === "pipeline"
          ? "arrow-pipeline-start"
          : "arrow-structural-start",
    color:
      category === "alert"
        ? "#EA580C"
        : category === "pipeline"
          ? "#0284C7"
          : "#475569",
  };
};

export function processEdges(links, getNode) {
  const validLinks = (links || []).filter((link) => {
    if (link.chipOnly) return false;
    const fId = link.from || link.source;
    const tId = link.to || link.target;
    return getNode(fId) && getNode(tId);
  });

  const processed = [];
  const consumed = new Set();

  for (let i = 0; i < validLinks.length; i++) {
    if (consumed.has(i)) continue;
    const linkA = validLinks[i];
    const aFrom = linkA.from || linkA.source;
    const aTo = linkA.to || linkA.target;

    // Detect reciprocal connection (Node A -> Node B and Node B -> Node A)
    let reciprocalIndex = -1;
    for (let j = i + 1; j < validLinks.length; j++) {
      if (consumed.has(j)) continue;
      const linkB = validLinks[j];
      const bFrom = linkB.from || linkB.source;
      const bTo = linkB.to || linkB.target;
      if (aFrom === bTo && aTo === bFrom) {
        reciprocalIndex = j;
        break;
      }
    }

    if (reciprocalIndex !== -1) {
      const linkB = validLinks[reciprocalIndex];
      consumed.add(reciprocalIndex);
      consumed.add(i);

      const labelA = linkA.label || "";
      const labelB = linkB.label || "";
      const mergedLabel = labelA === labelB ? labelA : `${labelA} ⇄ ${labelB}`;

      processed.push({
        ...linkA,
        from: aFrom,
        to: aTo,
        isBidirectional: true,
        label: mergedLabel,
        reciprocalLink: linkB,
        involvedIds: [linkA.id, linkB.id],
      });
    } else {
      consumed.add(i);
      processed.push({
        ...linkA,
        from: aFrom,
        to: aTo,
        isBidirectional: false,
        involvedIds: [linkA.id],
      });
    }
  }

  return processed;
}

// Deterministic Straight-Line / Orthogonal Right-Angle step routing (Zero curves).
export function getOrthogonalPath(from, to, link, allLinks, allNodes) {
  const fw = nodeWidth(from);
  const fh = nodeHeight(from);
  const tw = nodeWidth(to);
  const th = nodeHeight(to);

  // 1. Anchor side calculation based on relative node positioning
  const sideFor = (node, other) => {
    const nw = nodeWidth(node);
    const nh = nodeHeight(node);
    const ow = nodeWidth(other);
    const oh = nodeHeight(other);
    const dx = other.x + ow / 2 - (node.x + nw / 2);
    const dy = other.y + oh / 2 - (node.y + nh / 2);
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? "right" : "left";
    return dy >= 0 ? "bottom" : "top";
  };

  const fromSide = link.sourceHandle || sideFor(from, to);
  const toSide = link.targetHandle || sideFor(to, from);

  // 2. Parallel and sibling port distribution to prevent overlap
  const fromId = from.id;
  const toId = to.id;

  const siblingsFrom = (allLinks || []).filter(
    (l) =>
      (l.from || l.source) === fromId &&
      (l.sourceHandle || sideFor(from, to)) === fromSide,
  );
  const fromIndex = Math.max(0, siblingsFrom.indexOf(link));
  const fromCount = Math.max(1, siblingsFrom.length);
  const fromPortOffset =
    fromCount > 1 ? (fromIndex - (fromCount - 1) / 2) * 16 : 0;

  const siblingsTo = (allLinks || []).filter(
    (l) =>
      (l.to || l.target) === toId &&
      (l.targetHandle || sideFor(to, from)) === toSide,
  );
  const toIndex = Math.max(0, siblingsTo.indexOf(link));
  const toCount = Math.max(1, siblingsTo.length);
  const toPortOffset = toCount > 1 ? (toIndex - (toCount - 1) / 2) * 16 : 0;

  // Track offset for parallel links between the exact same pair of nodes
  const parallelLinks = (allLinks || []).filter((l) => {
    const lf = l.from || l.source;
    const lt = l.to || l.target;
    return (lf === fromId && lt === toId) || (lf === toId && lt === fromId);
  });
  const pIndex = Math.max(0, parallelLinks.indexOf(link));
  const pTotal = Math.max(1, parallelLinks.length);
  const trackOffset = pTotal > 1 ? (pIndex - (pTotal - 1) / 2) * 20 : 0;

  // 3. Anchor points placed on node perimeter with 2px gap so arrowheads are never obscured by borders
  const gap = 2;
  const getPort = (node, side, offset, isTarget) => {
    const w = nodeWidth(node);
    const h = nodeHeight(node);
    if (side === "left")
      return { x: node.x - (isTarget ? gap : 0), y: node.y + h / 2 + offset };
    if (side === "right")
      return {
        x: node.x + w + (isTarget ? gap : 0),
        y: node.y + h / 2 + offset,
      };
    if (side === "top")
      return { x: node.x + w / 2 + offset, y: node.y - (isTarget ? gap : 0) };
    return { x: node.x + w / 2 + offset, y: node.y + h + (isTarget ? gap : 0) };
  };

  const start = getPort(from, fromSide, fromPortOffset, false);
  const end = getPort(to, toSide, toPortOffset, true);

  // Direct straight path requested
  if (link.type === "straight" || link.routing === "straight") {
    const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    return {
      d,
      points: [start, end],
      midX: (start.x + end.x) / 2,
      midY: (start.y + end.y) / 2,
    };
  }

  // 4. Strict orthogonal right-angle step routing (no curves)
  let points = [];

  // Top perimeter routing (both using 'top' ports)
  if (fromSide === "top" && toSide === "top") {
    const routeY = Math.min(from.y, to.y) - 44 - Math.abs(trackOffset);
    points = [start, { x: start.x, y: routeY }, { x: end.x, y: routeY }, end];
  }
  // Bottom perimeter routing (both using 'bottom' ports)
  else if (fromSide === "bottom" && toSide === "bottom") {
    const routeY =
      Math.max(from.y + fh, to.y + th) + 44 + Math.abs(trackOffset);
    points = [start, { x: start.x, y: routeY }, { x: end.x, y: routeY }, end];
  }
  // Left-to-left perimeter routing
  else if (fromSide === "left" && toSide === "left") {
    const routeX = Math.min(from.x, to.x) - 44 - Math.abs(trackOffset);
    points = [start, { x: routeX, y: start.y }, { x: routeX, y: end.y }, end];
  }
  // Right-to-right perimeter routing
  else if (fromSide === "right" && toSide === "right") {
    const routeX =
      Math.max(from.x + fw, to.x + tw) + 44 + Math.abs(trackOffset);
    points = [start, { x: routeX, y: start.y }, { x: routeX, y: end.y }, end];
  }
  // Horizontal step: right-to-left or left-to-right
  else if (
    (fromSide === "right" && toSide === "left") ||
    (fromSide === "left" && toSide === "right")
  ) {
    if (Math.abs(start.y - end.y) < 2 && Math.abs(trackOffset) < 1) {
      // Perfectly aligned horizontal line
      points = [start, end];
    } else {
      const midX = (start.x + end.x) / 2 + trackOffset;
      points = [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
    }
  }
  // Vertical step: bottom-to-top or top-to-bottom
  else if (
    (fromSide === "bottom" && toSide === "top") ||
    (fromSide === "top" && toSide === "bottom")
  ) {
    if (Math.abs(start.x - end.x) < 2 && Math.abs(trackOffset) < 1) {
      // Perfectly aligned vertical line
      points = [start, end];
    } else {
      const midY = (start.y + end.y) / 2 + trackOffset;
      points = [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
    }
  }
  // Corner routes
  else if (fromSide === "right" || fromSide === "left") {
    points = [start, { x: end.x, y: start.y }, end];
  } else {
    points = [start, { x: start.x, y: end.y }, end];
  }

  // Construct SVG path command with right-angle straight segments (M ... L ...)
  const d = points.reduce(
    (path, point, index) =>
      `${path}${index ? ` L ${point.x} ${point.y}` : `M ${point.x} ${point.y}`}`,
    "",
  );

  // Calculate mid-point on the longest segment for label positioning
  const segments = points
    .slice(1)
    .map((point, index) => ({ start: points[index], end: point }));
  const labelSegment = segments.reduce((longest, segment) => {
    const len = Math.hypot(
      segment.end.x - segment.start.x,
      segment.end.y - segment.start.y,
    );
    const longestLen = Math.hypot(
      longest.end.x - longest.start.x,
      longest.end.y - longest.start.y,
    );
    return len > longestLen ? segment : longest;
  }, segments[0] || { start, end });

  return {
    d,
    points,
    midX: (labelSegment.start.x + labelSegment.end.x) / 2,
    midY: (labelSegment.start.y + labelSegment.end.y) / 2,
  };
}

export const GraphCanvas = ({
  matter,
  nodes,
  setNodes,
  selectedNodeId,
  onSelectNode,
  zoom,
  setZoom,
  pan,
  setPan,
  onFitView,
  searchQuery = "",
}) => {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingNodeId, setResizingNodeId] = useState(null);
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Pressing 'Escape' resets selection back to Default Overview State
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onSelectNode(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSelectNode]);

  // Auto-pan / center on selected node when clicked
  useEffect(() => {
    if (!selectedNodeId || !canvasRef.current) return;
    const targetNode = nodes.find((n) => n.id === selectedNodeId);
    if (!targetNode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const viewportW = rect.width || 850;
    const viewportH = rect.height || 550;

    const targetPanX = Math.round(
      viewportW / 2 - (targetNode.x + nodeWidth(targetNode) / 2) * zoom,
    );
    const targetPanY = Math.round(
      viewportH / 2 - (targetNode.y + nodeHeight(targetNode) / 2) * zoom,
    );

    setPan({ x: targetPanX, y: targetPanY });
  }, [selectedNodeId]);

  // Mouse Wheel Zoom centered on pointer
  const handleWheel = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.35), 2.5);

    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleMouseDown = (e) => {
    if (e.target.closest(".node-card")) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    } else if (draggingNodeId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId
            ? {
                ...n,
                x: Math.round(rawX - dragOffset.x),
                y: Math.round(rawY - dragOffset.y),
              }
            : n,
        ),
      );
    } else if (resizingNodeId) {
      const dx = (e.clientX - resizeStart.x) / zoom;
      const dy = (e.clientY - resizeStart.y) / zoom;
      setNodes((prev) =>
        prev.map((node) =>
          node.id === resizingNodeId
            ? {
                ...node,
                width: Math.max(180, Math.round(resizeStart.width + dx)),
                height: Math.max(72, Math.round(resizeStart.height + dy)),
              }
            : node,
        ),
      );
    }
  };

  const handleMouseUp = (e) => {
    if (isPanning) {
      const dist = Math.hypot(
        e.clientX - mouseDownPos.x,
        e.clientY - mouseDownPos.y,
      );
      // Empty background click deselects node and returns to Default Overview State
      if (
        dist < 6 &&
        !e.target.closest(".node-card") &&
        !e.target.closest(".edge-badge-group")
      ) {
        onSelectNode(null);
      }
    }
    setIsPanning(false);
    setDraggingNodeId(null);
    setResizingNodeId(null);
  };

  const startNodeDrag = (e, node) => {
    e.stopPropagation();
    onSelectNode(node.id);
    const rect = canvasRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;
    setDraggingNodeId(node.id);
    setDragOffset({
      x: clickX - node.x,
      y: clickY - node.y,
    });
  };

  const startNodeResize = (e, node) => {
    e.stopPropagation();
    setResizingNodeId(node.id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: nodeWidth(node),
      height: nodeHeight(node),
    });
  };

  const getNode = useCallback((id) => nodes.find((n) => n.id === id), [nodes]);

  // Boundaries follow their members with 40px of breathing room, including after a drag.
  const domains = useMemo(
    () =>
      (matter.domains || []).map((domain) => {
        if (domain.lockedBounds) return domain;
        const members = (domain.nodeIds || DOMAIN_NODE_IDS[domain.id] || [])
          .map((id) => nodes.find((node) => node.id === id))
          .filter(Boolean);
        if (!members.length) return domain;

        const minX =
          Math.min(...members.map((node) => node.x)) -
          (domain.id === "hisd-domain" ? 60 : 40);
        const minY = Math.min(...members.map((node) => node.y)) - 40;
        const maxX =
          Math.max(...members.map((node) => node.x + nodeWidth(node))) + 40;
        const maxY =
          Math.max(...members.map((node) => node.y + nodeHeight(node))) + 40;

        return { ...domain, x: minX, y: minY, w: maxX - minX, h: maxY - minY };
      }),
    [matter.domains, nodes],
  );

  // Compute 1-hop neighborhood for selection focus
  const neighborIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const set = new Set();
    set.add(selectedNodeId);
    (matter.links || [])
      .filter((link) => !link.chipOnly)
      .forEach((l) => {
        const fromId = l.from || l.source;
        const toId = l.to || l.target;
        if (fromId === selectedNodeId) set.add(toId);
        if (toId === selectedNodeId) set.add(fromId);
      });
    return set;
  }, [selectedNodeId, matter.links]);

  // Pre-process edges: detects reciprocal pairs (A -> B and B -> A) and merges them into bidirectional edges
  const processedEdges = useMemo(() => {
    return processEdges(matter.links || [], getNode);
  }, [matter.links, getNode]);

  // Check if node matches real-time search query
  const checkSearchMatch = useCallback(
    (node) => {
      if (!searchQuery || !searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        (node.label && node.label.toLowerCase().includes(q)) ||
        (node.sub && node.sub.toLowerCase().includes(q)) ||
        (node.assignedTask && node.assignedTask.toLowerCase().includes(q)) ||
        (node.kind && node.kind.toLowerCase().includes(q)) ||
        (node.evidence && node.evidence.toLowerCase().includes(q))
      );
    },
    [searchQuery],
  );

  return (
    <div
      ref={canvasRef}
      className={`graph-canvas ${isPanning ? "is-panning" : ""}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="canvas-transform-layer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {/* Container boundaries render first; header badges render after the SVG layer. */}
        {domains.map((d) => (
          <div
            key={d.id}
            className="domain-box"
            style={{
              left: d.x,
              top: d.y,
              width: d.w,
              height: d.h,
              borderColor: d.borderColor,
            }}
          />
        ))}

        {/* SVG Edges and Badges */}
        <svg className="edges-svg">
          <defs>
            {/* Forward Arrowheads (markerEnd) */}
            <marker
              id="arrow-structural"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-pipeline"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0284c7" />
            </marker>
            <marker
              id="arrow-alert"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#ea580c" />
            </marker>
            <marker
              id="arrow-governance"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#334155" />
            </marker>
            <marker
              id="arrow-input"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#2563EB" />
            </marker>
            <marker
              id="arrow-processing"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#0891B2" />
            </marker>
            <marker
              id="arrow-legal"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#EA580C" />
            </marker>
            <marker
              id="arrow-condition"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#E0507A" />
            </marker>
            <marker
              id="arrow-gap"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#D9531E" />
            </marker>
            <marker
              id="arrow-trace"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#7C4FE0" />
            </marker>
            <marker
              id="arrow-unresolved"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="#64748B" />
            </marker>

            {/* Reverse Arrowheads for Bidirectional Edges (markerStart) */}
            <marker
              id="arrow-structural-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#475569" />
            </marker>
            <marker
              id="arrow-pipeline-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#0284c7" />
            </marker>
            <marker
              id="arrow-alert-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#ea580c" />
            </marker>
            <marker
              id="arrow-governance-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#334155" />
            </marker>
            <marker
              id="arrow-input-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#2563EB" />
            </marker>
            <marker
              id="arrow-processing-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#0891B2" />
            </marker>
            <marker
              id="arrow-legal-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#EA580C" />
            </marker>
            <marker
              id="arrow-condition-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#E0507A" />
            </marker>
            <marker
              id="arrow-gap-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#D9531E" />
            </marker>
            <marker
              id="arrow-trace-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#7C4FE0" />
            </marker>
            <marker
              id="arrow-unresolved-start"
              viewBox="0 0 10 10"
              refX="1.5"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto"
            >
              <path d="M 8.5 1.5 L 0 5 L 8.5 8.5 z" fill="#64748B" />
            </marker>
          </defs>

          {/* ── PASS 1: Render ALL edge paths first (bottom layer) ── */}
          {processedEdges.map((link, idx) => {
            const from = getNode(link.from);
            const to = getNode(link.to);
            if (!from || !to) return null;

            const pathInfo = getOrthogonalPath(
              from,
              to,
              link,
              processedEdges,
              nodes,
            );
            const { markerId, markerStartId, lineClass } = linkStyleFor(link);

            const isEdgeFocused =
              !selectedNodeId ||
              link.from === selectedNodeId ||
              link.to === selectedNodeId;

            return (
              <path
                key={`path-${link.id || idx}`}
                d={pathInfo.d}
                className={`edge-path ${lineClass} ${isEdgeFocused ? "is-focused" : "is-dimmed"}`}
                markerEnd={`url(#${markerId})`}
                {...(link.isBidirectional
                  ? { markerStart: `url(#${markerStartId})` }
                  : {})}
              />
            );
          })}

          {/* ── PASS 2: Render ALL edge labels on top (above every path line) ── */}
          {processedEdges.map((link, idx) => {
            const from = getNode(link.from);
            const to = getNode(link.to);
            if (!from || !to || !link.label) return null;

            const category = link.category || "structural";
            const pathInfo = getOrthogonalPath(
              from,
              to,
              link,
              processedEdges,
              nodes,
            );

            const badgeClass =
              category === "alert"
                ? "badge-alert"
                : category === "pipeline"
                  ? "badge-pipeline"
                  : "badge-structural";

            const textClass =
              category === "alert"
                ? "text-alert"
                : category === "pipeline"
                  ? "text-pipeline"
                  : "text-structural";

            const isEdgeFocused =
              !selectedNodeId ||
              link.from === selectedNodeId ||
              link.to === selectedNodeId;

            const lx = pathInfo.midX;
            const ly = pathInfo.midY;
            // Labels sit on the router's longest dedicated segment with guaranteed white pill backing.
            const badgePadding = 10;
            const badgeHeight = 18;
            const hw = link.label.length * 3.4 + badgePadding;
            const priorityLabel = [
              "REQUESTED FROM",
              "EMPLOYED BY",
              "REVIEW / APPROVAL?",
            ].includes(link.label);

            return (
              <g
                key={`label-${link.id || idx}`}
                className={`edge-badge-group ${isEdgeFocused ? "is-focused" : "is-dimmed"}`}
                transform={`translate(${lx}, ${ly})`}
                style={{ zIndex: 50 }}
              >
                <rect
                  x={-hw}
                  y={-badgeHeight / 2}
                  width={hw * 2}
                  height={badgeHeight}
                  rx={4}
                  className={`edge-badge-rect ${badgeClass} ${priorityLabel ? "priority-edge-label" : ""}`}
                />
                <text
                  x={0}
                  y={3.5}
                  textAnchor="middle"
                  className={`edge-badge-text ${textClass}`}
                >
                  {link.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* This post-SVG header layer prevents any boundary stroke from crossing badge text. */}
        {domains.map((d) => (
          <div
            key={`${d.id}-header`}
            className={[
              "domain-pill",
              d.id === "hisd-domain"
                ? "domain-pill-hisd"
                : d.id === "sas-domain"
                  ? "domain-pill-sas"
                  : d.id === "gaps-domain"
                    ? "domain-pill-gaps"
                    : "",
            ]
              .join(" ")
              .trim()}
            style={{
              left: d.x + 16,
              top: d.y + 16,
              backgroundColor: d.badgeBg,
            }}
          >
            {d.name}
          </div>
        ))}

        {/* Node Cards (Draggable, Non-truncated, Focused / Dimmed states) */}
        {nodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isDragging = node.id === draggingNodeId;
          const isNeighbor = neighborIds.has(node.id);
          const isMatch = checkSearchMatch(node);

          // DEFAULT OVERVIEW: When selectedNodeId is null and no search:
          // ALL nodes are at 100% full opacity (isDimmed = false)
          const isDimmed = selectedNodeId
            ? !isNeighbor
            : searchQuery
              ? !isMatch
              : false;

          return (
            <div
              key={node.id}
              className={`node-card kind-${node.kind} ${node.id === "hisd" ? "central-hub" : ""} ${isSelected ? "selected" : ""} ${
                isDragging ? "dragging" : ""
              } ${isDimmed ? "is-dimmed" : ""} ${searchQuery && isMatch ? "search-match" : ""}`}
              data-node-id={node.id}
              style={{
                left: node.x,
                top: node.y,
                width: nodeWidth(node),
                minHeight: nodeHeight(node),
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectNode(node.id);
              }}
              onMouseDown={(e) => startNodeDrag(e, node)}
            >
              <div className={`node-icon-box box-${node.kind}`}>
                <Icon name={node.kind} size={16} />
              </div>
              <div className="node-text">
                <b className="node-title">{node.label}</b>
                <span className="node-sub">{node.sub}</span>
              </div>
              <button
                className="node-resize-handle"
                aria-label={`Resize ${node.label}`}
                onMouseDown={(e) => startNodeResize(e, node)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
