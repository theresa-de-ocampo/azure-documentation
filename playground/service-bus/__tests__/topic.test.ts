import { TOPIC } from "../src/constants.js";
import serviceBus from "../src/index.js";

describe("Topics", () => {
  it("should send messages", async () => {
    const customers = [
      {
        subject: "Checkout",
        body: {
          first_name: "Teriz",
          last_name: "De Ocampo"
        }
      },
      {
        subject: "Shopify",
        body: {
          first_name: "Fe",
          last_name: "Nable"
        }
      },
      {
        subject: "Quiz",
        body: {
          first_name: "David",
          last_name: "Mailer"
        }
      },
      {
        subject: "Shopify",
        body: {
          first_name: "Kate",
          last_name: "Dianzon"
        }
      }
    ];

    await serviceBus.sendMesssages(TOPIC.CUSTOMER_CREATED, customers);
  });

  it("should receive and delete messages", async () => {
    const messages = await serviceBus.topics.receiveMessages.receiveAndDelete(
      TOPIC.CUSTOMER_CREATED,
      "shopify",
      2
    );

    for (const message of messages) {
      expect(message.messageId).toBeDefined();
      expect(message.body).toBeDefined();
    }
  });
});
