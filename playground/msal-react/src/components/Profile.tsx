import { useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";
import { useEffect, useState } from "react";

import { retrieveData } from "../api";

export default function Profile() {
  const [displayData, setDisplayData] = useState();

  const { result, error, acquireToken } = useMsalAuthentication(
    InteractionType.Redirect,
    {
      scopes: ["user.read"]
    }
  );

  console.log(result);

  useEffect(() => {
    if (!displayData) {
      // console.log("i entered");
      // console.log(result);
      if (error) {
        console.error(error);
      } else if (result) {
        const accessToken = result.accessToken;
        // console.log(accessToken);
      }
    }
  }, [displayData, error, result]);

  return <div>Profile</div>;
}
