import { DeviceCodeInfo } from "@azure/identity";
import { authenticateUser } from "./client.js";
import settings from "./app-settings.js";

function initializeGraph() {
  return authenticateUser(settings, (info: DeviceCodeInfo) => {
    // Displays the device code message to the user.
    // This tells them where to go to sign in and provides the code to use.
    console.log(`at authenticateUser: ${info.message}`);
  });
}

export async function greetUser() {
  const { credential } = initializeGraph();

  const response = await credential.getToken(settings.graphUserScopes);
  console.log(`at greetUser: ${response.token}`);

  return response.token;
}

export async function displayAccessToken() {
  // TODO
}

export async function listInbox() {
  // TODO
}

export async function sendMail() {
  // TODO
}

export async function makeGraphCall() {
  // TODO
}
