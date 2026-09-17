import React, { useState } from "react";
import { Icon } from "./Icons";

export const LegalAssistantModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "assistant",
      text: "Welcome to the TRACE Legal Assistant for Houston Federation of Teachers v. HISD (Daniel Santos Matter). How can I assist your investigation today?",
    },
  ]);

  const cannedPrompts = [
    "Analyze Procedural Due Process violation",
    "Assess SAS vendor proprietary trade secret defense",
    "Evaluate responsibility gaps in Santos growth plan",
    "Summarize Judge Gilmore 2017 summary judgment opinion",
  ];

  const handleAsk = (promptText) => {
    const userQ = promptText || query;
    if (!userQ.trim()) return;

    const newMsgs = [...messages, { sender: "user", text: userQ }];
    setMessages(newMsgs);
    setQuery("");

    let response = "";
    const qLower = userQ.toLowerCase();

    if (qLower.includes("due process") || qLower.includes("procedural")) {
      response = `Under the 14th Amendment, public school teachers holding continuing/term contracts have a recognized property interest in their employment. In HFT v. HISD, Judge Gilmore held that using an unreplicable, proprietary algorithmic score (EVAAS) to impose sanctions and non-renewal without providing teachers the underlying computer code or formulas violates Procedural Due Process. Teachers were denied any meaningful opportunity to audit or challenge their ratings.`;
    } else if (
      qLower.includes("trade secret") ||
      qLower.includes("vendor") ||
      qLower.includes("sas")
    ) {
      response = `SAS Institute claimed that the EVAAS multivariate mixed-model equations, covariance matrix parameters, and source code are protected trade secrets under Texas Public Information Act § 552.110. The court rejected HISD's defense that it could shelter behind SAS's trade secret claim: a public entity cannot outsource high-stakes constitutional deprivations to a private vendor and then claim it is powerless to disclose how the decisions were made.`;
    } else if (
      qLower.includes("gap") ||
      qLower.includes("growth plan") ||
      qLower.includes("santos")
    ) {
      response = `Evidentiary and responsibility gaps in Daniel Santos's path: (1) The complaint fails to identify any specific human administrator who independently reviewed Santos's score before imposing the 2013 Growth Plan. (2) No district actor held or exercised authority to override the -2.1 score. (3) The assessment (Stanford 10) was misaligned with the TEKS curriculum Santos taught. The imposition was essentially an unreviewed algorithmic rubber-stamp.`;
    } else if (
      qLower.includes("opinion") ||
      qLower.includes("gilmore") ||
      qLower.includes("summary judgment")
    ) {
      response = `Judge Vanessa D. Gilmore (S.D. Tex. May 4, 2017) denied HISD's motion for summary judgment on the Due Process claims, establishing landmark legal precedent for AI and algorithmic accountability in public employment. The ruling affirmed that when public algorithms affect property or liberty interests, full transparency and meaningful auditability are constitutional requirements.`;
    } else {
      response = `Based on the TRACE reconstruction for ${userQ}: The evidentiary record demonstrates a split between SAS (algorithmic developer controlling the statistical software) and HISD (institutional employer adopting the metric and enforcing sanctions). The critical legal flaw is the absence of an auditable human checkpoint between the score output and the growth plan sanction.`;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "assistant", text: response }]);
    }, 400);
  };

  return (
    <div className="modal-backdrop centered" onClick={onClose}>
      <div
        className="modal-dialog assistant-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-box">
            <span className="modal-badge">AI LEGAL CO-COUNSEL</span>
            <h3>EBRR TRACE™ Legal Assistant</h3>
            <p>HFT v. HISD · Algorithmic Accountability Investigation</p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="modal-body assistant-body">
          <div className="assistant-chat-window">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`chat-bubble ${m.sender === "user" ? "user-bubble" : "assistant-bubble"}`}
              >
                <div className="bubble-author">
                  {m.sender === "user"
                    ? "Investigator"
                    : "TRACE Legal Assistant"}
                </div>
                <div className="bubble-text">{m.text}</div>
              </div>
            ))}
          </div>

          <div className="canned-prompts-tray">
            <span className="prompt-lead">Suggested inquiries:</span>
            <div className="prompts-list">
              {cannedPrompts.map((cp, idx) => (
                <button
                  key={idx}
                  className="canned-chip"
                  onClick={() => handleAsk(cp)}
                >
                  {cp}
                </button>
              ))}
            </div>
          </div>

          <form
            className="assistant-input-bar"
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk();
            }}
          >
            <input
              type="text"
              placeholder="Ask a question about Due Process, EVAAS methodology, or responsibility gaps..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="send-btn">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
