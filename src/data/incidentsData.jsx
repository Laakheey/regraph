export const INCIDENTS = {
  'hft-santos': {
    id: 'hft-santos',
    title: 'HFT v. HISD · Daniel Santos Path',
    subtitle: 'Daniel Santos · EVAAS algorithmic evaluation pathway',
    enablePhysics: false,
    layout: { name: 'preset' },
    pageHeader: {
      tag: 'EBRR TRACE™ Matter Reconstruction',
      title: '4. Agent Activity View',
      desc: 'End-to-end responsibility path, institutional governance, algorithmic computation, and oversight gaps.'
    },
    domains: [
      {
        id: 'hisd-domain',
        name: 'HISD Domain',
        x: 50,
        y: 20,
        w: 710,
        h: 520,
        borderColor: '#9382e2',
        badgeBg: '#4F46E5'
      },
      {
        id: 'sas-domain',
        name: 'SAS Domain',
        x: 760,
        y: 190,
        w: 300,
        h: 270,
        borderColor: '#38bdf8',
        badgeBg: '#0284C7'
      },
      {
        id: 'gaps-domain',
        name: 'Responsibility Gaps & Oversight Void',
        x: 480,
        y: 590,
        w: 580,
        h: 180,
        borderColor: '#f97316',
        badgeBg: '#EA580C'
      }
    ],
    nodes: [
      // ==================== COLUMN 4: Daniel Santos (above Score) ====================
      {
        id: 'santos',
        label: 'Daniel Santos',
        sub: 'Person / 6th-Grade Social Studies Teacher',
        kind: 'person',
        col: 4,
        x: 1100,
        y: 300,
        assignedTask: '6th-Grade Social Studies Teacher',
        objective: 'Middle school academic instruction at Jackson MS',
        date: '2006–2014 (Evaluated 2012–2013)',
        status: 'Growth Plan Imposed',
        activeModels: 'EVAAS TGI Model',
        toolUsed: 'Standardized curriculum',
        boundaryCrossing: 'Institutional unit assignment',
        humanCheckpoint: 'Campus observation review',
        preCompAlert: 'Score Volatility Alert',
        intervention: 'Contested growth plan',
        evidence: 'Complaint pp. 2, 16, 21, 23–24',
        trace: {
          responsibility: { text: 'Affected person / Educator', status: 'Attributed' },
          authority: { text: 'Texas Educator Certificate', status: 'Supported' },
          control: { text: 'No control over algorithmic metrics', status: 'Tracked' },
          evidence: { text: 'Complaint pp. 2, 16, 21, 23–24', status: 'Supported' }
        }
      },
      {
        id: 'jackson-ms',
        label: 'Jackson Middle School',
        sub: 'School / HISD Campus Unit',
        kind: 'org',
        col: 1,
        x: 80,
        y: 60,
        assignedTask: 'Middle school campus operation',
        objective: 'Deliver middle school instruction within HISD hierarchy',
        date: '2012–2013 School Year',
        status: 'Campus Unit',
        activeModels: 'HISD Appraisal Protocol',
        toolUsed: 'Classroom appraisals',
        boundaryCrossing: 'Internal HISD hierarchy',
        humanCheckpoint: 'Campus administration',
        preCompAlert: 'None',
        intervention: 'N/A',
        evidence: 'Complaint p. 2',
        trace: {
          responsibility: { text: 'Campus Administration', status: 'Attributed' },
          authority: { text: 'HISD Administrative Hierarchy', status: 'Supported' },
          control: { text: 'Subject to District-wide appraisal policy', status: 'Tracked' },
          evidence: { text: 'Complaint p. 2', status: 'Supported' }
        }
      },
      {
        id: 'hft',
        label: 'Houston Federation of Teachers',
        sub: 'Labor Union Challenger (HFT)',
        kind: 'org',
        col: 1,
        x: 80,
        y: 170,
        assignedTask: 'Labor representation & open records request',
        objective: 'Submit public information request for EVAAS methodology',
        date: 'November 13, 2013',
        status: 'Challenger',
        activeModels: 'Independent statistical review',
        toolUsed: 'Texas Public Information Act (TPIA)',
        boundaryCrossing: 'Formal legal demand',
        humanCheckpoint: 'Union leadership',
        preCompAlert: 'Refusal received',
        intervention: 'Filed federal civil rights complaint',
        evidence: 'Complaint p. 22',
        trace: {
          responsibility: { text: 'Evidence / challenge actor', status: 'Attributed' },
          authority: { text: 'Requesting party under TPIA', status: 'Supported' },
          control: { text: 'No system control finding', status: 'Tracked' },
          evidence: { text: 'Complaint p. 22', status: 'Supported' }
        }
      },

      // ==================== COLUMN 2: Governance & Contracts (x: 375) ====================
      {
        id: 'hisd',
        label: 'Houston ISD (HISD)',
        sub: 'Defendant School District / Governance',
        kind: 'org',
        col: 2,
        x: 500,
        y: 250,
        assignedTask: 'District-wide teacher evaluation governance',
        objective: 'Adopted EVAAS 50% weight for teacher appraisal and contract decisions',
        date: '2012–2013 / Fall 2013',
        status: 'Defendant',
        activeModels: 'EVAAS Appraisal Framework',
        toolUsed: 'Board Policy DFBB (Local)',
        boundaryCrossing: 'Contract with private vendor (SAS)',
        humanCheckpoint: 'Central office administration',
        preCompAlert: 'TPIA Disclosure Request Received',
        intervention: 'Withheld proprietary methodology',
        evidence: 'Complaint pp. 15–16, 20–22',
        trace: {
          responsibility: { text: 'HISD Central Administration & Board', status: 'Attributed' },
          authority: { text: 'Texas Education Code & Local Policy', status: 'Supported' },
          control: { text: 'Data supply, contract adoption & employment use', status: 'Tracked' },
          evidence: { text: 'Complaint pp. 15–16, 20–22', status: 'Supported' }
        }
      },
      {
        id: 'sas',
        label: 'SAS Institute, Inc.',
        sub: 'Vendor / Algorithmic Developer',
        kind: 'org',
        col: 2,
        x: 800,
        y: 230,
        assignedTask: 'Value-added score computation',
        objective: 'Run proprietary mixed-model equations on HISD data',
        date: 'Summer 2013',
        status: 'Vendor / Developer',
        activeModels: 'Proprietary EVAAS Statistical Software',
        toolUsed: 'SAS Statistical Computing Platform',
        boundaryCrossing: 'External private contractor',
        humanCheckpoint: 'Internal SAS data scientists',
        preCompAlert: 'Black-box methodology assertion',
        intervention: 'Claimed trade secret protection',
        evidence: 'Complaint pp. 13–15, 21–22',
        trace: {
          responsibility: { text: 'Technical output candidate', status: 'Attributed' },
          authority: { text: 'Commercial vendor contract (Not employment authority)', status: 'Supported' },
          control: { text: 'Controlled statistical generation process', status: 'Tracked' },
          evidence: { text: 'Complaint pp. 13–15, 21–22', status: 'Supported' }
        }
      },

      // ==================== COLUMN 3: Inputs & Algorithmic Engines (x: 690) ====================
      {
        id: 'assessment',
        label: 'Stanford/Aprenda Test',
        sub: 'Assessment Input / Curriculum Mismatch',
        kind: 'assessment',
        col: 3,
        x: 80,
        y: 280,
        assignedTask: 'Student achievement measurement',
        objective: 'Supply student test data where STAAR unavailable',
        date: 'Spring 2013',
        status: 'Curriculum Mismatch',
        activeModels: 'Norm-referenced standardized test',
        toolUsed: 'Stanford 10 / Aprenda 3',
        boundaryCrossing: 'Testing input to appraisal',
        humanCheckpoint: 'Alignment review omitted / failed',
        preCompAlert: 'Curriculum divergence alleged',
        intervention: 'Unresolved by District',
        evidence: 'Complaint pp. 9, 23–24',
        trace: {
          responsibility: { text: 'HISD Assessment Selection', status: 'Attributed' },
          authority: { text: 'District assessment policy', status: 'Supported' },
          control: { text: 'Alignment to taught TEKS unresolved', status: 'Unresolved' },
          evidence: { text: 'Complaint pp. 9, 23–24', status: 'Supported' }
        }
      },
      {
        id: 'student-data',
        label: 'Student Test Data',
        sub: 'Longitudinal Standardized Results',
        kind: 'resource',
        col: 3,
        x: 80,
        y: 390,
        assignedTask: 'Longitudinal score aggregation',
        objective: 'Input dataset transmitted to SAS for statistical computation',
        date: 'June 2013',
        status: 'Transmitted',
        activeModels: 'Longitudinal student testing records',
        toolUsed: 'District student information system',
        boundaryCrossing: 'District boundary to SAS Institute',
        humanCheckpoint: 'Roster verification (alleged flawed)',
        preCompAlert: 'Missing student linkage errors',
        intervention: 'No independent verification',
        evidence: 'Complaint pp. 21–22',
        trace: {
          responsibility: { text: 'HISD Data Management', status: 'Attributed' },
          authority: { text: 'Data sharing agreement', status: 'Supported' },
          control: { text: 'Exact student-level inputs withheld from teacher', status: 'Tracked' },
          evidence: { text: 'Complaint pp. 21–22', status: 'Supported' }
        }
      },
      {
        id: 'evaas',
        label: 'EVAAS Engine',
        sub: 'Multivariate Statistical Model System',
        kind: 'system',
        col: 3,
        x: 800,
        y: 350,
        assignedTask: 'Algorithmic growth estimation',
        objective: 'Estimate teacher value-added effect using multivariate model',
        date: '2012–2013 Run',
        status: 'Algorithmic Engine',
        activeModels: 'Multivariate layered mixed-effects model',
        toolUsed: 'Proprietary statistical algorithm',
        boundaryCrossing: 'Algorithmic output delivered to HISD',
        humanCheckpoint: 'None (automated calculation)',
        preCompAlert: 'Extreme volatility noted by ASA',
        intervention: 'Unexaminable by affected teachers',
        evidence: 'Complaint pp. 13–15',
        trace: {
          responsibility: { text: 'Mathematical model system (Not a legal person)', status: 'Attributed' },
          authority: { text: 'None independently established', status: 'Unresolved' },
          control: { text: 'Proprietary methodology withheld', status: 'Tracked' },
          evidence: { text: 'Method execution details unavailable', status: 'Supported' }
        }
      },

      // ==================== COLUMN 4: Outputs & Consequences (x: 1005) ====================
      {
        id: 'score',
        label: '2013 EVAAS Score',
        sub: 'Value-Added Report ("Least Effective")',
        kind: 'resource',
        col: 4,
        x: 1100,
        y: 80,
        assignedTask: 'Teacher-specific performance index',
        objective: 'Classified Santos as "Least Effective"',
        date: 'Released Fall 2013',
        status: 'Adverse Output',
        activeModels: 'EVAAS 2013 Teacher Report',
        toolUsed: 'Single composite metric (TGI)',
        boundaryCrossing: 'Delivered to campus administration',
        humanCheckpoint: 'Administrative adoption without audit',
        preCompAlert: 'Contradicted positive classroom appraisals',
        intervention: 'Score stood without correction',
        evidence: 'Complaint p. 24',
        trace: {
          responsibility: { text: 'Algorithmic output attributed to Santos', status: 'Attributed' },
          authority: { text: 'Used as basis for employment consequence', status: 'Supported' },
          control: { text: 'Santos-specific calculation unavailable to review', status: 'Tracked' },
          evidence: { text: 'Direct score report not attached in complaint', status: 'Supported' }
        }
      },
      {
        id: 'evaluation',
        label: 'HISD Evaluation Use',
        sub: 'Institutional Appraisal Act (50% Weight)',
        kind: 'action',
        col: 4,
        x: 1100,
        y: 410,
        assignedTask: 'Appraisal score calculation',
        objective: 'Weight EVAAS score at 50% of annual teacher appraisal',
        date: 'Fall 2013',
        status: 'Consequential Use',
        activeModels: 'Teacher Appraisal & Development System (TADS)',
        toolUsed: 'Appraisal scoring rubric',
        boundaryCrossing: 'Direct employment impact',
        humanCheckpoint: 'Admin observation alignment pressure',
        preCompAlert: 'Administrative pressure campaign alleged',
        intervention: 'No district independent audit',
        evidence: 'Complaint pp. 15–16, 20–21',
        trace: {
          responsibility: { text: 'Institutional consequence candidate', status: 'Attributed' },
          authority: { text: 'HISD appraisal framework', status: 'Supported' },
          control: { text: 'Consequential use of algorithmic output', status: 'Tracked' },
          evidence: { text: 'Complaint pp. 15–16, 20–21', status: 'Supported' }
        }
      },
      {
        id: 'plan',
        label: '2013 Growth Plan',
        sub: 'Consequential Disciplinary Action',
        kind: 'governance',
        col: 4,
        x: 1100,
        y: 190,
        assignedTask: 'Mandatory corrective placement',
        objective: 'Impose prescriptive corrective plan; precursor to non-renewal',
        date: 'October 2013',
        status: 'Action Imposed',
        activeModels: 'Policy DFBB Criteria',
        toolUsed: 'Formal HR disciplinary plan',
        boundaryCrossing: 'Adverse employment sanction',
        humanCheckpoint: 'Unidentified formal issuer',
        preCompAlert: 'Contract non-renewal threat',
        intervention: 'Santos contested placement',
        evidence: 'Complaint pp. 16, 21',
        trace: {
          responsibility: { text: 'Consequential action candidate', status: 'Attributed' },
          authority: { text: 'Individual issuer not identified', status: 'Unresolved' },
          control: { text: 'Formal approval capacity unresolved', status: 'Tracked' },
          evidence: { text: 'Individual human actor missing in complaint', status: 'Supported' }
        }
      },
      {
        id: 'disclosure',
        label: 'Disclosure Record',
        sub: 'Partial Info / Withheld Methodology',
        kind: 'resource',
        col: 4,
        x: 800,
        y: 640,
        assignedTask: 'Public records response record',
        objective: 'Reflects withheld source code and decision rules',
        date: 'Fall / Winter 2013',
        status: 'Partially Withheld',
        activeModels: 'Proprietary algorithm exemption',
        toolUsed: 'Legal non-disclosure assertion',
        boundaryCrossing: 'Public disclosure refusal',
        humanCheckpoint: 'District legal counsel',
        preCompAlert: 'Material evidentiary gap',
        intervention: 'Triggered federal litigation',
        evidence: 'Complaint pp. 22–23',
        trace: {
          responsibility: { text: 'Evidence gap candidate', status: 'Attributed' },
          authority: { text: 'Scope of HISD access unresolved', status: 'Unresolved' },
          control: { text: 'SAS proprietary control alleged', status: 'Tracked' },
          evidence: { text: 'Partially supported; exact scope unresolved', status: 'Supported' }
        }
      },

      // ==================== RESPONSIBILITY GAPS (Bottom Center) ====================
      {
        id: 'gap',
        label: 'Unidentified Reviewer',
        sub: 'Human-Control Gap / Override Void',
        kind: 'alert',
        col: 2,
        x: 530,
        y: 640,
        assignedTask: 'Substantive oversight & verification',
        objective: 'Review algorithmic scores before imposing sanctions',
        date: 'Fall 2013',
        status: 'Unresolved Gap',
        activeModels: 'None',
        toolUsed: 'Omission of verification step',
        boundaryCrossing: 'Accountability void',
        humanCheckpoint: 'Missing / Bypassed',
        preCompAlert: 'Due process violation candidate',
        intervention: 'No refusal or override capacity found',
        evidence: 'Complaint pp. 16, 20–23',
        trace: {
          responsibility: { text: 'Unresolved — do not attribute to named person', status: 'Unresolved' },
          authority: { text: 'Unresolved in source record', status: 'Unresolved' },
          control: { text: 'Review / refusal capacity unresolved', status: 'Unresolved' },
          evidence: { text: 'Requires records, communications, or testimony', status: 'Supported' }
        }
      }
    ],
    links: [
      // 1. Structural / Contractual links
      { from: 'santos', to: 'hisd', label: 'EMPLOYED BY', category: 'structural' },
      { from: 'santos', to: 'jackson-ms', label: 'TAUGHT AT', category: 'structural', midXOff: -30, midYOff: 18 },
      { from: 'jackson-ms', to: 'hisd', label: 'PART OF', category: 'structural' },
      { from: 'hisd', to: 'sas', label: 'CONTRACTED WITH', category: 'structural' },
      { from: 'sas', to: 'evaas', label: 'DEVELOPED / ANALYZED', category: 'structural' },
      { from: 'hisd', to: 'evaas', label: 'USED SYSTEM', category: 'structural' },

      // 2. Data & Algorithmic pipeline
      { from: 'hisd', to: 'assessment', label: 'USED ASSESSMENT', category: 'pipeline', midXOff: 22, midYOff: -16 },
      { from: 'assessment', to: 'student-data', label: 'INPUTS', category: 'pipeline' },
      { from: 'hisd', to: 'student-data', label: 'PROVIDED DATA', category: 'pipeline' },
      { from: 'student-data', to: 'evaas', label: 'DERIVED FROM', category: 'pipeline' },
      { from: 'evaas', to: 'score', label: 'GENERATED', category: 'pipeline' },
      { from: 'score', to: 'santos', label: 'REPORTED RESULT FOR', category: 'pipeline' },
      { from: 'score', to: 'evaluation', label: 'USED IN EVALUATION', category: 'pipeline' },
      { from: 'evaluation', to: 'plan', label: 'LED TO', category: 'pipeline' },

      // 3. Adverse / Withheld / Gap links
      { from: 'santos', to: 'plan', label: 'PLACED ON', category: 'alert' },
      { from: 'gap', to: 'evaluation', label: 'REVIEW / APPROVAL?', category: 'alert', midXOff: 0, midYOff: -18 },
      { from: 'gap', to: 'plan', label: 'FORMAL ISSUER?', category: 'alert', midXOff: 0, midYOff: -18 },
      { from: 'hft', to: 'hisd', label: 'REQUESTED FROM', category: 'alert' },
      { from: 'hisd', to: 'disclosure', label: 'PARTIAL / WITHHELD', category: 'alert' },
      { from: 'hft', to: 'disclosure', label: 'SOUGHT RECORDS', category: 'alert' }
    ].map((link) => ({ ...link, routing: 'orthogonal' })),
    sequence: [
      { step: 1, title: 'Employment & Assignment', time: 'Complaint p. 2', nodeId: 'santos', icon: 'list' },
      { step: 2, title: 'Assessment Input Mismatch', time: 'Complaint pp. 9, 23', nodeId: 'assessment', icon: 'wrench' },
      { step: 3, title: 'Data Provided to SAS', time: 'Complaint pp. 21–22', nodeId: 'student-data', icon: 'cube' },
      { step: 4, title: 'SAS EVAAS Analysis', time: 'Complaint pp. 13–15', nodeId: 'evaas', icon: 'server' },
      { step: 5, title: 'Score Reported (Least Effective)', time: 'Complaint p. 24', nodeId: 'score', icon: 'bell', isAlert: true },
      { step: 6, title: 'HISD Appraisal Imposition', time: 'Complaint pp. 15–16', nodeId: 'evaluation', icon: 'action' },
      { step: 7, title: 'Growth Plan Placed on Santos', time: 'Fall 2013', nodeId: 'plan', icon: 'governance' },
      { step: 8, title: 'TPIA Request & Withheld Code', time: 'Nov 13, 2013', nodeId: 'disclosure', icon: 'resource' }
    ]
  }
};
