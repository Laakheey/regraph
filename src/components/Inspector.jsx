import React from "react";
import { Icon } from "./Icons";

export const Inspector = ({
  node,
  onClose,
  onOpenRunDetails,
  onSelectNode,
  nodes = [],
}) => {
  const getPillClass = (status) => {
    if (!status) return "pill-gray";
    const s = String(status).toLowerCase();
    // Green: verified, supported, attributed, completed
    if (
      s.includes("supported") ||
      s.includes("attributed") ||
      s.includes("completed") ||
      s.includes("verified") ||
      s === "yes"
    ) {
      return "pill-green";
    }
    // Orange / Red: missing human review, unverified oversight, withheld data, gaps found
    if (
      s.includes("gap") ||
      s.includes("unresolved") ||
      s.includes("unverified") ||
      s.includes("withheld") ||
      s.includes("missing") ||
      s.includes("bypassed") ||
      s.includes("mismatch") ||
      s.includes("critical") ||
      s.includes("alert") ||
      s.includes("defect") ||
      s.includes("refusal")
    ) {
      return "pill-orange";
    }
    // Blue: tracked, active, operational unit
    if (
      s.includes("tracked") ||
      s.includes("active") ||
      s.includes("unit") ||
      s.includes("challenger")
    ) {
      return "pill-blue";
    }
    // Red: direct denial, adverse sanction, disciplinary
    if (
      s.includes("no") ||
      s.includes("imposed") ||
      s.includes("adverse") ||
      s.includes("denied") ||
      s.includes("restricted")
    ) {
      return "pill-red";
    }
    return "pill-gray";
  };

  // 1. Overview State when no node is selected (Default 100% Opacity Full View)
  if (!node) {
    return (
      <aside className="inspector inspector-overview">
        <div className="inspector-head">
          <b>Graph Overview</b>
          <span className="overview-indicator">All Nodes Visible (100%)</span>
        </div>

        <div className="inspector-scroll">
          <div className="overview-hero">
            <div className="hero-icon-box box-org">
              <Icon name="brand" size={20} />
            </div>
            <div className="hero-text">
              <h2>HFT v. HISD Reconstruction</h2>
              <p>Full 4-Column Responsibility Network</p>
            </div>
          </div>

          <div className="overview-card">
            <h4>Investigation State: Full Overview</h4>
            <p>
              The entire 4-column algorithmic pathway is currently displayed at{" "}
              <b>100% full opacity</b> with zero dimming.
            </p>
            <ul className="overview-stats-list">
              <li>
                <b>12 Nodes:</b> Entities, inputs, algorithms & consequences
              </li>
              <li>
                <b>3 Combos:</b> HISD Domain, SAS Vendor Domain & Gaps
              </li>
              <li>
                <b>Strict L-to-R:</b> Parties → Governance → Engines → Outputs
              </li>
            </ul>
          </div>

          <div className="quick-select-card">
            <h4>Quick Focus (1-Hop Neighborhood)</h4>
            <p className="quick-select-help">
              Click any key entity below or directly on the canvas to isolate
              its direct connections and view its TRACE matrix:
            </p>
            <div className="quick-select-grid">
              <button
                className="quick-chip kind-person"
                onClick={() => onSelectNode && onSelectNode("santos")}
              >
                <span className="chip-dot dot-person" />
                Daniel Santos (Teacher)
              </button>
              <button
                className="quick-chip kind-org"
                onClick={() => onSelectNode && onSelectNode("hisd")}
              >
                <span className="chip-dot dot-org" />
                Houston ISD (Governance)
              </button>
              <button
                className="quick-chip kind-org"
                onClick={() => onSelectNode && onSelectNode("sas")}
              >
                <span className="chip-dot dot-org" />
                SAS Institute (Vendor)
              </button>
              <button
                className="quick-chip kind-system"
                onClick={() => onSelectNode && onSelectNode("evaas")}
              >
                <span className="chip-dot dot-sys" />
                EVAAS Engine (Model)
              </button>
              <button
                className="quick-chip kind-resource"
                onClick={() => onSelectNode && onSelectNode("score")}
              >
                <span className="chip-dot dot-res" />
                2013 EVAAS Score (-2.1)
              </button>
              <button
                className="quick-chip kind-alert"
                onClick={() => onSelectNode && onSelectNode("gap")}
              >
                <span className="chip-dot dot-alert" />
                Unidentified Reviewer (Gap)
              </button>
            </div>
          </div>

          <div className="overview-tip-box">
            <Icon name="help" size={13} />
            <span>
              Tip: Click any node or sequence step to focus. Press <b>Escape</b>{" "}
              or click empty canvas space to return to this overview.
            </span>
          </div>
        </div>
      </aside>
    );
  }

  // 2. Selected Node State (Full Activity Details)
  return (
    <aside className="inspector">
      <div className="inspector-head">
        <b>Selected Activity</b>
        <button
          className="close-btn"
          onClick={onClose}
          title="Deselect and return to full graph overview (Escape)"
        >
          <Icon name="close" size={14} />
        </button>
      </div>

      <div className="inspector-scroll">
        <div className={`selected-hero hero-${node.kind}`}>
          <div className={`hero-icon-box box-${node.kind}`}>
            <Icon name={node.kind} size={20} />
          </div>
          <div className="hero-text">
            <h2>{node.label}</h2>
            <p>{node.sub}</p>
          </div>
        </div>

        {/* Key Attributes Table - Multi-line without truncation */}
        <div className="attributes-table">
          <div className="attr-row">
            <span className="attr-key">
              <Icon name="workflow" size={12} /> Assigned Task
            </span>
            <span className="attr-val wrap-text">
              {node.assignedTask || "Standard Operation"}
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="action" size={12} /> Objective
            </span>
            <span className="attr-val wrap-text">
              {node.objective || "N/A"}
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="resource" size={12} /> Date
            </span>
            <span className="attr-val wrap-text">
              {node.date || "Incident Timeline"}
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="brand" size={12} /> Run Status
            </span>
            <span className="attr-val">
              <span
                className={`badge-pill wrap-pill ${getPillClass(node.status)}`}
              >
                {node.status}
              </span>
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="model" size={12} /> Active Models
            </span>
            <span className="attr-val wrap-text">
              <span className="model-chip wrap-pill">
                {node.activeModels || "N/A"}
              </span>
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="action" size={12} /> Tool Used
            </span>
            <span className="attr-val wrap-text">
              {node.toolUsed || "None"}
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="globe" size={12} /> Boundary Crossing
            </span>
            <span className="attr-val">
              <span
                className={`badge-pill wrap-pill ${getPillClass(node.boundaryCrossing)}`}
              >
                {node.boundaryCrossing}
              </span>
            </span>
          </div>

          <div className="attr-row highlight-checkpoint">
            <span className="attr-key">
              <Icon name="person" size={12} /> Human Checkpoint
            </span>
            <span className="attr-val wrap-text">
              <span
                className={`badge-pill wrap-pill ${getPillClass(node.humanCheckpoint)}`}
              >
                {node.humanCheckpoint}
              </span>
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="alert" size={12} /> Pre-compromise Alert
            </span>
            <span className="attr-val">
              <span
                className={`badge-pill wrap-pill ${getPillClass(node.preCompAlert)}`}
              >
                {node.preCompAlert}
              </span>
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="governance" size={12} /> Intervention Attempt
            </span>
            <span className="attr-val">
              <span
                className={`badge-pill wrap-pill ${getPillClass(node.intervention)}`}
              >
                {node.intervention}
              </span>
            </span>
          </div>

          <div className="attr-row">
            <span className="attr-key">
              <Icon name="assessment" size={12} /> Evidence
            </span>
            <span
              className="attr-val evidence-link wrap-text"
              onClick={() => onOpenRunDetails && onOpenRunDetails(node)}
              title="Click to view evidentiary citations"
            >
              {node.evidence} <Icon name="external" size={11} />
            </span>
          </div>
        </div>

        {/* TRACE Legal Framework - Dynamic Status Badges */}
        <div className="trace-section">
          <div className="trace-header">
            <b>TRACE LEGAL EVALUATION</b>
            <span
              className="trace-info-icon"
              title="Traceability, Responsibility, Authority, Control, Evidence"
            >
              <Icon name="help" size={11} />
            </span>
          </div>

          {node.trace && (
            <div className="trace-list">
              <div className="trace-item">
                <span className="trace-bullet tr-resp">
                  <Icon name="person" size={11} />
                </span>
                <div className="trace-body">
                  <b>Responsibility</b>
                  <span className="trace-desc">
                    {node.trace.responsibility.text}
                  </span>
                </div>
                <span
                  className={`badge-pill ${getPillClass(node.trace.responsibility.status)}`}
                >
                  {node.trace.responsibility.status}
                </span>
              </div>

              <div className="trace-item">
                <span className="trace-bullet tr-auth">
                  <Icon name="governance" size={11} />
                </span>
                <div className="trace-body">
                  <b>Authority</b>
                  <span className="trace-desc">
                    {node.trace.authority.text}
                  </span>
                </div>
                <span
                  className={`badge-pill ${getPillClass(node.trace.authority.status)}`}
                >
                  {node.trace.authority.status}
                </span>
              </div>

              <div className="trace-item">
                <span className="trace-bullet tr-ctrl">
                  <Icon name="resource" size={11} />
                </span>
                <div className="trace-body">
                  <b>Control</b>
                  <span className="trace-desc">{node.trace.control.text}</span>
                </div>
                <span
                  className={`badge-pill ${getPillClass(node.trace.control.status)}`}
                >
                  {node.trace.control.status}
                </span>
              </div>

              <div className="trace-item">
                <span className="trace-bullet tr-evid">
                  <Icon name="assessment" size={11} />
                </span>
                <div className="trace-body">
                  <b>Evidence</b>
                  <span className="trace-desc">{node.trace.evidence.text}</span>
                </div>
                <span
                  className={`badge-pill ${getPillClass(node.trace.evidence.status)}`}
                >
                  {node.trace.evidence.status}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          className="full-details-btn"
          onClick={() => onOpenRunDetails && onOpenRunDetails(node)}
        >
          View Full Run Details <Icon name="external" size={12} />
        </button>
      </div>
    </aside>
  );
};
