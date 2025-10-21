import "dotenv/config";

import { isServiceBusError } from "@azure/service-bus";
import type {
  ServiceBusClient,
  ProcessErrorArgs,
  ServiceBusMessage
} from "@azure/service-bus";

import { authenticate } from "../../client.js";
import { QUEUE } from "../../constants.js";

const config = {
  maxReceivers: 2,
  idleTimeout: 30 * 1000,
  delayTime: 5 * 1000
};

const abortController = new AbortController();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processMessage(message: ServiceBusMessage) {
  console.log(
    `Received ${message.subject} message from session ${message.sessionId}`
  );
}

async function processError(args: ProcessErrorArgs) {
  console.log(
    `Error occurred with ${args.entityPath} within ${args.fullyQualifiedNamespace}: ${args.error}`
  );
}

async function createReceiver(client: ServiceBusClient, workerId: number) {
  let receiver;

  try {
    receiver = await client.acceptNextSession(QUEUE.ORDER_PROCESS, {
      maxAutoLockRenewalDurationInMs: config.idleTimeout
    });
  } catch (error) {
    if (
      isServiceBusError(error) &&
      (error.code === "SessionCannotBeLocked" ||
        error.code === "ServiceTimeout")
    ) {
      console.error(
        `[Worker ${workerId}] No available sessions, sleeping for ${config.delayTime}`
      );
    } else {
      console.error(
        `[Worker ${workerId}] Error when creating the receiver for the next available session.`
      );
    }

    await sleep(config.delayTime);
  }

  return receiver;
}

async function receiveNextSession(client: ServiceBusClient, workerId: number) {
  const receiver = await createReceiver(client, workerId);

  if (receiver) {
    console.log(
      `Session ${receiver.sessionId} was accepted by Worker ${workerId}`
    );

    receiver.subscribe(
      {
        processMessage,
        processError
      },
      { abortSignal: abortController.signal }
    );

    await sleep(config.idleTimeout);

    console.log(
      `Session ${receiver.sessionId} was closed by Worker ${workerId}.`
    );
    await receiver.close();
  }
}

// Continuously receive sessions
// Process next session as soon as this slot is freed
async function sessionWorker(client: ServiceBusClient, workerId: number) {
  while (!abortController.signal.aborted) {
    await receiveNextSession(client, workerId);
  }
}

// Algorithm is sort of like like similar to round robin,
// except there's no concept of burst and quantum time.
async function start() {
  const client = await authenticate();

  const sessionWorkers = [];

  for (let i = 0; i < config.maxReceivers; i++) {
    sessionWorkers.push(sessionWorker(client, i));
  }

  console.log("Listening for available sessions...");
  await Promise.all(sessionWorkers);

  console.log("Finished processing all sessions.");
  await client.close();
}

process.on("SIGINT", async () => {
  console.log("CTRL + C received");
  abortController.abort();
  process.exit(2);
});

start();
