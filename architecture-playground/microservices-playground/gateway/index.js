const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;
const DISCOVERY_URL = 'http://localhost:3999';

async function waitForDiscovery(retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(`${DISCOVERY_URL}/health`);
      if (res.ok) return;
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error('Discovery service not available. Is it running on port 3999?');
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

async function start() {
  await waitForDiscovery();
  const userUrl = await resolveService('user-service');
  const orderUrl = await resolveService('order-service');
  const auditUrl = await resolveService('audit-service');
  if (!userUrl || !orderUrl || !auditUrl) {
    console.error('Failed to resolve all services from discovery. Ensure user, order, and audit services are running and registered.');
    process.exit(1);
  }

  // Single entry: route by path to the service that owns that bounded context (no body parsing — proxy streams through)
  app.use(
    '/users',
    createProxyMiddleware({
      target: userUrl,
      changeOrigin: true,
      pathRewrite: { '^/users': '/users' },
    })
  );
  app.use(
    '/orders',
    createProxyMiddleware({
      target: orderUrl,
      changeOrigin: true,
      pathRewrite: { '^/orders': '/orders' },
    })
  );
  app.use(
    '/events',
    createProxyMiddleware({
      target: auditUrl,
      changeOrigin: true,
      pathRewrite: { '^/events': '/events' },
    })
  );
  app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway' }));

  app.listen(PORT, () => {
    console.log(`Gateway listening on http://localhost:${PORT}`);
  });
}

start();
