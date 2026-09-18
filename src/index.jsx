import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const isManualVisual = () =>
  window.location.pathname.startsWith("/manual-visual") ||
  window.location.hash.startsWith("#/manual-visual");

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  const render = () => {
    if (isManualVisual()) {
      const { ManualVisualPage } = require("./manual-visual/ManualVisualPage");
      root.render(<ManualVisualPage />);
    } else {
      root.render(<App />);
    }
  };

  render();
  window.addEventListener("popstate", render);
  window.addEventListener("hashchange", render);
}
