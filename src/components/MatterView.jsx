import React from "react";
import { Icon } from "./Icons";

export const MatterView = ({ matter, onBackToCanvas }) => {
  return (
    <div className="view-container matter-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">CASE RECONSTRUCTION DOSSIER</span>
          <h2>{matter.title}</h2>
          <p className="view-sub">
            Civil Action No. 4:14-CV-01189 · United States District Court for
            the Southern District of Texas
          </p>
        </div>
        <button className="btn-primary" onClick={onBackToCanvas}>
          <Icon name="agent-run" size={14} /> Open Agent Activity Graph
        </button>
      </div>

      <div className="matter-grid">
        {/* Card 1: Executive Case Summary */}
        <div className="matter-card col-span-2">
          <div className="card-header">
            <Icon name="org" size={16} />
            <h3>Case Overview & Core Allegations</h3>
          </div>
          <p>
            Plaintiffs, including Daniel Santos (a 6th-grade social studies
            teacher at Jackson Middle School) and the Houston Federation of
            Teachers (HFT), challenged the Houston Independent School District's
            (HISD) implementation of the{" "}
            <b>Education Value-Added Assessment System (EVAAS)</b>. HISD
            weighted proprietary algorithmic EVAAS ratings at 50% of annual
            appraisals and used them to trigger mandatory remediation plans and
            contract terminations.
          </p>
          <p>
            When teachers attempted to challenge adverse evaluations, HISD and
            SAS Institute refused to disclose the underlying statistical models,
            source code, and student data linkages, claiming proprietary trade
            secret protection.
          </p>
        </div>

        {/* Card 2: Legal Standards & Constitutional Claims */}
        <div className="matter-card">
          <div className="card-header">
            <Icon name="governance" size={16} />
            <h3>Constitutional & Legal Claims</h3>
          </div>
          <ul className="legal-claims-list">
            <li>
              <b>14th Amendment Procedural Due Process:</b> Deprivation of
              constitutionally protected property interests in continuing
              employment without meaningful notice or audit opportunity.
            </li>
            <li>
              <b>Substantive Due Process / Arbitrariness:</b> Evaluation based
              on an unverified, highly volatile statistical black box unaligned
              with curriculum.
            </li>
            <li>
              <b>Texas Public Information Act (TPIA):</b> Improper withholding
              of public accountability data.
            </li>
          </ul>
        </div>

        {/* Card 3: Key Litigants & Stakeholders */}
        <div className="matter-card">
          <div className="card-header">
            <Icon name="person" size={16} />
            <h3>Parties & Jurisdictional Roles</h3>
          </div>
          <div className="parties-dossier">
            <div className="party-row">
              <span className="party-tag plaintiff">Plaintiff</span>
              <div>
                <b>Daniel Santos</b>
                <small>6th Grade Social Studies Educator · Jackson MS</small>
              </div>
            </div>
            <div className="party-row">
              <span className="party-tag plaintiff">Plaintiff</span>
              <div>
                <b>Houston Federation of Teachers (HFT)</b>
                <small>
                  Labor Union & Collective Bargaining Representative
                </small>
              </div>
            </div>
            <div className="party-row">
              <span className="party-tag defendant">Defendant</span>
              <div>
                <b>Houston Independent School District (HISD)</b>
                <small>Public School District & Employing Entity</small>
              </div>
            </div>
            <div className="party-row">
              <span className="party-tag vendor">Third-Party Vendor</span>
              <div>
                <b>SAS Institute, Inc.</b>
                <small>
                  Algorithmic Model Developer & Value-Added Provider
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Judicial Ruling & Significance */}
        <div className="matter-card col-span-2">
          <div className="card-header">
            <Icon name="assessment" size={16} />
            <h3>Landmark Judicial Precedent (Gilmore, J.)</h3>
          </div>
          <blockquote className="judicial-quote">
            "Any teacher seeking to challenge his or her evaluation is
            effectively shut out. HISD does not possess the proprietary software
            programs or equations necessary to verify or replicate the EVAAS
            scores... The court concludes that HISD’s evaluation system violates
            the Fourteenth Amendment’s guarantee of procedural due process."
            <cite>
              — Hon. Vanessa D. Gilmore, U.S. District Judge (251 F. Supp. 3d
              1168)
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
};
