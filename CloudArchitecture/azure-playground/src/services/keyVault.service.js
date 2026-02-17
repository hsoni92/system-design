/**
 * Key Vault Service – Secret management
 *
 * INTERVIEW CONCEPTS:
 * - No secrets in code: Fetch at runtime via Key Vault; use Managed Identity in production.
 * - RBAC vs Access Policies: Key Vault supports both; RBAC (e.g. Key Vault Secrets User) is preferred.
 * - Secret rotation: Rotate in Key Vault; app fetches current value on next request or via caching with TTL.
 * - DefaultAzureCredential: Same code works with env vars (dev) and Managed Identity (Azure).
 */

const { SecretClient } = require('@azure/keyvault-secrets');
const { getCredential } = require('../config/azureIdentity');

const SECRET_NAME = 'PLAYGROUND_SECRET';

let secretClient = null;

function getSecretClient() {
  const url = process.env.KEY_VAULT_URL;
  if (!url) throw new Error('KEY_VAULT_URL is not set');
  if (!secretClient) {
    secretClient = new SecretClient(url, getCredential());
  }
  return secretClient;
}

/**
 * Fetch the secret value from Key Vault. No secrets stored in app config.
 */
async function getSecret() {
  const client = getSecretClient();
  const secret = await client.getSecret(SECRET_NAME);
  return secret.value;
}

module.exports = { getSecret };
