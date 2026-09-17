// Parsed from "Here's the complete implementation.docx". This is data only;
// GraphCanvas remains the interaction and routing engine.
//
// Source of truth: Daniel_Santos_End_to_End_Responsibility_Path.md (27 rows).
// Every relationship below carries stage/fact/significance/gap pulled
// verbatim from that table's Reconstruction Stage / Source-Supported Fact /
// Responsibility Significance / Evidence-Gap columns.

const GROUPS = [
  {
    id: "entities",
    name: "Entities & Actors",
    accent: "#2F6FED",
    tint: "#EEF3FE",
    x: -203,
    y: 21,
    w: 740, // was 753 — narrowed so right edge (537) clears the data
    //         domain's new left edge (555); hisd's right edge (510) is
    //         still comfortably contained.
    h: 420,
  },
  {
    id: "data",
    name: "Data & Algorithmic Flow",
    accent: "#7C4FE0",
    tint: "#F3EEFC",
    x: 555, // was 427 — moved right so this domain no longer overlaps
    //         the entities domain (hisd's right edge was 510, inside
    //         the old 427-start box).
    y: -40,
    w: 641, // narrowed to keep the same right edge (1196) as before,
    //         so stanford/testdata/sas/evaas_report/daniel_report are
    //         all still contained.
    h: 781,
  },
  {
    id: "governance",
    name: "Governance & Institutional Actions",
    accent: "#DB8A21",
    tint: "#FDF3E4",
    x: 1211,
    y: 3,
    w: 323,
    h: 525,
  },
  {
    id: "consequence",
    name: "Consequence, Evidence & Responsibility",
    accent: "#0D9488",
    tint: "#E6FBF8",
    x: 1577,
    y: -44,
    w: 322,
    h: 1018,
  },
];

const node = (id, group, label, sub, x, y, kind, options = {}) => ({
  id,
  group,
  label,
  sub,
  x,
  y,
  width: 236,
  height: 78,
  kind,
  assignedTask: options.role || kind,
  objective: options.fact || sub,
  date: options.pages ? `Source pages ${options.pages}` : "Source record",
  status: options.gapNode
    ? "Unresolved Gap"
    : options.highlight
      ? "Key Output"
      : "Source Supported",
  activeModels: options.model || "N/A",
  toolUsed: options.tool || "Source reconstruction",
  boundaryCrossing: group,
  humanCheckpoint:
    options.checkpoint ||
    (options.gapNode ? "Missing / Unresolved" : "Documented in complaint"),
  preCompAlert: options.flag || "None recorded",
  intervention: options.intervention || "N/A",
  evidence: options.pages
    ? `Complaint pp. ${options.pages}`
    : "Complaint record",
  detail: options.detail || {},
  ...options,
});

