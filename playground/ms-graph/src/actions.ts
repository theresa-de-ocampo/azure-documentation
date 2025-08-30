import { DeviceCodeInfo } from "@azure/identity";
import { authenticateUser } from "./client.js";
import settings from "./app-settings.js";
import { PageCollection } from "@microsoft/microsoft-graph-client";
import { Message } from "@microsoft/microsoft-graph-types";

function initializeGraph() {
  return authenticateUser(settings, (info: DeviceCodeInfo) => {
    // Displays the device code message to the user.
    // This tells them where to go to sign in and provides the code to use.
    console.log(`at authenticateUser: ${info.message}`);
  });
}

export async function greetUser() {
  const { client } = initializeGraph();

  // The select method adds the $select query parameter to the API call.
  // Because the code uses select, only the requested properties have values in the returned object.
  // All other properties have default values. Try logging the entire user object.

  const user = await client
    .api("/me")
    .select(["displayName", "mail", "userPrincipalName"])
    .get();

  console.log(`Hello ${user.displayName}!`);
}

export async function displayAccessToken() {
  const { credential } = initializeGraph();

  const response = await credential.getToken(settings.graphUserScopes);
  console.log(`at greetUser: ${response.token}`);

  return response.token;
}

export async function listInbox() {
  const { client } = initializeGraph();

  try {
    const messagePage: PageCollection = await client
      .api("/me/mailFolders/inbox/messages")
      .select(["from", "isRead", "receivedDateTime", "subject"])
      .top(5)
      .orderby("receivedDateTime DESC")
      .get();

    const messages: Message[] = messagePage.value;

    if (messages.length === 0) {
      console.log("You inbox is empty.");
    } else {
      for (const message of messages) {
        console.log(`Message: ${message.subject ?? "NO SUBJECT"}`);
        console.log(`  From: ${message.from?.emailAddress?.name ?? "UNKNOWN"}`);
        console.log(`  Status: ${message.isRead ? "Read" : "Unread"}`);
        console.log(`  Received: ${message.receivedDateTime}`);
        console.log(" ");
      }
    }
  } catch (error) {
    console.error(`Error getting the user's inbox: ${error}`);
  }
}

export async function sendMail(
  subject: string,
  recipient: string,
  body: string
) {
  const { client } = initializeGraph();

  try {
    const message: Message = {
      subject,
      body: {
        content: body,
        contentType: "text"
      },
      toRecipients: [
        {
          emailAddress: {
            address: recipient
          }
        }
      ]
    };

    await client.api("/me/sendMail").post({ message });
    console.log("Email Sent!");
  } catch (error) {
    console.error(`Failed to send message: ${error}`);
  }
}
