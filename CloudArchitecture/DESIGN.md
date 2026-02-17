# Azure Playground – Architecture Reference

## Objective

Build a minimal Node.js application that integrates with core Azure services to gain implementation-level familiarity for enterprise discussions.

This is NOT a production system.
This is a structured Azure integration harness.

---

# High-Level Architecture

Client (Postman / Curl)
        ↓
Node.js Express API (Local)
        ↓
---------------------------------------------------
| Azure SQL          | Relational storage         |
| Cosmos DB          | NoSQL + RU model           |
| Service Bus        | Reliable async messaging   |
| Key Vault          | Secret management          |
| Application Insights | Telemetry + tracing     |
| Entra ID           | Authentication / RBAC      |
---------------------------------------------------

---

# Tech Stack

- Node.js
- Express
- @azure/identity
- @azure/keyvault-secrets
- @azure/service-bus
- @azure/cosmos
- mssql (for Azure SQL)
- applicationinsights
- jsonwebtoken + jwks-rsa (for Entra ID validation)

---

# Project Structure

azure-playground/
│
├── src/
│   ├── server.js
│   ├── app.js
│   │
│   ├── config/
│   │   ├── azureIdentity.js
│   │   ├── appInsights.js
│   │
│   ├── routes/
│   │   ├── sql.routes.js
│   │   ├── cosmos.routes.js
│   │   ├── serviceBus.routes.js
│   │   ├── keyVault.routes.js
│   │   ├── health.routes.js
│   │
│   ├── services/
│   │   ├── sql.service.js
│   │   ├── cosmos.service.js
│   │   ├── serviceBus.service.js
│   │   ├── keyVault.service.js
│   │
│   └── middleware/
│       ├── auth.middleware.js
│
├── .env
└── README.md

---

# Identity Strategy

Use DefaultAzureCredential from @azure/identity.

This allows:
- Local development via environment variables
- Service Principal authentication
- Managed Identity when deployed

No hardcoded credentials.

---

# Azure SQL Design

Purpose: Simulate transactional relational workload.

Table: Documents

Columns:
- id (UUID)
- title (string)
- status (string)
- createdAt (datetime)

Routes:
- POST /sql/create
- GET /sql/:id

Important Concepts:
- Connection pooling
- Firewall rules
- Basic DTU vs vCore pricing
- Geo-replication
- ACID transactions

Interview Talking Points:
- Azure SQL is ideal for transactional workloads.
- Supports read replicas and HA configurations.

---

# Cosmos DB Design

Database: playground
Container: items
Partition Key: /userId

Routes:
- POST /cosmos/create
- GET /cosmos/:userId

Implementation Goals:
- Insert document
- Query by partition key
- Log RU charge from response headers
- Handle 429 (throttling) errors

Important Concepts:
- RU/s model
- Hot partitions
- Multi-region writes
- Automatic indexing
- Global distribution

Interview Talking Points:
- Partition key selection is critical.
- RU exhaustion leads to throttling.
- Cosmos is optimized for global scale.

---

# Service Bus Design

Queue Name: playground-queue

Routes:
- POST /queue/send
- POST /queue/receive

Implementation Goals:
- Send JSON message
- Receive in peek-lock mode
- Manually complete message
- Handle dead-letter scenarios

Important Concepts:
- Peek-lock vs receive-and-delete
- Message lock duration
- Dead-letter queue
- Idempotent processing

Interview Talking Points:
- Service Bus provides reliable, ordered messaging.
- Ideal for enterprise workflows and async processing.

---

# Key Vault Design

Secret Name:
PLAYGROUND_SECRET

Route:
- GET /secret

Implementation Goals:
- Fetch secret dynamically
- No secrets in code
- Use DefaultAzureCredential

Important Concepts:
- RBAC vs Access Policies
- Secret rotation
- Managed Identity integration

Interview Talking Points:
- Key Vault eliminates secret sprawl.
- Enables secure CI/CD and production deployments.

---

# Application Insights

Implementation:
- Track request duration
- Track custom events
- Track exceptions

Examples:
- SQL_INSERT_SUCCESS
- COSMOS_QUERY_EXECUTED
- SERVICE_BUS_MESSAGE_SENT

Important Concepts:
- Distributed tracing
- Sampling
- Log Analytics + KQL
- Alerts

Interview Talking Points:
- Instrument both system metrics and business KPIs.
- Observability is part of production readiness.

---

# Entra ID Authentication

Implement JWT validation middleware.

Steps:
1. Register App in Entra ID
2. Configure API permissions
3. Validate:
   - Issuer
   - Audience
   - Signature via JWKS
4. Enforce role-based access

Middleware:
- Authorization: Bearer <token>

Important Concepts:
- OAuth2
- OIDC
- RBAC
- Managed Identity vs Service Principal

Interview Talking Points:
- Entra ID provides centralized identity and Zero Trust access.
- APIs validate tokens and enforce role-based authorization.

---

# Environment Variables

AZURE_TENANT_ID=
AZURE_CLIENT_ID=
AZURE_CLIENT_SECRET=

AZURE_SQL_CONNECTION_STRING=
COSMOS_ENDPOINT=
COSMOS_KEY=
SERVICE_BUS_CONNECTION_STRING=
KEY_VAULT_URL=
APPINSIGHTS_CONNECTION_STRING=

---

# What This Project Demonstrates

✔ Authentication & RBAC  
✔ Secret management  
✔ Relational database integration  
✔ NoSQL + RU model  
✔ Reliable messaging  
✔ Observability  
✔ Enterprise-grade SDK usage  

---

# Senior-Level Narrative After Completion

“I built a Node-based Azure integration harness that connects to Azure SQL, Cosmos DB, Service Bus, Key Vault, and Application Insights using DefaultAzureCredential. I handled RU throttling in Cosmos, implemented peek-lock semantics in Service Bus, instrumented telemetry with App Insights, and enforced JWT validation via Entra ID.”

That sounds like real usage — because it is.

---

# Time Expectation

Setup resources: 3–4 hours  
Implement integrations: 4–6 hours  
Testing & friction learning: 2–3 hours  

Total: 1–2 focused days

---

End of Architecture Reference
