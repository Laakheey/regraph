import React from 'react';
import { Icon } from './Icons';

export const RunDetailsModal = ({ node, isOpen, onClose }) => {
  if (!isOpen || !node) return null;

  // Mock raw model & audit data based on node kind & role
  const auditSteps = [
    {
      step: 1,
      name: 'Data Ingestion & Linkage',
      timestamp: '2013-06-14T08:32:10Z',
      status: 'VERIFIED',
      detail: 'Extracted student testing records from HISD Student Information System (SIS); transferred to SAS secure FTP server.'
    },
    {
      step: 2,
      name: 'Roster Verification & Attribution Check',
      timestamp: '2013-06-20T14:15:00Z',
      status: 'FLAGGED_DEFECT',
      detail: 'Teacher Santos listed for 6th-grade Social Studies; 42 students linked. Pleading notes incomplete roster verification disputes.'
    },
    {
      step: 3,
      name: 'Multivariate Mixed-Model Execution',
      timestamp: '2013-07-02T19:44:22Z',
      status: 'COMPLETED_BLACKBOX',
      detail: 'SAS EVAAS engine executed proprietary statistical equations. Covariance matrices and regression coefficients withheld as proprietary.'
    },
    {
      step: 4,
      name: 'Teacher Growth Index (TGI) Output Generation',
      timestamp: '2013-08-11T11:05:49Z',
      status: 'CRITICAL_ADVERSE',
      detail: 'Standardized Gain Score computed as -2.1 (Standard Error: 0.82). Metric automatically categorized as "Least Effective".'
    },
    {
      step: 5,
      name: 'District Appraisal Weighting & Consequence Imposition',
      timestamp: '2013-10-18T10:00:00Z',
      status: 'NO_HUMAN_AUDIT',
      detail: 'HISD applied 50% EVAAS weight under Board Policy DFBB (Local). Prescriptive Growth Plan issued without administrative audit.'
    }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog run-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">TRACE AUDIT LOG</span>
            <h3>Run Details & Evidentiary Citations</h3>
            <p>{node.label} · {node.sub}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Section 1: Executive Summary */}
          <div className="modal-card">
            <h4 className="card-title">
              <Icon name="brand" size={14} /> Execution Summary & Status
            </h4>
            <div className="audit-meta-grid">
              <div className="meta-cell">
                <span className="meta-label">Node Identifier:</span>
                <span className="meta-value font-mono">{node.id}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-label">Assigned Function:</span>
                <span className="meta-value">{node.assignedTask || 'Standard Operation'}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-label">Temporal Window:</span>
                <span className="meta-value">{node.date || '2012–2013 School Year'}</span>
              </div>
              <div className="meta-cell">
                <span className="meta-label">Human Checkpoint:</span>
                <span className="meta-value alert-text">{node.humanCheckpoint || 'None Detected'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Step-by-Step Audit Trail */}
          <div className="modal-card">
            <h4 className="card-title">
              <Icon name="workflow" size={14} /> End-to-End Step Audit Trail
            </h4>
            <div className="audit-timeline">
              {auditSteps.map((s) => (
                <div key={s.step} className="audit-step-item">
                  <div className="step-num">{s.step}</div>
                  <div className="step-content">
                    <div className="step-header">
                      <b>{s.name}</b>
                      <span className="step-timestamp font-mono">{s.timestamp}</span>
                    </div>
                    <p className="step-detail">{s.detail}</p>
                    <span className="step-status-tag">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Raw Model & Formula Output */}
          <div className="modal-card">
            <h4 className="card-title">
              <Icon name="model" size={14} /> Raw Model Outputs & Algorithmic Parameters
            </h4>
            <div className="code-box font-mono">
              {`// SAS EVAAS Teacher Value-Added Model Output
Target Teacher: Daniel Santos (Employee ID: #68421)
Campus: Jackson Middle School (Campus #051)
Assessment Stream: Stanford 10 / Aprenda 3 (6th Grade Social Studies)
Statistical Method: Multivariate Layered Mixed-Effects Model (Sanders / SAS Proprietary)

[METRIC COEFFICIENTS]
Observed Score Mean (Y_obs)    : 58.4 NCE
Projected Score Mean (Y_proj)   : 62.6 NCE
Raw Student Residual Mean       : -4.2 NCE
Teacher Growth Index (TGI)      : -2.1000
Standard Error (SE)             : 0.8241
Classification Threshold       : < -2.0000 ("Least Effective")

[VERIFICATION & SOURCE CODE ACCESS]
Source Code Repository          : WITHHELD (Claimed SAS Trade Secret under TPIA § 552.110)
Covariance Matrices            : NOT PROVIDED TO HISD
Model Shrinkage Factor (EBLUP) : OPAQUE / UNEXAMINABLE
Independent Audit Verification  : FAILED / NOT PERFORMED`}
            </div>
          </div>

          {/* Section 4: Evidentiary Citations & Legal Authorities */}
          <div className="modal-card">
            <h4 className="card-title">
              <Icon name="assessment" size={14} /> Evidentiary Citations & Case Excerpts
            </h4>
            <div className="citations-list">
              <div className="citation-item">
                <span className="citation-source">Plaintiffs' Complaint pp. 21–24:</span>
                <p>
                  "HISD does not possess the proprietary software programs or equations necessary to verify or replicate the EVAAS scores. When teachers requested their underlying data and formulas to challenge erroneous scores, HISD responded that the information was a trade secret owned exclusively by SAS."
                </p>
              </div>
              <div className="citation-item">
                <span className="citation-source">HFT v. HISD, 251 F. Supp. 3d 1168, 1177 (S.D. Tex. 2017) (Gilmore, J.):</span>
                <p>
                  "When a teacher's continued employment is at stake, the Fourteenth Amendment's guarantee of procedural due process requires that the teacher be provided a meaningful opportunity to challenge the accuracy of the performance evaluation. High-stakes employment decisions cannot be based on an unexaminable algorithmic black box."
                </p>
              </div>
              <div className="citation-item">
                <span className="citation-source">Texas Public Information Act (TPIA) Demand:</span>
                <p>
                  Formal demand filed November 13, 2013 by Houston Federation of Teachers seeking SAS EVAAS algorithms, coefficient matrices, and Santos student linkage records. Denied under proprietary exemption.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={() => {
            navigator.clipboard.writeText(`Audit Log: ${node.label} - ${node.sub}\nEvidence: ${node.evidence}`);
            alert('Evidentiary citation copied to clipboard.');
          }}>
            Copy Legal Citation
          </button>
        </div>
      </div>
    </div>
  );
};
