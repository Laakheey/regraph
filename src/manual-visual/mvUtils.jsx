import { createContext } from 'react';

export const ModeContext = createContext('select');

let counter = Date.now();
export const generateId = (prefix = 'node') => `${prefix}-${++counter}`;

const LS_KEY = 'manual-visual-canvas-state';

export const saveToLocalStorage = (state) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch (e) { /* quota exceeded */ }
};

export const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted */ }
  return null;
};

export const clearLocalStorage = () => {
  localStorage.removeItem(LS_KEY);
};

export const downloadJSON = (data, filename) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const readJSONFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        resolve(JSON.parse(e.target.result));
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const EDGE_KINDS = [
  { value: 'direct', label: 'Direct' },
  { value: 'condition', label: 'Condition' },
  { value: 'gap', label: 'Gap' },
  { value: 'trace', label: 'Trace' },
  { value: 'unresolved', label: 'Unresolved' },
];

export const LINE_STYLES = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

export const kindToColor = (kind) => {
  const map = { direct: '#475569', condition: '#E0507A', gap: '#D9531E', trace: '#7C4FE0', unresolved: '#64748B' };
  return map[kind] || '#475569';
};

export const kindToLineStyle = (kind) => {
  const map = { direct: 'solid', condition: 'dashed', gap: 'dashed', trace: 'dotted', unresolved: 'dotted' };
  return map[kind] || 'solid';
};

export const ICON_OPTIONS = [
  'person', 'institution', 'school', 'assessment',
  'gear', 'chart', 'flag', 'question', 'data', 'output',
];
