import { useState } from "react";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// * Styles
import "./App.css";

// * Components
import Header from "./components/Header";
import Home from "./components/Home";
import Profile from "./components/Profile";

// * Constants
import PAGE from "./constants/pages";

function App({ msalInstance }: { msalInstance: PublicClientApplication }) {
  const [activeTab, setActiveTab] = useState(PAGE.HOME);

  return (
    <MsalProvider instance={msalInstance}>
      <Header setActiveTab={setActiveTab} />
      {activeTab === "home" ? <Home /> : <Profile />}
    </MsalProvider>
  );
}

export default App;
