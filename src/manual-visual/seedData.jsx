import React from 'react';

const groupAccent = { entities: '#2F6FED', data: '#7C4FE0', governance: '#DB8A21', consequence: '#0D9488' };
const iconMap = { person: 'person', org: 'institution', assessment: 'assessment', resource: 'data', system: 'gear', action: 'chart', governance: 'flag', alert: 'question' };
const kindColor = { direct: '#475569', condition: '#E0507A', gap: '#D9531E', trace: '#7C4FE0', unresolved: '#64748B' };
const kindLine = { direct: 'solid', condition: 'dashed', gap: 'dashed', trace: 'dotted', unresolved: 'dotted' };

function mkNode(id, group, title, subtitle, x, y, kind, opts = {}) {
  return {
    id,
    type: 'mvCard',
    position: { x, y },
    data: {
      title, subtitle,
      icon: iconMap[kind] || 'question',
      accent: groupAccent[group] || '#475569',
      group,
      gapNode: !!opts.gapNode,
      detail: {
        fact: opts.fact || subtitle,
        significance: opts.role || '',
        gap: opts.flag || '',
        pages: opts.pages || '',
      },
    },
  };
}

function mkEdge(id, source, target, label, kind, pages, sh, th, opts = {}) {
  return {
    id,
    source,
    target,
    sourceHandle: sh ? sh + '-s' : undefined,
    targetHandle: th ? th + '-t' : undefined,
    type: 'mvEdge',
    data: {
      label,
      kind,
      bidirectional: !!opts.bidirectional,
      lineStyle: kindLine[kind] || 'solid',
      color: kindColor[kind] || '#475569',
      note: opts.note || '',
      pages: pages || '',
    },
  };
}

function mkBoundary(id, name, x, y, w, h, accent, tint) {
  return {
    id,
    type: 'mvBoundary',
    position: { x, y },
    data: { name, accent, tint, fillOpacity: 0.3 },
    style: { width: w, height: h },
    zIndex: -1,
    draggable: true,
    selectable: true,
  };
}

export const SEED_NODES = [
  mkNode('daniel', 'entities', 'Daniel Santos', 'Teacher (HISD)', -162, 61, 'person', { pages: '2', role: 'Sixth-grade social studies teacher at Jackson Middle School' }),
  mkNode('hisd', 'entities', 'Houston Independent School District (HISD)', 'District', 274, 62, 'org', { pages: '2, 9, 21\u201324', role: 'Employer and institutional data / appraisal actor' }),
  mkNode('jackson', 'entities', 'Jackson Middle School', 'Middle School (6th Grade Social Studies)', -163, 323, 'org', { pages: '2' }),
  mkNode('stanford', 'data', 'Stanford / Aprenda', 'Social Studies Assessment (used when STAAR not available)', 600, 0, 'assessment', { pages: '9, 23\u201324', flag: 'Alleged curriculum misalignment' }),
  mkNode('testdata', 'data', 'Student Test Data', 'Prior & current standardized tests', 920, 0, 'resource', { pages: '13\u201315' }),
  mkNode('evaas_report', 'data', 'EVAAS Score / Teacher Value-Added Report', 'Provided to HISD', 467, 250, 'system', { pages: '13\u201315, 21\u201322, 24' }),
  mkNode('sas', 'data', 'SAS', 'Statistical Analysis Service', 940, 250, 'system', { pages: '13\u201315, 21\u201322', flag: 'Proprietary methodology access restricted' }),
  mkNode('daniel_report', 'data', 'Daniel Santos', 'Value-Added Report: Least Effective', 468, 623, 'person', { pages: '16, 21, 24' }),
  mkNode('hisd_contract', 'governance', 'HISD', 'Contracted with SAS (for EVAAS)', 1258, 43, 'org', { pages: '15\u201316, 20\u201324', role: 'Contracting and authority actor' }),
  mkNode('evaas_gov', 'governance', 'EVAAS', 'In teacher appraisal system & high-stakes decisions', 1251, 410, 'resource', { pages: '15\u201316' }),
  mkNode('hft', 'consequence', 'Houston Federation of Teachers (HFT)', 'Filed a Texas Public Information Act request', 1618, -4, 'org', { pages: '22', role: 'Evidence and transparency challenger' }),
  mkNode('observation', 'consequence', 'Classroom Observation Process', 'Administrator ratings allegedly aligned with EVAAS', 1623, 246, 'action', { pages: '20\u201321' }),
  mkNode('growth_plan', 'consequence', 'Growth Plan', 'Placed on Daniel Santos, Fall 2013', 1620, 355, 'governance', { pages: '16, 21' }),
  mkNode('hisd_admin', 'consequence', 'Unidentified HISD Administrator / Decision-Maker', 'Growth-plan approval unresolved', 1620, 628, 'alert', { pages: '16, 21', gapNode: true }),
  mkNode('reviewer', 'consequence', 'Unidentified Reviewer / Oversight Actor', 'Independent review unresolved', 1617, 856, 'alert', { pages: '20\u201323', gapNode: true }),
];

