import React from 'react';
import { Icon } from './Icons';

export const AuthorityControlView = ({ matter, onBackToCanvas }) => {
  return (
    <div className="view-container auth-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">TRACE GOVERNANCE MATRIX</span>
          <h2>Authority & Control Analysis</h2>
          <p className="view-sub">Deconstructing institutional power, software execution, and accountability gaps</p>
        </div>
        <button className="btn-primary" onClick={onBackToCanvas}>
          <Icon name="agent-run" size={14} /> Back to Canvas Graph
        </button>
      </div>

      <div className="matrix-columns">
        {/* Column 1: HISD Institutional Authority */}
        <div className="matrix-col hisd-col">
          <div className="col-header">
            <span className="col-pill pill-purple">DISTRICT GOVERNANCE</span>
            <h3>Houston ISD (HISD)</h3>
            <p>Institutional Appraisal Authority</p>
          </div>
          <div className="col-card">
            <h4>Allocated Authority</h4>
            <ul>
              <li>Texas Education Code authority over campus operations.</li>
              <li>Board Policy DFBB (Local) establishing 50% EVAAS weighting.</li>
              <li>Power to issue growth plans and contract non-renewals.</li>
            </ul>
          </div>
          <div className="col-card">
            <h4>Exercised Control</h4>
            <ul>
              <li>Selected Stanford/Aprenda test regardless of curriculum match.</li>
              <li>Supplied longitudinal student scores to SAS Institute.</li>
              <li>Enforced disciplinary growth plan on Daniel Santos.</li>
            </ul>
          </div>
          <div className="col-card alert-border">
            <h4 className="alert-text">Authority Deficit</h4>
            <p>
              Delegated mathematical scoring to a private vendor while maintaining zero independent capacity to audit or reproduce calculations.
            </p>
          </div>
        </div>

        {/* Column 2: SAS Vendor Domain */}
        <div className="matrix-col sas-col">
          <div className="col-header">
            <span className="col-pill pill-blue">COMMERCIAL VENDOR</span>
            <h3>SAS Institute, Inc.</h3>
            <p>Technical & Algorithmic Control</p>
          </div>
          <div className="col-card">
            <h4>Commercial Authority</h4>
            <ul>
              <li>Private software vendor under Master Services Agreement.</li>
              <li>Holds copyright and patent claims on EVAAS statistical formulas.</li>
              <li>NO statutory authority over teacher employment or certification.</li>
            </ul>
          </div>
          <div className="col-card">
            <h4>Exercised Control</h4>
            <ul>
              <li>Sole possessor of proprietary source code and covariance equations.</li>
              <li>Executed multivariate mixed-model runs on servers in North Carolina.</li>
              <li>Classified Santos as "Least Effective" (-2.1 score).</li>
            </ul>
          </div>
          <div className="col-card alert-border">
            <h4 className="alert-text">Transparency Failure</h4>
            <p>
              Asserted trade secret protections under TPIA to block educators from verifying score accuracy or discovering data errors.
            </p>
          </div>
        </div>

        {/* Column 3: The Accountability Void */}
        <div className="matrix-col gap-col">
          <div className="col-header">
            <span className="col-pill pill-orange">RESPONSIBILITY GAP</span>
            <h3>Accountability Void</h3>
            <p>Missing Human Oversight Checkpoints</p>
          </div>
          <div className="col-card">
            <h4>The Unidentified Reviewer</h4>
            <p>
              The complaint reveals <b>no named individual administrator</b> who independently examined Santos's score before the growth plan was imposed.
            </p>
          </div>
          <div className="col-card">
            <h4>Zero Override Capacity</h4>
            <p>
              Neither Jackson Middle School principal nor district evaluators possessed authority or procedural mechanisms to override EVAAS results.
            </p>
          </div>
          <div className="col-card alert-border red-bg">
            <h4 className="critical-text">Constitutional Violation</h4>
            <p>
              Because authority was fragmented between vendor IP and district inertia, teachers experienced arbitrary deprivation without Due Process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
