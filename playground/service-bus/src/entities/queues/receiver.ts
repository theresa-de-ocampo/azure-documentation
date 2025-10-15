import { authenticate } from "../../client.js";
import { QUEUE } from "../../constants.js";

async function receiveAndDelete(queueName: QUEUE, messageCount: number) {
  const client = await authenticate();
  const receiver = client.createReceiver(queueName, {
    receiveMode: "receiveAndDelete"
  });

  const messages = await receiver.receiveMessages(messageCount);

  return messages.map(({ messageId, body }) => ({
    messageId,
    body
  }));
}

async function peek(queueName: QUEUE, messageCount: number) {
  const client = await authenticate();
  const receiver = client.createReceiver(queueName, {
    receiveMode: "peekLock"
  });

  const messages = await receiver.receiveMessages(messageCount);

  return messages.map(({ messageId, body }) => ({
    messageId,
    body
  }));
}

// receiveAndAck

export default { receiveAndDelete, peek };
