import React from 'react';
import { Icon } from './Icons';

export const Sidebar = ({ activeView = 'agent-activity', onSelectView }) => {
  const navItems = [
    { id: 'matter-view', label: 'Matter View', icon: 'org' },
    { id: 'agent-activity', label: 'Agent Activity', icon: 'agent-run' },
    { id: 'evidence', label: 'Evidence', icon: 'assessment' },
    { id: 'authority-control', label: 'Authority & Control', icon: 'governance' },
    { id: 'timeline', label: 'Timeline', icon: 'resource' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-heading">Views</div>
      <nav className="nav-list">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onSelectView && onSelectView(item.id)}
          >
            <span className="nav-icon"><Icon name={item.icon} size={16} /></span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="collapse-btn"
          onClick={() => {
            if (activeView !== 'agent-activity') {
              onSelectView && onSelectView('agent-activity');
            }
          }}
          title="Return to primary canvas"
        >
          {activeView === 'agent-activity' ? '« Canvas Active' : '« Return to Graph'}
        </button>
      </div>
    </aside>
  );
};
