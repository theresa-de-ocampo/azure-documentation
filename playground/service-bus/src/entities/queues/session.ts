import "dotenv/config";
import crypto from "node:crypto";
import type { ServiceBusMessage, ProcessErrorArgs } from "@azure/service-bus";

import { authenticate, close } from "../../client.js";
import { QUEUE, EVENT } from "../../constants.js";

async function main() {
  const sessions = [
    {
      order_id: crypto.randomUUID(),
      payment_id: crypto.randomUUID(),
      shipment_id: crypto.randomUUID()
    },
    {
      customer_id: crypto.randomUUID(),
      order_id: crypto.randomUUID(),
      payment_id: crypto.randomUUID()
    }
  ];

  const interest = [
    {
      event: EVENT.PLACED_ORDER,
      body: {
        order_id: sessions[0].order_id
      }
    },
    {
      event: EVENT.PAYMENT_PAID,
      body: {
        order_id: sessions[0].order_id,
        payment_id: sessions[0].payment_id
      }
    },
    {
      event: EVENT.FULFILLED_ORDER,
      body: {
        order_id: sessions[0].order_id,
        shipment_id: sessions[0].shipment_id
      }
    }
  ];

  const noise = [
    {
      event: EVENT.PLACED_ORDER,
      body: {
        order_id: sessions[1].order_id
      }
    },
    {
      event: EVENT.PAYMENT_PAID,
      body: {
        order_id: sessions[1].order_id,
        payment_id: sessions[1].payment_id
      }
    },
    {
      event: EVENT.FULFILLED_ORDER,
      body: {
        order_id: sessions[1].order_id,
        shipment_id: sessions[1].shipment_id
      }
    }
  ];

  try {
    await sendMessage(sessions[0].order_id, interest[0]);
    await sendMessage(sessions[1].order_id, noise[0]);
    await sendMessage(sessions[0].order_id, interest[1]);
    await sendMessage(sessions[1].order_id, noise[1]);
    await sendMessage(sessions[0].order_id, interest[2]);
    await sendMessage(sessions[1].order_id, noise[1]);

    await receiveMessages(sessions[0].order_id);
  } catch (error) {
    console.log(error);
  } finally {
    await close();
  }
}

async function sendMessage(
  sessionId: string,
  content: { event: string; body: Object }
) {
  const client = await authenticate();
  const sender = client.createSender(QUEUE.ORDER_PROCESS);
  const { event, body } = content;

  const message = {
    subject: event,
    body,
    sessionId
  };

  await sender.sendMessages(message);
}

async function receiveMessages(sessionId: string) {
  const client = await authenticate();
  const receiver = await client.acceptSession(QUEUE.ORDER_PROCESS, sessionId);

  receiver.subscribe({
    processMessage,
    processError
  });

  await sleep(10_000);
  await receiver.close();
}

async function processMessage(message: ServiceBusMessage) {
  console.log(
    `Received: ${message.sessionId} - ${JSON.stringify(message.body)}`
  );
}

async function processError(args: ProcessErrorArgs) {
  console.log(
    `Error occurred with ${args.entityPath} within ${args.fullyQualifiedNamespace}: ${args.error}`
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main();
