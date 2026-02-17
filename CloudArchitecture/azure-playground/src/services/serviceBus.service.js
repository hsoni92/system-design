/**
 * Service Bus Service – Reliable async messaging
 *
 * INTERVIEW CONCEPTS:
 * - Peek-lock vs receive-and-delete: Peek-lock = message hidden until complete/abandon; receive-and-delete = gone immediately.
 * - Lock duration: Message is locked for a period; if not completed, it becomes visible again (or goes to dead-letter).
 * - Dead-letter queue: Failed/unprocessable messages can be moved to DLQ for inspection/retry.
 * - Idempotent processing: Consumers should handle duplicate delivery (same message might be redelivered).
 *
 * Queue: playground-queue
 */

const { ServiceBusClient } = require('@azure/service-bus');

const QUEUE_NAME = 'playground-queue';

let sbClient = null;

function getClient() {
  const connStr = process.env.SERVICE_BUS_CONNECTION_STRING;
  if (!connStr) throw new Error('SERVICE_BUS_CONNECTION_STRING is not set');
  if (!sbClient) {
    sbClient = new ServiceBusClient(connStr);
  }
  return sbClient;
}

/**
 * Send a JSON message to the queue.
 */
async function sendMessage(body) {
  const client = getClient();
  const sender = client.createSender(QUEUE_NAME);
  const message = { body: typeof body === 'object' ? body : { value: body } };
  await sender.sendMessages(message);
  await sender.close();
}

/**
 * Receive one message in peek-lock mode. Caller must complete or abandon.
 * Returns { message, receiver } so route can call receiver.completeMessage(message) after processing.
 */
async function receiveOneMessage() {
  const client = getClient();
  const receiver = client.createReceiver(QUEUE_NAME, { receiveMode: 'peekLock' });
  const messages = await receiver.receiveMessages(1, { maxWaitTimeInMs: 5000 });
  const message = messages[0] || null;
  return { message, receiver };
}

/**
 * Complete a message (remove from queue). Call after successful processing.
 */
async function completeMessage(receiver, message) {
  await receiver.completeMessage(message);
  await receiver.close();
}

/**
 * Abandon a message (release lock so it can be redelivered).
 */
async function abandonMessage(receiver, message) {
  await receiver.abandonMessage(message);
  await receiver.close();
}

module.exports = { sendMessage, receiveOneMessage, completeMessage, abandonMessage };
