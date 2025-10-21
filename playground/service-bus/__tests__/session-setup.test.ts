import { QUEUE, EVENT } from "../src/constants.js";
import { initialEvents } from "./data.js";
import serviceBus from "../src/index.js";

describe("Sessions", () => {
  it("should prefill service bus", async () => {
    await serviceBus.sendMesssages(QUEUE.ORDER_PROCESS, initialEvents);
  });

  it("should add a message, run this before idle timeout of the first iteration", async () => {
    const followUpEvent = [
      {
        subject: EVENT.FULFILLED_ORDER,
        body: {
          orderId: "some-order-id",
          shipmentId: "some-shipment-id"
        },
        sessionId: "B"
      }
    ];
    await serviceBus.sendMesssages(QUEUE.ORDER_PROCESS, followUpEvent);
  });
});
