# Azure Service BUS

TODO.

## Continuously read through all available sessions

```
Listening for available sessions...
Session A was accepted by Worker 0
Received placed_order message from session A
Session B was accepted by Worker 1
Received placed_order message from session B
Received payment_paid message from session A
Received payment_paid message from session B
Received fulfilled_order message from session A
Received fulfilled_order message from session B
Session A was closed by Worker 0.
Session B was closed by Worker 1.
Session C was accepted by Worker 0
Received placed_order message from session C
Received payment_paid message from session C
Received fulfilled_order message from session C
Session C was closed by Worker 0.
[Worker 1] No available sessions, sleeping for 5000
[Worker 0] No available sessions, sleeping for 5000
[Worker 1] No available sessions, sleeping for 5000
CTRL + C received
```
