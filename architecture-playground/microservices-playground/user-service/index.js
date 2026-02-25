const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Own data store — only this service reads/writes users (bounded context: User)
const users = new Map();
let nextId = 1;

app.get('/users', (req, res) => {
  const list = Array.from(users.values());
  res.json(list);
});

app.get('/users/:id', (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const id = String(nextId++);
  const user = { id, name };
  users.set(id, user);
  res.status(201).json(user);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'user-service' }));

const DISCOVERY_URL = 'http://localhost:3999';
async function registerWithDiscovery(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${DISCOVERY_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'user-service', port: PORT }),
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
  console.log(`User service listening on http://localhost:${PORT}`);
  registerWithDiscovery();
});
