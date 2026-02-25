const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Own data store — only this service reads/writes orders (bounded context: Order)
const orders = new Map();
let nextId = 1;

// Resolved from discovery on startup
let USER_SERVICE_URL = null;
let AUDIT_SERVICE_URL = null;

async function userExists(userId) {
  if (!USER_SERVICE_URL) return false;
  const res = await fetch(`${USER_SERVICE_URL}/users/${userId}`);
  return res.ok;
}

app.get('/orders', (req, res) => {
  const list = Array.from(orders.values());
  res.json(list);
});

app.get('/orders/:id', (req, res) => {
  const order = orders.get(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.post('/orders', async (req, res) => {
  if (!USER_SERVICE_URL) return res.status(503).json({ error: 'Service starting up' });
  const { userId, product, quantity } = req.body;
  if (!userId || !product || quantity == null)
    return res.status(400).json({ error: 'userId, product, quantity required' });

  // Sync service-to-service: validate user in the service that owns user data
  const exists = await userExists(userId);
  if (!exists) return res.status(400).json({ error: 'User not found' });

  const id = String(nextId++);
  const order = { id, userId, product, quantity, createdAt: new Date().toISOString() };
  orders.set(id, order);

  // Choreography-style: emit event; don't wait. Audit service is a subscriber.
  if (AUDIT_SERVICE_URL) {
  fetch(`${AUDIT_SERVICE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'OrderPlaced', payload: order }),
  }).catch(() => {}); // fire-and-forget: ignore errors
  }

  res.status(201).json(order);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));

const DISCOVERY_URL = 'http://localhost:3999';
async function registerWithDiscovery(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${DISCOVERY_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'order-service', port: PORT }),
      });
      if (res.ok) return;
    } catch (e) {
      if (i === retries - 1) {
        console.error('Failed to register with discovery:', e.message);
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  console.error('Failed to register with discovery after retries');
  process.exit(1);
}
async function resolveService(name, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${DISCOVERY_URL}/resolve/${name}`);
      if (res.ok) {
        const { url } = await res.json();
        return url;
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

app.listen(PORT, async () => {
  console.log(`Order service listening on http://localhost:${PORT}`);
  await registerWithDiscovery();
  USER_SERVICE_URL = await resolveService('user-service');
  AUDIT_SERVICE_URL = await resolveService('audit-service');
  if (!USER_SERVICE_URL || !AUDIT_SERVICE_URL) {
    console.error('Failed to resolve user-service or audit-service from discovery');
    process.exit(1);
  }
  console.log('Resolved user-service and audit-service from discovery');
});
