const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

// Single entry: route by path to the service that owns that bounded context (no body parsing — proxy streams through)

app.use(
  '/users',
  createProxyMiddleware({
    target: 'http://localhost:3001',
    changeOrigin: true,
    pathRewrite: { '^/users': '/users' },
  })
);

app.use(
  '/orders',
  createProxyMiddleware({
    target: 'http://localhost:3002',
    changeOrigin: true,
    pathRewrite: { '^/orders': '/orders' },
  })
);

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway' }));

app.listen(PORT, () => {
  console.log(`Gateway listening on http://localhost:${PORT}`);
});
