import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { AppProviders } from "./AppProviders";

const container = document.getElementById("root");
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <StrictMode>
    <AppProviders>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Platform Remote
          </h1>
          <p className="text-slate-600">
            Bu remote, paylaşılan servisleri (QueryClient, Account vb.) sağlar.
            Shell tarafından tüketilmek üzere tasarlanmıştır.
          </p>
        </div>
      </div>
    </AppProviders>
  </StrictMode>
);