const nodes = [
  node(
    "daniel",
    "entities",
    "Daniel Santos",
    "Teacher (HISD)",
    -162,
    61,
    "person",
    {
      pages: "2",
      role: "Sixth-grade social studies teacher at Jackson Middle School",
      detail: {
        Type: "Person / Actor",
        "Source-supported fact":
          "Santos is identified as an HISD teacher, and as a sixth-grade social studies teacher at Jackson Middle School.",
        "Source pages": "2",
      },
    },
  ),
  node(
    "hisd",
    "entities",
    "Houston Independent School District (HISD)",
    "District",
    274,
    62,
    "org",
    {
      pages: "2, 9, 21–24",
      role: "Employer and institutional data / appraisal actor",
      detail: {
        Type: "Institution / Organization",
        "Role in this path":
          "Employer of Santos; supplies data to the algorithmic input side (Stanford/Aprenda, SAS); also appears in the Governance column as the contracting/authority actor.",
        "Source pages": "2, 9, 21–24",
      },
    },
  ),
  node(
    "jackson",
    "entities",
    "Jackson Middle School",
    "Middle School (6th Grade Social Studies)",
    -163,
    323,
    "org",
    {
      pages: "2",
      detail: {
        Type: "School / Education",
        "Source-supported fact": "Jackson Middle School is an HISD school.",
        "Source pages": "2",
      },
    },
  ),
  node(
    "stanford",
    "data",
    "Stanford / Aprenda",
    "Social Studies Assessment (used when STAAR not available)",
    600,
    0,
    "assessment",
    {
      pages: "9, 23–24",
      flag: "Alleged curriculum misalignment",
      model: "Assessment input",
      detail: {
        Type: "Assessment / Report",
        "Source-supported fact":
          "HISD uses Stanford/Aprenda testing where STAAR is not available for the subject/grade.",
        "Source pages": "9, 23–24",
        Note: "Alleged misalignment with required curriculum (Seq. 5, pp.23–24)",
      },
    },
  ),
  node(
    "testdata",
    "data",
    "Student Test Data",
    "Prior & current standardized tests",
    920,
    0,
    "resource",
    {
      pages: "13–15",
      model: "Longitudinal standardized-test performance",
      detail: {
        Type: "Data / Information",
        "Source-supported fact":
          "EVAAS uses prior and current standardized-test performance to estimate teacher value-added performance.",
        "Source pages": "13–15",
      },
    },
  ),
  node(
    "evaas_report",
    "data",
    "EVAAS Score / Teacher Value-Added Report",
    "Provided to HISD",
    580, // was 467 — moved right to clear the corrected data-domain
    //           left edge (555); daniel_report (same column) moved
    //           with it to keep the two aligned.
    250,
    "system",
    {
      pages: "13–15, 21–22, 24",
      highlight: true,
      model: "EVAAS statistical output",
      detail: {
        Type: "Algorithmic Output",
        "Source-supported fact":
          "SAS performs the statistical analysis and provides EVAAS scores and reports to HISD.",
        "Source pages": "13–15, 21–22, 24",
        "Evidence / Gap":
          "Exact execution details for Santos's score are not available in the complaint.",
      },
    },
  ),
  node(
    "sas",
    "data",
    "SAS",
    "Statistical Analysis Service",
    940,
    250,
    "system",
    {
      pages: "13–15, 21–22",
      flag: "Proprietary methodology access restricted",
      model: "Statistical analysis service",
      detail: {
        Type: "External Service / System",
        "Source-supported fact":
          "SAS performed the statistical analysis underlying EVAAS scores under an HISD contract.",
        "Source pages": "13–15, 21–22",
        "Evidence / Gap":
          "HISD represented the SAS EVAAS analysis as proprietary; neither HISD nor others had access to information regarding the calculations (Seq. 23, p.22).",
      },
    },
  ),
  node(
    "daniel_report",
    "data",
    "Daniel Santos",
    "Value-Added Report: Least Effective",
    580, // was 468 — see evaas_report note above; kept aligned with it.
    623,
    "person",
    {
      pages: "16, 21, 24",
      status: "Least Effective",
      model: "Teacher value-added report",
      detail: {
        Type: "Person / Actor",
        "Source-supported fact":
          'Santos received a value-added report that deemed him "least effective"; the score preceded his placement on a growth plan.',
        "Source pages": "16, 21, 24",
        "Evidence / Gap":
          "The precise appraisal record showing the score's weight in Santos's individual evaluation is not included in the complaint.",
      },
    },
  ),
  node(
    "hisd_contract",
    "governance",
    "HISD",
    "Contracted with SAS (for EVAAS)",
    1258,
    43,
    "org",
    {
      pages: "15–16, 20–24",
      role: "Contracting and authority actor",
      detail: {
        Type: "Institution / Organization",
        "Role in this path":
          "Authority/control actor — supplied data, adopted EVAAS for appraisal, decided how the result would be used, and converted the score into an employment consequence.",
        "Source pages": "15–16, 20–24",
        "Evidence / Gap":
          "The complaint alleges HISD did not independently verify SAS's statistical analysis (Seq. 15, pp.21–22).",
      },
    },
  ),
  node(
    "evaas_gov",
    "governance",
    "EVAAS",
    "In teacher appraisal system & high-stakes decisions",
    1251,
    410,
    "resource",
    {
      pages: "15–16",
      model: "Teacher appraisal system",
      detail: {
        Type: "Data / Information",
        "Source-supported fact":
          "HISD used EVAAS student-performance measures in its teacher appraisal system and high-stakes employment decisions.",
        "Source pages": "15–16",
        "Evidence / Gap":
          "Exact policy/version applicable to Santos should be obtained if available.",
      },
    },
  ),
  node(
    "hft",
    "consequence",
    "Houston Federation of Teachers (HFT)",
    "Filed a Texas Public Information Act request",
    1618,
    -4,
    "org",
    {
      pages: "22",
      role: "Evidence and transparency challenger",
      detail: {
        Type: "Institution / Organization",
        "Source-supported fact":
          "On November 13, 2013, HFT submitted a Texas Public Information Act request concerning EVAAS scores and methodology.",
        "Source pages": "22",
        "Responsibility significance":
          "Shows an institutional effort to examine and challenge the basis of the algorithmic evaluation process.",
      },
    },
  ),
  node(
    "observation",
    "consequence",
    "Classroom Observation Process",
    "Administrator ratings allegedly aligned with EVAAS",
    1623,
    246,
    "action",
    {
      pages: "20–21",
      checkpoint: "Individual administrator unresolved",
      detail: {
        Type: "Governance Condition",
        "Source-supported fact":
          "HISD allegedly directed or pressured campus administrators to conduct observations of teachers with low EVAAS ratings and align instructional-practice ratings with EVAAS outcomes.",
        "Source pages": "20–21",
        "Evidence / Gap":
          "Individual administrator(s) involved with Santos are not identified in the complaint.",
      },
    },
  ),
  node(
    "growth_plan",
    "consequence",
    "Growth Plan",
    "Placed on Daniel Santos, Fall 2013",
    1620,
    355,
    "governance",
    {
      pages: "16, 21",
      status: "Consequence imposed",
      detail: {
        Type: "Consequence",
        "Source-supported fact":
          "Santos was placed on a growth plan in fall 2013 after release of his EVAAS score showing below-average effectiveness. Growth plans are prescriptive plans requiring additional training, professional development, and tasks.",
        "Source pages": "16, 21",
        "Evidence / Gap":
          "The complaint does not identify the individual who formally approved or issued Santos's growth plan; Santos-specific growth-plan terms are not included.",
      },
    },
  ),
  node(
    "hisd_admin",
    "consequence",
    "Unidentified HISD Administrator / Decision-Maker",
    "Growth-plan approval unresolved",
    1620,
    628,
    "alert",
    {
      pages: "16, 21",
      gapNode: true,
      detail: {
        Type: "Responsibility Gap",
        "Source-supported fact":
          "The complaint does not identify the individual who formally approved or issued Santos's growth plan.",
        "Source pages": "16, 21",
        "Responsibility significance":
          "Prevents the present source from fully reconstructing the human approval/refusal point immediately before the consequence.",
        "Evidence / Gap":
          "Requires appraisal records, growth-plan records, administrator communications, or testimony.",
      },
    },
  ),
  node(
    "reviewer",
    "consequence",
    "Unidentified Reviewer / Oversight Actor",
    "Independent review unresolved",
    1617,
    856,
    "alert",
    {
      pages: "20–23",
      gapNode: true,
      detail: {
        Type: "Responsibility Gap",
        "Source-supported fact":
          "The complaint does not establish who independently reviewed Santos's EVAAS result, whether anyone could reject it, or whether anyone exercised refusal/override authority before the growth plan was imposed.",
        "Source pages": "20–23",
        "Responsibility significance":
          "This is a central responsibility gap: human review capacity and refusal authority cannot be reconstructed from the complaint alone.",
        "Evidence / Gap":
          "Requires policy, workflow, review records, communications, or testimony.",
      },
    },
  ),
];

