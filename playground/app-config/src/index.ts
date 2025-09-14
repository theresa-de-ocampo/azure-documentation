import "dotenv/config";
import readline from "readline-sync";

import {
  createSetting,
  getSetting,
  updateSetting,
  deleteSetting,
  getFeatureState
} from "./actions.js";

async function main() {
  console.log("Azure App Configuration Demo");

  let choice = 0;
  const choices = [
    "Create Setting",
    "Get Setting",
    "Update Setting",
    "Delete Setting",
    "Get Feature State"
  ];

  while (choice !== -1) {
    choice = readline.keyInSelect(choices, "Select an Option", {
      cancel: "Exit"
    });

    switch (choice) {
      case -1:
        break;
      case 0:
        await createSetting();
        break;
      case 1:
        await getSetting();
        break;
      case 2:
        await updateSetting();
        break;
      case 3:
        await deleteSetting();
        break;
      case 4:
        await getFeatureState();
        break;
      default:
        console.log("Invalid choice! Please try again.");
    }
  }
}

main();
