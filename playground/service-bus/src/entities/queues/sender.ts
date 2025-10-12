import { createSender } from "../../client.js";

async function sendMesssages(queueName: string, messages: { body: unknown }[]) {
  const sender = await createSender(queueName);
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
  console.log(`Sent message(s) to the queue: ${queueName}`);
}

export default sendMesssages;
