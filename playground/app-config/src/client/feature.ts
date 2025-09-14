import {
  ConfigurationMapFeatureFlagProvider,
  FeatureManager
} from "@microsoft/feature-management";
import { DefaultAzureCredential } from "@azure/identity";
import { load } from "@azure/app-configuration-provider";

let client: FeatureManager | undefined;

export async function authenticate() {
  if (!client) {
    const endpoint = process.env.APP_CONFIG_ENDPOINT;

    if (!endpoint) {
      throw new Error("App Config Endpoint is required.");
    }

    const credential = new DefaultAzureCredential();

    const appConfig = await load(endpoint, credential, {
      featureFlagOptions: { enabled: true }
    });

    const featureProvider = new ConfigurationMapFeatureFlagProvider(appConfig);
    client = new FeatureManager(featureProvider);
  }

  return client;
}
