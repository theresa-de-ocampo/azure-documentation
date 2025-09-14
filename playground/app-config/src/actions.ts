import { authenticate as authenticateConfig } from "./client/config.js";
import { authenticate as authenticateFeature } from "./client/feature.js";
import readline from "readline-sync";

export async function createSetting() {
  const key = readline.question("Key: ");
  const value = readline.question("Value: ");
  const label = readline.question("Label (Optional): ") || undefined;

  const client = authenticateConfig();

  try {
    const setting = await client.setConfigurationSetting({
      key,
      value,
      label
    });

    console.dir(setting, { depth: null });
  } catch (error) {
    console.error(error);
  }
}

export async function getSetting() {
  const key = readline.question("Key: ");
  const label = readline.question("Label (Optional): ") || undefined;

  const client = authenticateConfig();
  let setting;

  try {
    // If a setting has a label, but no label was provided, it's going to return 404
    setting = await client.getConfigurationSetting({ key, label });
    console.dir(setting, { depth: null });
  } catch (error) {
    console.error(error);
  }

  return setting;
}

export async function updateSetting() {
  const client = authenticateConfig();
  const setting = await getSetting();

  try {
    if (setting) {
      const value = readline.question("New Value: ") || undefined;
      setting.value = value;
      const updatedSetting = await client.setConfigurationSetting(setting);
      console.dir(updatedSetting, { depth: null });
    } else {
      console.error("Setting not found");
    }
  } catch (error) {
    console.error(error);
  }
}

export async function deleteSetting() {
  const key = readline.question("Key: ");
  const label = readline.question("Label (Optional): ") || undefined;

  const client = authenticateConfig();

  try {
    // If a setting has a label, but you only provided the key, it's not going to delete it (204)
    // Successful deletion will return the deleted setting
    const setting = await client.deleteConfigurationSetting({ key, label });
    console.dir(setting, { depth: null });
  } catch (error) {
    console.error(error);
  }
}

export async function getFeatureState() {
  const client = await authenticateFeature();

  try {
    const featureName = readline.question("Feature: ");
    const result = await client.isEnabled(featureName);
    console.dir(result, { depth: null });
  } catch (error) {
    console.error(error);
  }
}
