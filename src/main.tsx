import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GatehouseProvider } from "./context/GatehouseContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GatehouseProvider>
      <App />
    </GatehouseProvider>
  </StrictMode>,
);
