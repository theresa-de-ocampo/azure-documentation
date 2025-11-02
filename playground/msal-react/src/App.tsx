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
  const [activeTab, setActiveTab] = useState<PAGE>(PAGE.HOME);

  return (
    <MsalProvider instance={msalInstance}>
      <Header setActiveTab={setActiveTab} />
      <main>
        <h1>Welcome to the MSAL Demo for React!</h1>
        {activeTab === PAGE.HOME ? <Home /> : <Profile />}
      </main>
    </MsalProvider>
  );
}

export default App;
