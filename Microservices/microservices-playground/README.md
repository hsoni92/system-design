# Microservices Playground

A minimal Node.js microservices codebase to see **bounded contexts**, **database-per-service** (in-memory here), and **sync service-to-service** calls in practice.

## Layout

```
microservices-playground/
├── gateway/           # Single entry: routes /users, /orders, /events to respective services
├── user-service/      # Owns user data (bounded context: User)
├── order-service/     # Owns order data; validates user via user-service; emits OrderPlaced to audit
├── audit-service/     # Subscribes to events (OrderPlaced); stores event log (choreography-style)
└── package.json       # Run all with npm start
```

## Run

```bash
npm install
npm start
```

Then:

- **Create a user:** `curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"name":"Alice"}'
- **Create an order (needs valid userId):** `curl -X POST http://localhost:3000/orders -H "Content-Type: application/json" -d '{"userId":"1","product":"Widget","quantity":2}'
- **List users:** `curl http://localhost:3000/users`
- **List orders:** `curl http://localhost:3000/orders`
- **List events (audit log):** `curl http://localhost:3000/events`

Ports: Gateway `3000`, User service `3001`, Order service `3002`, Audit service `3003`. The gateway proxies; clients only talk to `3000`.

## How services talk

Microservices communicate in two ways:

- **Sync (request/response):** HTTP or gRPC — one service calls another and waits. This repo uses sync: Order service calls User service over HTTP and waits for the response.
- **Async (events/messages):** Publish to a broker (Redis, RabbitMQ, Kafka); other services subscribe. No waiting; good for "something happened" and eventual consistency. Here we use a choreography-style fire-and-forget HTTP POST to an audit service (no broker).

## Orchestration vs choreography

- **Orchestration:** One service drives the flow by calling other services. Current behavior: Order → User (validate) → Order (create). Order service is the orchestrator.
- **Choreography:** Services react to events; no single caller. Implemented here as: Order emits an event (fire-and-forget POST to audit-service) after creating an order; Audit service is a subscriber that stores events.

## What this shows

| Concept | Where in code |
|--------|----------------|
| API Gateway | `gateway/index.js` — single entry, routes by path |
| Bounded context / DB per service | Each service has its own in-memory store; no cross-service DB access |
| Sync service-to-service | Order service calls User service (HTTP) to validate `userId` before creating order |
| Orchestration | Order service orchestrates by calling User service before creating an order |
| Choreography-style event | Order service fire-and-forget POSTs `OrderPlaced` to audit-service; Audit stores events |
| Owner writes | Only User service writes users; only Order service writes orders; only Audit service writes events |

No message broker — audit "events" are HTTP POSTs. Add Redis/Rabbit for true pub/sub if you want multiple subscribers.
