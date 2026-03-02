/**
 * SQS Service – Reliable async messaging
 *
 * INTERVIEW CONCEPTS:
 * - At-least-once delivery: Messages may be delivered more than once; consumers should be idempotent.
 * - Visibility timeout: Message is hidden after receive until deleted or timeout; then redelivered.
 * - Dead-letter queue (DLQ): Failed messages can be sent to DLQ after max receives.
 * - Long polling: ReceiveMessage WaitTimeSeconds reduces empty receives and cost.
 *
 * Queue URL from env (SQS_QUEUE_URL).
 */

const {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} = require('@aws-sdk/client-sqs');
const { getSQSClient } = require('../config/awsConfig');

const QUEUE_URL = process.env.SQS_QUEUE_URL;

function getClient() {
  if (!QUEUE_URL) throw new Error('SQS_QUEUE_URL is not set');
  return getSQSClient();
}

/**
 * Send a JSON message to the queue.
 */
async function sendMessage(body) {
  const client = getClient();
  const payload = typeof body === 'object' ? JSON.stringify(body) : JSON.stringify({ value: body });
  await client.send(
    new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: payload,
    })
  );
}

/**
 * Receive one message (long poll 5s). Returns { message, receiptHandle } or { message: null }.
 */
async function receiveOneMessage() {
  const client = getClient();
  const response = await client.send(
    new ReceiveMessageCommand({
      QueueUrl: QUEUE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
  );
  const msg = response.Messages && response.Messages[0];
  if (!msg) return { message: null, receiptHandle: null };
  let body = msg.Body;
  try {
    body = JSON.parse(msg.Body);
  } catch (_) {}
  return { message: body, receiptHandle: msg.ReceiptHandle };
}

/**
 * Delete a message after successful processing (using receipt handle from receive).
 */
async function deleteMessage(receiptHandle) {
  if (!receiptHandle) return;
  const client = getClient();
  await client.send(
    new DeleteMessageCommand({
      QueueUrl: QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
  );
}

module.exports = { sendMessage, receiveOneMessage, deleteMessage };
