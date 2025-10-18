const enum QUEUE {
  PAMENT_WEBHOOK = "payment_webhook",
  ORDER_PROCESS = "order_process"
}

const enum TOPIC {
  ORDER = "order"
}

const enum SETTLEMENT {
  ABANDON,
  COMPLETE,
  DEAD_LETTER,
  DEFER
}

const enum EVENT {
  PLACED_ORDER = "placed_order",
  PAYMENT_PAID = "payment_paid",
  CANCELLED_ORDER = "cancelled_order",
  FULFILLED_ORDER = "fulfilled_order"
}

export { QUEUE, TOPIC, SETTLEMENT, EVENT };
