import React, { useState } from 'react';
import { Icon } from './Icons';

// Canonical column x-positions (must match incidentsData.jsx)
const COL_X = { 1: 55, 2: 375, 3: 690, 4: 1005 };

export const LegendAndControls = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onFitView,
  onResetOverview,
  selectedNodeId,
  onExportReportPdf,
  onExportDiagramPdf,
  onExportDiagramPng,
  nodes,
  setNodes
}) => {
  const [exportOpen, setExportOpen] = useState(false);

  // Cleanup pass: snap every node back to its canonical column x before export
  const runLayoutCleanup = () => {
    if (!setNodes) return;
    setNodes((prev) =>
      prev.map((n) => {
        const colX = COL_X[n.col];
        return colX !== undefined ? { ...n, x: colX } : n;
      })
    );
  };

  const handleExportDiagramPdf = () => {
    runLayoutCleanup();
    // Small delay so React re-renders the cleaned positions before exporting
    setTimeout(() => {
      onExportDiagramPdf();
      setExportOpen(false);
    }, 80);
  };

  const handleExportDiagramPng = () => {
    runLayoutCleanup();
    setTimeout(() => {
      onExportDiagramPng();
      setExportOpen(false);
    }, 80);
  };

  const legendItems = [
    { label: 'Person', color: '#ec4899' },
    { label: 'School / Org', color: '#06b6d4' },
    { label: 'Assessment', color: '#16a34a' },
    { label: 'System Engine', color: '#0d9488' },
    { label: 'Data Record', color: '#1e293b' },
    { label: 'Appraisal Act', color: '#2563eb' },
    { label: 'Human Gap', color: '#ea580c' },
    { label: 'Consequence', color: '#ea580c' }
  ];

  return (
    <footer className="legend-toolbar">
      <div className="legend-chips-container">
        <div className="legend-chips">
          {legendItems.map((item) => (
            <span key={item.label} className="legend-chip">
              <span className="legend-dot" style={{ backgroundColor: item.color }} />
              <span className="legend-chip-label">{item.label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="canvas-controls">
        {/* Reset / Overview Button */}
        <button
          className={`control-btn overview-btn ${!selectedNodeId ? 'is-active-overview' : ''}`}
          onClick={onResetOverview}
          title="Reset to Default Overview State (Show all nodes at 100% full opacity)"
        >
          <Icon name="brand" size={13} />
          <span>Reset / Overview</span>
        </button>

        {/* Visual Diagram PDF & PNG Export Dropdown — with cleanup pass */}
        <div className="export-dropdown-wrapper">
          <button
            className="control-btn pdf-export-btn"
            onClick={() => setExportOpen(!exportOpen)}
            title="Download visual diagram snapshot as PDF or PNG (auto-cleans layout)"
          >
            <Icon name="pdf" size={13} />
            <span>Export Diagram</span>
            <Icon name="chevron-down" size={10} />
          </button>

          {exportOpen && (
            <div className="export-menu">
              <button
                className="export-menu-item"
                onClick={handleExportDiagramPdf}
              >
                <Icon name="pdf" size={13} />
                <div>
                  <b>Diagram Snapshot (PDF)</b>
                  <small>Auto-cleans layout · retains your positions</small>
                </div>
              </button>

              <button
                className="export-menu-item"
                onClick={handleExportDiagramPng}
              >
                <Icon name="download" size={13} />
                <div>
                  <b>Diagram Snapshot (PNG)</b>
                  <small>High-resolution image file</small>
                </div>
              </button>

              <div className="export-menu-divider" />

              <button
                className="export-menu-item"
                onClick={() => {
                  onExportReportPdf();
                  setExportOpen(false);
                }}
              >
                <Icon name="assessment" size={13} />
                <div>
                  <b>Full Investigation Report (PDF)</b>
                  <small>Structured tables, sequence & TRACE matrix</small>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="zoom-stepper">
          <button onClick={onZoomOut} title="Zoom Out">
            <Icon name="zoom-out" size={12} />
          </button>
          <span className="zoom-text">{Math.round(zoom * 100)}%</span>
          <button onClick={onZoomIn} title="Zoom In">
            <Icon name="zoom-in" size={12} />
          </button>
        </div>

        <button className="control-btn fit-btn" onClick={onFitView} title="Fit entire graph to screen">
          <Icon name="fit" size={13} />
        </button>
      </div>
    </footer>
  );
};