const handles = {
  r1: ["right", "left"],
  r2: ["bottom", "top"],
  r3: ["right", "bottom"],
  r4: ["right", "left"],
  r6: ["right", "left"],
  r7: ["left", "right"],
  r8: ["left", "right"],
  r9: ["top", "bottom"],
  r10: ["bottom", "top"],
  r11: ["bottom", "top"],
  r12: ["left", "left"], // kept distinct from r10 (bottom/top) — same
  //     source/target pair, different ports, so both labels stay legible.
  r15: ["bottom", "top"],
  r17: ["right", "left"],
  r18: ["right", "left"],
  r20: ["top", "top"],
  r21: ["top", "top"],
  r22: ["bottom", "bottom"],
  r24: ["bottom", "bottom"],
  r25: ["right", "top"],
  r26: ["top", "bottom"],
  r27: ["left", "right"],
};

const relationship = (
  id,
  source,
  target,
  label,
  kind,
  pages,
  options = {},
) => ({
  id,
  source,
  target,
  from: source,
  to: target,
  label,
  kind,
  pages,
  stage: options.stage || "",
  fact: options.fact || "",
  significance: options.significance || "",
  gap: options.gap || "",
  category:
    kind === "direct"
      ? "structural"
      : kind === "condition"
        ? "pipeline"
        : "alert",
  routing: "orthogonal",
  sourceHandle: handles[id]?.[0],
  targetHandle: handles[id]?.[1],
  ...options,
});

