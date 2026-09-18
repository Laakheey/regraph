import React, { useRef } from 'react';
import { MVIcon } from './MVIcons';

const MODES = [
  { id: 'select', label: 'Select', icon: 'select' },
  { id: 'box', label: 'Box', icon: 'box' },
  { id: 'arrow', label: 'Arrow', icon: 'arrow' },
  { id: 'boundary', label: 'Boundary', icon: 'boundary' },
];

export const MVToolbar = ({
  mode, setMode, pinTool, setPinTool,
  onClearCanvas, onReloadSeed, onExportJSON, onImportJSON,
}) => {
  const fileRef = useRef(null);

  const handleImportClick = () => {
    if (fileRef.current) fileRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
      e.target.value = '';
    }
  };

  return (
    <div className="mv-toolbar">
      <div className="mv-toolbar-modes">
        {MODES.map((m) => (
          <button
            key={m.id}
            className={`mv-toolbar-btn ${mode === m.id ? 'mv-toolbar-btn-active' : ''}`}
            onClick={() => setMode(m.id)}
            title={m.label}
          >
            <MVIcon name={m.icon} size={16} />
            <span>{m.label}</span>
          </button>
        ))}
        <label className="mv-pin-toggle" title="Keep tool active after use">
          <input
            type="checkbox"
            checked={pinTool}
            onChange={(e) => setPinTool(e.target.checked)}
          />
          <MVIcon name="pin" size={12} />
          <span>Pin</span>
        </label>
      </div>

      <div className="mv-toolbar-divider" />

      <div className="mv-toolbar-actions">
        <button className="mv-action-btn" onClick={onClearCanvas} title="Clear Canvas">
          <MVIcon name="clear" size={14} /> Clear
        </button>
        <button className="mv-action-btn" onClick={onReloadSeed} title="Reload Seed Data">
          <MVIcon name="reload" size={14} /> Reload Seed
        </button>
        <button className="mv-action-btn" onClick={onExportJSON} title="Export JSON">
          <MVIcon name="exportIcon" size={14} /> Export
        </button>
        <button className="mv-action-btn" onClick={handleImportClick} title="Import JSON">
          <MVIcon name="importIcon" size={14} /> Import
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
