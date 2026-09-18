import React, { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ModeContext } from './mvUtils';
import { MVIcon } from './MVIcons';

const positions = [
  { pos: Position.Top, id: 'top' },
  { pos: Position.Right, id: 'right' },
  { pos: Position.Bottom, id: 'bottom' },
  { pos: Position.Left, id: 'left' },
];

export const MVNodeCard = ({ data, selected, id }) => {
  const mode = useContext(ModeContext);
  const connectable = mode === 'arrow';
  const isGap = data.gapNode;

  return (
    <div
      className={`mv-node-card ${selected ? 'mv-node-selected' : ''} ${isGap ? 'mv-node-gap' : ''}`}
      style={{ borderColor: data.accent || '#475569' }}
    >
      {positions.map(({ pos, id: side }) => (
        <React.Fragment key={side}>
          <Handle
            type="source"
            position={pos}
            id={`${side}-s`}
            isConnectable={connectable}
            className={`mv-handle ${connectable ? 'mv-handle-active' : ''}`}
          />
          <Handle
            type="target"
            position={pos}
            id={`${side}-t`}
            isConnectable={connectable}
            className={`mv-handle ${connectable ? 'mv-handle-active' : ''}`}
          />
        </React.Fragment>
      ))}

      <div className="mv-node-icon" style={{ background: data.accent || '#475569' }}>
        <MVIcon name={data.icon || 'question'} size={16} color="#fff" />
      </div>
      <div className="mv-node-text">
        <div className="mv-node-title">{data.title || 'Untitled'}</div>
        {data.subtitle && <div className="mv-node-subtitle">{data.subtitle}</div>}
      </div>
    </div>
  );
};