const links = [
  relationship("r1", "daniel", "hisd", "EMPLOYED_BY", "direct", "2", {
    stage: "Consequential Conduct",
    fact: "Santos is identified as an HISD teacher.",
    significance:
      "Establishes the institutional employment relationship within which the consequential action occurred.",
    gap: "Complaint identifies employment relationship.",
  }),
  relationship("r2", "daniel", "jackson", "TAUGHT_AT", "direct", "2", {
    stage: "Consequential Conduct",
    fact: "Santos is identified as a sixth-grade social studies teacher at Jackson Middle School.",
    significance:
      "Locates Santos within the institutional unit where the evaluation operated.",
    gap: "Complaint identifies school and teaching assignment.",
  }),
  relationship("r3", "jackson", "hisd", "PART_OF", "direct", "2", {
    stage: "Institutional Structure",
    fact: "Jackson Middle School is an HISD school.",
    significance:
      "Preserves the school-to-district hierarchy rather than treating the school as an isolated entity.",
    gap: "Institutional relationship is established by the complaint's description of Santos as an HISD teacher at Jackson Middle School.",
  }),
  relationship("r4", "hisd", "stanford", "USED", "direct", "9, 23–24", {
    stage: "Algorithmic Input",
    fact: "The complaint states HISD uses Stanford/Aprenda testing where STAAR is not available for the subject/grade.",
    significance:
      "Connects HISD to the assessment instrument supplying student-performance information used in the evaluation process.",
    gap: "Complaint describes HISD's use of Stanford/Aprenda.",
  }),
  relationship("r5", "hisd", "stanford", "USED", "condition", "23–24", {
    chipOnly: true,
    note: "Alleged misalignment with required curriculum",
    stage: "Governance Act / Input Conditions",
    fact: "The complaint alleges Stanford/Aprenda was not sufficiently aligned with what HISD required middle-school social studies teachers to teach.",
    significance:
      "Identifies a governance condition surrounding the algorithmic input: the institution used an assessment that the complaint alleges did not align with required curriculum.",
    gap: "Whether the assessment was actually misaligned would require underlying curriculum and assessment records.",
  }),
  relationship("r6", "hisd", "sas", "PROVIDED_DATA_TO", "direct", "21–22", {
    stage: "Algorithmic Input",
    fact: "Under the HISD–SAS arrangement described in the complaint, HISD provided student test data to SAS for EVAAS analysis.",
    significance:
      "Connects HISD to the data supplied into the algorithmic process.",
    gap: "Complaint describes the data-transfer relationship; underlying contract/data records would provide stronger evidence.",
  }),
  relationship(
    "r7",
    "hisd_contract",
    "sas",
    "CONTRACTED_WITH",
    "direct",
    "21–22",
    {
      stage: "Governance Act",
      fact: "The complaint describes HISD as having contracted with SAS to generate EVAAS scores.",
      significance:
        "Establishes the institutional act that brought the external statistical system into the teacher-evaluation process.",
      gap: "Contract itself is not attached to this complaint.",
    },
  ),
  relationship(
    "r8",
    "sas",
    "evaas_report",
    "GENERATED",
    "direct",
    "13–15, 21–22",
    {
      stage: "Algorithmic Conduct",
      fact: "The complaint states SAS performs the statistical analysis and provides EVAAS scores and reports to HISD.",
      significance: "Connects SAS to generation of the algorithmic output.",
      gap: "Exact execution details for Santos's score are not available in the complaint.",
    },
  ),
  relationship(
    "r9",
    "evaas_report",
    "testdata",
    "DERIVED_FROM",
    "direct",
    "13–15",
    {
      stage: "Algorithmic Conduct",
      fact: "EVAAS uses prior and current standardized-test performance to estimate teacher value-added performance.",
      significance:
        "Establishes the relationship between the data supplied and the resulting teacher-specific output.",
      gap: "Exact student-level data used for Santos is not identified.",
    },
  ),
  relationship(
    "r10",
    "evaas_report",
    "daniel_report",
    "REPORTED_RESULT_FOR",
    "direct",
    "24",
    {
      stage: "Algorithmic Conduct",
      fact: 'The complaint alleges Santos received a value-added report that deemed him "least effective."',
      significance: "Identifies the algorithmic result attributed to Santos.",
      gap: "Underlying Santos EVAAS report would be the direct evidence record.",
    },
  ),
  relationship("r11", "hisd_contract", "evaas_gov", "USED", "direct", "15–16", {
    stage: "Authority",
    fact: "The complaint describes HISD as using EVAAS student-performance measures in its teacher appraisal system and high-stakes employment decisions.",
    significance:
      "Connects institutional decision authority to the algorithmic system. SAS generated the score; HISD determined how the score would be used institutionally.",
    gap: "Exact policy/version applicable to Santos should be obtained if available.",
  }),
  relationship(
    "r12",
    "evaas_report",
    "daniel_report",
    "USED_IN_EVALUATION_OF",
    "direct",
    "16, 21",
    {
      stage: "Authority",
      fact: "The complaint alleges Santos's EVAAS score was used in his evaluation context and preceded his placement on a growth plan.",
      significance:
        "Connects the algorithmic output to the human employment process rather than treating the score as an isolated technical result.",
      gap: "The precise appraisal record showing the score's weight in Santos's individual evaluation is not included in the complaint.",
    },
  ),
  relationship(
    "r13",
    "hisd_contract",
    "evaas_report",
    "USED",
    "direct",
    "15–16, 20–21",
    {
      chipOnly: true,
      stage: "Control",
      fact: "HISD received and used EVAAS results in teacher appraisal and employment practices.",
      significance:
        "Shows institutional control over whether and how the algorithmic result became consequential.",
      gap: "Specific reviewer/approver for Santos is not identified.",
    },
  ),
  relationship("r14", "sas", "evaas_report", "GENERATED", "direct", "21–22", {
    chipOnly: true,
    stage: "Control",
    fact: "The complaint states SAS performed the statistical analysis underlying EVAAS scores.",
    significance:
      "Shows SAS controlled the statistical generation process described in the complaint.",
    gap: "The complaint alleges HISD did not independently verify the analysis.",
  }),
  relationship("r15", "hisd_contract", "sas", "USED", "gap", "21–22", {
    note: "HISD did not independently verify SAS analysis",
    stage: "Control / Evidence Gap",
    fact: "The complaint alleges HISD did not independently verify SAS's statistical analysis.",
    significance:
      "Raises a responsibility question about institutional reliance on an externally generated algorithmic output without independent verification.",
    gap: "Who within HISD could verify, reject, or require review of Santos's score is unresolved.",
  }),
  relationship(
    "r16",
    "hisd_contract",
    "growth_plan",
    "USED",
    "direct",
    "15–16",
    {
      chipOnly: true,
      stage: "Governance Act",
      fact: "The complaint alleges low EVAAS scores were used to trigger sanctions, growth plans, and other employment consequences.",
      significance:
        "Identifies the governance act that converted algorithmic output into employment significance.",
      gap: "Policy documentation would strengthen this connection.",
    },
  ),
  relationship(
    "r17",
    "hisd_contract",
    "observation",
    "USED",
    "direct",
    "20–21",
    {
      stage: "Governance Act / Human Oversight",
      fact: "The complaint alleges HISD directed or pressured campus administrators to conduct observations of teachers with low EVAAS ratings and align instructional-practice ratings with EVAAS outcomes.",
      significance:
        "Shows alleged institutional action surrounding human review, rather than independent oversight operating separately from the algorithmic result.",
      gap: "Individual administrator(s) involved with Santos are not identified in the complaint.",
    },
  ),
  relationship(
    "r18",
    "daniel_report",
    "growth_plan",
    "PLACED_ON",
    "direct",
    "16, 21",
    {
      highlight: true,
      stage: "Human / Institutional Action",
      fact: "The complaint alleges Santos was placed on a growth plan in fall 2013 after release of his EVAAS score showing below-average effectiveness.",
      significance:
        "This is the direct consequential employment action being reconstructed.",
      gap: "The complaint does not identify the individual who formally approved or issued Santos's growth plan.",
    },
  ),
  relationship("r19", "growth_plan", "daniel_report", "—", "direct", "16", {
    chipOnly: true,
    noMerge: true,
    stage: "Consequence",
    fact: "The complaint describes growth plans as prescriptive plans requiring additional training, professional development, and tasks.",
    significance:
      "Establishes what the consequential action meant for the affected teacher.",
    gap: "Santos-specific growth-plan terms are not included in the complaint.",
  }),
  relationship("r20", "hft", "hisd", "REQUESTED_FROM", "direct", "22", {
    stage: "Evidence / Challenge",
    fact: "On November 13, 2013, HFT submitted a Texas Public Information Act request concerning EVAAS scores and methodology.",
    significance:
      "Shows an institutional effort to examine and challenge the basis of the algorithmic evaluation process.",
    gap: "The exact request and complete response should be obtained as direct evidence records if available.",
  }),
  relationship("r21", "hisd", "hft", "PROVIDED_TO", "direct", "22", {
    stage: "Evidence / Transparency",
    fact: "The complaint states HISD provided some general information concerning the EVAAS process in response to requests.",
    significance:
      "Establishes that some information survived and was available for review.",
    gap: "The complaint characterizes the information as limited.",
  }),
  relationship("r22", "hisd", "hft", "WITHHELD_FROM", "gap", "22–23", {
    stage: "Evidence / Transparency Gap",
    fact: "The complaint alleges HISD did not provide source code, decision rules, statistical controls, and other information sufficient to reproduce or fully examine the EVAAS analysis.",
    significance:
      "Identifies a material evidentiary gap affecting the ability to reconstruct the precise algorithmic basis of Santos's result.",
    gap: "Exact scope of information legally or contractually accessible to HISD is unresolved in this source.",
  }),
  relationship("r23", "sas", "evaas_report", "—", "direct", "22", {
    chipOnly: true,
    stage: "Evidence / Proprietary Control",
    fact: "The complaint states HISD represented the SAS EVAAS analysis as proprietary and said neither HISD nor others had access to information regarding the calculations.",
    significance:
      "Indicates potential external control over the methodology and evidence necessary to examine the algorithmic result.",
    gap: "The contract and SAS documentation would be required to determine the actual allocation of access/control.",
  }),
  relationship(
    "r24",
    "sas",
    "evaas_report",
    "TRACE: Responsibility / Control candidate",
    "trace",
    "13–15, 21–22",
    {
      stage: "Responsibility Finding",
      fact: "The complaint supports connecting SAS to the statistical generation of the EVAAS teacher-specific result.",
      significance:
        "SAS is connected to production of the algorithmic output. This does not by itself establish responsibility for HISD's employment decision.",
      gap: "Exact methodology, execution record, and Santos-specific calculation remain unavailable in this source.",
    },
  ),
  relationship(
    "r25",
    "hisd_contract",
    "growth_plan",
    "TRACE: Authority / Control / Responsibility candidate",
    "trace",
    "15–16, 20–24",
    {
      stage: "Responsibility Finding",
      fact: "The complaint supports connecting HISD to supplying data, adopting EVAAS for appraisal, deciding how the result would be used, and imposing employment consequences.",
      significance:
        "HISD is strongly connected to the institutional conditions that made the algorithmic result consequential.",
      gap: "The individual human actor(s) who reviewed, approved, or could override the Santos decision remain unresolved.",
    },
  ),
  relationship(
    "r26",
    "hisd_admin",
    "growth_plan",
    "TRACE: unresolved",
    "unresolved",
    "16, 21",
    {
      stage: "Responsibility Gap",
      fact: "The complaint does not identify the individual who formally approved or issued Santos's growth plan.",
      significance:
        "Prevents the present source from fully reconstructing the human approval/refusal point immediately before the consequence.",
      gap: "Requires appraisal records, growth-plan records, administrator communications, or testimony.",
    },
  ),
  relationship(
    "r27",
    "reviewer",
    "daniel_report",
    "TRACE: unresolved",
    "unresolved",
    "20–23",
    {
      stage: "Responsibility Gap",
      fact: "The complaint does not establish who independently reviewed Santos's EVAAS result, whether anyone could reject it, or whether anyone exercised refusal/override authority before the growth plan was imposed.",
      significance:
        "This is a central responsibility gap because human review capacity and refusal authority cannot be reconstructed from the complaint alone.",
      gap: "Requires policy, workflow, review records, communications, or testimony.",
    },
  ),
];

