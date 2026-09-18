import React from 'react';
import { MVIcon } from './MVIcons';
import { EDGE_KINDS, LINE_STYLES, ICON_OPTIONS } from './mvUtils';

const Field = ({ label, children }) => (
  <div className="mv-field">
    <label className="mv-sidebar-label">{label}</label>
    {children}
  </div>
);

const SidebarHelp = () => (
  <div className="mv-sidebar-help">
    <h3 className="mv-sidebar-title">Manual Visual Editor</h3>
    <div className="mv-help-items">
      <div className="mv-help-item"><b>Select</b> — Click elements to edit them</div>
      <div className="mv-help-item"><b>Box</b> — Click canvas to place a node</div>
      <div className="mv-help-item"><b>Arrow</b> — Drag between nodes to connect</div>
      <div className="mv-help-item"><b>Boundary</b> — Click-drag to draw a region</div>
    </div>
    <div className="mv-help-shortcuts">
      <small><b>Delete/Backspace</b> — Remove selected</small><br/>
      <small><b>Escape</b> — Deselect, return to Select mode</small>
    </div>
  </div>
);

const NodeEditor = ({ node, boundaries, onUpdate, onDelete }) => {
  const d = node.data;
  const update = (patch) => onUpdate(node.id, patch);
  const updateDetail = (key, val) => update({ detail: { ...d.detail, [key]: val } });

  return (
    <div className="mv-sidebar-editor">
      <h3 className="mv-sidebar-title">Edit Node</h3>
      <Field label="Title">
        <input className="mv-input" value={d.title || ''} autoFocus
          onChange={(e) => update({ title: e.target.value })} />
      </Field>
      <Field label="Subtitle">
        <input className="mv-input" value={d.subtitle || ''}
          onChange={(e) => update({ subtitle: e.target.value })} />
      </Field>
      <Field label="Group / Domain">
        <select className="mv-select" value={d.group || ''}
          onChange={(e) => update({ group: e.target.value })}>
          <option value="">(none)</option>
          {boundaries.map((b) => (
            <option key={b.id} value={b.id}>{b.data.name}</option>
          ))}
        </select>
      </Field>
      <Field label="Icon">
        <div className="mv-icon-picker">
          {ICON_OPTIONS.map((ic) => (
            <button key={ic}
              className={`mv-icon-option ${d.icon === ic ? 'mv-icon-option-active' : ''}`}
              onClick={() => update({ icon: ic })} title={ic}>
              <MVIcon name={ic} size={18} />
            </button>
          ))}
        </div>
      </Field>
      <Field label="Accent Color">
        <input type="color" className="mv-color-input" value={d.accent || '#475569'}
          onChange={(e) => update({ accent: e.target.value })} />
      </Field>
      <Field label="Gap / Unresolved">
        <label className="mv-checkbox-label">
          <input type="checkbox" checked={!!d.gapNode}
            onChange={(e) => update({ gapNode: e.target.checked })} />
          Render as gap node (dashed border)
        </label>
      </Field>
      <hr className="mv-divider" />
      <Field label="Fact / Source-Supported">
        <textarea className="mv-textarea" rows={2} value={d.detail?.fact || ''}
          onChange={(e) => updateDetail('fact', e.target.value)} />
      </Field>
      <Field label="Responsibility Significance">
        <textarea className="mv-textarea" rows={2} value={d.detail?.significance || ''}
          onChange={(e) => updateDetail('significance', e.target.value)} />
      </Field>
      <Field label="Evidence / Gap">
        <textarea className="mv-textarea" rows={2} value={d.detail?.gap || ''}
          onChange={(e) => updateDetail('gap', e.target.value)} />
      </Field>
      <Field label="Source Page(s)">
        <input className="mv-input" value={d.detail?.pages || ''}
          onChange={(e) => updateDetail('pages', e.target.value)} />
      </Field>
      <button className="mv-delete-btn" onClick={() => onDelete(node.id, 'node')}>
        <MVIcon name="delete" size={14} /> Delete Node
      </button>
    </div>
  );
};

