# Azure Playground

A minimal **Node.js + Express** app that integrates with core Azure services. Built for **interview prep** – the code includes comments that map to common architecture and “how would you do X?” discussion points.

---

## What This Demonstrates

| Area | What you get |
|------|----------------|
| **Identity** | `DefaultAzureCredential` – same code for local (env vars) and Azure (Managed Identity) |
| **Secrets** | Key Vault – no secrets in code; fetch at runtime |
| **Relational DB** | Azure SQL – connection pooling, table create/insert/read |
| **NoSQL** | Cosmos DB – partition key, RUs, 429 handling |
| **Messaging** | Service Bus – send, peek-lock receive, complete/abandon |
| **Observability** | Application Insights – custom events, exceptions |
| **Auth** | Entra ID – JWT validation via JWKS (optional) |

---

## Quick Start

1. **Copy env and fill in values (see below):**
   ```bash
   cp .env.example .env
   ```

2. **Install and run:**
   ```bash
   npm install
   npm start
   ```

3. **Try endpoints (with `SKIP_AUTH=true` for local dev):**
   - `GET http://localhost:3000/health`
   - `POST http://localhost:3000/sql/create`  body: `{ "title": "My doc" }`
   - `GET http://localhost:3000/sql/:id`
   - `POST http://localhost:3000/cosmos/create`  body: `{ "userId": "user1", "name": "Item" }`
   - `GET http://localhost:3000/cosmos/:userId`
   - `POST http://localhost:3000/queue/send`  body: `{ "task": "demo" }`
   - `POST http://localhost:3000/queue/receive?complete=true`
   - `GET http://localhost:3000/secret`

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `AZURE_TENANT_ID`, `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET` | For `DefaultAzureCredential` (e.g. Key Vault) |
| `AZURE_SQL_CONNECTION_STRING` | Azure SQL connection string |
| `COSMOS_ENDPOINT`, `COSMOS_KEY` | Cosmos DB |
| `SERVICE_BUS_CONNECTION_STRING` | Service Bus namespace |
| `KEY_VAULT_URL` | Key Vault URL (e.g. `https://my-vault.vault.azure.net/`) |
| `APPINSIGHTS_CONNECTION_STRING` | Application Insights |
| `ENTRA_ISSUER`, `ENTRA_AUDIENCE`, `ENTRA_JWKS_URI` | JWT validation (optional) |
| `SKIP_AUTH` | Set to `true` to disable JWT auth (local only) |

Create a secret in Key Vault named **PLAYGROUND_SECRET**. Create a Service Bus queue named **playground-queue**. Azure SQL table **Documents** is created on first use if it doesn’t exist.

---

## Project Layout (for interview narrative)

```
src/
├── server.js           # Entry point
├── app.js              # Express app, route wiring, global error handler
├── config/
│   ├── azureIdentity.js   # DefaultAzureCredential
│   └── appInsights.js     # Telemetry init + trackEvent / trackException
├── routes/             # HTTP handlers (sql, cosmos, queue, secret, health)
├── services/            # Azure SDK usage (SQL, Cosmos, Service Bus, Key Vault)
└── middleware/
    └── auth.middleware.js # Entra ID JWT validation (issuer, audience, JWKS)
```

---

## Interview Talking Points (from DESIGN.md)

- **Azure SQL:** Transactional workloads, connection pooling, DTU vs vCore, geo-replication / read replicas.
- **Cosmos DB:** Partition key choice, RU/s and throttling (429), global distribution, automatic indexing.
- **Service Bus:** Peek-lock vs receive-and-delete, lock duration, dead-letter queue, idempotent processing.
- **Key Vault:** No secret sprawl, RBAC vs access policies, rotation, Managed Identity.
- **Application Insights:** Request duration, custom events, exceptions, distributed tracing, KQL, alerts.
- **Entra ID:** Centralized identity, Zero Trust, token validation, RBAC.

**One-liner:**  
*“I built a Node-based Azure integration harness that connects to Azure SQL, Cosmos DB, Service Bus, Key Vault, and Application Insights using DefaultAzureCredential. I handled RU throttling in Cosmos, implemented peek-lock semantics in Service Bus, instrumented telemetry with App Insights, and enforced JWT validation via Entra ID.”*

---

## Time Expectation (from design)

- Setup Azure resources: 3–4 hours  
- Implement integrations: 4–6 hours  
- Testing: 2–3 hours  

**Total:** about 1–2 focused days.

---

## License / Use

For learning and interview prep only. Not intended as a production template.
