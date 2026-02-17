/**
 * Cosmos DB Service – NoSQL + RU model
 *
 * INTERVIEW CONCEPTS:
 * - RU/s (Request Units): Every operation consumes RUs; you provision RU/s and get throttled (429) when exceeded.
 * - Partition key (/userId): Critical for scale – choose keys that distribute load; hot partitions cause throttling.
 * - Multi-region writes: Cosmos supports global distribution and multi-master.
 * - Automatic indexing: By default all fields are indexed; you can customize to save RUs.
 *
 * Database: playground, Container: items, Partition Key: /userId
 */

const { CosmosClient } = require('@azure/cosmos');

let client = null;
let container = null;

const DB_NAME = 'playground';
const CONTAINER_NAME = 'items';
const PARTITION_KEY = '/userId';

function getClient() {
  if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
    throw new Error('COSMOS_ENDPOINT and COSMOS_KEY are required');
  }
  if (!client) {
    client = new CosmosClient({ endpoint: process.env.COSMOS_ENDPOINT, key: process.env.COSMOS_KEY });
  }
  return client;
}

async function getContainer() {
  if (!container) {
    const c = getClient();
    const { database } = await c.databases.createIfNotExists({ id: DB_NAME });
    const { container: cont } = await database.containers.createIfNotExists({
      id: CONTAINER_NAME,
      partitionKey: { paths: [PARTITION_KEY] },
    });
    container = cont;
  }
  return container;
}

/**
 * Insert a document. Cosmos returns requestCharge in response headers – we expose it for learning.
 */
async function createItem(userId, document) {
  const cont = await getContainer();
  const item = { userId, ...document };
  const { resource, requestCharge } = await cont.items.create(item);
  return { item: resource, requestCharge };
}

/**
 * Query by partition key (efficient – single partition). Returns items + requestCharge.
 */
async function getItemsByUserId(userId) {
  const cont = await getContainer();
  const querySpec = {
    query: 'SELECT * FROM c WHERE c.userId = @userId',
    parameters: [{ name: '@userId', value: userId }],
  };
  const { resources, requestCharge } = await cont.items.query(querySpec).fetchAll();
  return { items: resources, requestCharge };
}

module.exports = { createItem, getItemsByUserId };
