const express = require('express');
const app = express();
const PORT = 3002;

app.use(express.json());

// Own data store — only this service reads/writes orders (bounded context: Order)
const orders = new Map();
let nextId = 1;

const USER_SERVICE_URL = 'http://localhost:3001';

async function userExists(userId) {
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
  const AUDIT_SERVICE_URL = 'http://localhost:3003';
  fetch(`${AUDIT_SERVICE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'OrderPlaced', payload: order }),
  }).catch(() => {}); // fire-and-forget: ignore errors

  res.status(201).json(order);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'order-service' }));

app.listen(PORT, () => {
  console.log(`Order service listening on http://localhost:${PORT}`);
});
