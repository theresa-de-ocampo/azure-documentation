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

const initialEvents = [
  {
    subject: EVENT.PLACED_ORDER,
    body: {
      orderId: session1.orderId
    },
    sessionId: "A"
  },
  {
    subject: EVENT.PAYMENT_PAID,
    body: {
      orderId: session1.orderId,
      paymentId: session1.paymentId
    },
    sessionId: "A"
  },
  {
    subject: EVENT.FULFILLED_ORDER,
    body: {
      orderId: session1.orderId,
      shipmentId: session1.shipmentId
    },
    sessionId: "A"
  },
  {
    subject: EVENT.PLACED_ORDER,
    body: {
      orderId: session2.orderId
    },
    sessionId: "B"
  },
  {
    subject: EVENT.PAYMENT_PAID,
    body: {
      orderId: session2.orderId,
      paymentId: session2.paymentId
    },
    sessionId: "B"
  },
  {
    subject: EVENT.PLACED_ORDER,
    body: {
      orderId: session3.orderId
    },
    sessionId: "C"
  },
  {
    subject: EVENT.PAYMENT_PAID,
    body: {
      orderId: session3.orderId,
      paymentId: session3.paymentId
    },
    sessionId: "C"
  },
  {
    subject: EVENT.FULFILLED_ORDER,
    body: {
      orderId: session3.orderId,
      shipmentId: session3.shipmentId
    },
    sessionId: "C"
  }
];

export { initialEvents };
