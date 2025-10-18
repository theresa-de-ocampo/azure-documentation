enum QUEUE {
  PAMENT_WEBHOOK = "payment_webhook",
  ORDER_PROCESS = "order_process"
}

enum TOPIC {
  ORDER = "order"
}

enum SETTLEMENT {
  ABANDON,
  COMPLETE,
  DEAD_LETTER,
  DEFER
}

enum EVENT {
  PLACED_ORDER = "placed_order",
  PAYMENT_PAID = "payment_paid",
  FULFILLED_ORDER = "fulfilled_order"
}

export { QUEUE, TOPIC, SETTLEMENT, EVENT };
