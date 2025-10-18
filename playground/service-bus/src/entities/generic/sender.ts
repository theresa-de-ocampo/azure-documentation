import { authenticate } from "../../client.js";
import { QUEUE, TOPIC } from "../../constants.js";

async function sendMesssages(
  queueOrTopicName: QUEUE | TOPIC,
  messages: { subject?: string; body: unknown }[]
) {
  const client = await authenticate();
  const sender = client.createSender(queueOrTopicName);
  let batch = await sender.createMessageBatch();

  for (let i = 0; i < messages.length; i++) {
    if (!batch.tryAddMessage(messages[i])) {
      await sender.sendMessages(batch);
      batch = await sender.createMessageBatch();

      if (!batch.tryAddMessage(messages[i])) {
        throw new Error("Message to big to fit in a batch.");
      }
    }
  }

  await sender.sendMessages(batch);

  const entity = (<any>Object.values(QUEUE)).includes(queueOrTopicName)
    ? "queue"
    : "topic";

  console.log(`Sent message(s) to the ${entity}: ${queueOrTopicName}`);
}

export default sendMesssages;
