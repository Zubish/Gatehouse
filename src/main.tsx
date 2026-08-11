import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { GatehouseProvider } from "./context/GatehouseContext.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GatehouseProvider>
        <App />
      </GatehouseProvider>
    </BrowserRouter>
  </StrictMode>,
);
