/**
 * Application Insights – Telemetry Setup
 *
 * INTERVIEW: "How do you handle observability in production?"
 * We use Application Insights for:
 * - Request duration (automatic with express middleware)
 * - Custom events (e.g. SQL_INSERT_SUCCESS, COSMOS_QUERY_EXECUTED)
 * - Exceptions (auto-capture + manual trackException)
 *
 * Concepts: Distributed tracing, sampling, Log Analytics + KQL, alerts.
 */

const appInsights = require('applicationinsights');

let isInitialized = false;

function initAppInsights() {
  const connectionString = process.env.APPINSIGHTS_CONNECTION_STRING;
  if (!connectionString) {
    console.warn('[AppInsights] No APPINSIGHTS_CONNECTION_STRING – telemetry disabled');
    return null;
  }
  if (isInitialized) {
    return appInsights.defaultClient;
  }
  appInsights.setup(connectionString).setAutoCollectRequests(true).setAutoCollectExceptions(true).start();
  isInitialized = true;
  return appInsights.defaultClient;
}

function getClient() {
  if (!isInitialized) initAppInsights();
  return appInsights.defaultClient || null;
}

/**
 * Track a custom event (business or operational KPI).
 * Example: SQL_INSERT_SUCCESS, COSMOS_QUERY_EXECUTED, SERVICE_BUS_MESSAGE_SENT
 */
function trackEvent(name, properties = {}) {
  const client = getClient();
  if (client) client.trackEvent({ name, properties });
}

/**
 * Track an exception for alerting and debugging.
 */
function trackException(error, properties = {}) {
  const client = getClient();
  if (client) client.trackException({ exception: error, properties });
}

module.exports = { initAppInsights, getClient, trackEvent, trackException };
