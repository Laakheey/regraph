import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Icon } from './Icons';

export const NODE_WIDTH = 220;
export const NODE_HEIGHT = 72;
const MAX_CANVAS_Y = 960;
const DOMAIN_NODE_IDS = {
  'hisd-domain': ['hisd', 'jackson-ms', 'hft', 'santos'],
  'sas-domain': ['sas', 'assessment', 'student-data', 'evaas'],
  'gaps-domain': ['gap']
};

// Calculate clean cubic bezier paths that smoothly curve around and connect card borders
export function getCurvedPath(from, to, offset = 0) {
  // 1. score → santos: SHORT direct vertical — Santos directly above Score in Col 4
  if (from.id === 'score' && to.id === 'santos') {
    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y;
    const endX   = to.x + NODE_WIDTH / 2;
    const endY   = to.y + NODE_HEIGHT + 4;
    const dy     = Math.max(startY - endY, 20);
    const cx1 = startX;
    const cy1 = startY - dy * 0.5;
    const cx2 = endX;
    const cy2 = endY + dy * 0.5;
    const d    = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
    const midX = 0.125*startX + 0.375*cx1 + 0.375*cx2 + 0.125*endX;
    const midY = 0.125*startY + 0.375*cy1 + 0.375*cy2 + 0.125*endY;
    return { d, startX, startY, endX, endY, cx1, cy1, cx2, cy2, midX, midY };
  }

  // 2. santos → jackson-ms: route through the open lane between rows one and two.
  if (from.id === 'santos' && to.id === 'jackson-ms') {
    const startX = from.x;
    const startY = from.y + NODE_HEIGHT;
    const laneY = 170;
    const endX = to.x + NODE_WIDTH / 2;
    const endY = to.y - 6;
    const routeX = 985; // Left of the score card, keeping the descent collision-free.
    const d = `M ${startX} ${startY} H ${routeX} V ${laneY} H ${endX} V ${endY}`;
    return { d, startX, startY, endX, endY, midX: (routeX + endX) / 2, midY: laneY };
  }

  // 3. hft → hisd: curve RIGHT then UP, skirting around jackson-ms right border cleanly
  if (from.id === 'hft' && to.id === 'hisd') {
    const startX = from.x + NODE_WIDTH;
    const startY = from.y + NODE_HEIGHT / 2;
    const endX   = to.x;
    const endY   = to.y + NODE_HEIGHT / 2;
    const cx1 = startX + 160;
    const cy1 = startY + 60;
    const cx2 = endX - 60;
    const cy2 = endY + 80;
    const d    = `M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`;
    const midX = 0.125*startX + 0.375*cx1 + 0.375*cx2 + 0.125*endX;
    const midY = 0.125*startY + 0.375*cy1 + 0.375*cy2 + 0.125*endY;
    return { d, startX, startY, endX, endY, cx1, cy1, cx2, cy2, midX, midY };
  }

  // 4. hft → disclosure: orthogonal footer route below the Responsibility Gaps domain.
  if (from.id === 'hft' && to.id === 'disclosure') {
    const startX = from.x + NODE_WIDTH / 2;
    const startY = from.y + NODE_HEIGHT;
    const endX   = to.x + NODE_WIDTH / 2;
    const endY   = to.y + NODE_HEIGHT;
    const footerY = MAX_CANVAS_Y - 20;
    const d = `M ${startX} ${startY} V ${footerY} H ${endX} V ${endY}`;
    return { d, startX, startY, endX, endY, midX: (startX + endX) / 2, midY: footerY };
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

    const minX = Math.min(...members.map((node) => node.x)) - 40;
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
            const pathInfo  = getCurvedPath(from, to, 0);

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
            const pathInfo   = getCurvedPath(from, to, 0);

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

            const lx = pathInfo.midX + (link.midXOff || 0);
            const ly = pathInfo.midY + (link.midYOff || 0);
            // Every SVG label gets an opaque 2px × 6px backing pill.
            const badgePadding = 6;
            const badgeHeight = 14;
            const hw = link.label.length * 3.4 + badgePadding;

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
                  className={`edge-badge-rect ${badgeClass}`}
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
                top: d.y + (d.id === 'gaps-domain' ? 26 : 14),
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
              className={`node-card kind-${node.kind} ${isSelected ? 'selected' : ''} ${
                isDragging ? 'dragging' : ''
              } ${isDimmed ? 'is-dimmed' : ''} ${searchQuery && isMatch ? 'search-match' : ''}`}
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
