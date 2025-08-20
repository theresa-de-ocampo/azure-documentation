import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { PublicClientApplication } from "@azure/msal-browser";

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: "https://login.microsoftonline.com/consumers",
    redirectUri: "/"
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App msalInstance={msalInstance} />
  </StrictMode>
);
