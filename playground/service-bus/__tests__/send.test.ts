import sendMesssages from "../src/entities/queues/sender.js";

describe("Queue > Sender", () => {
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

    await sendMesssages("payment_webhook", payments);
  });
});
