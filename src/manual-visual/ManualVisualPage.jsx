import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './mvStyles.css';

import { MVNodeCard } from './MVNodeCard';
import { MVBoundaryNode } from './MVBoundaryNode';
import { MVEdge, getEdgeMarkers } from './MVEdge';
import { MVToolbar } from './MVToolbar';
import { MVSidebar } from './MVSidebar';
import {
  ModeContext,
  generateId,
  saveToLocalStorage,
  loadFromLocalStorage,
  clearLocalStorage,
  downloadJSON,
  readJSONFile,
  kindToColor,
  kindToLineStyle,
} from './mvUtils';
import { getSeedState } from './seedData';

const nodeTypes = {
  mvCard: MVNodeCard,
  mvBoundary: MVBoundaryNode,
};

const edgeTypes = {
  mvEdge: MVEdge,
};

function ManualVisualCanvas() {
  const reactFlowInstance = useReactFlow();
  const [mode, setMode] = useState('select');
  const [pinTool, setPinTool] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'node' | 'edge' | 'boundary'

  // Boundary drawing drag state
  const [boundaryDrag, setBoundaryDrag] = useState(null); // { startX, startY, currentX, currentY, isDrawing }
  const canvasRef = useRef(null);

  // Initialize nodes & edges from localStorage or seed
  const initialData = useMemo(() => {
    const saved = loadFromLocalStorage();
    if (saved && saved.nodes && saved.edges) {
      return saved;
    }
    return getSeedState();
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges || []);

  // Sync to localStorage
  useEffect(() => {
    saveToLocalStorage({ nodes, edges });
  }, [nodes, edges]);

  // Derived boundaries vs standard nodes
  const boundaries = useMemo(() => nodes.filter((n) => n.type === 'mvBoundary'), [nodes]);
  const cardNodes = useMemo(() => nodes.filter((n) => n.type === 'mvCard'), [nodes]);

  // Deselect / return to select mode
  const handleDeselect = useCallback(() => {
    setSelectedId(null);
    setSelectedType(null);
    if (!pinTool) {
      setMode('select');
    }
  }, [pinTool]);

  // Selection handlers
  const onNodeClick = useCallback((event, node) => {
    if (mode === 'select' || mode === 'arrow') {
      setSelectedId(node.id);
      setSelectedType(node.type === 'mvBoundary' ? 'boundary' : 'node');
    }
  }, [mode]);

  const onEdgeClick = useCallback((event, edge) => {
    if (mode === 'select') {
      setSelectedId(edge.id);
      setSelectedType('edge');
    }
  }, [mode]);

  const onPaneClick = useCallback((event) => {
    if (mode === 'box') {
      // Create new node at clicked position
      const bounds = canvasRef.current?.getBoundingClientRect();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: generateId('node'),
        type: 'mvCard',
        position,
        data: {
          title: 'New Node',
          subtitle: 'Description / Role',
          icon: 'question',
          accent: '#475569',
          group: '',
          gapNode: false,
          detail: { fact: '', significance: '', gap: '', pages: '' },
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setSelectedId(newNode.id);
      setSelectedType('node');

      if (!pinTool) {
        setMode('select');
      }
    } else if (mode === 'select') {
      handleDeselect();
    }
  }, [mode, pinTool, reactFlowInstance, setNodes, handleDeselect]);

  // Connect handler (in arrow mode)
  const onConnect = useCallback((params) => {
    const defaultKind = 'direct';
    const newEdge = {
      ...params,
      id: generateId('edge'),
      type: 'mvEdge',
      data: {
        label: 'CONNECTS_TO',
        kind: defaultKind,
        bidirectional: false,
        lineStyle: kindToLineStyle(defaultKind),
        color: kindToColor(defaultKind),
        note: '',
        pages: '',
      },
      ...getEdgeMarkers({ kind: defaultKind, color: kindToColor(defaultKind) }),
    };

    setEdges((eds) => addEdge(newEdge, eds));
    setSelectedId(newEdge.id);
    setSelectedType('edge');

    if (!pinTool) {
      setMode('select');
    }
  }, [pinTool, setEdges]);

  // Boundary Drawing: Mouse down on pane
  const onPaneMouseDown = useCallback((event) => {
    if (mode !== 'boundary') return;
    if (event.button !== 0) return; // only left click

    setBoundaryDrag({
      startX: event.clientX,
      startY: event.clientY,
      currentX: event.clientX,
      currentY: event.clientY,
      isDrawing: true,
    });
  }, [mode]);

  // Boundary Drawing: Mouse move
  const onMouseMove = useCallback((event) => {
    if (!boundaryDrag || !boundaryDrag.isDrawing) return;
    setBoundaryDrag((prev) => ({
      ...prev,
      currentX: event.clientX,
      currentY: event.clientY,
    }));
  }, [boundaryDrag]);

  // Boundary Drawing: Mouse up
  const onMouseUp = useCallback(() => {
    if (!boundaryDrag || !boundaryDrag.isDrawing) return;

    const start = reactFlowInstance.screenToFlowPosition({
      x: Math.min(boundaryDrag.startX, boundaryDrag.currentX),
      y: Math.min(boundaryDrag.startY, boundaryDrag.currentY),
    });
    const end = reactFlowInstance.screenToFlowPosition({
      x: Math.max(boundaryDrag.startX, boundaryDrag.currentX),
      y: Math.max(boundaryDrag.startY, boundaryDrag.currentY),
    });

    const width = Math.max(100, Math.abs(end.x - start.x));
    const height = Math.max(80, Math.abs(end.y - start.y));

    const newBoundary = {
      id: generateId('boundary'),
      type: 'mvBoundary',
      position: { x: start.x, y: start.y },
      data: {
        name: 'New Region',
        accent: '#2F6FED',
        tint: '#EEF3FE',
        fillOpacity: 0.3,
      },
      style: { width, height },
      zIndex: -1,
      draggable: true,
      selectable: true,
    };

    setNodes((nds) => [newBoundary, ...nds]);
    setSelectedId(newBoundary.id);
    setSelectedType('boundary');
    setBoundaryDrag(null);

    if (!pinTool) {
      setMode('select');
    }
  }, [boundaryDrag, pinTool, reactFlowInstance, setNodes]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          if (selectedType === 'node' || selectedType === 'boundary') {
            setNodes((nds) => nds.filter((n) => n.id !== selectedId));
            setEdges((eds) => eds.filter((ed) => ed.source !== selectedId && ed.target !== selectedId));
          } else if (selectedType === 'edge') {
            setEdges((eds) => eds.filter((ed) => ed.id !== selectedId));
          }
          setSelectedId(null);
          setSelectedType(null);
        }
      } else if (e.key === 'Escape') {
        handleDeselect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedType, handleDeselect, setNodes, setEdges]);

  // Updates from Sidebar
  const handleUpdateNode = useCallback((nodeId, patch) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: { ...n.data, ...patch },
        };
      })
    );
  }, [setNodes]);

  const handleUpdateEdge = useCallback((edgeId, patch) => {
    setEdges((eds) =>
      eds.map((ed) => {
        if (ed.id !== edgeId) return ed;
        const updatedData = { ...ed.data, ...patch };
        const markers = getEdgeMarkers(updatedData);
        return {
          ...ed,
          data: updatedData,
          ...markers,
        };
      })
    );
  }, [setEdges]);

  const handleUpdateBoundary = useCallback((boundaryId, patch) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== boundaryId) return n;
        return {
          ...n,
          data: { ...n.data, ...patch },
        };
      })
    );
  }, [setNodes]);

  const handleDeleteElement = useCallback((id, type) => {
    if (type === 'node' || type === 'boundary') {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((ed) => ed.source !== id && ed.target !== id));
    } else if (type === 'edge') {
      setEdges((eds) => eds.filter((ed) => ed.id !== id));
    }
    setSelectedId(null);
    setSelectedType(null);
  }, [setNodes, setEdges]);

  // Toolbar actions
  const handleClearCanvas = useCallback(() => {
    if (window.confirm('Clear the entire canvas? This will remove all nodes, edges, and boundaries.')) {
      setNodes([]);
      setEdges([]);
      clearLocalStorage();
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [setNodes, setEdges]);

  const handleReloadSeed = useCallback(() => {
    if (window.confirm('Reload seed data? Any unsaved manual changes will be replaced.')) {
      const seed = getSeedState();
      setNodes(seed.nodes);
      setEdges(seed.edges);
      saveToLocalStorage(seed);
      setSelectedId(null);
      setSelectedType(null);
    }
  }, [setNodes, setEdges]);

  const handleExportJSON = useCallback(() => {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    };
    downloadJSON(exportData, `manual-visual-graph-${Date.now()}.json`);
  }, [nodes, edges]);

  const handleImportJSON = useCallback(async (file) => {
    try {
      const data = await readJSONFile(file);
      if (data && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        setNodes(data.nodes);
        setEdges(data.edges);
        saveToLocalStorage({ nodes: data.nodes, edges: data.edges });
        setSelectedId(null);
        setSelectedType(null);
      } else {
        alert('Invalid JSON structure: Expected "nodes" and "edges" arrays.');
      }
    } catch (err) {
      alert('Error importing JSON: ' + err.message);
    }
  }, [setNodes, setEdges]);

  // Cursor classes depending on mode
  const cursorClass = mode === 'box' ? 'mv-cursor-cell' : mode === 'boundary' ? 'mv-cursor-crosshair' : '';

  return (
    <ModeContext.Provider value={mode}>
      <div className="mv-page" onMouseMove={onMouseMove} onMouseUp={onMouseUp}>
        <MVToolbar
          mode={mode}
          setMode={setMode}
          pinTool={pinTool}
          setPinTool={setPinTool}
          onClearCanvas={handleClearCanvas}
          onReloadSeed={handleReloadSeed}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
        />

        <div className="mv-main">
          <div ref={canvasRef} className={`mv-canvas-area ${cursorClass}`}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
              maxZoom={2.5}
              onMouseDown={onPaneMouseDown}
              panOnDrag={mode === 'select' || mode === 'arrow'}
              selectionOnDrag={mode === 'select'}
            >
              <Background gap={24} size={1} color="#cbd5e1" />
              <Controls />
              <MiniMap
                nodeStrokeColor={(n) => n.data?.accent || '#475569'}
                nodeColor={(n) => (n.type === 'mvBoundary' ? n.data?.tint || '#e2e8f0' : '#ffffff')}
                nodeBorderRadius={4}
              />
            </ReactFlow>

            {boundaryDrag && boundaryDrag.isDrawing && (
              <div
                className="mv-boundary-preview"
                style={{
                  left: Math.min(boundaryDrag.startX, boundaryDrag.currentX),
                  top: Math.min(boundaryDrag.startY, boundaryDrag.currentY),
                  width: Math.abs(boundaryDrag.currentX - boundaryDrag.startX),
                  height: Math.abs(boundaryDrag.currentY - boundaryDrag.startY),
                }}
              />
            )}
          </div>

          <MVSidebar
            selectedId={selectedId}
            selectedType={selectedType}
            nodes={cardNodes}
            edges={edges}
            boundaries={boundaries}
            onUpdateNode={handleUpdateNode}
            onUpdateEdge={handleUpdateEdge}
            onUpdateBoundary={handleUpdateBoundary}
            onDeleteElement={handleDeleteElement}
          />
        </div>
      </div>
    </ModeContext.Provider>
  );
}

export function ManualVisualPage() {
  return (
    <ReactFlowProvider>
      <ManualVisualCanvas />
    </ReactFlowProvider>
  );
}
