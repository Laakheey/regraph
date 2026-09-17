import React, { useRef } from "react";
import { Icon } from "./Icons";

export const SequenceTrack = ({ sequence, selectedNodeId, onSelectNode }) => {
  const trackRef = useRef(null);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -240, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  return (
    <section className="sequence-bar">
      <div className="sequence-header-inline">
        <span className="sequence-label">ACTIVITY SEQUENCE</span>
        <div className="sequence-scroll-btns">
          <button
            className="seq-nav-btn"
            onClick={scrollLeft}
            title="Scroll Left"
          >
            <Icon name="chevron-left" size={13} />
          </button>
          <button
            className="seq-nav-btn"
            onClick={scrollRight}
            title="Scroll Right"
          >
            <Icon name="chevron-right" size={13} />
          </button>
        </div>
      </div>

      <div className="sequence-track" ref={trackRef}>
        {sequence.map((item, idx) => {
          const isCurrent = item.nodeId === selectedNodeId;
          return (
            <React.Fragment key={item.step}>
              <button
                className={`seq-card ${isCurrent ? "current" : ""} ${item.isAlert ? "alert" : ""}`}
                onClick={() => onSelectNode(item.nodeId)}
                title={`Step ${item.step}: ${item.title} (${item.time})`}
              >
                <span className="seq-number">{item.step}</span>
                <span className="seq-icon-pill">
                  <Icon
                    name={
                      item.nodeId.includes("alert") ||
                      item.nodeId.includes("score")
                        ? "alert"
                        : "action"
                    }
                    size={12}
                  />
                </span>
                <div className="seq-info">
                  <b>{item.title}</b>
                  <small>{item.time}</small>
                </div>
              </button>

              {idx < sequence.length - 1 && (
                <div className="seq-connector">
                  <span className="connector-line" />
                  <span className="connector-arrow">▶</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
};
