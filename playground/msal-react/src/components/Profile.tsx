import { useMsal } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";
import { useEffect, useState } from "react";

import { retrieveData } from "../api";

export default function Profile() {
  type MsProfile = {
    id: string;
    displayName: string;
    mail: string;
  };

  const { instance } = useMsal();
  const [profileData, setProfileData] = useState<MsProfile>();

  async function getProfile(account: AccountInfo) {
    const { accessToken } = await instance.acquireTokenSilent({
      account,
      scopes: ["user.read"]
    });

    const data = await retrieveData(
      "https://graph.microsoft.com/v1.0/me",
      accessToken
    );

    setProfileData(data);
  }

  useEffect(() => {
    if (!profileData) {
      const account = instance.getActiveAccount();

      if (account) {
        getProfile(account);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  if (!profileData) return <p>Loading</p>;

  return (
    <table>
      <tbody>
        <tr>
          <th>ID</th>
          <td>{profileData.id}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{profileData.displayName}</td>
        </tr>
        <tr>
          <th>Mail</th>
          <td>{profileData.mail}</td>
        </tr>
      </tbody>
    </table>
  );
}