export const SEED_EDGES = [
  mkEdge('r1', 'daniel', 'hisd', 'EMPLOYED_BY', 'direct', '2', 'right', 'left'),
  mkEdge('r2', 'daniel', 'jackson', 'TAUGHT_AT', 'direct', '2', 'bottom', 'top'),
  mkEdge('r3', 'jackson', 'hisd', 'PART_OF', 'direct', '2', 'right', 'bottom'),
  mkEdge('r4', 'hisd', 'stanford', 'USED', 'direct', '9, 23\u201324', 'right', 'left'),
  mkEdge('r5', 'hisd', 'stanford', 'USED', 'condition', '23\u201324', null, null, { note: 'Alleged misalignment with required curriculum' }),
  mkEdge('r6', 'hisd', 'sas', 'PROVIDED_DATA_TO', 'direct', '21\u201322', 'right', 'left'),
  mkEdge('r7', 'hisd_contract', 'sas', 'CONTRACTED_WITH', 'direct', '21\u201322', 'left', 'right'),
  mkEdge('r8', 'sas', 'evaas_report', 'GENERATED', 'direct', '13\u201315, 21\u201322', 'left', 'right'),
  mkEdge('r9', 'evaas_report', 'testdata', 'DERIVED_FROM', 'direct', '13\u201315', 'top', 'bottom'),
  mkEdge('r10', 'evaas_report', 'daniel_report', 'REPORTED_RESULT_FOR', 'direct', '24', 'bottom', 'top'),
  mkEdge('r11', 'hisd_contract', 'evaas_gov', 'USED', 'direct', '15\u201316', 'bottom', 'top'),
  mkEdge('r12', 'evaas_report', 'daniel_report', 'USED_IN_EVALUATION_OF', 'direct', '16, 21', 'bottom', 'top'),
  mkEdge('r13', 'hisd_contract', 'evaas_report', 'USED', 'direct', '15\u201316, 20\u201321', null, null),
  mkEdge('r14', 'sas', 'evaas_report', 'GENERATED', 'direct', '21\u201322', null, null),
  mkEdge('r15', 'hisd_contract', 'sas', 'USED', 'gap', '21\u201322', 'bottom', 'top', { note: 'HISD did not independently verify SAS analysis' }),
  mkEdge('r16', 'hisd_contract', 'growth_plan', 'USED', 'direct', '15\u201316', null, null),
  mkEdge('r17', 'hisd_contract', 'observation', 'USED', 'direct', '20\u201321', 'right', 'left'),
  mkEdge('r18', 'daniel_report', 'growth_plan', 'PLACED_ON', 'direct', '16, 21', 'right', 'left'),
  mkEdge('r19', 'growth_plan', 'daniel_report', '\u2014', 'direct', '16', null, null),
  mkEdge('r20', 'hft', 'hisd', 'REQUESTED_FROM', 'direct', '22', 'top', 'top'),
  mkEdge('r21', 'hisd', 'hft', 'PROVIDED_TO', 'direct', '22', 'top', 'top'),
  mkEdge('r22', 'hisd', 'hft', 'WITHHELD_FROM', 'gap', '22\u201323', 'bottom', 'bottom'),
  mkEdge('r23', 'sas', 'evaas_report', '\u2014', 'direct', '22', null, null, { note: 'Proprietary Control' }),
  mkEdge('r24', 'sas', 'evaas_report', 'TRACE: Responsibility / Control candidate', 'trace', '13\u201315, 21\u201322', 'bottom', 'bottom'),
  mkEdge('r25', 'hisd_contract', 'growth_plan', 'TRACE: Authority / Control / Responsibility candidate', 'trace', '15\u201316, 20\u201324', 'right', 'top'),
  mkEdge('r26', 'hisd_admin', 'growth_plan', 'TRACE: unresolved', 'unresolved', '16, 21', 'top', 'bottom'),
  mkEdge('r27', 'reviewer', 'daniel_report', 'TRACE: unresolved', 'unresolved', '20\u201323', 'left', 'right'),
];

export const SEED_BOUNDARIES = [
  mkBoundary('boundary-entities', 'Entities & Actors', -203, 21, 753, 420, '#2F6FED', '#EEF3FE'),
  mkBoundary('boundary-data', 'Data & Algorithmic Flow', 427, -40, 769, 781, '#7C4FE0', '#F3EEFC'),
  mkBoundary('boundary-governance', 'Governance & Institutional Actions', 1211, 3, 323, 525, '#DB8A21', '#FDF3E4'),
  mkBoundary('boundary-consequence', 'Consequence, Evidence & Responsibility', 1577, -44, 322, 1018, '#0D9488', '#E6FBF8'),
];

export const getSeedState = () => ({
  nodes: [...SEED_BOUNDARIES, ...SEED_NODES],
  edges: [...SEED_EDGES],
});
