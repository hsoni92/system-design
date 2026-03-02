/**
 * DynamoDB Service – NoSQL + consumed capacity
 *
 * INTERVIEW CONCEPTS:
 * - RCU/WCU (Read/Write Capacity Units): Provisioned mode consumes capacity; on-demand bills per request.
 * - Partition key (userId): Critical for scale – choose keys that distribute load; hot partitions cause throttling.
 * - Consumed capacity: Response includes ConsumedCapacity for cost/throttling discussion.
 * - Throttling (429): When capacity exceeded; retry with exponential backoff.
 *
 * Table: partition key userId (string). Table must exist (create via AWS console or IaC).
 */

const crypto = require('crypto');
const { DynamoDBDocumentClient, PutCommand, QueryCommand } = require('@aws-sdk/lib-dynamodb');
const { getDynamoDBClient } = require('../config/awsConfig');

const TABLE_NAME = process.env.DYNAMODB_TABLE || 'playground-items';
const PARTITION_KEY = 'userId';

let docClient = null;

function getDocClient() {
  if (!docClient) {
    const client = getDynamoDBClient();
    docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return docClient;
}

/**
 * Insert a document. Returns item and consumed capacity (for interview parity with Cosmos RUs).
 */
async function createItem(userId, document) {
  const id = crypto.randomUUID();
  const item = { userId, id, ...document };
  const client = getDocClient();
  const response = await client.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: item,
      ReturnConsumedCapacity: 'TOTAL',
    })
  );
  const consumedCapacity = response.ConsumedCapacity
    ? (response.ConsumedCapacity.CapacityUnits || response.ConsumedCapacity.ReadCapacityUnits)
    : undefined;
  return { item, consumedCapacity };
}

/**
 * Query by partition key (efficient – single partition). Returns items + consumed capacity.
 */
async function getItemsByUserId(userId) {
  const client = getDocClient();
  const response = await client.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: '#pk = :userId',
      ExpressionAttributeNames: { '#pk': PARTITION_KEY },
      ExpressionAttributeValues: { ':userId': userId },
      ReturnConsumedCapacity: 'TOTAL',
    })
  );
  const items = response.Items || [];
  const consumedCapacity = response.ConsumedCapacity
    ? (response.ConsumedCapacity.CapacityUnits || response.ConsumedCapacity.ReadCapacityUnits)
    : undefined;
  return { items, consumedCapacity };
}

module.exports = { createItem, getItemsByUserId };
