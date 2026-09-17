import React from "react";
import { Icon } from "./Icons";

export const TimelineView = ({ matter, onBackToCanvas }) => {
  const events = [
    {
      date: "2006–2012",
      stage: "Baseline Employment",
      actor: "Daniel Santos & Jackson MS",
      title: "Santos Exemplary Instructional Tenure",
      description:
        "Daniel Santos teaches 6th-grade Social Studies at Jackson Middle School with consistently high classroom observation ratings.",
      type: "structural",
    },
    {
      date: "Summer 2012",
      stage: "Governance Adoption",
      actor: "HISD Board of Education",
      title: "Adoption of Board Policy DFBB (Local)",
      description:
        "HISD mandates 50% EVAAS value-added weighting in teacher evaluations and ties scores directly to contract non-renewal.",
      type: "governance",
    },
    {
      date: "Spring 2013",
      stage: "Assessment Administration",
      actor: "HISD / Testing Unit",
      title: "Stanford 10 / Aprenda 3 Examination",
      description:
        "Administered norm-referenced test where STAAR was unavailable. Alleged mismatch with TEKS social studies curriculum.",
      type: "pipeline",
    },
    {
      date: "June 2013",
      stage: "Data Transfer",
      actor: "HISD Data Management",
      title: "Longitudinal Student Records Transmitted to SAS",
      description:
        "HISD extracts student testing histories and roster links, transmitting files to SAS Institute servers in North Carolina.",
      type: "pipeline",
    },
    {
      date: "Summer 2013",
      stage: "Algorithmic Calculation",
      actor: "SAS Institute EVAAS Engine",
      title: "Multivariate Mixed-Model Execution",
      description:
        'Proprietary algorithm computes teacher value-added gain scores; outputs Santos Teacher Growth Index at -2.1 ("Least Effective").',
      type: "pipeline",
    },
    {
      date: "Fall 2013",
      stage: "Institutional Adoption",
      actor: "HISD Administration",
      title: "Release of 2013 EVAAS Teacher Reports",
      description:
        "HISD accepts scores without independent replication or audit and integrates -2.1 index into Santos annual performance rating.",
      type: "alert",
    },
    {
      date: "October 2013",
      stage: "Adverse Employment Action",
      actor: "Unidentified HISD Decision-Maker",
      title: "Mandatory Growth Plan Imposed on Santos",
      description:
        "Jackson MS / HISD places Santos on formal disciplinary Growth Plan, creating formal administrative basis for non-renewal.",
      type: "alert",
    },
    {
      date: "Nov 13, 2013",
      stage: "Union Formal Challenge",
      actor: "Houston Federation of Teachers",
      title: "TPIA Public Information Act Request",
      description:
        "HFT requests underlying source code, formulas, and Santos student linkage records to verify evaluation accuracy.",
      type: "governance",
    },
    {
      date: "Winter 2013",
      stage: "Information Withholding",
      actor: "HISD & SAS Institute",
      title: "Trade Secret Exemption Asserted",
      description:
        "HISD refuses to provide source code and calculation rules, asserting SAS proprietary intellectual property protections.",
      type: "alert",
    },
    {
      date: "May 2014",
      stage: "Federal Litigation",
      actor: "HFT & Daniel Santos",
      title: "Civil Rights Lawsuit Filed (S.D. Tex.)",
      description:
        "Federal complaint filed under 42 U.S.C. § 1983 alleging 14th Amendment Procedural Due Process deprivations.",
      type: "structural",
    },
    {
      date: "May 4, 2017",
      stage: "Judicial Precedent",
      actor: "Hon. Vanessa D. Gilmore",
      title: "Landmark Summary Judgment Ruling",
      description:
        "Federal court rules HISD evaluation system violated Due Process: unreplicable algorithmic scores cannot deprive teachers of employment.",
      type: "governance",
    },
  ];

  return (
    <div className="view-container timeline-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">CHRONOLOGICAL RECONSTRUCTION</span>
          <h2>Matter Timeline & Procedural Arc</h2>
          <p className="view-sub">
            From curriculum mismatch to federal civil rights summary judgment
          </p>
        </div>
        <button className="btn-primary" onClick={onBackToCanvas}>
          <Icon name="agent-run" size={14} /> Back to Canvas Graph
        </button>
      </div>

      <div className="timeline-trail">
        {events.map((ev, idx) => (
          <div key={idx} className={`timeline-card-wrapper ${ev.type}`}>
            <div className="timeline-marker">
              <span className="marker-dot" />
            </div>
            <div className="timeline-event-card">
              <div className="event-meta">
                <span className="event-date font-mono">{ev.date}</span>
                <span className="event-stage">{ev.stage}</span>
                <span className="event-actor">{ev.actor}</span>
              </div>
              <h3 className="event-title">{ev.title}</h3>
              <p className="event-desc">{ev.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
