const express = require('express');
const app = express();
const PORT = 3999;

app.use(express.json());

// In-memory registry: service name -> base URL
const registry = new Map();

app.post('/register', (req, res) => {
  const { name, port, url } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const baseUrl = url || `http://localhost:${port}`;
  if (!url && port == null) return res.status(400).json({ error: 'port or url required' });
  registry.set(name, baseUrl);
  console.log(`Registered: ${name} -> ${baseUrl}`);
  res.status(201).json({ name, url: baseUrl });
});

app.get('/resolve/:name', (req, res) => {
  const url = registry.get(req.params.name);
  if (!url) return res.status(404).json({ error: 'Service not found', name: req.params.name });
  res.json({ url });
});

app.get('/services', (req, res) => {
  const services = Object.fromEntries(registry);
  res.json(services);
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'discovery' }));

app.listen(PORT, () => {
  console.log(`Discovery service listening on http://localhost:${PORT}`);
});
