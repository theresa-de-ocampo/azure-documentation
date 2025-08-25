import "dotenv/config";
import readline from "readline-sync";

import {
  displayAccessToken,
  greetUser,
  listInbox,
  makeGraphCall,
  sendMail
} from "./actions.js";

async function main() {
  console.log("Microsoft Graph Demo");

  let choice = 0;

  await greetUser();

  const choices = [
    "Display Access Token",
    "List My Inbox",
    "Send Mail",
    "Make a Graph Call"
  ];

  while (choice != -1) {
    choice = readline.keyInSelect(choices, "Select an Option", {
      cancel: "Exit"
    });

    switch (choice) {
      case -1:
        break;
      case 0:
        await displayAccessToken();
        break;
      case 1:
        await listInbox();
        break;
      case 2:
        await sendMail();
        break;
      case 3:
        await makeGraphCall();
        break;
      default:
        console.log("Invalid choice! Please try again.");
    }
  }
}

main();
