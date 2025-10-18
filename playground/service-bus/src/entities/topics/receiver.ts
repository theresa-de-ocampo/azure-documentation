import { authenticate } from "../../client.js";
import { TOPIC } from "../../constants.js";

async function receiveAndDelete(
  topicName: TOPIC,
  subscriptionName: string,
  messageCount: number
) {
  const client = await authenticate();
  const receiver = client.createReceiver(topicName, subscriptionName, {
    receiveMode: "receiveAndDelete"
  });

  const messages = await receiver.receiveMessages(messageCount);

  return messages.map(({ messageId, body }) => ({
    messageId,
    body
  }));
}

export default {
  receiveAndDelete
};
