import { QUEUE } from "../src/constants.js";
import { queues } from "../src/index.js";

describe("Queues", () => {
  it("should send messages", async () => {
    const payments = [
      {
        body: { id: "tr_1" }
      },
      {
        body: { id: "tr_2" }
      },
      {
        body: { id: "tr_3" }
      },
      {
        body: { id: "tr_4" }
      },
      {
        body: { id: "tr_5" }
      }
    ];

    await queues.sendMesssages(QUEUE.PAMENT_WEBHOOK, payments);
  });

  it("should receive, and delete messages", async () => {
    const messages = await queues.receiveMessages.receiveAndDelete(
      QUEUE.PAMENT_WEBHOOK,
      2
    );

    for (const message of messages) {
      expect(message.messageId).toBeDefined();
      expect(message.body).toBeDefined();
    }
  });

  it("should only peek messages", async () => {
    const messages = await queues.receiveMessages.peek(QUEUE.PAMENT_WEBHOOK, 2);

    for (const message of messages) {
      expect(message.messageId).toBeDefined();
      expect(message.body).toBeDefined();
    }
  });
});
