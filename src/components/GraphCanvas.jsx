import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from './Icons';

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 72;
const DOMAIN_NODE_IDS = {
  'hisd-domain': ['hisd', 'jackson-ms', 'hft', 'assessment', 'student-data'],
  'sas-domain': ['sas', 'evaas'],
  'gaps-domain': ['gap', 'disclosure']
};

// Deterministic Manhattan routing: every segment is horizontal or vertical.
export function getOrthogonalPath(from, to, link, allLinks, allNodes) {
  // The oversight question enters Evaluation Use from its bottom edge, keeping the
  // final elbow inside the graph rather than out in the open right margin.
  if (link.label === 'REVIEW / APPROVAL?' && to.id === 'evaluation') {
    const start = { x: from.x + NODE_WIDTH / 2, y: from.y };
    const end = { x: to.x + NODE_WIDTH / 2, y: to.y + NODE_HEIGHT };
    const routeY = Math.max(from.y - 28, to.y + NODE_HEIGHT + 28);
    const points = [start, { x: start.x, y: routeY }, { x: end.x, y: routeY }, end];
    const d = points.reduce((path, point, index) => `${path}${index ? ` L ${point.x} ${point.y}` : `M ${point.x} ${point.y}`}`, '');
    return { d, points, midX: (start.x + end.x) / 2, midY: routeY };
  }

  const sideFor = (node, other) => {
    const dx = other.x + NODE_WIDTH / 2 - (node.x + NODE_WIDTH / 2);
    const dy = other.y + NODE_HEIGHT / 2 - (node.y + NODE_HEIGHT / 2);
    if (Math.abs(dx) >= Math.abs(dy)) return dx >= 0 ? 'right' : 'left';
    return dy >= 0 ? 'bottom' : 'top';
  };
  const fromSide = sideFor(from, to);
  const toSide = sideFor(to, from);
  const distributedPort = (node, side, isSource) => {
    const siblings = allLinks.filter((candidate) => {
      const endpointId = isSource ? candidate.from : candidate.to;
      if (endpointId !== node.id) return false;
      const otherId = isSource ? candidate.to : candidate.from;
      const other = allNodes.find((item) => item.id === otherId);
      return other && sideFor(node, other) === side;
    });
    const index = siblings.indexOf(link);
    const offset = (index - (siblings.length - 1) / 2) * 12;
    if (side === 'left') return { x: node.x, y: node.y + NODE_HEIGHT / 2 + offset };
    if (side === 'right') return { x: node.x + NODE_WIDTH, y: node.y + NODE_HEIGHT / 2 + offset };
    if (side === 'top') return { x: node.x + NODE_WIDTH / 2 + offset, y: node.y };
    return { x: node.x + NODE_WIDTH / 2 + offset, y: node.y + NODE_HEIGHT };
  };

  const start = distributedPort(from, fromSide, true);
  const end = distributedPort(to, toSide, false);
  const horizontalFirst = fromSide === 'left' || fromSide === 'right';
  const trackOffset = (allLinks.indexOf(link) % 3 - 1) * 12;
  const points = horizontalFirst
    ? [start, { x: (start.x + end.x) / 2 + trackOffset, y: start.y }, { x: (start.x + end.x) / 2 + trackOffset, y: end.y }, end]
    : [start, { x: start.x, y: (start.y + end.y) / 2 + trackOffset }, { x: end.x, y: (start.y + end.y) / 2 + trackOffset }, end];
  const d = points.reduce((path, point, index) => `${path}${index ? ` L ${point.x} ${point.y}` : `M ${point.x} ${point.y}`}`, '');
  const segments = points.slice(1).map((point, index) => ({ start: points[index], end: point }));
  const labelSegment = segments.reduce((longest, segment) => {
    const length = Math.abs(segment.end.x - segment.start.x) + Math.abs(segment.end.y - segment.start.y);
    const longestLength = Math.abs(longest.end.x - longest.start.x) + Math.abs(longest.end.y - longest.start.y);
    return length > longestLength ? segment : longest;
  });
  return {
    d,
    points,
    midX: (labelSegment.start.x + labelSegment.end.x) / 2,
    midY: (labelSegment.start.y + labelSegment.end.y) / 2
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
  searchQuery = ''
}) => {
  const canvasRef = useRef(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Pressing 'Escape' resets selection back to Default Overview State
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onSelectNode(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelectNode]);

  // Auto-pan / center on selected node when clicked
  useEffect(() => {
    if (!selectedNodeId || !canvasRef.current) return;
    const targetNode = nodes.find((n) => n.id === selectedNodeId);
    if (!targetNode) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const viewportW = rect.width || 850;
    const viewportH = rect.height || 550;

    const targetPanX = Math.round(viewportW / 2 - (targetNode.x + NODE_WIDTH / 2) * zoom);
    const targetPanY = Math.round(viewportH / 2 - (targetNode.y + NODE_HEIGHT / 2) * zoom);

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
    if (e.target.closest('.node-card')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    setMouseDownPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    } else if (draggingNodeId) {
      const rect = canvasRef.current.getBoundingClientRect();
      const rawX = (e.clientX - rect.left - pan.x) / zoom;
      const rawY = (e.clientY - rect.top - pan.y) / zoom;

      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggingNodeId
            ? { ...n, x: Math.round(rawX - dragOffset.x), y: Math.round(rawY - dragOffset.y) }
            : n
        )
      );
    }
  };

  const handleMouseUp = (e) => {
    if (isPanning) {
      const dist = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      // Empty background click deselects node and returns to Default Overview State
      if (dist < 6 && !e.target.closest('.node-card') && !e.target.closest('.edge-badge-group')) {
        onSelectNode(null);
      }
    }
    setIsPanning(false);
    setDraggingNodeId(null);
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
      y: clickY - node.y
    });
  };

  const getNode = useCallback((id) => nodes.find((n) => n.id === id), [nodes]);

  // Boundaries follow their members with 40px of breathing room, including after a drag.
  const domains = useMemo(() => (matter.domains || []).map((domain) => {
    const members = (DOMAIN_NODE_IDS[domain.id] || [])
      .map((id) => nodes.find((node) => node.id === id))
      .filter(Boolean);
    if (!members.length) return domain;

    const minX = Math.min(...members.map((node) => node.x)) - (domain.id === 'hisd-domain' ? 60 : 40);
    const minY = Math.min(...members.map((node) => node.y)) - 40;
    const maxX = Math.max(...members.map((node) => node.x + NODE_WIDTH)) + 40;
    const maxY = Math.max(...members.map((node) => node.y + NODE_HEIGHT)) + 40;

    return { ...domain, x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }), [matter.domains, nodes]);

  // Compute 1-hop neighborhood for selection focus
  const neighborIds = useMemo(() => {
    if (!selectedNodeId) return new Set();
    const set = new Set();
    set.add(selectedNodeId);
    matter.links.forEach((l) => {
      if (l.from === selectedNodeId) set.add(l.to);
      if (l.to === selectedNodeId) set.add(l.from);
    });
    return set;
  }, [selectedNodeId, matter.links]);

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
    [searchQuery]
  );

  return (
    <div
      ref={canvasRef}
      className={`graph-canvas ${isPanning ? 'is-panning' : ''}`}
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
          transformOrigin: '0 0'
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
                borderColor: d.borderColor
              }}
            />
          ))}

        {/* SVG Edges and Badges */}
        <svg className="edges-svg">
          <defs>
            {/* 1. Structural / Contractual Arrowhead (Slate) */}
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

            {/* 2. Data & Algorithmic Pipeline Arrowhead (Blue) */}
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

            {/* 3. Adverse / Withheld / Gap Arrowhead (Orange/Red) */}
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
          </defs>

          {/* ── PASS 1: Render ALL edge paths first (bottom layer) ── */}
          {matter.links.map((link, idx) => {
            const from = getNode(link.from);
            const to   = getNode(link.to);
            if (!from || !to) return null;

            const category = link.category || 'structural';
            const pathInfo = getOrthogonalPath(from, to, link, matter.links, nodes);

            const markerId =
              category === 'alert'    ? 'arrow-alert'    :
              category === 'pipeline' ? 'arrow-pipeline'  :
                                        'arrow-structural';

            const lineClass =
              category === 'alert'    ? 'edge-alert'    :
              category === 'pipeline' ? 'edge-pipeline'  :
                                        'edge-structural';

            const isEdgeFocused =
              !selectedNodeId || link.from === selectedNodeId || link.to === selectedNodeId;

            return (
              <path
                key={`path-${idx}`}
                d={pathInfo.d}
                className={`edge-path ${lineClass} ${isEdgeFocused ? 'is-focused' : 'is-dimmed'}`}
                markerEnd={`url(#${markerId})`}
              />
            );
          })}

          {/* ── PASS 2: Render ALL edge labels on top (above every path line) ── */}
          {matter.links.map((link, idx) => {
            const from = getNode(link.from);
            const to   = getNode(link.to);
            if (!from || !to || !link.label) return null;

            const category  = link.category || 'structural';
            const pathInfo = getOrthogonalPath(from, to, link, matter.links, nodes);

            const badgeClass =
              category === 'alert'    ? 'badge-alert'    :
              category === 'pipeline' ? 'badge-pipeline'  :
                                        'badge-structural';

            const textClass =
              category === 'alert'    ? 'text-alert'    :
              category === 'pipeline' ? 'text-pipeline'  :
                                        'text-structural';

            const isEdgeFocused =
              !selectedNodeId || link.from === selectedNodeId || link.to === selectedNodeId;

            const lx = pathInfo.midX;
            const ly = pathInfo.midY;
            // Every SVG label gets an opaque 2px × 6px backing pill.
            const badgePadding = 6;
            const badgeHeight = 14;
            const hw = link.label.length * 3.4 + badgePadding;
            const priorityLabel = ['REQUESTED FROM', 'EMPLOYED BY', 'REVIEW / APPROVAL?'].includes(link.label);

            return (
              <g
                key={`label-${idx}`}
                className={`edge-badge-group ${isEdgeFocused ? 'is-focused' : 'is-dimmed'}`}
                transform={`translate(${lx}, ${ly})`}
              >
                <rect
                  x={-hw}
                  y={-badgeHeight / 2}
                  width={hw * 2}
                  height={badgeHeight}
                  rx={4}
                  className={`edge-badge-rect ${badgeClass} ${priorityLabel ? 'priority-edge-label' : ''}`}
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
                'domain-pill',
                d.id === 'hisd-domain' ? 'domain-pill-hisd' :
                d.id === 'sas-domain'  ? 'domain-pill-sas'  :
                d.id === 'gaps-domain' ? 'domain-pill-gaps'  : ''
              ].join(' ').trim()}
              style={{
                left: d.x + 16,
                top: d.y + 16,
                backgroundColor: d.badgeBg
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
          const isDimmed = selectedNodeId ? !isNeighbor : searchQuery ? !isMatch : false;

          return (
            <div
              key={node.id}
              className={`node-card kind-${node.kind} ${node.id === 'hisd' ? 'central-hub' : ''} ${isSelected ? 'selected' : ''} ${
                isDragging ? 'dragging' : ''
              } ${isDimmed ? 'is-dimmed' : ''} ${searchQuery && isMatch ? 'search-match' : ''}`}
              data-node-id={node.id}
              style={{
                left: node.x,
                top: node.y,
                width: NODE_WIDTH,
                minHeight: NODE_HEIGHT
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
                <b className="node-title">
                  {node.label}
                </b>
                <span className="node-sub">
                  {node.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
