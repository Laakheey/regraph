import React from 'react';

export const MVBoundaryNode = ({ data, selected, id, style }) => {
  const accent = data.accent || '#2F6FED';
  const tint = data.tint || '#EEF3FE';
  const opacity = data.fillOpacity != null ? data.fillOpacity : 0.3;

  return (
    <div
      className={`mv-boundary ${selected ? 'mv-boundary-selected' : ''}`}
      style={{
        width: style?.width || 400,
        height: style?.height || 300,
        borderColor: accent,
        background: tint,
        opacity: 1,
      }}
    >
      <div className="mv-boundary-label" style={{ background: accent }}>
        {data.name || 'Untitled Region'}
      </div>
      {selected && (
        <>
          <div className="mv-boundary-resize mv-resize-se" />
          <div className="mv-boundary-resize mv-resize-e" />
          <div className="mv-boundary-resize mv-resize-s" />
        </>
      )}
    </div>
  );
};
