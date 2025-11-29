# Azure Service Bus

## How to Run

1. Create Service Bus namespace in the Standard tier or higher.
2. Save the host name into `.env`.
3. Create the following queues.
   1. `order_process` - must be session-enabled.
   2. `payment_webhook`
4. Create a topic called `customer_created`.
5. Crate the following subscriptions for `customer_created`.
   1. `orisonx` with an SQL filter of `sys.Label = 'Checkout' OR sys.Label = 'Quiz'`.
   2. `shopify` with a correlation filter of Label must match `shopify`.
6. The features on the next section are demonstrated by running the appropriate tests at `__tests__`. To demonstrate long-running polls, there are no associated tests and the Node.js application will have to be started.

## Features

### Queues

1. Send Messages (Simple) - `__tests__` > `queue.test.ts` > `should send messages`
2. Receive Messages (Simple)
   1. Peek - `__tests__` > `queue.test.ts` > `should only peek messages`
   2. Receive and Delete - send a few sample messages first, then `__tests__` > `queue.test.ts` > `should receive, and delete messages`
   3. Receive and Complete - send a sample message first, then `__tests__` > `queue.test.ts` > `should complete the message`. Monitor the queue from the portal, the message sent should no longer be there.
   4. Receive and Abandon - send a sample message first, then `__tests__` > `queue.test.ts` > `should abandon the message`. Monitor the queue from the portal, the message sent should still be there.
   5. Receive and Dead-Letter - send a sample message first, then `__tests__` > `queue.test.ts` > `should dead letter the message`
   6. Receive and Defer - send a sample message first, then `__tests__` > `queue.test.ts` > `should defer letter the message`. Monitor the queue from the portal, the message should still be there with a state of **Deferred**. Deferred messages remain in the main queue along with all other active messages, but they can no longer be received using the regular receive operations. To retrieve a deferred message, its owner is responsible for remembering the **sequence number** as it defers it.
   7. Recieve Deferred Message - use the message from the previous step, and update the value of the `sequenceNumber` variable at `__tests__` > `queue.test.ts` > `should receive deferred message`. Monitor the queue from the portal, the deferred message should no longer be there.
3. Receive Messages from a known session - run `npx tsx ./src/entities/queues/session`. This app listens for messages from a particular session ID for 10 seconds. It should only receive 3 messages of interest, the rest of the messages from a different session will be left at the queue. Read more <a href="#session-states">about session states</a>.
4. Receive Messages from all available sessions - set-up a few sample messages using `tests` > `session-setup.test.ts` > `should prefill service bus`. Run `npx tsx ./src/entities/queues/all-sessions`. This app has 2 workers that listens for 30 seconds for each session. To demonstrate that workers processes messages in order and not just the queuing order, run `tests` > `session-setup.test.ts` > `should add a message, run this before idle timeout of the first iteration` before the first set of receivers are closed. Refer to the <a href="#continuously-read-through-all-available-sessions">section below</a> to see a sample output.

### Intro to Sessions

On session-aware queues or subscriptions, sessions come into existence when there's at least one message with the session ID. Once a session exists, there's no defined time or API for when the session expires or disappears.

Theoretically, a message can be received for a message session today, the next message in a year's time, and if the session ID matches, the session is the same from the Service Bus perspective.

Typically, however, an application defines where a set of related messages starts and ends. Service Bus doesn't impose any specific rules. For instance, your application could set the **Label** property for the first message as **start**, for intermediate messages as **content**, and for the last message to **end**.

#### [Session States](https://learn.microsoft.com/en-us/azure/service-bus-messaging/message-sessions#message-session-state)

When workflows are processed in high-scale, high-availability cloud systems, the workflow handler associated with a particular session must be able to recover from unexpected failures and can resume partially completed work on a different process or machine from where the work began.

The session state facility enables an application-defined annotation of a message session inside the broker, so that the recorded processing state relative to that session becomes instantly available when the session is acquired by a new processor.

From the Service Bus perspective, the message state is an opaque binary object that can hold data of size one message, which is 256KB for Standard and 100MB for Premium. The processing state relative to a session can be held inside the session state, or the session state can point to some storage location or database record that holds such information.

The methods for managing the state (`SetState` and `GetState`) can be found on the session receiver object. A session state that previously had no session state returns a `null` reference for `GetState`. The previously set session state can be cleared by passing `null` to the `SetState` method on the receiver.

Session state remains as long as it isn't cleared up (returning `null`), even if all messages in session are consumed.

The session state held in queue or in a subscription counts towards that entity's storage quota. When the application is finished with a session, it's therefore recommended for the application to clean up its retained state to avoid external management cost.

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

### Topics

1. Send Messages - `__tests__` > `topic.test.ts` > `should send messages`. Monitor the subscriptions, only filtered messages should come through.
2. Receive Messages - `__tests__` > `topic.test.ts` > `should receive and delete messages`
