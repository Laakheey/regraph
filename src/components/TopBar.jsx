import React, { useState } from "react";
import { Icon } from "./Icons";

export const TopBar = ({
  currentMatter,
  onSelectMatter,
  matterList,
  onExportDiagramPdf,
  onExportReportPdf,
  searchQuery = "",
  onSearchChange,
  onOpenLegalAssistant,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">
          <Icon name="brand" size={18} />
        </span>
        <b>EBRR TRACE</b>
      </div>

      <div className="matter-dropdown-container">
        <button
          className="matter-btn"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
        >
          <span className="matter-name">{currentMatter.title}</span>
          <Icon name="chevron-down" size={12} />
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-label">SELECT INCIDENT MATTER</div>
            {matterList.map((m) => (
              <button
                key={m.id}
                className={`dropdown-item ${m.id === currentMatter.id ? "active" : ""}`}
                onClick={() => {
                  onSelectMatter(m.id);
                  setDropdownOpen(false);
                }}
              >
                <b>{m.title}</b>
                <small>{m.subtitle}</small>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Real-time Global Search */}
      <div className="search-box">
        <Icon name="search" size={14} className="search-icon" />
        <input
          type="text"
          placeholder="Search activities, nodes, evidence..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
        {searchQuery ? (
          <button
            className="search-clear-btn"
            onClick={() => onSearchChange && onSearchChange("")}
            title="Clear search"
          >
            ✕
          </button>
        ) : (
          <kbd>⌘ K</kbd>
        )}
      </div>

      <div className="topbar-actions">
        <button
          className="topbar-pdf-btn"
          onClick={onExportDiagramPdf}
          title="Download the active visual diagram as PDF"
        >
          <Icon name="pdf" size={14} />
          <span>Diagram PDF</span>
        </button>

        <button
          className="icon-btn"
          title="Legal Assistant Chat"
          onClick={onOpenLegalAssistant}
        >
          <Icon name="help" size={16} />
        </button>

        <button
          className="icon-btn"
          title="Investigation Notifications"
          onClick={() =>
            alert(
              "TRACE Investigation: 4 critical responsibility gaps detected in Daniel Santos appraisal pathway.",
            )
          }
        >
          <Icon name="bell" size={16} />
          <span className="badge-dot" />
        </button>

        <div
          className="avatar"
          onClick={onOpenLegalAssistant}
          style={{ cursor: "pointer" }}
        >
          LA
        </div>

        <button className="role-btn" onClick={onOpenLegalAssistant}>
          Legal Assistant
          <Icon name="chevron-down" size={11} />
        </button>
      </div>
    </header>
  );
};