export const DOCX_TARGET_MATTER = {
  id: "docx-hft-santos",
  title: "HFT v. HISD - Responsibility Path",
  subtitle: "DOCX-derived node and relationship architecture",
  enablePhysics: false,
  layout: { name: "preset" },
  pageHeader: {
    tag: "EBRR TRACE Matter Reconstruction",
    title: "4. Agent Activity View",
    desc: "Document-derived entity, data, governance, consequence, and responsibility-gap path.",
  },
  domains: GROUPS.map((group) => ({
    id: `${group.id}-domain`,
    name: group.name,
    x: group.x,
    y: group.y,
    w: group.w,
    h: group.h,
    lockedBounds: true,
    borderColor: group.accent,
    badgeBg: group.accent,
    nodeIds: nodes
      .filter((item) => item.group === group.id)
      .map((item) => item.id),
  })),
  nodes,
  links,
  // step is derived from the link id (e.g. "r12" -> 12), not array
  // position, so numbering stays locked to the .md's Seq. column even
  // if links are reordered or new ones inserted later.
  sequence: links.map((link) => ({
    step: parseInt(link.id.slice(1), 10),
    id: link.id,
    title: String(link.label).replaceAll("_", " "),
    rawLabel: link.label,
    stage: link.stage,
    fact: link.fact,
    significance: link.significance,
    gap: link.gap,
    time: `Complaint pp. ${link.pages}`,
    source: link.source || link.from,
    target: link.target || link.to,
    nodeId: link.target || link.to,
    kind: link.kind,
    chipOnly: !!link.chipOnly,
    icon:
      link.kind === "gap" || link.kind === "unresolved" ? "alert" : "action",
    isAlert: ["gap", "unresolved"].includes(link.kind),
  })),
};
