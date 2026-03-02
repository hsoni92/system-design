# AWS Playground

A minimal **Node.js + Express** app that integrates with core AWS services. Built for **interview prep** – the code includes comments that map to common architecture and "how would you do X?" discussion points.

---

## What This Demonstrates

| Area | What you get |
|------|----------------|
| **Identity** | Default credential chain – same code for local (env vars) and AWS (IAM role on EC2/ECS/Lambda) |
| **Secrets** | Secrets Manager – no secrets in code; fetch at runtime |
| **Relational DB** | RDS (PostgreSQL) – connection pooling, table create/insert/read |
| **NoSQL** | DynamoDB – partition key, consumed capacity, throttling (429) |
| **Messaging** | SQS – send, receive, delete message |
| **Observability** | CloudWatch – custom metrics (optional) |
| **Auth** | Cognito – JWT validation via JWKS (optional) |

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
   - `POST http://localhost:3000/rds/create`  body: `{ "title": "My doc" }`
   - `GET http://localhost:3000/rds/:id`
   - `POST http://localhost:3000/dynamodb/create`  body: `{ "userId": "user1", "name": "Item" }`
   - `GET http://localhost:3000/dynamodb/:userId`
   - `POST http://localhost:3000/queue/send`  body: `{ "task": "demo" }`
   - `POST http://localhost:3000/queue/receive?delete=true`
   - `GET http://localhost:3000/secret`

---

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `AWS_REGION` | AWS region for SDK clients |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | RDS PostgreSQL connection |
| `DYNAMODB_TABLE` | DynamoDB table name (partition key: userId) |
| `SQS_QUEUE_URL` | SQS queue URL |
| `SECRETS_MANAGER_SECRET_NAME` | Secrets Manager secret name (e.g. PLAYGROUND_SECRET) |
| `CLOUDWATCH_NAMESPACE` | Optional; custom metrics namespace |
| `COGNITO_ISSUER`, `COGNITO_AUDIENCE`, `COGNITO_JWKS_URI` | JWT validation (optional) |
| `SKIP_AUTH` | Set to `true` to disable JWT auth (local only) |

Create a secret in Secrets Manager with the name you set for `SECRETS_MANAGER_SECRET_NAME`. Create an SQS queue and set `SQS_QUEUE_URL`. Create a DynamoDB table with partition key `userId` (string). RDS table **Documents** is created on first use if it doesn't exist.

---

## Project Layout (for interview narrative)

```
src/
├── server.js           # Entry point
├── app.js              # Express app, route wiring, global error handler
├── config/
│   ├── awsConfig.js    # Region + SDK client helpers
│   └── cloudWatch.js   # Optional telemetry (trackEvent / trackException)
├── routes/             # HTTP handlers (rds, dynamodb, queue, secret, health)
├── services/           # AWS SDK usage (RDS/pg, DynamoDB, SQS, Secrets Manager)
└── middleware/
    └── auth.middleware.js  # Cognito JWT validation (issuer, audience, JWKS)
```

---

## Interview Talking Points

- **RDS (PostgreSQL):** Transactional workloads, connection pooling, read replicas, Multi-AZ failover.
- **DynamoDB:** Partition key choice, provisioned vs on-demand capacity, consumed capacity, throttling (429), GSIs.
- **SQS:** At-least-once delivery, visibility timeout, dead-letter queues, idempotent processing.
- **Secrets Manager:** No secret sprawl, rotation, IAM policies, default credential chain.
- **CloudWatch:** Custom metrics, alarms, log groups, X-Ray for tracing.
- **Cognito:** User pools, JWT validation, JWKS, app client vs identity pool.

**One-liner:**  
*"I built a Node-based AWS integration harness that connects to RDS (PostgreSQL), DynamoDB, SQS, and Secrets Manager using the default credential chain. I exposed consumed capacity in DynamoDB responses, implemented send/receive/delete with SQS, optional CloudWatch metrics, and JWT validation via Cognito."*

---

## License / Use

For learning and interview prep only. Not intended as a production template.
