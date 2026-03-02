/**
 * AWS config – region and shared SDK client helpers
 *
 * INTERVIEW: "How does your app authenticate to AWS?"
 * We use the default credential provider chain (SDK v3), which tries:
 * 1. Environment variables (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY) – dev/CI
 * 2. IAM role – when running on EC2, ECS, Lambda
 * 3. Shared config/credentials file (~/.aws/credentials)
 *
 * Benefits: No hardcoded secrets, same code for local and production.
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { SQSClient } = require('@aws-sdk/client-sqs');
const { SecretsManagerClient } = require('@aws-sdk/client-secrets-manager');
const { CloudWatchClient } = require('@aws-sdk/client-cloudwatch');

const region = process.env.AWS_REGION || 'us-east-1';

function getRegion() {
  return region;
}

/**
 * Base client config – uses default credential provider (no explicit keys in code).
 */
function getClientConfig() {
  return { region: getRegion() };
}

let dynamoClient = null;
let sqsClient = null;
let secretsClient = null;
let cloudWatchClient = null;

function getDynamoDBClient() {
  if (!dynamoClient) {
    dynamoClient = new DynamoDBClient(getClientConfig());
  }
  return dynamoClient;
}

function getSQSClient() {
  if (!sqsClient) {
    sqsClient = new SQSClient(getClientConfig());
  }
  return sqsClient;
}

function getSecretsManagerClient() {
  if (!secretsClient) {
    secretsClient = new SecretsManagerClient(getClientConfig());
  }
  return secretsClient;
}

function getCloudWatchClient() {
  if (!cloudWatchClient) {
    cloudWatchClient = new CloudWatchClient(getClientConfig());
  }
  return cloudWatchClient;
}

module.exports = {
  getRegion,
  getClientConfig,
  getDynamoDBClient,
  getSQSClient,
  getSecretsManagerClient,
  getCloudWatchClient,
};
