import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { TrafficHome } from "./pages/TrafficHome";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <StrictMode>
    <div className="min-h-screen bg-slate-100 p-8">
      <TrafficHome />
    </div>
  </StrictMode>
);

