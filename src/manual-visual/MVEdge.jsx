import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, MarkerType } from '@xyflow/react';

export const MVEdge = ({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, selected, style,
  markerEnd, markerStart,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, targetX, targetY,
    sourcePosition, targetPosition,
    borderRadius: 8,
  });

  const color = data?.color || '#475569';
  const lineStyle = data?.lineStyle || 'solid';
  const dashArray = lineStyle === 'dashed' ? '8 4' : lineStyle === 'dotted' ? '3 3' : undefined;
  const label = data?.label ? String(data.label).replaceAll('_', ' ') : '';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: selected ? 2.5 : 1.8,
          strokeDasharray: dashArray,
          ...style,
        }}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className={`mv-edge-label ${selected ? 'mv-edge-label-selected' : ''}`}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export const getEdgeMarkers = (data) => {
  const color = data?.color || '#475569';
  const result = {
    markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
  };
  if (data?.bidirectional) {
    result.markerStart = { type: MarkerType.ArrowClosed, color, width: 16, height: 16 };
  }
  return result;
};
