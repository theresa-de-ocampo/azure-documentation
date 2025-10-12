import { ServiceBusClient } from "@azure/service-bus";
import { DefaultAzureCredential } from "@azure/identity";

let client: ServiceBusClient | undefined;

export async function authenticate() {
  if (!client) {
    const namespace = process.env.AZ_SERVICE_BUS_NAMESPACE;

    if (!namespace) {
      throw new Error("Fully qualified namespace is required.");
    }

    const credential = new DefaultAzureCredential();

    client = new ServiceBusClient(namespace, credential);
  }

  return client;
}

export async function createSender(queueOrTopicName: string) {
  const client = await authenticate();
  return client.createSender(queueOrTopicName);
}
