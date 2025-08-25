import { AppSettings } from "./app-settings.js";
import {
  DeviceCodeCredential,
  DeviceCodePromptCallback
} from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";
import { Client } from "@microsoft/microsoft-graph-client";

let credential: DeviceCodeCredential | undefined;
let client: Client | undefined;

export function authenticateUser(
  settings: AppSettings,
  deviceCodePrompt: DeviceCodePromptCallback
) {
  if (!credential || !client) {
    credential = new DeviceCodeCredential({
      clientId: settings.clientId,
      tenantId: settings.tenantId,
      userPromptCallback: deviceCodePrompt
    });

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: settings.graphUserScopes
    });

    client = Client.initWithMiddleware({ authProvider });
  }

  return { credential, client };
}
