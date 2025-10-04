import { DefaultAzureCredential } from "@azure/identity";
import { EventGridPublisherClient } from "@azure/eventgrid";
import { InputSchema } from "@azure/eventgrid";

let client: EventGridPublisherClient<InputSchema> | undefined;

export default function authenticateToEventGrid() {
  if (!client) {
    if (!process.env.TOPIC_ENDPOINT) {
      throw new Error("Topic Endpoint is required.");
    }

    const credential = new DefaultAzureCredential();

    client = new EventGridPublisherClient(
      process.env.TOPIC_ENDPOINT,
      "EventGrid",
      credential
    );
  }

  return client;
}
