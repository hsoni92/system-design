const express = require('express');
const app = express();
const PORT = 3003;

app.use(express.json());

// Own data store — only this service reads/writes events (subscriber in choreography-style)
const events = [];
let nextId = 1;

app.get('/events', (req, res) => {
  res.json(events);
});

app.post('/events', (req, res) => {
  const { type, payload } = req.body;
  if (!type) return res.status(400).json({ error: 'type required' });
  const event = { id: String(nextId++), type, payload, receivedAt: new Date().toISOString() };
  events.push(event);
  res.status(201).json(event);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'audit-service' }));

const DISCOVERY_URL = 'http://localhost:3999';
async function registerWithDiscovery(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${DISCOVERY_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'audit-service', port: PORT }),
      });
      if (res.ok) {
        console.log('Registered with discovery');
        return;
      }
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

app.listen(PORT, () => {
  console.log(`Audit service listening on http://localhost:${PORT}`);
  registerWithDiscovery();
});
