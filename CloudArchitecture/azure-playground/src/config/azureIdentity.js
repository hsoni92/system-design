/**
 * Azure Identity – DefaultAzureCredential
 *
 * INTERVIEW: "How does your app authenticate to Azure?"
 * We use DefaultAzureCredential, which tries multiple auth methods in order:
 * 1. Environment variables (AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID) – dev/CI
 * 2. Managed Identity – when running in Azure (VM, App Service, AKS)
 * 3. Azure CLI / Visual Studio / etc.
 *
 * Benefits: No hardcoded secrets, same code for local and production.
 */

const { DefaultAzureCredential } = require('@azure/identity');

// Single shared credential instance – reuse across Key Vault, etc.
let credential = null;

function getCredential() {
  if (!credential) {
    credential = new DefaultAzureCredential();
  }
  return credential;
}

module.exports = { getCredential };
