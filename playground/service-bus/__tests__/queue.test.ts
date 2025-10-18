import { QUEUE, SETTLEMENT } from "../src/constants.js";
import serviceBus from "../src/index.js";

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

    await serviceBus.sendMesssages(QUEUE.PAMENT_WEBHOOK, payments);
  });

  it("should receive, and delete messages", async () => {
    const messages = await serviceBus.queues.receiveMessages.receiveAndDelete(
      QUEUE.PAMENT_WEBHOOK,
      2
    );

    for (const message of messages) {
      expect(message.messageId).toBeDefined();
      expect(message.body).toBeDefined();
    }
  });

  it("should only peek messages", async () => {
    const messages = await serviceBus.queues.receiveMessages.peek(
      QUEUE.PAMENT_WEBHOOK,
      2
    );

    for (const message of messages) {
      expect(message.messageId).toBeDefined();
      expect(message.body).toBeDefined();
    }
  });

  it("should complete the message", async () => {
    await serviceBus.queues.receiveMessages.receiveAndAck(
      QUEUE.PAMENT_WEBHOOK,
      SETTLEMENT.COMPLETE
    );
  });

  it("should abandon the message", async () => {
    await serviceBus.queues.receiveMessages.receiveAndAck(
      QUEUE.PAMENT_WEBHOOK,
      SETTLEMENT.ABANDON
    );
  });

  it("should defer the message", async () => {
    await serviceBus.queues.receiveMessages.receiveAndAck(
      QUEUE.PAMENT_WEBHOOK,
      SETTLEMENT.DEFER
    );
  });

  it("should receive deferred message", async () => {
    const sequenceNumber = 18;

    const message =
      await serviceBus.queues.receiveMessages.receiveDeferredMessage(
        QUEUE.PAMENT_WEBHOOK,
        sequenceNumber
      );

    expect(message.messageId).toBeDefined();
    expect(message.sequenceNumber?.toNumber()).toEqual(sequenceNumber);
    expect(message.body).toBeDefined();
  });

  it("should dead letter the message", async () => {
    await serviceBus.queues.receiveMessages.receiveAndAck(
      QUEUE.PAMENT_WEBHOOK,
      SETTLEMENT.DEAD_LETTER
    );
  });
});
