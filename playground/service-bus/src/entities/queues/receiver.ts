import { authenticate } from "../../client.js";
import { QUEUE, SETTLEMENT } from "../../constants.js";
import Long from "long";

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

async function receiveAndAck(queueName: QUEUE, ackMode: SETTLEMENT) {
  const client = await authenticate();
  const receiver = client.createReceiver(queueName, {
    receiveMode: "peekLock"
  });

  const [message] = await receiver.receiveMessages(1);

  switch (ackMode) {
    case SETTLEMENT.COMPLETE:
      await receiver.completeMessage(message);
      break;
    case SETTLEMENT.ABANDON:
      await receiver.abandonMessage(message);
      break;
    case SETTLEMENT.DEAD_LETTER:
      await receiver.deadLetterMessage(message);
      break;
    case SETTLEMENT.DEFER:
      await receiver.deferMessage(message, { deferred_by: "Teriz" });
      console.log(message.sequenceNumber);
      break;
    default:
      console.log("Unknown Mode");
  }
}

async function receiveDeferredMessage(
  queueName: QUEUE,
  sequenceNumber: number,
  settle = true
) {
  const client = await authenticate();
  const receiver = client.createReceiver(queueName, {
    receiveMode: "peekLock"
  });

  const [message] = await receiver.receiveDeferredMessages(
    Long.fromNumber(sequenceNumber)
  );

  if (settle) {
    // Delete from the queue
    await receiver.completeMessage(message);
  }

  return message;
}

export default {
  receiveAndDelete,
  peek,
  receiveAndAck,
  receiveDeferredMessage
};
