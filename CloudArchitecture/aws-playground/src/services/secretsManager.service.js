/**
 * Secrets Manager Service – Secret management
 *
 * INTERVIEW CONCEPTS:
 * - No secrets in code: Fetch at runtime via Secrets Manager; use IAM role in production.
 * - Rotation: Secrets Manager supports automatic rotation (e.g. RDS credentials).
 * - IAM policies: Grant GetSecretValue on the secret to the app role/instance profile.
 * - Default credential chain: Same code works with env vars (dev) and IAM role (EC2/ECS/Lambda).
 */

const { GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const { getSecretsManagerClient } = require('../config/awsConfig');

const SECRET_NAME = process.env.SECRETS_MANAGER_SECRET_NAME || 'PLAYGROUND_SECRET';

function getClient() {
  return getSecretsManagerClient();
}

/**
 * Fetch the secret value from Secrets Manager. No secrets stored in app config.
 */
async function getSecret() {
  const client = getClient();
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: SECRET_NAME })
  );
  if (response.SecretString) {
    return response.SecretString;
  }
  if (response.SecretBinary) {
    return Buffer.from(response.SecretBinary).toString('utf-8');
  }
  throw new Error('Secret has no string or binary value');
}

module.exports = { getSecret };
