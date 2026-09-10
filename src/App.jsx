import React, { useState, useEffect } from 'react';
import { INCIDENTS } from './data/incidentsData';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { GraphCanvas } from './components/GraphCanvas';
import { SequenceTrack } from './components/SequenceTrack';
import { LegendAndControls } from './components/LegendAndControls';
import { Inspector } from './components/Inspector';
import { MatterView } from './components/MatterView';
import { EvidenceView } from './components/EvidenceView';
import { AuthorityControlView } from './components/AuthorityControlView';
import { TimelineView } from './components/TimelineView';
import { RunDetailsModal } from './components/RunDetailsModal';
import { LegalAssistantModal } from './components/LegalAssistantModal';
import { exportPdfSnapshot } from './utils/exportPdfSnapshot';
import { exportDiagramVisualPdf, exportDiagramPng } from './utils/exportDiagramVisual';

export const App = () => {
  const [matterKey, setMatterKey] = useState('hft-santos');
  const currentMatter = INCIDENTS[matterKey] || Object.values(INCIDENTS)[0];

  const [nodes, setNodes] = useState(currentMatter.nodes);
  // Default Overview State: null (Show all elements at 100% full opacity)
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  // Active View State (Left Navigation Bar)
  const [activeView, setActiveView] = useState('agent-activity');

  // Real-time Global Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Slide-over & Modal Overlays
  const [runDetailsNode, setRunDetailsNode] = useState(null);
  const [isRunDetailsOpen, setIsRunDetailsOpen] = useState(false);
  const [isLegalAssistantOpen, setIsLegalAssistantOpen] = useState(false);

  // Zoom and Pan Playground State
  const [zoom, setZoom] = useState(0.52);
  const [pan, setPan] = useState({ x: 15, y: 110 });

  // Reset to Default Overview when matter changes
  useEffect(() => {
    setNodes(currentMatter.nodes);
    setSelectedNodeId(null);
    handleFitView();
  }, [matterKey]);

  const handleZoomIn = () => {
    setZoom((z) => Math.min(z * 1.15, 2.5));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(z * 0.85, 0.35));
  };

  const handleFitView = () => {
    setZoom(0.52);
    setPan({ x: 15, y: 110 });
  };

  // Reset to Default Full View (All elements 100% opacity, centered)
  const handleResetOverview = () => {
    setSelectedNodeId(null);
    handleFitView();
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    // Search always targets the graph view, where matching nodes and edges are filtered.
    if (query.trim()) setActiveView('agent-activity');
  };

  // Export 1: Full structured legal investigation report PDF
  const handleExportReportPdf = () => {
    const selected = nodes.find((n) => n.id === selectedNodeId) || nodes[0];
    exportPdfSnapshot({
      matter: currentMatter,
      nodes,
      selectedNode: selected
    });
  };

  // Export 2: Visual Diagram Snapshot PDF (the actual visual diagram at current dragged positions)
  const handleExportDiagramPdf = () => {
    exportDiagramVisualPdf({
      matter: currentMatter,
      nodes
    });
  };

  // Export 3: Direct PNG Image file of the diagram
  const handleExportDiagramPng = () => {
    exportDiagramPng({
      matter: currentMatter,
      nodes
    });
  };

  const handleOpenRunDetails = (node) => {
    setRunDetailsNode(node || (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : nodes[0]));
    setIsRunDetailsOpen(true);
  };

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;

  const matterList = Object.values(INCIDENTS).map((m) => ({
    id: m.id,
    title: m.title,
    subtitle: m.subtitle
  }));

  return (
    <div className="app-shell">
      {/* Top Meta Header */}
      <div className="proto-header">
        <span className="proto-tag">{currentMatter.pageHeader.tag}</span>
        <h1>{currentMatter.pageHeader.title}</h1>
        <p>{currentMatter.pageHeader.desc}</p>
      </div>

      {/* Main App Workspace */}
      <div className="workspace-card">
        <TopBar
          currentMatter={currentMatter}
          onSelectMatter={setMatterKey}
          matterList={matterList}
          onExportDiagramPdf={handleExportDiagramPdf}
          onExportReportPdf={handleExportReportPdf}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onOpenLegalAssistant={() => setIsLegalAssistantOpen(true)}
        />

        <div className="workspace-body">
          <Sidebar
            activeView={activeView}
            onSelectView={setActiveView}
          />

          {/* Conditional View Router */}
          {activeView === 'agent-activity' && (
            <>
              <main className="center-viewport">
                <GraphCanvas
                  matter={currentMatter}
                  nodes={nodes}
                  setNodes={setNodes}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                  zoom={zoom}
                  setZoom={setZoom}
                  pan={pan}
                  setPan={setPan}
                  onFitView={handleFitView}
                  searchQuery={searchQuery}
                />

                <SequenceTrack
                  sequence={currentMatter.sequence}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                />

                <LegendAndControls
                  zoom={zoom}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onFitView={handleFitView}
                  onResetOverview={handleResetOverview}
                  selectedNodeId={selectedNodeId}
                  onExportReportPdf={handleExportReportPdf}
                  onExportDiagramPdf={handleExportDiagramPdf}
                  onExportDiagramPng={handleExportDiagramPng}
                  nodes={nodes}
                  setNodes={setNodes}
                />
              </main>

              <Inspector
                node={selectedNode}
                nodes={nodes}
                onClose={() => setSelectedNodeId(null)}
                onSelectNode={setSelectedNodeId}
                onOpenRunDetails={handleOpenRunDetails}
              />
            </>
          )}

          {activeView === 'matter-view' && (
            <MatterView
              matter={currentMatter}
              onBackToCanvas={() => setActiveView('agent-activity')}
            />
          )}

          {activeView === 'evidence' && (
            <EvidenceView
              matter={currentMatter}
              onBackToCanvas={() => setActiveView('agent-activity')}
            />
          )}

          {activeView === 'authority-control' && (
            <AuthorityControlView
              matter={currentMatter}
              onBackToCanvas={() => setActiveView('agent-activity')}
            />
          )}

          {activeView === 'timeline' && (
            <TimelineView
              matter={currentMatter}
              onBackToCanvas={() => setActiveView('agent-activity')}
            />
          )}
        </div>
      </div>

      {/* Slide-over / Modal Overlays */}
      <RunDetailsModal
        node={runDetailsNode || nodes[0]}
        isOpen={isRunDetailsOpen}
        onClose={() => setIsRunDetailsOpen(false)}
      />

      <LegalAssistantModal
        isOpen={isLegalAssistantOpen}
        onClose={() => setIsLegalAssistantOpen(false)}
      />
    </div>
  );
};

export default App;
