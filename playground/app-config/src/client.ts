import { AppConfigurationClient } from "@azure/app-configuration";
import { DefaultAzureCredential } from "@azure/identity";

let client: AppConfigurationClient | undefined;

export function authenticate() {
  if (!client) {
    const endpoint = process.env.APP_CONFIG_ENDPOINT;

    if (!endpoint) {
      throw new Error("App Config Endpoint is required.");
    }

    const credential = new DefaultAzureCredential();

    client = new AppConfigurationClient(endpoint, credential);
  }

  return client;
}
