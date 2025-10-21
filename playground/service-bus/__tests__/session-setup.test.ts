import { QUEUE } from "../src/constants.js";
import serviceBus from "../src/index.js";
import { sessionIDs, initialEvents } from "./data.js";
import { EVENT } from "../src/constants.js";

describe("Sessions", () => {
  it("should prefill service bus", async () => {
    console.table(sessionIDs);
    // console.dir(initialEvents, { depth: null });
    await serviceBus.sendMesssages(QUEUE.ORDER_PROCESS, initialEvents);
  });

  it("should add more messages, run this before idle timeout of the first iteration", async () => {
    const followUpEvent = [
      {
        subject: EVENT.FULFILLED_ORDER,
        body: {
          orderId: "62eccbb6-51cc-4937-8c1e-741851224483",
          shipmentId: "some-id"
        },
        sessionId: "62eccbb6-51cc-4937-8c1e-741851224483"
      }
    ];
    await serviceBus.sendMesssages(QUEUE.ORDER_PROCESS, followUpEvent);
  });
});
