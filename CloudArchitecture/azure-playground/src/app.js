/**
 * Express app – routes and middleware wiring
 *
 * Structure: health (no auth) + Azure service routes (optional auth via middleware).
 */

const express = require('express');
const { initAppInsights } = require('./config/appInsights');
const healthRoutes = require('./routes/health.routes');
const sqlRoutes = require('./routes/sql.routes');
const cosmosRoutes = require('./routes/cosmos.routes');
const serviceBusRoutes = require('./routes/serviceBus.routes');
const keyVaultRoutes = require('./routes/keyVault.routes');
const { authMiddleware } = require('./middleware/auth.middleware');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Start Application Insights as early as possible to capture all requests
initAppInsights();

// ---- Public (no auth) ----
app.use('/health', healthRoutes);

// ---- Protected routes (JWT validation when SKIP_AUTH is false) ----
app.use('/sql', authMiddleware, sqlRoutes);
app.use('/cosmos', authMiddleware, cosmosRoutes);
app.use('/queue', authMiddleware, serviceBusRoutes);
app.use('/secret', authMiddleware, keyVaultRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler – log to App Insights and return safe response
app.use((err, req, res, next) => {
  const { trackException } = require('./config/appInsights');
  trackException(err, { path: req.path, method: req.method });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
