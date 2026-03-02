/**
 * CloudWatch – optional custom metrics
 *
 * INTERVIEW: "How do you handle observability in production?"
 * We use CloudWatch for custom metrics (PutMetricData). When CLOUDWATCH_NAMESPACE is set:
 * - trackEvent: emit a count metric for business/operational events
 * - trackException: emit a count metric for errors
 *
 * Concepts: Namespaces, dimensions, alarms, dashboards, X-Ray for tracing.
 */

const { PutMetricDataCommand } = require('@aws-sdk/client-cloudwatch');
const { getCloudWatchClient } = require('./awsConfig');

const NAMESPACE = process.env.CLOUDWATCH_NAMESPACE;
let isInitialized = false;

function isEnabled() {
  return !!NAMESPACE;
}

function initCloudWatch() {
  if (!NAMESPACE) {
    console.warn('[CloudWatch] No CLOUDWATCH_NAMESPACE – telemetry disabled');
    return null;
  }
  isInitialized = true;
  return getCloudWatchClient();
}

/**
 * Track a custom event (business or operational KPI).
 * Emits a metric count in the configured namespace.
 */
async function trackEvent(name, properties = {}) {
  if (!isEnabled()) return;
  try {
    const client = getCloudWatchClient();
    await client.send(
      new PutMetricDataCommand({
        Namespace: NAMESPACE,
        MetricData: [
          {
            MetricName: name,
            Value: 1,
            Unit: 'Count',
            Timestamp: new Date(),
            Dimensions: Object.entries(properties).map(([k, v]) => ({
              Name: String(k),
              Value: String(v),
            })),
          },
        ],
      })
    );
  } catch (err) {
    console.warn('[CloudWatch] trackEvent failed:', err.message);
  }
}

/**
 * Track an exception for alerting and debugging.
 */
async function trackException(error, properties = {}) {
  if (!isEnabled()) return;
  try {
    const client = getCloudWatchClient();
    await client.send(
      new PutMetricDataCommand({
        Namespace: NAMESPACE,
        MetricData: [
          {
            MetricName: 'Exception',
            Value: 1,
            Unit: 'Count',
            Timestamp: new Date(),
            Dimensions: [
              { Name: 'ErrorName', Value: error.name || 'Error' },
              ...Object.entries(properties).map(([k, v]) => ({
                Name: String(k),
                Value: String(v),
              })),
            ],
          },
        ],
      })
    );
  } catch (err) {
    console.warn('[CloudWatch] trackException failed:', err.message);
  }
}

function getClient() {
  if (!isInitialized) initCloudWatch();
  return isEnabled() ? getCloudWatchClient() : null;
}

module.exports = { initCloudWatch, getClient, trackEvent, trackException, isEnabled };
