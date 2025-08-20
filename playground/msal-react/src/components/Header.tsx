import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";
import type { Dispatch, SetStateAction, MouseEvent } from "react";

import PAGE from "../constants/pages";

export default function Header({
  setActiveTab
}: {
  setActiveTab: Dispatch<SetStateAction<PAGE>>;
}) {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  function navigate(e: MouseEvent<HTMLAnchorElement>, page: PAGE) {
    e.preventDefault();
    setActiveTab(page);
  }

  function logIn() {
    instance.loginPopup({ scopes: ["user.read"] });
  }

  function logOut() {
    instance.logoutPopup();
  }

  return (
    <nav>
      <a href="/" onClick={(e) => navigate(e, PAGE.HOME)}>
        MSAL React
      </a>
      <a href="/#account" onClick={(e) => navigate(e, PAGE.PROFILE)}>
        Graph API
      </a>
      {isAuthenticated ? (
        <button onClick={logOut}>Log Out</button>
      ) : (
        <button onClick={logIn}>Log In</button>
      )}
    </nav>
  );
}