const EdgeEditor = ({ edge, onUpdate, onDelete }) => {
  const d = edge.data || {};
  const update = (patch) => onUpdate(edge.id, patch);

  return (
    <div className="mv-sidebar-editor">
      <h3 className="mv-sidebar-title">Edit Edge</h3>
      <Field label="Label">
        <input className="mv-input" value={d.label || ''} autoFocus
          onChange={(e) => update({ label: e.target.value })} />
      </Field>
      <Field label="Direction">
        <label className="mv-checkbox-label">
          <input type="checkbox" checked={!!d.bidirectional}
            onChange={(e) => update({ bidirectional: e.target.checked })} />
          Bidirectional (arrows on both ends)
        </label>
      </Field>
      <Field label="Line Style">
        <select className="mv-select" value={d.lineStyle || 'solid'}
          onChange={(e) => update({ lineStyle: e.target.value })}>
          {LINE_STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </Field>
      <Field label="Color">
        <input type="color" className="mv-color-input" value={d.color || '#475569'}
          onChange={(e) => update({ color: e.target.value })} />
      </Field>
      <Field label="Kind / Category">
        <select className="mv-select" value={d.kind || 'direct'}
          onChange={(e) => update({ kind: e.target.value })}>
          {EDGE_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
        </select>
      </Field>
      <Field label="Note">
        <textarea className="mv-textarea" rows={2} value={d.note || ''}
          onChange={(e) => update({ note: e.target.value })} />
      </Field>
      <Field label="Source Page(s)">
        <input className="mv-input" value={d.pages || ''}
          onChange={(e) => update({ pages: e.target.value })} />
      </Field>
      <button className="mv-delete-btn" onClick={() => onDelete(edge.id, 'edge')}>
        <MVIcon name="delete" size={14} /> Delete Edge
      </button>
    </div>
  );
};

const BoundaryEditor = ({ boundary, onUpdate, onDelete }) => {
  const d = boundary.data || {};
  const update = (patch) => onUpdate(boundary.id, patch);

  return (
    <div className="mv-sidebar-editor">
      <h3 className="mv-sidebar-title">Edit Boundary</h3>
      <Field label="Name">
        <input className="mv-input" value={d.name || ''} autoFocus
          onChange={(e) => update({ name: e.target.value })} />
      </Field>
      <Field label="Accent Color">
        <input type="color" className="mv-color-input" value={d.accent || '#2F6FED'}
          onChange={(e) => update({ accent: e.target.value })} />
      </Field>
      <Field label="Fill Tint">
        <input type="color" className="mv-color-input" value={d.tint || '#EEF3FE'}
          onChange={(e) => update({ tint: e.target.value })} />
      </Field>
      <Field label="Fill Opacity">
        <input type="range" min="0" max="1" step="0.05"
          value={d.fillOpacity != null ? d.fillOpacity : 0.3}
          onChange={(e) => update({ fillOpacity: parseFloat(e.target.value) })} />
        <span className="mv-opacity-val">{((d.fillOpacity != null ? d.fillOpacity : 0.3) * 100).toFixed(0)}%</span>
      </Field>
      <button className="mv-delete-btn" onClick={() => onDelete(boundary.id, 'boundary')}>
        <MVIcon name="delete" size={14} /> Delete Boundary
      </button>
      <p className="mv-help-note">Deleting a boundary does NOT delete the nodes inside it.</p>
    </div>
  );
};

export const MVSidebar = ({
  selectedId, selectedType, nodes, edges, boundaries,
  onUpdateNode, onUpdateEdge, onUpdateBoundary, onDeleteElement,
}) => {
  if (!selectedId || !selectedType) {
    return <aside className="mv-sidebar"><SidebarHelp /></aside>;
  }

  if (selectedType === 'node') {
    const node = nodes.find((n) => n.id === selectedId);
    if (!node) return <aside className="mv-sidebar"><SidebarHelp /></aside>;
    return (
      <aside className="mv-sidebar">
        <NodeEditor node={node} boundaries={boundaries}
          onUpdate={onUpdateNode} onDelete={onDeleteElement} />
      </aside>
    );
  }

  if (selectedType === 'edge') {
    const edge = edges.find((e) => e.id === selectedId);
    if (!edge) return <aside className="mv-sidebar"><SidebarHelp /></aside>;
    return (
      <aside className="mv-sidebar">
        <EdgeEditor edge={edge}
          onUpdate={onUpdateEdge} onDelete={onDeleteElement} />
      </aside>
    );
  }

  if (selectedType === 'boundary') {
    const boundary = boundaries.find((b) => b.id === selectedId);
    if (!boundary) return <aside className="mv-sidebar"><SidebarHelp /></aside>;
    return (
      <aside className="mv-sidebar">
        <BoundaryEditor boundary={boundary}
          onUpdate={onUpdateBoundary} onDelete={onDeleteElement} />
      </aside>
    );
  }

  return <aside className="mv-sidebar"><SidebarHelp /></aside>;
};
