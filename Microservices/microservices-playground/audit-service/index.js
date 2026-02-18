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

app.listen(PORT, () => {
  console.log(`Audit service listening on http://localhost:${PORT}`);
});
