import React, { useState } from "react";
import { Icon } from "./Icons";

export const EvidenceView = ({ matter, onBackToCanvas }) => {
  const [filter, setFilter] = useState("ALL");
  const [selectedDoc, setSelectedDoc] = useState(null);

  const evidenceItems = [
    {
      id: "EV-001",
      title: "Plaintiffs' Original Federal Complaint",
      category: "PLEADING",
      citation: "Complaint pp. 1–28",
      date: "May 2014",
      status: "SUPPORTED",
      summary:
        "Filed in S.D. Tex. alleging 14th Amendment Due Process violations and unexaminable algorithmic governance.",
      excerpt:
        'Santos received a score of -2.1 ("Least Effective") despite outstanding classroom appraisals. He was placed on a growth plan with no human ability to verify the statistical calculations.',
    },
    {
      id: "EV-002",
      title: "2012–2013 EVAAS Teacher Value-Added Report",
      category: "TECHNICAL",
      citation: "Report ID: TX-HISD-2013-SANTOS",
      date: "Fall 2013",
      status: "PROPRIETARY",
      summary:
        "Single composite index calculating Teacher Growth Index of -2.1 with standard error of 0.82.",
      excerpt:
        "Score derived from Stanford 10 test residuals; equations, shrinkage parameters, and covariance weights withheld as SAS trade secrets.",
    },
    {
      id: "EV-003",
      title: "HISD Board Policy DFBB (Local)",
      category: "GOVERNANCE",
      citation: "HISD Board Policies Manual",
      date: "Adopted 2012",
      status: "OFFICIAL_RECORD",
      summary:
        "Codified 50% weighting of EVAAS value-added scores in annual teacher appraisals and contract non-renewals.",
      excerpt:
        "Appraisal scores below designated thresholds mandate placement on formal growth plans and constitute statutory good cause for non-renewal.",
    },
    {
      id: "EV-004",
      title: "HISD – SAS Master Services Agreement",
      category: "CONTRACT",
      citation: "HISD Contract #11-04-02",
      date: "2011–2014",
      status: "RESTRICTED",
      summary:
        "Commercial agreement delegating statistical computing to SAS with strict non-disclosure terms.",
      excerpt:
        "HISD acknowledges SAS ownership of all intellectual property, formulas, algorithms, and analytical software.",
    },
    {
      id: "EV-005",
      title: "Stanford 10 / Aprenda 3 Social Studies Assessment Files",
      category: "INPUT_DATA",
      citation: "Complaint pp. 9, 23–24",
      date: "Spring 2013",
      status: "MISALIGNED",
      summary:
        "Norm-referenced standardized examination used as input data where STAAR was unavailable.",
      excerpt:
        "Stanford 10 examination tested content not included in the Texas Essential Knowledge and Skills (TEKS) curriculum Santos was mandated to instruct.",
    },
    {
      id: "EV-006",
      title: "HFT Texas Public Information Act (TPIA) Demand Letter",
      category: "DEMAND",
      citation: "TPIA Request #2013-11-13",
      date: "Nov 13, 2013",
      status: "DENIED",
      summary:
        "Union request for underlying SAS code, equations, and Santos student linkage records.",
      excerpt:
        'Formal demand to inspect the algorithms and data used to classify teacher Daniel Santos as "Least Effective".',
    },
    {
      id: "EV-007",
      title: "Santos 2013–2014 Mandatory Growth Plan",
      category: "DISCIPLINARY",
      citation: "Complaint pp. 16, 21",
      date: "October 2013",
      status: "UNAUDITED",
      summary:
        "Prescriptive disciplinary corrective plan imposed without identifying the formal human decision-maker.",
      excerpt:
        "Mandated remedial instructional coaching and extra administrative observations; precursor to contract termination.",
    },
  ];

  const filteredItems =
    filter === "ALL"
      ? evidenceItems
      : evidenceItems.filter((e) => e.category === filter);

  return (
    <div className="view-container evidence-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">EVIDENTIARY ARCHIVE</span>
          <h2>Evidence Repository & Document Locker</h2>
          <p className="view-sub">
            Primary source records, contracts, pleadings, and proprietary
            disclosure logs
          </p>
        </div>
        <button className="btn-primary" onClick={onBackToCanvas}>
          <Icon name="agent-run" size={14} /> Back to Canvas Graph
        </button>
      </div>

      <div className="evidence-controls">
        <div className="filter-pills">
          {[
            "ALL",
            "PLEADING",
            "TECHNICAL",
            "GOVERNANCE",
            "CONTRACT",
            "INPUT_DATA",
            "DISCIPLINARY",
          ].map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat.replace("_", " ")}
            </button>
          ))}
        </div>
        <span className="evidence-count font-mono">
          Showing {filteredItems.length} records
        </span>
      </div>

      <div className="evidence-table-card">
        <table className="evidence-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Document / Artifact Title</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Citation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((e) => (
              <tr
                key={e.id}
                onClick={() => setSelectedDoc(e)}
                className="clickable-row"
              >
                <td className="font-mono">{e.id}</td>
                <td>
                  <b>{e.title}</b>
                  <small className="row-sub">{e.summary}</small>
                </td>
                <td>
                  <span className="cat-tag">{e.category}</span>
                </td>
                <td>{e.date}</td>
                <td>
                  <span
                    className={`badge-pill ${e.status === "SUPPORTED" || e.status === "OFFICIAL_RECORD" ? "pill-green" : "pill-orange"}`}
                  >
                    {e.status}
                  </span>
                </td>
                <td className="font-mono text-xs">{e.citation}</td>
                <td>
                  <button
                    className="preview-btn"
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelectedDoc(e);
                    }}
                  >
                    Preview
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDoc && (
        <div
          className="modal-backdrop centered"
          onClick={() => setSelectedDoc(null)}
        >
          <div
            className="modal-dialog evidence-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="modal-badge">{selectedDoc.category}</span>
                <h3>{selectedDoc.title}</h3>
                <p>
                  {selectedDoc.citation} · {selectedDoc.date}
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedDoc(null)}
              >
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="modal-body">
              <div className="evidence-detail-box">
                <h4>Evidentiary Summary</h4>
                <p>{selectedDoc.summary}</p>
                <h4>Verbatim Excerpt / Record Evidence</h4>
                <blockquote className="evidence-excerpt font-mono">
                  {selectedDoc.excerpt}
                </blockquote>
                <div className="evidence-status-meta">
                  <b>Legal Audit Assessment:</b>{" "}
                  {selectedDoc.status === "SUPPORTED"
                    ? "Direct factual support established in pleadings and public records."
                    : "Subject to proprietary withholding or unresolved institutional review."}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setSelectedDoc(null)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => alert("Citing: " + selectedDoc.citation)}
              >
                Copy Citation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
