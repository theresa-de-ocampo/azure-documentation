const enum QUEUE {
  PAMENT_WEBHOOK = "payment_webhook"
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

export { QUEUE, TOPIC, SETTLEMENT };
