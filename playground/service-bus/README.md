# Azure Service Bus

## How to Run

1. Create Service Bus namespace in the Standard tier or higher.
2. Save the host name into `.env`.
3. Create the following queues.
   1. `order_process` - must be session-enabled.
   2. `payment_webhook`
4. Create a topic called `customer_created`.
5. Create the following subscriptions for `customer_created`.
   1. `orisonx` — SQL Filter: `sys.Label = 'Checkout' OR sys.Label = 'Quiz'`.
   2. `shopify` — Correlation: `Label = Shopify`.
6. Run the tests inside `__tests__` to explore features. For long-running session listeners, start the Node.js processes manually.

## Features

Each feature corresponds to a test or script, allowing you to observe the behavior directly in Azure Portal.

### Queues

Refer to [`__tests__/queue.test.ts`](./__tests__/queue.test.ts), and the `payment_webhook` queue at Azure Portal

<table>
   <thead>
      <tr>
         <th>Feature</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>Send Messages</td>
         <td>Sends a batch of messages to the queue.</td>
      </tr>
      <tr>
         <td>Peek Messages</td>
         <td>Previews a batch of messages.</td>
      </tr>
      <tr>
         <td>Receive & Delete</td>
         <td>Removes message from queue.</td>
      </tr>
      <tr>
         <td>Receive & Complete</td>
         <td>Removes message from queue.</td>
      </tr>
      <tr>
         <td>Receive & Abandon</td>
         <td>Message remains active.</td>
      </tr>
      <tr>
         <td>Receive & Dead-Letter</td>
         <td>Moves messages to DLQ.</td>
      </tr>
      <tr>
         <td>Defer Message</td>
         <td>
            Marks message as <b>Deferred</b>. Deferred messages remain in the main queue along with all other active messages, but they can no longer be received using the regular receive operations. To retrieve a deferred message, its owner is responsible for remembering the <b>sequence number</b> as it defers it.
         </td>
      </tr>
      <tr>
         <td>Receive Deferred Message</td>
         <td>Requires sequence number, and will then remove the message from queue.</td>
      </tr>
   </tbody>
</table>

### Sessions

<table>
   <thead>
      <tr>
         <th>Scenario</th>
         <th>Command/Test</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>Receive from one known session</td>
         <td><code>npx tsx ./src/entities/queues/session</code></td>
         <td>Listens for messages from a single session ID for 10 sec.</td>
      </tr>
      <tr>
         <td>Receive from all available sessions</td>
         <td>
            <ol>
               <li>
                  Populate sample session messages — <code>__tests__/session-setup.test.ts > should prefill service bus</code>
               </li>
               <li>Start the app — <code>npx tsx ./src/entities/queues/all-sessions</code></li>
               <li>
                  Run <code>__tests__/session-setup.test.ts > should add a message, run this before idle timeout of the first iteration</code> before the first set of receivers are closed.
               </li>
            </ol>
         </td>
         <td>
            Two workers process messages per session for 30 seconds. The third step is used to demonstrate processing order, and not just the queuing order.
         </td>
      </tr>
   </tbody>
</table>

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

#### Intro to Sessions

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

### Topics

Refer to [`__tests__/topic.test.ts`](./__tests__/topic.test.ts), and the subscriptions for the `customer_created` topic at Azure Portal

<table>
   <thead>
      <tr>
         <th>Feature</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td>Send Messages</td>
         <td>Sends a batch of messages that are filtered by the subscribers.</td>
      </tr>
      <tr>
         <td>Receive & Delete</td>
         <td>Removes message from subscription.</td>
      </tr>
   </tbody>
</table>
