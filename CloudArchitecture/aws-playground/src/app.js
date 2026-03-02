/**
 * Express app – routes and middleware wiring
 *
 * Structure: health (no auth) + AWS service routes (optional auth via middleware).
 */

const express = require('express');
const { initCloudWatch } = require('./config/cloudWatch');
const healthRoutes = require('./routes/health.routes');
const rdsRoutes = require('./routes/rds.routes');
const dynamodbRoutes = require('./routes/dynamodb.routes');
const sqsRoutes = require('./routes/sqs.routes');
const secretRoutes = require('./routes/secret.routes');
const { authMiddleware } = require('./middleware/auth.middleware');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Optional CloudWatch metrics (no-op if CLOUDWATCH_NAMESPACE not set)
initCloudWatch();

// ---- Public (no auth) ----
app.use('/health', healthRoutes);

// ---- Protected routes (JWT validation when SKIP_AUTH is false) ----
app.use('/rds', authMiddleware, rdsRoutes);
app.use('/dynamodb', authMiddleware, dynamodbRoutes);
app.use('/queue', authMiddleware, sqsRoutes);
app.use('/secret', authMiddleware, secretRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler – log to CloudWatch (if enabled) and return safe response
app.use((err, req, res, next) => {
  const { trackException } = require('./config/cloudWatch');
  trackException(err, { path: req.path, method: req.method });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
