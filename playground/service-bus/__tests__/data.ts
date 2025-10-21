import { EVENT } from "../src/constants.js";
import crypto from "node:crypto";

function generateSession() {
  return {
    orderId: crypto.randomUUID(),
    paymentId: crypto.randomUUID(),
    shipmentId: crypto.randomUUID()
  };
}

const session1 = generateSession();
const session2 = generateSession();
const session3 = generateSession();

const sessionIDs = {
  session1: session1.orderId,
  session2: session2.orderId,
  session3: session3.orderId
};

const initialEvents = [
  {
    subject: EVENT.PLACED_ORDER,
    body: {
      orderId: session1.orderId
    },
    sessionId: session1.orderId
  },
  {
    subject: EVENT.PAYMENT_PAID,
    body: {
      orderId: session1.orderId,
      paymentId: session1.paymentId
    },
    sessionId: session1.orderId
  },
  {
    subject: EVENT.FULFILLED_ORDER,
    body: {
      orderId: session1.orderId,
      shipmentId: session1.shipmentId
    },
    sessionId: session1.orderId
  },
  {
    subject: EVENT.PLACED_ORDER,
    body: {
      orderId: session2.orderId
    },
    sessionId: session2.orderId
  },
  {
    subject: EVENT.PAYMENT_PAID,
    body: {
      orderId: session2.orderId,
      paymentId: session2.paymentId
    },
    sessionId: session2.orderId
  },
  {
    subject: EVENT.PLACED_ORDER,
    body: {
      orderId: session3.orderId
    },
    sessionId: session3.orderId
  },
  {
    subject: EVENT.PAYMENT_PAID,
    body: {
      orderId: session3.orderId,
      paymentId: session3.paymentId
    },
    sessionId: session3.orderId
  },
  {
    subject: EVENT.FULFILLED_ORDER,
    body: {
      orderId: session3.orderId,
      shipmentId: session3.shipmentId
    },
    sessionId: session3.orderId
  }
];

const followUpEvent = [
  {
    subject: EVENT.FULFILLED_ORDER,
    body: {
      orderId: session2.orderId,
      shipmentId: session2.shipmentId
    }
  }
];

export { sessionIDs, initialEvents, followUpEvent };
